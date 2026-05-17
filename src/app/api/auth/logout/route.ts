import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import type { RefreshToken } from '@/lib/auth-models'
import { removeWhere, REFRESH_TOKENS_FILE } from '@/lib/storage'
import { authenticateRequest } from '@/lib/auth/middleware'
import { corsResponse, success, fail } from '@/lib/api-result'
import { revokeAllUserSessions } from '@/lib/session'

export async function OPTIONS(request: NextRequest) {
  return corsResponse(request.headers.get('origin'))
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin')

  try {
    const authResult = await authenticateRequest(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    await removeWhere<RefreshToken>(REFRESH_TOKENS_FILE, 'userId', authResult.payload.sub)

    await revokeAllUserSessions(authResult.payload.sub)

    return success({ loggedOut: true }, 200, origin)
  } catch (error) {
        return fail('Logout failed', 500, origin)
  }
}
