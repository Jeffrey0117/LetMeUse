import { NextResponse } from 'next/server'

// ── Types ───────────────────────────────────────────────

export interface ApiSuccess<T> {
  success: true
  data: T
}

export interface ApiError {
  success: false
  error: string
}

export type ApiResult<T> = ApiSuccess<T> | ApiError

export interface PaginationMeta {
  total: number
  page: number
  limit: number
}

export interface PaginatedResult<T> {
  success: true
  data: T
  meta: PaginationMeta
}

// ── Helpers (for use in route handlers) ─────────────────

export function corsHeaders(origin?: string | null): HeadersInit {
  return {
    'Access-Control-Allow-Origin': origin ?? '',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  }
}

export function corsResponse(origin?: string | null): NextResponse {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(origin),
  })
}

export function success<T>(data: T, status = 200, origin?: string | null): NextResponse {
  const body: ApiSuccess<T> = { success: true, data }
  return NextResponse.json(body, { status, headers: corsHeaders(origin) })
}

export function paginated<T>(
  data: T,
  meta: PaginationMeta,
  origin?: string | null
): NextResponse {
  const body: PaginatedResult<T> = { success: true, data, meta }
  return NextResponse.json(body, { status: 200, headers: corsHeaders(origin) })
}

export function fail(error: string, status = 400, origin?: string | null): NextResponse {
  const body: ApiError = { success: false, error }
  return NextResponse.json(body, { status, headers: corsHeaders(origin) })
}
