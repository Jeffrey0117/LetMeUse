import { describe, it, expect } from 'vitest'
import { hashPassword, verifyPassword, DUMMY_HASH } from '@/lib/auth/password'

describe('password', () => {
  describe('hashPassword', () => {
    it('produces a bcrypt hash with cost factor 12', async () => {
      const hash = await hashPassword('mySecret123')
      // bcryptjs v3+ produces $2b$ variant
      expect(hash).toMatch(/^\$2[ab]\$12\$/)
    })

    it('produces different hashes for the same input', async () => {
      const hash1 = await hashPassword('samePassword')
      const hash2 = await hashPassword('samePassword')
      expect(hash1).not.toBe(hash2)
    })
  })

  describe('verifyPassword', () => {
    it('returns true for correct password', async () => {
      const hash = await hashPassword('correctPassword')
      const result = await verifyPassword('correctPassword', hash)
      expect(result).toBe(true)
    })

    it('returns false for wrong password', async () => {
      const hash = await hashPassword('correctPassword')
      const result = await verifyPassword('wrongPassword', hash)
      expect(result).toBe(false)
    })
  })

  describe('DUMMY_HASH', () => {
    it('is a valid bcrypt hash string', () => {
      expect(DUMMY_HASH).toMatch(/^\$2[ab]\$12\$/)
      expect(DUMMY_HASH.length).toBeGreaterThan(50)
    })
  })
})
