import { type NextRequest, NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { getPaymentProvider } from '@/lib/billing/provider'
import { StripeProvider } from '@/lib/billing/stripe-provider'
import {
  completeCheckoutSession,
  createSubscription,
  createInvoice,
} from '@/lib/billing/service'
import { getAll, update, CHECKOUT_SESSIONS_FILE, SUBSCRIPTIONS_FILE } from '@/lib/storage'
import type { CheckoutSession, Subscription } from '@/lib/billing/models'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 })
    }

    const provider = getPaymentProvider()
    if (provider.name !== 'stripe') {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 400 })
    }

    const event = await provider.verifyWebhookSignature(body, signature) as Stripe.Event

    switch (event.type) {
      case 'checkout.session.completed': {
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break
      }
      case 'customer.subscription.updated': {
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break
      }
      case 'customer.subscription.deleted': {
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break
      }
      case 'invoice.payment_succeeded': {
        await handleInvoicePaid(event.data.object as Stripe.Invoice)
        break
      }
      case 'invoice.payment_failed': {
        await handleInvoiceFailed(event.data.object as Stripe.Invoice)
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Stripe webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    )
  }
}

// ── Handlers ────────────────────────────────────────────

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const letmeuseSessionId = session.metadata?.letmeuseSessionId
  if (!letmeuseSessionId) {
    console.error('Stripe checkout completed but no letmeuseSessionId in metadata')
    return
  }

  // Complete our checkout session
  const completed = await completeCheckoutSession(letmeuseSessionId)
  if (!completed) {
    console.error(`Failed to complete LetMeUse checkout session: ${letmeuseSessionId}`)
    return
  }

  // If subscription mode, create subscription record
  if (session.mode === 'subscription' && session.subscription) {
    const stripeSubId = typeof session.subscription === 'string'
      ? session.subscription
      : session.subscription.id

    const provider = getPaymentProvider() as StripeProvider
    const stripeSub = await provider.getSubscription(stripeSubId)

    await createSubscription({
      userId: completed.metadata?.userId || '',
      appId: completed.appId,
      planId: completed.productId,
      interval: 'monthly', // Default, will be updated by subscription.updated webhook
      providerSubscriptionId: stripeSubId,
      providerCustomerId: session.customer as string,
    })
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const all = await getAll<Subscription>(SUBSCRIPTIONS_FILE)
  const sub = all.find(s => s.providerSubscriptionId === subscription.id)
  if (!sub) return

  // In Stripe v20+, period info is on subscription items, not the subscription itself
  const item = subscription.items?.data?.[0]
  const periodEnd = item
    ? new Date(item.current_period_end * 1000).toISOString()
    : sub.currentPeriodEnd
  const periodStart = item
    ? new Date(item.current_period_start * 1000).toISOString()
    : sub.currentPeriodStart

  const statusMap: Record<string, Subscription['status']> = {
    active: 'active',
    past_due: 'past_due',
    canceled: 'cancelled',
    unpaid: 'past_due',
    trialing: 'trialing',
  }

  await update<Subscription>(SUBSCRIPTIONS_FILE, sub.id, {
    status: statusMap[subscription.status] || 'active',
    currentPeriodStart: periodStart,
    currentPeriodEnd: periodEnd,
    updatedAt: new Date().toISOString(),
  } as Partial<Subscription>)
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const all = await getAll<Subscription>(SUBSCRIPTIONS_FILE)
  const sub = all.find(s => s.providerSubscriptionId === subscription.id)
  if (!sub) return

  await update<Subscription>(SUBSCRIPTIONS_FILE, sub.id, {
    status: 'cancelled',
    cancelledAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as Partial<Subscription>)
}

// Extract subscription ID from invoice (Stripe v20: parent.subscription_details)
function getInvoiceSubscriptionId(invoice: Stripe.Invoice): string | null {
  const details = invoice.parent?.subscription_details
  if (!details) return null
  return typeof details.subscription === 'string'
    ? details.subscription
    : details.subscription.id
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const subId = getInvoiceSubscriptionId(invoice)
  if (!subId) return

  const all = await getAll<Subscription>(SUBSCRIPTIONS_FILE)
  const sub = all.find(s => s.providerSubscriptionId === subId)
  if (!sub) return

  await createInvoice({
    subscriptionId: sub.id,
    userId: sub.userId,
    appId: sub.appId,
    amount: (invoice.amount_paid || 0) / 100,
    currency: (invoice.currency || 'usd').toUpperCase(),
    periodStart: new Date((invoice.period_start || 0) * 1000).toISOString(),
    periodEnd: new Date((invoice.period_end || 0) * 1000).toISOString(),
  })
}

async function handleInvoiceFailed(invoice: Stripe.Invoice) {
  const subId = getInvoiceSubscriptionId(invoice)
  if (!subId) return

  const all = await getAll<Subscription>(SUBSCRIPTIONS_FILE)
  const sub = all.find(s => s.providerSubscriptionId === subId)
  if (!sub) return

  await update<Subscription>(SUBSCRIPTIONS_FILE, sub.id, {
    status: 'past_due',
    updatedAt: new Date().toISOString(),
  } as Partial<Subscription>)
}
