import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/auth/middleware'
import { corsResponse, success, fail } from '@/lib/api-result'
import { getUserSessions, revokeSession, revokeAllUserSessions } from '@/lib/session'
import { getAll, remove, REFRESH_TOKENS_FILE } from '@/lib/storage'
import type { RefreshToken } from '@/lib/auth-models'

export async function OPTIONS(request: NextRequest) {
  return corsResponse(request.headers.get('origin'))
}

// GET — list current user's sessions
export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin')

  try {
    const authResult = await authenticateRequest(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const sessions = await getUserSessions(authResult.payload.sub)

    // Strip sensitive fields
    const safe = sessions.map((s) => ({
      id: s.id,
      device: s.device,
      ip: s.ip,
      lastActiveAt: s.lastActiveAt,
      createdAt: s.createdAt,
    }))

    return success({ sessions: safe }, 200, origin)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to get sessions'
    return fail(message, 500, origin)
  }
}

// DELETE — revoke a specific session or all sessions
export async function DELETE(request: NextRequest) {
  const origin = request.headers.get('origin')

  try {
    const authResult = await authenticateRequest(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')
    const all = searchParams.get('all')

    if (all === 'true') {
      // Revoke all sessions except current (best effort)
      const sessions = await getUserSessions(authResult.payload.sub)
      let revoked = 0
      for (const session of sessions) {
        // Also remove associated refresh tokens
        const tokens = await getAll<RefreshToken>(REFRESH_TOKENS_FILE)
        const rt = tokens.find((t) => t.id === session.refreshTokenId)
        if (rt) {
          await remove<RefreshToken>(REFRESH_TOKENS_FILE, rt.id)
        }
        await revokeSession(session.id)
        revoked++
      }
      return success({ revoked }, 200, origin)
    }

    if (!sessionId) {
      return fail('sessionId or all=true is required', 400, origin)
    }

    // Verify the session belongs to this user
    const sessions = await getUserSessions(authResult.payload.sub)
    const target = sessions.find((s) => s.id === sessionId)
    if (!target) {
      return fail('Session not found', 404, origin)
    }

    // Remove the refresh token too
    const tokens = await getAll<RefreshToken>(REFRESH_TOKENS_FILE)
    const rt = tokens.find((t) => t.id === target.refreshTokenId)
    if (rt) {
      await remove<RefreshToken>(REFRESH_TOKENS_FILE, rt.id)
    }

    await revokeSession(sessionId)

    return success({ revoked: true }, 200, origin)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to revoke session'
    return fail(message, 500, origin)
  }
}
