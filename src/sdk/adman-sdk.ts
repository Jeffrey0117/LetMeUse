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

  // Support both static <script> and dynamic appendChild (where document.currentScript is null)
  const scriptTag = (document.currentScript
    ?? document.querySelector('script[src*="/sdk.js"][data-app-id]')) as HTMLScriptElement | null
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

  // ── Modal UI (Shadow DOM isolated) ────────────────────

  const isDark = theme === 'dark'
  const bg = isDark ? '#1e1e2e' : '#ffffff'
  const textColor = isDark ? '#cdd6f4' : '#1e293b'
  const subtextColor = isDark ? '#a6adc8' : '#64748b'
  const inputBg = isDark ? '#313244' : '#f8fafc'
  const inputBorder = isDark ? '#45475a' : '#e2e8f0'

  const MODAL_STYLES = `
    :host {
      position: fixed; inset: 0; z-index: 99999;
      display: flex; align-items: center; justify-content: center;
      background: rgba(0,0,0,0.5);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    .adman-card {
      background: ${bg}; color: ${textColor}; border-radius: 16px;
      padding: 36px; width: 100%; max-width: 400px; position: relative;
      box-shadow: 0 24px 64px rgba(0,0,0,0.35);
    }
    .adman-close {
      position: absolute; top: 14px; right: 14px; background: none; border: none;
      font-size: 22px; cursor: pointer; color: ${subtextColor}; padding: 4px 8px;
      border-radius: 6px; line-height: 1; transition: background 0.15s;
    }
    .adman-close:hover { background: ${inputBg}; }
    .adman-title {
      font-size: 24px; font-weight: 700; margin-bottom: 28px; text-align: center;
      letter-spacing: -0.3px;
    }
    .adman-field { margin-bottom: 18px; }
    .adman-label {
      display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px;
      color: ${subtextColor}; letter-spacing: 0.2px;
    }
    .adman-input {
      display: block; width: 100%; padding: 11px 14px;
      border: 1.5px solid ${inputBorder}; border-radius: 10px;
      font-size: 15px; font-family: inherit;
      background: ${inputBg}; color: ${textColor};
      outline: none; transition: border-color 0.2s, box-shadow 0.2s;
    }
    .adman-input:focus {
      border-color: ${accent};
      box-shadow: 0 0 0 3px ${accent}22;
    }
    .adman-input::placeholder { color: ${subtextColor}; opacity: 0.6; }
    .adman-btn {
      display: block; width: 100%; padding: 13px; border: none; border-radius: 10px;
      font-size: 15px; font-weight: 600; font-family: inherit; cursor: pointer;
      background: ${accent}; color: #fff; margin-top: 12px;
      transition: opacity 0.2s, transform 0.1s;
    }
    .adman-btn:hover { opacity: 0.92; }
    .adman-btn:active { transform: scale(0.99); }
    .adman-btn:disabled { opacity: 0.55; cursor: not-allowed; }
    .adman-switch {
      text-align: center; margin-top: 20px; font-size: 13px; color: ${subtextColor};
    }
    .adman-switch a {
      color: ${accent}; cursor: pointer; text-decoration: none; font-weight: 600;
    }
    .adman-switch a:hover { text-decoration: underline; }
    .adman-error {
      background: ${isDark ? '#3b1c1c' : '#fef2f2'};
      color: ${isDark ? '#f87171' : '#dc2626'};
      padding: 11px 14px; border-radius: 10px;
      font-size: 13px; margin-bottom: 18px;
      border: 1px solid ${isDark ? '#5c2828' : '#fecaca'};
    }
    @media (max-width: 480px) {
      .adman-card { margin: 16px; padding: 28px; }
    }
  `

  function createModal(initialMode: 'login' | 'register'): void {
    // Remove existing modal if any
    const existing = document.getElementById('adman-auth-host')
    if (existing) existing.remove()

    let currentMode = initialMode
    let errorMsg = ''
    let loading = false

    // Create host element + shadow root for style isolation
    const host = document.createElement('div')
    host.id = 'adman-auth-host'
    host.style.cssText = 'position:fixed;inset:0;z-index:99999;'
    const shadow = host.attachShadow({ mode: 'closed' })

    function render(): void {
      const isLogin = currentMode === 'login'

      shadow.innerHTML = `
        <style>${MODAL_STYLES}</style>
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
      shadow.getElementById('adman-close-btn')?.addEventListener('click', () => host.remove())

      // Click backdrop to close
      shadow.addEventListener('click', (e) => {
        if (e.target === shadow.firstElementChild?.nextElementSibling) return
        const card = shadow.querySelector('.adman-card')
        if (card && !card.contains(e.target as Node)) {
          host.remove()
        }
      })

      shadow.getElementById('adman-switch-mode')?.addEventListener('click', () => {
        currentMode = isLogin ? 'register' : 'login'
        errorMsg = ''
        render()
      })

      const form = shadow.getElementById('adman-auth-form') as HTMLFormElement | null
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
            host.remove()
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
            host.remove()
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
