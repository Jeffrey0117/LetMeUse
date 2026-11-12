/**
 * Who counts as a PLATFORM admin — someone allowed into /api/admin/* and the
 * console, with power over every app.
 *
 * Being `role: admin` in some app is not enough: each app's tokens sit in that
 * site's own localStorage, so every extra accepted app is one more place a
 * stolen token becomes the keys to everything. All four conditions must hold:
 *
 *   1. the token was issued for the one console app (PLATFORM_ADMIN_APP_ID)
 *   2. the email is on the allowlist (PLATFORM_ADMIN_EMAILS)
 *   3. the account is, right now, an enabled admin in the database
 *
 * Missing configuration denies everyone (the service token is handled
 * separately and is unaffected).
 */

export interface PlatformAdminConfig {
  appId: string
  emails: readonly string[]
}

export interface PlatformAdminCandidate {
  tokenApp: string | undefined
  tokenEmail: string | undefined
  /** The stored account for the token's subject; null when it no longer exists. */
  account: { appId: string; email: string; role: string; disabled?: boolean } | null
}

export type PlatformAdminDenial =
  | 'not-configured'
  | 'wrong-app'
  | 'not-allowlisted'
  | 'account-missing'
  | 'account-disabled'
  | 'not-admin'

export function readPlatformAdminConfig(env: Record<string, string | undefined> = process.env): PlatformAdminConfig {
  return {
    appId: (env.PLATFORM_ADMIN_APP_ID ?? '').trim(),
    emails: (env.PLATFORM_ADMIN_EMAILS ?? '')
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean),
  }
}

/** null = allowed; otherwise the reason for refusing. */
export function platformAdminDenial(
  config: PlatformAdminConfig,
  candidate: PlatformAdminCandidate
): PlatformAdminDenial | null {
  if (!config.appId || config.emails.length === 0) return 'not-configured'
  if (candidate.tokenApp !== config.appId) return 'wrong-app'

  const email = (candidate.tokenEmail ?? '').toLowerCase()
  if (!email || !config.emails.includes(email)) return 'not-allowlisted'

  const account = candidate.account
  if (!account) return 'account-missing'
  // The database, not the token, is the authority: a token outlives a demotion by hours.
  if (account.appId !== config.appId || account.email.toLowerCase() !== email) return 'account-missing'
  if (account.disabled) return 'account-disabled'
  if (account.role !== 'admin') return 'not-admin'

  return null
}
