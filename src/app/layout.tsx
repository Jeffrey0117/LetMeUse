import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { SiteShell } from '@/components/layout/site-shell'
import { LangProvider } from '@/components/layout/lang-provider'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'LetMeUse — 一行 script 就有會員登入 | Drop-in sign-in for any site',
  description:
    '登入、註冊、忘記密碼、Google 與 GitHub 登入、個人資料，全部包在一個彈窗裡。Sign in, sign up, password reset, social login and profile editing in one embeddable modal.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LangProvider>
          <SiteShell>{children}</SiteShell>
        </LangProvider>
      </body>
    </html>
  )
}
