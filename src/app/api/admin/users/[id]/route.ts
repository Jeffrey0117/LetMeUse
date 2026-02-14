import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { UpdateUserAdminSchema, type AuthUser, type App, toPublicUser } from '@/lib/auth-models'
import { getById, update, remove, USERS_FILE, APPS_FILE } from '@/lib/storage'
import { requireAdmin } from '@/lib/auth/middleware'
import { corsResponse, success, fail } from '@/lib/api-result'
import { dispatchWebhook } from '@/lib/webhook'
import { writeAuditLog } from '@/lib/audit'

export async function OPTIONS(request: NextRequest) {
  return corsResponse(request.headers.get('origin'))
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const origin = request.headers.get('origin')

  try {
    const authResult = await requireAdmin(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { id } = await params
    const user = await getById<AuthUser>(USERS_FILE, id)
    if (!user) {
      return fail('User not found', 404, origin)
    }

    return success({ user: toPublicUser(user) }, 200, origin)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to get user'
    return fail(message, 500, origin)
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const origin = request.headers.get('origin')

  try {
    const authResult = await requireAdmin(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { id } = await params
    const body = await request.json()
    const parsed = UpdateUserAdminSchema.safeParse(body)

    if (!parsed.success) {
      const messages = parsed.error.issues.map((i) => i.message)
      return fail(messages.join(', '), 400, origin)
    }

    const now = new Date().toISOString()
    const updated = await update<AuthUser>(USERS_FILE, id, {
      ...parsed.data,
      updatedAt: now,
    } as Partial<AuthUser>)

    if (!updated) {
      return fail('User not found', 404, origin)
    }

    const app = await getById<App>(APPS_FILE, updated.appId)
    if (app) {
      const eventType = parsed.data.disabled !== undefined
        ? (parsed.data.disabled ? 'user.disabled' : 'user.enabled')
        : 'user.updated'
      dispatchWebhook(app, eventType, {
        userId: updated.id,
        email: updated.email,
        changes: Object.keys(parsed.data),
      })
    }

    const auditAction = parsed.data.disabled !== undefined
      ? (parsed.data.disabled ? 'admin.user_disabled' : 'admin.user_enabled')
      : 'admin.user_updated'
    writeAuditLog({
      action: auditAction,
      actorId: authResult.payload.sub,
      actorEmail: authResult.payload.email,
      appId: updated.appId,
      targetId: updated.id,
      targetType: 'user',
      details: parsed.data as Record<string, unknown>,
    })

    return success({ user: toPublicUser(updated) }, 200, origin)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update user'
    return fail(message, 500, origin)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const origin = request.headers.get('origin')

  try {
    const authResult = await requireAdmin(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { id } = await params
    const user = await getById<AuthUser>(USERS_FILE, id)
    const deleted = await remove<AuthUser>(USERS_FILE, id)
    if (!deleted) {
      return fail('User not found', 404, origin)
    }

    if (user) {
      const app = await getById<App>(APPS_FILE, user.appId)
      if (app) {
        dispatchWebhook(app, 'user.deleted', {
          userId: user.id,
          email: user.email,
        })
      }
      writeAuditLog({
        action: 'admin.user_deleted',
        actorId: authResult.payload.sub,
        actorEmail: authResult.payload.email,
        appId: user.appId,
        targetId: user.id,
        targetType: 'user',
      })
    }

    return success({ deleted: true }, 200, origin)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete user'
    return fail(message, 500, origin)
  }
}
