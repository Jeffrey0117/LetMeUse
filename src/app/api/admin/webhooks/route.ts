import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/middleware'
import { corsResponse, paginated, fail, success } from '@/lib/api-result'
import { getAllWebhookEvents, retryWebhookEvent, WEBHOOK_EVENTS, type WebhookStatus, type WebhookEventType } from '@/lib/webhook'

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
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') ?? '25', 10)))
    const statusParam = searchParams.get('status') as WebhookStatus | null
    const eventParam = searchParams.get('event') as WebhookEventType | null

    const validStatuses: WebhookStatus[] = ['pending', 'delivered', 'failed']
    const statusFilter = statusParam && validStatuses.includes(statusParam) ? statusParam : undefined
    const eventFilter = eventParam && (WEBHOOK_EVENTS as readonly string[]).includes(eventParam) ? eventParam : undefined

    const offset = (page - 1) * limit
    const { events, total } = await getAllWebhookEvents({
      limit,
      offset,
      status: statusFilter,
      event: eventFilter,
    })

    return paginated(events, { total, page, limit }, origin)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to get webhook events'
    return fail(message, 500, origin)
  }
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin')

  try {
    const authResult = await requireAdmin(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const body = await request.json()
    const eventId = body?.eventId as string | undefined

    if (!eventId) {
      return fail('eventId is required', 400, origin)
    }

    const result = await retryWebhookEvent(eventId)

    if (!result.success) {
      return fail(result.error ?? 'Retry failed', 400, origin)
    }

    return success({ retried: true, eventId }, 200, origin)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to retry webhook'
    return fail(message, 500, origin)
  }
}
