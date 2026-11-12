import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyAccessToken, decodeJwtPayloadSegment, type AccessTokenPayload } from './jwt'
import { getById, getAll } from '../storage'
import { APPS_FILE, USERS_FILE } from '../storage'
import type { App, AuthUser } from '../auth-models'
import { platformAdminDenial, readPlatformAdminConfig } from './platform-admin'
import { corsHeaders, fail } from '../api-result'
import type { Permission } from '../rbac'
import { safeEqual } from './safe-compare'

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

  // ── Service token bypass (server-to-server admin access) ──
  const serviceToken = process.env.LETMEUSE_SERVICE_TOKEN
  if (serviceToken && safeEqual(token, serviceToken)) {
    const apps = await getAll<App>(APPS_FILE)
    const systemApp = apps[0] ?? { id: 'system', secret: '', name: 'System', domains: [], createdAt: '', updatedAt: '' }
    return {
      payload: {
        sub: 'service',
        email: 'service@system',
        name: 'Service',
        role: 'admin',
        permissions: ['admin:read', 'admin:write', 'admin:delete'],
        app: systemApp.id,
        emailVerified: true,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
      },
      app: systemApp as App,
    }
  }

  const parts = token.split('.')
  if (parts.length !== 3) {
    return fail('Invalid token format', 401, origin)
  }

  try {
    // base64url 安全解碼 — atob 遇到 -/_ 會 throw (中文名 user 全 401 被踢的死因)
    const payloadRaw = decodeJwtPayloadSegment(parts[1])
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

/**
 * 平台管理員白名單 — env `PLATFORM_ADMIN_EMAILS` (逗號分隔)。
 * 修掉「任一 app 的 role:admin = 全域 admin」這個致命授權洞:
 * 全域 admin 端點 (/api/admin/*) 只認這些 email, 不是隨便哪個 app 的 admin。
 * 2026-11 起再加一道:只認 `PLATFORM_ADMIN_APP_ID` 那一個 app 發的 token。
 */
export async function requireAdmin(
  request: NextRequest
): Promise<{ payload: AccessTokenPayload; app: App } | NextResponse> {
  const result = await authenticateRequest(request)

  if (result instanceof NextResponse) {
    return result
  }

  const origin = request.headers.get('origin')

  if (result.payload.role !== 'admin') {
    return fail('Admin access required', 403, origin)
  }

  // service token (server-to-server, 需 LETMEUSE_SERVICE_TOKEN) 直接放行
  if (result.payload.sub === 'service') {
    return result
  }

  // 🔒 平台管理員:限定單一主控 app + email 白名單 + 資料庫現況 (見 platform-admin.ts)。
  // 任一設定缺漏 = fail-closed。
  const config = readPlatformAdminConfig()
  const account = await getById<AuthUser>(USERS_FILE, result.payload.sub)
  const denial = platformAdminDenial(config, {
    tokenApp: result.payload.app,
    tokenEmail: result.payload.email,
    account: account ?? null,
  })
  if (denial === 'not-configured') {
    console.error(
      '[SECURITY] PLATFORM_ADMIN_APP_ID / PLATFORM_ADMIN_EMAILS 未設定 → 拒絕所有 admin 後台存取。'
    )
    return fail('Admin not configured', 403, origin)
  }
  if (denial) {
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
    return fail('Forbidden', 403, origin)
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
