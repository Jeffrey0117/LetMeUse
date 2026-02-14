import { NextRequest } from 'next/server'
import { getAll, create, findByField, getById, ADS_FILE, PROJECTS_FILE } from '@/lib/storage'
import { CreateAdSchema, type Ad, type Project } from '@/lib/models'
import { generateAdId } from '@/lib/id'
import { success, fail } from '@/lib/api-result'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')

    if (projectId) {
      const ads = await findByField<Ad>(ADS_FILE, 'projectId', projectId)
      return success(ads)
    }

    const ads = await getAll<Ad>(ADS_FILE)
    return success(ads)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch ads'
    return fail(message, 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = CreateAdSchema.safeParse(body)
    if (!parsed.success) {
      const messages = parsed.error.issues.map((i) => i.message)
      return fail(messages.join(', '), 400)
    }

    const project = await getById<Project>(PROJECTS_FILE, parsed.data.projectId)
    if (!project) {
      return fail('Project not found', 404)
    }

    const now = new Date().toISOString()
    const defaultStyle = {
      backgroundColor: '#ffffff',
      textColor: '#000000',
      ctaBackgroundColor: '#2563eb',
      ctaTextColor: '#ffffff',
      borderRadius: '8px',
      zIndex: 9999,
      maxWidth: '100%',
      padding: '16px',
      customCSS: '',
    }

    const ad: Ad = {
      id: generateAdId(),
      projectId: parsed.data.projectId,
      name: parsed.data.name,
      category: parsed.data.category ?? 'ad',
      type: parsed.data.type ?? 'bottom-banner',
      status: parsed.data.status ?? 'draft',
      position: parsed.data.position,
      headline: parsed.data.headline ?? '',
      bodyText: parsed.data.bodyText ?? '',
      ctaText: parsed.data.ctaText ?? '',
      ctaUrl: parsed.data.ctaUrl ?? '',
      imageUrl: parsed.data.imageUrl,
      backgroundImageUrl: parsed.data.backgroundImageUrl,
      widgetConfig: parsed.data.widgetConfig,
      style: parsed.data.style
        ? { ...defaultStyle, ...parsed.data.style }
        : defaultStyle,
      createdAt: now,
      updatedAt: now,
    }

    await create(ADS_FILE, ad)
    return success(ad, 201)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create ad'
    return fail(message, 500)
  }
}
