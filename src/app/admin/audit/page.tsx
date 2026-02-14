'use client'

import { useEffect, useState, useCallback } from 'react'
import { useLang } from '@/components/layout/lang-provider'

interface AuditEntry {
  id: string
  action: string
  actorId: string
  actorEmail?: string
  appId?: string
  targetId?: string
  targetType?: string
  details?: Record<string, unknown>
  ip?: string
  createdAt: string
}

const ACTION_COLORS: Record<string, string> = {
  'user.login': 'bg-blue-50 text-blue-700',
  'user.login_failed': 'bg-red-50 text-red-700',
  'user.register': 'bg-emerald-50 text-emerald-700',
  'user.logout': 'bg-zinc-100 text-zinc-600',
  'user.profile_updated': 'bg-sky-50 text-sky-700',
  'user.password_reset': 'bg-amber-50 text-amber-700',
  'user.email_verified': 'bg-emerald-50 text-emerald-700',
  'admin.user_updated': 'bg-indigo-50 text-indigo-700',
  'admin.user_disabled': 'bg-red-50 text-red-700',
  'admin.user_enabled': 'bg-emerald-50 text-emerald-700',
  'admin.user_deleted': 'bg-red-50 text-red-700',
  'admin.role_created': 'bg-purple-50 text-purple-700',
  'admin.role_updated': 'bg-purple-50 text-purple-700',
  'admin.role_deleted': 'bg-red-50 text-red-700',
  'admin.app_created': 'bg-cyan-50 text-cyan-700',
  'admin.app_updated': 'bg-cyan-50 text-cyan-700',
  'admin.app_deleted': 'bg-red-50 text-red-700',
}

export default function AdminAuditPage() {
  const { t } = useLang()
  const [entries, setEntries] = useState<AuditEntry[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [actionFilter, setActionFilter] = useState('')
  const limit = 25

  const token = typeof window !== 'undefined' ? localStorage.getItem('lmu_admin_token') : null

  const fetchEntries = useCallback(async () => {
    if (!token) return
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (actionFilter) params.set('action', actionFilter)
    const res = await fetch(`/api/admin/audit-log?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    setEntries(data.data ?? [])
    setTotal(data.meta?.total ?? 0)
    setLoading(false)
  }, [token, page, actionFilter])

  useEffect(() => {
    fetchEntries()
  }, [fetchEntries])

  const totalPages = Math.ceil(total / limit)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">{t('admin.audit.title')}</h1>
        <select
          value={actionFilter}
          onChange={(e) => { setActionFilter(e.target.value); setPage(1) }}
          className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm"
        >
          <option value="">All Actions</option>
          <option value="user.login">Login</option>
          <option value="user.login_failed">Login Failed</option>
          <option value="user.register">Register</option>
          <option value="admin.user_updated">Admin: User Updated</option>
          <option value="admin.user_disabled">Admin: User Disabled</option>
          <option value="admin.user_deleted">Admin: User Deleted</option>
        </select>
      </div>

      {loading ? (
        <p className="text-zinc-500">{t('common.loading')}</p>
      ) : entries.length === 0 ? (
        <p className="text-zinc-500">{t('admin.audit.empty')}</p>
      ) : (
        <>
          <div className="bg-white rounded-lg border border-zinc-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 text-left text-zinc-500">
                  <th className="px-4 py-2 font-medium">{t('admin.audit.action')}</th>
                  <th className="px-4 py-2 font-medium">{t('admin.audit.actor')}</th>
                  <th className="px-4 py-2 font-medium">{t('admin.audit.target')}</th>
                  <th className="px-4 py-2 font-medium">{t('admin.audit.ip')}</th>
                  <th className="px-4 py-2 font-medium">{t('admin.audit.time')}</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id} className="border-b border-zinc-50 hover:bg-zinc-50">
                    <td className="px-4 py-2">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                          ACTION_COLORS[entry.action] ?? 'bg-zinc-100 text-zinc-600'
                        }`}
                      >
                        {entry.action}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-zinc-700">
                      {entry.actorEmail ?? entry.actorId}
                    </td>
                    <td className="px-4 py-2 text-zinc-500">
                      {entry.targetId ? `${entry.targetType ?? ''}:${entry.targetId}` : '-'}
                    </td>
                    <td className="px-4 py-2 text-zinc-400 text-xs font-mono">
                      {entry.ip ?? '-'}
                    </td>
                    <td className="px-4 py-2 text-zinc-500 text-xs">
                      {new Date(entry.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-zinc-500">
                {total} {total === 1 ? 'entry' : 'entries'}
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
        </>
      )}
    </div>
  )
}
