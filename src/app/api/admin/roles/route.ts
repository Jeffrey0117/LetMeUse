import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/middleware'
import { corsResponse, success, fail } from '@/lib/api-result'
import { create } from '@/lib/storage'
import { ROLES_FILE } from '@/lib/storage'
import { generateRoleId } from '@/lib/id'
import { CreateRoleSchema, getRolesForApp, BUILTIN_ROLES, type Role } from '@/lib/rbac'

export async function OPTIONS(request: NextRequest) {
  return corsResponse(request.headers.get('origin'))
}

export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin')

  try {
    const authResult = await requireAdmin(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { searchParams } = new URL(request.url)
    const appId = searchParams.get('appId')

    if (!appId) {
      return fail('appId is required', 400, origin)
    }

    const customRoles = await getRolesForApp(appId)

    // Include built-in roles in the response
    const builtinRoles = Object.entries(BUILTIN_ROLES).map(([key, r]) => ({
      id: `builtin_${key}`,
      appId,
      name: r.name,
      description: r.description,
      permissions: [...r.permissions],
      isDefault: key === 'user',
      isBuiltin: true,
      createdAt: '',
      updatedAt: '',
    }))

    return success({ roles: [...builtinRoles, ...customRoles] }, 200, origin)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to get roles'
    return fail(message, 500, origin)
  }
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin')

  try {
    const authResult = await requireAdmin(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const body = await request.json()
    const parsed = CreateRoleSchema.safeParse(body)

    if (!parsed.success) {
      const messages = parsed.error.issues.map((i) => i.message)
      return fail(messages.join(', '), 400, origin)
    }

    const { appId, name, description, permissions, isDefault } = parsed.data

    // Check name doesn't conflict with built-in roles
    if (name === 'admin' || name === 'user') {
      return fail('Cannot create role with reserved name', 409, origin)
    }

    // Check uniqueness within app
    const existing = await getRolesForApp(appId)
    if (existing.some((r) => r.name === name)) {
      return fail('Role name already exists for this app', 409, origin)
    }

    const now = new Date().toISOString()
    const role: Role = {
      id: generateRoleId(),
      appId,
      name,
      description,
      permissions,
      isDefault: isDefault ?? false,
      isBuiltin: false,
      createdAt: now,
      updatedAt: now,
    }

    await create<Role>(ROLES_FILE, role)

    return success({ role }, 201, origin)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create role'
    return fail(message, 500, origin)
  }
}
