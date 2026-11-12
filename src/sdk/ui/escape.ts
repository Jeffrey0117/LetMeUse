/**
 * Output escaping for the SDK UI.
 *
 * The UI is assembled as HTML strings and rendered on other people's pages,
 * next to their members' tokens. Every value that is not a literal in this
 * codebase — names, emails, roles, avatars, server messages — goes through
 * one of these before it reaches innerHTML.
 */

const HTML_ENTITIES: Readonly<Record<string, string>> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '`': '&#96;',
}

/** Escape a value for use in HTML text or inside a quoted attribute. */
export function esc(value: unknown): string {
  if (value === null || value === undefined) return ''
  return String(value).replace(/[&<>"'`]/g, (char) => HTML_ENTITIES[char])
}

const UPLOAD_PATH = /^\/uploads\/[A-Za-z0-9._\-/]+$/

/**
 * Turn a stored avatar value into a URL that is safe to put in `<img src>`.
 * Only two shapes are accepted: an https URL, or a path under /uploads/ on the
 * LetMeUse host. Anything else (javascript:, data:, markup, relative tricks)
 * yields '' so the caller falls back to the initial.
 */
export function safeAvatarUrl(avatar: string | null | undefined, baseUrl: string): string {
  const value = (avatar ?? '').trim()
  if (!value) return ''

  if (UPLOAD_PATH.test(value) && !value.includes('..')) return `${baseUrl}${value}`

  try {
    const url = new URL(value)
    return url.protocol === 'https:' ? url.toString() : ''
  } catch {
    return ''
  }
}
