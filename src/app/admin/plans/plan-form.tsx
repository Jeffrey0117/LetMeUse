'use client'

import type { TranslationKey } from '@/lib/i18n'

interface PlanFormValues {
  name: string
  description: string
  priceMonthly: string
  priceYearly: string
  currency: string
  features: string
  isActive: boolean
  sortOrder: string
}

interface PlanFormFieldsProps {
  values: PlanFormValues
  onChange: (field: keyof PlanFormValues, value: string | boolean) => void
  t: (key: TranslationKey) => string
}

export type { PlanFormValues }

export function PlanFormFields({ values, onChange, t }: PlanFormFieldsProps) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input
          type="text"
          placeholder={t('admin.plans.name')}
          value={values.name}
          onChange={(e) => onChange('name', e.target.value)}
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
        />
        <input
          type="text"
          placeholder={t('admin.plans.description')}
          value={values.description}
          onChange={(e) => onChange('description', e.target.value)}
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
        />
        <div className="flex gap-2">
          <input
            type="number"
            placeholder={t('admin.plans.priceMonthly')}
            value={values.priceMonthly}
            onChange={(e) => onChange('priceMonthly', e.target.value)}
            min="0"
            step="0.01"
            className="flex-1 rounded-md border border-zinc-300 px-3 py-2 text-sm"
          />
          <input
            type="number"
            placeholder={t('admin.plans.priceYearly')}
            value={values.priceYearly}
            onChange={(e) => onChange('priceYearly', e.target.value)}
            min="0"
            step="0.01"
            className="flex-1 rounded-md border border-zinc-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={values.currency}
            onChange={(e) => onChange('currency', e.target.value)}
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
            value={values.sortOrder}
            onChange={(e) => onChange('sortOrder', e.target.value)}
            min="0"
            className="w-24 rounded-md border border-zinc-300 px-3 py-2 text-sm"
          />
        </div>
      </div>
      <input
        type="text"
        placeholder={t('admin.plans.featuresPlaceholder')}
        value={values.features}
        onChange={(e) => onChange('features', e.target.value)}
        className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
      />
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-zinc-700 cursor-pointer">
          <input
            type="checkbox"
            checked={values.isActive}
            onChange={(e) => onChange('isActive', e.target.checked)}
            className="rounded border-zinc-300"
          />
          {t('admin.plans.isActive')}
        </label>
      </div>
    </div>
  )
}
