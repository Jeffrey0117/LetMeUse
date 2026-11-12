import { SignJWT, jwtVerify } from 'jose'
import type { App, AuthUser } from '../auth-models'
import { getPermissionsForRole } from '../rbac'
import { loadSigningKeys } from './keys'

export interface AccessTokenPayload {
  sub: string
  email: string
  name: string
  role: string
  permissions: string[]
  app: string
  emailVerified: boolean
  iat: number
  exp: number
}

function getSecretKey(appSecret: string): Uint8Array {
  return new TextEncoder().encode(appSecret)
}

/**
 * 解 JWT 的 base64url payload 段 (驗簽前先讀 app claim 用)。
 * ⚠️ 不能用 atob():JWT 段是 base64url (-/_),atob 只吃標準 base64,遇到 -/_ 直接 throw。
 * 純 ASCII payload 的 base64url 結構上不會出現 -/_,所以英文名 user 一直沒事;
 * 非 ASCII displayName (中文名) 的 payload 必含 -/_ → 2026-06-08 全請求 401 被踢事故。
 */
export function decodeJwtPayloadSegment(seg: string): Record<string, unknown> {
  return JSON.parse(Buffer.from(seg, 'base64url').toString('utf-8'))
}

export async function signAccessToken(
  user: AuthUser,
  app: App
): Promise<string> {
  const permissions = await getPermissionsForRole(app.id, user.role)
  const builder = new SignJWT({
    email: user.email,
    name: user.displayName,
    role: user.role,
    permissions,
    app: app.id,
    emailVerified: !!user.emailVerified,
  })
    .setSubject(user.id)
    .setIssuedAt()
    .setIssuer((process.env.NEXT_PUBLIC_BASE_URL || 'https://letmeuse.isnowfriend.com').replace(/\/$/, ''))
    // 🔒 24h → 4h: 縮短「登出/停用後舊 access token 還能用」的窗口。
    // SDK 到期前 5 分自動 refresh (對使用者透明); refresh route 擋 disabled/已登出 = 真撤銷。
    .setExpirationTime('4h')

  // 🔑 只簽 ES256。以前金鑰載不起來會無聲退回 HS256「不讓登入掛掉」,但本服務和所有
  // 接入方都只收 ES256,退回去的 token 沒有任何人會收 —— 登入其實還是掛了,只是零線索。
  // 現在直接丟錯,log 會指名缺哪個設定。
  const keys = await loadSigningKeys()
  if (!keys) {
    throw new Error(
      '[auth/jwt] ES256 signing key unavailable: set LETMEUSE_JWT_PRIVATE_KEY_B64 (base64 PKCS#8 EC P-256). ' +
        'Refusing to fall back to HS256.'
    )
  }
  return builder.setProtectedHeader({ alg: 'ES256', kid: keys.kid }).sign(keys.privateKey)
}

export async function signRefreshTokenJWT(
  user: AuthUser,
  app: App
): Promise<string> {
  const key = getSecretKey(app.secret)
  return new SignJWT({
    type: 'refresh',
    app: app.id,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(key)
}

export async function verifyAccessToken(
  token: string,
  _appSecret: string
): Promise<AccessTokenPayload> {
  // 🔒 2026-10-30 資安批次:access token 只收 ES256(簽發端已全面 ES256 多時)。
  // HS256 過渡路徑廢除 — app secret 一洩就能自簽任意 sub 偽造任何用戶
  // (pokkit 事件根因)。refresh token 不走這裡(redeem 時查儲存比對,非驗簽)。
  // _appSecret 參數保留只為呼叫端簽名相容,不再使用。
  const keys = await loadSigningKeys()
  if (!keys) throw new Error('ES256 signing keys not configured (LETMEUSE_JWT_PRIVATE_KEY_B64)')
  const { payload } = await jwtVerify(token, keys.publicKey, { algorithms: ['ES256'] })
  return payload as unknown as AccessTokenPayload
}
