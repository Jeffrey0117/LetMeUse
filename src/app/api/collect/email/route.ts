import { type NextRequest } from 'next/server'
import { corsResponse, success, fail } from '@/lib/api-result'
import { getById, create, getAll, APPS_FILE, EMAIL_LEADS_FILE } from '@/lib/storage'
import { generateEmailLeadId } from '@/lib/id'
import { z } from 'zod'

const CreateEmailLeadSchema = z.object({
  appId: z.string().min(1),
  appSecret: z.string().min(1),
  email: z.string().email(),
  name: z.string().optional(),
  source: z.string().optional(),
  metadata: z.record(z.string(), z.string()).optional(),
})

interface App {
  id: string
  secret: string
  [key: string]: unknown
}

interface EmailLead {
  id: string
  appId: string
  email: string
  name?: string
  source?: string
  metadata?: Record<string, string>
  createdAt: string
}

export async function OPTIONS(request: NextRequest) {
  return corsResponse(request.headers.get('origin'))
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin')

  try {
    const body = await request.json()
    const parsed = CreateEmailLeadSchema.parse(body)

    // Verify app credentials
    const app = await getById<App>(APPS_FILE, parsed.appId)
    if (!app || app.secret !== parsed.appSecret) {
      return fail('Invalid app credentials', 401, origin)
    }

    // Check for duplicate email per app (skip if already exists)
    const existing = await getAll<EmailLead>(EMAIL_LEADS_FILE)
    const duplicate = existing.find(
      (e) => e.email === parsed.email && e.appId === parsed.appId
    )
    if (duplicate) {
      return success({ id: duplicate.id, email: duplicate.email, duplicate: true }, 200, origin)
    }

    const lead: EmailLead = {
      id: generateEmailLeadId(),
      appId: parsed.appId,
      email: parsed.email,
      name: parsed.name,
      source: parsed.source,
      metadata: parsed.metadata,
      createdAt: new Date().toISOString(),
    }

    await create(EMAIL_LEADS_FILE, lead)
    return success({ id: lead.id, email: lead.email }, 201, origin)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return fail('Invalid request body', 400, origin)
    }
        return fail('Operation failed', 500, origin)
  }
}

// GET — list leads for an app (admin use)
export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin')
  const { searchParams } = new URL(request.url)
  const appId = searchParams.get('appId')
  const appSecret = searchParams.get('appSecret')

  if (!appId || !appSecret) {
    return fail('Missing appId or appSecret', 400, origin)
  }

  const app = await getById<App>(APPS_FILE, appId)
  if (!app || app.secret !== appSecret) {
    return fail('Invalid app credentials', 401, origin)
  }

  const all = await getAll<EmailLead>(EMAIL_LEADS_FILE)
  const leads = all.filter((e) => e.appId === appId)

  return success({ leads, total: leads.length }, 200, origin)
}
