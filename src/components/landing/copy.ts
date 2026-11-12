/**
 * All landing-page wording, both languages, in one place.
 * Edit the words here — the page components only do layout.
 */

import type { Locale } from '@/lib/i18n'

export interface LandingCopy {
  nav: { styles: string; features: string; admin: string; switchTo: string }
  hero: { title: string; sub: string; primary: string; secondary: string; copy: string; copied: string }
  preview: { light: string; dark: string; caption: string }
  steps: { title: string; items: readonly { title: string; body: string }[] }
  features: { title: string; items: readonly { title: string; body: string }[] }
  styles: { title: string; body: string; cta: string }
  admin: { title: string; body: string; items: readonly string[]; cta: string }
  footer: { styles: string; admin: string }
  codeComment: string
}

const zh: LandingCopy = {
  nav: { styles: '樣式', features: '功能', admin: '後台', switchTo: 'English' },
  hero: {
    title: '一行 script，網站就有會員登入',
    sub: '登入、註冊、忘記密碼、Google 與 GitHub 登入、個人資料，全部包在一個彈窗裡。貼上就能用。',
    primary: '挑樣式',
    secondary: '進後台',
    copy: '複製',
    copied: '已複製',
  },
  preview: { light: '淺色', dark: '深色', caption: '這是實際的登入視窗，點上面換樣式' },
  steps: {
    title: '三步接上',
    items: [
      { title: '建一個 app', body: '在後台新增 app，填上網域，拿到 app ID。' },
      { title: '貼上 script', body: '放進頁面的 head，選一個樣式和品牌色。' },
      { title: '叫出登入', body: '呼叫 letmeuse.login()，用 onAuthChange 拿到會員。' },
    ],
  },
  features: {
    title: '內建的東西',
    items: [
      { title: '帳號密碼', body: '註冊、登入、驗證信、忘記密碼、記住帳號。' },
      { title: '第三方登入', body: 'Google 與 GitHub，每個 app 各自設定。' },
      { title: '跨站通用', body: '同一個人在你的多個站之間免重新登入。' },
      { title: '個人資料元件', body: '頭像按鈕、下拉選單、資料卡、改名改密碼換頭像。' },
      { title: '後端驗證', body: 'ES256 簽章的 JWT，公鑰走 JWKS，你的後端不必保管密鑰。' },
      { title: 'Webhook', body: '註冊、登入、改資料、停用等 8 種事件，帶 HMAC 簽章，失敗自動重送。' },
      { title: '角色與權限', body: '自訂角色，權限直接寫進 token。' },
      { title: '中英雙語', body: '登入視窗與後台都有中文和英文。' },
    ],
  },
  styles: {
    title: '七種樣式，深淺色都有',
    body: '從細線極簡到粗框硬陰影，挑一個跟網站搭的，再蓋上你的品牌色。',
    cta: '看全部樣式',
  },
  admin: {
    title: '管理後台',
    body: '所有站的會員，一個地方管。',
    items: ['會員：搜尋、停用、改角色', 'App：金鑰、網域、第三方登入設定', '登入中的裝置', '角色與權限', '稽核紀錄', 'Webhook 紀錄與重送'],
    cta: '進後台',
  },
  footer: { styles: '樣式', admin: '後台' },
  codeComment: '打自己的後端時帶上 token',
}

const en: LandingCopy = {
  nav: { styles: 'Styles', features: 'Features', admin: 'Admin', switchTo: '中文' },
  hero: {
    title: 'One script tag. Your site has sign-in.',
    sub: 'Sign in, sign up, password reset, Google and GitHub login, and profile editing, all in one modal. Paste it and it works.',
    primary: 'Pick a style',
    secondary: 'Open admin',
    copy: 'Copy',
    copied: 'Copied',
  },
  preview: { light: 'Light', dark: 'Dark', caption: 'This is the real sign-in modal. Switch styles above.' },
  steps: {
    title: 'Three steps',
    items: [
      { title: 'Create an app', body: 'Add an app in the admin, set its domain, and get an app ID.' },
      { title: 'Paste the script', body: 'Put it in the page head. Choose a style and a brand colour.' },
      { title: 'Open sign-in', body: 'Call letmeuse.login() and read the member from onAuthChange.' },
    ],
  },
  features: {
    title: 'What is included',
    items: [
      { title: 'Email and password', body: 'Sign up, sign in, verification email, password reset, remember me.' },
      { title: 'Social login', body: 'Google and GitHub, configured per app.' },
      { title: 'Single sign-on', body: 'One person moves between your sites without signing in again.' },
      { title: 'Profile widgets', body: 'Avatar button, dropdown, profile card, and name, password and avatar editing.' },
      { title: 'Backend verification', body: 'ES256-signed JWTs with public keys on JWKS, so your backend holds no secret.' },
      { title: 'Webhooks', body: '8 events such as sign-up, sign-in and profile change, HMAC-signed, retried on failure.' },
      { title: 'Roles and permissions', body: 'Define your own roles. Permissions travel inside the token.' },
      { title: 'English and Chinese', body: 'Both the sign-in modal and the admin come in two languages.' },
    ],
  },
  styles: {
    title: 'Seven styles, each in light and dark',
    body: 'From hairline minimal to thick-bordered brutal. Pick the one that fits, then apply your brand colour.',
    cta: 'See all styles',
  },
  admin: {
    title: 'Admin',
    body: 'Members of every site, managed in one place.',
    items: ['Members: search, disable, change role', 'Apps: keys, domains, social login setup', 'Active sessions', 'Roles and permissions', 'Audit log', 'Webhook log and retry'],
    cta: 'Open admin',
  },
  footer: { styles: 'Styles', admin: 'Admin' },
  codeComment: 'send the token to your own backend',
}

const COPY: Readonly<Record<Locale, LandingCopy>> = { zh, en }

export function getLandingCopy(locale: Locale): LandingCopy {
  return COPY[locale]
}

export const PREVIEW_STYLES = ['classic', 'minimal', 'soft', 'glass', 'brutal', 'terminal', 'paper'] as const
export type PreviewStyle = (typeof PREVIEW_STYLES)[number]

export function buildScriptSnippet(origin: string, style: PreviewStyle, locale: Locale): string {
  const lines = [
    `<script src="${origin}/letmeuse.js"`,
    '        data-app-id="YOUR_APP_ID"',
    ...(style === 'classic' ? [] : [`        data-style="${style}"`]),
    '        data-theme="auto"',
    ...(locale === 'zh' ? ['        data-locale="zh"'] : []),
  ]
  return `${lines.join('\n')}></script>`
}

export function buildUsageSnippet(comment: string): string {
  return [
    'letmeuse.onAuthChange((user) => {',
    '  if (user) showDashboard(user)',
    '})',
    '',
    'loginButton.onclick = () => letmeuse.login()',
    '',
    `// ${comment}`,
    "fetch('/api/me', {",
    '  headers: { Authorization: `Bearer ${letmeuse.getToken()}` },',
    '})',
  ].join('\n')
}
