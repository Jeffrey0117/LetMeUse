/**
 * Token storage, refresh scheduling, and auth state management
 */

import type { LetMeUseUser, AuthCallback } from './types'
import type { ApiDeps } from './api'
import { apiPost, apiGet } from './api'

export class AuthManager {
  private readonly accessKey: string
  private readonly refreshKey: string
  private readonly apiDeps: ApiDeps
  private readonly appId: string

  private _currentUser: LetMeUseUser | null = null
  private _ready = false
  private readonly callbacks: AuthCallback[] = []
  private refreshTimer: ReturnType<typeof setTimeout> | null = null

  /** Available OAuth providers for this app */
  availableProviders: string[] = []

  constructor(appId: string, apiDeps: ApiDeps) {
    this.appId = appId
    this.apiDeps = apiDeps
    const prefix = `lmu_${appId}_`
    this.accessKey = `${prefix}access_token`
    this.refreshKey = `${prefix}refresh_token`
  }

  get currentUser(): LetMeUseUser | null {
    return this._currentUser
  }

  set currentUser(user: LetMeUseUser | null) {
    this._currentUser = user
  }

  get ready(): boolean {
    return this._ready
  }

  // ── Token storage ────────────────────────────────────

  getStoredAccessToken(): string | null {
    return localStorage.getItem(this.accessKey)
  }

  getStoredRefreshToken(): string | null {
    return localStorage.getItem(this.refreshKey)
  }

  storeTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.accessKey, accessToken)
    localStorage.setItem(this.refreshKey, refreshToken)
  }

  clearTokens(): void {
    localStorage.removeItem(this.accessKey)
    localStorage.removeItem(this.refreshKey)
  }

  // ── Callbacks ────────────────────────────────────────

  fireCallbacks(): void {
    for (const cb of this.callbacks) {
      try {
        cb(this._currentUser)
      } catch {
        // ignore callback errors
      }
    }
  }

  onAuthChange(cb: AuthCallback): () => void {
    this.callbacks.push(cb)
    if (this._ready) {
      try {
        cb(this._currentUser)
      } catch {
        // ignore
      }
    }
    return () => {
      const idx = this.callbacks.indexOf(cb)
      if (idx !== -1) this.callbacks.splice(idx, 1)
    }
  }

  // ── Token refresh ────────────────────────────────────

  private parseJwtExp(token: string): number | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload.exp ? payload.exp * 1000 : null
    } catch {
      return null
    }
  }

  scheduleRefresh(): void {
    if (this.refreshTimer) clearTimeout(this.refreshTimer)

    const token = this.getStoredAccessToken()
    if (!token) return

    const exp = this.parseJwtExp(token)
    if (!exp) return

    const delay = exp - Date.now() - 5 * 60 * 1000
    if (delay <= 0) {
      this.doRefresh()
      return
    }

    this.refreshTimer = setTimeout(() => this.doRefresh(), delay)
  }

  private async doRefresh(): Promise<void> {
    const rt = this.getStoredRefreshToken()
    if (!rt) return

    try {
      const data = (await apiPost(this.apiDeps, '/api/auth/refresh', { refreshToken: rt })) as {
        accessToken: string
        refreshToken: string
      }
      this.storeTokens(data.accessToken, data.refreshToken)
      this.scheduleRefresh()
    } catch {
      this.clearTokens()
      this._currentUser = null
      this.fireCallbacks()
    }
  }

  cancelRefresh(): void {
    if (this.refreshTimer) clearTimeout(this.refreshTimer)
  }

  // ── OAuth ────────────────────────────────────────────

  async fetchProviders(): Promise<void> {
    if (!this.appId) return
    try {
      const data = (await apiGet(this.apiDeps, `/api/auth/providers?app_id=${this.appId}`, '')) as {
        providers: string[]
      }
      this.availableProviders = data.providers ?? []
    } catch {
      this.availableProviders = []
    }
  }

  startOAuth(provider: string): void {
    const redirectUrl = encodeURIComponent(window.location.href)
    window.location.href = `${this.apiDeps.baseUrl}/api/auth/oauth/${provider}?app_id=${this.appId}&redirect=${redirectUrl}`
  }

  // ── Hash tokens (OAuth callback) ─────────────────────

  checkHashTokens(): boolean {
    const hash = window.location.hash
    if (!hash.includes('lmu_token=')) return false

    const params = new URLSearchParams(hash.slice(1))
    const token = params.get('lmu_token')
    const refresh = params.get('lmu_refresh')

    if (token && refresh) {
      this.storeTokens(token, refresh)
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
      return true
    }
    return false
  }

  // ── Initialization ───────────────────────────────────

  async init(): Promise<void> {
    this.checkHashTokens()
    await this.fetchProviders()

    const token = this.getStoredAccessToken()
    if (!token) {
      this._ready = true
      this.fireCallbacks()
      return
    }

    try {
      const data = (await apiGet(this.apiDeps, '/api/auth/me', token)) as { user: LetMeUseUser }
      this._currentUser = data.user
      this.scheduleRefresh()
    } catch {
      const rt = this.getStoredRefreshToken()
      if (rt) {
        try {
          const refreshData = (await apiPost(this.apiDeps, '/api/auth/refresh', { refreshToken: rt })) as {
            accessToken: string
            refreshToken: string
          }
          this.storeTokens(refreshData.accessToken, refreshData.refreshToken)
          const meData = (await apiGet(this.apiDeps, '/api/auth/me', refreshData.accessToken)) as {
            user: LetMeUseUser
          }
          this._currentUser = meData.user
          this.scheduleRefresh()
        } catch {
          this.clearTokens()
        }
      } else {
        this.clearTokens()
      }
    }

    this._ready = true
    this.fireCallbacks()
  }
}
