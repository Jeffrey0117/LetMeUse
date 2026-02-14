import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyAccessToken, type AccessTokenPayload } from './jwt'
import { getById } from '../storage'
import { APPS_FILE } from '../storage'
import type { App } from '../auth-models'
import { corsHeaders, fail } from '../api-result'
import type { Permission } from '../rbac'

// Re-export for convenience
export { corsResponse, success, paginated, fail, corsHeaders } from '../api-result'

export async function authenticateRequest(
  request: NextRequest
): Promise<{ payload: AccessTokenPayload; app: App } | NextResponse> {
  const origin = request.headers.get('origin')
  const authHeader = request.headers.get('authorization')

  if (!authHeader?.startsWith('Bearer ')) {
    return fail('Missing or invalid authorization header', 401, origin)
  }

  const token = authHeader.slice(7)

  const parts = token.split('.')
  if (parts.length !== 3) {
    return fail('Invalid token format', 401, origin)
  }

  try {
    const payloadRaw = JSON.parse(atob(parts[1]))
    const appId = payloadRaw.app as string

    if (!appId) {
      return fail('Token missing app claim', 401, origin)
    }

    const app = await getById<App>(APPS_FILE, appId)
    if (!app) {
      return fail('App not found', 401, origin)
    }

    const payload = await verifyAccessToken(token, app.secret)
    return { payload, app }
  } catch {
    return fail('Invalid or expired token', 401, origin)
  }
}

export async function requireAdmin(
  request: NextRequest
): Promise<{ payload: AccessTokenPayload; app: App } | NextResponse> {
  const result = await authenticateRequest(request)

  if (result instanceof NextResponse) {
    return result
  }

  if (result.payload.role !== 'admin') {
    const origin = request.headers.get('origin')
    return fail('Admin access required', 403, origin)
  }

  return result
}

export async function requirePermission(
  request: NextRequest,
  permission: Permission
): Promise<{ payload: AccessTokenPayload; app: App } | NextResponse> {
  const result = await authenticateRequest(request)

  if (result instanceof NextResponse) {
    return result
  }

  const userPermissions = (result.payload.permissions ?? []) as string[]
  if (!userPermissions.includes(permission)) {
    const origin = request.headers.get('origin')
    return fail(`Missing permission: ${permission}`, 403, origin)
  }

  return result
}

// Legacy aliases (kept for compatibility during migration)
export { corsHeaders as legacyCorsHeaders }
export function jsonResponse(data: unknown, status = 200, origin?: string | null): NextResponse {
  return NextResponse.json(data, { status, headers: corsHeaders(origin) })
}
export function errorResponse(message: string, status = 400, origin?: string | null): NextResponse {
  return fail(message, status, origin)
}
