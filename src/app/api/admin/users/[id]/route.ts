import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { UpdateUserAdminSchema, type AuthUser, toPublicUser } from '@/lib/auth-models'
import { getById, update, remove, USERS_FILE } from '@/lib/storage'
import { requireAdmin } from '@/lib/auth/middleware'
import { corsResponse, jsonResponse, errorResponse } from '@/lib/auth/middleware'

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
      return errorResponse('User not found', 404, origin)
    }

    return jsonResponse({ user: toPublicUser(user) }, 200, origin)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to get user'
    return errorResponse(message, 500, origin)
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
      return errorResponse(messages.join(', '), 400, origin)
    }

    const now = new Date().toISOString()
    const updated = await update<AuthUser>(USERS_FILE, id, {
      ...parsed.data,
      updatedAt: now,
    } as Partial<AuthUser>)

    if (!updated) {
      return errorResponse('User not found', 404, origin)
    }

    return jsonResponse({ user: toPublicUser(updated) }, 200, origin)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update user'
    return errorResponse(message, 500, origin)
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
    const deleted = await remove<AuthUser>(USERS_FILE, id)
    if (!deleted) {
      return errorResponse('User not found', 404, origin)
    }

    return jsonResponse({ success: true }, 200, origin)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete user'
    return errorResponse(message, 500, origin)
  }
}
