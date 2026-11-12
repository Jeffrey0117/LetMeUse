'use client'

import { usePathname } from 'next/navigation'
import { AdminGate } from './admin-gate'
import { Navbar } from './navbar'
import { isAdminOnlyPath } from '@/lib/protected-paths'

const shellMain = 'min-h-screen bg-zinc-50 px-5 sm:px-12 lg:px-32'

/**
 * - `/`            landing page: own header, full width
 * - internal tools signed-in admin only, with the tool navigation
 * - `/admin`       guarded by its own layout
 * - anything else  public page (login, reset password…): logo + language only
 */
export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  if (pathname === '/') return <>{children}</>

  if (isAdminOnlyPath(pathname)) {
    return (
      <AdminGate>
        <Navbar />
        <main className={shellMain}>{children}</main>
      </AdminGate>
    )
  }

  const isAdminArea = pathname === '/admin' || pathname.startsWith('/admin/')

  return (
    <>
      <Navbar showNav={isAdminArea} />
      <main className={shellMain}>{children}</main>
    </>
  )
}
