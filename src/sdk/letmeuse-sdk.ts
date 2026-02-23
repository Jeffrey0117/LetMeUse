/**
 * LetMeUse Auth SDK
 * Usage: <script src="https://your-site.com/letmeuse.js" data-app-id="app_xxx"></script>
 *
 * Attributes:
 *   data-app-id    — Required. Your app ID from LetMeUse admin panel.
 *   data-theme     — "light" (default) or "dark"
 *   data-accent    — Accent color hex (default: "#2563eb")
 *   data-locale    — "en" (default) or "zh"
 *   data-mode      — "modal" (default) or "redirect"
 */

;(function () {
  // ── Config from script tag ──────────────────────────────

  // Support both static <script> and dynamic appendChild (where document.currentScript is null)
  const scriptTag = (document.currentScript
    ?? document.querySelector('script[src*="/letmeuse.js"][data-app-id]')) as HTMLScriptElement | null
  const appId = scriptTag?.getAttribute('data-app-id') ?? ''
  const theme = scriptTag?.getAttribute('data-theme') ?? 'light'
  const accent = scriptTag?.getAttribute('data-accent') ?? '#2563eb'
  const locale = (scriptTag?.getAttribute('data-locale') ?? 'en') as 'en' | 'zh'
  const mode = scriptTag?.getAttribute('data-mode') ?? 'modal'
  const baseUrl = scriptTag?.src ? new URL(scriptTag.src).origin : window.location.origin

  if (!appId) {
    console.warn('[LetMeUse SDK] Missing data-app-id attribute on script tag.')
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
    'oauth.or': { en: 'or continue with', zh: '或使用以下方式登入' },
    'oauth.google': { en: 'Google', zh: 'Google' },
    'oauth.github': { en: 'GitHub', zh: 'GitHub' },
    'link.forgotPassword': { en: 'Forgot password?', zh: '忘記密碼？' },
    'error.passwordRequires': { en: 'Password requires', zh: '密碼需要' },
    'strength.weak': { en: 'Weak', zh: '弱' },
    'strength.fair': { en: 'Fair', zh: '中等' },
    'strength.strong': { en: 'Strong', zh: '強' },
  }

  function t(key: string): string {
    return i18n[key]?.[locale] ?? i18n[key]?.en ?? key
  }

  // ── Token storage ───────────────────────────────────────

  const STORAGE_PREFIX = `lmu_${appId}_`
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
    const json = await res.json()
    if (!res.ok) throw new Error((json as { error?: string }).error ?? t('error.generic'))
    return (json as { data?: unknown }).data ?? json
  }

  async function apiGet(path: string, token?: string): Promise<unknown> {
    const headers: Record<string, string> = {}
    if (token) headers['Authorization'] = `Bearer ${token}`
    const res = await fetch(`${baseUrl}${path}`, { headers })
    const json = await res.json()
    if (!res.ok) throw new Error((json as { error?: string }).error ?? t('error.generic'))
    return (json as { data?: unknown }).data ?? json
  }

  // ── OAuth providers ────────────────────────────────────

  let availableProviders: string[] = []

  async function fetchProviders(): Promise<void> {
    if (!appId) return
    try {
      const data = (await apiGet(`/api/auth/providers?app_id=${appId}`, '')) as { providers: string[] }
      availableProviders = data.providers ?? []
    } catch {
      availableProviders = []
    }
  }

  function startOAuth(provider: string): void {
    const redirectUrl = encodeURIComponent(window.location.href)
    window.location.href = `${baseUrl}/api/auth/oauth/${provider}?app_id=${appId}&redirect=${redirectUrl}`
  }

  // ── Auth state ──────────────────────────────────────────

  interface LetMeUseUser {
    id: string
    email: string
    displayName: string
    avatar?: string
    role: string
    appId: string
  }

  type AuthCallback = (user: LetMeUseUser | null) => void

  let currentUser: LetMeUseUser | null = null
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

  function checkHashTokens(): boolean {
    const hash = window.location.hash
    if (!hash.includes('lmu_token=')) return false

    const params = new URLSearchParams(hash.slice(1))
    const token = params.get('lmu_token')
    const refresh = params.get('lmu_refresh')

    if (token && refresh) {
      storeTokens(token, refresh)
      // Clean the hash
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
      return true
    }
    return false
  }

  async function init(): Promise<void> {
    // Check for OAuth callback tokens in hash
    checkHashTokens()

    // Fetch available OAuth providers
    await fetchProviders()

    const token = getStoredAccessToken()
    if (!token) {
      ready = true
      fireCallbacks()
      return
    }

    try {
      const data = (await apiGet('/api/auth/me', token)) as { user: LetMeUseUser }
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
            user: LetMeUseUser
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
      position: fixed !important;
      inset: 0 !important;
      z-index: 99999 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      background: rgba(0,0,0,0.5) !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.5;
    }
    *, *::before, *::after {
      box-sizing: border-box;
    }
    .lmu-card {
      background: ${bg};
      color: ${textColor};
      border-radius: 16px;
      padding: 36px;
      width: 100%;
      max-width: 400px;
      position: relative;
      box-shadow: 0 24px 64px rgba(0,0,0,0.35);
      line-height: 1.5;
    }
    .lmu-close {
      position: absolute;
      top: 14px;
      right: 14px;
      background: none;
      border: none;
      font-size: 22px;
      cursor: pointer;
      color: ${subtextColor};
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      line-height: 1;
      transition: background 0.15s;
      padding: 0;
      margin: 0;
    }
    .lmu-close:hover { background: ${inputBg}; }
    .lmu-title {
      font-size: 24px;
      font-weight: 700;
      margin: 0 0 28px 0;
      padding: 0;
      text-align: center;
      letter-spacing: -0.3px;
    }
    .lmu-field {
      margin: 0 0 18px 0;
      padding: 0;
    }
    .lmu-label {
      display: block;
      font-size: 13px;
      font-weight: 600;
      margin: 0 0 8px 0;
      padding: 0;
      color: ${subtextColor};
      letter-spacing: 0.2px;
    }
    .lmu-input {
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      display: block;
      width: 100%;
      height: 44px;
      padding: 0 14px;
      margin: 0;
      border: 1.5px solid ${inputBorder};
      border-radius: 10px;
      font-size: 15px;
      font-family: inherit;
      line-height: 44px;
      background: ${inputBg};
      color: ${textColor};
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .lmu-input:focus {
      border-color: ${accent};
      box-shadow: 0 0 0 3px ${accent}22;
    }
    .lmu-input::placeholder {
      color: ${subtextColor};
      opacity: 0.6;
    }
    .lmu-btn {
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      display: block;
      width: 100%;
      height: 48px;
      padding: 0;
      margin: 12px 0 0 0;
      border: none;
      border-radius: 10px;
      font-size: 15px;
      font-weight: 600;
      font-family: inherit;
      line-height: 48px;
      text-align: center;
      cursor: pointer;
      background: ${accent};
      color: #fff;
      transition: opacity 0.2s, transform 0.1s;
    }
    .lmu-btn:hover { opacity: 0.92; }
    .lmu-btn:active { transform: scale(0.99); }
    .lmu-btn:disabled { opacity: 0.55; cursor: not-allowed; }
    .lmu-switch {
      text-align: center;
      margin: 20px 0 0 0;
      padding: 0;
      font-size: 13px;
      color: ${subtextColor};
    }
    .lmu-switch a {
      color: ${accent};
      cursor: pointer;
      text-decoration: none;
      font-weight: 600;
    }
    .lmu-switch a:hover { text-decoration: underline; }
    .lmu-error {
      background: ${isDark ? '#3b1c1c' : '#fef2f2'};
      color: ${isDark ? '#f87171' : '#dc2626'};
      padding: 11px 14px;
      margin: 0 0 18px 0;
      border-radius: 10px;
      font-size: 13px;
      border: 1px solid ${isDark ? '#5c2828' : '#fecaca'};
    }
    .lmu-divider {
      display: flex;
      align-items: center;
      margin: 22px 0 18px 0;
      padding: 0;
      gap: 12px;
      font-size: 12px;
      color: ${subtextColor};
    }
    .lmu-divider::before,
    .lmu-divider::after {
      content: '';
      flex: 1;
      height: 1px;
      background: ${inputBorder};
    }
    .lmu-oauth-row {
      display: flex;
      gap: 10px;
      margin: 0;
      padding: 0;
    }
    .lmu-oauth-btn {
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      height: 44px;
      padding: 0 16px;
      margin: 0;
      border: 1.5px solid ${inputBorder};
      border-radius: 10px;
      font-size: 14px;
      font-weight: 500;
      font-family: inherit;
      line-height: 44px;
      cursor: pointer;
      background: ${inputBg};
      color: ${textColor};
      transition: border-color 0.2s, background 0.15s;
    }
    .lmu-oauth-btn:hover {
      border-color: ${accent};
      background: ${isDark ? '#3b3b50' : '#f1f5f9'};
    }
    .lmu-oauth-btn svg {
      width: 18px;
      height: 18px;
      flex-shrink: 0;
    }
    .lmu-strength {
      margin: 8px 0 0 0;
      padding: 0;
    }
    .lmu-strength-bar {
      height: 4px;
      border-radius: 2px;
      background: ${inputBorder};
      overflow: hidden;
      margin: 0 0 4px 0;
    }
    .lmu-strength-fill {
      height: 100%;
      border-radius: 2px;
      width: 0%;
      transition: width 0.25s ease, background-color 0.25s ease;
    }
    .lmu-strength-fill[data-level="weak"] {
      width: 33%;
      background-color: #ef4444;
    }
    .lmu-strength-fill[data-level="fair"] {
      width: 66%;
      background-color: #eab308;
    }
    .lmu-strength-fill[data-level="strong"] {
      width: 100%;
      background-color: #22c55e;
    }
    .lmu-strength-text {
      font-size: 11px;
      font-weight: 500;
      margin: 0;
      padding: 0;
    }
    .lmu-strength-text[data-level="weak"] { color: #ef4444; }
    .lmu-strength-text[data-level="fair"] { color: #eab308; }
    .lmu-strength-text[data-level="strong"] { color: #22c55e; }
    @media (max-width: 480px) {
      .lmu-card { margin: 16px; padding: 28px; }
    }
  `

  function calcPasswordStrength(password: string): { level: 'weak' | 'fair' | 'strong'; label: string } {
    let met = 0
    if (password.length >= 8) met++
    if (/[a-z]/.test(password)) met++
    if (/[A-Z]/.test(password)) met++
    if (/[0-9]/.test(password)) met++

    if (met >= 4) return { level: 'strong', label: t('strength.strong') }
    if (met >= 2) return { level: 'fair', label: t('strength.fair') }
    return { level: 'weak', label: t('strength.weak') }
  }

  function createModal(initialMode: 'login' | 'register'): void {
    // Remove existing modal if any
    const existing = document.getElementById('lmu-auth-host')
    if (existing) existing.remove()

    let currentMode = initialMode
    let errorMsg = ''
    let loading = false

    // Create host element + shadow root for style isolation
    const host = document.createElement('div')
    host.id = 'lmu-auth-host'
    host.style.cssText = 'position:fixed;inset:0;z-index:99999;'
    const shadow = host.attachShadow({ mode: 'closed' })

    function render(): void {
      const isLogin = currentMode === 'login'

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
              ${!isLogin ? `
              <div class="lmu-strength" id="lmu-strength">
                <div class="lmu-strength-bar"><div class="lmu-strength-fill" id="lmu-strength-fill"></div></div>
                <div class="lmu-strength-text" id="lmu-strength-text"></div>
              </div>
              ` : ''}
            </div>
            ${isLogin ? `<div style="text-align:right;margin:-10px 0 8px 0;"><a id="lmu-forgot-pw" style="font-size:12px;color:${accent};cursor:pointer;text-decoration:none;">${t('link.forgotPassword')}</a></div>` : ''}
            <button class="lmu-btn" type="submit" ${loading ? 'disabled' : ''}>
              ${loading ? t('msg.loading') : (isLogin ? t('btn.login') : t('btn.register'))}
            </button>
          </form>
          ${availableProviders.length > 0 ? `
            <div class="lmu-divider">${t('oauth.or')}</div>
            <div class="lmu-oauth-row">
              ${availableProviders.includes('google') ? `
                <button class="lmu-oauth-btn" id="lmu-oauth-google">
                  <svg viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  ${t('oauth.google')}
                </button>
              ` : ''}
              ${availableProviders.includes('github') ? `
                <button class="lmu-oauth-btn" id="lmu-oauth-github">
                  <svg viewBox="0 0 24 24" fill="${textColor}"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/></svg>
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

      // Bind events
      shadow.getElementById('lmu-close-btn')?.addEventListener('click', () => host.remove())

      // Click backdrop to close
      shadow.addEventListener('click', (e) => {
        if (e.target === shadow.firstElementChild?.nextElementSibling) return
        const card = shadow.querySelector('.lmu-card')
        if (card && !card.contains(e.target as Node)) {
          host.remove()
        }
      })

      shadow.getElementById('lmu-oauth-google')?.addEventListener('click', () => startOAuth('google'))
      shadow.getElementById('lmu-oauth-github')?.addEventListener('click', () => startOAuth('github'))
      shadow.getElementById('lmu-forgot-pw')?.addEventListener('click', () => {
        host.remove()
        window.open(`${baseUrl}/login?app=${appId}&tab=login`, '_blank')
      })

      shadow.getElementById('lmu-switch-mode')?.addEventListener('click', () => {
        currentMode = isLogin ? 'register' : 'login'
        errorMsg = ''
        render()
      })

      // Password strength indicator (register mode only)
      if (!isLogin) {
        const pwInput = shadow.getElementById('lmu-password-input') as HTMLInputElement | null
        const strengthFill = shadow.getElementById('lmu-strength-fill')
        const strengthText = shadow.getElementById('lmu-strength-text')
        if (pwInput && strengthFill && strengthText) {
          const updateStrength = () => {
            const { level, label } = calcPasswordStrength(pwInput.value)
            strengthFill.setAttribute('data-level', pwInput.value ? level : '')
            strengthText.setAttribute('data-level', pwInput.value ? level : '')
            strengthText.textContent = pwInput.value ? label : ''
          }
          pwInput.addEventListener('input', updateStrength)
          updateStrength()
        }
      }

      const form = shadow.getElementById('lmu-auth-form') as HTMLFormElement | null
      form?.addEventListener('submit', async (e) => {
        e.preventDefault()
        if (loading) return

        loading = true
        errorMsg = ''
        render()

        const formData = new FormData(form)
        const email = formData.get('email') as string
        const password = formData.get('password') as string

        // Client-side password validation for register (Shadow DOM can't show native tooltips)
        if (!isLogin) {
          const pwErrors: string[] = []
          if (password.length < 8) pwErrors.push('8+ chars')
          if (!/[a-z]/.test(password)) pwErrors.push('lowercase')
          if (!/[A-Z]/.test(password)) pwErrors.push('uppercase')
          if (!/[0-9]/.test(password)) pwErrors.push('number')
          if (pwErrors.length > 0) {
            errorMsg = `${t('error.passwordRequires')}: ${pwErrors.join(', ')}`
            loading = false
            render()
            return
          }
        }

        try {
          if (isLogin) {
            const data = (await apiPost('/api/auth/login', {
              appId,
              email,
              password,
            })) as { user: LetMeUseUser; accessToken: string; refreshToken: string }

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
            })) as { user: LetMeUseUser; accessToken: string; refreshToken: string }

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

  // ── Profile Card Component ────────────────────────────

  const PROFILE_CARD_STYLES = `
    :host {
      display: block;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.5;
    }
    *, *::before, *::after { box-sizing: border-box; }
    .lmu-profile-card {
      background: ${bg};
      color: ${textColor};
      border-radius: 12px;
      border: 1px solid ${inputBorder};
      padding: 20px;
      max-width: 320px;
    }
    .lmu-profile-header {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 16px;
    }
    .lmu-profile-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: ${accent};
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      font-weight: 600;
      flex-shrink: 0;
      overflow: hidden;
    }
    .lmu-profile-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .lmu-profile-info {
      min-width: 0;
    }
    .lmu-profile-name {
      font-size: 16px;
      font-weight: 600;
      margin: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .lmu-profile-email {
      font-size: 13px;
      color: ${subtextColor};
      margin: 2px 0 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .lmu-profile-role {
      display: inline-block;
      font-size: 11px;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 9999px;
      background: ${isDark ? '#313244' : '#f1f5f9'};
      color: ${subtextColor};
      margin-bottom: 14px;
    }
    .lmu-profile-actions {
      display: flex;
      gap: 8px;
    }
    .lmu-profile-btn {
      flex: 1;
      height: 36px;
      border-radius: 8px;
      border: 1px solid ${inputBorder};
      background: ${inputBg};
      color: ${textColor};
      font-size: 13px;
      font-weight: 500;
      font-family: inherit;
      cursor: pointer;
      transition: background 0.15s, border-color 0.15s;
    }
    .lmu-profile-btn:hover {
      border-color: ${accent};
      background: ${isDark ? '#3b3b50' : '#f1f5f9'};
    }
    .lmu-profile-btn.primary {
      background: ${accent};
      color: #fff;
      border-color: ${accent};
    }
    .lmu-profile-btn.primary:hover { opacity: 0.9; }
    .lmu-profile-login {
      text-align: center;
      padding: 8px 0;
    }
    .lmu-profile-login a {
      color: ${accent};
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      text-decoration: none;
    }
    .lmu-profile-login a:hover { text-decoration: underline; }
  `

  function renderProfileCard(target: string | HTMLElement): () => void {
    const el = typeof target === 'string' ? document.querySelector(target) : target
    if (!el) return () => {}

    const host = document.createElement('div')
    host.className = 'lmu-profile-card-host'
    const shadow = host.attachShadow({ mode: 'closed' })

    function render() {
      if (!currentUser) {
        shadow.innerHTML = `
          <style>${PROFILE_CARD_STYLES}</style>
          <div class="lmu-profile-card">
            <div class="lmu-profile-login">
              <a id="lmu-pc-login">${t('btn.login')}</a>
            </div>
          </div>
        `
        shadow.getElementById('lmu-pc-login')?.addEventListener('click', () => {
          createModal('login')
        })
        return
      }

      const initial = currentUser.displayName?.charAt(0)?.toUpperCase() ?? '?'
      shadow.innerHTML = `
        <style>${PROFILE_CARD_STYLES}</style>
        <div class="lmu-profile-card">
          <div class="lmu-profile-header">
            <div class="lmu-profile-avatar">
              ${currentUser.avatar ? `<img src="${currentUser.avatar}" alt="" />` : initial}
            </div>
            <div class="lmu-profile-info">
              <p class="lmu-profile-name">${currentUser.displayName}</p>
              <p class="lmu-profile-email">${currentUser.email}</p>
            </div>
          </div>
          <div class="lmu-profile-role">${currentUser.role}</div>
          <div class="lmu-profile-actions">
            <button class="lmu-profile-btn primary" id="lmu-pc-edit">Edit Profile</button>
            <button class="lmu-profile-btn" id="lmu-pc-logout">Logout</button>
          </div>
        </div>
      `
      shadow.getElementById('lmu-pc-logout')?.addEventListener('click', () => {
        letmeuse.logout()
      })
      shadow.getElementById('lmu-pc-edit')?.addEventListener('click', () => {
        window.open(`${baseUrl}/login?app=${appId}&tab=profile`, '_blank')
      })
    }

    el.appendChild(host)
    render()

    // Re-render on auth changes
    const unsub = letmeuse.onAuthChange(() => render())

    return () => {
      unsub()
      host.remove()
    }
  }

  // ── Avatar Button Component ──────────────────────────

  const AVATAR_STYLES = `
    :host {
      display: inline-block;
      position: relative;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.5;
    }
    *, *::before, *::after { box-sizing: border-box; }
    .lmu-avatar-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 2px solid ${inputBorder};
      background: ${accent};
      color: #fff;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      transition: border-color 0.2s, box-shadow 0.2s;
      padding: 0;
    }
    .lmu-avatar-btn:hover {
      border-color: ${accent};
      box-shadow: 0 0 0 2px ${accent}33;
    }
    .lmu-avatar-btn img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .lmu-avatar-login {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 2px dashed ${inputBorder};
      background: ${inputBg};
      color: ${subtextColor};
      font-size: 18px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: border-color 0.2s;
      padding: 0;
    }
    .lmu-avatar-login:hover { border-color: ${accent}; color: ${accent}; }
    .lmu-avatar-dropdown {
      position: absolute;
      top: calc(100% + 6px);
      right: 0;
      background: ${bg};
      border: 1px solid ${inputBorder};
      border-radius: 10px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
      min-width: 200px;
      z-index: 99999;
      overflow: hidden;
    }
    .lmu-avatar-dropdown-header {
      padding: 12px 14px;
      border-bottom: 1px solid ${inputBorder};
    }
    .lmu-avatar-dropdown-name {
      font-size: 14px;
      font-weight: 600;
      color: ${textColor};
      margin: 0;
    }
    .lmu-avatar-dropdown-email {
      font-size: 12px;
      color: ${subtextColor};
      margin: 2px 0 0;
    }
    .lmu-avatar-dropdown-item {
      display: block;
      width: 100%;
      padding: 10px 14px;
      border: none;
      background: none;
      color: ${textColor};
      font-size: 13px;
      font-family: inherit;
      cursor: pointer;
      text-align: left;
      transition: background 0.1s;
    }
    .lmu-avatar-dropdown-item:hover {
      background: ${isDark ? '#313244' : '#f8fafc'};
    }
    .lmu-avatar-dropdown-item.danger { color: #ef4444; }
  `

  function renderAvatar(target: string | HTMLElement): () => void {
    const el = typeof target === 'string' ? document.querySelector(target) : target
    if (!el) return () => {}

    const host = document.createElement('div')
    host.className = 'lmu-avatar-host'
    const shadow = host.attachShadow({ mode: 'closed' })

    let dropdownOpen = false

    function render() {
      if (!currentUser) {
        shadow.innerHTML = `
          <style>${AVATAR_STYLES}</style>
          <button class="lmu-avatar-login" id="lmu-av-login" title="${t('btn.login')}">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </button>
        `
        shadow.getElementById('lmu-av-login')?.addEventListener('click', () => {
          createModal('login')
        })
        return
      }

      const initial = currentUser.displayName?.charAt(0)?.toUpperCase() ?? '?'
      shadow.innerHTML = `
        <style>${AVATAR_STYLES}</style>
        <button class="lmu-avatar-btn" id="lmu-av-toggle">
          ${currentUser.avatar ? `<img src="${currentUser.avatar}" alt="" />` : initial}
        </button>
        ${dropdownOpen ? `
          <div class="lmu-avatar-dropdown">
            <div class="lmu-avatar-dropdown-header">
              <p class="lmu-avatar-dropdown-name">${currentUser.displayName}</p>
              <p class="lmu-avatar-dropdown-email">${currentUser.email}</p>
            </div>
            <button class="lmu-avatar-dropdown-item" id="lmu-av-profile">Edit Profile</button>
            <button class="lmu-avatar-dropdown-item danger" id="lmu-av-logout">Logout</button>
          </div>
        ` : ''}
      `

      shadow.getElementById('lmu-av-toggle')?.addEventListener('click', () => {
        dropdownOpen = !dropdownOpen
        render()
      })
      shadow.getElementById('lmu-av-profile')?.addEventListener('click', () => {
        dropdownOpen = false
        render()
        window.open(`${baseUrl}/login?app=${appId}&tab=profile`, '_blank')
      })
      shadow.getElementById('lmu-av-logout')?.addEventListener('click', () => {
        dropdownOpen = false
        letmeuse.logout()
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

    const unsub = letmeuse.onAuthChange(() => {
      dropdownOpen = false
      render()
    })

    return () => {
      unsub()
      document.removeEventListener('click', handleOutsideClick)
      host.remove()
    }
  }

  // ── Public API ──────────────────────────────────────────

  const letmeuse = {
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
    renderProfileCard(target: string | HTMLElement) {
      return renderProfileCard(target)
    },
    renderAvatar(target: string | HTMLElement) {
      return renderAvatar(target)
    },
  }

  ;(window as unknown as Record<string, unknown>).letmeuse = letmeuse

  // Start initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => init())
  } else {
    init()
  }
})()
