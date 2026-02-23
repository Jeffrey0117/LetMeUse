import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/middleware'
import { corsResponse, success, fail } from '@/lib/api-result'
import { getAllPlansForApp, createPlan } from '@/lib/billing/service'

export async function OPTIONS(request: NextRequest) {
  return corsResponse(request.headers.get('origin'))
}

export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin')

  try {
    const authResult = await requireAdmin(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { searchParams } = new URL(request.url)
    const appId = searchParams.get('appId')

    if (!appId) {
      return fail('appId is required', 400, origin)
    }

    const plans = await getAllPlansForApp(appId)
    return success({ plans }, 200, origin)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to get plans'
    return fail(message, 500, origin)
  }
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin')

  try {
    const authResult = await requireAdmin(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const body = await request.json()
    const plan = await createPlan(body)

    return success({ plan }, 201, origin)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create plan'
    return fail(message, 500, origin)
  }
}
