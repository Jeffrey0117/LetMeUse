/**
 * "How it compares" section wording, both languages.
 *
 * Every cell is a qualitative fact about how the product is used, checked
 * against each vendor's public material in 2026-11. No prices: they change
 * and third-party figures disagree. Re-check before editing a row.
 */

import type { Locale } from '@/lib/i18n'

export interface CompareRow {
  name: string
  /** One value per column, in column order. */
  values: readonly [string, string, string, string]
  ours?: boolean
}

export interface CompareCopy {
  title: string
  intro: string
  columns: readonly [string, string, string, string]
  rows: readonly CompareRow[]
  points: readonly { title: string; body: string }[]
  note: string
}

const zh: CompareCopy = {
  title: '跟其他選擇比',
  intro: '做會員登入的工具很多。差別在接上去要花多少工、畫面誰來做、東西放在誰那裡。',
  columns: ['怎麼接', '登入畫面', '放在哪', '費用'],
  rows: [
    { name: 'LetMeUse', ours: true, values: ['貼一行 script，純 HTML 也行', '做好了，七種樣式可選', '自己的機器', '不按人數收費'] },
    { name: 'Clerk', values: ['裝 SDK，接它的元件', '做好了，可調外觀', '它的雲端', '有免費額度，超過按人數'] },
    { name: 'Auth0', values: ['裝 SDK，跳到它的登入頁', '它的登入頁，可調外觀', '它的雲端', '有免費額度，超過按人數'] },
    { name: 'Firebase Auth', values: ['裝 SDK', '自己做，或另裝 FirebaseUI', 'Google 的雲端', '有免費額度，超過按人數'] },
    { name: 'Supabase Auth', values: ['裝 SDK', '自己做', '它的雲端，或自己架整套', '雲端版有免費額度，超過按人數'] },
    { name: 'Better Auth', values: ['寫進自己的後端程式', '自己做', '自己的後端', '免費'] },
    { name: 'Keycloak', values: ['架一台伺服器，走 OIDC 跳轉', '它的登入頁，可換主題', '自己的機器', '免費'] },
  ],
  points: [
    { title: '不挑技術', body: '不用框架、不用打包。一個靜態 HTML 檔貼上 script 就有登入。' },
    { title: '畫面不用做', body: '登入、註冊、忘記密碼、個人資料都做好了，挑樣式、蓋品牌色就上線。' },
    { title: '多個站一套會員', body: '每個站一個 app，同一個後台管，會員在站與站之間免重新登入。' },
    { title: '會員越多不會越貴', body: '跑在自己的機器上，資料在自己手上，沒有按人數的帳單。' },
  ],
  note: '各家資料為 2026 年 11 月查閱公開資訊的整理，細節以各家官網為準。',
}

const en: CompareCopy = {
  title: 'How it compares',
  intro: 'There are many ways to add sign-in. They differ in how much work it takes to connect, who builds the screens, and where everything lives.',
  columns: ['How you connect', 'Sign-in screens', 'Where it runs', 'Cost'],
  rows: [
    { name: 'LetMeUse', ours: true, values: ['One script tag, plain HTML is enough', 'Built, seven styles to choose from', 'Your own machine', 'No per-user fee'] },
    { name: 'Clerk', values: ['Install an SDK, use its components', 'Built, appearance adjustable', 'Its cloud', 'Free tier, then per user'] },
    { name: 'Auth0', values: ['Install an SDK, redirect to its login page', 'Its login page, appearance adjustable', 'Its cloud', 'Free tier, then per user'] },
    { name: 'Firebase Auth', values: ['Install an SDK', 'Build your own, or add FirebaseUI', "Google's cloud", 'Free tier, then per user'] },
    { name: 'Supabase Auth', values: ['Install an SDK', 'Build your own', 'Its cloud, or self-host the whole stack', 'Cloud: free tier, then per user'] },
    { name: 'Better Auth', values: ['Code it into your own backend', 'Build your own', 'Your own backend', 'Free'] },
    { name: 'Keycloak', values: ['Run a server, redirect over OIDC', 'Its login page, themeable', 'Your own machine', 'Free'] },
  ],
  points: [
    { title: 'Any stack', body: 'No framework and no build step. A static HTML file with the script tag has sign-in.' },
    { title: 'No screens to build', body: 'Sign in, sign up, password reset and profile are done. Pick a style, set your colour, ship.' },
    { title: 'One member base, many sites', body: 'Each site is an app in the same admin, and members move between sites without signing in again.' },
    { title: 'Growth does not raise the bill', body: 'It runs on your own machine, the data stays with you, and there is no per-user invoice.' },
  ],
  note: 'Based on public information reviewed in November 2026. Check each vendor for current details.',
}

const COPY: Readonly<Record<Locale, CompareCopy>> = { zh, en }

export function getCompareCopy(locale: Locale): CompareCopy {
  return COPY[locale]
}
