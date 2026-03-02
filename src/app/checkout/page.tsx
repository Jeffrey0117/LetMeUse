'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'

interface CheckoutData {
  id: string
  status: string
  productName: string
  amount: number
  currency: string
  expiresAt: string
  metadata?: Record<string, string>
}

function formatCurrency(amount: number, currency: string): string {
  const map: Record<string, string> = {
    TWD: 'NT$',
    USD: '$',
    EUR: '€',
    JPY: '¥',
  }
  const prefix = map[currency] ?? currency + ' '
  return `${prefix}${amount.toLocaleString()}`
}

function CheckoutContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session')

  const [data, setData] = useState<CheckoutData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [successUrl, setSuccessUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!sessionId) {
      setError('Missing checkout session')
      setLoading(false)
      return
    }

    fetch(`/api/billing/checkout?session=${sessionId}`)
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          setData(result.data)
        } else {
          setError(result.error)
        }
      })
      .catch(() => setError('Failed to load checkout'))
      .finally(() => setLoading(false))
  }, [sessionId])

  async function handlePay() {
    if (!sessionId || processing) return
    setProcessing(true)

    try {
      const res = await fetch('/api/billing/checkout/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      })
      const result = await res.json()

      if (result.success) {
        setCompleted(true)
        setSuccessUrl(result.data.successUrl)
        // Auto-redirect after 2 seconds
        setTimeout(() => {
          if (result.data.successUrl) {
            window.location.href = result.data.successUrl
          }
        }, 2000)
      } else {
        setError(result.error)
      }
    } catch {
      setError('Payment failed, please try again')
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
          <div className="w-8 h-8 border-2 border-zinc-700 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-400 text-sm">Loading checkout...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
          <div className="text-3xl mb-4">&#x26A0;&#xFE0F;</div>
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      </div>
    )
  }

  if (completed) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
          <div className="text-4xl mb-4">&#x2705;</div>
          <h2 className="text-white text-lg font-semibold mb-2">Payment Successful</h2>
          <p className="text-zinc-400 text-sm mb-4">Redirecting you back...</p>
          {successUrl && (
            <a
              href={successUrl}
              className="text-blue-400 text-sm hover:underline"
            >
              Click here if not redirected
            </a>
          )}
        </div>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="w-full max-w-md">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-zinc-800">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-purple-500" />
            <span className="text-zinc-500 text-xs font-medium uppercase tracking-wider">
              Secure Checkout
            </span>
          </div>
          <h1 className="text-white text-xl font-semibold">{data.productName}</h1>
        </div>

        {/* Order summary */}
        <div className="p-6 border-b border-zinc-800">
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-zinc-400 text-sm">Total</span>
            <span className="text-white text-2xl font-bold">
              {formatCurrency(data.amount, data.currency)}
            </span>
          </div>
          <p className="text-zinc-600 text-xs">One-time payment</p>
        </div>

        {/* Pay button */}
        <div className="p-6">
          <button
            onClick={handlePay}
            disabled={processing}
            className="w-full py-3.5 bg-white text-zinc-900 rounded-xl font-semibold text-sm
              hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? 'Processing...' : `Pay ${formatCurrency(data.amount, data.currency)}`}
          </button>

          <p className="text-zinc-600 text-xs text-center mt-4">
            Powered by <span className="text-zinc-500">LetMeUse</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-md">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
            <div className="w-8 h-8 border-2 border-zinc-700 border-t-white rounded-full animate-spin mx-auto mb-4" />
            <p className="text-zinc-400 text-sm">Loading...</p>
          </div>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  )
}
