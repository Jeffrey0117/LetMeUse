import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const SELF_ORIGINS = new Set([
  'http://localhost:3000',
  'http://localhost:3001',
  process.env.NEXT_PUBLIC_BASE_URL ?? '',
].filter(Boolean))

// Public API routes that allow any origin (SDK-facing endpoints)
const PUBLIC_CORS_PATHS = [
  '/api/serve/',
  '/api/auth/',
]

function isAllowedOrigin(origin: string): boolean {
  if (SELF_ORIGINS.has(origin)) return true

  const extra = process.env.LETMEUSE_ALLOWED_ORIGINS ?? ''
  if (extra) {
    const list = extra.split(',').map(s => s.trim()).filter(Boolean)
    if (list.includes(origin)) return true
  }

  return false
}

function isPublicCorsPath(pathname: string): boolean {
  return PUBLIC_CORS_PATHS.some(p => pathname.startsWith(p))
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const origin = request.headers.get('origin')

  // ── Admin page protection ───────────────────────────────
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('lmu_admin_token')?.value
      ?? request.headers.get('x-admin-token')

    // No server-side JWT verification in edge middleware (no file system),
    // but we can check token presence. API calls will do full JWT verification.
    if (!token) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
  }

  // ── API routes ──────────────────────────────────────────
  if (!pathname.startsWith('/api/')) return NextResponse.next()

  const isPublic = isPublicCorsPath(pathname)

  // Preflight OPTIONS
  if (request.method === 'OPTIONS') {
    const allowOrigin = isPublic
      ? (origin ?? '*')
      : (origin && isAllowedOrigin(origin) ? origin : '')

    return new NextResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': allowOrigin,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
        'Vary': 'Origin',
      },
    })
  }

  // State-changing requests: validate Origin (skip for public GET-only routes)
  const isStateMutating = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)
  if (isStateMutating && origin && !isPublic && !isAllowedOrigin(origin)) {
    return NextResponse.json(
      { success: false, error: 'Forbidden origin' },
      { status: 403 }
    )
  }

  // Set CORS headers on response
  const response = NextResponse.next()

  if (isPublic) {
    response.headers.set('Access-Control-Allow-Origin', origin ?? '*')
    if (pathname.startsWith('/api/serve/')) {
      response.headers.set('Cache-Control', 'public, max-age=60')
    }
  } else if (origin) {
    const validOrigin = isAllowedOrigin(origin) ? origin : ''
    response.headers.set('Access-Control-Allow-Origin', validOrigin)
  }

  if (origin || isPublic) {
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    response.headers.set('Vary', 'Origin')
  }

  return response
}

export const config = {
  matcher: ['/api/:path*', '/admin/:path*'],
}
