import { getAll, remove, VERIFICATION_TOKENS_FILE, REFRESH_TOKENS_FILE } from './storage'
import type { RefreshToken } from './auth-models'

interface HasExpiry {
  id: string
  expiresAt: string
}

export async function cleanupExpiredTokens(): Promise<{ verification: number; refresh: number }> {
  const now = new Date().toISOString()
  let verificationCleaned = 0
  let refreshCleaned = 0

  // Clean verification tokens
  const verificationTokens = await getAll<HasExpiry>(VERIFICATION_TOKENS_FILE)
  const expiredVerification = verificationTokens.filter((t) => t.expiresAt <= now)
  for (const t of expiredVerification) {
    const removed = await remove(VERIFICATION_TOKENS_FILE, t.id)
    if (removed) verificationCleaned++
  }

  // Clean refresh tokens
  const refreshTokens = await getAll<RefreshToken>(REFRESH_TOKENS_FILE)
  const expiredRefresh = refreshTokens.filter((t) => t.expiresAt <= now)
  for (const t of expiredRefresh) {
    const removed = await remove(REFRESH_TOKENS_FILE, t.id)
    if (removed) refreshCleaned++
  }

  return { verification: verificationCleaned, refresh: refreshCleaned }
}

// Auto-run cleanup every hour when this module is imported
const CLEANUP_INTERVAL = 60 * 60 * 1000
setInterval(() => {
  cleanupExpiredTokens().catch(() => {
    // Silently ignore cleanup errors
  })
}, CLEANUP_INTERVAL)

// Run once on startup
cleanupExpiredTokens().catch(() => {})
