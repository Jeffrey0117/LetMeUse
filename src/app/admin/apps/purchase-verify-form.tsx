'use client'

import { useState } from 'react'

export interface PurchaseVerifyConfig {
  enabled: boolean
  providerUrl: string
  providerSecret: string
  purchasePageUrl: string
  courseId?: string
}

export interface AppItemWithPurchaseVerify {
  id: string
  purchaseVerify?: PurchaseVerifyConfig
}

interface PurchaseVerifyEditFormProps {
  app: AppItemWithPurchaseVerify
  saving: boolean
  onSave: (config: PurchaseVerifyConfig) => void
  onCancel: () => void
}

export function PurchaseVerifyEditForm({ app, saving, onSave, onCancel }: PurchaseVerifyEditFormProps) {
  const [enabled, setEnabled] = useState(app.purchaseVerify?.enabled ?? false)
  const [providerUrl, setProviderUrl] = useState(app.purchaseVerify?.providerUrl ?? '')
  const [providerSecret, setProviderSecret] = useState(app.purchaseVerify?.providerSecret ?? '')
  const [purchasePageUrl, setPurchasePageUrl] = useState(app.purchaseVerify?.purchasePageUrl ?? '')
  const [courseId, setCourseId] = useState(app.purchaseVerify?.courseId ?? '')

  function handleSave() {
    onSave({
      enabled,
      providerUrl,
      providerSecret,
      purchasePageUrl,
      ...(courseId ? { courseId } : {}),
    })
  }

  const inputClass = 'w-full px-2.5 py-1.5 border border-zinc-200 rounded text-xs outline-none focus:border-zinc-400 font-mono'

  return (
    <div className="mt-3 space-y-3">
      <div className="bg-zinc-50 rounded-lg p-3">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-zinc-700">Purchase Verification</span>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="w-3.5 h-3.5 rounded"
            />
            <span className="text-xs text-zinc-600">Enabled</span>
          </label>
        </div>
        <div className="space-y-2">
          <div>
            <label className="text-xs text-zinc-500 mb-1 block">Provider URL (verify endpoint)</label>
            <input
              type="text"
              placeholder="https://example.com/functions/v1/verify-purchase"
              value={providerUrl}
              onChange={(e) => setProviderUrl(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500 mb-1 block">Provider Secret (Bearer token)</label>
            <input
              type="password"
              placeholder="Bearer token for provider"
              value={providerSecret}
              onChange={(e) => setProviderSecret(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500 mb-1 block">Purchase Page URL (user-facing)</label>
            <input
              type="text"
              placeholder="https://classroo.tw/xxx/products/xxx"
              value={purchasePageUrl}
              onChange={(e) => setPurchasePageUrl(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500 mb-1 block">Course/Product ID (optional)</label>
            <input
              type="text"
              placeholder="UUID of the product"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-3 py-1.5 text-xs bg-zinc-900 text-white rounded-md hover:bg-zinc-800 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Purchase Verify'}
        </button>
        <button
          onClick={onCancel}
          className="px-3 py-1.5 text-xs border border-zinc-200 rounded-md hover:bg-zinc-50"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
