import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import crypto from 'crypto'
import { authenticateRequest } from '@/lib/auth/middleware'
import { corsResponse, success, fail } from '@/lib/api-result'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

const CONTENT_TYPE_TO_EXTENSIONS: Record<string, readonly string[]> = {
  'image/jpeg': ['jpg', 'jpeg'],
  'image/png': ['png'],
  'image/gif': ['gif'],
  'image/webp': ['webp'],
  'image/svg+xml': ['svg'],
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9.]/g, '').toLowerCase()
}

function extractExtension(filename: string): string {
  const parts = filename.split('.')
  return parts.length > 1 ? (parts.pop() ?? 'bin') : 'bin'
}

function isExtensionValidForType(ext: string, contentType: string): boolean {
  const allowed = CONTENT_TYPE_TO_EXTENSIONS[contentType]
  if (!allowed) {
    return false
  }
  return allowed.includes(ext.toLowerCase())
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

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return fail('No file provided', 400, origin)
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return fail('Invalid file type. Allowed: JPEG, PNG, GIF, WebP, SVG', 400, origin)
    }

    if (file.size > MAX_SIZE) {
      return fail('File too large. Max size: 5MB', 400, origin)
    }

    const ext = extractExtension(file.name)

    if (!isExtensionValidForType(ext, file.type)) {
      return fail(
        `File extension ".${ext}" does not match content type "${file.type}"`,
        400,
        origin
      )
    }

    await mkdir(UPLOAD_DIR, { recursive: true })

    const sanitized = sanitizeFilename(file.name)
    const uniqueId = crypto.randomUUID()
    const filename = `${uniqueId}-${sanitized}`
    const filePath = path.join(UPLOAD_DIR, filename)

    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(filePath, buffer)

    const url = `/uploads/${filename}`
    return success({ url, filename, ext, size: file.size }, 201, origin)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload failed'
    return fail(message, 500, origin)
  }
}
