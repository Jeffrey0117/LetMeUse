import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import type { AuthUser } from '@/lib/auth-models'
import type { WebhookEvent } from '@/lib/webhook'
import { getAll, USERS_FILE, WEBHOOK_EVENTS_FILE, APPS_FILE } from '@/lib/storage'
import type { App } from '@/lib/auth-models'
import { requireAdmin } from '@/lib/auth/middleware'
import { corsResponse, success, fail } from '@/lib/api-result'

export async function OPTIONS(request: NextRequest) {
  return corsResponse(request.headers.get('origin'))
}

export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin')

  try {
    const authResult = await requireAdmin(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { searchParams } = new URL(request.url)
    const appId = searchParams.get('appId')

    let users = await getAll<AuthUser>(USERS_FILE)

    if (appId) {
      users = users.filter((u) => u.appId === appId)
    }

    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    const todayISO = todayStart.toISOString()

    const totalUsers = users.length
    const todayNew = users.filter((u) => u.createdAt >= todayISO).length
    const activeCount = users.filter((u) => !u.disabled).length
    const disabledCount = users.filter((u) => u.disabled).length
    const verifiedCount = users.filter((u) => u.emailVerified).length
    const oauthCount = users.filter((u) => u.oauthProvider).length

    // Role breakdown
    const roleBreakdown: Record<string, number> = {}
    for (const u of users) {
      roleBreakdown[u.role] = (roleBreakdown[u.role] ?? 0) + 1
    }

    // Registration trend (last 7 days)
    const registrationTrend: { date: string; count: number }[] = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      d.setHours(0, 0, 0, 0)
      const dayStart = d.toISOString()
      const nextD = new Date(d)
      nextD.setDate(nextD.getDate() + 1)
      const dayEnd = nextD.toISOString()
      const count = users.filter((u) => u.createdAt >= dayStart && u.createdAt < dayEnd).length
      registrationTrend.push({
        date: d.toISOString().slice(0, 10),
        count,
      })
    }

    // Webhook stats
    const webhookEvents = await getAll<WebhookEvent>(WEBHOOK_EVENTS_FILE)
    const filteredWebhooks = appId ? webhookEvents.filter((e) => e.appId === appId) : webhookEvents
    const webhookStats = {
      total: filteredWebhooks.length,
      success: filteredWebhooks.filter((e) => e.status === 'success').length,
      failed: filteredWebhooks.filter((e) => e.status === 'failed').length,
    }

    // App count
    const apps = await getAll<App>(APPS_FILE)

    return success(
      {
        totalUsers,
        todayNew,
        activeCount,
        disabledCount,
        verifiedCount,
        oauthCount,
        totalApps: apps.length,
        roleBreakdown,
        registrationTrend,
        webhookStats,
      },
      200,
      origin
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to get stats'
    return fail(message, 500, origin)
  }
}
