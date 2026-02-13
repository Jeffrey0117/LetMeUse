import { type NextRequest } from 'next/server'
import { LoginSchema, type AuthUser, type RefreshToken, toPublicUser } from '@/lib/auth-models'
import type { App } from '@/lib/auth-models'
import { getAll, getById, update, create, APPS_FILE, USERS_FILE, REFRESH_TOKENS_FILE } from '@/lib/storage'
import { generateRefreshTokenId } from '@/lib/id'
import { verifyPassword } from '@/lib/auth/password'
import { signAccessToken, signRefreshTokenJWT } from '@/lib/auth/jwt'
import { corsResponse, jsonResponse, errorResponse } from '@/lib/auth/middleware'

export async function OPTIONS(request: NextRequest) {
  return corsResponse(request.headers.get('origin'))
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin')

  try {
    const body = await request.json()
    const parsed = LoginSchema.safeParse(body)

    if (!parsed.success) {
      const messages = parsed.error.issues.map((i) => i.message)
      return errorResponse(messages.join(', '), 400, origin)
    }

    const { appId, email, password } = parsed.data

    const app = await getById<App>(APPS_FILE, appId)
    if (!app) {
      return errorResponse('Invalid credentials', 401, origin)
    }

    const users = await getAll<AuthUser>(USERS_FILE)
    const user = users.find(
      (u) => u.appId === appId && u.email.toLowerCase() === email.toLowerCase()
    )

    if (!user) {
      return errorResponse('Invalid credentials', 401, origin)
    }

    if (user.disabled) {
      return errorResponse('Account is disabled', 403, origin)
    }

    const valid = await verifyPassword(password, user.passwordHash)
    if (!valid) {
      return errorResponse('Invalid credentials', 401, origin)
    }

    const now = new Date().toISOString()
    await update<AuthUser>(USERS_FILE, user.id, { lastLoginAt: now, updatedAt: now } as Partial<AuthUser>)

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

    return jsonResponse(
      {
        user: toPublicUser({ ...user, lastLoginAt: now }),
        accessToken,
        refreshToken: refreshTokenJWT,
      },
      200,
      origin
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Login failed'
    return errorResponse(message, 500, origin)
  }
}
