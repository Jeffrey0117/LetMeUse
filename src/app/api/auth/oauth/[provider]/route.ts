import { type NextRequest, NextResponse } from 'next/server'
import { getById, APPS_FILE } from '@/lib/storage'
import type { App, OAuthProviderName } from '@/lib/auth-models'
import { OAUTH_PROVIDER_NAMES } from '@/lib/auth-models'
import { getOAuthAuthorizeUrl, generateOAuthState } from '@/lib/auth/oauth'
import { fail } from '@/lib/api-result'

type RouteParams = { params: Promise<{ provider: string }> }

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { provider } = await params
    const { searchParams } = new URL(request.url)
    const appId = searchParams.get('app_id') ?? ''
    const redirectUrl = searchParams.get('redirect') ?? undefined

    if (!OAUTH_PROVIDER_NAMES.includes(provider as OAuthProviderName)) {
      return fail(`Unsupported provider: ${provider}`, 400)
    }

    if (!appId) {
      return fail('Missing app_id parameter', 400)
    }

    const app = await getById<App>(APPS_FILE, appId)
    if (!app) {
      return fail('App not found', 404)
    }

    const providerName = provider as OAuthProviderName
    const providerConfig = app.oauthProviders?.[providerName]

    if (!providerConfig?.enabled || !providerConfig.clientId || !providerConfig.clientSecret) {
      return fail(`${provider} OAuth is not configured for this app`, 400)
    }

    const state = await generateOAuthState(appId, app.secret, redirectUrl)
    const authorizeUrl = getOAuthAuthorizeUrl(providerName, providerConfig, appId, state)

    return NextResponse.redirect(authorizeUrl)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'OAuth initialization failed'
    return fail(message, 500)
  }
}
