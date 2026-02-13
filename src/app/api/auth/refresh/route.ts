import { type NextRequest } from 'next/server'
import { z } from 'zod'
import type { App, AuthUser, RefreshToken } from '@/lib/auth-models'
import { getAll, getById, create, remove, APPS_FILE, USERS_FILE, REFRESH_TOKENS_FILE } from '@/lib/storage'
import { generateRefreshTokenId } from '@/lib/id'
import { signAccessToken, signRefreshTokenJWT } from '@/lib/auth/jwt'
import { corsResponse, jsonResponse, errorResponse } from '@/lib/auth/middleware'

const RefreshRequestSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
})

export async function OPTIONS(request: NextRequest) {
  return corsResponse(request.headers.get('origin'))
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin')

  try {
    const body = await request.json()
    const parsed = RefreshRequestSchema.safeParse(body)

    if (!parsed.success) {
      return errorResponse('Refresh token is required', 400, origin)
    }

    const { refreshToken: tokenString } = parsed.data

    const tokens = await getAll<RefreshToken>(REFRESH_TOKENS_FILE)
    const storedToken = tokens.find((t) => t.token === tokenString)

    if (!storedToken) {
      return errorResponse('Invalid refresh token', 401, origin)
    }

    if (new Date(storedToken.expiresAt) < new Date()) {
      await remove<RefreshToken>(REFRESH_TOKENS_FILE, storedToken.id)
      return errorResponse('Refresh token expired', 401, origin)
    }

    const user = await getById<AuthUser>(USERS_FILE, storedToken.userId)
    if (!user || user.disabled) {
      return errorResponse('User not found or disabled', 401, origin)
    }

    const app = await getById<App>(APPS_FILE, storedToken.appId)
    if (!app) {
      return errorResponse('App not found', 401, origin)
    }

    // Rotate: delete old, create new
    await remove<RefreshToken>(REFRESH_TOKENS_FILE, storedToken.id)

    const accessToken = await signAccessToken(user, app)
    const newRefreshTokenJWT = await signRefreshTokenJWT(user, app)

    const now = new Date().toISOString()
    const newRefreshToken: RefreshToken = {
      id: generateRefreshTokenId(),
      userId: user.id,
      appId: app.id,
      token: newRefreshTokenJWT,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: now,
    }

    await create<RefreshToken>(REFRESH_TOKENS_FILE, newRefreshToken)

    return jsonResponse(
      {
        accessToken,
        refreshToken: newRefreshTokenJWT,
      },
      200,
      origin
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Token refresh failed'
    return errorResponse(message, 500, origin)
  }
}
