import type { Locale } from '@/lib/i18n'
import { verificationEmailTemplate, passwordResetEmailTemplate } from '@/lib/auth/email-templates'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
const RESEND_API_KEY = process.env.RESEND_API_KEY ?? ''
const EMAIL_FROM = process.env.EMAIL_FROM ?? 'LetMeUse <noreply@letmeuse.dev>'

interface EmailOptions {
  to: string
  subject: string
  html: string
}

async function sendEmail(options: EmailOptions): Promise<void> {
  if (RESEND_API_KEY) {
    // Production: use Resend API
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: EMAIL_FROM,
        to: options.to,
        subject: options.subject,
        html: options.html,
      }),
    })

    if (!res.ok) {
      const data = await res.json()
      throw new Error(`Email send failed: ${JSON.stringify(data)}`)
    }
  } else {
    // Development: no-op (set RESEND_API_KEY to send real emails)
  }
}

export async function sendVerificationEmail(
  email: string,
  token: string,
  appName: string,
  locale: Locale = 'en'
): Promise<void> {
  const verifyUrl = `${BASE_URL}/api/auth/verify-email?token=${token}`

  const { subject, html } = verificationEmailTemplate({
    verifyUrl,
    appName,
    locale,
  })

  await sendEmail({ to: email, subject, html })
}

export async function sendPasswordResetEmail(
  email: string,
  token: string,
  appName: string,
  locale: Locale = 'en'
): Promise<void> {
  const resetUrl = `${BASE_URL}/reset-password?token=${token}`

  const { subject, html } = passwordResetEmailTemplate({
    resetUrl,
    appName,
    locale,
  })

  await sendEmail({ to: email, subject, html })
}
