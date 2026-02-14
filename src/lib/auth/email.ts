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
    // Development: log to console
    console.log(`\n========== EMAIL ==========`)
    console.log(`To: ${options.to}`)
    console.log(`Subject: ${options.subject}`)
    console.log(`Body:\n${options.html}`)
    console.log(`===========================\n`)
  }
}

export async function sendVerificationEmail(
  email: string,
  token: string,
  appName: string
): Promise<void> {
  const verifyUrl = `${BASE_URL}/api/auth/verify-email?token=${token}`

  await sendEmail({
    to: email,
    subject: `Verify your email - ${appName}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
        <h2 style="color: #18181b; margin: 0 0 16px 0;">Verify your email</h2>
        <p style="color: #52525b; font-size: 15px; line-height: 1.6; margin: 0 0 24px 0;">
          Click the button below to verify your email address for <strong>${appName}</strong>.
        </p>
        <a href="${verifyUrl}" style="display: inline-block; background: #18181b; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600;">
          Verify Email
        </a>
        <p style="color: #a1a1aa; font-size: 13px; margin: 24px 0 0 0;">
          If you didn't create an account, you can ignore this email.
        </p>
        <p style="color: #d4d4d8; font-size: 12px; margin: 16px 0 0 0;">
          Or copy this link: ${verifyUrl}
        </p>
      </div>
    `,
  })
}

export async function sendPasswordResetEmail(
  email: string,
  token: string,
  appName: string
): Promise<void> {
  const resetUrl = `${BASE_URL}/reset-password?token=${token}`

  await sendEmail({
    to: email,
    subject: `Reset your password - ${appName}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
        <h2 style="color: #18181b; margin: 0 0 16px 0;">Reset your password</h2>
        <p style="color: #52525b; font-size: 15px; line-height: 1.6; margin: 0 0 24px 0;">
          You requested a password reset for your <strong>${appName}</strong> account.
          Click the button below to set a new password.
        </p>
        <a href="${resetUrl}" style="display: inline-block; background: #18181b; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600;">
          Reset Password
        </a>
        <p style="color: #a1a1aa; font-size: 13px; margin: 24px 0 0 0;">
          This link expires in 1 hour. If you didn't request this, you can ignore this email.
        </p>
        <p style="color: #d4d4d8; font-size: 12px; margin: 16px 0 0 0;">
          Or copy this link: ${resetUrl}
        </p>
      </div>
    `,
  })
}
