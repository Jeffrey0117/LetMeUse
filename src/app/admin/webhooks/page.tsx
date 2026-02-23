'use client'

import { useEffect, useState, useCallback } from 'react'
import { useLang } from '@/components/layout/lang-provider'

interface WebhookEvent {
  id: string
  appId: string
  event: string
  url: string
  status: 'pending' | 'delivered' | 'failed'
  statusCode?: number
  error?: string
  attempts: number
  lastAttemptAt?: string
  nextRetryAt?: string
  createdAt: string
}

interface Meta {
  total: number
  page: number
  limit: number
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  delivered: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
}

const EVENT_TYPES = [
  'user.registered',
  'user.login',
  'user.updated',
  'user.disabled',
  'user.enabled',
  'user.deleted',
  'user.email_verified',
  'user.password_reset',
]

export default function AdminWebhooksPage() {
  const { t } = useLang()
  const [events, setEvents] = useState<WebhookEvent[]>([])
  const [meta, setMeta] = useState<Meta>({ total: 0, page: 1, limit: 25 })
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const [eventFilter, setEventFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [retrying, setRetrying] = useState<string | null>(null)

  const fetchEvents = useCallback(async () => {
    const token = localStorage.getItem('lmu_admin_token')
    if (!token) return

    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: '25',
      })
      if (statusFilter) params.set('status', statusFilter)
      if (eventFilter) params.set('event', eventFilter)

      const res = await fetch(`/api/admin/webhooks?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setEvents(data.data ?? [])
      setMeta(data.meta ?? { total: 0, page: 1, limit: 25 })
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [page, statusFilter, eventFilter])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  const handleRetry = async (eventId: string) => {
    const token = localStorage.getItem('lmu_admin_token')
    if (!token) return

    setRetrying(eventId)
    try {
      await fetch('/api/admin/webhooks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ eventId }),
      })
      await fetchEvents()
    } catch {
      // ignore
    } finally {
      setRetrying(null)
    }
  }

  const totalPages = Math.ceil(meta.total / meta.limit)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">{t('admin.webhooks.title')}</h1>
        <span className="text-sm text-zinc-500">
          {meta.total} {t('admin.webhooks.total')}
        </span>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
          className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm"
        >
          <option value="">{t('admin.webhooks.allStatuses')}</option>
          <option value="pending">{t('admin.webhooks.statusPending')}</option>
          <option value="delivered">{t('admin.webhooks.statusDelivered')}</option>
          <option value="failed">{t('admin.webhooks.statusFailed')}</option>
        </select>

        <select
          value={eventFilter}
          onChange={(e) => { setEventFilter(e.target.value); setPage(1) }}
          className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm"
        >
          <option value="">{t('admin.webhooks.allEvents')}</option>
          {EVENT_TYPES.map((evt) => (
            <option key={evt} value={evt}>{evt}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-lg border border-zinc-200 overflow-hidden">
        {loading ? (
          <p className="px-4 py-8 text-zinc-400 text-sm text-center">{t('common.loading')}</p>
        ) : events.length === 0 ? (
          <p className="px-4 py-8 text-zinc-400 text-sm text-center">{t('admin.webhooks.empty')}</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 text-left text-zinc-500">
                <th className="px-4 py-2 font-medium">{t('admin.webhooks.event')}</th>
                <th className="px-4 py-2 font-medium">{t('admin.webhooks.url')}</th>
                <th className="px-4 py-2 font-medium">{t('admin.table.status')}</th>
                <th className="px-4 py-2 font-medium">{t('admin.webhooks.statusCode')}</th>
                <th className="px-4 py-2 font-medium">{t('admin.webhooks.attempts')}</th>
                <th className="px-4 py-2 font-medium">{t('admin.webhooks.createdAt')}</th>
                <th className="px-4 py-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {events.map((evt) => (
                <tr key={evt.id} className="border-b border-zinc-50 hover:bg-zinc-50">
                  <td className="px-4 py-2">
                    <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-zinc-100 text-zinc-600">
                      {evt.event}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-zinc-500 text-xs font-mono max-w-[200px] truncate">
                    {evt.url}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[evt.status] ?? 'bg-zinc-100 text-zinc-600'}`}
                    >
                      {evt.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-zinc-500 text-xs font-mono">
                    {evt.statusCode ?? '-'}
                  </td>
                  <td className="px-4 py-2 text-zinc-500 text-xs">
                    {evt.attempts}
                  </td>
                  <td className="px-4 py-2 text-zinc-500 text-xs">
                    {new Date(evt.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2">
                    {evt.status === 'failed' && (
                      <button
                        onClick={() => handleRetry(evt.id)}
                        disabled={retrying === evt.id}
                        className="text-blue-600 hover:text-blue-800 text-xs font-medium disabled:opacity-40"
                      >
                        {retrying === evt.id
                          ? t('admin.webhooks.retrying')
                          : t('admin.webhooks.retry')}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-zinc-500">
            {meta.total} {t('admin.webhooks.total')}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm disabled:opacity-40"
            >
              {t('admin.pagination.prev')}
            </button>
            <span className="text-sm text-zinc-600 px-2 py-1.5">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm disabled:opacity-40"
            >
              {t('admin.pagination.next')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
