import { SignJWT, jwtVerify } from 'jose'
import type { App, AuthUser } from '../auth-models'
import { getPermissionsForRole } from '../rbac'

export interface AccessTokenPayload {
  sub: string
  email: string
  name: string
  role: string
  permissions: string[]
  app: string
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
  const key = getSecretKey(app.secret)
  const permissions = await getPermissionsForRole(app.id, user.role)
  return new SignJWT({
    email: user.email,
    name: user.displayName,
    role: user.role,
    permissions,
    app: app.id,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(key)
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
  const key = getSecretKey(appSecret)
  const { payload } = await jwtVerify(token, key)
  return payload as unknown as AccessTokenPayload
}
