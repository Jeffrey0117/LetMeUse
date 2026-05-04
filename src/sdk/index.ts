/**
 * LetMeUse Auth SDK — Entry Point
 * Usage: <script src="https://your-site.com/letmeuse.js" data-app-id="app_xxx"></script>
 *
 * Attributes:
 *   data-app-id    — Required. Your app ID from LetMeUse admin panel.
 *   data-theme     — "light" (default), "dark", or "auto"
 *   data-accent    — Accent color hex (default: "#2563eb")
 *   data-locale    — "en" (default) or "zh"
 *   data-mode      — "modal" (default) or "redirect"
 */

import type { Locale, ThemeMode, SdkMode, AuthCallback } from './types'
import { createTranslator } from './i18n'
import { ThemeManager } from './theme'
import { AuthManager } from './auth'
import type { ApiDeps } from './api'
import { createModal } from './ui/login-modal'
import type { LoginModalDeps } from './ui/login-modal'
import { createProfileModal } from './ui/profile-modal'
import type { ProfileModalDeps } from './ui/profile-modal'
import { renderAvatar, renderProfileCard } from './ui/avatar-widget'
import type { WidgetDeps } from './ui/avatar-widget'

// ── Config from script tag ──────────────────────────────

// Support both static <script> and dynamic appendChild (where document.currentScript is null)
const scriptTag = (document.currentScript
  ?? document.querySelector('script[src*="/letmeuse.js"][data-app-id]')) as HTMLScriptElement | null
const appId = scriptTag?.getAttribute('data-app-id') ?? ''
const themeSetting = (scriptTag?.getAttribute('data-theme') ?? 'light') as ThemeMode
const accent = scriptTag?.getAttribute('data-accent') ?? '#2563eb'
const locale = (scriptTag?.getAttribute('data-locale') ?? 'en') as Locale
const mode = (scriptTag?.getAttribute('data-mode') ?? 'modal') as SdkMode
const baseUrl = scriptTag?.src ? new URL(scriptTag.src).origin : window.location.origin

if (!appId) {
  console.warn('[LetMeUse SDK] Missing data-app-id attribute on script tag.')
}

// ── Create core instances ─────────────────────────────

const t = createTranslator(locale)
const themeManager = new ThemeManager(themeSetting)
const apiDeps: ApiDeps = { baseUrl, t }
const authManager = new AuthManager(appId, apiDeps)

// ── Dependency providers for UI components ────────────

function getLoginModalDeps(): LoginModalDeps {
  return { appId, accent, locale, auth: authManager, theme: themeManager, apiDeps, t }
}

function getProfileModalDeps(): ProfileModalDeps {
  return {
    appId, accent, locale, baseUrl, auth: authManager, theme: themeManager,
    apiDeps, t, getLoginModalDeps, onLogout: () => letmeuse.logout(),
  }
}

function getWidgetDeps(): WidgetDeps {
  return {
    accent, locale, auth: authManager, theme: themeManager, t,
    getLoginModalDeps, getProfileModalDeps,
    onLogout: () => letmeuse.logout(),
    onAuthChange: (cb) => letmeuse.onAuthChange(cb as AuthCallback),
  }
}

// ── Public API ──────────────────────────────────────────

const letmeuse = {
  get ready() {
    return authManager.ready
  },
  get user() {
    return authManager.currentUser
  },
  login() {
    if (mode === 'redirect') {
      window.location.href = `${baseUrl}/login?app=${appId}&redirect=${encodeURIComponent(window.location.href)}`
      return
    }
    createModal(getLoginModalDeps(), 'login')
  },
  register() {
    if (mode === 'redirect') {
      window.location.href = `${baseUrl}/login?app=${appId}&redirect=${encodeURIComponent(window.location.href)}&tab=register`
      return
    }
    createModal(getLoginModalDeps(), 'register')
  },
  async logout() {
    const token = authManager.getStoredAccessToken()
    if (token) {
      try {
        await fetch(`${baseUrl}/api/auth/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        })
      } catch {
        // Best effort
      }
    }
    authManager.clearTokens()
    authManager.currentUser = null
    authManager.cancelRefresh()
    authManager.fireCallbacks()
  },
  getToken() {
    return authManager.getStoredAccessToken()
  },
  onAuthChange(cb: AuthCallback): () => void {
    return authManager.onAuthChange(cb)
  },
  openAdmin() {
    window.open(`${baseUrl}/admin`, '_blank')
  },
  openProfile() {
    createProfileModal(getProfileModalDeps())
  },
  renderProfileCard(target: string | HTMLElement) {
    return renderProfileCard(getWidgetDeps(), target)
  },
  renderAvatar(target: string | HTMLElement) {
    return renderAvatar(getWidgetDeps(), target)
  },
}

;(window as unknown as Record<string, unknown>).letmeuse = letmeuse

// Start initialization
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => authManager.init())
} else {
  authManager.init()
}
