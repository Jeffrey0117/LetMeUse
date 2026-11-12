/**
 * Where may a sign-in send the member (and their tokens) afterwards?
 *
 * Tokens travel in the URL fragment of the redirect target, so the target must
 * be a host the app registered — otherwise a crafted sign-in link hands a
 * member's session to whoever wrote the link.
 */

const WEB_PROTOCOLS = ['http:', 'https:']

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

/**
 * True when `redirectUrl` is an absolute http(s) URL whose host is one of the
 * app's registered domains (or a subdomain of one), or the LetMeUse host itself.
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
  if (!WEB_PROTOCOLS.includes(url.protocol)) return false
  // `https://good.example@evil.example/` — the host is evil.example; never accept credentials in the target
  if (url.username || url.password) return false

  const host = url.hostname.toLowerCase()
  const allowed = [...(appDomains ?? []), baseUrl].map(normaliseDomain).filter(Boolean)

  return allowed.some((domain) => host === domain || host.endsWith(`.${domain}`))
}
