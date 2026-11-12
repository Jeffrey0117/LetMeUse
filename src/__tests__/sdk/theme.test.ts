import { describe, it, expect } from 'vitest'
import { STYLE_NAMES, PRESETS } from '@/sdk/presets'
import {
  resolveStyleName,
  resolveTokens,
  tokensToCssVars,
  contrastTextFor,
  sanitizeAccent,
  focusRingFor,
} from '@/sdk/theme'

describe('resolveStyleName', () => {
  it('defaults to classic when the attribute is missing', () => {
    expect(resolveStyleName(null)).toBe('classic')
    expect(resolveStyleName('')).toBe('classic')
  })

  it('accepts every published style, case-insensitively', () => {
    for (const name of STYLE_NAMES) {
      expect(resolveStyleName(name)).toBe(name)
      expect(resolveStyleName(` ${name.toUpperCase()} `)).toBe(name)
    }
  })

  it('falls back to classic for unknown names', () => {
    expect(resolveStyleName('does-not-exist')).toBe('classic')
    // must not resolve inherited object keys as a style
    expect(resolveStyleName('constructor')).toBe('classic')
  })
})

describe('presets', () => {
  it('ships several distinct styles', () => {
    expect(STYLE_NAMES.length).toBeGreaterThanOrEqual(6)
    expect(new Set(STYLE_NAMES).size).toBe(STYLE_NAMES.length)
  })

  it('every style resolves the full token set in both light and dark', () => {
    const referenceKeys = Object.keys(resolveTokens('classic', false, null)).sort()
    for (const name of STYLE_NAMES) {
      for (const isDark of [false, true]) {
        const tokens = resolveTokens(name, isDark, null)
        expect(Object.keys(tokens).sort()).toEqual(referenceKeys)
        for (const [key, value] of Object.entries(tokens)) {
          expect(value, `${name}/${isDark ? 'dark' : 'light'}/${key}`).toBeTruthy()
        }
      }
    }
  })

  it('dark and light differ for every style', () => {
    for (const name of STYLE_NAMES) {
      expect(resolveTokens(name, true, null).bg).not.toBe(resolveTokens(name, false, null).bg)
    }
  })

  it('PRESETS has an entry for every style name', () => {
    expect(Object.keys(PRESETS).sort()).toEqual([...STYLE_NAMES].sort())
  })
})

describe('classic stays backward compatible', () => {
  it('keeps the original palette and shape', () => {
    const light = resolveTokens('classic', false, null)
    expect(light.bg).toBe('#ffffff')
    expect(light.text).toBe('#1e293b')
    expect(light.accent).toBe('#2563eb')
    expect(light.onAccent).toBe('#ffffff')
    expect(light.radius).toBe('16px')

    const dark = resolveTokens('classic', true, null)
    expect(dark.bg).toBe('#1e1e2e')
    expect(dark.accent).toBe('#2563eb')
  })
})

describe('accent handling', () => {
  it('an explicit accent overrides the style default in both modes', () => {
    for (const name of STYLE_NAMES) {
      expect(resolveTokens(name, false, '#ff0066').accent).toBe('#ff0066')
      expect(resolveTokens(name, true, '#ff0066').accent).toBe('#ff0066')
    }
  })

  it('picks readable text for the accent', () => {
    expect(contrastTextFor('#2563eb')).toBe('#ffffff')
    expect(contrastTextFor('#111111')).toBe('#ffffff')
    expect(contrastTextFor('#facc15')).toBe('#111111')
    expect(contrastTextFor('#fff')).toBe('#111111')
    // not parseable → keep the historical white
    expect(contrastTextFor('rebeccapurple')).toBe('#ffffff')
  })

  it('builds a translucent focus ring from the accent', () => {
    expect(focusRingFor('#2563eb')).toBe('#2563eb22')
    expect(focusRingFor('#abc')).toBe('#aabbcc22')
    expect(focusRingFor('tomato')).toContain('tomato')
  })
})

describe('sanitizeAccent', () => {
  it('keeps plain CSS colours', () => {
    for (const ok of ['#2563eb', '#abc', '#11223344', 'tomato', 'rgb(1, 2, 3)', 'hsl(210 80% 50% / 0.5)', 'oklch(0.7 0.1 200)']) {
      expect(sanitizeAccent(ok), ok).toBe(ok)
    }
  })

  it('rejects anything that could escape the stylesheet', () => {
    for (const bad of [
      '', null, undefined,
      'red; background: url(x)',
      '#fff}</style><img src=x onerror=alert(1)>',
      'url(javascript:alert(1))',
      'red"',
      'var(--x)',
      'a'.repeat(65),
    ]) {
      expect(sanitizeAccent(bad as string), String(bad)).toBeNull()
    }
  })

  it('an unsafe accent falls back to the style default instead of being emitted', () => {
    const tokens = resolveTokens('classic', false, '#fff}</style><script>')
    expect(tokens.accent).toBe('#2563eb')
    expect(tokensToCssVars(tokens)).not.toContain('</style>')
  })
})

describe('tokensToCssVars', () => {
  it('emits the original --lmu-* variable names', () => {
    const css = tokensToCssVars(resolveTokens('classic', false, null))
    for (const name of [
      '--lmu-bg', '--lmu-text', '--lmu-subtext', '--lmu-input-bg', '--lmu-input-border',
      '--lmu-error-bg', '--lmu-error-color', '--lmu-error-border', '--lmu-hover-bg',
      '--lmu-role-bg', '--lmu-dropdown-item-hover-bg', '--lmu-accent', '--lmu-on-accent',
    ]) {
      expect(css).toContain(`${name}:`)
    }
  })
})
