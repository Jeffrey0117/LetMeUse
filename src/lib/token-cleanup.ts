import { getAll, VERIFICATION_TOKENS_FILE, REFRESH_TOKENS_FILE } from './storage'
import type { RefreshToken } from './auth-models'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')

interface HasExpiry {
  id: string
  expiresAt: string
}

export async function cleanupExpiredTokens(): Promise<{ verification: number; refresh: number }> {
  await mkdir(DATA_DIR, { recursive: true })
  const now = new Date().toISOString()
  let verificationCleaned = 0
  let refreshCleaned = 0

  // Clean verification tokens
  const verificationTokens = await getAll<HasExpiry>(VERIFICATION_TOKENS_FILE)
  const validVerification = verificationTokens.filter((t) => t.expiresAt > now)
  verificationCleaned = verificationTokens.length - validVerification.length
  if (verificationCleaned > 0) {
    await writeFile(
      path.join(DATA_DIR, VERIFICATION_TOKENS_FILE),
      JSON.stringify(validVerification, null, 2),
      'utf-8'
    )
  }

  // Clean refresh tokens
  const refreshTokens = await getAll<RefreshToken>(REFRESH_TOKENS_FILE)
  const validRefresh = refreshTokens.filter((t) => t.expiresAt > now)
  refreshCleaned = refreshTokens.length - validRefresh.length
  if (refreshCleaned > 0) {
    await writeFile(
      path.join(DATA_DIR, REFRESH_TOKENS_FILE),
      JSON.stringify(validRefresh, null, 2),
      'utf-8'
    )
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
