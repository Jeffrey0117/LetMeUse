'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useLang } from '@/components/layout/lang-provider'

interface Stats {
  totalUsers: number
  todayNew: number
  activeCount: number
  disabledCount: number
  verifiedCount: number
  oauthCount: number
  totalApps: number
  roleBreakdown: Record<string, number>
  registrationTrend: { date: string; count: number }[]
  webhookStats: { total: number; success: number; failed: number }
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
    const token = localStorage.getItem('lmu_admin_token')
    if (!token) return

    const headers = { Authorization: `Bearer ${token}` }

    Promise.all([
      fetch('/api/admin/stats', { headers }).then((r) => r.json()),
      fetch('/api/admin/users?limit=5', { headers }).then((r) => r.json()),
    ])
      .then(([statsData, usersData]) => {
        setStats(statsData.data ?? null)
        setRecentUsers(usersData.data ?? [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <p className="text-zinc-500 py-8">{t('common.loading')}</p>
  }

  const maxTrend = Math.max(1, ...(stats?.registrationTrend?.map((d) => d.count) ?? [1]))

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900 mb-6">{t('admin.dashboard.title')}</h1>

      {/* Primary stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label={t('admin.stats.totalUsers')} value={stats?.totalUsers ?? 0} />
        <StatCard label={t('admin.stats.todayNew')} value={stats?.todayNew ?? 0} accent />
        <StatCard label={t('admin.stats.activeUsers')} value={stats?.activeCount ?? 0} />
        <StatCard label="Apps" value={stats?.totalApps ?? 0} />
      </div>

      {/* Secondary stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <MiniStat label="Verified" value={stats?.verifiedCount ?? 0} total={stats?.totalUsers ?? 0} color="emerald" />
        <MiniStat label="OAuth" value={stats?.oauthCount ?? 0} total={stats?.totalUsers ?? 0} color="blue" />
        <MiniStat label="Disabled" value={stats?.disabledCount ?? 0} total={stats?.totalUsers ?? 0} color="red" />
        <MiniStat
          label="Webhooks OK"
          value={stats?.webhookStats?.success ?? 0}
          total={stats?.webhookStats?.total ?? 0}
          color="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Registration trend (last 7 days) */}
        <div className="bg-white rounded-lg border border-zinc-200 p-4">
          <h2 className="text-sm font-semibold text-zinc-700 mb-4">Registration Trend (7 days)</h2>
          <div className="flex items-end gap-1 h-32">
            {stats?.registrationTrend?.map((day) => (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-zinc-500">{day.count}</span>
                <div
                  className="w-full bg-zinc-900 rounded-t"
                  style={{
                    height: `${Math.max(4, (day.count / maxTrend) * 100)}%`,
                    minHeight: '4px',
                  }}
                />
                <span className="text-[10px] text-zinc-400">
                  {day.date.slice(5)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Role breakdown */}
        <div className="bg-white rounded-lg border border-zinc-200 p-4">
          <h2 className="text-sm font-semibold text-zinc-700 mb-4">Role Distribution</h2>
          {stats?.roleBreakdown && Object.keys(stats.roleBreakdown).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(stats.roleBreakdown)
                .sort(([, a], [, b]) => b - a)
                .map(([role, count]) => {
                  const pct = stats.totalUsers > 0 ? Math.round((count / stats.totalUsers) * 100) : 0
                  return (
                    <div key={role}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-zinc-700 font-medium">{role}</span>
                        <span className="text-zinc-500">
                          {count} ({pct}%)
                        </span>
                      </div>
                      <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            role === 'admin' ? 'bg-amber-500' : 'bg-zinc-700'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
            </div>
          ) : (
            <p className="text-zinc-400 text-sm">No users yet.</p>
          )}
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <QuickLink href="/admin/users" label="Manage Users" />
        <QuickLink href="/admin/apps" label="Manage Apps" />
        <QuickLink href="/admin/roles" label="Manage Roles" />
        <QuickLink href="/" label="Back to Site" />
      </div>

      {/* Recent users table */}
      <div className="bg-white rounded-lg border border-zinc-200">
        <div className="px-4 py-3 border-b border-zinc-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-700">{t('admin.dashboard.recentUsers')}</h2>
          <Link href="/admin/users" className="text-xs text-zinc-500 hover:text-zinc-900 transition-colors">
            View all
          </Link>
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

function StatCard({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="bg-white rounded-lg border border-zinc-200 p-4">
      <p className="text-sm text-zinc-500 mb-1">{label}</p>
      <p className={`text-3xl font-bold ${accent ? 'text-emerald-600' : 'text-zinc-900'}`}>{value}</p>
    </div>
  )
}

function MiniStat({
  label,
  value,
  total,
  color,
}: {
  label: string
  value: number
  total: number
  color: string
}) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0
  const colorMap: Record<string, string> = {
    emerald: 'bg-emerald-500',
    blue: 'bg-blue-500',
    red: 'bg-red-500',
    amber: 'bg-amber-500',
  }

  return (
    <div className="bg-white rounded-lg border border-zinc-200 p-3">
      <p className="text-xs text-zinc-500 mb-1">{label}</p>
      <p className="text-lg font-semibold text-zinc-900">
        {value}
        <span className="text-xs text-zinc-400 font-normal ml-1">/ {total}</span>
      </p>
      <div className="h-1.5 bg-zinc-100 rounded-full mt-2 overflow-hidden">
        <div
          className={`h-full rounded-full ${colorMap[color] ?? 'bg-zinc-500'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 transition-colors text-center"
    >
      {label}
    </Link>
  )
}
