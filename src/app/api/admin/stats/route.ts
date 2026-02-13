import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import type { AuthUser } from '@/lib/auth-models'
import { getAll, USERS_FILE } from '@/lib/storage'
import { requireAdmin } from '@/lib/auth/middleware'
import { corsResponse, jsonResponse, errorResponse } from '@/lib/auth/middleware'

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

    let users = await getAll<AuthUser>(USERS_FILE)

    if (appId) {
      users = users.filter((u) => u.appId === appId)
    }

    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    const todayISO = todayStart.toISOString()

    const totalUsers = users.length
    const todayNew = users.filter((u) => u.createdAt >= todayISO).length
    const activeCount = users.filter((u) => !u.disabled).length

    return jsonResponse(
      {
        totalUsers,
        todayNew,
        activeCount,
      },
      200,
      origin
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to get stats'
    return errorResponse(message, 500, origin)
  }
}
