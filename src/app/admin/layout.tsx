'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useLang } from '@/components/layout/lang-provider'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { t } = useLang()
  const [authorized, setAuthorized] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('adman_admin_token')
    if (!token) {
      router.push('/login?redirect=/admin')
      return
    }

    fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user?.role === 'admin') {
          setAuthorized(true)
        } else {
          router.push('/login?redirect=/admin')
        }
      })
      .catch(() => {
        router.push('/login?redirect=/admin')
      })
      .finally(() => setChecking(false))
  }, [router])

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <p className="text-zinc-500">{t('common.loading')}</p>
      </div>
    )
  }

  if (!authorized) return null

  const navItems = [
    { href: '/admin', label: 'admin.nav.dashboard' as const },
    { href: '/admin/users', label: 'admin.nav.users' as const },
    { href: '/admin/apps', label: 'admin.nav.apps' as const },
  ]

  function isActive(href: string) {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="bg-white border-b border-zinc-200">
        <div className="mx-auto flex h-14 items-center px-12 lg:px-32">
          <Link href="/admin" className="text-lg font-bold tracking-tight text-zinc-900 mr-8">
            AdMan <span className="text-xs font-normal text-zinc-400 ml-1">Admin</span>
          </Link>

          <nav className="flex items-center gap-1 flex-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3 py-4 text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-zinc-900'
                    : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                {t(item.label)}
                {isActive(item.href) && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-900" />
                )}
              </Link>
            ))}
          </nav>

          <Link
            href="/"
            className="rounded-md border border-zinc-200 px-3 py-1.5 text-sm text-zinc-600 hover:text-zinc-900 hover:border-zinc-300 transition-colors"
          >
            {t('admin.backToSite')}
          </Link>
        </div>
      </header>
      <main className="px-12 lg:px-32 py-8">{children}</main>
    </div>
  )
}
