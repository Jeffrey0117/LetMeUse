/**
 * Redis connection singleton.
 *
 * Reads REDIS_URL from env (default: redis://localhost:6379).
 * Returns null if Redis is not configured (REDIS_URL=false) or permanently unavailable.
 */

import Redis from 'ioredis'

const REDIS_URL = process.env.REDIS_URL ?? 'redis://localhost:6379'

let _redis: Redis | null = null
let _disabled = false

export function getRedis(): Redis | null {
  if (_disabled) return null
  if (_redis) return _redis

  // Allow explicit opt-out
  if (REDIS_URL === 'false' || REDIS_URL === '') {
    _disabled = true
    return null
  }

  try {
    _redis = new Redis(REDIS_URL, {
      maxRetriesPerRequest: 1,
      connectTimeout: 3000,
      retryStrategy(times) {
        if (times > 3) {
          _disabled = true
          return null // stop retrying, fall back to in-memory permanently
        }
        return Math.min(times * 500, 2000)
      },
    })

    _redis.on('error', () => {
      // Suppress unhandled error events — rate limiter catches errors per-call
    })

    return _redis
  } catch {
    _disabled = true
    return null
  }
}

export function closeRedis(): void {
  if (_redis) {
    _redis.disconnect()
    _redis = null
  }
}
