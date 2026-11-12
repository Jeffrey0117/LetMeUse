import { type NextRequest } from 'next/server'
import { getById, APPS_FILE } from '@/lib/storage'
import type { App } from '@/lib/auth-models'
import { corsResponse, success, fail } from '@/lib/api-result'
import { isRedirectAllowed } from '@/lib/auth/redirect'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'

export async function OPTIONS(request: NextRequest) {
  return corsResponse(request.headers.get('origin'))
}

/**
 * GET /api/auth/redirect-check?app_id=X&redirect=URL → { allowed }
 * The hosted sign-in page asks this before handing tokens to a redirect target.
 */
export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin')

  try {
    const { searchParams } = new URL(request.url)
    const appId = searchParams.get('app_id')
    const redirect = searchParams.get('redirect')

    if (!appId || !redirect) {
      return fail('Missing app_id or redirect parameter', 400, origin)
    }

    const app = await getById<App>(APPS_FILE, appId)
    if (!app) {
      return fail('App not found', 404, origin)
    }

    return success({ allowed: isRedirectAllowed(redirect, app.domains, BASE_URL) }, 200, origin)
  } catch {
    return fail('Operation failed', 500, origin)
  }
}
