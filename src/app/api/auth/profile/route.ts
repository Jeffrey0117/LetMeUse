import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { UpdateProfileSchema, type AuthUser, type App, toPublicUser } from '@/lib/auth-models'
import { getById, update, USERS_FILE, APPS_FILE } from '@/lib/storage'
import { authenticateRequest } from '@/lib/auth/middleware'
import { corsResponse, success, fail } from '@/lib/api-result'
import { dispatchWebhook } from '@/lib/webhook'

export async function OPTIONS(request: NextRequest) {
  return corsResponse(request.headers.get('origin'))
}

export async function PUT(request: NextRequest) {
  const origin = request.headers.get('origin')

  try {
    const authResult = await authenticateRequest(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const body = await request.json()
    const parsed = UpdateProfileSchema.safeParse(body)

    if (!parsed.success) {
      const messages = parsed.error.issues.map((i) => i.message)
      return fail(messages.join(', '), 400, origin)
    }

    const user = await getById<AuthUser>(USERS_FILE, authResult.payload.sub)
    if (!user) {
      return fail('User not found', 404, origin)
    }

    const now = new Date().toISOString()
    const updated = await update<AuthUser>(USERS_FILE, user.id, {
      ...parsed.data,
      updatedAt: now,
    } as Partial<AuthUser>)

    if (!updated) {
      return fail('Failed to update profile', 500, origin)
    }

    const app = await getById<App>(APPS_FILE, updated.appId)
    if (app) {
      dispatchWebhook(app, 'user.updated', {
        userId: updated.id,
        email: updated.email,
        changes: Object.keys(parsed.data),
      })
    }

    return success({ user: toPublicUser(updated) }, 200, origin)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Profile update failed'
    return fail(message, 500, origin)
  }
}
