import { SignJWT, jwtVerify, decodeProtectedHeader } from 'jose'
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

  // 🔑 Phase 2 開關: LETMEUSE_SIGN_ALG=ES256 → 非對稱簽 (接入方走 JWKS 公鑰驗, 不靠共用 secret)。
  // 預設 (未設) 仍 HS256 → 不動現有行為。
  if (process.env.LETMEUSE_SIGN_ALG === 'ES256') {
    const keys = await loadSigningKeys()
    if (keys) {
      return builder.setProtectedHeader({ alg: 'ES256', kid: keys.kid }).sign(keys.privateKey)
    }
    // 沒設金鑰 → 退回 HS256 (不讓登入掛掉)
  }
  return builder.setProtectedHeader({ alg: 'HS256' }).sign(getSecretKey(app.secret))
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
  appSecret: string
): Promise<AccessTokenPayload> {
  // 過渡期兩種都收: header alg=ES256 → 用 JWKS 公鑰驗; 否則 HS256 → 用 app secret 驗。
  // 🔒 兩條都「鎖死 algorithm」, 不讓攻擊者在 header 亂換 alg (confusion / none)。
  let alg = 'HS256'
  try {
    alg = (decodeProtectedHeader(token).alg as string) || 'HS256'
  } catch {
    // 解不開 header → 當 HS256 走下面, jwtVerify 會擋
  }
  if (alg === 'ES256') {
    const keys = await loadSigningKeys()
    if (!keys) throw new Error('ES256 token but no signing keys configured')
    const { payload } = await jwtVerify(token, keys.publicKey, { algorithms: ['ES256'] })
    return payload as unknown as AccessTokenPayload
  }
  const { payload } = await jwtVerify(token, getSecretKey(appSecret), { algorithms: ['HS256'] })
  return payload as unknown as AccessTokenPayload
}
