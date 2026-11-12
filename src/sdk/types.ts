/**
 * Shared types for the LetMeUse SDK
 */

export interface LetMeUseUser {
  id: string
  email: string
  displayName: string
  avatar?: string
  role: string
  appId: string
  emailVerified?: boolean
}

export type AuthEvent = 'init' | 'login' | 'logout' | 'refresh_failed'

export type AuthCallback = (user: LetMeUseUser | null, event?: AuthEvent) => void

/** Fired after every SUCCESSFUL silent token refresh, with the new access token. */
export type TokenRefreshCallback = (accessToken: string) => void

export type Locale = 'en' | 'zh'

export type ThemeMode = 'light' | 'dark' | 'auto'

export type SdkMode = 'modal' | 'redirect'

/** Named visual preset, chosen with `data-style`. */
export type StyleName = 'classic' | 'minimal' | 'soft' | 'glass' | 'brutal' | 'terminal' | 'paper'

/** Palette — differs between light and dark. */
export interface ThemeColors {
  /** The style's own accent; `data-accent` overrides it. */
  accent: string
  /** Link colour when it must differ from the accent (e.g. a pale accent on a pale card). */
  link?: string
  bg: string
  text: string
  subtext: string
  inputBg: string
  inputBorder: string
  errorBg: string
  errorColor: string
  errorBorder: string
  successBg: string
  successColor: string
  successBorder: string
  hoverBg: string
  roleBg: string
  dropdownItemHoverBg: string
}

/** Shape — radius, type, borders, shadows. Usually shared by light and dark. */
export interface ThemeShape {
  radius: string
  radiusCtl: string
  btnRadius: string
  font: string
  titleFont: string
  titleWeight: string
  titleAlign: string
  titlePad: string
  titleTransform: string
  titleSpacing: string
  labelTransform: string
  shadow: string
  cardBorder: string
  ctlBorderW: string
  btnBorder: string
  btnShadow: string
  backdrop: string
  backdropFilter: string
  cardFilter: string
}

export interface StylePreset {
  shape: Partial<ThemeShape>
  light: ThemeColors & Partial<ThemeShape>
  dark: ThemeColors & Partial<ThemeShape>
}

/** Fully resolved tokens; each key becomes a `--lmu-<kebab-key>` CSS variable. */
export interface ThemeTokens extends ThemeColors, ThemeShape {
  /** Readable text colour on top of `accent`. */
  onAccent: string
  /** Text-link colour. */
  link: string
  /** Translucent accent used for focus rings. */
  ring: string
}

/** SDK configuration parsed from script tag attributes */
export interface SdkConfig {
  appId: string
  themeSetting: ThemeMode
  style: StyleName
  accent: string
  locale: Locale
  mode: SdkMode
  baseUrl: string
}
