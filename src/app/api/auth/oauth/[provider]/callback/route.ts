import { type NextRequest, NextResponse } from 'next/server'
import { getById, getAll, create, update, APPS_FILE, USERS_FILE, REFRESH_TOKENS_FILE } from '@/lib/storage'
import type { App, AuthUser, RefreshToken, OAuthProviderName } from '@/lib/auth-models'
import { OAUTH_PROVIDER_NAMES } from '@/lib/auth-models'
import { generateUserId, generateRefreshTokenId } from '@/lib/id'
import { signAccessToken, signRefreshTokenJWT } from '@/lib/auth/jwt'
import { hashPassword } from '@/lib/auth/password'
import { exchangeCodeForTokens, fetchOAuthUserInfo, parseOAuthState } from '@/lib/auth/oauth'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'

type RouteParams = { params: Promise<{ provider: string }> }

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { provider } = await params
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    if (error) {
      return redirectWithError(`OAuth denied: ${error}`)
    }

    if (!code || !state) {
      return redirectWithError('Missing code or state parameter')
    }

    if (!OAUTH_PROVIDER_NAMES.includes(provider as OAuthProviderName)) {
      return redirectWithError(`Unsupported provider: ${provider}`)
    }

    const providerName = provider as OAuthProviderName

    // Parse state — need to decode appId first to look up secret for verification
    const dotIdx = state.lastIndexOf('.')
    if (dotIdx === -1) return redirectWithError('Invalid OAuth state')
    const rawPayload = JSON.parse(atob(state.slice(0, dotIdx)))
    const appId = rawPayload.appId as string

    const app = await getById<App>(APPS_FILE, appId)
    if (!app) {
      return redirectWithError('App not found')
    }

    // Verify signature with app secret
    const { redirectUrl } = await parseOAuthState(state, app.secret)

    const providerConfig = app.oauthProviders?.[providerName]
    if (!providerConfig?.enabled) {
      return redirectWithError(`${provider} OAuth is not configured`)
    }

    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(providerName, providerConfig, code)

    // Fetch user info from provider
    const oauthUser = await fetchOAuthUserInfo(providerName, tokens.accessToken)

    // Find or create user
    const now = new Date().toISOString()
    const users = await getAll<AuthUser>(USERS_FILE)

    // Check for existing user by OAuth ID + provider
    let user = users.find(
      (u) => u.appId === appId && u.oauthProvider === providerName && u.oauthId === oauthUser.id
    )

    if (!user) {
      // Check for existing user by email (account linking)
      const existingByEmail = users.find(
        (u) => u.appId === appId && u.email.toLowerCase() === oauthUser.email.toLowerCase()
      )

      if (existingByEmail) {
        // Link OAuth to existing account
        const updated = await update<AuthUser>(USERS_FILE, existingByEmail.id, {
          oauthProvider: providerName,
          oauthId: oauthUser.id,
          avatar: existingByEmail.avatar ?? oauthUser.avatar,
          lastLoginAt: now,
          updatedAt: now,
        } as Partial<AuthUser>)
        user = updated ?? existingByEmail
      } else {
        // Create new user
        const randomPassword = crypto.randomUUID()
        user = {
          id: generateUserId(),
          appId,
          email: oauthUser.email.toLowerCase(),
          passwordHash: await hashPassword(randomPassword),
          displayName: oauthUser.name,
          avatar: oauthUser.avatar,
          role: 'user',
          disabled: false,
          oauthProvider: providerName,
          oauthId: oauthUser.id,
          createdAt: now,
          updatedAt: now,
          lastLoginAt: now,
        }
        await create<AuthUser>(USERS_FILE, user)
      }
    } else {
      // Update last login
      await update<AuthUser>(USERS_FILE, user.id, {
        lastLoginAt: now,
        updatedAt: now,
        avatar: user.avatar ?? oauthUser.avatar,
      } as Partial<AuthUser>)
    }

    if (user.disabled) {
      return redirectWithError('Account is disabled')
    }

    // Sign JWT tokens
    const accessToken = await signAccessToken(user, app)
    const refreshTokenJWT = await signRefreshTokenJWT(user, app)

    const refreshToken: RefreshToken = {
      id: generateRefreshTokenId(),
      userId: user.id,
      appId: app.id,
      token: refreshTokenJWT,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: now,
    }

    await create<RefreshToken>(REFRESH_TOKENS_FILE, refreshToken)

    // Build redirect URL with tokens in hash fragment
    const targetUrl = redirectUrl ?? `${BASE_URL}/login`
    const url = new URL(targetUrl)
    url.hash = `lmu_token=${accessToken}&lmu_refresh=${refreshTokenJWT}&lmu_provider=${providerName}`

    return NextResponse.redirect(url.toString())
  } catch (error) {
    const message = error instanceof Error ? error.message : 'OAuth callback failed'
    return redirectWithError(message)
  }
}

function redirectWithError(error: string): NextResponse {
  const url = new URL(`${BASE_URL}/login`)
  url.searchParams.set('error', error)
  return NextResponse.redirect(url.toString())
}
