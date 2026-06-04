import { timingSafeEqual } from 'crypto'

/**
 * Constant-time 字串比較 — 防 timing oracle。
 * 普通 `===`/`!==` 會在第一個不同 byte 短路, 把長度與前綴 match 的時間洩出去,
 * 攻擊者能據此一個 byte 一個 byte 還原密鑰 / 簽章。比 secret / HMAC 一律用這個。
 */
export function safeEqual(a: string | null | undefined, b: string | null | undefined): boolean {
  if (typeof a !== 'string' || typeof b !== 'string') return false
  const ab = Buffer.from(a)
  const bb = Buffer.from(b)
  if (ab.length !== bb.length) return false
  return timingSafeEqual(ab, bb)
}
