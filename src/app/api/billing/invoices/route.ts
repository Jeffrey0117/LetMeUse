import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/auth/middleware'
import { corsResponse, success, fail } from '@/lib/api-result'
import { getUserInvoices } from '@/lib/billing/service'

export async function OPTIONS(request: NextRequest) {
  return corsResponse(request.headers.get('origin'))
}

// GET — get current user's invoices
export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin')

  try {
    const authResult = await authenticateRequest(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const invoices = await getUserInvoices(authResult.payload.sub, authResult.payload.app)

    return success({ invoices }, 200, origin)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to get invoices'
    return fail(message, 500, origin)
  }
}
