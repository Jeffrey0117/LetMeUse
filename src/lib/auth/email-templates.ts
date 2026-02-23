import type { Locale } from '@/lib/i18n'

interface VerificationEmailParams {
  readonly verifyUrl: string
  readonly appName: string
  readonly locale: Locale
}

interface PasswordResetEmailParams {
  readonly resetUrl: string
  readonly appName: string
  readonly locale: Locale
}

interface EmailTemplate {
  readonly subject: string
  readonly html: string
}

const WRAPPER_STYLE =
  'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;'

const HEADING_STYLE = 'color: #18181b; margin: 0 0 16px 0; font-size: 22px; font-weight: 700;'

const BODY_STYLE = 'color: #52525b; font-size: 15px; line-height: 1.6; margin: 0 0 24px 0;'

const BUTTON_STYLE =
  'display: inline-block; background: #18181b; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600;'

const MUTED_STYLE = 'color: #a1a1aa; font-size: 13px; margin: 24px 0 0 0;'

const LINK_STYLE = 'color: #d4d4d8; font-size: 12px; margin: 16px 0 0 0; word-break: break-all;'

const verificationCopy = {
  en: {
    subject: (appName: string) => `Verify your email - ${appName}`,
    heading: 'Verify your email',
    body: (appName: string) =>
      `Click the button below to verify your email address for <strong>${appName}</strong>.`,
    button: 'Verify Email',
    footer: "If you didn't create an account, you can ignore this email.",
    linkPrefix: 'Or copy this link:',
  },
  zh: {
    subject: (appName: string) => `驗證您的信箱 - ${appName}`,
    heading: '驗證您的信箱',
    body: (appName: string) =>
      `請點擊下方按鈕驗證您在 <strong>${appName}</strong> 的電子信箱。`,
    button: '驗證信箱',
    footer: '如果您未建立帳號，可以忽略此封信件。',
    linkPrefix: '或複製此連結：',
  },
} as const

const passwordResetCopy = {
  en: {
    subject: (appName: string) => `Reset your password - ${appName}`,
    heading: 'Reset your password',
    body: (appName: string) =>
      `You requested a password reset for your <strong>${appName}</strong> account. Click the button below to set a new password.`,
    button: 'Reset Password',
    footer:
      "This link expires in 1 hour. If you didn't request this, you can ignore this email.",
    linkPrefix: 'Or copy this link:',
  },
  zh: {
    subject: (appName: string) => `重設您的密碼 - ${appName}`,
    heading: '重設您的密碼',
    body: (appName: string) =>
      `您已請求重設 <strong>${appName}</strong> 帳號的密碼。請點擊下方按鈕設定新密碼。`,
    button: '重設密碼',
    footer: '此連結將在 1 小時後失效。如果您未提出此請求，可以忽略此封信件。',
    linkPrefix: '或複製此連結：',
  },
} as const

function buildEmailHtml(params: {
  readonly heading: string
  readonly body: string
  readonly buttonText: string
  readonly buttonUrl: string
  readonly footer: string
  readonly linkPrefix: string
}): string {
  return `<div style="${WRAPPER_STYLE}">
  <h2 style="${HEADING_STYLE}">${params.heading}</h2>
  <p style="${BODY_STYLE}">${params.body}</p>
  <a href="${params.buttonUrl}" style="${BUTTON_STYLE}">${params.buttonText}</a>
  <p style="${MUTED_STYLE}">${params.footer}</p>
  <p style="${LINK_STYLE}">${params.linkPrefix} ${params.buttonUrl}</p>
</div>`
}

export function verificationEmailTemplate(
  params: VerificationEmailParams
): EmailTemplate {
  const copy = verificationCopy[params.locale]

  return {
    subject: copy.subject(params.appName),
    html: buildEmailHtml({
      heading: copy.heading,
      body: copy.body(params.appName),
      buttonText: copy.button,
      buttonUrl: params.verifyUrl,
      footer: copy.footer,
      linkPrefix: copy.linkPrefix,
    }),
  }
}

export function passwordResetEmailTemplate(
  params: PasswordResetEmailParams
): EmailTemplate {
  const copy = passwordResetCopy[params.locale]

  return {
    subject: copy.subject(params.appName),
    html: buildEmailHtml({
      heading: copy.heading,
      body: copy.body(params.appName),
      buttonText: copy.button,
      buttonUrl: params.resetUrl,
      footer: copy.footer,
      linkPrefix: copy.linkPrefix,
    }),
  }
}
