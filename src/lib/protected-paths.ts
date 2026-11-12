/**
 * Internal tool pages that only a signed-in admin may open.
 * Shared by the middleware (cookie check) and the client shell (role check).
 * `/admin` is listed separately in both places because it has its own layout.
 */
export const ADMIN_ONLY_PREFIXES: readonly string[] = ['/dashboard', '/projects', '/ads', '/templates']

export function isAdminOnlyPath(pathname: string): boolean {
  return ADMIN_ONLY_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))
}

/**
 * Same-site path such as `/admin`. Rejects `//host` and `/\host` (another
 * origin to a browser) and any whitespace or control character: URL parsers
 * strip tabs and newlines, so `/\t/host` would otherwise become `//host`.
 */
export function isLocalPath(target: string): boolean {
  return /^\/(?![/\\])[^\s\\\u0000-\u001f\u007f]*$/.test(target)
}
