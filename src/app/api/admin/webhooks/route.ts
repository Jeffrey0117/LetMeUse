import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/middleware'
import { corsResponse, paginated, fail } from '@/lib/api-result'
import { getWebhookEvents } from '@/lib/webhook'

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
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') ?? '50', 10)))

    if (!appId) {
      return fail('appId is required', 400, origin)
    }

    const offset = (page - 1) * limit
    const { events, total } = await getWebhookEvents(appId, { limit, offset })

    return paginated(events, { total, page, limit }, origin)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to get webhook events'
    return fail(message, 500, origin)
  }
}
