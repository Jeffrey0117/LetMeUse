import { describe, it, expect } from 'vitest'
import { isRedirectAllowed, normaliseDomain } from '@/lib/auth/redirect'

const BASE = 'https://auth.example.test'
const DOMAINS = ['https://shop.example', 'http://localhost:4016', 'bare.example', '*.wild.example', '  ']

describe('normaliseDomain', () => {
  it('reduces anything domain-like to a bare lowercase hostname', () => {
    expect(normaliseDomain('shop.example')).toBe('shop.example')
    expect(normaliseDomain('https://Blog.Example:8443/path')).toBe('blog.example')
    expect(normaliseDomain('localhost:3000')).toBe('localhost')
    expect(normaliseDomain('   ')).toBe('')
  })
})

describe('isRedirectAllowed', () => {
  it('allows exactly the registered origins', () => {
    for (const target of [
      'https://shop.example/',
      'https://shop.example/cart?x=1#top',
      'https://SHOP.example/',
      'http://localhost:4016/app',
      'https://bare.example/x',
      'https://auth.example.test/login',
    ]) {
      expect(isRedirectAllowed(target, DOMAINS, BASE), target).toBe(true)
    }
  })

  it('does not extend a registered origin to its subdomains, other ports or http', () => {
    for (const target of [
      'https://www.shop.example/',
      'https://evil.shop.example/',
      'https://shop.example:8443/',
      'http://shop.example/',
      'http://localhost:9999/',
      'http://bare.example/',
      'https://sub.bare.example/',
      'https://sub.auth.example.test/',
    ]) {
      expect(isRedirectAllowed(target, DOMAINS, BASE), target).toBe(false)
    }
  })

  it('covers subdomains only for an explicit wildcard entry, https only', () => {
    expect(isRedirectAllowed('https://a.wild.example/', DOMAINS, BASE)).toBe(true)
    expect(isRedirectAllowed('https://a.b.wild.example/', DOMAINS, BASE)).toBe(true)
    expect(isRedirectAllowed('http://a.wild.example/', DOMAINS, BASE)).toBe(false)
    expect(isRedirectAllowed('https://wild.example/', DOMAINS, BASE)).toBe(false)
    expect(isRedirectAllowed('https://notwild.example/', DOMAINS, BASE)).toBe(false)
  })

  it('rejects hosts the app never registered', () => {
    for (const target of [
      'https://evil.example/',
      'https://shop.example.evil.example/',
      'https://notshop.example/',
      'https://shop.example@evil.example/',
      'https://evil.example/?next=https://shop.example/',
    ]) {
      expect(isRedirectAllowed(target, DOMAINS, BASE), target).toBe(false)
    }
  })

  it('rejects non-web schemes, relative paths and empty input', () => {
    for (const target of ['javascript:alert(1)', 'data:text/html,x', '/admin', '//evil.example', '', null, undefined]) {
      expect(isRedirectAllowed(target, DOMAINS, BASE), String(target)).toBe(false)
    }
  })

  it('an app with no domains only allows the auth origin itself', () => {
    expect(isRedirectAllowed('https://shop.example/', [], BASE)).toBe(false)
    expect(isRedirectAllowed('https://shop.example/', undefined, BASE)).toBe(false)
    expect(isRedirectAllowed('https://auth.example.test/x', [], BASE)).toBe(true)
  })
})
