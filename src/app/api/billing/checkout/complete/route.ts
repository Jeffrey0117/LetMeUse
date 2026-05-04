import { type NextRequest } from 'next/server'
import { corsResponse, success, fail } from '@/lib/api-result'
import { completeCheckoutSession, getCheckoutSession } from '@/lib/billing/service'
import { getById, APPS_FILE } from '@/lib/storage'
import type { App } from '@/lib/auth-models'

export async function OPTIONS(request: NextRequest) {
  return corsResponse(request.headers.get('origin'))
}

// POST — complete a checkout session
// In stub/test mode: auto-completes. In production: called by webhook.
export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin')

  try {
    const body = await request.json()
    const { sessionId, appId, appSecret } = body as {
      sessionId?: string
      appId?: string
      appSecret?: string
    }

    if (!sessionId) {
      return fail('sessionId is required', 400, origin)
    }

    // Two auth modes:
    // 1. Server-to-server: appId + appSecret
    // 2. Checkout page: session must be pending (for stub/test mode)
    const session = await getCheckoutSession(sessionId)
    if (!session) {
      return fail('Checkout session not found', 404, origin)
    }

    if (appId && appSecret) {
      // Server-to-server verification
      const app = await getById<App>(APPS_FILE, appId)
      if (!app || app.secret !== appSecret) {
        return fail('Invalid app credentials', 401, origin)
      }
      if (session.appId !== appId) {
        return fail('Session does not belong to this app', 403, origin)
      }
    }

    const completed = await completeCheckoutSession(sessionId)
    if (!completed) {
      if (session.status === 'completed') {
        return fail('Session already completed', 409, origin)
      }
      return fail('Session expired or cannot be completed', 410, origin)
    }

    return success({
      sessionId: completed.id,
      status: completed.status,
      completedAt: completed.completedAt,
      successUrl: completed.successUrl,
      metadata: completed.metadata,
    }, 200, origin)
  } catch (error) {
        return fail('Operation failed', 500, origin)
  }
}
