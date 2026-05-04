import { describe, it, expect, vi } from 'vitest'

vi.mock('@/lib/rbac', () => ({
  getPermissionsForRole: vi.fn().mockResolvedValue(['read']),
}))

import { signAccessToken, verifyAccessToken, signRefreshTokenJWT } from '@/lib/auth/jwt'
import type { App, AuthUser } from '@/lib/auth-models'

const mockApp: App = {
  id: 'app_test123',
  name: 'Test App',
  secret: 'test-secret-key-at-least-32-chars-long!!',
  domains: ['localhost'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

const mockUser: AuthUser = {
  id: 'usr_test456',
  appId: 'app_test123',
  email: 'test@example.com',
  passwordHash: '$2a$12$fakehash',
  displayName: 'Test User',
  role: 'user',
  disabled: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

describe('jwt', () => {
  describe('signAccessToken + verifyAccessToken roundtrip', () => {
    it('creates a token that can be verified with the same secret', async () => {
      const token = await signAccessToken(mockUser, mockApp)
      expect(typeof token).toBe('string')
      expect(token.split('.')).toHaveLength(3)

      const payload = await verifyAccessToken(token, mockApp.secret)
      expect(payload.sub).toBe('usr_test456')
      expect(payload.email).toBe('test@example.com')
      expect(payload.app).toBe('app_test123')
      expect(payload.role).toBe('user')
      expect(payload.name).toBe('Test User')
      expect(payload.permissions).toEqual(['read'])
    })
  })

  describe('verifyAccessToken with wrong secret', () => {
    it('throws an error', async () => {
      const token = await signAccessToken(mockUser, mockApp)

      await expect(
        verifyAccessToken(token, 'wrong-secret-key-that-is-also-long!!')
      ).rejects.toThrow()
    })
  })

  describe('token claims', () => {
    it('contains expected claims (sub, email, app, role)', async () => {
      const token = await signAccessToken(mockUser, mockApp)
      const payload = await verifyAccessToken(token, mockApp.secret)

      expect(payload).toHaveProperty('sub')
      expect(payload).toHaveProperty('email')
      expect(payload).toHaveProperty('app')
      expect(payload).toHaveProperty('role')
      expect(payload).toHaveProperty('permissions')
      expect(payload).toHaveProperty('iat')
      expect(payload).toHaveProperty('exp')
      expect(payload.exp).toBeGreaterThan(payload.iat)
    })
  })

  describe('signRefreshTokenJWT', () => {
    it('produces a JWT string', async () => {
      const token = await signRefreshTokenJWT(mockUser, mockApp)
      expect(typeof token).toBe('string')
      expect(token.split('.')).toHaveLength(3)
    })
  })
})
