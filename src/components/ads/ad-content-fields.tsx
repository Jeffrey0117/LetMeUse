'use client'

import { useState } from 'react'
import type { TranslationKey } from '@/lib/i18n'

interface AdContentFieldsProps {
  headline: string
  bodyText: string
  ctaText: string
  ctaUrl: string
  imageUrl: string
  backgroundImageUrl: string
  onUpdate: (updates: Record<string, string>) => void
  onError: (error: string) => void
  inputClass: string
  labelClass: string
  t: (key: TranslationKey) => string
}

export function AdContentFields({
  headline,
  bodyText,
  ctaText,
  ctaUrl,
  imageUrl,
  backgroundImageUrl,
  onUpdate,
  onError,
  inputClass,
  labelClass,
  t,
}: AdContentFieldsProps) {
  const [, setUploading] = useState(false)

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const formData = new FormData()
    formData.append('file', file)
    setUploading(true)
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      if (!res.ok) {
        const data = await res.json()
        onError(data.error)
        return
      }
      const data = await res.json()
      onUpdate({ imageUrl: data.url })
    } catch {
      onError('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  async function handleBackgroundUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      if (!res.ok) {
        const data = await res.json()
        onError(data.error)
        return
      }
      const data = await res.json()
      onUpdate({ backgroundImageUrl: data.url })
    } catch {
      onError('Upload failed')
    }
  }

  return (
    <>
      <div>
        <label className={labelClass}>{t('adForm.headline')}</label>
        <input
          className={inputClass}
          value={headline}
          onChange={(e) => onUpdate({ headline: e.target.value })}
          placeholder={t('adForm.headlinePlaceholder')}
          required
        />
      </div>

      <div>
        <label className={labelClass}>{t('adForm.bodyText')}</label>
        <textarea
          className={inputClass}
          rows={3}
          value={bodyText}
          onChange={(e) => onUpdate({ bodyText: e.target.value })}
          placeholder={t('adForm.bodyTextPlaceholder')}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>{t('adForm.ctaText')}</label>
          <input
            className={inputClass}
            value={ctaText}
            onChange={(e) => onUpdate({ ctaText: e.target.value })}
            placeholder="Click Here"
            required
          />
        </div>
        <div>
          <label className={labelClass}>{t('adForm.ctaUrl')}</label>
          <input
            className={inputClass}
            type="url"
            value={ctaUrl}
            onChange={(e) => onUpdate({ ctaUrl: e.target.value })}
            placeholder="https://..."
            required
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>{t('adForm.image')}</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="text-sm text-zinc-600"
        />
        {imageUrl && (
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs text-zinc-500">{imageUrl}</span>
            <button
              type="button"
              onClick={() => onUpdate({ imageUrl: '' })}
              className="text-xs text-red-600 hover:underline"
            >
              {t('adForm.removeImage')}
            </button>
          </div>
        )}
      </div>

      <div>
        <label className={labelClass}>{t('adForm.backgroundImage')}</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleBackgroundUpload}
          className="text-sm text-zinc-600"
        />
        {backgroundImageUrl && (
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs text-zinc-500">{backgroundImageUrl}</span>
            <button
              type="button"
              onClick={() => onUpdate({ backgroundImageUrl: '' })}
              className="text-xs text-red-600 hover:underline"
            >
              {t('adForm.removeBackgroundImage')}
            </button>
          </div>
        )}
      </div>
    </>
  )
}
