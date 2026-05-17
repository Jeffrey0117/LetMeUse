import { type NextRequest } from 'next/server'
import { ResetPasswordSchema, type AuthUser, type App, type VerificationToken } from '@/lib/auth-models'
import { findByFields, getById, update, remove, USERS_FILE, VERIFICATION_TOKENS_FILE, APPS_FILE } from '@/lib/storage'
import { hashPassword } from '@/lib/auth/password'
import { hashToken } from '@/lib/auth/token-hash'
import { corsResponse, success, fail } from '@/lib/api-result'
import { checkRateLimit, rateLimitResponse, RATE_LIMITS } from '@/lib/rate-limit'
import { dispatchWebhook } from '@/lib/webhook'
import { writeAuditLog } from '@/lib/audit'
import { revokeAllUserSessions, revokeAllUserRefreshTokens } from '@/lib/session'

export async function OPTIONS(request: NextRequest) {
  return corsResponse(request.headers.get('origin'))
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin')

  const rateCheck = await checkRateLimit(request, 'resetPassword', RATE_LIMITS.resetPassword)
  if (!rateCheck.allowed) {
    return rateLimitResponse(rateCheck.retryAfterSeconds!, origin)
  }

  try {
    const body = await request.json()
    const parsed = ResetPasswordSchema.safeParse(body)

    if (!parsed.success) {
      const messages = parsed.error.issues.map((i) => i.message)
      return fail(messages.join(', '), 400, origin)
    }

    const { token, password } = parsed.data

    const matches = await findByFields<VerificationToken>(VERIFICATION_TOKENS_FILE, {
      tokenHash: hashToken(token),
      type: 'password_reset',
    })
    const resetToken = matches[0] ?? null

    if (!resetToken) {
      return fail('Invalid or expired reset token', 400, origin)
    }

    if (new Date(resetToken.expiresAt) < new Date()) {
      await remove<VerificationToken>(VERIFICATION_TOKENS_FILE, resetToken.id)
      return fail('Reset token has expired', 400, origin)
    }

    // Update password
    const now = new Date().toISOString()
    const passwordHash = await hashPassword(password)

    const updatedUser = await update<AuthUser>(USERS_FILE, resetToken.userId, {
      passwordHash,
      updatedAt: now,
    } as Partial<AuthUser>)

    // Delete the used token
    await remove<VerificationToken>(VERIFICATION_TOKENS_FILE, resetToken.id)

    // Invalidate all sessions and refresh tokens for security
    await revokeAllUserSessions(resetToken.userId)
    await revokeAllUserRefreshTokens(resetToken.userId)

    // Dispatch webhook
    const app = await getById<App>(APPS_FILE, resetToken.appId)
    if (app) {
      dispatchWebhook(app, 'user.password_reset', {
        userId: resetToken.userId,
      })
    }

    // Write audit log
    writeAuditLog({
      action: 'user.password_reset',
      actorId: resetToken.userId,
      actorEmail: updatedUser?.email,
      appId: resetToken.appId,
      ip: request.headers.get('x-forwarded-for') ?? undefined,
    })

    return success({ message: 'Password has been reset successfully.' }, 200, origin)
  } catch (error) {
        return fail('Password reset failed', 500, origin)
  }
}
