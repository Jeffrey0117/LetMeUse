'use client'

import { useEffect, useState, useCallback } from 'react'
import { useLang } from '@/components/layout/lang-provider'
import { OAuthBadge, OAuthEditForm } from './oauth-config-form'
import type { OAuthProviders } from './oauth-config-form'
import { PurchaseVerifyEditForm } from './purchase-verify-form'
import type { PurchaseVerifyConfig } from './purchase-verify-form'

interface AppItem {
  id: string
  name: string
  secret: string
  domains: string[]
  webhookUrl?: string
  oauthProviders?: OAuthProviders
  purchaseVerify?: PurchaseVerifyConfig
  createdAt: string
}

export default function AdminAppsPage() {
  const { t } = useLang()
  const [apps, setApps] = useState<AppItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDomains, setNewDomains] = useState('')
  const [creating, setCreating] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [editingOAuth, setEditingOAuth] = useState<string | null>(null)
  const [savingOAuth, setSavingOAuth] = useState(false)
  const [editingPV, setEditingPV] = useState<string | null>(null)
  const [savingPV, setSavingPV] = useState(false)

  const token = typeof window !== 'undefined' ? localStorage.getItem('lmu_admin_token') : null

  const fetchApps = useCallback(async () => {
    if (!token) return
    try {
      const res = await fetch('/api/admin/apps', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setApps(data.data?.apps ?? [])
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    fetchApps()
  }, [fetchApps])

  async function createApp() {
    if (!token || !newName.trim()) return
    setCreating(true)
    try {
      const domains = newDomains
        .split(',')
        .map((d) => d.trim())
        .filter(Boolean)

      const res = await fetch('/api/admin/apps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: newName, domains }),
      })
      const data = await res.json()
      if (data.data?.app) {
        setApps((prev) => [...prev, data.data.app])
        setNewName('')
        setNewDomains('')
        setShowCreate(false)
      }
    } catch {
      // ignore
    } finally {
      setCreating(false)
    }
  }

  async function deleteApp(id: string) {
    if (!token) return
    if (!confirm(t('admin.apps.confirmDelete'))) return
    try {
      await fetch(`/api/admin/apps/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      setApps((prev) => prev.filter((a) => a.id !== id))
    } catch {
      // ignore
    }
  }

  async function saveOAuth(appId: string, providers: OAuthProviders) {
    if (!token) return
    setSavingOAuth(true)
    try {
      const res = await fetch(`/api/admin/apps/${appId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ oauthProviders: providers }),
      })
      const data = await res.json()
      if (data.data?.app) {
        setApps((prev) => prev.map((a) => (a.id === appId ? data.data.app : a)))
      }
      setEditingOAuth(null)
    } catch {
      // ignore
    } finally {
      setSavingOAuth(false)
    }
  }

  async function savePurchaseVerify(appId: string, config: PurchaseVerifyConfig) {
    if (!token) return
    setSavingPV(true)
    try {
      const res = await fetch(`/api/admin/apps/${appId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ purchaseVerify: config }),
      })
      const data = await res.json()
      if (data.data?.app) {
        setApps((prev) => prev.map((a) => (a.id === appId ? data.data.app : a)))
      }
      setEditingPV(null)
    } catch {
      // ignore
    } finally {
      setSavingPV(false)
    }
  }

  function copyToClipboard(text: string, id: string) {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (loading) {
    return <p className="text-zinc-500 py-8">{t('common.loading')}</p>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">{t('admin.apps.title')}</h1>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="px-4 py-2 text-sm bg-zinc-900 text-white rounded-lg hover:bg-zinc-800"
        >
          {t('admin.apps.create')}
        </button>
      </div>

      {showCreate && (
        <div className="bg-white rounded-lg border border-zinc-200 p-4 mb-6">
          <h2 className="text-sm font-semibold text-zinc-700 mb-3">{t('admin.apps.newApp')}</h2>
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder={t('admin.apps.namePlaceholder')}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="px-3 py-2 border border-zinc-200 rounded-lg text-sm outline-none focus:border-zinc-400"
            />
            <input
              type="text"
              placeholder={t('admin.apps.domainsPlaceholder')}
              value={newDomains}
              onChange={(e) => setNewDomains(e.target.value)}
              className="px-3 py-2 border border-zinc-200 rounded-lg text-sm outline-none focus:border-zinc-400"
            />
            <div className="flex gap-2">
              <button
                onClick={createApp}
                disabled={creating || !newName.trim()}
                className="px-4 py-2 text-sm bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 disabled:opacity-50"
              >
                {creating ? t('common.loading') : t('admin.apps.createBtn')}
              </button>
              <button
                onClick={() => setShowCreate(false)}
                className="px-4 py-2 text-sm border border-zinc-200 rounded-lg hover:bg-zinc-50"
              >
                {t('projects.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {apps.length === 0 ? (
          <p className="text-zinc-400 text-sm text-center py-8">{t('admin.apps.empty')}</p>
        ) : (
          apps.map((app) => (
            <div key={app.id} className="bg-white rounded-lg border border-zinc-200 p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-zinc-900">{app.name}</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {t('admin.table.joined')}: {new Date(app.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => deleteApp(app.id)}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  {t('admin.apps.delete')}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-zinc-500 text-xs">APP_ID</span>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="bg-zinc-50 px-2 py-1 rounded text-xs font-mono flex-1 truncate">
                      {app.id}
                    </code>
                    <button
                      onClick={() => copyToClipboard(app.id, `${app.id}-id`)}
                      className="text-xs text-blue-600 hover:text-blue-800 shrink-0"
                    >
                      {copiedId === `${app.id}-id` ? t('adForm.copied') : t('adForm.copy')}
                    </button>
                  </div>
                </div>
                <div>
                  <span className="text-zinc-500 text-xs">APP_SECRET</span>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="bg-zinc-50 px-2 py-1 rounded text-xs font-mono flex-1 truncate">
                      {app.secret}
                    </code>
                    <button
                      onClick={() => copyToClipboard(app.secret, `${app.id}-secret`)}
                      className="text-xs text-blue-600 hover:text-blue-800 shrink-0"
                    >
                      {copiedId === `${app.id}-secret` ? t('adForm.copied') : t('adForm.copy')}
                    </button>
                  </div>
                </div>
              </div>

              {app.domains.length > 0 && (
                <div className="mt-3">
                  <span className="text-zinc-500 text-xs">{t('admin.apps.domains')}</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {app.domains.map((domain) => (
                      <span
                        key={domain}
                        className="bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded text-xs"
                      >
                        {domain}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* OAuth Configuration */}
              <div className="mt-3 pt-3 border-t border-zinc-100">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 text-xs font-medium">OAuth Providers</span>
                  <button
                    onClick={() => setEditingOAuth(editingOAuth === app.id ? null : app.id)}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    {editingOAuth === app.id ? t('projects.cancel') : t('projects.edit')}
                  </button>
                </div>

                {editingOAuth !== app.id ? (
                  <div className="flex gap-2 mt-2">
                    <OAuthBadge
                      provider="Google"
                      enabled={app.oauthProviders?.google?.enabled ?? false}
                    />
                    <OAuthBadge
                      provider="GitHub"
                      enabled={app.oauthProviders?.github?.enabled ?? false}
                    />
                  </div>
                ) : (
                  <OAuthEditForm
                    app={app}
                    saving={savingOAuth}
                    onSave={(providers) => saveOAuth(app.id, providers)}
                    onCancel={() => setEditingOAuth(null)}
                  />
                )}
              </div>

              {/* Purchase Verify Configuration */}
              <div className="mt-3 pt-3 border-t border-zinc-100">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 text-xs font-medium">Purchase Verify</span>
                  <button
                    onClick={() => setEditingPV(editingPV === app.id ? null : app.id)}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    {editingPV === app.id ? t('projects.cancel') : t('projects.edit')}
                  </button>
                </div>

                {editingPV !== app.id ? (
                  <div className="flex gap-2 mt-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        app.purchaseVerify?.enabled
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : 'bg-zinc-50 text-zinc-400 border border-zinc-200'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${app.purchaseVerify?.enabled ? 'bg-green-500' : 'bg-zinc-300'}`} />
                      {app.purchaseVerify?.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                ) : (
                  <PurchaseVerifyEditForm
                    app={app}
                    saving={savingPV}
                    onSave={(config) => savePurchaseVerify(app.id, config)}
                    onCancel={() => setEditingPV(null)}
                  />
                )}
              </div>

              <div className="mt-3 pt-3 border-t border-zinc-100">
                <span className="text-zinc-500 text-xs">{t('admin.apps.scriptTag')}</span>
                <code className="block bg-zinc-50 px-2 py-1.5 rounded text-xs font-mono mt-1 break-all">
                  {`<script src="${typeof window !== 'undefined' ? window.location.origin : ''}/sdk.js" data-app-id="${app.id}"></script>`}
                </code>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
