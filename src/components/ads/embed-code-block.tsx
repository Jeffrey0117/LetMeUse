'use client'

import { useState } from 'react'
import type { TranslationKey } from '@/lib/i18n'

const EMBED_ATTRS: { attr: string; key: TranslationKey; example: string }[] = [
  { attr: 'data-bg-color', key: 'adForm.embedAttr.bgColor', example: '#1e293b' },
  { attr: 'data-text-color', key: 'adForm.embedAttr.textColor', example: '#ffffff' },
  { attr: 'data-font-size', key: 'adForm.embedAttr.fontSize', example: '16px' },
  { attr: 'data-cta-bg-color', key: 'adForm.embedAttr.ctaBgColor', example: '#3b82f6' },
  { attr: 'data-cta-text-color', key: 'adForm.embedAttr.ctaTextColor', example: '#fff' },
  { attr: 'data-border-radius', key: 'adForm.embedAttr.borderRadius', example: '12px' },
  { attr: 'data-padding', key: 'adForm.embedAttr.padding', example: '20px' },
  { attr: 'data-max-width', key: 'adForm.embedAttr.maxWidth', example: '600px' },
  { attr: 'data-text-align', key: 'adForm.embedAttr.textAlign', example: 'center' },
]

interface EmbedCodeBlockProps {
  adId: string
  t: (key: TranslationKey) => string
}

export function EmbedCodeBlock({ adId, t }: EmbedCodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const [attrsOpen, setAttrsOpen] = useState(false)
  const origin = typeof window !== 'undefined' ? window.location.origin : 'YOUR_DOMAIN'
  const code = `<div data-lmu-id="${adId}"></div>\n<script src="${origin}/embed/letmeuse.js"></script>`

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback: select text
    }
  }

  return (
    <div className="mt-6 rounded-lg border border-zinc-200 bg-white p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-zinc-700">
          {t('adForm.embedCode')}
        </h3>
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-md border border-zinc-300 px-3 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-100 transition-colors"
        >
          {copied ? t('adForm.copied') : t('adForm.copy')}
        </button>
      </div>
      <pre className="rounded bg-zinc-100 p-3 text-xs text-zinc-700 overflow-x-auto select-all">
        {code}
      </pre>

      <div className="mt-3 border-t border-zinc-100 pt-3">
        <button
          type="button"
          onClick={() => setAttrsOpen((prev) => !prev)}
          className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-700 transition-colors"
        >
          <span className={`inline-block transition-transform ${attrsOpen ? 'rotate-90' : ''}`}>&#9654;</span>
          {t('adForm.embedAttrsTitle')}
        </button>
        {attrsOpen && (
          <div className="mt-2">
            <p className="text-xs text-zinc-500 mb-2">{t('adForm.embedAttrsDesc')}</p>
            <div className="space-y-1">
              {EMBED_ATTRS.map(({ attr, key, example }) => (
                <div key={attr} className="flex items-baseline gap-2 text-xs">
                  <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-zinc-600 whitespace-nowrap">{attr}</code>
                  <span className="text-zinc-400">&mdash;</span>
                  <span className="text-zinc-500">{t(key)}</span>
                  <span className="text-zinc-300 ml-auto font-mono">{example}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
