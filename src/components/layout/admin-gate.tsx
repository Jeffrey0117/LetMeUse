'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useLang } from './lang-provider'

type GateState = 'checking' | 'allowed' | 'denied'

/**
 * Renders children only for a signed-in admin; everyone else goes to /login.
 * The middleware already bounces visitors with no token cookie — this is the
 * check that the token is real and belongs to an admin.
 */
export function AdminGate({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { t } = useLang()
  const [state, setState] = useState<GateState>('checking')

  useEffect(() => {
    let cancelled = false
    const toLogin = () => {
      if (cancelled) return
      setState('denied')
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`)
    }

    const token = localStorage.getItem('lmu_admin_token')
    if (!token) {
      toLogin()
      return
    }

    fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return
        if (data.data?.user?.role === 'admin') setState('allowed')
        else toLogin()
      })
      .catch(toLogin)

    return () => {
      cancelled = true
    }
  }, [router, pathname])

  if (state === 'allowed') return <>{children}</>
  if (state === 'denied') return null

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <p className="text-zinc-500">{t('common.loading')}</p>
    </div>
  )
}
