'use client'

import { useEffect, useState } from 'react'
import { useLang } from '@/components/layout/lang-provider'

interface Stats {
  totalUsers: number
  todayNew: number
  activeCount: number
}

interface UserRow {
  id: string
  email: string
  displayName: string
  role: string
  createdAt: string
}

export default function AdminDashboard() {
  const { t } = useLang()
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentUsers, setRecentUsers] = useState<UserRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('adman_admin_token')
    if (!token) return

    const headers = { Authorization: `Bearer ${token}` }

    Promise.all([
      fetch('/api/admin/stats', { headers }).then((r) => r.json()),
      fetch('/api/admin/users?limit=5', { headers }).then((r) => r.json()),
    ])
      .then(([statsData, usersData]) => {
        setStats(statsData)
        setRecentUsers(usersData.users ?? [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <p className="text-zinc-500 py-8">{t('common.loading')}</p>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900 mb-6">{t('admin.dashboard.title')}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard label={t('admin.stats.totalUsers')} value={stats?.totalUsers ?? 0} />
        <StatCard label={t('admin.stats.todayNew')} value={stats?.todayNew ?? 0} />
        <StatCard label={t('admin.stats.activeUsers')} value={stats?.activeCount ?? 0} />
      </div>

      <div className="bg-white rounded-lg border border-zinc-200">
        <div className="px-4 py-3 border-b border-zinc-100">
          <h2 className="text-sm font-semibold text-zinc-700">{t('admin.dashboard.recentUsers')}</h2>
        </div>
        {recentUsers.length === 0 ? (
          <p className="px-4 py-8 text-zinc-400 text-sm text-center">{t('admin.dashboard.noUsers')}</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 text-left text-zinc-500">
                <th className="px-4 py-2 font-medium">{t('admin.table.email')}</th>
                <th className="px-4 py-2 font-medium">{t('admin.table.name')}</th>
                <th className="px-4 py-2 font-medium">{t('admin.table.role')}</th>
                <th className="px-4 py-2 font-medium">{t('admin.table.joined')}</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((user) => (
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
                  <td className="px-4 py-2 text-zinc-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white rounded-lg border border-zinc-200 p-4">
      <p className="text-sm text-zinc-500 mb-1">{label}</p>
      <p className="text-3xl font-bold text-zinc-900">{value}</p>
    </div>
  )
}
