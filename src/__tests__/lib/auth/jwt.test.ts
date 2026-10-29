import { describe, it, expect, vi, beforeAll } from 'vitest'
import { generateKeyPair, exportPKCS8, SignJWT } from 'jose'

vi.mock('@/lib/rbac', () => ({
  getPermissionsForRole: vi.fn().mockResolvedValue(['read']),
}))

import { signAccessToken, verifyAccessToken, signRefreshTokenJWT, decodeJwtPayloadSegment } from '@/lib/auth/jwt'
import type { App, AuthUser } from '@/lib/auth-models'

// 2026-10-30 起 access token 簽發/驗證都是 ES256 — 測試環境先備好簽章金鑰
// (keys.ts 的 loadSigningKeys 第一次被呼叫時才讀 env,beforeAll 內設定來得及)
beforeAll(async () => {
  const { privateKey } = await generateKeyPair('ES256', { extractable: true })
  process.env.LETMEUSE_JWT_PRIVATE_KEY_B64 = Buffer.from(await exportPKCS8(privateKey)).toString('base64')
  process.env.LETMEUSE_SIGN_ALG = 'ES256'
})

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

  describe('tampered token', () => {
    it('throws an error', async () => {
      const token = await signAccessToken(mockUser, mockApp)
      const [h, p, s] = token.split('.')
      const evilPayload = Buffer.from(
        JSON.stringify({ ...JSON.parse(Buffer.from(p, 'base64url').toString()), role: 'admin' })
      ).toString('base64url')

      await expect(verifyAccessToken(`${h}.${evilPayload}.${s}`, mockApp.secret)).rejects.toThrow()
    })
  })

  describe('🔒 HS256 偽造必拒(pokkit 事件回歸)', () => {
    it('rejects an HS256 token even when signed with the real app secret', async () => {
      // 攻擊劇本:app secret 外洩 → 自簽 HS256 冒充任意用戶。驗證端必須只認 ES256。
      const forged = await new SignJWT({ email: 'victim@example.com', app: mockApp.id, role: 'admin' })
        .setProtectedHeader({ alg: 'HS256' })
        .setSubject('usr_victim')
        .setIssuedAt()
        .setExpirationTime('4h')
        .sign(new TextEncoder().encode(mockApp.secret))

      await expect(verifyAccessToken(forged, mockApp.secret)).rejects.toThrow()
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

  describe('decodeJwtPayloadSegment (2026-06-08 atob/base64url 踢人事故回歸)', () => {
    it('decodes payload of a token signed for a non-ASCII (中文) displayName user', async () => {
      const zhUser: AuthUser = { ...mockUser, displayName: '切板職人|低調貓' }
      const token = await signAccessToken(zhUser, mockApp)
      const seg = token.split('.')[1]

      // 中文 name → UTF-8 高位元組 → base64url 含 -/_ (正是 atob 會 throw 的輸入)
      expect(/[-_]/.test(seg)).toBe(true)

      const payload = decodeJwtPayloadSegment(seg)
      expect(payload.app).toBe('app_test123')
      expect(payload.name).toBe('切板職人|低調貓')
    })

    it('decodes plain ASCII payloads identically', async () => {
      const token = await signAccessToken(mockUser, mockApp)
      const payload = decodeJwtPayloadSegment(token.split('.')[1])
      expect(payload.app).toBe('app_test123')
      expect(payload.sub).toBe('usr_test456')
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
