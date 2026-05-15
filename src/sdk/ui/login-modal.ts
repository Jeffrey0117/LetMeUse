/**
 * Login / Register / Forgot Password modal
 */

import type { LetMeUseUser, Locale } from '../types'
import type { AuthManager } from '../auth'
import type { ApiDeps } from '../api'
import { apiPost } from '../api'
import { ThemeManager, buildHostThemeVars, getThemeColors } from '../theme'
import { buildModalStyles } from './styles'

export interface LoginModalDeps {
  appId: string
  accent: string
  locale: Locale
  auth: AuthManager
  theme: ThemeManager
  apiDeps: ApiDeps
  t: (key: string) => string
}

export function createModal(deps: LoginModalDeps, initialMode: 'login' | 'register' | 'forgot'): void {
  const { appId, accent, locale, auth, theme, apiDeps, t } = deps

    const existing = document.getElementById('lmu-auth-host')
    if (existing) {
      theme.unregisterHost(existing)
      existing.remove()
    }

    let currentMode = initialMode
    let errorMsg = ''
    let successMsg = ''
    let loading = false

    // Create host element + shadow root for style isolation
    const host = document.createElement('div')
    host.id = 'lmu-auth-host'
    host.style.cssText = 'position:fixed;inset:0;z-index:99999;'
    const shadow = host.attachShadow({ mode: 'closed' })

    // Register this host for dynamic theme updates
    theme.registerHost(host)

    // Build styles using current theme
    const hostThemeVars = buildHostThemeVars(getThemeColors(theme.isDark))
    const MODAL_STYLES = buildModalStyles(accent, hostThemeVars)

    function removeHost(): void {
      theme.unregisterHost(host)
      host.remove()
    }

    // Backdrop click — attached ONCE, outside render()
    shadow.addEventListener('click', (e) => {
      const card = shadow.querySelector('.lmu-card')
      // Only close if click target is still in the shadow DOM (not a detached element from re-render)
      if (card && !card.contains(e.target as Node) && shadow.contains(e.target as Node)) {
        removeHost()
      }
    })

    function render(): void {
      const isLogin = currentMode === 'login'
      const isForgot = currentMode === 'forgot'

      // Forgot password view
      if (isForgot) {
        shadow.innerHTML = `
          <style>${MODAL_STYLES}</style>
          <div class="lmu-card">
            <button class="lmu-close" id="lmu-close-btn">&times;</button>
            <div class="lmu-title">${t('forgot.title')}</div>
            ${successMsg ? `<div class="lmu-success">${successMsg}</div>` : ''}
            ${errorMsg ? `<div class="lmu-error">${errorMsg}</div>` : ''}
            ${!successMsg ? `
              <p style="font-size:14px;color:var(--lmu-subtext);margin:0 0 18px 0;text-align:center;">${t('forgot.description')}</p>
              <form id="lmu-forgot-form">
                <div class="lmu-field">
                  <label class="lmu-label">${t('label.email')}</label>
                  <input class="lmu-input" type="email" name="email" required />
                </div>
                <button class="lmu-btn" type="submit" ${loading ? 'disabled' : ''}>
                  ${loading ? t('msg.loading') : t('forgot.send')}
                </button>
              </form>
            ` : ''}
            <div class="lmu-switch">
              <a id="lmu-back-login">${t('forgot.backToLogin')}</a>
            </div>
          </div>
        `
        theme.applyToHost(host)
        shadow.getElementById('lmu-close-btn')?.addEventListener('click', () => removeHost())
        shadow.getElementById('lmu-back-login')?.addEventListener('click', () => {
          currentMode = 'login'
          errorMsg = ''
          successMsg = ''
          render()
        })
        const forgotForm = shadow.getElementById('lmu-forgot-form') as HTMLFormElement | null
        forgotForm?.addEventListener('submit', async (e) => {
          e.preventDefault()
          const fd = new FormData(forgotForm)
          const email = fd.get('email') as string
          loading = true
          errorMsg = ''
          render()
          try {
            await apiPost(apiDeps, '/api/auth/forgot-password', { appId, email })
            loading = false
            successMsg = t('forgot.sent')
            render()
          } catch (err) {
            errorMsg = err instanceof Error ? err.message : t('error.generic')
            loading = false
            render()
          }
        })
        return
      }

      // Login / Register view
      shadow.innerHTML = `
        <style>${MODAL_STYLES}</style>
        <div class="lmu-card">
          <button class="lmu-close" id="lmu-close-btn">&times;</button>
          <div class="lmu-title">${isLogin ? t('title.login') : t('title.register')}</div>
          ${errorMsg ? `<div class="lmu-error">${errorMsg}</div>` : ''}
          <form id="lmu-auth-form">
            ${!isLogin ? `
              <div class="lmu-field">
                <label class="lmu-label">${t('label.displayName')}</label>
                <input class="lmu-input" type="text" name="displayName" required />
              </div>
            ` : ''}
            <div class="lmu-field">
              <label class="lmu-label">${t('label.email')}</label>
              <input class="lmu-input" type="email" name="email" required />
            </div>
            <div class="lmu-field">
              <label class="lmu-label">${t('label.password')}</label>
              <input class="lmu-input" type="password" name="password" id="lmu-password-input" required minlength="${isLogin ? 1 : 8}" />
            </div>
            ${isLogin ? `<div style="text-align:right;margin:-10px 0 8px 0;"><a id="lmu-forgot-pw" style="font-size:12px;color:${accent};cursor:pointer;text-decoration:none;">${t('link.forgotPassword')}</a></div>` : ''}
            <button class="lmu-btn" type="submit" ${loading ? 'disabled' : ''}>
              ${loading ? t('msg.loading') : (isLogin ? t('btn.login') : t('btn.register'))}
            </button>
          </form>
          ${auth.availableProviders.length > 0 ? `
            <div class="lmu-divider">${t('oauth.or')}</div>
            <div class="lmu-oauth-row">
              ${auth.availableProviders.includes('google') ? `
                <button class="lmu-oauth-btn" id="lmu-oauth-google">
                  <svg viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  ${t('oauth.google')}
                </button>
              ` : ''}
              ${auth.availableProviders.includes('github') ? `
                <button class="lmu-oauth-btn" id="lmu-oauth-github">
                  <svg viewBox="0 0 24 24" fill="var(--lmu-text)"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/></svg>
                  ${t('oauth.github')}
                </button>
              ` : ''}
            </div>
          ` : ''}
          <div class="lmu-switch">
            <a id="lmu-switch-mode">
              ${isLogin ? t('switch.toRegister') : t('switch.toLogin')}
            </a>
          </div>
        </div>
      `

      // Apply current theme CSS variables to the host element
      theme.applyToHost(host)

      // Bind events
      shadow.getElementById('lmu-close-btn')?.addEventListener('click', () => removeHost())

      shadow.getElementById('lmu-oauth-google')?.addEventListener('click', () => auth.startOAuth('google'))
      shadow.getElementById('lmu-oauth-github')?.addEventListener('click', () => auth.startOAuth('github'))
      shadow.getElementById('lmu-forgot-pw')?.addEventListener('click', () => {
        currentMode = 'forgot'
        errorMsg = ''
        successMsg = ''
        render()
      })

      shadow.getElementById('lmu-switch-mode')?.addEventListener('click', () => {
        currentMode = isLogin ? 'register' : 'login'
        errorMsg = ''
        render()
      })

      const form = shadow.getElementById('lmu-auth-form') as HTMLFormElement | null
      form?.addEventListener('submit', async (e) => {
        e.preventDefault()
        if (loading) return

        // Read form values BEFORE re-render (render replaces DOM)
        const formData = new FormData(form)
        const email = formData.get('email') as string
        const password = formData.get('password') as string

        loading = true
        errorMsg = ''
        render()

        // Client-side password length check (Shadow DOM can't show native tooltips)
        if (!isLogin && password.length < 8) {
          errorMsg = t('error.passwordTooShort')
          loading = false
          render()
          return
        }

        try {
          if (isLogin) {
            const data = (await apiPost(apiDeps, '/api/auth/login', {
              appId,
              email,
              password,
            })) as { user: LetMeUseUser; accessToken: string; refreshToken: string }

            auth.storeTokens(data.accessToken, data.refreshToken)
            auth.currentUser = data.user
            auth.scheduleRefresh()
            auth.fireCallbacks('login')
            removeHost()
          } else {
            const displayName = formData.get('displayName') as string
            const data = (await apiPost(apiDeps, '/api/auth/register', {
              appId,
              email,
              password,
              displayName,
            })) as { user: LetMeUseUser; accessToken: string; refreshToken: string }

            auth.storeTokens(data.accessToken, data.refreshToken)
            auth.currentUser = data.user
            auth.scheduleRefresh()
            auth.fireCallbacks('login')
            removeHost()
          }
        } catch (err) {
          errorMsg = err instanceof Error ? err.message : t('error.generic')
          loading = false
          render()
        }
      })
    }

    render()
    document.body.appendChild(host)

    // Focus first input
    setTimeout(() => {
      const firstInput = shadow.querySelector('input') as HTMLInputElement | null
      firstInput?.focus()
    }, 50)
}
