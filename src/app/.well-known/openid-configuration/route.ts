import { NextResponse } from 'next/server'

/**
 * OIDC Discovery — 讓接入方用標準 OIDC/JWT library 自動設定 (不用手刻 verify)。
 * 重點欄位: issuer / jwks_uri / id_token_signing_alg_values_supported=['ES256']。
 */
export async function GET() {
  const issuer = (process.env.NEXT_PUBLIC_BASE_URL || 'https://letmeuse.isnowfriend.com').replace(/\/$/, '')
  return NextResponse.json(
    {
      issuer,
      jwks_uri: `${issuer}/api/jwks`,
      authorization_endpoint: `${issuer}/login`,
      token_endpoint: `${issuer}/api/auth/login`,
      userinfo_endpoint: `${issuer}/api/auth/me`,
      end_session_endpoint: `${issuer}/api/auth/logout`,
      grant_types_supported: ['password', 'refresh_token'],
      response_types_supported: ['token'],
      subject_types_supported: ['public'],
      id_token_signing_alg_values_supported: ['ES256'],
      token_endpoint_auth_methods_supported: ['client_secret_post'],
      claims_supported: ['sub', 'email', 'name', 'role', 'permissions', 'app', 'iss', 'iat', 'exp'],
    },
    {
      headers: {
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
      },
    },
  )
}
