'use client'

import { useParams } from 'next/navigation'
import { AdForm } from '@/components/ads/ad-form'

export default function EditAdPage() {
  const params = useParams<{ adId: string }>()

  return <AdForm mode="edit" adId={params.adId} />
}
