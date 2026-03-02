import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Checkout | LetMeUse',
  description: 'Complete your purchase',
}

export default function CheckoutLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      {children}
    </div>
  )
}
