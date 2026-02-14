import { createHmac } from 'crypto'
import type { App } from './auth-models'
import { create, getAll, WEBHOOK_EVENTS_FILE } from './storage'
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

// ── Webhook event log ───────────────────────────────────

export interface WebhookEvent {
  id: string
  appId: string
  event: WebhookEventType
  payload: Record<string, unknown>
  url: string
  status: 'success' | 'failed' | 'pending'
  statusCode?: number
  error?: string
  attempts: number
  createdAt: string
}

// ── HMAC signature ──────────────────────────────────────

function signPayload(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('hex')
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
    createdAt: now,
  }

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
  const maxAttempts = 3
  const retryDelays = [0, 2000, 5000]

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    if (retryDelays[attempt] > 0) {
      await new Promise((r) => setTimeout(r, retryDelays[attempt]))
    }

    const updated = { ...webhookEvent, attempts: attempt + 1 }

    try {
      const response = await fetch(webhookEvent.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-LetMeUse-Signature': signature,
          'X-LetMeUse-Event': webhookEvent.event,
        },
        body,
        signal: AbortSignal.timeout(10_000),
      })

      const saved = {
        ...updated,
        statusCode: response.status,
        status: (response.ok ? 'success' : 'failed') as 'success' | 'failed',
        error: response.ok ? undefined : `HTTP ${response.status}`,
      }

      await create<WebhookEvent>(WEBHOOK_EVENTS_FILE, saved)
      if (response.ok) return
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Unknown error'
      if (attempt === maxAttempts - 1) {
        await create<WebhookEvent>(WEBHOOK_EVENTS_FILE, {
          ...updated,
          status: 'failed',
          error,
        })
      }
    }
  }
}

// ── Query helpers ───────────────────────────────────────

export async function getWebhookEvents(
  appId: string,
  options?: { limit?: number; offset?: number }
): Promise<{ events: WebhookEvent[]; total: number }> {
  const all = await getAll<WebhookEvent>(WEBHOOK_EVENTS_FILE)
  const filtered = all
    .filter((e) => e.appId === appId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const total = filtered.length
  const offset = options?.offset ?? 0
  const limit = options?.limit ?? 50
  const events = filtered.slice(offset, offset + limit)

  return { events, total }
}
