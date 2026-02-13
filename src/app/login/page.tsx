'use client'

import { Suspense, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useLang } from '@/components/layout/lang-provider'

function LoginForm() {
  const { t } = useLang()
  const searchParams = useSearchParams()
  const router = useRouter()

  const appId = searchParams.get('app') ?? ''
  const redirect = searchParams.get('redirect') ?? ''
  const initialTab = searchParams.get('tab') === 'register' ? 'register' : 'login'

  const [mode, setMode] = useState<'login' | 'register'>(initialTab)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return

    setLoading(true)
    setError('')

    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register'
      const body =
        mode === 'login'
          ? { appId, email, password }
          : { appId, email, password, displayName }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Something went wrong')
        return
      }

      // Store token for admin usage
      localStorage.setItem('adman_admin_token', data.accessToken)

      if (redirect) {
        // For SDK redirect mode: pass token in hash
        const url = new URL(redirect)
        url.hash = `adman_token=${data.accessToken}&adman_refresh=${data.refreshToken}`
        window.location.href = url.toString()
      } else {
        router.push('/admin')
      }
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  const isLogin = mode === 'login'

  return (
    <div className="w-full max-w-sm mx-auto p-8">
      <h1 className="text-2xl font-bold text-zinc-900 text-center mb-2">AdMan</h1>
      <p className="text-sm text-zinc-500 text-center mb-8">
        {isLogin ? t('auth.loginTitle') : t('auth.registerTitle')}
      </p>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg border border-red-200 mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              {t('auth.displayName')}
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm outline-none focus:border-zinc-400"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">
            {t('auth.email')}
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm outline-none focus:border-zinc-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">
            {t('auth.password')}
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={isLogin ? 1 : 8}
            className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm outline-none focus:border-zinc-400"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-800 disabled:opacity-50"
        >
          {loading
            ? t('common.loading')
            : isLogin
              ? t('auth.loginBtn')
              : t('auth.registerBtn')}
        </button>
      </form>

      <p className="text-center text-sm text-zinc-500 mt-4">
        <button
          onClick={() => {
            setMode(isLogin ? 'register' : 'login')
            setError('')
          }}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          {isLogin ? t('auth.switchToRegister') : t('auth.switchToLogin')}
        </button>
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 -mt-14 pt-14">
      <Suspense fallback={<div className="text-zinc-400 text-sm">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
