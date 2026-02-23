import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import type { AuthUser, App } from '@/lib/auth-models'
import { getById, update, USERS_FILE, APPS_FILE } from '@/lib/storage'
import { verifyPassword, hashPassword } from '@/lib/auth/password'
import { authenticateRequest } from '@/lib/auth/middleware'
import { corsResponse, success, fail } from '@/lib/api-result'
import { dispatchWebhook } from '@/lib/webhook'
import { writeAuditLog } from '@/lib/audit'

const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters'),
})

export async function OPTIONS(request: NextRequest) {
  return corsResponse(request.headers.get('origin'))
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin')

  try {
    const authResult = await authenticateRequest(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const body = await request.json()
    const parsed = ChangePasswordSchema.safeParse(body)

    if (!parsed.success) {
      const messages = parsed.error.issues.map((i) => i.message)
      return fail(messages.join(', '), 400, origin)
    }

    const { currentPassword, newPassword } = parsed.data

    const user = await getById<AuthUser>(USERS_FILE, authResult.payload.sub)
    if (!user) {
      return fail('User not found', 404, origin)
    }

    const isValid = await verifyPassword(currentPassword, user.passwordHash)
    if (!isValid) {
      return fail('Current password is incorrect', 401, origin)
    }

    const now = new Date().toISOString()
    const passwordHash = await hashPassword(newPassword)

    const updated = await update<AuthUser>(USERS_FILE, user.id, {
      passwordHash,
      updatedAt: now,
    } as Partial<AuthUser>)

    if (!updated) {
      return fail('Failed to update password', 500, origin)
    }

    const app = await getById<App>(APPS_FILE, user.appId)
    if (app) {
      dispatchWebhook(app, 'user.password_reset', {
        userId: user.id,
        email: user.email,
      })
    }

    writeAuditLog({
      action: 'user.password_reset',
      actorId: user.id,
      actorEmail: user.email,
      appId: user.appId,
      ip: request.headers.get('x-forwarded-for') ?? undefined,
    })

    return success({ message: 'Password changed successfully' }, 200, origin)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to change password'
    return fail(message, 500, origin)
  }
}
