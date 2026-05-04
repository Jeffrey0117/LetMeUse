/**
 * Avatar button + dropdown widget and Profile card widget
 */

import type { Locale } from '../types'
import type { AuthManager } from '../auth'
import { ThemeManager, buildHostThemeVars, getThemeColors } from '../theme'
import { buildProfileCardStyles, buildAvatarStyles } from './styles'
import { createModal } from './login-modal'
import type { LoginModalDeps } from './login-modal'
import { createProfileModal } from './profile-modal'
import type { ProfileModalDeps } from './profile-modal'

export interface WidgetDeps {
  accent: string
  locale: Locale
  auth: AuthManager
  theme: ThemeManager
  t: (key: string) => string
  getLoginModalDeps: () => LoginModalDeps
  getProfileModalDeps: () => ProfileModalDeps
  onLogout: () => void
  onAuthChange: (cb: (user: unknown) => void) => () => void
}

export function renderProfileCard(deps: WidgetDeps, target: string | HTMLElement): () => void {
  const { accent, auth, theme, t, getLoginModalDeps, getProfileModalDeps, onLogout, onAuthChange } = deps

    // Build styles
    const hostThemeVars = buildHostThemeVars(getThemeColors(theme.isDark))
    const PROFILE_CARD_STYLES = buildProfileCardStyles(accent, hostThemeVars)

    const el = typeof target === 'string' ? document.querySelector(target) : target
    if (!el) return () => {}

    const host = document.createElement('div')
    host.className = 'lmu-profile-card-host'
    const shadow = host.attachShadow({ mode: 'closed' })

    // Register for dynamic theme updates
    theme.registerHost(host)

    function render() {
      if (!auth.currentUser) {
        shadow.innerHTML = `
          <style>${PROFILE_CARD_STYLES}</style>
          <div class="lmu-profile-card">
            <div class="lmu-profile-login">
              <a id="lmu-pc-login">${t('btn.login')}</a>
            </div>
          </div>
        `
        theme.applyToHost(host)
        shadow.getElementById('lmu-pc-login')?.addEventListener('click', () => {
          createModal(getLoginModalDeps(), 'login')
        })
        return
      }

      const initial = auth.currentUser.displayName?.charAt(0)?.toUpperCase() ?? '?'
      shadow.innerHTML = `
        <style>${PROFILE_CARD_STYLES}</style>
        <div class="lmu-profile-card">
          <div class="lmu-profile-header">
            <div class="lmu-profile-avatar">
              ${auth.currentUser.avatar ? `<img src="${auth.currentUser.avatar}" alt="" />` : initial}
            </div>
            <div class="lmu-profile-info">
              <p class="lmu-profile-name">${auth.currentUser.displayName}</p>
              <p class="lmu-profile-email">${auth.currentUser.email}</p>
            </div>
          </div>
          <div class="lmu-profile-role">${auth.currentUser.role}</div>
          <div class="lmu-profile-actions">
            <button class="lmu-profile-btn primary" id="lmu-pc-edit">Edit Profile</button>
            <button class="lmu-profile-btn" id="lmu-pc-logout">Logout</button>
          </div>
        </div>
      `
      theme.applyToHost(host)
      shadow.getElementById('lmu-pc-logout')?.addEventListener('click', () => {
        onLogout()
      })
      shadow.getElementById('lmu-pc-edit')?.addEventListener('click', () => {
        createProfileModal(getProfileModalDeps())
      })
    }

    el.appendChild(host)
    render()

    // Re-render on auth changes
    const unsub = onAuthChange(() => render())

    return () => {
      unsub()
      theme.unregisterHost(host)
      host.remove()
    }
}

export function renderAvatar(deps: WidgetDeps, target: string | HTMLElement): () => void {
  const { accent, auth, theme, t, getLoginModalDeps, getProfileModalDeps, onLogout, onAuthChange } = deps

    // Build styles
    const hostThemeVars = buildHostThemeVars(getThemeColors(theme.isDark))
    const AVATAR_STYLES = buildAvatarStyles(accent, hostThemeVars)

    const el = typeof target === 'string' ? document.querySelector(target) : target
    if (!el) return () => {}

    const host = document.createElement('div')
    host.className = 'lmu-avatar-host'
    const shadow = host.attachShadow({ mode: 'closed' })

    // Register for dynamic theme updates
    theme.registerHost(host)

    let dropdownOpen = false

    function render() {
      if (!auth.currentUser) {
        shadow.innerHTML = `
          <style>${AVATAR_STYLES}</style>
          <button class="lmu-avatar-login" id="lmu-av-login" title="${t('btn.login')}">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </button>
        `
        theme.applyToHost(host)
        shadow.getElementById('lmu-av-login')?.addEventListener('click', () => {
          createModal(getLoginModalDeps(), 'login')
        })
        return
      }

      const initial = auth.currentUser.displayName?.charAt(0)?.toUpperCase() ?? '?'
      shadow.innerHTML = `
        <style>${AVATAR_STYLES}</style>
        <button class="lmu-avatar-btn" id="lmu-av-toggle">
          ${auth.currentUser.avatar ? `<img src="${auth.currentUser.avatar}" alt="" />` : initial}
        </button>
        ${dropdownOpen ? `
          <div class="lmu-avatar-dropdown">
            <div class="lmu-avatar-dropdown-header">
              <p class="lmu-avatar-dropdown-name">${auth.currentUser.displayName}</p>
              <p class="lmu-avatar-dropdown-email">${auth.currentUser.email}</p>
            </div>
            <button class="lmu-avatar-dropdown-item" id="lmu-av-profile">Edit Profile</button>
            <button class="lmu-avatar-dropdown-item danger" id="lmu-av-logout">Logout</button>
          </div>
        ` : ''}
      `

      theme.applyToHost(host)

      shadow.getElementById('lmu-av-toggle')?.addEventListener('click', () => {
        dropdownOpen = !dropdownOpen
        render()
      })
      shadow.getElementById('lmu-av-profile')?.addEventListener('click', () => {
        dropdownOpen = false
        render()
        createProfileModal(getProfileModalDeps())
      })
      shadow.getElementById('lmu-av-logout')?.addEventListener('click', () => {
        dropdownOpen = false
        onLogout()
      })
    }

    // Close dropdown when clicking outside
    function handleOutsideClick(e: MouseEvent) {
      if (dropdownOpen && !host.contains(e.target as Node)) {
        dropdownOpen = false
        render()
      }
    }
    document.addEventListener('click', handleOutsideClick)

    el.appendChild(host)
    render()

    const unsub = onAuthChange(() => {
      dropdownOpen = false
      render()
    })

    return () => {
      unsub()
      theme.unregisterHost(host)
      document.removeEventListener('click', handleOutsideClick)
      host.remove()
    }
}
