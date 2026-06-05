import { importPKCS8, importJWK, exportJWK, calculateJwkThumbprint, type JWK } from 'jose'

/**
 * 🔑 JWKS 非對稱簽章金鑰 (ES256)。
 * - 私鑰只在 server (env LETMEUSE_JWT_PRIVATE_KEY_B64 = PKCS8 PEM 的 base64), 永不外洩。
 * - 公鑰走 /api/jwks 給接入方驗 → 不再需要「共用 app secret」當簽章金鑰。
 * - kid = 公鑰的 JWK thumbprint (RFC 7638), 之後輪換靠 kid 配對。
 */
export interface SigningKeys {
  privateKey: CryptoKey // 簽 (sign)
  publicKey: CryptoKey  // 驗 (verify)
  publicJwk: JWK        // 給 JWKS 端點 (含 kid/use/alg)
  kid: string
}

let _cached: Promise<SigningKeys | null> | null = null

export function loadSigningKeys(): Promise<SigningKeys | null> {
  if (_cached) return _cached
  _cached = (async () => {
    const b64 = process.env.LETMEUSE_JWT_PRIVATE_KEY_B64
    if (!b64) return null
    try {
      const pem = Buffer.from(b64, 'base64').toString('utf-8')
      const privateKey = await importPKCS8(pem, 'ES256', { extractable: true })
      const full = await exportJWK(privateKey)
      const pub: JWK = { kty: full.kty, crv: full.crv, x: full.x, y: full.y }
      const kid = await calculateJwkThumbprint(pub)
      const publicKey = (await importJWK(pub, 'ES256')) as CryptoKey
      return { privateKey, publicKey, publicJwk: { ...pub, use: 'sig', alg: 'ES256', kid }, kid }
    } catch {
      return null
    }
  })()
  return _cached
}
