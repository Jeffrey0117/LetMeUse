import crypto from 'crypto'

/**
 * 🔁 跨 app SSO 一次性交換碼（in-memory，單程序 PM2 部署）。
 * exchange 端用有效 token 換 code，redeem 端 60 秒內以 code 換目標 app 的 tokens。
 * 單次使用、過期即棄；程序重啟即全部失效（可接受：TTL 僅 60 秒）。
 */

export interface SsoCodePayload {
  userId: string
  sourceAppId: string
  targetAppId: string
}

interface StoredSsoCode extends SsoCodePayload {
  expiresAt: number
}

const TTL_MS = 60 * 1000
const codes = new Map<string, StoredSsoCode>()

export function createSsoCode(payload: SsoCodePayload): string {
  const code = crypto.randomBytes(32).toString('hex')
  codes.set(code, { ...payload, expiresAt: Date.now() + TTL_MS })
  return code
}

/** 取出並銷毀（單次使用）；不存在或過期回 null */
export function consumeSsoCode(code: string): SsoCodePayload | null {
  const item = codes.get(code)
  if (!item) return null
  codes.delete(code)
  if (item.expiresAt < Date.now()) return null
  const { expiresAt: _expiresAt, ...payload } = item
  return payload
}

const sweeper = setInterval(() => {
  const now = Date.now()
  for (const [key, value] of codes) {
    if (value.expiresAt < now) codes.delete(key)
  }
}, TTL_MS)
sweeper.unref?.()
