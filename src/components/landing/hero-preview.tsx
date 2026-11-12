'use client'

import type { Locale } from '@/lib/i18n'
import { PREVIEW_STYLES, type LandingCopy, type PreviewStyle } from './copy'

interface HeroPreviewProps {
  copy: LandingCopy['preview']
  locale: Locale
  style: PreviewStyle
  dark: boolean
  onStyleChange: (style: PreviewStyle) => void
  onDarkChange: (dark: boolean) => void
}

const chipBase = 'rounded-md px-2.5 py-1 text-xs font-mono transition-colors'
const chipOn = 'bg-zinc-900 text-white'
const chipOff = 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'

/** The product itself: the real sign-in modal, switchable between styles. */
export function HeroPreview({ copy, locale, style, dark, onStyleChange, onDarkChange }: HeroPreviewProps) {
  const query = new URLSearchParams({ style, theme: dark ? 'dark' : 'light', locale })

  return (
    <div className="rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
      <div className="flex flex-wrap items-center gap-1 border-b border-zinc-200 p-2">
        {PREVIEW_STYLES.map((name) => (
          <button
            key={name}
            type="button"
            aria-pressed={name === style}
            onClick={() => onStyleChange(name)}
            className={`${chipBase} ${name === style ? chipOn : chipOff}`}
          >
            {name}
          </button>
        ))}
        <span className="mx-1 h-4 w-px bg-zinc-200" aria-hidden="true" />
        <button
          type="button"
          aria-pressed={!dark}
          onClick={() => onDarkChange(false)}
          className={`${chipBase} font-sans ${dark ? chipOff : chipOn}`}
        >
          {copy.light}
        </button>
        <button
          type="button"
          aria-pressed={dark}
          onClick={() => onDarkChange(true)}
          className={`${chipBase} font-sans ${dark ? chipOn : chipOff}`}
        >
          {copy.dark}
        </button>
      </div>
      <iframe
        key={query.toString()}
        src={`/themes-frame.html?${query.toString()}`}
        title={copy.caption}
        className="block h-[520px] w-full border-0 bg-zinc-100"
      />
      <p className="border-t border-zinc-200 px-3 py-2 text-xs text-zinc-500">{copy.caption}</p>
    </div>
  )
}
