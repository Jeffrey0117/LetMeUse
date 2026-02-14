import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import type { AuthUser } from '@/lib/auth-models'
import { toPublicUser } from '@/lib/auth-models'
import { getAll, USERS_FILE } from '@/lib/storage'
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
    const appId = searchParams.get('appId')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') ?? '1', 10)
    const limit = parseInt(searchParams.get('limit') ?? '20', 10)

    let users = await getAll<AuthUser>(USERS_FILE)

    if (appId) {
      users = users.filter((u) => u.appId === appId)
    }

    if (search) {
      const lower = search.toLowerCase()
      users = users.filter(
        (u) =>
          u.email.toLowerCase().includes(lower) ||
          u.displayName.toLowerCase().includes(lower)
      )
    }

    const total = users.length
    const start = (page - 1) * limit
    const paged = users.slice(start, start + limit)

    return paginated(
      { users: paged.map(toPublicUser) },
      { total, page, limit },
      origin
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to list users'
    return fail(message, 500, origin)
  }
}
