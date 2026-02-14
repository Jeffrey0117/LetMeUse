import { type NextRequest } from 'next/server'
import { LoginSchema, type AuthUser, type RefreshToken, toPublicUser } from '@/lib/auth-models'
import type { App } from '@/lib/auth-models'
import { getAll, getById, update, create, APPS_FILE, USERS_FILE, REFRESH_TOKENS_FILE } from '@/lib/storage'
import { generateRefreshTokenId } from '@/lib/id'
import { verifyPassword } from '@/lib/auth/password'
import { signAccessToken, signRefreshTokenJWT } from '@/lib/auth/jwt'
import { corsResponse, success, fail } from '@/lib/api-result'
import { checkRateLimit, recordFailure, resetFailures, rateLimitResponse, RATE_LIMITS } from '@/lib/rate-limit'
import { dispatchWebhook } from '@/lib/webhook'
import { writeAuditLog } from '@/lib/audit'
import { createSession } from '@/lib/session'

export async function OPTIONS(request: NextRequest) {
  return corsResponse(request.headers.get('origin'))
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin')

  const rateCheck = checkRateLimit(request, 'login', RATE_LIMITS.login)
  if (!rateCheck.allowed) {
    return rateLimitResponse(rateCheck.retryAfterSeconds!, origin)
  }

  try {
    const body = await request.json()
    const parsed = LoginSchema.safeParse(body)

    if (!parsed.success) {
      const messages = parsed.error.issues.map((i) => i.message)
      return fail(messages.join(', '), 400, origin)
    }

    const { appId, email, password } = parsed.data

    const app = await getById<App>(APPS_FILE, appId)
    if (!app) {
      return fail('Invalid credentials', 401, origin)
    }

    const users = await getAll<AuthUser>(USERS_FILE)
    const user = users.find(
      (u) => u.appId === appId && u.email.toLowerCase() === email.toLowerCase()
    )

    if (!user) {
      recordFailure(request, 'login', RATE_LIMITS.login)
      writeAuditLog({ action: 'user.login_failed', actorId: 'unknown', appId, details: { email }, ip: request.headers.get('x-forwarded-for') ?? undefined })
      return fail('Invalid credentials', 401, origin)
    }

    if (user.disabled) {
      return fail('Account is disabled', 403, origin)
    }

    const valid = await verifyPassword(password, user.passwordHash)
    if (!valid) {
      recordFailure(request, 'login', RATE_LIMITS.login)
      writeAuditLog({ action: 'user.login_failed', actorId: user.id, actorEmail: user.email, appId, ip: request.headers.get('x-forwarded-for') ?? undefined })
      return fail('Invalid credentials', 401, origin)
    }

    resetFailures(request, 'login')

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

    await createSession({
      userId: user.id,
      appId: app.id,
      refreshTokenId: refreshToken.id,
      ip: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? undefined,
      userAgent: request.headers.get('user-agent') ?? undefined,
    })

    dispatchWebhook(app, 'user.login', {
      userId: user.id,
      email: user.email,
    })

    writeAuditLog({ action: 'user.login', actorId: user.id, actorEmail: user.email, appId: app.id, ip: request.headers.get('x-forwarded-for') ?? undefined })

    return success(
      { user: toPublicUser({ ...user, lastLoginAt: now }), accessToken, refreshToken: refreshTokenJWT },
      200,
      origin
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Login failed'
    return fail(message, 500, origin)
  }
}
