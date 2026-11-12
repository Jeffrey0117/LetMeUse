/**
 * Visual style presets for the SDK UI.
 *
 * A style = shape (radius, font, borders, shadows) + a light and a dark palette.
 * Integrators pick one with `data-style="..."`; `data-theme` still chooses
 * light / dark / auto, and `data-accent` still overrides the style's own accent.
 *
 * `classic` reproduces the pre-preset look exactly — it is the default, so
 * sites that never set `data-style` do not change.
 */

import type { StyleName, StylePreset, ThemeShape } from './types'

export const STYLE_NAMES: readonly StyleName[] = [
  'classic',
  'minimal',
  'soft',
  'glass',
  'brutal',
  'terminal',
  'paper',
]

const SYSTEM_FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"

export const BASE_SHAPE: ThemeShape = {
  radius: '16px',
  radiusCtl: '10px',
  btnRadius: '10px',
  font: SYSTEM_FONT,
  titleFont: 'inherit',
  titleWeight: '700',
  titleAlign: 'center',
  titlePad: '0',
  titleTransform: 'none',
  titleSpacing: '-0.3px',
  labelTransform: 'none',
  shadow: '0 24px 64px rgba(0,0,0,0.35)',
  cardBorder: '0 solid transparent',
  ctlBorderW: '1.5px',
  btnBorder: '0 solid transparent',
  btnShadow: 'none',
  backdrop: 'rgba(0,0,0,0.5)',
  backdropFilter: 'none',
  cardFilter: 'none',
}

const LIGHT_STATUS = {
  errorBg: '#fef2f2',
  errorColor: '#dc2626',
  errorBorder: '#fecaca',
  successBg: '#ecfdf5',
  successColor: '#059669',
  successBorder: '#a7f3d0',
}

const DARK_STATUS = {
  errorBg: '#3b1c1c',
  errorColor: '#f87171',
  errorBorder: '#5c2828',
  successBg: '#12301f',
  successColor: '#4ade80',
  successBorder: '#1f5136',
}

