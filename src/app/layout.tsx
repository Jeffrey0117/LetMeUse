import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Navbar } from '@/components/layout/navbar'
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
  title: 'LetMeUse',
  description: 'Embeddable SaaS infrastructure platform',
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
          <Navbar />
          <main className="min-h-screen bg-zinc-50 px-12 lg:px-32">{children}</main>
        </LangProvider>
      </body>
    </html>
  )
}
