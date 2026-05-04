'use client'

import type { TranslationKey } from '@/lib/i18n'

interface AdStyle {
  backgroundColor: string
  textColor: string
  ctaBackgroundColor: string
  ctaTextColor: string
  borderRadius: string
  padding: string
  maxWidth: string
}

interface StyleFieldsProps {
  style: AdStyle
  onStyleChange: (updates: Partial<AdStyle>) => void
  inputClass: string
  labelClass: string
  t: (key: TranslationKey) => string
}

export type { AdStyle }

export function StyleFields({ style, onStyleChange, inputClass, labelClass, t }: StyleFieldsProps) {
  return (
    <div className="border-t border-zinc-200 pt-4">
      <h3 className="text-sm font-semibold text-zinc-700 mb-3">
        {t('adForm.style')}
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>{t('adForm.bgColor')}</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={style.backgroundColor}
              onChange={(e) => onStyleChange({ backgroundColor: e.target.value })}
              className="h-9 w-12 rounded border border-zinc-300 cursor-pointer"
            />
            <input
              className={inputClass}
              value={style.backgroundColor}
              onChange={(e) => onStyleChange({ backgroundColor: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label className={labelClass}>{t('adForm.textColor')}</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={style.textColor}
              onChange={(e) => onStyleChange({ textColor: e.target.value })}
              className="h-9 w-12 rounded border border-zinc-300 cursor-pointer"
            />
            <input
              className={inputClass}
              value={style.textColor}
              onChange={(e) => onStyleChange({ textColor: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label className={labelClass}>{t('adForm.ctaBgColor')}</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={style.ctaBackgroundColor}
              onChange={(e) => onStyleChange({ ctaBackgroundColor: e.target.value })}
              className="h-9 w-12 rounded border border-zinc-300 cursor-pointer"
            />
            <input
              className={inputClass}
              value={style.ctaBackgroundColor}
              onChange={(e) => onStyleChange({ ctaBackgroundColor: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label className={labelClass}>{t('adForm.ctaTextColor')}</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={style.ctaTextColor}
              onChange={(e) => onStyleChange({ ctaTextColor: e.target.value })}
              className="h-9 w-12 rounded border border-zinc-300 cursor-pointer"
            />
            <input
              className={inputClass}
              value={style.ctaTextColor}
              onChange={(e) => onStyleChange({ ctaTextColor: e.target.value })}
            />
          </div>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-3">
        <div>
          <label className={labelClass}>{t('adForm.borderRadius')}</label>
          <input
            className={inputClass}
            value={style.borderRadius}
            onChange={(e) => onStyleChange({ borderRadius: e.target.value })}
            placeholder="8px"
          />
        </div>
        <div>
          <label className={labelClass}>{t('adForm.padding')}</label>
          <input
            className={inputClass}
            value={style.padding}
            onChange={(e) => onStyleChange({ padding: e.target.value })}
            placeholder="16px"
          />
        </div>
        <div>
          <label className={labelClass}>{t('adForm.maxWidth')}</label>
          <input
            className={inputClass}
            value={style.maxWidth}
            onChange={(e) => onStyleChange({ maxWidth: e.target.value })}
            placeholder="100%"
          />
        </div>
      </div>
    </div>
  )
}
