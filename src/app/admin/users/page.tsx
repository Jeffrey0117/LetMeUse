'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useLang } from '@/components/layout/lang-provider'

interface User {
  id: string
  email: string
  displayName: string
  role: string
  disabled: boolean
  appId: string
  createdAt: string
}

interface Meta {
  total: number
  page: number
  limit: number
}

export default function AdminUsersPage() {
  const { t } = useLang()
  const [users, setUsers] = useState<User[]>([])
  const [meta, setMeta] = useState<Meta>({ total: 0, page: 1, limit: 20 })
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  const fetchUsers = useCallback(async () => {
    const token = localStorage.getItem('lmu_admin_token')
    if (!token) return

    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: '20',
      })
      if (search) params.set('search', search)

      const res = await fetch(`/api/admin/users?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setUsers(data.data ?? [])
      setMeta(data.meta ?? { total: 0, page: 1, limit: 20 })
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [page, search])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const totalPages = Math.ceil(meta.total / meta.limit)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">{t('admin.users.title')}</h1>
        <span className="text-sm text-zinc-500">
          {meta.total} {t('admin.users.total')}
        </span>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder={t('admin.users.searchPlaceholder')}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          className="w-full max-w-sm px-3 py-2 border border-zinc-200 rounded-lg text-sm outline-none focus:border-zinc-400"
        />
      </div>

      <div className="bg-white rounded-lg border border-zinc-200">
        {loading ? (
          <p className="px-4 py-8 text-zinc-400 text-sm text-center">{t('common.loading')}</p>
        ) : users.length === 0 ? (
          <p className="px-4 py-8 text-zinc-400 text-sm text-center">{t('admin.users.empty')}</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 text-left text-zinc-500">
                <th className="px-4 py-2 font-medium">{t('admin.table.email')}</th>
                <th className="px-4 py-2 font-medium">{t('admin.table.name')}</th>
                <th className="px-4 py-2 font-medium">{t('admin.table.role')}</th>
                <th className="px-4 py-2 font-medium">{t('admin.table.status')}</th>
                <th className="px-4 py-2 font-medium">{t('admin.table.joined')}</th>
                <th className="px-4 py-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-zinc-50 hover:bg-zinc-50">
                  <td className="px-4 py-2 text-zinc-900">{user.email}</td>
                  <td className="px-4 py-2 text-zinc-700">{user.displayName}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                        user.role === 'admin'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-zinc-100 text-zinc-600'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                        user.disabled
                          ? 'bg-red-100 text-red-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {user.disabled ? t('admin.users.disabled') : t('admin.users.active')}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-zinc-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">
                    <Link
                      href={`/admin/users/${user.id}`}
                      className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                    >
                      {t('admin.users.view')}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="px-3 py-1 text-sm border border-zinc-200 rounded disabled:opacity-40"
          >
            {t('admin.pagination.prev')}
          </button>
          <span className="text-sm text-zinc-600">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="px-3 py-1 text-sm border border-zinc-200 rounded disabled:opacity-40"
          >
            {t('admin.pagination.next')}
          </button>
        </div>
      )}
    </div>
  )
}
