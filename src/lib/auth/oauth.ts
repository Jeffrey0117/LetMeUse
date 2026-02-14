import type { OAuthProviderName, OAuthProviderConfig } from '../auth-models'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'

// ── Provider configurations ─────────────────────────────

interface OAuthEndpoints {
  authorizeUrl: string
  tokenUrl: string
  userInfoUrl: string
  scopes: string[]
}

const PROVIDER_ENDPOINTS: Record<OAuthProviderName, OAuthEndpoints> = {
  google: {
    authorizeUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
    scopes: ['openid', 'email', 'profile'],
  },
  github: {
    authorizeUrl: 'https://github.com/login/oauth/authorize',
    tokenUrl: 'https://github.com/login/oauth/access_token',
    userInfoUrl: 'https://api.github.com/user',
    scopes: ['user:email', 'read:user'],
  },
}

// ── Generate OAuth URL ──────────────────────────────────

export function getOAuthAuthorizeUrl(
  provider: OAuthProviderName,
  config: OAuthProviderConfig,
  appId: string,
  state: string
): string {
  const endpoints = PROVIDER_ENDPOINTS[provider]
  const redirectUri = `${BASE_URL}/api/auth/oauth/${provider}/callback`

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: redirectUri,
    state,
    response_type: 'code',
    scope: endpoints.scopes.join(' '),
  })

  // Google requires access_type for refresh tokens
  if (provider === 'google') {
    params.set('access_type', 'offline')
    params.set('prompt', 'consent')
  }

  return `${endpoints.authorizeUrl}?${params.toString()}`
}

// ── Exchange code for tokens ────────────────────────────

interface OAuthTokens {
  accessToken: string
  refreshToken?: string
}

export async function exchangeCodeForTokens(
  provider: OAuthProviderName,
  config: OAuthProviderConfig,
  code: string
): Promise<OAuthTokens> {
  const endpoints = PROVIDER_ENDPOINTS[provider]
  const redirectUri = `${BASE_URL}/api/auth/oauth/${provider}/callback`

  const body: Record<string, string> = {
    client_id: config.clientId,
    client_secret: config.clientSecret,
    code,
    redirect_uri: redirectUri,
  }

  if (provider === 'google') {
    body.grant_type = 'authorization_code'
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/x-www-form-urlencoded',
  }

  // GitHub requires Accept header for JSON response
  if (provider === 'github') {
    headers['Accept'] = 'application/json'
  }

  const res = await fetch(endpoints.tokenUrl, {
    method: 'POST',
    headers,
    body: new URLSearchParams(body).toString(),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Token exchange failed: ${text}`)
  }

  const data = await res.json()

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
  }
}

// ── Fetch user info ─────────────────────────────────────

export interface OAuthUserInfo {
  id: string
  email: string
  name: string
  avatar?: string
}

export async function fetchOAuthUserInfo(
  provider: OAuthProviderName,
  accessToken: string
): Promise<OAuthUserInfo> {
  const endpoints = PROVIDER_ENDPOINTS[provider]

  const res = await fetch(endpoints.userInfoUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch user info from ${provider}`)
  }

  const data = await res.json()

  if (provider === 'google') {
    return {
      id: String(data.id),
      email: data.email,
      name: data.name ?? data.email,
      avatar: data.picture,
    }
  }

  // GitHub: email may not be in profile, need separate call
  if (provider === 'github') {
    let email = data.email as string | null

    if (!email) {
      const emailRes = await fetch('https://api.github.com/user/emails', {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      if (emailRes.ok) {
        const emails = await emailRes.json()
        const primary = emails.find((e: { primary: boolean; verified: boolean }) => e.primary && e.verified)
        email = primary?.email ?? emails[0]?.email ?? null
      }
    }

    if (!email) {
      throw new Error('Unable to retrieve email from GitHub')
    }

    return {
      id: String(data.id),
      email,
      name: data.name ?? data.login ?? email,
      avatar: data.avatar_url,
    }
  }

  throw new Error(`Unsupported provider: ${provider}`)
}

// ── Generate state token ────────────────────────────────

export function generateOAuthState(appId: string, redirectUrl?: string): string {
  const payload = JSON.stringify({ appId, redirectUrl, ts: Date.now() })
  // Base64 encode for URL safety
  return btoa(payload)
}

export function parseOAuthState(state: string): { appId: string; redirectUrl?: string } {
  try {
    const payload = JSON.parse(atob(state))
    return { appId: payload.appId, redirectUrl: payload.redirectUrl }
  } catch {
    throw new Error('Invalid OAuth state')
  }
}
