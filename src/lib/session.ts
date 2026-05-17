import { findByField, create, remove, removeWhere, SESSIONS_FILE, REFRESH_TOKENS_FILE } from './storage'
import type { RefreshToken } from './auth-models'
import { generateSessionId } from './id'

// ── Session model ───────────────────────────────────────

export interface Session {
  id: string
  userId: string
  appId: string
  refreshTokenId: string
  ip?: string
  userAgent?: string
  device?: string
  lastActiveAt: string
  createdAt: string
}

// ── Device detection (simple) ───────────────────────────

function detectDevice(userAgent?: string): string {
  if (!userAgent) return 'Unknown'
  const ua = userAgent.toLowerCase()
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) return 'Mobile'
  if (ua.includes('tablet') || ua.includes('ipad')) return 'Tablet'
  if (ua.includes('mac')) return 'Mac'
  if (ua.includes('windows')) return 'Windows'
  if (ua.includes('linux')) return 'Linux'
  return 'Desktop'
}

// ── Create session ──────────────────────────────────────

export async function createSession(params: {
  userId: string
  appId: string
  refreshTokenId: string
  ip?: string
  userAgent?: string
}): Promise<Session> {
  const now = new Date().toISOString()
  const session: Session = {
    id: generateSessionId(),
    userId: params.userId,
    appId: params.appId,
    refreshTokenId: params.refreshTokenId,
    ip: params.ip,
    userAgent: params.userAgent,
    device: detectDevice(params.userAgent),
    lastActiveAt: now,
    createdAt: now,
  }

  await create<Session>(SESSIONS_FILE, session)
  return session
}

// ── Get user sessions ───────────────────────────────────

export async function getUserSessions(userId: string, appId?: string): Promise<Session[]> {
  const sessions = await findByField<Session>(SESSIONS_FILE, 'userId', userId)
  const filtered = appId ? sessions.filter((s) => s.appId === appId) : sessions
  return filtered.sort((a, b) => new Date(b.lastActiveAt).getTime() - new Date(a.lastActiveAt).getTime())
}

// ── Revoke session ──────────────────────────────────────

export async function revokeSession(sessionId: string): Promise<boolean> {
  return remove<Session>(SESSIONS_FILE, sessionId)
}

// ── Revoke all sessions for user ────────────────────────

export async function revokeAllUserSessions(userId: string, excludeSessionId?: string): Promise<number> {
  return removeWhere<Session>(SESSIONS_FILE, 'userId', userId, excludeSessionId)
}

// ── Revoke all refresh tokens for user ──────────────────

export async function revokeAllUserRefreshTokens(userId: string): Promise<number> {
  return removeWhere<RefreshToken>(REFRESH_TOKENS_FILE, 'userId', userId)
}

// ── Remove session by refresh token ─────────────────────

export async function removeSessionByRefreshToken(refreshTokenId: string): Promise<void> {
  const sessions = await findByField<Session>(SESSIONS_FILE, 'refreshTokenId', refreshTokenId)
  if (sessions.length > 0) {
    await remove<Session>(SESSIONS_FILE, sessions[0].id)
  }
}
