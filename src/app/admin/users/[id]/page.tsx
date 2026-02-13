'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLang } from '@/components/layout/lang-provider'

interface User {
  id: string
  email: string
  displayName: string
  role: string
  disabled: boolean
  appId: string
  avatar?: string
  createdAt: string
  updatedAt: string
  lastLoginAt?: string
}

export default function AdminUserDetailPage() {
  const { t } = useLang()
  const params = useParams()
  const router = useRouter()
  const userId = params.id as string

  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const token = typeof window !== 'undefined' ? localStorage.getItem('adman_admin_token') : null

  const fetchUser = useCallback(async () => {
    if (!token) return
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setUser(data.user ?? null)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [userId, token])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  async function toggleRole() {
    if (!user || !token) return
    setSaving(true)
    try {
      const newRole = user.role === 'admin' ? 'user' : 'admin'
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ role: newRole }),
      })
      const data = await res.json()
      if (data.user) setUser(data.user)
    } catch {
      // ignore
    } finally {
      setSaving(false)
    }
  }

  async function toggleDisabled() {
    if (!user || !token) return
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ disabled: !user.disabled }),
      })
      const data = await res.json()
      if (data.user) setUser(data.user)
    } catch {
      // ignore
    } finally {
      setSaving(false)
    }
  }

  async function deleteUser() {
    if (!user || !token) return
    if (!confirm(t('admin.users.confirmDelete'))) return
    setSaving(true)
    try {
      await fetch(`/api/admin/users/${user.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      router.push('/admin/users')
    } catch {
      // ignore
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <p className="text-zinc-500 py-8">{t('common.loading')}</p>
  }

  if (!user) {
    return <p className="text-zinc-500 py-8">{t('common.notFound')}</p>
  }

  return (
    <div>
      <Link href="/admin/users" className="text-sm text-zinc-500 hover:text-zinc-700 mb-4 inline-block">
        &larr; {t('admin.users.backToList')}
      </Link>

      <div className="bg-white rounded-lg border border-zinc-200 p-6">
        <h1 className="text-xl font-bold text-zinc-900 mb-4">{user.displayName}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-6">
          <div>
            <span className="text-zinc-500">{t('admin.table.email')}:</span>
            <span className="ml-2 text-zinc-900">{user.email}</span>
          </div>
          <div>
            <span className="text-zinc-500">{t('admin.table.role')}:</span>
            <span className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${
              user.role === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-zinc-100 text-zinc-600'
            }`}>
              {user.role}
            </span>
          </div>
          <div>
            <span className="text-zinc-500">{t('admin.table.status')}:</span>
            <span className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${
              user.disabled ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
            }`}>
              {user.disabled ? t('admin.users.disabled') : t('admin.users.active')}
            </span>
          </div>
          <div>
            <span className="text-zinc-500">App ID:</span>
            <span className="ml-2 text-zinc-900 font-mono text-xs">{user.appId}</span>
          </div>
          <div>
            <span className="text-zinc-500">{t('admin.table.joined')}:</span>
            <span className="ml-2 text-zinc-900">{new Date(user.createdAt).toLocaleString()}</span>
          </div>
          {user.lastLoginAt && (
            <div>
              <span className="text-zinc-500">{t('admin.users.lastLogin')}:</span>
              <span className="ml-2 text-zinc-900">{new Date(user.lastLoginAt).toLocaleString()}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 border-t border-zinc-100 pt-4">
          <button
            onClick={toggleRole}
            disabled={saving}
            className="px-3 py-1.5 text-sm border border-zinc-200 rounded-md hover:bg-zinc-50 disabled:opacity-50"
          >
            {user.role === 'admin' ? t('admin.users.demoteToUser') : t('admin.users.promoteToAdmin')}
          </button>
          <button
            onClick={toggleDisabled}
            disabled={saving}
            className={`px-3 py-1.5 text-sm rounded-md disabled:opacity-50 ${
              user.disabled
                ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
            }`}
          >
            {user.disabled ? t('admin.users.enable') : t('admin.users.disable')}
          </button>
          <button
            onClick={deleteUser}
            disabled={saving}
            className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 ml-auto"
          >
            {t('admin.users.delete')}
          </button>
        </div>
      </div>
    </div>
  )
}
