import { getAll, create, remove, SESSIONS_FILE, REFRESH_TOKENS_FILE } from './storage'
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
  const all = await getAll<Session>(SESSIONS_FILE)
  let filtered = all.filter((s) => s.userId === userId)
  if (appId) {
    filtered = filtered.filter((s) => s.appId === appId)
  }
  return filtered.sort((a, b) => new Date(b.lastActiveAt).getTime() - new Date(a.lastActiveAt).getTime())
}

// ── Revoke session ──────────────────────────────────────

export async function revokeSession(sessionId: string): Promise<boolean> {
  return remove<Session>(SESSIONS_FILE, sessionId)
}

// ── Revoke all sessions for user ────────────────────────

export async function revokeAllUserSessions(userId: string, excludeSessionId?: string): Promise<number> {
  const sessions = await getUserSessions(userId)
  let count = 0
  for (const session of sessions) {
    if (excludeSessionId && session.id === excludeSessionId) continue
    await remove<Session>(SESSIONS_FILE, session.id)
    count++
  }
  return count
}

// ── Revoke all refresh tokens for user ──────────────────

export async function revokeAllUserRefreshTokens(userId: string): Promise<number> {
  const allTokens = await getAll<RefreshToken>(REFRESH_TOKENS_FILE)
  const userTokens = allTokens.filter((t) => t.userId === userId)
  let count = 0
  for (const token of userTokens) {
    await remove<RefreshToken>(REFRESH_TOKENS_FILE, token.id)
    count++
  }
  return count
}

// ── Remove session by refresh token ─────────────────────

export async function removeSessionByRefreshToken(refreshTokenId: string): Promise<void> {
  const all = await getAll<Session>(SESSIONS_FILE)
  const session = all.find((s) => s.refreshTokenId === refreshTokenId)
  if (session) {
    await remove<Session>(SESSIONS_FILE, session.id)
  }
}
