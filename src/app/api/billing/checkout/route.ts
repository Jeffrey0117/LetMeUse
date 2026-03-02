import { type NextRequest } from 'next/server'
import { corsResponse, success, fail } from '@/lib/api-result'
import { createCheckoutSession, getCheckoutSession } from '@/lib/billing/service'
import { getById, APPS_FILE } from '@/lib/storage'
import type { App } from '@/lib/auth-models'
import { CreateCheckoutSchema } from '@/lib/billing/models'

export async function OPTIONS(request: NextRequest) {
  return corsResponse(request.headers.get('origin'))
}

// POST — create a checkout session (server-to-server, authenticated via appSecret)
export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin')

  try {
    const body = await request.json()
    const parsed = CreateCheckoutSchema.parse(body)

    // Verify app credentials
    const app = await getById<App>(APPS_FILE, parsed.appId)
    if (!app || app.secret !== parsed.appSecret) {
      return fail('Invalid app credentials', 401, origin)
    }

    const session = await createCheckoutSession({
      appId: parsed.appId,
      mode: parsed.mode,
      productId: parsed.productId,
      productName: parsed.productName,
      amount: parsed.amount,
      currency: parsed.currency,
      customerEmail: parsed.customerEmail,
      metadata: parsed.metadata,
      successUrl: parsed.successUrl,
      cancelUrl: parsed.cancelUrl,
    })

    return success({
      sessionId: session.id,
      checkoutUrl: `/checkout?session=${session.id}`,
      expiresAt: session.expiresAt,
    }, 201, origin)
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return fail('Invalid request body', 400, origin)
    }
    const message = error instanceof Error ? error.message : 'Failed to create checkout session'
    return fail(message, 500, origin)
  }
}

// GET — get checkout session status (public, used by checkout page)
export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin')
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get('session')

  if (!sessionId) {
    return fail('session parameter is required', 400, origin)
  }

  const session = await getCheckoutSession(sessionId)
  if (!session) {
    return fail('Checkout session not found', 404, origin)
  }

  // Check expiry
  if (session.status === 'pending' && new Date(session.expiresAt) < new Date()) {
    return fail('Checkout session has expired', 410, origin)
  }

  return success({
    id: session.id,
    status: session.status,
    productName: session.productName,
    amount: session.amount,
    currency: session.currency,
    expiresAt: session.expiresAt,
    metadata: session.metadata,
  }, 200, origin)
}
