import { type NextRequest } from 'next/server'
import { RegisterSchema, type AuthUser, type RefreshToken, toPublicUser } from '@/lib/auth-models'
import type { App } from '@/lib/auth-models'
import { getAll, getById, create, APPS_FILE, USERS_FILE, REFRESH_TOKENS_FILE } from '@/lib/storage'
import { generateUserId, generateRefreshTokenId } from '@/lib/id'
import { hashPassword } from '@/lib/auth/password'
import { signAccessToken, signRefreshTokenJWT } from '@/lib/auth/jwt'
import { corsHeaders, corsResponse, jsonResponse, errorResponse } from '@/lib/auth/middleware'

export async function OPTIONS(request: NextRequest) {
  return corsResponse(request.headers.get('origin'))
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin')

  try {
    const body = await request.json()
    const parsed = RegisterSchema.safeParse(body)

    if (!parsed.success) {
      const messages = parsed.error.issues.map((i) => i.message)
      return errorResponse(messages.join(', '), 400, origin)
    }

    const { appId, email, password, displayName } = parsed.data

    const app = await getById<App>(APPS_FILE, appId)
    if (!app) {
      return errorResponse('App not found', 404, origin)
    }

    // Check email uniqueness within this app
    const existingUsers = await getAll<AuthUser>(USERS_FILE)
    const duplicate = existingUsers.find(
      (u) => u.appId === appId && u.email.toLowerCase() === email.toLowerCase()
    )
    if (duplicate) {
      return errorResponse('Email already registered', 409, origin)
    }

    const now = new Date().toISOString()
    const passwordHash = await hashPassword(password)

    const user: AuthUser = {
      id: generateUserId(),
      appId,
      email: email.toLowerCase(),
      passwordHash,
      displayName,
      role: 'user',
      disabled: false,
      createdAt: now,
      updatedAt: now,
    }

    await create<AuthUser>(USERS_FILE, user)

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
        user: toPublicUser(user),
        accessToken,
        refreshToken: refreshTokenJWT,
      },
      201,
      origin
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Registration failed'
    return errorResponse(message, 500, origin)
  }
}
