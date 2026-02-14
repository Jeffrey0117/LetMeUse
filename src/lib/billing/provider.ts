/**
 * Payment provider abstraction layer.
 * Implement this interface for Stripe, PayPal, etc.
 */

export interface PaymentProvider {
  name: string

  // Customer management
  createCustomer(params: { email: string; name?: string; metadata?: Record<string, string> }): Promise<string>

  // Checkout / subscription creation
  createCheckoutSession(params: {
    customerId: string
    priceId: string
    successUrl: string
    cancelUrl: string
    metadata?: Record<string, string>
  }): Promise<{ url: string; sessionId: string }>

  // Subscription management
  cancelSubscription(providerSubscriptionId: string): Promise<void>
  getSubscription(providerSubscriptionId: string): Promise<{
    status: string
    currentPeriodEnd: string
  }>

  // Webhook verification
  verifyWebhookSignature(body: string, signature: string): Promise<unknown>
}

// ── Stub provider (development/testing) ─────────────────

export class StubPaymentProvider implements PaymentProvider {
  name = 'stub'

  async createCustomer(params: { email: string }): Promise<string> {
    return `cus_stub_${Date.now()}`
  }

  async createCheckoutSession(params: {
    customerId: string
    priceId: string
    successUrl: string
    cancelUrl: string
  }): Promise<{ url: string; sessionId: string }> {
    const sessionId = `cs_stub_${Date.now()}`
    // In stub mode, just redirect to success URL directly
    return { url: `${params.successUrl}?session_id=${sessionId}`, sessionId }
  }

  async cancelSubscription(_providerSubscriptionId: string): Promise<void> {
    // No-op in stub
  }

  async getSubscription(_providerSubscriptionId: string): Promise<{
    status: string
    currentPeriodEnd: string
  }> {
    return {
      status: 'active',
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    }
  }

  async verifyWebhookSignature(_body: string, _signature: string): Promise<unknown> {
    return {}
  }
}

// ── Provider factory ────────────────────────────────────

let providerInstance: PaymentProvider | null = null

export function getPaymentProvider(): PaymentProvider {
  if (providerInstance) return providerInstance

  // Future: check env vars for Stripe, PayPal, etc.
  // if (process.env.STRIPE_SECRET_KEY) return new StripeProvider(...)
  // if (process.env.PAYPAL_CLIENT_ID) return new PayPalProvider(...)

  providerInstance = new StubPaymentProvider()
  return providerInstance
}
