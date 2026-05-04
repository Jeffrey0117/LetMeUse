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

export type AuthCallback = (user: LetMeUseUser | null) => void

export type Locale = 'en' | 'zh'

export type ThemeMode = 'light' | 'dark' | 'auto'

export type SdkMode = 'modal' | 'redirect'

export interface ThemeColors {
  bg: string
  textColor: string
  subtextColor: string
  inputBg: string
  inputBorder: string
  errorBg: string
  errorColor: string
  errorBorder: string
  hoverBg: string
  roleBg: string
  dropdownItemHoverBg: string
}

/** SDK configuration parsed from script tag attributes */
export interface SdkConfig {
  appId: string
  themeSetting: ThemeMode
  accent: string
  locale: Locale
  mode: SdkMode
  baseUrl: string
}
