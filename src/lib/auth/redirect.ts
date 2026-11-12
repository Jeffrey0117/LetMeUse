/**
 * Where may a sign-in send the member (and their tokens) afterwards?
 *
 * Tokens travel in the URL fragment of the redirect target, so the target must
 * be an origin the app registered — otherwise a crafted sign-in link hands a
 * member's session to whoever wrote the link.
 *
 * Matching is exact. A registered `https://shop.example` does NOT cover
 * `https://anything.shop.example`: sibling subdomains are often different
 * sites, sometimes other people's. To cover subdomains on purpose, register
 * `*.shop.example`.
 */

const LOCAL_HOSTS = ['localhost', '127.0.0.1']

interface AllowedEntry {
  /** Full origin when the entry named a scheme (`https://a.example:8443`). */
  origin?: string
  /** Host for entries registered without a scheme (`a.example`). */
  host?: string
  /** Suffix for explicit wildcard entries (`*.a.example` → `.a.example`). */
  wildcardSuffix?: string
}

/** `https://Example.com:443/path` → `example.com`. Unusable input → ''. */
export function normaliseDomain(raw: string): string {
  const value = raw.trim().toLowerCase()
  if (!value) return ''
  try {
    return new URL(value.includes('://') ? value : `https://${value}`).hostname
  } catch {
    return ''
  }
}

function parseEntry(raw: string): AllowedEntry | null {
  const value = raw.trim().toLowerCase()
  if (!value) return null

  if (value.startsWith('*.')) {
    const host = normaliseDomain(value.slice(2))
    return host ? { wildcardSuffix: `.${host}` } : null
  }

  if (value.includes('://')) {
    try {
      const url = new URL(value)
      return ['http:', 'https:'].includes(url.protocol) ? { origin: url.origin } : null
    } catch {
      return null
    }
  }

  const host = normaliseDomain(value)
  return host ? { host } : null
}

function isSecureEnough(url: URL): boolean {
  // Plain http only ever makes sense for a developer's own machine.
  return url.protocol === 'https:' || (url.protocol === 'http:' && LOCAL_HOSTS.includes(url.hostname))
}

/**
 * True when `redirectUrl` is an absolute http(s) URL on an origin the app
 * registered, or on the LetMeUse origin itself.
 */
export function isRedirectAllowed(
  redirectUrl: string | null | undefined,
  appDomains: readonly string[] | null | undefined,
  baseUrl: string
): boolean {
  if (!redirectUrl) return false

  let url: URL
  try {
    url = new URL(redirectUrl)
  } catch {
    return false
  }
  if (!['http:', 'https:'].includes(url.protocol)) return false
  // `https://good.example@evil.example/` — the host is evil.example; never accept credentials in the target
  if (url.username || url.password) return false

  const host = url.hostname.toLowerCase()
  const entries = [...(appDomains ?? []), baseUrl].map(parseEntry).filter((e): e is AllowedEntry => e !== null)

  return entries.some((entry) => {
    if (entry.origin) return url.origin === entry.origin
    if (entry.host) return host === entry.host && isSecureEnough(url)
    if (entry.wildcardSuffix) return host.endsWith(entry.wildcardSuffix) && url.protocol === 'https:'
    return false
  })
}
