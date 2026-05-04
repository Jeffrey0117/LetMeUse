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

  // ── Admin page protection ─────────────────────────────
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('lmu_admin_token')?.value
      ?? request.headers.get('x-admin-token')

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

  // ── CSRF double-submit cookie (admin/non-public endpoints) ──
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method) && !isPublic) {
    const csrfCookie = request.cookies.get('lmu_csrf')?.value
    const csrfHeader = request.headers.get('x-csrf-token')

    if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
      return NextResponse.json(
        { success: false, error: 'CSRF token mismatch' },
        { status: 403 }
      )
    }
  }

  // ── Preflight OPTIONS ──────────────────────────────────
  if (request.method === 'OPTIONS') {
    const allowOrigin = origin && (isAllowedOrigin(origin) || isPublic) ? origin : ''

    return new NextResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': allowOrigin,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-CSRF-Token',
        'Access-Control-Max-Age': '86400',
        'Vary': 'Origin',
      },
    })
  }

  // ── State-changing requests: validate Origin ────────────
  const isStateMutating = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)
  if (isStateMutating && origin && !isPublic && !isAllowedOrigin(origin)) {
    return NextResponse.json(
      { success: false, error: 'Forbidden origin' },
      { status: 403 }
    )
  }

  // ── Set CORS headers on response ───────────────────────
  const response = NextResponse.next()

  const allowedOrigin = (origin && (isAllowedOrigin(origin) || isPublic)) ? origin : ''

  if (allowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', allowedOrigin)
  }

  if (pathname.startsWith('/api/serve/')) {
    response.headers.set('Cache-Control', 'public, max-age=60')
  }

  if (origin || isPublic) {
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF-Token')
    response.headers.set('Vary', 'Origin')
  }

  // ── Security headers ────────────────────────────────────
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  }

  // ── Set CSRF cookie if not present ────────────────────
  if (!request.cookies.get('lmu_csrf')) {
    const csrfToken = crypto.randomUUID()
    response.cookies.set('lmu_csrf', csrfToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24,
    })
  }

  return response
}

export const config = {
  matcher: ['/api/:path*', '/admin/:path*'],
}
