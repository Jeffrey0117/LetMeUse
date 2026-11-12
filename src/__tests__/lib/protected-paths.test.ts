import { describe, it, expect } from 'vitest'
import { isAdminOnlyPath, isLocalPath } from '@/lib/protected-paths'

describe('isAdminOnlyPath', () => {
  it('covers the internal tool pages and everything under them', () => {
    for (const path of ['/dashboard', '/projects', '/projects/abc', '/ads', '/ads/new', '/ads/1/edit', '/templates']) {
      expect(isAdminOnlyPath(path), path).toBe(true)
    }
  })

  it('leaves public pages alone', () => {
    for (const path of ['/', '/login', '/reset-password', '/account', '/checkout', '/themes.html', '/adsense', '/projects-old', '/preview/1']) {
      expect(isAdminOnlyPath(path), path).toBe(false)
    }
  })
})

describe('isLocalPath', () => {
  it('accepts same-site paths', () => {
    for (const target of ['/admin', '/dashboard', '/ads/1/edit?x=1']) {
      expect(isLocalPath(target), target).toBe(true)
    }
  })

  it('rejects anything a browser would send to another origin', () => {
    for (const target of ['', 'admin', 'https://evil.example', '//evil.example', '/\\evil.example', 'javascript:alert(1)', '/\t/evil.example', '/\n/evil.example', '/ /evil.example', '/a\\b', '/\u0000/evil.example']) {
      expect(isLocalPath(target), target).toBe(false)
    }
  })
})
