import { NextRequest, NextResponse } from 'next/server'
import { getById, ADS_FILE } from '@/lib/storage'
import type { Ad } from '@/lib/models'

type RouteParams = { params: Promise<{ adId: string }> }

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { adId } = await params
    const ad = await getById<Ad>(ADS_FILE, adId)

    if (!ad || ad.status !== 'enabled') {
      return NextResponse.json(
        { error: 'Ad not found or disabled' },
        { status: 404 }
      )
    }

    return NextResponse.json(ad)
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
