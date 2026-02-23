import { createHmac } from 'crypto'
import type { App } from './auth-models'
import { create, getAll, getById, update, WEBHOOK_EVENTS_FILE, APPS_FILE } from './storage'
import { generateWebhookEventId } from './id'

// ── Event types ─────────────────────────────────────────

export const WEBHOOK_EVENTS = [
  'user.registered',
  'user.login',
  'user.updated',
  'user.disabled',
  'user.enabled',
  'user.deleted',
  'user.email_verified',
  'user.password_reset',
] as const

export type WebhookEventType = (typeof WEBHOOK_EVENTS)[number]

export type WebhookStatus = 'pending' | 'delivered' | 'failed'

// ── Webhook event log ───────────────────────────────────

export interface WebhookEvent {
  id: string
  appId: string
  event: WebhookEventType
  payload: Record<string, unknown>
  url: string
  status: WebhookStatus
  statusCode?: number
  error?: string
  attempts: number
  lastAttemptAt?: string
  nextRetryAt?: string
  createdAt: string
}

// ── Retry config ────────────────────────────────────────

const MAX_ATTEMPTS = 3
const RETRY_DELAYS_MS = [0, 2_000, 5_000] as const
const REQUEST_TIMEOUT_MS = 10_000

// ── HMAC signature ──────────────────────────────────────

function signPayload(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('hex')
}

// ── Compute next retry timestamp ────────────────────────

function computeNextRetryAt(attempt: number): string | undefined {
  const nextIndex = attempt + 1
  if (nextIndex >= MAX_ATTEMPTS) return undefined
  const delayMs = RETRY_DELAYS_MS[nextIndex] ?? 0
  return new Date(Date.now() + delayMs).toISOString()
}

// ── Dispatch webhook (fire-and-forget) ──────────────────

export async function dispatchWebhook(
  app: App,
  event: WebhookEventType,
  payload: Record<string, unknown>
): Promise<void> {
  if (!app.webhookUrl) return

  const now = new Date().toISOString()
  const body = JSON.stringify({ event, payload, timestamp: now, appId: app.id })
  const signature = signPayload(body, app.secret)

  const webhookEvent: WebhookEvent = {
    id: generateWebhookEventId(),
    appId: app.id,
    event,
    payload,
    url: app.webhookUrl,
    status: 'pending',
    attempts: 0,
    nextRetryAt: now,
    createdAt: now,
  }

  // Persist the pending event immediately
  await create<WebhookEvent>(WEBHOOK_EVENTS_FILE, webhookEvent)

  // Fire-and-forget — don't block the auth response
  deliverWebhook(webhookEvent, body, signature).catch(() => {
    // Silently swallow — already logged in deliverWebhook
  })
}

async function deliverWebhook(
  webhookEvent: WebhookEvent,
  body: string,
  signature: string
): Promise<void> {
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const delay = RETRY_DELAYS_MS[attempt] ?? 0
    if (delay > 0) {
      await new Promise((r) => setTimeout(r, delay))
    }

    const now = new Date().toISOString()

    try {
      const response = await fetch(webhookEvent.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-LetMeUse-Signature': signature,
          'X-LetMeUse-Event': webhookEvent.event,
        },
        body,
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      })

      const isDelivered = response.ok
      const isFinalAttempt = attempt === MAX_ATTEMPTS - 1
      const nextRetry = isDelivered ? undefined : computeNextRetryAt(attempt)

      await update<WebhookEvent>(WEBHOOK_EVENTS_FILE, webhookEvent.id, {
        attempts: attempt + 1,
        lastAttemptAt: now,
        statusCode: response.status,
        status: isDelivered ? 'delivered' : (isFinalAttempt ? 'failed' : 'pending'),
        error: isDelivered ? undefined : `HTTP ${response.status}`,
        nextRetryAt: nextRetry,
      } as Partial<WebhookEvent>)

      if (isDelivered) return
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Unknown error'
      const isFinalAttempt = attempt === MAX_ATTEMPTS - 1
      const nextRetry = isFinalAttempt ? undefined : computeNextRetryAt(attempt)

      await update<WebhookEvent>(WEBHOOK_EVENTS_FILE, webhookEvent.id, {
        attempts: attempt + 1,
        lastAttemptAt: now,
        status: isFinalAttempt ? 'failed' : 'pending',
        error,
        nextRetryAt: nextRetry,
      } as Partial<WebhookEvent>)
    }
  }
}

// ── Manual retry ────────────────────────────────────────

export async function retryWebhookEvent(
  eventId: string
): Promise<{ success: boolean; error?: string }> {
  const webhookEvent = await getById<WebhookEvent>(WEBHOOK_EVENTS_FILE, eventId)

  if (!webhookEvent) {
    return { success: false, error: 'Webhook event not found' }
  }

  if (webhookEvent.status === 'delivered') {
    return { success: false, error: 'Event already delivered' }
  }

  const app = await getById<App>(APPS_FILE, webhookEvent.appId)

  if (!app) {
    return { success: false, error: 'App not found' }
  }

  const now = new Date().toISOString()
  const body = JSON.stringify({
    event: webhookEvent.event,
    payload: webhookEvent.payload,
    timestamp: now,
    appId: webhookEvent.appId,
  })

  const signature = signPayload(body, app.secret)

  // Reset to pending and re-deliver
  await update<WebhookEvent>(WEBHOOK_EVENTS_FILE, webhookEvent.id, {
    status: 'pending' as WebhookStatus,
    attempts: 0,
    error: undefined,
    statusCode: undefined,
    lastAttemptAt: undefined,
    nextRetryAt: now,
  } as Partial<WebhookEvent>)

  const resetEvent: WebhookEvent = {
    ...webhookEvent,
    status: 'pending',
    attempts: 0,
    error: undefined,
    statusCode: undefined,
    lastAttemptAt: undefined,
    nextRetryAt: now,
  }

  // Fire-and-forget
  deliverWebhook(resetEvent, body, signature).catch(() => {
    // already persisted in deliverWebhook
  })

  return { success: true }
}

// ── Query helpers ───────────────────────────────────────

export interface WebhookQueryOptions {
  limit?: number
  offset?: number
  status?: WebhookStatus
  event?: WebhookEventType
}

export async function getWebhookEvents(
  appId: string,
  options?: WebhookQueryOptions
): Promise<{ events: WebhookEvent[]; total: number }> {
  const all = await getAll<WebhookEvent>(WEBHOOK_EVENTS_FILE)

  const filtered = all
    .filter((e) => e.appId === appId)
    .filter((e) => (options?.status ? e.status === options.status : true))
    .filter((e) => (options?.event ? e.event === options.event : true))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const total = filtered.length
  const offset = options?.offset ?? 0
  const limit = options?.limit ?? 50
  const events = filtered.slice(offset, offset + limit)

  return { events, total }
}

export async function getAllWebhookEvents(
  options?: WebhookQueryOptions
): Promise<{ events: WebhookEvent[]; total: number }> {
  const all = await getAll<WebhookEvent>(WEBHOOK_EVENTS_FILE)

  const filtered = all
    .filter((e) => (options?.status ? e.status === options.status : true))
    .filter((e) => (options?.event ? e.event === options.event : true))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const total = filtered.length
  const offset = options?.offset ?? 0
  const limit = options?.limit ?? 50
  const events = filtered.slice(offset, offset + limit)

  return { events, total }
}
