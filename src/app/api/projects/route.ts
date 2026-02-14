import { NextRequest } from 'next/server'
import { getAll, create, PROJECTS_FILE } from '@/lib/storage'
import { CreateProjectSchema, type Project } from '@/lib/models'
import { generateProjectId } from '@/lib/id'
import { success, fail } from '@/lib/api-result'

export async function GET() {
  try {
    const projects = await getAll<Project>(PROJECTS_FILE)
    return success(projects)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch projects'
    return fail(message, 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = CreateProjectSchema.safeParse(body)
    if (!parsed.success) {
      const messages = parsed.error.issues.map((i) => i.message)
      return fail(messages.join(', '), 400)
    }

    const now = new Date().toISOString()
    const project: Project = {
      id: generateProjectId(),
      name: parsed.data.name,
      description: parsed.data.description ?? '',
      domain: parsed.data.domain,
      createdAt: now,
      updatedAt: now,
    }

    await create(PROJECTS_FILE, project)
    return success(project, 201)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create project'
    return fail(message, 500)
  }
}
