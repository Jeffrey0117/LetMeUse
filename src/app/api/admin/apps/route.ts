import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { CreateAppSchema, type App } from '@/lib/auth-models'
import { getAll, create, APPS_FILE } from '@/lib/storage'
import { generateAppId, generateAppSecret } from '@/lib/id'
import { requireAdmin } from '@/lib/auth/middleware'
import { corsResponse, success, fail } from '@/lib/api-result'

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

    const apps = await getAll<App>(APPS_FILE)
    return success({ apps }, 200, origin)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to list apps'
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
    const parsed = CreateAppSchema.safeParse(body)

    if (!parsed.success) {
      const messages = parsed.error.issues.map((i) => i.message)
      return fail(messages.join(', '), 400, origin)
    }

    const now = new Date().toISOString()
    const app: App = {
      id: generateAppId(),
      name: parsed.data.name,
      secret: generateAppSecret(),
      domains: parsed.data.domains ?? [],
      webhookUrl: parsed.data.webhookUrl,
      createdAt: now,
      updatedAt: now,
    }

    await create<App>(APPS_FILE, app)
    return success({ app }, 201, origin)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create app'
    return fail(message, 500, origin)
  }
}
