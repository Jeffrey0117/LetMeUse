import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const SELF_ORIGINS = new Set([
  'http://localhost:3000',
  'http://localhost:3001',
  process.env.NEXT_PUBLIC_BASE_URL ?? '',
].filter(Boolean))

function isAllowedOrigin(origin: string): boolean {
  if (SELF_ORIGINS.has(origin)) return true

  // Allow origins matching registered app domains.
  // In edge middleware we can't read the JSON file system,
  // so we use the LETMEUSE_ALLOWED_ORIGINS env var (comma-separated).
  const extra = process.env.LETMEUSE_ALLOWED_ORIGINS ?? ''
  if (extra) {
    const list = extra.split(',').map(s => s.trim()).filter(Boolean)
    if (list.includes(origin)) return true
  }

  return false
}

export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin')
  const isApiRoute = request.nextUrl.pathname.startsWith('/api/')

  if (!isApiRoute) return NextResponse.next()

  // Preflight OPTIONS
  if (request.method === 'OPTIONS') {
    const allowedOrigin = origin && isAllowedOrigin(origin) ? origin : ''
    return new NextResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
        'Vary': 'Origin',
      },
    })
  }

  // State-changing requests: validate Origin header to prevent CSRF
  const isStateMutating = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)
  if (isStateMutating && origin && !isAllowedOrigin(origin)) {
    return NextResponse.json(
      { success: false, error: 'Forbidden origin' },
      { status: 403 }
    )
  }

  // Non-preflight: validate origin and pass it through via header
  const response = NextResponse.next()

  if (origin) {
    const validOrigin = isAllowedOrigin(origin) ? origin : ''
    response.headers.set('Access-Control-Allow-Origin', validOrigin)
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    response.headers.set('Vary', 'Origin')
  }

  return response
}

export const config = {
  matcher: '/api/:path*',
}
