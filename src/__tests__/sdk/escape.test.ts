import { describe, it, expect } from 'vitest'
import { esc, safeAvatarUrl } from '@/sdk/ui/escape'

const BASE = 'https://auth.example.test'

describe('esc', () => {
  it('neutralises markup and attribute breakouts', () => {
    expect(esc('<img src=x onerror=alert(1) ')).toBe('&lt;img src=x onerror=alert(1) ')
    expect(esc('x" onerror="alert(1)')).toBe('x&quot; onerror=&quot;alert(1)')
    expect(esc("a'b`c&d")).toBe('a&#39;b&#96;c&amp;d')
  })

  it('leaves ordinary text alone and tolerates non-strings', () => {
    expect(esc('王小明 Jeff')).toBe('王小明 Jeff')
    expect(esc(null)).toBe('')
    expect(esc(undefined)).toBe('')
    expect(esc(42)).toBe('42')
  })

  it('escaped output can no longer open a tag or close an attribute', () => {
    for (const payload of ['"><script>alert(1)</script>', "' onmouseover='x", '</p><svg onload=x>', '`onerror=x']) {
      expect(esc(payload)).not.toMatch(/[<>"'`]/)
    }
  })
})

describe('safeAvatarUrl', () => {
  it('accepts https URLs and upload paths on the auth host', () => {
    expect(safeAvatarUrl('https://cdn.example/a.png', BASE)).toBe('https://cdn.example/a.png')
    expect(safeAvatarUrl('/uploads/avatars/avatar_usr_1.jpg', BASE)).toBe(`${BASE}/uploads/avatars/avatar_usr_1.jpg`)
  })

  it('rejects everything else', () => {
    for (const bad of [
      'x" onerror="alert(1)',
      'javascript:alert(1)',
      'data:image/svg+xml,<svg onload=alert(1)>',
      'http://cdn.example/a.png',
      '//evil.example/a.png',
      '/uploads/../admin',
      '/uploads/a.png" onerror="x',
      '/other/a.png',
      '',
      null,
      undefined,
    ]) {
      expect(safeAvatarUrl(bad as string, BASE), String(bad)).toBe('')
    }
  })

  it('never returns a string that can break out of a quoted attribute', () => {
    const out = safeAvatarUrl('https://cdn.example/a.png?x="><script>', BASE)
    expect(out).not.toMatch(/["<>]/)
  })
})
