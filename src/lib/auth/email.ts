import nodemailer from 'nodemailer'
import type { Locale } from '@/lib/i18n'
import { verificationEmailTemplate, passwordResetEmailTemplate } from '@/lib/auth/email-templates'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'

const SMTP_HOST = process.env.SMTP_HOST ?? ''
const SMTP_PORT = Number(process.env.SMTP_PORT ?? '587')
const SMTP_USER = process.env.SMTP_USER ?? ''
const SMTP_PASS = process.env.SMTP_PASS ?? ''
const SMTP_FROM = process.env.SMTP_FROM ?? 'LetMeUse <noreply@letmeuse.dev>'
// LetMeUse is shared auth infra — the email should look like it comes from the
// product the user actually signed up for (Pipee, Quickky…), not "LetMeUse".
// Keep the configured sending ADDRESS (deliverability/SPF) but swap the display
// NAME to the app's name when we know it.
const FROM_ADDRESS = SMTP_FROM.match(/<([^>]+)>/)?.[1] ?? SMTP_FROM

function buildFrom(fromName?: string): string {
  if (!fromName) return SMTP_FROM
  const safe = fromName.replace(/[<>"\r\n]/g, '').trim()
  return safe ? `${safe} <${FROM_ADDRESS}>` : SMTP_FROM
}

interface EmailOptions {
  readonly to: string
  readonly subject: string
  readonly html: string
  readonly fromName?: string
}

function isSmtpConfigured(): boolean {
  return Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS)
}

function createTransport(): nodemailer.Transporter {
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  })
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  if (isSmtpConfigured()) {
    const transporter = createTransport()
    await transporter.sendMail({
      from: buildFrom(options.fromName),
      to: options.to,
      subject: options.subject,
      html: options.html,
    })
  } else {
    // SMTP 沒設: 正式環境 = 硬錯 (不能把 reset/verify token 寫進 log 任人撿走);
    // dev 才允許 fallback, 且仍不印 HTML 本體 (內含 token 連結)
    if (process.env.NODE_ENV === 'production') {
      throw new Error('[email] SMTP not configured — refusing to send (would leak token to logs)')
    }
    console.info('[email] SMTP not configured (dev) — email NOT sent')
    console.info(`  To:      ${options.to}`)
    console.info(`  Subject: ${options.subject}`)
    console.info('  (HTML body withheld — contains a one-time token; configure SMTP to actually send)')
  }
}

export async function sendVerificationEmail(
  email: string,
  token: string,
  appName: string,
  locale: Locale = 'en',
  displayName?: string,
  // The app's own production origin (e.g. https://pipee.tw). When given, the
  // verify link lives on the app's domain (CloudPipe proxies /__lmu/* back to
  // this verify API), so the user never sees a letmeuse URL. Falls back to the
  // LetMeUse domain when the app has no https origin.
  appBaseUrl?: string
): Promise<void> {
  const base = appBaseUrl
    ? `${appBaseUrl.replace(/\/$/, '')}/__lmu/verify-email`
    : `${BASE_URL}/api/auth/verify-email`
  const verifyUrl = `${base}?token=${token}`

  const { subject, html } = verificationEmailTemplate({
    verifyUrl,
    appName,
    displayName,
    locale,
  })

  await sendEmail({ to: email, subject, html, fromName: appName })
}

export async function sendPasswordResetEmail(
  email: string,
  token: string,
  appName: string,
  locale: Locale = 'en',
  displayName?: string
): Promise<void> {
  const resetUrl = `${BASE_URL}/reset-password?token=${token}`

  const { subject, html } = passwordResetEmailTemplate({
    resetUrl,
    appName,
    displayName,
    locale,
  })

  await sendEmail({ to: email, subject, html, fromName: appName })
}
