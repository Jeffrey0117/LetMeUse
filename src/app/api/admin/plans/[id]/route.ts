import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/middleware'
import { corsResponse, success, fail } from '@/lib/api-result'
import { getById, update, remove, PLANS_FILE } from '@/lib/storage'
import { UpdatePlanSchema, type Plan } from '@/lib/billing/models'

export async function OPTIONS(request: NextRequest) {
  return corsResponse(request.headers.get('origin'))
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const origin = request.headers.get('origin')

  try {
    const authResult = await requireAdmin(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { id } = await params
    const plan = await getById<Plan>(PLANS_FILE, id)
    if (!plan) {
      return fail('Plan not found', 404, origin)
    }

    return success({ plan }, 200, origin)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to get plan'
    return fail(message, 500, origin)
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const origin = request.headers.get('origin')

  try {
    const authResult = await requireAdmin(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { id } = await params
    const body = await request.json()
    const parsed = UpdatePlanSchema.safeParse(body)

    if (!parsed.success) {
      const messages = parsed.error.issues.map((i) => i.message)
      return fail(messages.join(', '), 400, origin)
    }

    const now = new Date().toISOString()
    const updated = await update<Plan>(PLANS_FILE, id, {
      ...parsed.data,
      updatedAt: now,
    } as Partial<Plan>)

    if (!updated) {
      return fail('Plan not found', 404, origin)
    }

    return success({ plan: updated }, 200, origin)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update plan'
    return fail(message, 500, origin)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const origin = request.headers.get('origin')

  try {
    const authResult = await requireAdmin(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { id } = await params
    const deleted = await remove<Plan>(PLANS_FILE, id)
    if (!deleted) {
      return fail('Plan not found', 404, origin)
    }

    return success({ deleted: true }, 200, origin)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete plan'
    return fail(message, 500, origin)
  }
}
