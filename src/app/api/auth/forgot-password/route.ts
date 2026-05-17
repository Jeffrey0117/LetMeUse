import { type NextRequest } from 'next/server'
import { ForgotPasswordSchema, type AuthUser, type App, type VerificationToken } from '@/lib/auth-models'
import { findUserByAppAndEmail, getById, create, APPS_FILE, USERS_FILE, VERIFICATION_TOKENS_FILE } from '@/lib/storage'
import { generateVerificationTokenId, generateVerificationToken } from '@/lib/id'
import { hashToken } from '@/lib/auth/token-hash'
import { sendPasswordResetEmail } from '@/lib/auth/email'
import { corsResponse, success, fail } from '@/lib/api-result'
import { checkRateLimit, rateLimitResponse, RATE_LIMITS } from '@/lib/rate-limit'

export async function OPTIONS(request: NextRequest) {
  return corsResponse(request.headers.get('origin'))
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin')

  const rateCheck = await checkRateLimit(request, 'forgotPassword', RATE_LIMITS.forgotPassword)
  if (!rateCheck.allowed) {
    return rateLimitResponse(rateCheck.retryAfterSeconds!, origin)
  }

  try {
    const body = await request.json()
    const parsed = ForgotPasswordSchema.safeParse(body)

    if (!parsed.success) {
      const messages = parsed.error.issues.map((i) => i.message)
      return fail(messages.join(', '), 400, origin)
    }

    const { appId, email, locale } = parsed.data

    const app = await getById<App>(APPS_FILE, appId)
    if (!app) {
      // Don't reveal if app exists
      return success({ message: 'If the email exists, a reset link has been sent.' }, 200, origin)
    }

    const user = await findUserByAppAndEmail<AuthUser>(USERS_FILE, appId, email)

    if (!user) {
      // Don't reveal if user exists
      return success({ message: 'If the email exists, a reset link has been sent.' }, 200, origin)
    }

    // Create password reset token (expires in 1 hour)
    const now = new Date().toISOString()
    const token = generateVerificationToken()

    const verificationToken: VerificationToken = {
      id: generateVerificationTokenId(),
      userId: user.id,
      appId: app.id,
      type: 'password_reset',
      tokenHash: hashToken(token),
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      createdAt: now,
    }

    await create<VerificationToken>(VERIFICATION_TOKENS_FILE, verificationToken)

    // Send email with displayName for personalization
    await sendPasswordResetEmail(user.email, token, app.name, locale, user.displayName)

    return success({ message: 'If the email exists, a reset link has been sent.' }, 200, origin)
  } catch (error) {
        return fail('Password reset request failed', 500, origin)
  }
}
