'use client'

import { useEffect, useState, useCallback } from 'react'
import { useLang } from '@/components/layout/lang-provider'

interface PlanItem {
  id: string
  appId: string
  name: string
  description?: string
  priceMonthly: number
  priceYearly?: number
  currency: string
  features: string[]
  isActive: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

interface AppItem {
  id: string
  name: string
}

export default function AdminPlansPage() {
  const { t } = useLang()
  const [plans, setPlans] = useState<PlanItem[]>([])
  const [apps, setApps] = useState<AppItem[]>([])
  const [selectedAppId, setSelectedAppId] = useState('')
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  // Create form state
  const [newName, setNewName] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newPriceMonthly, setNewPriceMonthly] = useState('')
  const [newPriceYearly, setNewPriceYearly] = useState('')
  const [newCurrency, setNewCurrency] = useState('USD')
  const [newFeatures, setNewFeatures] = useState('')
  const [newIsActive, setNewIsActive] = useState(true)
  const [newSortOrder, setNewSortOrder] = useState('0')

  // Edit form state
  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editPriceMonthly, setEditPriceMonthly] = useState('')
  const [editPriceYearly, setEditPriceYearly] = useState('')
  const [editCurrency, setEditCurrency] = useState('USD')
  const [editFeatures, setEditFeatures] = useState('')
  const [editIsActive, setEditIsActive] = useState(true)
  const [editSortOrder, setEditSortOrder] = useState('0')

  const token = typeof window !== 'undefined' ? localStorage.getItem('lmu_admin_token') : null

  const fetchApps = useCallback(async () => {
    if (!token) return
    try {
      const res = await fetch('/api/admin/apps', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      const appsList: AppItem[] = data.data?.apps ?? []
      setApps(appsList)
      if (appsList.length > 0 && !selectedAppId) {
        setSelectedAppId(appsList[0].id)
      }
    } catch {
      // ignore
    }
  }, [token, selectedAppId])

  const fetchPlans = useCallback(async () => {
    if (!token || !selectedAppId) return
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/plans?appId=${selectedAppId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setPlans(data.data?.plans ?? [])
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [token, selectedAppId])

  useEffect(() => {
    fetchApps()
  }, [fetchApps])

  useEffect(() => {
    if (selectedAppId) fetchPlans()
  }, [selectedAppId, fetchPlans])

  function resetCreateForm() {
    setNewName('')
    setNewDescription('')
    setNewPriceMonthly('')
    setNewPriceYearly('')
    setNewCurrency('USD')
    setNewFeatures('')
    setNewIsActive(true)
    setNewSortOrder('0')
  }

  async function handleCreate() {
    if (!token || !newName.trim()) return
    try {
      const features = newFeatures
        .split(',')
        .map((f) => f.trim())
        .filter(Boolean)

      const res = await fetch('/api/admin/plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          appId: selectedAppId,
          name: newName.trim(),
          description: newDescription.trim() || undefined,
          priceMonthly: Number(newPriceMonthly) || 0,
          priceYearly: newPriceYearly ? Number(newPriceYearly) : undefined,
          currency: newCurrency,
          features,
          sortOrder: Number(newSortOrder) || 0,
        }),
      })
      if (res.ok) {
        resetCreateForm()
        setShowCreate(false)
        fetchPlans()
      }
    } catch {
      // ignore
    }
  }

  function startEdit(plan: PlanItem) {
    setEditingId(plan.id)
    setEditName(plan.name)
    setEditDescription(plan.description ?? '')
    setEditPriceMonthly(String(plan.priceMonthly))
    setEditPriceYearly(plan.priceYearly != null ? String(plan.priceYearly) : '')
    setEditCurrency(plan.currency)
    setEditFeatures(plan.features.join(', '))
    setEditIsActive(plan.isActive)
    setEditSortOrder(String(plan.sortOrder))
  }

  async function handleSaveEdit(id: string) {
    if (!token) return
    try {
      const features = editFeatures
        .split(',')
        .map((f) => f.trim())
        .filter(Boolean)

      const res = await fetch(`/api/admin/plans/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editName.trim() || undefined,
          description: editDescription.trim() || undefined,
          priceMonthly: Number(editPriceMonthly) || 0,
          priceYearly: editPriceYearly ? Number(editPriceYearly) : undefined,
          features,
          isActive: editIsActive,
          sortOrder: Number(editSortOrder) || 0,
        }),
      })
      if (res.ok) {
        setEditingId(null)
        fetchPlans()
      }
    } catch {
      // ignore
    }
  }

  async function handleDelete(id: string) {
    if (!token || !confirm(t('admin.plans.confirmDelete'))) return
    try {
      await fetch(`/api/admin/plans/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchPlans()
    } catch {
      // ignore
    }
  }

  function formatPrice(amount: number, currency: string): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">{t('admin.plans.title')}</h1>
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
            {t('admin.plans.create')}
          </button>
        </div>
      </div>

      {showCreate && (
        <div className="mb-6 rounded-lg border border-zinc-200 bg-white p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder={t('admin.plans.name')}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            />
            <input
              type="text"
              placeholder={t('admin.plans.description')}
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            />
            <div className="flex gap-2">
              <input
                type="number"
                placeholder={t('admin.plans.priceMonthly')}
                value={newPriceMonthly}
                onChange={(e) => setNewPriceMonthly(e.target.value)}
                min="0"
                step="0.01"
                className="flex-1 rounded-md border border-zinc-300 px-3 py-2 text-sm"
              />
              <input
                type="number"
                placeholder={t('admin.plans.priceYearly')}
                value={newPriceYearly}
                onChange={(e) => setNewPriceYearly(e.target.value)}
                min="0"
                step="0.01"
                className="flex-1 rounded-md border border-zinc-300 px-3 py-2 text-sm"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={newCurrency}
                onChange={(e) => setNewCurrency(e.target.value)}
                className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
              >
                <option value="USD">USD</option>
                <option value="TWD">TWD</option>
                <option value="EUR">EUR</option>
                <option value="JPY">JPY</option>
              </select>
              <input
                type="number"
                placeholder={t('admin.plans.sortOrder')}
                value={newSortOrder}
                onChange={(e) => setNewSortOrder(e.target.value)}
                min="0"
                className="w-24 rounded-md border border-zinc-300 px-3 py-2 text-sm"
              />
            </div>
          </div>
          <input
            type="text"
            placeholder={t('admin.plans.featuresPlaceholder')}
            value={newFeatures}
            onChange={(e) => setNewFeatures(e.target.value)}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
          />
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-zinc-700 cursor-pointer">
              <input
                type="checkbox"
                checked={newIsActive}
                onChange={(e) => setNewIsActive(e.target.checked)}
                className="rounded border-zinc-300"
              />
              {t('admin.plans.isActive')}
            </label>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCreate}
              disabled={!newName.trim()}
              className="rounded-md bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800 disabled:opacity-40 transition-colors"
            >
              {t('admin.plans.createBtn')}
            </button>
            <button
              onClick={() => {
                setShowCreate(false)
                resetCreateForm()
              }}
              className="rounded-md border border-zinc-300 px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-50 transition-colors"
            >
              {t('admin.plans.cancel')}
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg border border-zinc-200">
        {loading ? (
          <p className="px-4 py-8 text-zinc-400 text-sm text-center">{t('common.loading')}</p>
        ) : plans.length === 0 ? (
          <p className="px-4 py-8 text-zinc-400 text-sm text-center">{t('admin.plans.empty')}</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 text-left text-zinc-500">
                <th className="px-4 py-2 font-medium">{t('admin.plans.name')}</th>
                <th className="px-4 py-2 font-medium">{t('admin.plans.priceMonthly')}</th>
                <th className="px-4 py-2 font-medium">{t('admin.plans.priceYearly')}</th>
                <th className="px-4 py-2 font-medium">{t('admin.plans.currency')}</th>
                <th className="px-4 py-2 font-medium">{t('admin.table.status')}</th>
                <th className="px-4 py-2 font-medium">{t('admin.plans.features')}</th>
                <th className="px-4 py-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan) => (
                <tr key={plan.id} className="border-b border-zinc-50 hover:bg-zinc-50">
                  {editingId === plan.id ? (
                    <td colSpan={7} className="px-4 py-3">
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            placeholder={t('admin.plans.name')}
                            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                          />
                          <input
                            type="text"
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            placeholder={t('admin.plans.description')}
                            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                          />
                          <div className="flex gap-2">
                            <input
                              type="number"
                              value={editPriceMonthly}
                              onChange={(e) => setEditPriceMonthly(e.target.value)}
                              placeholder={t('admin.plans.priceMonthly')}
                              min="0"
                              step="0.01"
                              className="flex-1 rounded-md border border-zinc-300 px-3 py-2 text-sm"
                            />
                            <input
                              type="number"
                              value={editPriceYearly}
                              onChange={(e) => setEditPriceYearly(e.target.value)}
                              placeholder={t('admin.plans.priceYearly')}
                              min="0"
                              step="0.01"
                              className="flex-1 rounded-md border border-zinc-300 px-3 py-2 text-sm"
                            />
                          </div>
                          <div className="flex gap-2">
                            <select
                              value={editCurrency}
                              onChange={(e) => setEditCurrency(e.target.value)}
                              className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
                            >
                              <option value="USD">USD</option>
                              <option value="TWD">TWD</option>
                              <option value="EUR">EUR</option>
                              <option value="JPY">JPY</option>
                            </select>
                            <input
                              type="number"
                              value={editSortOrder}
                              onChange={(e) => setEditSortOrder(e.target.value)}
                              placeholder={t('admin.plans.sortOrder')}
                              min="0"
                              className="w-24 rounded-md border border-zinc-300 px-3 py-2 text-sm"
                            />
                          </div>
                        </div>
                        <input
                          type="text"
                          value={editFeatures}
                          onChange={(e) => setEditFeatures(e.target.value)}
                          placeholder={t('admin.plans.featuresPlaceholder')}
                          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                        />
                        <div className="flex items-center gap-4">
                          <label className="flex items-center gap-2 text-sm text-zinc-700 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={editIsActive}
                              onChange={(e) => setEditIsActive(e.target.checked)}
                              className="rounded border-zinc-300"
                            />
                            {t('admin.plans.isActive')}
                          </label>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSaveEdit(plan.id)}
                            className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm text-white hover:bg-zinc-800 transition-colors"
                          >
                            {t('admin.plans.save')}
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm text-zinc-600 hover:bg-zinc-50 transition-colors"
                          >
                            {t('admin.plans.cancel')}
                          </button>
                        </div>
                      </div>
                    </td>
                  ) : (
                    <>
                      <td className="px-4 py-2">
                        <div>
                          <span className="text-zinc-900 font-medium">{plan.name}</span>
                          {plan.description && (
                            <p className="text-xs text-zinc-400 mt-0.5">{plan.description}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-2 text-zinc-700">
                        {formatPrice(plan.priceMonthly, plan.currency)}{t('admin.plans.monthly')}
                      </td>
                      <td className="px-4 py-2 text-zinc-700">
                        {plan.priceYearly != null
                          ? `${formatPrice(plan.priceYearly, plan.currency)}${t('admin.plans.yearly')}`
                          : '—'}
                      </td>
                      <td className="px-4 py-2 text-zinc-500">{plan.currency}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                            plan.isActive
                              ? 'bg-green-100 text-green-700'
                              : 'bg-zinc-100 text-zinc-500'
                          }`}
                        >
                          {plan.isActive ? t('admin.plans.active') : t('admin.plans.inactive')}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-zinc-500">
                        {plan.features.length} {t('admin.plans.featuresCount')}
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => startEdit(plan)}
                            className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                          >
                            {t('admin.plans.edit')}
                          </button>
                          <button
                            onClick={() => handleDelete(plan.id)}
                            className="text-red-500 hover:text-red-700 text-xs font-medium"
                          >
                            {t('admin.plans.delete')}
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
