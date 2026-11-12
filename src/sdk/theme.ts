/**
 * Theme resolution (style preset × light/dark × accent), CSS custom
 * properties, and the auto-theme observer.
 */

import type { StyleName, ThemeMode, ThemeTokens } from './types'
import { BASE_SHAPE, PRESETS, STYLE_NAMES } from './presets'

const DEFAULT_STYLE: StyleName = 'classic'
const LIGHT_TEXT = '#ffffff'
const DARK_TEXT = '#111111'
/** Only clearly light accents (yellow, lime, white…) flip to dark text. */
const LIGHT_ACCENT_LUMINANCE = 0.6

/** Map a `data-style` attribute value to a known style; unknown → classic. */
export function resolveStyleName(raw: string | null | undefined): StyleName {
  const name = (raw ?? '').trim().toLowerCase()
  return (STYLE_NAMES as readonly string[]).includes(name) ? (name as StyleName) : DEFAULT_STYLE
}

/**
 * The accent is written into a <style> block, so it must be a plain CSS colour:
 * hex, a colour name, or rgb()/hsl()/oklch(). Anything that could close the
 * rule or the tag (`;`, `{`, `<`, quotes…) is rejected → null (= style default).
 */
export function sanitizeAccent(raw: string | null | undefined): string | null {
  const value = (raw ?? '').trim()
  if (!value || value.length > 64) return null
  return /^(#[0-9a-f]{3,8}|[a-z]+|(rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\([0-9a-z.,%\s/+-]+\))$/i.test(value) ? value : null
}

/** `#rgb` / `#rrggbb` → `rrggbb`; anything else → null. */
function parseHex(color: string): string | null {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(color.trim())
  if (!match) return null
  const hex = match[1]
  return hex.length === 3 ? hex.split('').map((c) => c + c).join('') : hex
}

function relativeLuminance(hex: string): number {
  const channel = (offset: number): number => {
    const value = parseInt(hex.slice(offset, offset + 2), 16) / 255
    return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4)
  }
  return 0.2126 * channel(0) + 0.7152 * channel(2) + 0.0722 * channel(4)
}

/** Text colour that stays readable on the accent. Unparseable → white (historical). */
export function contrastTextFor(accent: string): string {
  const hex = parseHex(accent)
  if (!hex) return LIGHT_TEXT
  return relativeLuminance(hex) > LIGHT_ACCENT_LUMINANCE ? DARK_TEXT : LIGHT_TEXT
}

/** Translucent accent for focus rings. */
export function focusRingFor(accent: string): string {
  const hex = parseHex(accent)
  return hex ? `#${hex}22` : `color-mix(in srgb, ${accent} 14%, transparent)`
}

/** Resolve the full token set for a style in the given mode. */
export function resolveTokens(
  style: StyleName,
  isDark: boolean,
  accentOverride: string | null | undefined
): ThemeTokens {
  const preset = PRESETS[style]
  const merged = { ...BASE_SHAPE, ...preset.shape, ...(isDark ? preset.dark : preset.light) }
  const override = sanitizeAccent(accentOverride)
  const accent = override || merged.accent
  // A caller-chosen accent is also the link colour, as it always was.
  const link = override || merged.link || accent
  return { ...merged, accent, link, onAccent: contrastTextFor(accent), ring: focusRingFor(accent) }
}

function cssVarName(tokenKey: string): string {
  return `--lmu-${tokenKey.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}`
}

/** Token set → `--lmu-*: value;` declarations for a `:host` block. */
export function tokensToCssVars(tokens: ThemeTokens): string {
  return Object.entries(tokens)
    .map(([key, value]) => `${cssVarName(key)}: ${value};`)
    .join('\n    ')
}

function applyTokensToHost(host: HTMLElement, tokens: ThemeTokens): void {
  for (const [key, value] of Object.entries(tokens)) {
    host.style.setProperty(cssVarName(key), value)
  }
}

function detectHostPageTheme(): boolean {
  const htmlTheme = document.documentElement.getAttribute('data-theme')
  if (htmlTheme === 'dark') return true
  if (htmlTheme === 'light') return false

  if (document.documentElement.classList.contains('dark')) return true

  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function resolveIsDark(themeSetting: ThemeMode): boolean {
  if (themeSetting === 'auto') return detectHostPageTheme()
  return themeSetting === 'dark'
}

/**
 * Manages theme state, shadow host tracking, and auto-theme observers.
 */
export class ThemeManager {
  private currentIsDark: boolean
  private readonly themeSetting: ThemeMode
  private readonly style: StyleName
  private readonly accentOverride: string | null
  private readonly activeShadowHosts: Set<HTMLElement> = new Set()

  constructor(themeSetting: ThemeMode, style: StyleName = DEFAULT_STYLE, accentOverride: string | null = null) {
    this.themeSetting = themeSetting
    this.style = style
    this.accentOverride = accentOverride
    this.currentIsDark = resolveIsDark(themeSetting)
    this.setupAutoTheme()
  }

  get isDark(): boolean {
    return this.currentIsDark
  }

  /** Current tokens (style × mode × accent). */
  get tokens(): ThemeTokens {
    return resolveTokens(this.style, this.currentIsDark, this.accentOverride)
  }

  /** `--lmu-*` declarations to drop into a component's `:host` rule. */
  hostVars(): string {
    return tokensToCssVars(this.tokens)
  }

  registerHost(host: HTMLElement): void {
    this.activeShadowHosts.add(host)
  }

  unregisterHost(host: HTMLElement): void {
    this.activeShadowHosts.delete(host)
  }

  applyToHost(host: HTMLElement): void {
    applyTokensToHost(host, this.tokens)
  }

  private updateAllShadowHosts(): void {
    const tokens = this.tokens
    for (const host of this.activeShadowHosts) {
      applyTokensToHost(host, tokens)
    }
  }

  private handleThemeChange(): void {
    const newIsDark = resolveIsDark(this.themeSetting)
    if (newIsDark === this.currentIsDark) return
    this.currentIsDark = newIsDark
    this.updateAllShadowHosts()
  }

  private setupAutoTheme(): void {
    if (this.themeSetting !== 'auto') return

    const themeObserver = new MutationObserver(() => {
      this.handleThemeChange()
    })
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'class'],
    })

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      this.handleThemeChange()
    })
  }
}
