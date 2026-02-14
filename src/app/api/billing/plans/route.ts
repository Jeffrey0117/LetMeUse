import { type NextRequest } from 'next/server'
import { corsResponse, success, fail } from '@/lib/api-result'
import { getPlansForApp } from '@/lib/billing/service'

export async function OPTIONS(request: NextRequest) {
  return corsResponse(request.headers.get('origin'))
}

// GET — public endpoint to list plans for an app
export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin')

  try {
    const { searchParams } = new URL(request.url)
    const appId = searchParams.get('appId')

    if (!appId) {
      return fail('appId is required', 400, origin)
    }

    const plans = await getPlansForApp(appId)

    return success({ plans }, 200, origin)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to get plans'
    return fail(message, 500, origin)
  }
}