export const PRESETS: Readonly<Record<StyleName, StylePreset>> = {
  // The original look. Do not restyle — existing sites depend on it.
  classic: {
    shape: {},
    light: {
      ...LIGHT_STATUS,
      accent: '#2563eb',
      bg: '#ffffff',
      text: '#1e293b',
      subtext: '#64748b',
      inputBg: '#f8fafc',
      inputBorder: '#e2e8f0',
      hoverBg: '#f1f5f9',
      roleBg: '#f1f5f9',
      dropdownItemHoverBg: '#f8fafc',
    },
    dark: {
      ...DARK_STATUS,
      accent: '#2563eb',
      bg: '#1e1e2e',
      text: '#cdd6f4',
      subtext: '#a6adc8',
      inputBg: '#313244',
      inputBorder: '#45475a',
      hoverBg: '#3b3b50',
      roleBg: '#313244',
      dropdownItemHoverBg: '#313244',
    },
  },

  // Neutral, hairline borders, quiet. For product / SaaS / dashboard sites.
  minimal: {
    shape: {
      radius: '10px',
      radiusCtl: '6px',
      btnRadius: '6px',
      titleWeight: '600',
      titleAlign: 'left',
      titlePad: '0 28px 0 0',
      shadow: '0 8px 30px rgba(0,0,0,0.12)',
      cardBorder: '1px solid var(--lmu-input-border)',
      ctlBorderW: '1px',
      backdrop: 'rgba(0,0,0,0.35)',
    },
    light: {
      ...LIGHT_STATUS,
      accent: '#18181b',
      bg: '#ffffff',
      text: '#18181b',
      subtext: '#71717a',
      inputBg: '#ffffff',
      inputBorder: '#e4e4e7',
      hoverBg: '#f4f4f5',
      roleBg: '#f4f4f5',
      dropdownItemHoverBg: '#f4f4f5',
    },
    dark: {
      ...DARK_STATUS,
      accent: '#fafafa',
      bg: '#18181b',
      text: '#fafafa',
      subtext: '#a1a1aa',
      inputBg: '#18181b',
      inputBorder: '#3f3f46',
      hoverBg: '#27272a',
      roleBg: '#27272a',
      dropdownItemHoverBg: '#27272a',
    },
  },

  // Rounded, pastel, friendly. For consumer / lifestyle / community sites.
  soft: {
    shape: {
      radius: '28px',
      radiusCtl: '14px',
      btnRadius: '999px',
      font: `ui-rounded, 'SF Pro Rounded', 'Nunito', ${SYSTEM_FONT}`,
      shadow: '0 30px 80px -20px rgba(80,60,120,0.45)',
      backdrop: 'rgba(40,30,60,0.35)',
      backdropFilter: 'blur(6px)',
    },
    light: {
      ...LIGHT_STATUS,
      accent: '#8b5cf6',
      bg: '#fffdfa',
      text: '#3b3247',
      subtext: '#8a8194',
      inputBg: '#f6f2fb',
      inputBorder: '#e9e2f3',
      hoverBg: '#efe8f8',
      roleBg: '#f6f2fb',
      dropdownItemHoverBg: '#f6f2fb',
    },
    dark: {
      ...DARK_STATUS,
      accent: '#a78bfa',
      bg: '#2a2433',
      text: '#f1ebfa',
      subtext: '#b3a8c4',
      inputBg: '#362e42',
      inputBorder: '#4a4059',
      hoverBg: '#413750',
      roleBg: '#362e42',
      dropdownItemHoverBg: '#362e42',
    },
  },

  // Frosted translucent card over the page. For media / image-heavy sites.
  glass: {
    shape: {
      radius: '20px',
      radiusCtl: '12px',
      btnRadius: '12px',
      ctlBorderW: '1px',
      shadow: '0 20px 60px rgba(0,0,0,0.3)',
      backdrop: 'rgba(0,0,0,0.25)',
      backdropFilter: 'blur(4px)',
      cardFilter: 'blur(24px) saturate(160%)',
    },
    light: {
      ...LIGHT_STATUS,
      accent: '#2563eb',
      cardBorder: '1px solid rgba(255,255,255,0.55)',
      bg: 'rgba(255,255,255,0.74)',
      text: '#0f172a',
      subtext: '#475569',
      inputBg: 'rgba(255,255,255,0.62)',
      inputBorder: 'rgba(15,23,42,0.14)',
      hoverBg: 'rgba(255,255,255,0.9)',
      roleBg: 'rgba(15,23,42,0.07)',
      dropdownItemHoverBg: 'rgba(15,23,42,0.06)',
    },
    dark: {
      ...DARK_STATUS,
      accent: '#60a5fa',
      cardBorder: '1px solid rgba(255,255,255,0.14)',
      bg: 'rgba(22,24,34,0.66)',
      text: '#f1f5f9',
      subtext: '#b6c0d0',
      inputBg: 'rgba(255,255,255,0.08)',
      inputBorder: 'rgba(255,255,255,0.16)',
      hoverBg: 'rgba(255,255,255,0.14)',
      roleBg: 'rgba(255,255,255,0.1)',
      dropdownItemHoverBg: 'rgba(255,255,255,0.1)',
    },
  },

  // Neo-brutalism: hard edges, thick outlines, offset shadows. For bold / indie sites.
  brutal: {
    shape: {
      radius: '0px',
      radiusCtl: '0px',
      btnRadius: '0px',
      titleWeight: '900',
      titleAlign: 'left',
      titlePad: '0 28px 0 0',
      titleTransform: 'uppercase',
      titleSpacing: '0.5px',
      labelTransform: 'uppercase',
      shadow: '8px 8px 0 var(--lmu-text)',
      cardBorder: '3px solid var(--lmu-text)',
      ctlBorderW: '2px',
      btnBorder: '2px solid var(--lmu-text)',
      btnShadow: '4px 4px 0 var(--lmu-text)',
      backdrop: 'rgba(0,0,0,0.6)',
    },
    light: {
      ...LIGHT_STATUS,
      accent: '#facc15',
      link: '#111111',
      bg: '#ffffff',
      text: '#111111',
      subtext: '#444444',
      inputBg: '#ffffff',
      inputBorder: '#111111',
      hoverBg: '#fef08a',
      roleBg: '#fef08a',
      dropdownItemHoverBg: '#fef08a',
    },
    dark: {
      ...DARK_STATUS,
      accent: '#facc15',
      bg: '#111111',
      text: '#ffffff',
      subtext: '#c9c9c9',
      inputBg: '#111111',
      inputBorder: '#ffffff',
      hoverBg: '#333333',
      roleBg: '#333333',
      dropdownItemHoverBg: '#333333',
    },
  },

  // Monospace, tight corners. For developer tools / CLIs / technical sites.
  terminal: {
    shape: {
      radius: '6px',
      radiusCtl: '3px',
      btnRadius: '3px',
      font: "ui-monospace, 'SF Mono', 'Cascadia Code', Menlo, Consolas, monospace",
      titleWeight: '600',
      titleAlign: 'left',
      titlePad: '0 28px 0 0',
      titleSpacing: '0',
      shadow: '0 20px 60px rgba(0,0,0,0.5)',
      cardBorder: '1px solid var(--lmu-input-border)',
      ctlBorderW: '1px',
      backdrop: 'rgba(0,0,0,0.6)',
    },
    light: {
      ...LIGHT_STATUS,
      accent: '#1f8f52',
      bg: '#f7f8f5',
      text: '#1c2b21',
      subtext: '#5d6f63',
      inputBg: '#ffffff',
      inputBorder: '#cfd8d0',
      hoverBg: '#ebefe9',
      roleBg: '#ebefe9',
      dropdownItemHoverBg: '#ebefe9',
    },
    dark: {
      ...DARK_STATUS,
      accent: '#3ddc84',
      bg: '#0c0f0d',
      text: '#d7e2d9',
      subtext: '#7d9484',
      inputBg: '#121714',
      inputBorder: '#26332b',
      hoverBg: '#1a211c',
      roleBg: '#1a211c',
      dropdownItemHoverBg: '#1a211c',
    },
  },

  // Warm paper, serif title. For blogs / editorial / course sites.
  paper: {
    shape: {
      radius: '6px',
      radiusCtl: '4px',
      btnRadius: '4px',
      titleFont: "Georgia, 'Noto Serif TC', 'Songti TC', 'PMingLiU', serif",
      titleWeight: '600',
      titleSpacing: '0',
      shadow: '0 12px 40px rgba(60,40,10,0.22)',
      cardBorder: '1px solid var(--lmu-input-border)',
      ctlBorderW: '1px',
      backdrop: 'rgba(40,30,15,0.45)',
    },
    light: {
      ...LIGHT_STATUS,
      accent: '#9a3412',
      bg: '#fbf7ee',
      text: '#2b2620',
      subtext: '#7a6f60',
      inputBg: '#fffdf7',
      inputBorder: '#e0d6c2',
      hoverBg: '#f1eadb',
      roleBg: '#f1eadb',
      dropdownItemHoverBg: '#f1eadb',
    },
    dark: {
      ...DARK_STATUS,
      accent: '#e08a52',
      bg: '#24201a',
      text: '#ece4d4',
      subtext: '#a89c88',
      inputBg: '#2e2921',
      inputBorder: '#4a4234',
      hoverBg: '#38322a',
      roleBg: '#38322a',
      dropdownItemHoverBg: '#38322a',
    },
  },
}
