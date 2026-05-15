/**
 * Profile settings modal (account settings, avatar, password change)
 */

import type { LetMeUseUser, Locale } from '../types'
import type { AuthManager } from '../auth'
import type { ApiDeps } from '../api'
import { apiPost, apiPutAuth, apiPostAuth } from '../api'
import { ThemeManager, buildHostThemeVars, getThemeColors } from '../theme'
import { buildProfileModalStyles } from './styles'
import { createModal } from './login-modal'
import type { LoginModalDeps } from './login-modal'

export interface ProfileModalDeps {
  appId: string
  accent: string
  locale: Locale
  baseUrl: string
  auth: AuthManager
  theme: ThemeManager
  apiDeps: ApiDeps
  t: (key: string) => string
  getLoginModalDeps: () => LoginModalDeps
  onLogout: () => void
}

export function createProfileModal(deps: ProfileModalDeps): void {
  const { appId, accent, locale, baseUrl, auth, theme, apiDeps, t, getLoginModalDeps, onLogout } = deps

    if (!auth.currentUser) {
      createModal(getLoginModalDeps(), 'login')
      return
    }

    const existing = document.getElementById('lmu-profile-host')
    if (existing) {
      theme.unregisterHost(existing)
      existing.remove()
    }

    const storedToken = auth.getStoredAccessToken()
    if (!storedToken) return
    const token: string = storedToken

    let editingName = false
    let nameValue = auth.currentUser.displayName
    let savingName = false
    let nameSaved = false

    let showPwForm = false
    let pwError = ''
    let pwSuccess = ''
    let savingPw = false

    let uploadingAvatar = false
    let avatarSuccess = ''
    let verificationSent = false

    const host = document.createElement('div')
    host.id = 'lmu-profile-host'
    host.style.cssText = 'position:fixed;inset:0;z-index:99999;'
    const shadow = host.attachShadow({ mode: 'closed' })

    theme.registerHost(host)

    // Build styles using current theme
    const hostThemeVars = buildHostThemeVars(getThemeColors(theme.isDark))
    const PROFILE_MODAL_STYLES = buildProfileModalStyles(accent, hostThemeVars)

    function removeHost(): void {
      theme.unregisterHost(host)
      host.remove()
    }

    shadow.addEventListener('click', (e) => {
      const card = shadow.querySelector('.lmu-card')
      if (card && !card.contains(e.target as Node) && shadow.contains(e.target as Node)) {
        removeHost()
      }
    })

    function render(): void {
      if (!auth.currentUser) return
      const initial = auth.currentUser.displayName?.charAt(0)?.toUpperCase() ?? '?'

      const avatarSrc = auth.currentUser.avatar
        ? (auth.currentUser.avatar.startsWith('http') ? auth.currentUser.avatar : `${baseUrl}${auth.currentUser.avatar}`)
        : ''
      const isVerified = auth.currentUser.emailVerified === true

      shadow.innerHTML = `
        <style>${PROFILE_MODAL_STYLES}</style>
        <div class="lmu-card">
          <button class="lmu-close" id="lmu-close">&times;</button>
          <div class="lmu-title">${t('profile.title')}</div>

          ${avatarSuccess ? `<div class="lmu-success" style="margin-bottom:16px;">${avatarSuccess}</div>` : ''}

          <div class="lmu-avatar-area">
            <div class="lmu-avatar-circle" id="lmu-avatar-click" title="${t('profile.avatar')}">
              ${avatarSrc ? `<img src="${avatarSrc}" alt="" />` : initial}
              <div class="lmu-avatar-overlay">
                <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
              </div>
              ${uploadingAvatar ? `<div class="lmu-avatar-overlay" style="opacity:1;"><span style="font-size:11px;color:#fff;">${t('profile.avatarUploading')}</span></div>` : ''}
            </div>
            <input type="file" id="lmu-avatar-input" accept="image/jpeg,image/png,image/gif,image/webp" style="display:none;" />
            <div class="lmu-avatar-info">
              <p class="lmu-avatar-name">${auth.currentUser.displayName}</p>
              <div style="display:flex;align-items:center;gap:8px;margin-top:2px;">
                <p class="lmu-avatar-email" style="margin:0;">${auth.currentUser.email}</p>
                ${isVerified
                  ? `<span class="lmu-badge lmu-badge-verified">${t('profile.emailVerified')}</span>`
                  : `<span class="lmu-badge lmu-badge-unverified">${t('profile.emailNotVerified')}</span>`}
              </div>
              ${!isVerified && !verificationSent ? `<a id="lmu-resend-verify" style="font-size:11px;color:${accent};cursor:pointer;margin-top:4px;display:inline-block;">${t('profile.resendVerification')}</a>` : ''}
              ${verificationSent ? `<span style="font-size:11px;color:#059669;margin-top:4px;display:inline-block;">${t('profile.verificationSent')}</span>` : ''}
            </div>
          </div>

          <!-- Display Name Section -->
          <div class="lmu-section">
            <div class="lmu-section-title">${t('profile.displayName')}</div>
            ${nameSaved ? `<div class="lmu-success">${t('profile.saved')}</div>` : ''}
            ${editingName ? `
              <div class="lmu-field">
                <input class="lmu-input" type="text" id="lmu-name-input" value="${nameValue.replace(/"/g, '&quot;')}" />
              </div>
              <div class="lmu-row">
                <button class="lmu-btn-sm lmu-btn-primary" id="lmu-name-save" ${savingName ? 'disabled' : ''}>
                  ${savingName ? t('profile.saving') : t('profile.save')}
                </button>
                <button class="lmu-btn-sm lmu-btn-secondary" id="lmu-name-cancel">${locale === 'zh' ? '取消' : 'Cancel'}</button>
              </div>
            ` : `
              <div style="display:flex;align-items:center;gap:10px;">
                <span style="font-size:15px;">${auth.currentUser.displayName}</span>
                <button class="lmu-btn-sm lmu-btn-secondary" id="lmu-name-edit" style="padding:0 12px;height:32px;font-size:12px;">
                  ${locale === 'zh' ? '編輯' : 'Edit'}
                </button>
              </div>
            `}
          </div>

          <!-- Change Password Section -->
          <div class="lmu-section">
            <div class="lmu-section-title">${t('profile.changePassword')}</div>
            ${pwSuccess ? `<div class="lmu-success">${pwSuccess}</div>` : ''}
            ${pwError ? `<div class="lmu-error">${pwError}</div>` : ''}
            ${showPwForm ? `
              <form id="lmu-pw-form">
                <div class="lmu-field">
                  <label class="lmu-label">${t('profile.currentPassword')}</label>
                  <input class="lmu-input" type="password" name="currentPassword" required />
                </div>
                <div class="lmu-field">
                  <label class="lmu-label">${t('profile.newPassword')}</label>
                  <input class="lmu-input" type="password" name="newPassword" required minlength="8" />
                </div>
                <div class="lmu-field">
                  <label class="lmu-label">${t('profile.confirmPassword')}</label>
                  <input class="lmu-input" type="password" name="confirmPassword" required minlength="8" />
                </div>
                <div class="lmu-row">
                  <button type="submit" class="lmu-btn-sm lmu-btn-primary" ${savingPw ? 'disabled' : ''}>
                    ${savingPw ? t('profile.saving') : t('profile.save')}
                  </button>
                  <button type="button" class="lmu-btn-sm lmu-btn-secondary" id="lmu-pw-cancel">${locale === 'zh' ? '取消' : 'Cancel'}</button>
                </div>
              </form>
            ` : `
              <button class="lmu-btn-sm lmu-btn-secondary" id="lmu-pw-show">
                ${locale === 'zh' ? '變更密碼' : 'Change'}
              </button>
            `}
          </div>

          <!-- Logout -->
          <div class="lmu-section">
            <button class="lmu-btn-danger" id="lmu-logout">${t('profile.logout')}</button>
          </div>
        </div>
      `

      theme.applyToHost(host)

      // Bind events
      shadow.getElementById('lmu-close')?.addEventListener('click', () => removeHost())

      // Avatar upload
      const avatarBtn = shadow.getElementById('lmu-avatar-click')
      const avatarInput = shadow.getElementById('lmu-avatar-input') as HTMLInputElement | null
      avatarBtn?.addEventListener('click', () => avatarInput?.click())
      avatarInput?.addEventListener('change', async () => {
        const file = avatarInput.files?.[0]
        if (!file || !token) return
        if (file.size > 2 * 1024 * 1024) {
          avatarSuccess = ''
          render()
          return
        }
        uploadingAvatar = true
        render()
        try {
          const fd = new FormData()
          fd.append('file', file)
          const res = await fetch(`${baseUrl}/api/auth/avatar`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: fd,
          })
          const json = await res.json()
          if (!res.ok) throw new Error((json as { error?: string }).error ?? t('error.generic'))
          const data = (json as { data?: { user?: LetMeUseUser } }).data
          if (data?.user && auth.currentUser) {
            auth.currentUser = { ...auth.currentUser, avatar: data.user.avatar }
            auth.fireCallbacks('login')
          }
          uploadingAvatar = false
          avatarSuccess = t('profile.avatarUpdated')
          render()
          setTimeout(() => { avatarSuccess = ''; render() }, 2000)
        } catch {
          uploadingAvatar = false
          render()
        }
      })

      // Resend email verification
      shadow.getElementById('lmu-resend-verify')?.addEventListener('click', async () => {
        if (!token) return
        try {
          await apiPost(apiDeps, '/api/auth/register', { appId, resendVerification: true })
        } catch {
          // best effort
        }
        verificationSent = true
        render()
        setTimeout(() => { verificationSent = false }, 5000)
      })

      // Name editing
      shadow.getElementById('lmu-name-edit')?.addEventListener('click', () => {
        editingName = true
        nameValue = auth.currentUser?.displayName ?? ''
        nameSaved = false
        render()
        const inp = shadow.getElementById('lmu-name-input') as HTMLInputElement | null
        inp?.focus()
      })
      shadow.getElementById('lmu-name-cancel')?.addEventListener('click', () => {
        editingName = false
        render()
      })
      shadow.getElementById('lmu-name-save')?.addEventListener('click', async () => {
        const inp = shadow.getElementById('lmu-name-input') as HTMLInputElement | null
        const val = inp?.value?.trim()
        if (!val || !token) return
        savingName = true
        render()
        try {
          await apiPutAuth(apiDeps, '/api/auth/profile', { displayName: val }, token)
          if (auth.currentUser) {
            auth.currentUser = { ...auth.currentUser, displayName: val }
            auth.fireCallbacks('login')
          }
          editingName = false
          nameSaved = true
          savingName = false
          render()
          setTimeout(() => { nameSaved = false; render() }, 2000)
        } catch (err) {
          savingName = false
          render()
        }
      })

      // Password
      shadow.getElementById('lmu-pw-show')?.addEventListener('click', () => {
        showPwForm = true
        pwError = ''
        pwSuccess = ''
        render()
      })
      shadow.getElementById('lmu-pw-cancel')?.addEventListener('click', () => {
        showPwForm = false
        pwError = ''
        render()
      })
      const pwForm = shadow.getElementById('lmu-pw-form') as HTMLFormElement | null
      pwForm?.addEventListener('submit', async (e) => {
        e.preventDefault()
        const fd = new FormData(pwForm)
        const currentPassword = fd.get('currentPassword') as string
        const newPassword = fd.get('newPassword') as string
        const confirmPassword = fd.get('confirmPassword') as string

        if (newPassword !== confirmPassword) {
          pwError = t('profile.passwordMismatch')
          render()
          return
        }
        if (newPassword.length < 8) {
          pwError = t('error.passwordTooShort')
          render()
          return
        }

        savingPw = true
        pwError = ''
        render()

        try {
          await apiPostAuth(apiDeps, '/api/auth/change-password', { currentPassword, newPassword }, token)
          showPwForm = false
          savingPw = false
          pwSuccess = t('profile.passwordChanged')
          render()
          setTimeout(() => { pwSuccess = ''; render() }, 3000)
        } catch (err) {
          pwError = err instanceof Error ? err.message : t('error.generic')
          savingPw = false
          render()
        }
      })

      // Logout
      shadow.getElementById('lmu-logout')?.addEventListener('click', () => {
        removeHost()
        onLogout()
      })
    }

    render()
    document.body.appendChild(host)
}
