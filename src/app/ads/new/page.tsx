'use client'

import { useSearchParams } from 'next/navigation'
import { AdForm } from '@/components/ads/ad-form'
import { Suspense } from 'react'

function NewAdContent() {
  const searchParams = useSearchParams()
  const projectId = searchParams.get('projectId') ?? undefined

  return <AdForm mode="create" defaultProjectId={projectId} />
}

export default function NewAdPage() {
  return (
    <Suspense fallback={<div className="p-8 text-zinc-500">Loading...</div>}>
      <NewAdContent />
    </Suspense>
  )
}
