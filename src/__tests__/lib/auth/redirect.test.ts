import { describe, it, expect } from 'vitest'
import { isRedirectAllowed, normaliseDomain } from '@/lib/auth/redirect'

const BASE = 'https://auth.example.test'
const DOMAINS = ['shop.example', 'https://Blog.Example:8443/path', '  ']

describe('normaliseDomain', () => {
  it('reduces anything domain-like to a bare lowercase hostname', () => {
    expect(normaliseDomain('shop.example')).toBe('shop.example')
    expect(normaliseDomain('https://Blog.Example:8443/path')).toBe('blog.example')
    expect(normaliseDomain('localhost:3000')).toBe('localhost')
    expect(normaliseDomain('   ')).toBe('')
  })
})

describe('isRedirectAllowed', () => {
  it('allows registered domains and their subdomains', () => {
    for (const target of [
      'https://shop.example/',
      'https://shop.example/cart?x=1#top',
      'https://www.shop.example/',
      'http://blog.example/post',
      'https://auth.example.test/login',
    ]) {
      expect(isRedirectAllowed(target, DOMAINS, BASE), target).toBe(true)
    }
  })

  it('rejects hosts the app never registered', () => {
    for (const target of [
      'https://evil.example/',
      'https://shop.example.evil.example/',
      'https://notshop.example/',
      'https://evilshop.example/',
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

  it('an app with no domains only allows the auth host itself', () => {
    expect(isRedirectAllowed('https://shop.example/', [], BASE)).toBe(false)
    expect(isRedirectAllowed('https://shop.example/', undefined, BASE)).toBe(false)
    expect(isRedirectAllowed('https://auth.example.test/x', [], BASE)).toBe(true)
  })
})
