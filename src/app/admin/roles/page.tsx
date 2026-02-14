'use client'

import { useEffect, useState, useCallback } from 'react'
import { useLang } from '@/components/layout/lang-provider'

interface RoleItem {
  id: string
  appId: string
  name: string
  description?: string
  permissions: string[]
  isDefault: boolean
  isBuiltin: boolean
}

interface AppItem {
  id: string
  name: string
}

const ALL_PERMISSIONS = [
  'users.read',
  'users.write',
  'users.delete',
  'ads.read',
  'ads.write',
  'ads.delete',
  'projects.read',
  'projects.write',
  'projects.delete',
  'apps.read',
  'apps.write',
  'roles.read',
  'roles.write',
  'webhooks.read',
  'analytics.read',
] as const

export default function AdminRolesPage() {
  const { t } = useLang()
  const [roles, setRoles] = useState<RoleItem[]>([])
  const [apps, setApps] = useState<AppItem[]>([])
  const [selectedAppId, setSelectedAppId] = useState('')
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  // Create form
  const [newName, setNewName] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newPermissions, setNewPermissions] = useState<string[]>([])

  // Edit form
  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editPermissions, setEditPermissions] = useState<string[]>([])

  const token = typeof window !== 'undefined' ? localStorage.getItem('lmu_admin_token') : null

  const fetchApps = useCallback(async () => {
    if (!token) return
    const res = await fetch('/api/admin/apps', {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    const appsList = data.data?.apps ?? []
    setApps(appsList)
    if (appsList.length > 0 && !selectedAppId) {
      setSelectedAppId(appsList[0].id)
    }
  }, [token, selectedAppId])

  const fetchRoles = useCallback(async () => {
    if (!token || !selectedAppId) return
    setLoading(true)
    const res = await fetch(`/api/admin/roles?appId=${selectedAppId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    setRoles(data.data?.roles ?? [])
    setLoading(false)
  }, [token, selectedAppId])

  useEffect(() => {
    fetchApps()
  }, [fetchApps])

  useEffect(() => {
    if (selectedAppId) fetchRoles()
  }, [selectedAppId, fetchRoles])

  async function handleCreate() {
    if (!token || !newName.trim() || newPermissions.length === 0) return
    const res = await fetch('/api/admin/roles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        appId: selectedAppId,
        name: newName.trim(),
        description: newDescription.trim() || undefined,
        permissions: newPermissions,
      }),
    })
    if (res.ok) {
      setNewName('')
      setNewDescription('')
      setNewPermissions([])
      setShowCreate(false)
      fetchRoles()
    }
  }

  async function handleSaveEdit(id: string) {
    if (!token) return
    const res = await fetch(`/api/admin/roles/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: editName.trim() || undefined,
        description: editDescription.trim() || undefined,
        permissions: editPermissions.length > 0 ? editPermissions : undefined,
      }),
    })
    if (res.ok) {
      setEditingId(null)
      fetchRoles()
    }
  }

  async function handleDelete(id: string) {
    if (!token || !confirm(t('admin.roles.confirmDelete'))) return
    await fetch(`/api/admin/roles/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    fetchRoles()
  }

  function startEdit(role: RoleItem) {
    setEditingId(role.id)
    setEditName(role.name)
    setEditDescription(role.description ?? '')
    setEditPermissions([...role.permissions])
  }

  function togglePermission(perms: string[], perm: string, setter: (v: string[]) => void) {
    if (perms.includes(perm)) {
      setter(perms.filter((p) => p !== perm))
    } else {
      setter([...perms, perm])
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">{t('admin.roles.title')}</h1>
        <div className="flex items-center gap-3">
          {apps.length > 1 && (
            <select
              value={selectedAppId}
              onChange={(e) => setSelectedAppId(e.target.value)}
              className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm"
            >
              {apps.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.name}
                </option>
              ))}
            </select>
          )}
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 transition-colors"
          >
            {t('admin.roles.create')}
          </button>
        </div>
      </div>

      {showCreate && (
        <div className="mb-6 rounded-lg border border-zinc-200 bg-white p-4 space-y-3">
          <input
            type="text"
            placeholder={t('admin.roles.name')}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
          />
          <input
            type="text"
            placeholder={t('admin.roles.description')}
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
          />
          <div>
            <p className="text-sm font-medium text-zinc-700 mb-2">{t('admin.roles.permissions')}</p>
            <div className="flex flex-wrap gap-2">
              {ALL_PERMISSIONS.map((perm) => (
                <label key={perm} className="flex items-center gap-1.5 text-xs">
                  <input
                    type="checkbox"
                    checked={newPermissions.includes(perm)}
                    onChange={() => togglePermission(newPermissions, perm, setNewPermissions)}
                    className="rounded border-zinc-300"
                  />
                  {perm}
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCreate}
              disabled={!newName.trim() || newPermissions.length === 0}
              className="rounded-md bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800 disabled:opacity-40 transition-colors"
            >
              {t('admin.roles.createBtn')}
            </button>
            <button
              onClick={() => setShowCreate(false)}
              className="rounded-md border border-zinc-300 px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-50 transition-colors"
            >
              {t('admin.roles.cancel')}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-zinc-500">{t('common.loading')}</p>
      ) : roles.length === 0 ? (
        <p className="text-zinc-500">{t('admin.roles.empty')}</p>
      ) : (
        <div className="space-y-3">
          {roles.map((role) => (
            <div key={role.id} className="rounded-lg border border-zinc-200 bg-white p-4">
              {editingId === role.id ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                  />
                  <input
                    type="text"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder={t('admin.roles.description')}
                    className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                  />
                  <div className="flex flex-wrap gap-2">
                    {ALL_PERMISSIONS.map((perm) => (
                      <label key={perm} className="flex items-center gap-1.5 text-xs">
                        <input
                          type="checkbox"
                          checked={editPermissions.includes(perm)}
                          onChange={() => togglePermission(editPermissions, perm, setEditPermissions)}
                          className="rounded border-zinc-300"
                        />
                        {perm}
                      </label>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSaveEdit(role.id)}
                      className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm text-white hover:bg-zinc-800 transition-colors"
                    >
                      {t('admin.roles.save')}
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm text-zinc-600 hover:bg-zinc-50 transition-colors"
                    >
                      {t('admin.roles.cancel')}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-zinc-900">{role.name}</h3>
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                          role.isBuiltin
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        {role.isBuiltin ? t('admin.roles.builtin') : t('admin.roles.custom')}
                      </span>
                    </div>
                    {role.description && (
                      <p className="text-sm text-zinc-500 mb-2">{role.description}</p>
                    )}
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.map((perm) => (
                        <span
                          key={perm}
                          className="inline-block rounded bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600"
                        >
                          {perm}
                        </span>
                      ))}
                    </div>
                  </div>
                  {!role.isBuiltin && (
                    <div className="flex gap-2 shrink-0 ml-4">
                      <button
                        onClick={() => startEdit(role)}
                        className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm text-zinc-600 hover:bg-zinc-50 transition-colors"
                      >
                        {t('admin.roles.edit')}
                      </button>
                      <button
                        onClick={() => handleDelete(role.id)}
                        className="rounded-md border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        {t('admin.roles.delete')}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
