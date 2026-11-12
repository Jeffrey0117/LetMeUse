import { describe, it, expect } from 'vitest'
import { platformAdminDenial, readPlatformAdminConfig } from '@/lib/auth/platform-admin'

const config = { appId: 'app_console', emails: ['owner@example.test'] }
const account = { appId: 'app_console', email: 'owner@example.test', role: 'admin', disabled: false }
const good = { tokenApp: 'app_console', tokenEmail: 'Owner@Example.test', account }

describe('readPlatformAdminConfig', () => {
  it('parses the app id and a comma-separated, case-insensitive allowlist', () => {
    expect(readPlatformAdminConfig({ PLATFORM_ADMIN_APP_ID: ' app_console ', PLATFORM_ADMIN_EMAILS: 'A@x.test, b@x.test ,' })).toEqual({
      appId: 'app_console',
      emails: ['a@x.test', 'b@x.test'],
    })
  })

  it('is empty when nothing is set', () => {
    expect(readPlatformAdminConfig({})).toEqual({ appId: '', emails: [] })
  })
})

describe('platformAdminDenial', () => {
  it('allows the allowlisted admin of the console app', () => {
    expect(platformAdminDenial(config, good)).toBeNull()
  })

  it('denies everyone when either setting is missing', () => {
    expect(platformAdminDenial({ ...config, appId: '' }, good)).toBe('not-configured')
    expect(platformAdminDenial({ ...config, emails: [] }, good)).toBe('not-configured')
  })

  it('denies the same person holding an admin token from any other app', () => {
    const other = { ...account, appId: 'app_other' }
    expect(platformAdminDenial(config, { ...good, tokenApp: 'app_other', account: other })).toBe('wrong-app')
    expect(platformAdminDenial(config, { ...good, tokenApp: undefined })).toBe('wrong-app')
  })

  it('denies a console-app admin who is not on the allowlist', () => {
    const stranger = { ...account, email: 'stranger@example.test' }
    expect(platformAdminDenial(config, { ...good, tokenEmail: 'stranger@example.test', account: stranger })).toBe('not-allowlisted')
    expect(platformAdminDenial(config, { ...good, tokenEmail: undefined })).toBe('not-allowlisted')
  })

  it('trusts the database over the token', () => {
    expect(platformAdminDenial(config, { ...good, account: null })).toBe('account-missing')
    expect(platformAdminDenial(config, { ...good, account: { ...account, disabled: true } })).toBe('account-disabled')
    expect(platformAdminDenial(config, { ...good, account: { ...account, role: 'user' } })).toBe('not-admin')
    // token claims an email/app the stored account does not have
    expect(platformAdminDenial(config, { ...good, account: { ...account, email: 'someone@else.test' } })).toBe('account-missing')
    expect(platformAdminDenial(config, { ...good, account: { ...account, appId: 'app_other' } })).toBe('account-missing')
  })
})
