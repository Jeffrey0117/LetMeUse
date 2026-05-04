import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/auth/middleware'
import { corsResponse, success, fail } from '@/lib/api-result'
import { getUserSubscription } from '@/lib/billing/service'
import { getPaymentProvider } from '@/lib/billing/provider'
import { StripeProvider } from '@/lib/billing/stripe-provider'

export async function OPTIONS(request: NextRequest) {
  return corsResponse(request.headers.get('origin'))
}

// POST — create a Stripe Customer Portal session for self-service management
export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin')

  try {
    const authResult = await authenticateRequest(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const provider = getPaymentProvider()
    if (provider.name !== 'stripe') {
      return fail('Customer portal requires Stripe', 400, origin)
    }

    const subscription = await getUserSubscription(authResult.payload.sub, authResult.payload.app)
    if (!subscription?.providerCustomerId) {
      return fail('No active Stripe subscription found', 404, origin)
    }

    const body = await request.json().catch(() => ({}))
    const returnUrl = (body as { returnUrl?: string }).returnUrl
      || `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/settings`

    const portalUrl = await (provider as StripeProvider).createCustomerPortal(
      subscription.providerCustomerId,
      returnUrl,
    )

    return success({ url: portalUrl }, 200, origin)
  } catch (error) {
        return fail('Operation failed', 500, origin)
  }
}
