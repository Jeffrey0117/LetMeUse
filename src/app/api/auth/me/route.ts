import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import type { AuthUser } from '@/lib/auth-models'
import { toPublicUser } from '@/lib/auth-models'
import { getById, USERS_FILE } from '@/lib/storage'
import { authenticateRequest } from '@/lib/auth/middleware'
import { corsResponse, success, fail } from '@/lib/api-result'

export async function OPTIONS(request: NextRequest) {
  return corsResponse(request.headers.get('origin'))
}

export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin')

  try {
    const authResult = await authenticateRequest(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const user = await getById<AuthUser>(USERS_FILE, authResult.payload.sub)
    if (!user) {
      return fail('User not found', 404, origin)
    }

    return success({ user: toPublicUser(user) }, 200, origin)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to get user'
    return fail(message, 500, origin)
  }
}
