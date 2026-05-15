import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { corsHeaders } from './api-result'
import { getRedis } from './redis'

// ── Key prefix ──────────────────────────────────────────

const PREFIX = 'lmu:rl'

// ── In-memory fallback store ────────────────────────────

interface MemEntry {
  count: number
  resetAt: number
  failureCount: number
  lockedUntil: number | null
}

const memStore = new Map<string, MemEntry>()

// Clean up stale entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of memStore.entries()) {
    if (entry.resetAt < now && (!entry.lockedUntil || entry.lockedUntil < now)) {
      memStore.delete(key)
    }
  }
}, 5 * 60 * 1000)

function getMemEntry(key: string, windowMs: number): MemEntry {
  const now = Date.now()
  let entry = memStore.get(key)
  if (!entry || entry.resetAt < now) {
    entry = { count: 0, resetAt: now + windowMs, failureCount: entry?.failureCount ?? 0, lockedUntil: entry?.lockedUntil ?? null }
    memStore.set(key, entry)
  }
  return entry
}

// ── Client IP extraction ────────────────────────────────

function getClientIp(request: NextRequest): string {
  const trustProxy = process.env.TRUST_PROXY === 'true'

  if (trustProxy) {
    const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    if (forwarded) return forwarded
  }

  return (
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

// ── Rate limit result ───────────────────────────────────

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  retryAfterSeconds?: number
}

// ── Redis rate limit ────────────────────────────────────

async function checkRedis(
  key: string,
  config: RateLimitConfig
): Promise<RateLimitResult | null> {
  const redis = getRedis()
  if (!redis) return null

  try {
    const lockKey = `${PREFIX}:lock:${key}`
    const reqKey = `${PREFIX}:req:${key}`
    const windowSec = Math.ceil(config.windowMs / 1000)

    // Check lock first
    const lockTtl = await redis.pttl(lockKey)
    if (lockTtl > 0) {
      return { allowed: false, remaining: 0, retryAfterSeconds: Math.ceil(lockTtl / 1000) }
    }

    // INCR + conditional PEXPIRE (atomic via pipeline)
    const pipeline = redis.pipeline()
    pipeline.incr(reqKey)
    pipeline.pttl(reqKey)
    const results = await pipeline.exec()

    if (!results) return null

    const count = results[0]?.[1] as number
    const ttl = results[1]?.[1] as number

    // Set TTL on first request in window
    if (count === 1 || ttl < 0) {
      await redis.pexpire(reqKey, config.windowMs)
    }

    if (count > config.maxRequests) {
      const retryAfterSeconds = ttl > 0 ? Math.ceil(ttl / 1000) : windowSec
      return { allowed: false, remaining: 0, retryAfterSeconds }
    }

    return { allowed: true, remaining: config.maxRequests - count }
  } catch {
    return null // fallback to in-memory
  }
}

async function recordRedisFailure(
  key: string,
  config: RateLimitConfig
): Promise<boolean> {
  const redis = getRedis()
  if (!redis || !config.maxFailures || !config.lockDurationMs) return false

  try {
    const failKey = `${PREFIX}:fail:${key}`
    const lockKey = `${PREFIX}:lock:${key}`

    const count = await redis.incr(failKey)

    // Set TTL on first failure (window = lockDuration so failures expire naturally)
    if (count === 1) {
      await redis.pexpire(failKey, config.lockDurationMs)
    }

    if (count >= config.maxFailures) {
      await redis.set(lockKey, '1', 'PX', config.lockDurationMs)
      await redis.del(failKey)
    }

    return true
  } catch {
    return false
  }
}

async function resetRedisFailures(key: string): Promise<boolean> {
  const redis = getRedis()
  if (!redis) return false

  try {
    await redis.del(`${PREFIX}:fail:${key}`)
    return true
  } catch {
    return false
  }
}

// ── In-memory fallback ──────────────────────────────────

function checkMemory(key: string, config: RateLimitConfig): RateLimitResult {
  const entry = getMemEntry(key, config.windowMs)
  const now = Date.now()

  // Check lock
  if (entry.lockedUntil && entry.lockedUntil > now) {
    const retryAfterSeconds = Math.ceil((entry.lockedUntil - now) / 1000)
    return { allowed: false, remaining: 0, retryAfterSeconds }
  }

  // Clear expired lock
  if (entry.lockedUntil && entry.lockedUntil <= now) {
    entry.lockedUntil = null
    entry.failureCount = 0
  }

  entry.count++

  if (entry.count > config.maxRequests) {
    const retryAfterSeconds = Math.ceil((entry.resetAt - now) / 1000)
    return { allowed: false, remaining: 0, retryAfterSeconds: Math.max(retryAfterSeconds, 1) }
  }

  return { allowed: true, remaining: config.maxRequests - entry.count }
}

function recordMemoryFailure(key: string, config: RateLimitConfig): void {
  if (!config.maxFailures || !config.lockDurationMs) return

  const entry = getMemEntry(key, config.windowMs)
  entry.failureCount++

  if (entry.failureCount >= config.maxFailures) {
    entry.lockedUntil = Date.now() + config.lockDurationMs
    entry.failureCount = 0
  }
}

function resetMemoryFailures(key: string): void {
  const entry = memStore.get(key)
  if (entry) {
    entry.failureCount = 0
  }
}

// ── Public API (Redis first, in-memory fallback) ────────

export async function checkRateLimit(
  request: NextRequest,
  endpoint: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const ip = getClientIp(request)
  const key = `${endpoint}:${ip}`

  const redisResult = await checkRedis(key, config)
  if (redisResult) return redisResult

  return checkMemory(key, config)
}

export async function recordFailure(
  request: NextRequest,
  endpoint: string,
  config: RateLimitConfig
): Promise<void> {
  const ip = getClientIp(request)
  const key = `${endpoint}:${ip}`

  const ok = await recordRedisFailure(key, config)
  if (!ok) {
    recordMemoryFailure(key, config)
  }
}

export async function resetFailures(
  request: NextRequest,
  endpoint: string
): Promise<void> {
  const ip = getClientIp(request)
  const key = `${endpoint}:${ip}`

  const ok = await resetRedisFailures(key)
  if (!ok) {
    resetMemoryFailures(key)
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
