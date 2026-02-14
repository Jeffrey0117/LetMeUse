import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/middleware'
import { corsResponse, paginated, fail } from '@/lib/api-result'
import { queryAuditLog } from '@/lib/audit'

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
    const appId = searchParams.get('appId') ?? undefined
    const actorId = searchParams.get('actorId') ?? undefined
    const action = searchParams.get('action') ?? undefined
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') ?? '50', 10)))

    const offset = (page - 1) * limit
    const { entries, total } = await queryAuditLog({ appId, actorId, action, limit, offset })

    return paginated(entries, { total, page, limit }, origin)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to get audit log'
    return fail(message, 500, origin)
  }
}
