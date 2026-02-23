import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { writeFile, mkdir, unlink, access } from 'fs/promises'
import path from 'path'
import type { AuthUser, App } from '@/lib/auth-models'
import { toPublicUser } from '@/lib/auth-models'
import { getById, update, USERS_FILE, APPS_FILE } from '@/lib/storage'
import { authenticateRequest } from '@/lib/auth/middleware'
import { corsResponse, success, fail } from '@/lib/api-result'
import { dispatchWebhook } from '@/lib/webhook'

const AVATAR_DIR = path.join(process.cwd(), 'public', 'uploads', 'avatars')
const AVATAR_URL_PREFIX = '/uploads/avatars'
const MAX_SIZE = 2 * 1024 * 1024 // 2MB
const ALLOWED_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
}

async function ensureAvatarDir(): Promise<void> {
  await mkdir(AVATAR_DIR, { recursive: true })
}

async function deleteFileIfExists(filePath: string): Promise<void> {
  try {
    await access(filePath)
    await unlink(filePath)
  } catch {
    // File does not exist — nothing to delete
  }
}

function resolveOldAvatarPath(avatarUrl: string): string | null {
  if (!avatarUrl.startsWith(AVATAR_URL_PREFIX)) {
    return null
  }
  const filename = avatarUrl.slice(AVATAR_URL_PREFIX.length + 1)
  if (!filename || filename.includes('..') || filename.includes('/')) {
    return null
  }
  return path.join(AVATAR_DIR, filename)
}

export async function OPTIONS(request: NextRequest) {
  return corsResponse(request.headers.get('origin'))
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin')

  try {
    const authResult = await authenticateRequest(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const user = await getById<AuthUser>(USERS_FILE, authResult.payload.sub)
    if (!user) {
      return fail('User not found', 404, origin)
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return fail('No file provided. Use a "file" field in multipart/form-data.', 400, origin)
    }

    const ext = ALLOWED_TYPES[file.type]
    if (!ext) {
      return fail(
        'Invalid file type. Allowed: JPG, PNG, GIF, WebP',
        400,
        origin
      )
    }

    if (file.size > MAX_SIZE) {
      return fail('File too large. Maximum size is 2MB.', 400, origin)
    }

    await ensureAvatarDir()

    // Delete old avatar file if the user already has one
    if (user.avatar) {
      const oldPath = resolveOldAvatarPath(user.avatar)
      if (oldPath) {
        await deleteFileIfExists(oldPath)
      }
    }

    const timestamp = Date.now()
    const filename = `avatar_${user.id}_${timestamp}.${ext}`
    const filePath = path.join(AVATAR_DIR, filename)

    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(filePath, buffer)

    const avatarUrl = `${AVATAR_URL_PREFIX}/${filename}`
    const now = new Date().toISOString()

    const updated = await update<AuthUser>(USERS_FILE, user.id, {
      avatar: avatarUrl,
      updatedAt: now,
    } as Partial<AuthUser>)

    if (!updated) {
      return fail('Failed to update user avatar', 500, origin)
    }

    const app = await getById<App>(APPS_FILE, updated.appId)
    if (app) {
      dispatchWebhook(app, 'user.updated', {
        userId: updated.id,
        email: updated.email,
        changes: ['avatar'],
      })
    }

    return success({ user: toPublicUser(updated) }, 200, origin)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Avatar upload failed'
    return fail(message, 500, origin)
  }
}
