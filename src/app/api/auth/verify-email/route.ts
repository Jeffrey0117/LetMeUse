import { type NextRequest, NextResponse } from 'next/server'
import { getAll, getById, update, remove, USERS_FILE, VERIFICATION_TOKENS_FILE, APPS_FILE } from '@/lib/storage'
import type { AuthUser, App, VerificationToken } from '@/lib/auth-models'
import { corsResponse, success, fail } from '@/lib/api-result'
import { dispatchWebhook } from '@/lib/webhook'
import { writeAuditLog } from '@/lib/audit'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'

export async function OPTIONS(request: NextRequest) {
  return corsResponse(request.headers.get('origin'))
}

export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin')

  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return fail('Missing token parameter', 400, origin)
    }

    const tokens = await getAll<VerificationToken>(VERIFICATION_TOKENS_FILE)
    const verificationToken = tokens.find(
      (t) => t.token === token && t.type === 'email_verification'
    )

    if (!verificationToken) {
      return fail('Invalid or expired verification token', 400, origin)
    }

    if (new Date(verificationToken.expiresAt) < new Date()) {
      await remove<VerificationToken>(VERIFICATION_TOKENS_FILE, verificationToken.id)
      return fail('Verification token has expired', 400, origin)
    }

    // Mark user email as verified
    const now = new Date().toISOString()
    const updatedUser = await update<AuthUser>(USERS_FILE, verificationToken.userId, {
      emailVerified: true,
      updatedAt: now,
    } as Partial<AuthUser>)

    // Delete the used token
    await remove<VerificationToken>(VERIFICATION_TOKENS_FILE, verificationToken.id)

    // Dispatch webhook
    const app = await getById<App>(APPS_FILE, verificationToken.appId)
    if (app) {
      dispatchWebhook(app, 'user.email_verified', {
        userId: verificationToken.userId,
      })
    }

    // Write audit log
    writeAuditLog({
      action: 'user.email_verified',
      actorId: verificationToken.userId,
      actorEmail: updatedUser?.email,
      appId: verificationToken.appId,
    })

    // Redirect to login with success message
    return NextResponse.redirect(`${BASE_URL}/login?verified=true`)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Verification failed'
    return fail(message, 500, origin)
  }
}
