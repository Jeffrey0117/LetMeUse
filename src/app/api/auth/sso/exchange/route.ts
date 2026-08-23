import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import type { App, AuthUser } from '@/lib/auth-models'
import { getById, APPS_FILE, USERS_FILE } from '@/lib/storage'
import { authenticateRequest } from '@/lib/auth/middleware'
import { corsResponse, success, fail } from '@/lib/api-result'
import { createSsoCode } from '@/lib/auth/sso-codes'

export async function OPTIONS(request: NextRequest) {
  return corsResponse(request.headers.get('origin'))
}

/**
 * 🔁 SSO 跨 app 交換：拿 app A 的有效 access token，換一組 60 秒一次性 code。
 * 前端把 code 帶去目標 app 網域，由 /api/auth/sso/redeem 兌換成目標 app 的 tokens。
 */
export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin')

  try {
    const auth = await authenticateRequest(request)
    if (auth instanceof NextResponse) {
      return auth
    }

    const body = await request.json().catch(() => ({}))
    const targetAppId = typeof body.targetAppId === 'string' ? body.targetAppId : ''
    if (!targetAppId) {
      return fail('targetAppId required', 400, origin)
    }

    const targetApp = await getById<App>(APPS_FILE, targetAppId)
    if (!targetApp) {
      return fail('Unknown target app', 400, origin)
    }

    const user = await getById<AuthUser>(USERS_FILE, auth.payload.sub)
    if (!user || user.disabled) {
      return fail('Unauthorized', 401, origin)
    }

    const code = createSsoCode({
      userId: user.id,
      sourceAppId: user.appId,
      targetAppId,
    })

    return success({ code, expiresIn: 60 }, 200, origin)
  } catch {
    return fail('Exchange failed', 500, origin)
  }
}
