import { type NextRequest } from 'next/server'
import { RegisterSchema, type AuthUser, type RefreshToken, type VerificationToken, toPublicUser } from '@/lib/auth-models'
import type { App } from '@/lib/auth-models'
import { getAll, getById, create, APPS_FILE, USERS_FILE, REFRESH_TOKENS_FILE, VERIFICATION_TOKENS_FILE } from '@/lib/storage'
import { generateUserId, generateRefreshTokenId, generateVerificationTokenId, generateVerificationToken } from '@/lib/id'
import { hashPassword } from '@/lib/auth/password'
import { signAccessToken, signRefreshTokenJWT } from '@/lib/auth/jwt'
import { sendVerificationEmail } from '@/lib/auth/email'
import { corsResponse, success, fail } from '@/lib/api-result'
import { checkRateLimit, rateLimitResponse, RATE_LIMITS } from '@/lib/rate-limit'
import { dispatchWebhook } from '@/lib/webhook'
import { writeAuditLog } from '@/lib/audit'
import { createSession } from '@/lib/session'

export async function OPTIONS(request: NextRequest) {
  return corsResponse(request.headers.get('origin'))
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin')

  const rateCheck = checkRateLimit(request, 'register', RATE_LIMITS.register)
  if (!rateCheck.allowed) {
    return rateLimitResponse(rateCheck.retryAfterSeconds!, origin)
  }

  try {
    const body = await request.json()
    const parsed = RegisterSchema.safeParse(body)

    if (!parsed.success) {
      const messages = parsed.error.issues.map((i) => i.message)
      return fail(messages.join(', '), 400, origin)
    }

    const { appId, email, password, displayName } = parsed.data

    const app = await getById<App>(APPS_FILE, appId)
    if (!app) {
      return fail('App not found', 404, origin)
    }

    const existingUsers = await getAll<AuthUser>(USERS_FILE)
    const duplicate = existingUsers.find(
      (u) => u.appId === appId && u.email.toLowerCase() === email.toLowerCase()
    )
    if (duplicate) {
      return fail('Email already registered', 409, origin)
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
      emailVerified: false,
      createdAt: now,
      updatedAt: now,
    }

    await create<AuthUser>(USERS_FILE, user)

    // Send verification email if configured
    if (app.requireEmailVerification) {
      const vToken = generateVerificationToken()
      const vt: VerificationToken = {
        id: generateVerificationTokenId(),
        userId: user.id,
        appId: app.id,
        type: 'email_verification',
        token: vToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        createdAt: now,
      }
      await create<VerificationToken>(VERIFICATION_TOKENS_FILE, vt)
      await sendVerificationEmail(user.email, vToken, app.name)
    }

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

    await createSession({
      userId: user.id,
      appId: app.id,
      refreshTokenId: refreshToken.id,
      ip: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? undefined,
      userAgent: request.headers.get('user-agent') ?? undefined,
    })

    dispatchWebhook(app, 'user.registered', {
      userId: user.id,
      email: user.email,
      displayName: user.displayName,
    })

    writeAuditLog({ action: 'user.register', actorId: user.id, actorEmail: user.email, appId: app.id, ip: request.headers.get('x-forwarded-for') ?? undefined })

    return success(
      { user: toPublicUser(user), accessToken, refreshToken: refreshTokenJWT },
      201,
      origin
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Registration failed'
    return fail(message, 500, origin)
  }
}
