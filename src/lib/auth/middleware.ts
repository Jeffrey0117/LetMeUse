import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyAccessToken, type AccessTokenPayload } from './jwt'
import { getById } from '../storage'
import { APPS_FILE } from '../storage'
import type { App } from '../auth-models'

export function corsHeaders(origin?: string | null): HeadersInit {
  return {
    'Access-Control-Allow-Origin': origin ?? '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  }
}

export function corsResponse(origin?: string | null): NextResponse {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(origin),
  })
}

export function jsonResponse(
  data: unknown,
  status: number = 200,
  origin?: string | null
): NextResponse {
  return NextResponse.json(data, {
    status,
    headers: corsHeaders(origin),
  })
}

export function errorResponse(
  message: string,
  status: number = 400,
  origin?: string | null
): NextResponse {
  return jsonResponse({ error: message }, status, origin)
}

export async function authenticateRequest(
  request: NextRequest
): Promise<{ payload: AccessTokenPayload; app: App } | NextResponse> {
  const origin = request.headers.get('origin')
  const authHeader = request.headers.get('authorization')

  if (!authHeader?.startsWith('Bearer ')) {
    return errorResponse('Missing or invalid authorization header', 401, origin)
  }

  const token = authHeader.slice(7)

  // Decode token without verification first to get the app ID
  const parts = token.split('.')
  if (parts.length !== 3) {
    return errorResponse('Invalid token format', 401, origin)
  }

  try {
    const payloadRaw = JSON.parse(atob(parts[1]))
    const appId = payloadRaw.app as string

    if (!appId) {
      return errorResponse('Token missing app claim', 401, origin)
    }

    const app = await getById<App>(APPS_FILE, appId)
    if (!app) {
      return errorResponse('App not found', 401, origin)
    }

    const payload = await verifyAccessToken(token, app.secret)
    return { payload, app }
  } catch {
    return errorResponse('Invalid or expired token', 401, origin)
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
    return errorResponse('Admin access required', 403, origin)
  }

  return result
}
