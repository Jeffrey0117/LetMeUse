/**
 * Theme detection, CSS custom properties, and auto-theme observer
 */

import type { ThemeColors, ThemeMode } from './types'

export function getThemeColors(isDark: boolean): ThemeColors {
  return {
    bg: isDark ? '#1e1e2e' : '#ffffff',
    textColor: isDark ? '#cdd6f4' : '#1e293b',
    subtextColor: isDark ? '#a6adc8' : '#64748b',
    inputBg: isDark ? '#313244' : '#f8fafc',
    inputBorder: isDark ? '#45475a' : '#e2e8f0',
    errorBg: isDark ? '#3b1c1c' : '#fef2f2',
    errorColor: isDark ? '#f87171' : '#dc2626',
    errorBorder: isDark ? '#5c2828' : '#fecaca',
    hoverBg: isDark ? '#3b3b50' : '#f1f5f9',
    roleBg: isDark ? '#313244' : '#f1f5f9',
    dropdownItemHoverBg: isDark ? '#313244' : '#f8fafc',
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

export function buildHostThemeVars(colors: ThemeColors): string {
  return `
    --lmu-bg: ${colors.bg};
    --lmu-text: ${colors.textColor};
    --lmu-subtext: ${colors.subtextColor};
    --lmu-input-bg: ${colors.inputBg};
    --lmu-input-border: ${colors.inputBorder};
    --lmu-error-bg: ${colors.errorBg};
    --lmu-error-color: ${colors.errorColor};
    --lmu-error-border: ${colors.errorBorder};
    --lmu-hover-bg: ${colors.hoverBg};
    --lmu-role-bg: ${colors.roleBg};
    --lmu-dropdown-item-hover-bg: ${colors.dropdownItemHoverBg};
  `
}

export function applyThemeToHost(host: HTMLElement, isDark: boolean): void {
  const colors = getThemeColors(isDark)
  host.style.setProperty('--lmu-bg', colors.bg)
  host.style.setProperty('--lmu-text', colors.textColor)
  host.style.setProperty('--lmu-subtext', colors.subtextColor)
  host.style.setProperty('--lmu-input-bg', colors.inputBg)
  host.style.setProperty('--lmu-input-border', colors.inputBorder)
  host.style.setProperty('--lmu-error-bg', colors.errorBg)
  host.style.setProperty('--lmu-error-color', colors.errorColor)
  host.style.setProperty('--lmu-error-border', colors.errorBorder)
  host.style.setProperty('--lmu-hover-bg', colors.hoverBg)
  host.style.setProperty('--lmu-role-bg', colors.roleBg)
  host.style.setProperty('--lmu-dropdown-item-hover-bg', colors.dropdownItemHoverBg)
}

/**
 * Manages theme state, shadow host tracking, and auto-theme observers.
 */
export class ThemeManager {
  private currentIsDark: boolean
  private readonly themeSetting: ThemeMode
  private readonly activeShadowHosts: Set<HTMLElement> = new Set()

  constructor(themeSetting: ThemeMode) {
    this.themeSetting = themeSetting
    this.currentIsDark = resolveIsDark(themeSetting)
    this.setupAutoTheme()
  }

  get isDark(): boolean {
    return this.currentIsDark
  }

  registerHost(host: HTMLElement): void {
    this.activeShadowHosts.add(host)
  }

  unregisterHost(host: HTMLElement): void {
    this.activeShadowHosts.delete(host)
  }

  applyToHost(host: HTMLElement): void {
    applyThemeToHost(host, this.currentIsDark)
  }

  private updateAllShadowHosts(): void {
    for (const host of this.activeShadowHosts) {
      applyThemeToHost(host, this.currentIsDark)
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
