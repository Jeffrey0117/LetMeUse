'use client'

import { Suspense, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useLang } from '@/components/layout/lang-provider'

function ResetPasswordForm() {
  const { t } = useLang()
  const searchParams = useSearchParams()
  const router = useRouter()

  const token = searchParams.get('token') ?? ''

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return

    if (password !== confirmPassword) {
      setError(t('auth.passwordMismatch'))
      return
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}/.test(password)) {
      setError(t('auth.passwordTooWeak'))
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Something went wrong')
        return
      }

      setSuccess(true)
      setTimeout(() => router.push('/login'), 3000)
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="w-full max-w-sm mx-auto p-8 text-center">
        <p className="text-red-500 text-sm">{t('auth.invalidResetLink')}</p>
      </div>
    )
  }

  if (success) {
    return (
      <div className="w-full max-w-sm mx-auto p-8 text-center">
        <h1 className="text-2xl font-bold text-zinc-900 mb-4">{t('auth.passwordResetSuccess')}</h1>
        <p className="text-sm text-zinc-500">{t('auth.redirectingToLogin')}</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-sm mx-auto p-8">
      <h1 className="text-2xl font-bold text-zinc-900 text-center mb-2">LetMeUse</h1>
      <p className="text-sm text-zinc-500 text-center mb-8">{t('auth.resetPasswordTitle')}</p>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg border border-red-200 mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">
            {t('auth.newPassword')}
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm outline-none focus:border-zinc-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">
            {t('auth.confirmPassword')}
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
            className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm outline-none focus:border-zinc-400"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-800 disabled:opacity-50"
        >
          {loading ? t('common.loading') : t('auth.resetPasswordBtn')}
        </button>
      </form>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 -mt-14 pt-14">
      <Suspense fallback={<div className="text-zinc-400 text-sm">Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  )
}
