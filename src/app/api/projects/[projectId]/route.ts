import { NextRequest } from 'next/server'
import { getById, update, remove, PROJECTS_FILE, findByField, ADS_FILE } from '@/lib/storage'
import { UpdateProjectSchema, type Project } from '@/lib/models'
import type { Ad } from '@/lib/models'
import { success, fail } from '@/lib/api-result'

type RouteParams = { params: Promise<{ projectId: string }> }

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { projectId } = await params
    const project = await getById<Project>(PROJECTS_FILE, projectId)
    if (!project) {
      return fail('Project not found', 404)
    }
    return success(project)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch project'
    return fail(message, 500)
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { projectId } = await params
    const body = await request.json()
    const parsed = UpdateProjectSchema.safeParse(body)
    if (!parsed.success) {
      const messages = parsed.error.issues.map((i) => i.message)
      return fail(messages.join(', '), 400)
    }

    const updated = await update<Project>(PROJECTS_FILE, projectId, {
      ...parsed.data,
      updatedAt: new Date().toISOString(),
    } as Partial<Project>)

    if (!updated) {
      return fail('Project not found', 404)
    }
    return success(updated)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update project'
    return fail(message, 500)
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { projectId } = await params

    const ads = await findByField<Ad>(ADS_FILE, 'projectId', projectId)
    if (ads.length > 0) {
      return fail(`Cannot delete project with ${ads.length} associated ad(s). Delete ads first.`, 409)
    }

    const deleted = await remove<Project>(PROJECTS_FILE, projectId)
    if (!deleted) {
      return fail('Project not found', 404)
    }
    return success({ deleted: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete project'
    return fail(message, 500)
  }
}
