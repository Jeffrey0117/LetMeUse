import { getAll, getById, create, update, PLANS_FILE, SUBSCRIPTIONS_FILE, INVOICES_FILE } from '../storage'
import { generatePlanId, generateSubscriptionId, generateInvoiceId } from '../id'
import type { Plan, Subscription, Invoice, BillingInterval } from './models'
import { CreatePlanSchema } from './models'
import { getPaymentProvider } from './provider'

// ── Plans ───────────────────────────────────────────────

export async function getPlansForApp(appId: string): Promise<Plan[]> {
  const all = await getAll<Plan>(PLANS_FILE)
  return all
    .filter((p) => p.appId === appId && p.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder)
}

export async function createPlan(input: unknown): Promise<Plan> {
  const parsed = CreatePlanSchema.parse(input)
  const now = new Date().toISOString()

  const plan: Plan = {
    id: generatePlanId(),
    appId: parsed.appId,
    name: parsed.name,
    description: parsed.description,
    priceMonthly: parsed.priceMonthly,
    priceYearly: parsed.priceYearly,
    currency: parsed.currency,
    features: parsed.features,
    limits: parsed.limits,
    isActive: true,
    sortOrder: parsed.sortOrder ?? 0,
    createdAt: now,
    updatedAt: now,
  }

  await create<Plan>(PLANS_FILE, plan)
  return plan
}

// ── Subscriptions ───────────────────────────────────────

export async function getUserSubscription(userId: string, appId: string): Promise<Subscription | null> {
  const all = await getAll<Subscription>(SUBSCRIPTIONS_FILE)
  return all.find(
    (s) => s.userId === userId && s.appId === appId && (s.status === 'active' || s.status === 'trialing')
  ) ?? null
}

export async function createSubscription(params: {
  userId: string
  appId: string
  planId: string
  interval: BillingInterval
  providerSubscriptionId?: string
  providerCustomerId?: string
}): Promise<Subscription> {
  const now = new Date().toISOString()
  const periodEnd = params.interval === 'yearly'
    ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
    : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

  const subscription: Subscription = {
    id: generateSubscriptionId(),
    userId: params.userId,
    appId: params.appId,
    planId: params.planId,
    status: 'active',
    interval: params.interval,
    currentPeriodStart: now,
    currentPeriodEnd: periodEnd,
    providerSubscriptionId: params.providerSubscriptionId,
    providerCustomerId: params.providerCustomerId,
    createdAt: now,
    updatedAt: now,
  }

  await create<Subscription>(SUBSCRIPTIONS_FILE, subscription)
  return subscription
}

export async function cancelSubscription(subscriptionId: string): Promise<Subscription | null> {
  const sub = await getById<Subscription>(SUBSCRIPTIONS_FILE, subscriptionId)
  if (!sub) return null

  // Cancel with payment provider if applicable
  if (sub.providerSubscriptionId) {
    const provider = getPaymentProvider()
    await provider.cancelSubscription(sub.providerSubscriptionId)
  }

  const now = new Date().toISOString()
  return update<Subscription>(SUBSCRIPTIONS_FILE, subscriptionId, {
    status: 'cancelled',
    cancelledAt: now,
    updatedAt: now,
  } as Partial<Subscription>)
}

// ── Invoices ────────────────────────────────────────────

export async function getUserInvoices(userId: string, appId?: string): Promise<Invoice[]> {
  const all = await getAll<Invoice>(INVOICES_FILE)
  let filtered = all.filter((i) => i.userId === userId)
  if (appId) {
    filtered = filtered.filter((i) => i.appId === appId)
  }
  return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export async function createInvoice(params: {
  subscriptionId: string
  userId: string
  appId: string
  amount: number
  currency: string
  periodStart: string
  periodEnd: string
}): Promise<Invoice> {
  const invoice: Invoice = {
    id: generateInvoiceId(),
    subscriptionId: params.subscriptionId,
    userId: params.userId,
    appId: params.appId,
    amount: params.amount,
    currency: params.currency,
    status: 'pending',
    periodStart: params.periodStart,
    periodEnd: params.periodEnd,
    createdAt: new Date().toISOString(),
  }

  await create<Invoice>(INVOICES_FILE, invoice)
  return invoice
}
