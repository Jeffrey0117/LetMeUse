import { type NextRequest } from 'next/server'
import { LoginSchema, type AuthUser, type RefreshToken, toPublicUser } from '@/lib/auth-models'
import type { App } from '@/lib/auth-models'
import { findUserByAppAndEmail, getById, update, create, APPS_FILE, USERS_FILE, REFRESH_TOKENS_FILE } from '@/lib/storage'
import { generateRefreshTokenId } from '@/lib/id'
import { verifyPassword, DUMMY_HASH } from '@/lib/auth/password'
import { signAccessToken, signRefreshTokenJWT } from '@/lib/auth/jwt'
import { hashToken } from '@/lib/auth/token-hash'
import { corsResponse, success, fail } from '@/lib/api-result'
import { checkRateLimit, recordFailure, resetFailures, rateLimitResponse, RATE_LIMITS, checkRateLimitByKey, recordFailureByKey, resetFailuresByKey, getClientIp } from '@/lib/rate-limit'
import { dispatchWebhook } from '@/lib/webhook'
import { writeAuditLog } from '@/lib/audit'
import { createSession } from '@/lib/session'

export async function OPTIONS(request: NextRequest) {
  return corsResponse(request.headers.get('origin'))
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin')

  const rateCheck = await checkRateLimit(request, 'login', RATE_LIMITS.login)
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

    // 🔒 兩層帳號鎖:
    //  1. 帳號 + 來源位址:錯 5 次鎖 15 分鐘 — 擋單一來源猜密碼,但別人猜錯不會鎖到本人。
    //  2. 整個帳號:錯 20 次鎖 15 分鐘 — 換 IP 分散猜也有上限 (撞庫防護仍在)。
    // 原本只有「整個帳號錯 5 次就鎖」,任何人都能用 5 個亂猜的密碼把別人鎖在外面。
    const acctKey = `login-acct:${appId}:${email.toLowerCase()}`
    const acctIpKey = `${acctKey}:${getClientIp(request)}`
    const acctIpCheck = await checkRateLimitByKey(acctIpKey, RATE_LIMITS.login)
    if (!acctIpCheck.allowed) {
      return rateLimitResponse(acctIpCheck.retryAfterSeconds ?? 900, origin)
    }
    const acctCheck = await checkRateLimitByKey(acctKey, RATE_LIMITS.loginAccount)
    if (!acctCheck.allowed) {
      return rateLimitResponse(acctCheck.retryAfterSeconds ?? 900, origin)
    }

    const app = await getById<App>(APPS_FILE, appId)
    if (!app) {
      return fail('Invalid credentials', 401, origin)
    }

    const user = await findUserByAppAndEmail<AuthUser>(USERS_FILE, appId, email)

    // Always run bcrypt to prevent timing-based user enumeration
    const valid = await verifyPassword(password, user?.passwordHash ?? DUMMY_HASH)

    if (!user || !valid) {
      await recordFailure(request, 'login', RATE_LIMITS.login)
      await recordFailureByKey(acctIpKey, RATE_LIMITS.login)
      await recordFailureByKey(acctKey, RATE_LIMITS.loginAccount)
      writeAuditLog({ action: 'user.login_failed', actorId: user?.id ?? 'unknown', actorEmail: user?.email, appId, details: user ? undefined : { email }, ip: request.headers.get('x-forwarded-for') ?? undefined })
      return fail('Invalid credentials', 401, origin)
    }

    if (user.disabled) {
      return fail('Account is disabled', 403, origin)
    }

    // 🔒 只對「有開啟 requireEmailVerification」的 app 強制 — 不影響其他 app 既有用戶
    if (app.requireEmailVerification && !user.emailVerified) {
      return fail('Email not verified — 請先驗證信箱再登入', 403, origin)
    }

    await resetFailures(request, 'login')
    await resetFailuresByKey(acctIpKey)
    await resetFailuresByKey(acctKey)

    const now = new Date().toISOString()
    await update<AuthUser>(USERS_FILE, user.id, { lastLoginAt: now, updatedAt: now } as Partial<AuthUser>)

    const accessToken = await signAccessToken(user, app)
    const refreshTokenJWT = await signRefreshTokenJWT(user, app)

    const refreshToken: RefreshToken = {
      id: generateRefreshTokenId(),
      userId: user.id,
      appId: app.id,
      tokenHash: hashToken(refreshTokenJWT),
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
      { user: toPublicUser({ ...user, lastLoginAt: now, updatedAt: now }), accessToken, refreshToken: refreshTokenJWT },
      200,
      origin
    )
  } catch (error) {
    // 一定要留噪音:2026-09-09 全站登入 500 事故,catch 靜默吞錯讓根因追了一下午
    console.error('[auth/login] unhandled error:', error)
    return fail('Login failed', 500, origin)
  }
}
