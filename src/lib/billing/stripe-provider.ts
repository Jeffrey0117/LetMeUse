import Stripe from 'stripe'
import type { PaymentProvider } from './provider'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error('STRIPE_SECRET_KEY is not set')
  return new Stripe(key)
}

export class StripeProvider implements PaymentProvider {
  name = 'stripe'
  private stripe: Stripe

  constructor() {
    this.stripe = getStripe()
  }

  async createCustomer(params: {
    email: string
    name?: string
    metadata?: Record<string, string>
  }): Promise<string> {
    const customer = await this.stripe.customers.create({
      email: params.email,
      name: params.name,
      metadata: params.metadata,
    })
    return customer.id
  }

  async createCheckoutSession(params: {
    customerId: string
    priceId: string
    successUrl: string
    cancelUrl: string
    metadata?: Record<string, string>
  }): Promise<{ url: string; sessionId: string }> {
    // Determine mode from price
    const price = await this.stripe.prices.retrieve(params.priceId)
    const mode = price.type === 'recurring' ? 'subscription' : 'payment'

    const session = await this.stripe.checkout.sessions.create({
      customer: params.customerId,
      line_items: [{ price: params.priceId, quantity: 1 }],
      mode,
      success_url: `${params.successUrl}${params.successUrl.includes('?') ? '&' : '?'}session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: params.cancelUrl || `${BASE_URL}/checkout?cancelled=1`,
      metadata: params.metadata,
    })

    return {
      url: session.url || '',
      sessionId: session.id,
    }
  }

  async cancelSubscription(providerSubscriptionId: string): Promise<void> {
    await this.stripe.subscriptions.cancel(providerSubscriptionId)
  }

  async getSubscription(providerSubscriptionId: string): Promise<{
    status: string
    currentPeriodEnd: string
  }> {
    const sub = await this.stripe.subscriptions.retrieve(providerSubscriptionId, {
      expand: ['items.data'],
    })
    // In Stripe v20+, period info is on subscription items
    const item = sub.items?.data?.[0]
    const periodEnd = item
      ? new Date(item.current_period_end * 1000).toISOString()
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    return {
      status: sub.status,
      currentPeriodEnd: periodEnd,
    }
  }

  async verifyWebhookSignature(body: string, signature: string): Promise<Stripe.Event> {
    const secret = process.env.STRIPE_WEBHOOK_SECRET
    if (!secret) throw new Error('STRIPE_WEBHOOK_SECRET is not set')
    return this.stripe.webhooks.constructEvent(body, signature, secret)
  }

  async createCustomerPortal(customerId: string, returnUrl: string): Promise<string> {
    const session = await this.stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    })
    return session.url
  }
}
