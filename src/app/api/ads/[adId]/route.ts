import { NextRequest } from 'next/server'
import { getById, update, remove, ADS_FILE } from '@/lib/storage'
import { UpdateAdSchema, type Ad } from '@/lib/models'
import { success, fail } from '@/lib/api-result'

type RouteParams = { params: Promise<{ adId: string }> }

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { adId } = await params
    const ad = await getById<Ad>(ADS_FILE, adId)
    if (!ad) {
      return fail('Ad not found', 404)
    }
    return success(ad)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch ad'
    return fail(message, 500)
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { adId } = await params
    const body = await request.json()
    const parsed = UpdateAdSchema.safeParse(body)
    if (!parsed.success) {
      const messages = parsed.error.issues.map((i) => i.message)
      return fail(messages.join(', '), 400)
    }

    const existing = await getById<Ad>(ADS_FILE, adId)
    if (!existing) {
      return fail('Ad not found', 404)
    }

    const updates: Partial<Ad> = {
      ...parsed.data,
      updatedAt: new Date().toISOString(),
      style: parsed.data.style
        ? { ...existing.style, ...parsed.data.style }
        : undefined,
    }

    const updated = await update<Ad>(ADS_FILE, adId, updates)
    if (!updated) {
      return fail('Ad not found', 404)
    }
    return success(updated)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update ad'
    return fail(message, 500)
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { adId } = await params
    const deleted = await remove<Ad>(ADS_FILE, adId)
    if (!deleted) {
      return fail('Ad not found', 404)
    }
    return success({ deleted: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete ad'
    return fail(message, 500)
  }
}
