'use client'

import { usePathname } from 'next/navigation'
import { Navbar } from './navbar'

/** The landing page brings its own header and full-width layout; every other page keeps the app shell. */
export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  if (pathname === '/') return <>{children}</>

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-zinc-50 px-12 lg:px-32">{children}</main>
    </>
  )
}
