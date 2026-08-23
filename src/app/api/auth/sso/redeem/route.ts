import { type NextRequest } from 'next/server'
import { type App, type AuthUser, type RefreshToken, toPublicUser } from '@/lib/auth-models'
import { getById, findUserByAppAndEmail, create, update, APPS_FILE, USERS_FILE, REFRESH_TOKENS_FILE } from '@/lib/storage'
import { generateUserId, generateRefreshTokenId } from '@/lib/id'
import { signAccessToken, signRefreshTokenJWT } from '@/lib/auth/jwt'
import { hashToken } from '@/lib/auth/token-hash'
import { corsResponse, success, fail } from '@/lib/api-result'
import { checkRateLimit, rateLimitResponse, RATE_LIMITS } from '@/lib/rate-limit'
import { consumeSsoCode } from '@/lib/auth/sso-codes'
import { createSession } from '@/lib/session'
import { dispatchWebhook } from '@/lib/webhook'
import { writeAuditLog } from '@/lib/audit'

export async function OPTIONS(request: NextRequest) {
  return corsResponse(request.headers.get('origin'))
}

/**
 * 🔁 SSO 兌換：一次性 code → 目標 app 的 access/refresh tokens（回應形狀同 login）。
 * 目標 app 沒有同 email 帳號時自動開通（複製 passwordHash / displayName / 驗證狀態，
 * 之後用同一組帳密也能直接登入目標 app —— 同一個身分，兩邊互通）。
 */
export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin')

  const rateCheck = await checkRateLimit(request, 'login', RATE_LIMITS.login)
  if (!rateCheck.allowed) {
    return rateLimitResponse(rateCheck.retryAfterSeconds!, origin)
  }

  try {
    const body = await request.json().catch(() => ({}))
    const code = typeof body.code === 'string' ? body.code : ''
    const appId = typeof body.appId === 'string' ? body.appId : ''
    if (!code || !appId) {
      return fail('Invalid request', 400, origin)
    }

    const item = consumeSsoCode(code)
    if (!item || item.targetAppId !== appId) {
      return fail('Invalid or expired code', 401, origin)
    }

    const targetApp = await getById<App>(APPS_FILE, appId)
    const sourceUser = await getById<AuthUser>(USERS_FILE, item.userId)
    if (!targetApp || !sourceUser || sourceUser.disabled) {
      return fail('Invalid or expired code', 401, origin)
    }

    const now = new Date().toISOString()
    let user = await findUserByAppAndEmail<AuthUser>(USERS_FILE, appId, sourceUser.email)
    let created = false

    if (!user) {
      const sourceAvatar = (sourceUser as AuthUser & { avatarUrl?: string }).avatarUrl
      user = {
        id: generateUserId(),
        appId,
        email: sourceUser.email.toLowerCase(),
        passwordHash: sourceUser.passwordHash,
        displayName: sourceUser.displayName,
        role: 'user',
        disabled: false,
        emailVerified: sourceUser.emailVerified,
        createdAt: now,
        updatedAt: now,
        ...(sourceAvatar ? { avatarUrl: sourceAvatar } : {}),
      } as AuthUser
      await create<AuthUser>(USERS_FILE, user)
      created = true
      dispatchWebhook(targetApp, 'user.registered', { userId: user.id, email: user.email })
    }

    if (user.disabled) {
      return fail('Account is disabled', 403, origin)
    }
    if (targetApp.requireEmailVerification && !user.emailVerified) {
      return fail('Email not verified — 請先驗證信箱再登入', 403, origin)
    }

    await update<AuthUser>(USERS_FILE, user.id, { lastLoginAt: now, updatedAt: now } as Partial<AuthUser>)

    const accessToken = await signAccessToken(user, targetApp)
    const refreshTokenJWT = await signRefreshTokenJWT(user, targetApp)

    const refreshToken: RefreshToken = {
      id: generateRefreshTokenId(),
      userId: user.id,
      appId: targetApp.id,
      tokenHash: hashToken(refreshTokenJWT),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: now,
    }
    await create<RefreshToken>(REFRESH_TOKENS_FILE, refreshToken)

    await createSession({
      userId: user.id,
      appId: targetApp.id,
      refreshTokenId: refreshToken.id,
      ip: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? undefined,
      userAgent: request.headers.get('user-agent') ?? undefined,
    })

    dispatchWebhook(targetApp, 'user.login', { userId: user.id, email: user.email })
    writeAuditLog({
      action: 'user.login',
      actorId: user.id,
      actorEmail: user.email,
      appId: targetApp.id,
      details: { sso: true, sourceAppId: item.sourceAppId, provisioned: created },
      ip: request.headers.get('x-forwarded-for') ?? undefined,
    })

    return success(
      { user: toPublicUser({ ...user, lastLoginAt: now, updatedAt: now }), accessToken, refreshToken: refreshTokenJWT },
      200,
      origin
    )
  } catch {
    return fail('Redeem failed', 500, origin)
  }
}
