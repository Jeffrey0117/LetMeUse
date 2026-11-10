// 2026-11-11 回歸:「不是登入用、卻是 type=password」的欄位會被瀏覽器自動填入。
//
// 管理後台的 OAuth 設定是「Client ID(文字)+ Client Secret(密碼型)」,在瀏覽器
// 眼中就是一組帳號密碼。還沒設定過的 provider 欄位是空的,瀏覽器可能把管理員自己
// 的登入帳密填進去;之後只要為了別的事按下 Save,管理員密碼就以明文存進該 app 的
// OAuth 設定。Chrome 對密碼欄刻意無視 autocomplete="off"。
//
// secret 不是登入密碼:改成一般文字欄位 + CSS 遮罩,瀏覽器就不會把它當密碼欄來填。
import { describe, expect, it } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'

import { SECRET_INPUT_CLASS, SECRET_INPUT_PROPS } from '@/lib/secret-input'

const read = (rel: string) => fs.readFileSync(path.resolve(__dirname, '../..', rel), 'utf8')

describe('secret input', () => {
  it('is not a password field, so credential autofill never targets it', () => {
    expect(SECRET_INPUT_PROPS.type).toBe('text')
  })

  it('tells ordinary autofill and password managers to stay out', () => {
    expect(SECRET_INPUT_PROPS.autoComplete).toBe('off')
    expect(SECRET_INPUT_PROPS.spellCheck).toBe(false)
    for (const attr of ['data-lpignore', 'data-1p-ignore', 'data-bwignore', 'data-form-type']) {
      expect(SECRET_INPUT_PROPS).toHaveProperty([attr])
    }
  })

  it('still masks the value on screen', () => {
    expect(SECRET_INPUT_CLASS).toMatch(/-webkit-text-security:disc/)
  })

  it.each([
    ['app/admin/apps/oauth-config-form.tsx', 2],
    ['app/admin/apps/purchase-verify-form.tsx', 1],
  ])('%s renders its secrets through it (%i field(s)) and has no password-type input', (file, fields) => {
    const src = read(file)
    expect(src).not.toMatch(/type=["']password["']/)
    expect(src.match(/\{\.\.\.SECRET_INPUT_PROPS\}/g) ?? []).toHaveLength(fields)
    expect(src.match(/SECRET_INPUT_CLASS\}/g) ?? []).toHaveLength(fields)
  })
})
