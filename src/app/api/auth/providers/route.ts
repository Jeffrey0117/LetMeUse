import { type NextRequest } from 'next/server'
import { getById, APPS_FILE } from '@/lib/storage'
import type { App, OAuthProviderName } from '@/lib/auth-models'
import { OAUTH_PROVIDER_NAMES } from '@/lib/auth-models'
import { corsResponse, success, fail } from '@/lib/api-result'

export async function OPTIONS(request: NextRequest) {
  return corsResponse(request.headers.get('origin'))
}

export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin')

  try {
    const { searchParams } = new URL(request.url)
    const appId = searchParams.get('app_id')

    if (!appId) {
      return fail('Missing app_id parameter', 400, origin)
    }

    const app = await getById<App>(APPS_FILE, appId)
    if (!app) {
      return fail('App not found', 404, origin)
    }

    const providers: OAuthProviderName[] = OAUTH_PROVIDER_NAMES.filter((name) => {
      const config = app.oauthProviders?.[name]
      return config?.enabled && config.clientId && config.clientSecret
    })

    // Surface the email-verification policy so the SDK can avoid showing a
    // "not verified / resend" prompt for apps that never send verification
    // emails (otherwise members wait for an email that is never sent).
    return success(
      { providers, requireEmailVerification: app.requireEmailVerification === true },
      200,
      origin
    )
  } catch (error) {
        return fail('Operation failed', 500, origin)
  }
}
