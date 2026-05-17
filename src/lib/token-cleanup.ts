import { removeExpired, VERIFICATION_TOKENS_FILE, REFRESH_TOKENS_FILE } from './storage'

interface HasExpiry {
  id: string
  expiresAt: string
}

export async function cleanupExpiredTokens(): Promise<{ verification: number; refresh: number }> {
  const verificationCleaned = await removeExpired<HasExpiry>(VERIFICATION_TOKENS_FILE, 'expiresAt')
  const refreshCleaned = await removeExpired<HasExpiry>(REFRESH_TOKENS_FILE, 'expiresAt')

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
