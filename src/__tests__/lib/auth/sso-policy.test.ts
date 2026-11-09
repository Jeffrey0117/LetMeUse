import { describe, expect, it } from 'vitest'
import { canRedeemIntoExistingAccount } from '@/lib/auth/sso-policy'

describe('canRedeemIntoExistingAccount', () => {
  it('allows a verified source account', () => {
    expect(canRedeemIntoExistingAccount({ emailVerified: true })).toBe(true)
  })

  it('rejects an unverified source account', () => {
    expect(canRedeemIntoExistingAccount({ emailVerified: false })).toBe(false)
  })

  it('rejects a source account with no verification flag', () => {
    expect(canRedeemIntoExistingAccount({})).toBe(false)
  })
})
