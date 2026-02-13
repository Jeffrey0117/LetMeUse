import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { UpdateProfileSchema, type AuthUser, toPublicUser } from '@/lib/auth-models'
import { getById, update, USERS_FILE } from '@/lib/storage'
import { authenticateRequest } from '@/lib/auth/middleware'
import { corsResponse, jsonResponse, errorResponse } from '@/lib/auth/middleware'

export async function OPTIONS(request: NextRequest) {
  return corsResponse(request.headers.get('origin'))
}

export async function PUT(request: NextRequest) {
  const origin = request.headers.get('origin')

  try {
    const authResult = await authenticateRequest(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const body = await request.json()
    const parsed = UpdateProfileSchema.safeParse(body)

    if (!parsed.success) {
      const messages = parsed.error.issues.map((i) => i.message)
      return errorResponse(messages.join(', '), 400, origin)
    }

    const user = await getById<AuthUser>(USERS_FILE, authResult.payload.sub)
    if (!user) {
      return errorResponse('User not found', 404, origin)
    }

    const now = new Date().toISOString()
    const updated = await update<AuthUser>(USERS_FILE, user.id, {
      ...parsed.data,
      updatedAt: now,
    } as Partial<AuthUser>)

    if (!updated) {
      return errorResponse('Failed to update profile', 500, origin)
    }

    return jsonResponse({ user: toPublicUser(updated) }, 200, origin)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Profile update failed'
    return errorResponse(message, 500, origin)
  }
}
