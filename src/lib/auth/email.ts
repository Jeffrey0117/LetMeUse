import nodemailer from 'nodemailer'
import type { Locale } from '@/lib/i18n'
import { verificationEmailTemplate, passwordResetEmailTemplate } from '@/lib/auth/email-templates'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'

const SMTP_HOST = process.env.SMTP_HOST ?? ''
const SMTP_PORT = Number(process.env.SMTP_PORT ?? '587')
const SMTP_USER = process.env.SMTP_USER ?? ''
const SMTP_PASS = process.env.SMTP_PASS ?? ''
const SMTP_FROM = process.env.SMTP_FROM ?? 'LetMeUse <noreply@letmeuse.dev>'

interface EmailOptions {
  readonly to: string
  readonly subject: string
  readonly html: string
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
      from: SMTP_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
    })
  } else {
    // Dev mode fallback: log email to console
    console.info('[email] SMTP not configured — logging email to console')
    console.info(`  To:      ${options.to}`)
    console.info(`  Subject: ${options.subject}`)
    console.info(`  HTML:\n${options.html}`)
  }
}

export async function sendVerificationEmail(
  email: string,
  token: string,
  appName: string,
  locale: Locale = 'en',
  displayName?: string
): Promise<void> {
  const verifyUrl = `${BASE_URL}/api/auth/verify-email?token=${token}`

  const { subject, html } = verificationEmailTemplate({
    verifyUrl,
    appName,
    displayName,
    locale,
  })

  await sendEmail({ to: email, subject, html })
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

  await sendEmail({ to: email, subject, html })
}
