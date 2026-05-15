import '@/lib/token-cleanup'
import { type NextRequest } from 'next/server'
import { z } from 'zod'
import type { App, AuthUser, RefreshToken } from '@/lib/auth-models'
import { getById, create, remove, findByField, APPS_FILE, USERS_FILE, REFRESH_TOKENS_FILE } from '@/lib/storage'
import { generateRefreshTokenId } from '@/lib/id'
import { signAccessToken, signRefreshTokenJWT } from '@/lib/auth/jwt'
import { hashToken } from '@/lib/auth/token-hash'
import { corsResponse, success, fail } from '@/lib/api-result'
import { checkRateLimit, rateLimitResponse, RATE_LIMITS } from '@/lib/rate-limit'
import { removeSessionByRefreshToken, createSession } from '@/lib/session'

const RefreshRequestSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
})

export async function OPTIONS(request: NextRequest) {
  return corsResponse(request.headers.get('origin'))
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin')

  const rateCheck = await checkRateLimit(request, 'refresh', RATE_LIMITS.refresh)
  if (!rateCheck.allowed) {
    return rateLimitResponse(rateCheck.retryAfterSeconds!, origin)
  }

  try {
    const body = await request.json()
    const parsed = RefreshRequestSchema.safeParse(body)

    if (!parsed.success) {
      return fail('Refresh token is required', 400, origin)
    }

    const { refreshToken: tokenString } = parsed.data

    const tokenHash = hashToken(tokenString)
    const matches = await findByField<RefreshToken>(REFRESH_TOKENS_FILE, 'tokenHash', tokenHash)
    const storedToken = matches[0] ?? null

    if (!storedToken) {
      return fail('Invalid refresh token', 401, origin)
    }

    if (new Date(storedToken.expiresAt) < new Date()) {
      await remove<RefreshToken>(REFRESH_TOKENS_FILE, storedToken.id)
      return fail('Refresh token expired', 401, origin)
    }

    const user = await getById<AuthUser>(USERS_FILE, storedToken.userId)
    if (!user || user.disabled) {
      return fail('User not found or disabled', 401, origin)
    }

    const app = await getById<App>(APPS_FILE, storedToken.appId)
    if (!app) {
      return fail('App not found', 401, origin)
    }

    await removeSessionByRefreshToken(storedToken.id)
    await remove<RefreshToken>(REFRESH_TOKENS_FILE, storedToken.id)

    const accessToken = await signAccessToken(user, app)
    const newRefreshTokenJWT = await signRefreshTokenJWT(user, app)

    const now = new Date().toISOString()
    const newRefreshToken: RefreshToken = {
      id: generateRefreshTokenId(),
      userId: user.id,
      appId: app.id,
      tokenHash: hashToken(newRefreshTokenJWT),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: now,
    }

    await create<RefreshToken>(REFRESH_TOKENS_FILE, newRefreshToken)

    await createSession({
      userId: user.id,
      appId: app.id,
      refreshTokenId: newRefreshToken.id,
      ip: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? undefined,
      userAgent: request.headers.get('user-agent') ?? undefined,
    })

    return success({ accessToken, refreshToken: newRefreshTokenJWT }, 200, origin)
  } catch (error) {
        return fail('Token refresh failed', 500, origin)
  }
}
