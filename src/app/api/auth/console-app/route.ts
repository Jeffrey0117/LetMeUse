import { type NextRequest } from 'next/server'
import { corsResponse, success } from '@/lib/api-result'
import { readPlatformAdminConfig } from '@/lib/auth/platform-admin'

export async function OPTIONS(request: NextRequest) {
  return corsResponse(request.headers.get('origin'))
}

/**
 * GET /api/auth/console-app → { appId }
 * The hosted sign-in page uses this app when the link names none, i.e. when
 * someone is signing in to the LetMeUse console itself. An app ID is not a secret.
 */
export async function GET(request: NextRequest) {
  return success({ appId: readPlatformAdminConfig().appId }, 200, request.headers.get('origin'))
}
