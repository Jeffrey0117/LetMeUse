'use client'

import { Suspense, useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useLang } from '@/components/layout/lang-provider'

const GOOGLE_SVG = `<svg class="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>`
const GITHUB_SVG = `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/></svg>`

function LoginForm() {
  const { t, locale } = useLang()
  const searchParams = useSearchParams()
  const router = useRouter()

  const appId = searchParams.get('app') ?? ''
  const redirect = searchParams.get('redirect') ?? ''
  const initialTab = searchParams.get('tab') === 'register' ? 'register' : 'login'
  const oauthError = searchParams.get('error')
  const verified = searchParams.get('verified') === 'true'

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialTab)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState(oauthError ?? '')
  const [successMsg, setSuccessMsg] = useState(verified ? 'auth.emailVerified' : '')
  const [loading, setLoading] = useState(false)
  const [providers, setProviders] = useState<string[]>([])

  // Check for OAuth callback tokens in hash
  useEffect(() => {
    const hash = window.location.hash
    if (hash.includes('lmu_token=')) {
      const params = new URLSearchParams(hash.slice(1))
      const token = params.get('lmu_token')
      if (token) {
        localStorage.setItem('lmu_admin_token', token)
        document.cookie = `lmu_admin_token=${token}; path=/; max-age=${60 * 60 * 24}; SameSite=Strict`
        window.history.replaceState(null, '', window.location.pathname + window.location.search)
        router.push('/admin')
      }
    }
  }, [router])

  // Fetch available OAuth providers
  useEffect(() => {
    if (!appId) return
    fetch(`/api/auth/providers?app_id=${appId}`)
      .then((res) => res.json())
      .then((data) => setProviders(data.data?.providers ?? []))
      .catch(() => {})
  }, [appId])

  function startOAuth(provider: string) {
    const redirectUrl = redirect || window.location.href
    window.location.href = `/api/auth/oauth/${provider}?app_id=${appId}&redirect=${encodeURIComponent(redirectUrl)}`
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    setError('')
    setSuccessMsg('')

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appId, email, locale }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong')
      } else {
        setSuccessMsg('auth.resetLinkSent')
      }
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return

    setLoading(true)
    setError('')
    setSuccessMsg('')

    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register'
      const body =
        mode === 'login'
          ? { appId, email, password }
          : { appId, email, password, displayName, locale }

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

      const payload = data.data
      // Store token for admin usage (localStorage for API calls, cookie for middleware)
      localStorage.setItem('lmu_admin_token', payload.accessToken)
      document.cookie = `lmu_admin_token=${payload.accessToken}; path=/; max-age=${60 * 60 * 24}; SameSite=Strict`

      if (redirect) {
        // For SDK redirect mode: pass token in hash
        const url = new URL(redirect)
        url.hash = `lmu_token=${payload.accessToken}&lmu_refresh=${payload.refreshToken}`
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
  const isForgot = mode === 'forgot'

  return (
    <div className="w-full max-w-sm mx-auto p-8">
      <h1 className="text-2xl font-bold text-zinc-900 text-center mb-2">LetMeUse</h1>
      <p className="text-sm text-zinc-500 text-center mb-8">
        {isForgot
          ? t('auth.forgotPasswordTitle')
          : isLogin
            ? t('auth.loginTitle')
            : t('auth.registerTitle')}
      </p>

      {successMsg && (
        <div className="bg-green-50 text-green-600 text-sm px-4 py-3 rounded-lg border border-green-200 mb-4">
          {t(successMsg as Parameters<typeof t>[0])}
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg border border-red-200 mb-4">
          {error}
        </div>
      )}

      {isForgot ? (
        <form onSubmit={handleForgotPassword} className="space-y-4">
          <p className="text-sm text-zinc-500">{t('auth.forgotPasswordDesc')}</p>
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
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-800 disabled:opacity-50"
          >
            {loading ? t('common.loading') : t('auth.sendResetLink')}
          </button>
          <p className="text-center">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); setSuccessMsg('') }}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              {t('auth.backToLogin')}
            </button>
          </p>
        </form>
      ) : (
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
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-zinc-700">
                {t('auth.password')}
              </label>
              {isLogin && (
                <button
                  type="button"
                  onClick={() => { setMode('forgot'); setError(''); setSuccessMsg('') }}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  {t('auth.forgotPassword')}
                </button>
              )}
            </div>
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
      )}

      {!isForgot && providers.length > 0 && (
        <div className="mt-6">
          <div className="relative flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-zinc-200" />
            <span className="text-xs text-zinc-400">{t('auth.orContinueWith')}</span>
            <div className="flex-1 h-px bg-zinc-200" />
          </div>
          <div className="flex gap-3">
            {providers.includes('google') && (
              <button
                onClick={() => startOAuth('google')}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-zinc-200 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
              >
                <span dangerouslySetInnerHTML={{ __html: GOOGLE_SVG }} />
                Google
              </button>
            )}
            {providers.includes('github') && (
              <button
                onClick={() => startOAuth('github')}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-zinc-200 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
              >
                <span dangerouslySetInnerHTML={{ __html: GITHUB_SVG }} />
                GitHub
              </button>
            )}
          </div>
        </div>
      )}

      {!isForgot && (
        <p className="text-center text-sm text-zinc-500 mt-4">
          <button
            onClick={() => {
              setMode(isLogin ? 'register' : 'login')
              setError('')
              setSuccessMsg('')
            }}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            {isLogin ? t('auth.switchToRegister') : t('auth.switchToLogin')}
          </button>
        </p>
      )}
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
