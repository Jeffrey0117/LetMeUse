import { type NextRequest } from 'next/server'
import { corsResponse, success, fail } from '@/lib/api-result'
import { getById, APPS_FILE } from '@/lib/storage'
import type { App } from '@/lib/auth-models'
import { z } from 'zod'

const VerifyPurchaseRequestSchema = z.object({
  appId: z.string().min(1, 'appId is required'),
  appSecret: z.string().min(1, 'appSecret is required'),
  email: z.string().email('Invalid email'),
  courseId: z.string().optional(),
})

export async function OPTIONS(request: NextRequest) {
  return corsResponse(request.headers.get('origin'))
}

// POST — verify a purchase via external provider (server-to-server, authenticated via appSecret)
export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin')

  try {
    const body = await request.json()
    const parsed = VerifyPurchaseRequestSchema.safeParse(body)

    if (!parsed.success) {
      const messages = parsed.error.issues.map((i) => i.message)
      return fail(messages.join(', '), 400, origin)
    }

    const { appId, appSecret, email, courseId } = parsed.data

    // Verify app credentials
    const app = await getById<App>(APPS_FILE, appId)
    if (!app || app.secret !== appSecret) {
      return fail('Invalid app credentials', 401, origin)
    }

    // Check purchaseVerify is configured and enabled
    const pv = app.purchaseVerify
    if (!pv || !pv.enabled) {
      return fail('Purchase verification is not configured for this app', 400, origin)
    }

    // Call external provider to verify purchase
    const providerBody: Record<string, string> = { email }
    const targetCourseId = courseId || pv.courseId
    if (targetCourseId) {
      providerBody.courseId = targetCourseId
    }

    let providerRes: Response
    try {
      providerRes = await fetch(pv.providerUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${pv.providerSecret}`,
        },
        body: JSON.stringify(providerBody),
      })
    } catch (error) {
      console.error('[verify-purchase] Provider fetch error:', error)
      return fail('Purchase verification temporarily unavailable', 502, origin)
    }

    if (!providerRes.ok) {
      console.error(`[verify-purchase] Provider returned ${providerRes.status}`)
      return fail('Purchase verification failed', 502, origin)
    }

    const providerData = await providerRes.json()

    return success({
      purchased: providerData.purchased === true,
      purchaseInfo: providerData.purchase_type || providerData.purchaseType || null,
    }, 200, origin)
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return fail('Invalid request body', 400, origin)
    }
        return fail('Operation failed', 500, origin)
  }
}
