import { NextResponse } from 'next/server'
import { loadSigningKeys } from '@/lib/auth/keys'

/**
 * JWKS 端點 — 接入方用這裡的公鑰驗 ES256 token (jose createRemoteJWKSet)。
 * 公開、可快取。沒設私鑰時回空 keys (不爆)。
 */
export async function GET() {
  const keys = await loadSigningKeys()
  const body = keys ? { keys: [keys.publicJwk] } : { keys: [] }
  return NextResponse.json(body, {
    headers: {
      // 接入方該快取; 遇到不認得的 kid 才重抓 (避免每次 request 打這支)
      'Cache-Control': 'public, max-age=3600, must-revalidate',
      'Access-Control-Allow-Origin': '*',
    },
  })
}
