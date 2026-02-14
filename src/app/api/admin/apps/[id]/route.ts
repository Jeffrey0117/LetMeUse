import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { UpdateAppSchema, type App } from '@/lib/auth-models'
import { getById, update, remove, APPS_FILE } from '@/lib/storage'
import { requireAdmin } from '@/lib/auth/middleware'
import { corsResponse, success, fail } from '@/lib/api-result'

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
    const app = await getById<App>(APPS_FILE, id)
    if (!app) {
      return fail('App not found', 404, origin)
    }

    return success({ app }, 200, origin)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to get app'
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
    const parsed = UpdateAppSchema.safeParse(body)

    if (!parsed.success) {
      const messages = parsed.error.issues.map((i) => i.message)
      return fail(messages.join(', '), 400, origin)
    }

    const now = new Date().toISOString()
    const updated = await update<App>(APPS_FILE, id, {
      ...parsed.data,
      updatedAt: now,
    } as Partial<App>)

    if (!updated) {
      return fail('App not found', 404, origin)
    }

    return success({ app: updated }, 200, origin)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update app'
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
    const deleted = await remove<App>(APPS_FILE, id)
    if (!deleted) {
      return fail('App not found', 404, origin)
    }

    return success({ deleted: true }, 200, origin)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete app'
    return fail(message, 500, origin)
  }
}
