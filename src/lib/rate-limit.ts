import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { corsHeaders } from './api-result'

// ── In-memory sliding window rate limiter ───────────────

interface RateLimitEntry {
  timestamps: number[]
  failureCount: number
  lockedUntil: number | null
}

const store = new Map<string, RateLimitEntry>()

// Clean up stale entries every 5 minutes
const CLEANUP_INTERVAL = 5 * 60 * 1000
const MAX_WINDOW = 60 * 60 * 1000 // 1 hour max window

setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of store.entries()) {
    const filtered = entry.timestamps.filter((ts) => now - ts < MAX_WINDOW)
    if (filtered.length === 0 && (!entry.lockedUntil || entry.lockedUntil < now)) {
      store.delete(key)
    } else {
      entry.timestamps = filtered
    }
  }
}, CLEANUP_INTERVAL)

function getEntry(key: string): RateLimitEntry {
  let entry = store.get(key)
  if (!entry) {
    entry = { timestamps: [], failureCount: 0, lockedUntil: null }
    store.set(key, entry)
  }
  return entry
}

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'
  )
}

// ── Rate limit configurations ───────────────────────────

export interface RateLimitConfig {
  windowMs: number
  maxRequests: number
  maxFailures?: number
  lockDurationMs?: number
}

export const RATE_LIMITS = {
  login: {
    windowMs: 60 * 1000,          // 1 minute window
    maxRequests: 10,
    maxFailures: 5,
    lockDurationMs: 15 * 60 * 1000, // 15 minutes lock
  },
  register: {
    windowMs: 60 * 60 * 1000,     // 1 hour window
    maxRequests: 5,
  },
  refresh: {
    windowMs: 60 * 1000,          // 1 minute window
    maxRequests: 20,
  },
  forgotPassword: {
    windowMs: 60 * 60 * 1000,     // 1 hour window
    maxRequests: 3,
  },
  resetPassword: {
    windowMs: 60 * 60 * 1000,     // 1 hour window
    maxRequests: 5,
  },
} as const satisfies Record<string, RateLimitConfig>

// ── Check rate limit ────────────────────────────────────

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  retryAfterSeconds?: number
}

export function checkRateLimit(
  request: NextRequest,
  endpoint: string,
  config: RateLimitConfig
): RateLimitResult {
  const ip = getClientIp(request)
  const key = `${endpoint}:${ip}`
  const entry = getEntry(key)
  const now = Date.now()

  // Check if locked
  if (entry.lockedUntil && entry.lockedUntil > now) {
    const retryAfterSeconds = Math.ceil((entry.lockedUntil - now) / 1000)
    return { allowed: false, remaining: 0, retryAfterSeconds }
  }

  // Clear expired lock
  if (entry.lockedUntil && entry.lockedUntil <= now) {
    entry.lockedUntil = null
    entry.failureCount = 0
  }

  // Filter timestamps within window
  entry.timestamps = entry.timestamps.filter((ts) => now - ts < config.windowMs)

  if (entry.timestamps.length >= config.maxRequests) {
    const oldestInWindow = entry.timestamps[0]
    const retryAfterSeconds = Math.ceil((oldestInWindow + config.windowMs - now) / 1000)
    return { allowed: false, remaining: 0, retryAfterSeconds }
  }

  entry.timestamps.push(now)
  const remaining = config.maxRequests - entry.timestamps.length

  return { allowed: true, remaining }
}

// ── Record failure (for login lockout) ──────────────────

export function recordFailure(
  request: NextRequest,
  endpoint: string,
  config: RateLimitConfig
): void {
  if (!config.maxFailures || !config.lockDurationMs) return

  const ip = getClientIp(request)
  const key = `${endpoint}:${ip}`
  const entry = getEntry(key)

  entry.failureCount++

  if (entry.failureCount >= config.maxFailures) {
    entry.lockedUntil = Date.now() + config.lockDurationMs
    entry.failureCount = 0
  }
}

// ── Reset failure count on success ──────────────────────

export function resetFailures(
  request: NextRequest,
  endpoint: string
): void {
  const ip = getClientIp(request)
  const key = `${endpoint}:${ip}`
  const entry = store.get(key)
  if (entry) {
    entry.failureCount = 0
  }
}

// ── Rate limit response helper ──────────────────────────

export function rateLimitResponse(
  retryAfterSeconds: number,
  origin?: string | null
): NextResponse {
  return NextResponse.json(
    { success: false, error: 'Too many requests. Please try again later.' },
    {
      status: 429,
      headers: {
        ...corsHeaders(origin),
        'Retry-After': String(retryAfterSeconds),
      },
    }
  )
}
