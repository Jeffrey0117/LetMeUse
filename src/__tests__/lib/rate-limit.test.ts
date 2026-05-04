import { describe, it, expect, beforeEach } from 'vitest'
import {
  checkRateLimit,
  recordFailure,
  resetFailures,
  type RateLimitConfig,
} from '@/lib/rate-limit'
import type { NextRequest } from 'next/server'

function createMockRequest(ip: string = '127.0.0.1'): NextRequest {
  return {
    headers: {
      get(name: string): string | null {
        if (name === 'x-real-ip') return ip
        return null
      },
    },
  } as unknown as NextRequest
}

const testConfig: RateLimitConfig = {
  windowMs: 60 * 1000,
  maxRequests: 3,
  maxFailures: 3,
  lockDurationMs: 10 * 1000,
}

describe('rate-limit', () => {
  // Use a unique endpoint per test to avoid state leaking between tests
  let testEndpoint: string

  beforeEach(() => {
    testEndpoint = `test_${Date.now()}_${Math.random().toString(36).slice(2)}`
  })

  describe('checkRateLimit', () => {
    it('allows requests within the limit', () => {
      const req = createMockRequest('10.0.0.1')

      const result1 = checkRateLimit(req, testEndpoint, testConfig)
      expect(result1.allowed).toBe(true)
      expect(result1.remaining).toBe(2)

      const result2 = checkRateLimit(req, testEndpoint, testConfig)
      expect(result2.allowed).toBe(true)
      expect(result2.remaining).toBe(1)

      const result3 = checkRateLimit(req, testEndpoint, testConfig)
      expect(result3.allowed).toBe(true)
      expect(result3.remaining).toBe(0)
    })

    it('blocks requests over the limit', () => {
      const req = createMockRequest('10.0.0.2')

      // Exhaust the limit
      for (let i = 0; i < testConfig.maxRequests; i++) {
        checkRateLimit(req, testEndpoint, testConfig)
      }

      const blocked = checkRateLimit(req, testEndpoint, testConfig)
      expect(blocked.allowed).toBe(false)
      expect(blocked.remaining).toBe(0)
      expect(blocked.retryAfterSeconds).toBeGreaterThan(0)
    })
  })

  describe('lockout after max failures', () => {
    it('locks out after reaching maxFailures', () => {
      const req = createMockRequest('10.0.0.3')

      // Record failures up to the limit
      for (let i = 0; i < testConfig.maxFailures!; i++) {
        recordFailure(req, testEndpoint, testConfig)
      }

      // The next rate limit check should be locked
      const result = checkRateLimit(req, testEndpoint, testConfig)
      expect(result.allowed).toBe(false)
      expect(result.retryAfterSeconds).toBeGreaterThan(0)
    })
  })

  describe('resetFailures', () => {
    it('clears the failure count', () => {
      const req = createMockRequest('10.0.0.4')

      // Record some failures but not enough to lock
      recordFailure(req, testEndpoint, testConfig)
      recordFailure(req, testEndpoint, testConfig)

      // Reset failures
      resetFailures(req, testEndpoint)

      // Now record maxFailures again — should not lock yet because counter was reset
      recordFailure(req, testEndpoint, testConfig)
      recordFailure(req, testEndpoint, testConfig)

      // Should still be allowed (only 2 failures after reset, need 3 to lock)
      const result = checkRateLimit(req, testEndpoint, testConfig)
      expect(result.allowed).toBe(true)
    })
  })
})
