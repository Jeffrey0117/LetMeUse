import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import type { AuthUser } from '@/lib/auth-models'
import type { Session } from '@/lib/session'
import { getAll, SESSIONS_FILE, USERS_FILE } from '@/lib/storage'
import { requireAdmin } from '@/lib/auth/middleware'
import { corsResponse, paginated, fail } from '@/lib/api-result'

export async function OPTIONS(request: NextRequest) {
  return corsResponse(request.headers.get('origin'))
}

export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin')

  try {
    const authResult = await requireAdmin(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') ?? '1', 10)
    const limit = parseInt(searchParams.get('limit') ?? '20', 10)

    const sessions = await getAll<Session>(SESSIONS_FILE)
    const users = await getAll<AuthUser>(USERS_FILE)

    const userMap = new Map(users.map((u) => [u.id, u.email]))

    let enriched = sessions.map((s) => ({
      id: s.id,
      userId: s.userId,
      userEmail: userMap.get(s.userId) ?? 'Unknown',
      device: s.device,
      ip: s.ip,
      lastActiveAt: s.lastActiveAt,
      createdAt: s.createdAt,
    }))

    if (search) {
      const lower = search.toLowerCase()
      enriched = enriched.filter((s) => s.userEmail.toLowerCase().includes(lower))
    }

    // Sort by lastActiveAt descending
    enriched = [...enriched].sort(
      (a, b) => new Date(b.lastActiveAt).getTime() - new Date(a.lastActiveAt).getTime()
    )

    const total = enriched.length
    const start = (page - 1) * limit
    const paged = enriched.slice(start, start + limit)

    return paginated({ sessions: paged }, { total, page, limit }, origin)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to list sessions'
    return fail(message, 500, origin)
  }
}
