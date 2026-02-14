import { z } from 'zod'

// ── Plan (pricing tier) ─────────────────────────────────

export const PlanSchema = z.object({
  id: z.string(),
  appId: z.string(),
  name: z.string().min(1),
  description: z.string().optional(),
  priceMonthly: z.number().min(0),
  priceYearly: z.number().min(0).optional(),
  currency: z.string().default('USD'),
  features: z.array(z.string()),
  limits: z.record(z.string(), z.number()).optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().default(0),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type Plan = z.infer<typeof PlanSchema>

export const CreatePlanSchema = z.object({
  appId: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  priceMonthly: z.number().min(0),
  priceYearly: z.number().min(0).optional(),
  currency: z.string().default('USD'),
  features: z.array(z.string()).default([]),
  limits: z.record(z.string(), z.number()).optional(),
  sortOrder: z.number().optional(),
})

export const UpdatePlanSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  priceMonthly: z.number().min(0).optional(),
  priceYearly: z.number().min(0).optional(),
  features: z.array(z.string()).optional(),
  limits: z.record(z.string(), z.number()).optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().optional(),
})

// ── Subscription ────────────────────────────────────────

export const SUBSCRIPTION_STATUSES = ['active', 'cancelled', 'past_due', 'trialing', 'expired'] as const
export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUSES)[number]

export const BILLING_INTERVALS = ['monthly', 'yearly'] as const
export type BillingInterval = (typeof BILLING_INTERVALS)[number]

export const SubscriptionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  appId: z.string(),
  planId: z.string(),
  status: z.enum(SUBSCRIPTION_STATUSES),
  interval: z.enum(BILLING_INTERVALS),
  currentPeriodStart: z.string(),
  currentPeriodEnd: z.string(),
  cancelledAt: z.string().optional(),
  providerSubscriptionId: z.string().optional(),
  providerCustomerId: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type Subscription = z.infer<typeof SubscriptionSchema>

// ── Invoice ─────────────────────────────────────────────

export const INVOICE_STATUSES = ['draft', 'pending', 'paid', 'failed', 'refunded'] as const
export type InvoiceStatus = (typeof INVOICE_STATUSES)[number]

export const InvoiceSchema = z.object({
  id: z.string(),
  subscriptionId: z.string(),
  userId: z.string(),
  appId: z.string(),
  amount: z.number(),
  currency: z.string(),
  status: z.enum(INVOICE_STATUSES),
  periodStart: z.string(),
  periodEnd: z.string(),
  paidAt: z.string().optional(),
  providerInvoiceId: z.string().optional(),
  createdAt: z.string(),
})

export type Invoice = z.infer<typeof InvoiceSchema>
