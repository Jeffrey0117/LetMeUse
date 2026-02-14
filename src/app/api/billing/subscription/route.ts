import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/auth/middleware'
import { corsResponse, success, fail } from '@/lib/api-result'
import { getUserSubscription, createSubscription, cancelSubscription } from '@/lib/billing/service'
import { getById, PLANS_FILE } from '@/lib/storage'
import type { Plan } from '@/lib/billing/models'

export async function OPTIONS(request: NextRequest) {
  return corsResponse(request.headers.get('origin'))
}

// GET — get current user's subscription
export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin')

  try {
    const authResult = await authenticateRequest(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const subscription = await getUserSubscription(authResult.payload.sub, authResult.payload.app)

    if (!subscription) {
      return success({ subscription: null, plan: null }, 200, origin)
    }

    const plan = await getById<Plan>(PLANS_FILE, subscription.planId)

    return success({ subscription, plan }, 200, origin)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to get subscription'
    return fail(message, 500, origin)
  }
}

// POST — subscribe to a plan
export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin')

  try {
    const authResult = await authenticateRequest(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const body = await request.json()
    const { planId, interval = 'monthly' } = body as { planId?: string; interval?: string }

    if (!planId) {
      return fail('planId is required', 400, origin)
    }

    if (interval !== 'monthly' && interval !== 'yearly') {
      return fail('interval must be monthly or yearly', 400, origin)
    }

    const plan = await getById<Plan>(PLANS_FILE, planId)
    if (!plan || !plan.isActive) {
      return fail('Plan not found or inactive', 404, origin)
    }

    // Check if already subscribed
    const existing = await getUserSubscription(authResult.payload.sub, authResult.payload.app)
    if (existing) {
      return fail('Already subscribed. Cancel current subscription first.', 409, origin)
    }

    const subscription = await createSubscription({
      userId: authResult.payload.sub,
      appId: authResult.payload.app,
      planId,
      interval: interval as 'monthly' | 'yearly',
    })

    return success({ subscription, plan }, 201, origin)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to subscribe'
    return fail(message, 500, origin)
  }
}

// DELETE — cancel subscription
export async function DELETE(request: NextRequest) {
  const origin = request.headers.get('origin')

  try {
    const authResult = await authenticateRequest(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const subscription = await getUserSubscription(authResult.payload.sub, authResult.payload.app)

    if (!subscription) {
      return fail('No active subscription', 404, origin)
    }

    const cancelled = await cancelSubscription(subscription.id)

    return success({ subscription: cancelled }, 200, origin)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to cancel subscription'
    return fail(message, 500, origin)
  }
}
