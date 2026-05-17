import { type NextRequest } from 'next/server'
import type { AuthUser, App, VerificationToken } from '@/lib/auth-models'
import { getById, create, APPS_FILE, USERS_FILE, VERIFICATION_TOKENS_FILE } from '@/lib/storage'
import { generateVerificationTokenId, generateVerificationToken } from '@/lib/id'
import { hashToken } from '@/lib/auth/token-hash'
import { sendVerificationEmail } from '@/lib/auth/email'
import { corsResponse, success, fail } from '@/lib/api-result'
import { checkRateLimit, rateLimitResponse, RATE_LIMITS } from '@/lib/rate-limit'
import { authenticateRequest } from '@/lib/auth/middleware'
import { NextResponse } from 'next/server'

export async function OPTIONS(request: NextRequest) {
  return corsResponse(request.headers.get('origin'))
}

// POST /api/auth/resend-verification — send a new verification email
export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin')

  // Rate limit: reuse forgotPassword limits (3 per hour per IP)
  const rateCheck = await checkRateLimit(request, 'resend-verification', RATE_LIMITS.forgotPassword)
  if (!rateCheck.allowed) {
    return rateLimitResponse(rateCheck.retryAfterSeconds!, origin)
  }

  try {
    const authResult = await authenticateRequest(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const user = await getById<AuthUser>(USERS_FILE, authResult.payload.sub)
    if (!user) {
      return fail('User not found', 404, origin)
    }

    if (user.emailVerified) {
      return success({ alreadyVerified: true }, 200, origin)
    }

    const app = await getById<App>(APPS_FILE, user.appId)
    if (!app) {
      return fail('App not found', 404, origin)
    }

    // Generate new verification token
    const vToken = generateVerificationToken()
    const now = new Date().toISOString()
    const vt: VerificationToken = {
      id: generateVerificationTokenId(),
      userId: user.id,
      appId: app.id,
      type: 'email_verification',
      tokenHash: hashToken(vToken),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      createdAt: now,
    }

    await create<VerificationToken>(VERIFICATION_TOKENS_FILE, vt)
    await sendVerificationEmail(user.email, vToken, app.name, 'zh', user.displayName)

    return success({ sent: true }, 200, origin)
  } catch (error) {
    return fail('Failed to send verification email', 500, origin)
  }
}
