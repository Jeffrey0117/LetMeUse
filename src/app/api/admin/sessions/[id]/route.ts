import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import type { Session } from '@/lib/session'
import type { RefreshToken } from '@/lib/auth-models'
import { getById, getAll, remove, SESSIONS_FILE, REFRESH_TOKENS_FILE } from '@/lib/storage'
import { requireAdmin } from '@/lib/auth/middleware'
import { corsResponse, success, fail } from '@/lib/api-result'

export async function OPTIONS(request: NextRequest) {
  return corsResponse(request.headers.get('origin'))
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const origin = request.headers.get('origin')

  try {
    const authResult = await requireAdmin(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { id } = await params

    const session = await getById<Session>(SESSIONS_FILE, id)
    if (!session) {
      return fail('Session not found', 404, origin)
    }

    // Also remove the associated refresh token
    const tokens = await getAll<RefreshToken>(REFRESH_TOKENS_FILE)
    const rt = tokens.find((t) => t.id === session.refreshTokenId)
    if (rt) {
      await remove<RefreshToken>(REFRESH_TOKENS_FILE, rt.id)
    }

    await remove<Session>(SESSIONS_FILE, id)

    return success({ revoked: true }, 200, origin)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to revoke session'
    return fail(message, 500, origin)
  }
}
