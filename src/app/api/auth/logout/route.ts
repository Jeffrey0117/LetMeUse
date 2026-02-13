import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import type { RefreshToken } from '@/lib/auth-models'
import { getAll, remove, REFRESH_TOKENS_FILE } from '@/lib/storage'
import { authenticateRequest } from '@/lib/auth/middleware'
import { corsResponse, jsonResponse, errorResponse } from '@/lib/auth/middleware'

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

    const tokens = await getAll<RefreshToken>(REFRESH_TOKENS_FILE)
    const userTokens = tokens.filter((t) => t.userId === authResult.payload.sub)

    for (const token of userTokens) {
      await remove<RefreshToken>(REFRESH_TOKENS_FILE, token.id)
    }

    return jsonResponse({ success: true }, 200, origin)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Logout failed'
    return errorResponse(message, 500, origin)
  }
}
