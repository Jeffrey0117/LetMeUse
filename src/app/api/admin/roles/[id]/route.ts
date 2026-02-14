import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/middleware'
import { corsResponse, success, fail } from '@/lib/api-result'
import { getById, update, remove, ROLES_FILE } from '@/lib/storage'
import { UpdateRoleSchema, type Role } from '@/lib/rbac'

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
    const role = await getById<Role>(ROLES_FILE, id)
    if (!role) {
      return fail('Role not found', 404, origin)
    }

    return success({ role }, 200, origin)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to get role'
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
    const existing = await getById<Role>(ROLES_FILE, id)

    if (!existing) {
      return fail('Role not found', 404, origin)
    }

    if (existing.isBuiltin) {
      return fail('Cannot modify built-in roles', 403, origin)
    }

    const body = await request.json()
    const parsed = UpdateRoleSchema.safeParse(body)

    if (!parsed.success) {
      const messages = parsed.error.issues.map((i) => i.message)
      return fail(messages.join(', '), 400, origin)
    }

    // Prevent renaming to reserved names
    if (parsed.data.name && (parsed.data.name === 'admin' || parsed.data.name === 'user')) {
      return fail('Cannot use reserved role name', 409, origin)
    }

    const now = new Date().toISOString()
    const updated = await update<Role>(ROLES_FILE, id, {
      ...parsed.data,
      updatedAt: now,
    } as Partial<Role>)

    if (!updated) {
      return fail('Failed to update role', 500, origin)
    }

    return success({ role: updated }, 200, origin)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update role'
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
    const existing = await getById<Role>(ROLES_FILE, id)

    if (!existing) {
      return fail('Role not found', 404, origin)
    }

    if (existing.isBuiltin) {
      return fail('Cannot delete built-in roles', 403, origin)
    }

    await remove<Role>(ROLES_FILE, id)

    return success({ deleted: true }, 200, origin)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete role'
    return fail(message, 500, origin)
  }
}
