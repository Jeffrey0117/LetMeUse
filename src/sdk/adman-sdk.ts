/**
 * AdMan Auth SDK
 * Usage: <script src="https://your-adman.com/sdk.js" data-app-id="app_xxx"></script>
 *
 * Attributes:
 *   data-app-id    — Required. Your app ID from AdMan admin panel.
 *   data-theme     — "light" (default) or "dark"
 *   data-accent    — Accent color hex (default: "#2563eb")
 *   data-locale    — "en" (default) or "zh"
 *   data-mode      — "modal" (default) or "redirect"
 */

;(function () {
  // ── Config from script tag ──────────────────────────────

  const scriptTag = document.currentScript as HTMLScriptElement | null
  const appId = scriptTag?.getAttribute('data-app-id') ?? ''
  const theme = scriptTag?.getAttribute('data-theme') ?? 'light'
  const accent = scriptTag?.getAttribute('data-accent') ?? '#2563eb'
  const locale = (scriptTag?.getAttribute('data-locale') ?? 'en') as 'en' | 'zh'
  const mode = scriptTag?.getAttribute('data-mode') ?? 'modal'
  const baseUrl = scriptTag?.src ? new URL(scriptTag.src).origin : window.location.origin

  if (!appId) {
    console.warn('[AdMan SDK] Missing data-app-id attribute on script tag.')
  }

  // ── i18n ────────────────────────────────────────────────

  const i18n: Record<string, Record<string, string>> = {
    'title.login': { en: 'Sign In', zh: '登入' },
    'title.register': { en: 'Create Account', zh: '建立帳號' },
    'label.email': { en: 'Email', zh: '電子信箱' },
    'label.password': { en: 'Password', zh: '密碼' },
    'label.displayName': { en: 'Display Name', zh: '顯示名稱' },
    'btn.login': { en: 'Sign In', zh: '登入' },
    'btn.register': { en: 'Create Account', zh: '建立帳號' },
    'switch.toRegister': { en: "Don't have an account? Sign up", zh: '沒有帳號？註冊' },
    'switch.toLogin': { en: 'Already have an account? Sign in', zh: '已有帳號？登入' },
    'error.generic': { en: 'Something went wrong', zh: '發生錯誤' },
    'msg.loading': { en: 'Loading...', zh: '載入中...' },
  }

  function t(key: string): string {
    return i18n[key]?.[locale] ?? i18n[key]?.en ?? key
  }

  // ── Token storage ───────────────────────────────────────

  const STORAGE_PREFIX = `adman_${appId}_`
  const ACCESS_KEY = `${STORAGE_PREFIX}access_token`
  const REFRESH_KEY = `${STORAGE_PREFIX}refresh_token`

  function getStoredAccessToken(): string | null {
    return localStorage.getItem(ACCESS_KEY)
  }

  function getStoredRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_KEY)
  }

  function storeTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(ACCESS_KEY, accessToken)
    localStorage.setItem(REFRESH_KEY, refreshToken)
  }

  function clearTokens(): void {
    localStorage.removeItem(ACCESS_KEY)
    localStorage.removeItem(REFRESH_KEY)
  }

  // ── API helpers ─────────────────────────────────────────

  async function apiPost(path: string, body: Record<string, unknown>): Promise<unknown> {
    const res = await fetch(`${baseUrl}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    if (!res.ok) throw new Error((data as { error?: string }).error ?? t('error.generic'))
    return data
  }

  async function apiGet(path: string, token: string): Promise<unknown> {
    const res = await fetch(`${baseUrl}${path}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    if (!res.ok) throw new Error((data as { error?: string }).error ?? t('error.generic'))
    return data
  }

  // ── Auth state ──────────────────────────────────────────

  interface AdmanUser {
    id: string
    email: string
    displayName: string
    avatar?: string
    role: string
    appId: string
  }

  type AuthCallback = (user: AdmanUser | null) => void

  let currentUser: AdmanUser | null = null
  let ready = false
  const callbacks: AuthCallback[] = []
  let refreshTimer: ReturnType<typeof setTimeout> | null = null

  function fireCallbacks(): void {
    for (const cb of callbacks) {
      try {
        cb(currentUser)
      } catch {
        // ignore callback errors
      }
    }
  }

  function parseJwtExp(token: string): number | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload.exp ? payload.exp * 1000 : null
    } catch {
      return null
    }
  }

  function scheduleRefresh(): void {
    if (refreshTimer) clearTimeout(refreshTimer)

    const token = getStoredAccessToken()
    if (!token) return

    const exp = parseJwtExp(token)
    if (!exp) return

    // Refresh 5 minutes before expiry
    const delay = exp - Date.now() - 5 * 60 * 1000
    if (delay <= 0) {
      doRefresh()
      return
    }

    refreshTimer = setTimeout(doRefresh, delay)
  }

  async function doRefresh(): Promise<void> {
    const rt = getStoredRefreshToken()
    if (!rt) return

    try {
      const data = (await apiPost('/api/auth/refresh', { refreshToken: rt })) as {
        accessToken: string
        refreshToken: string
      }
      storeTokens(data.accessToken, data.refreshToken)
      scheduleRefresh()
    } catch {
      clearTokens()
      currentUser = null
      fireCallbacks()
    }
  }

  // ── Initialize ──────────────────────────────────────────

  async function init(): Promise<void> {
    const token = getStoredAccessToken()
    if (!token) {
      ready = true
      fireCallbacks()
      return
    }

    try {
      const data = (await apiGet('/api/auth/me', token)) as { user: AdmanUser }
      currentUser = data.user
      scheduleRefresh()
    } catch {
      // Token might be expired, try refresh
      const rt = getStoredRefreshToken()
      if (rt) {
        try {
          const refreshData = (await apiPost('/api/auth/refresh', { refreshToken: rt })) as {
            accessToken: string
            refreshToken: string
          }
          storeTokens(refreshData.accessToken, refreshData.refreshToken)
          const meData = (await apiGet('/api/auth/me', refreshData.accessToken)) as {
            user: AdmanUser
          }
          currentUser = meData.user
          scheduleRefresh()
        } catch {
          clearTokens()
        }
      } else {
        clearTokens()
      }
    }

    ready = true
    fireCallbacks()
  }

  // ── Modal UI ────────────────────────────────────────────

  const isDark = theme === 'dark'
  const bg = isDark ? '#1e1e2e' : '#ffffff'
  const textColor = isDark ? '#cdd6f4' : '#1e293b'
  const subtextColor = isDark ? '#a6adc8' : '#64748b'
  const inputBg = isDark ? '#313244' : '#f8fafc'
  const inputBorder = isDark ? '#45475a' : '#e2e8f0'
  const borderColor = isDark ? '#45475a' : '#e2e8f0'

  function createModal(initialMode: 'login' | 'register'): void {
    // Remove existing modal if any
    const existing = document.getElementById('adman-auth-modal')
    if (existing) existing.remove()

    let currentMode = initialMode
    let errorMsg = ''
    let loading = false

    const overlay = document.createElement('div')
    overlay.id = 'adman-auth-modal'

    function render(): void {
      const isLogin = currentMode === 'login'

      overlay.innerHTML = `
        <style>
          #adman-auth-modal {
            position: fixed; inset: 0; z-index: 99999;
            display: flex; align-items: center; justify-content: center;
            background: rgba(0,0,0,0.5); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
          #adman-auth-modal * { box-sizing: border-box; margin: 0; padding: 0; }
          .adman-card {
            background: ${bg}; color: ${textColor}; border-radius: 12px;
            padding: 32px; width: 100%; max-width: 400px; position: relative;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          }
          .adman-close {
            position: absolute; top: 12px; right: 12px; background: none; border: none;
            font-size: 20px; cursor: pointer; color: ${subtextColor}; padding: 4px 8px;
            border-radius: 4px; line-height: 1;
          }
          .adman-close:hover { background: ${inputBg}; }
          .adman-title {
            font-size: 22px; font-weight: 700; margin-bottom: 24px; text-align: center;
          }
          .adman-field { margin-bottom: 16px; }
          .adman-label {
            display: block; font-size: 13px; font-weight: 500; margin-bottom: 6px; color: ${subtextColor};
          }
          .adman-input {
            width: 100%; padding: 10px 12px; border: 1px solid ${inputBorder}; border-radius: 8px;
            font-size: 14px; background: ${inputBg}; color: ${textColor}; outline: none;
            transition: border-color 0.2s;
          }
          .adman-input:focus { border-color: ${accent}; }
          .adman-btn {
            width: 100%; padding: 12px; border: none; border-radius: 8px;
            font-size: 15px; font-weight: 600; cursor: pointer;
            background: ${accent}; color: #fff; margin-top: 8px;
            transition: opacity 0.2s;
          }
          .adman-btn:hover { opacity: 0.9; }
          .adman-btn:disabled { opacity: 0.6; cursor: not-allowed; }
          .adman-switch {
            text-align: center; margin-top: 16px; font-size: 13px; color: ${subtextColor};
          }
          .adman-switch a {
            color: ${accent}; cursor: pointer; text-decoration: none; font-weight: 500;
          }
          .adman-switch a:hover { text-decoration: underline; }
          .adman-error {
            background: #fef2f2; color: #dc2626; padding: 10px 12px; border-radius: 8px;
            font-size: 13px; margin-bottom: 16px; border: 1px solid #fecaca;
          }
          @media (max-width: 480px) {
            .adman-card { margin: 16px; padding: 24px; }
          }
        </style>
        <div class="adman-card">
          <button class="adman-close" id="adman-close-btn">&times;</button>
          <div class="adman-title">${isLogin ? t('title.login') : t('title.register')}</div>
          ${errorMsg ? `<div class="adman-error">${errorMsg}</div>` : ''}
          <form id="adman-auth-form">
            ${!isLogin ? `
              <div class="adman-field">
                <label class="adman-label">${t('label.displayName')}</label>
                <input class="adman-input" type="text" name="displayName" required />
              </div>
            ` : ''}
            <div class="adman-field">
              <label class="adman-label">${t('label.email')}</label>
              <input class="adman-input" type="email" name="email" required />
            </div>
            <div class="adman-field">
              <label class="adman-label">${t('label.password')}</label>
              <input class="adman-input" type="password" name="password" required minlength="${isLogin ? 1 : 8}" />
            </div>
            <button class="adman-btn" type="submit" ${loading ? 'disabled' : ''}>
              ${loading ? t('msg.loading') : (isLogin ? t('btn.login') : t('btn.register'))}
            </button>
          </form>
          <div class="adman-switch">
            <a id="adman-switch-mode">
              ${isLogin ? t('switch.toRegister') : t('switch.toLogin')}
            </a>
          </div>
        </div>
      `

      // Bind events
      const closeBtn = overlay.querySelector('#adman-close-btn')
      closeBtn?.addEventListener('click', () => overlay.remove())

      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.remove()
      })

      const switchLink = overlay.querySelector('#adman-switch-mode')
      switchLink?.addEventListener('click', () => {
        currentMode = isLogin ? 'register' : 'login'
        errorMsg = ''
        render()
      })

      const form = overlay.querySelector('#adman-auth-form') as HTMLFormElement | null
      form?.addEventListener('submit', async (e) => {
        e.preventDefault()
        if (loading) return

        loading = true
        errorMsg = ''
        render()

        const formData = new FormData(form)
        const email = formData.get('email') as string
        const password = formData.get('password') as string

        try {
          if (isLogin) {
            const data = (await apiPost('/api/auth/login', {
              appId,
              email,
              password,
            })) as { user: AdmanUser; accessToken: string; refreshToken: string }

            storeTokens(data.accessToken, data.refreshToken)
            currentUser = data.user
            scheduleRefresh()
            fireCallbacks()
            overlay.remove()
          } else {
            const displayName = formData.get('displayName') as string
            const data = (await apiPost('/api/auth/register', {
              appId,
              email,
              password,
              displayName,
            })) as { user: AdmanUser; accessToken: string; refreshToken: string }

            storeTokens(data.accessToken, data.refreshToken)
            currentUser = data.user
            scheduleRefresh()
            fireCallbacks()
            overlay.remove()
          }
        } catch (err) {
          errorMsg = err instanceof Error ? err.message : t('error.generic')
          loading = false
          render()
        }
      })
    }

    render()
    document.body.appendChild(overlay)

    // Focus first input
    setTimeout(() => {
      const firstInput = overlay.querySelector('input') as HTMLInputElement | null
      firstInput?.focus()
    }, 50)
  }

  // ── Public API ──────────────────────────────────────────

  const adman = {
    get ready() {
      return ready
    },
    get user() {
      return currentUser
    },
    login() {
      if (mode === 'redirect') {
        window.location.href = `${baseUrl}/login?app=${appId}&redirect=${encodeURIComponent(window.location.href)}`
        return
      }
      createModal('login')
    },
    register() {
      if (mode === 'redirect') {
        window.location.href = `${baseUrl}/login?app=${appId}&redirect=${encodeURIComponent(window.location.href)}&tab=register`
        return
      }
      createModal('register')
    },
    async logout() {
      const token = getStoredAccessToken()
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
      clearTokens()
      currentUser = null
      if (refreshTimer) clearTimeout(refreshTimer)
      fireCallbacks()
    },
    getToken() {
      return getStoredAccessToken()
    },
    onAuthChange(cb: AuthCallback): () => void {
      callbacks.push(cb)
      // Fire immediately with current state if ready
      if (ready) {
        try {
          cb(currentUser)
        } catch {
          // ignore
        }
      }
      return () => {
        const idx = callbacks.indexOf(cb)
        if (idx !== -1) callbacks.splice(idx, 1)
      }
    },
    openAdmin() {
      window.open(`${baseUrl}/admin`, '_blank')
    },
  }

  ;(window as unknown as Record<string, unknown>).adman = adman

  // Start initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => init())
  } else {
    init()
  }
})()
