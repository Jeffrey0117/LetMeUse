import { create, getAll, AUDIT_LOG_FILE } from './storage'
import { generateAuditLogId } from './id'

// ── Audit event types ───────────────────────────────────

export const AUDIT_ACTIONS = [
  'user.login',
  'user.login_failed',
  'user.register',
  'user.logout',
  'user.profile_updated',
  'user.password_reset',
  'user.email_verified',
  'admin.user_updated',
  'admin.user_disabled',
  'admin.user_enabled',
  'admin.user_deleted',
  'admin.role_created',
  'admin.role_updated',
  'admin.role_deleted',
  'admin.app_created',
  'admin.app_updated',
  'admin.app_deleted',
] as const

export type AuditAction = (typeof AUDIT_ACTIONS)[number]

// ── Audit log entry ─────────────────────────────────────

export interface AuditLogEntry {
  id: string
  action: AuditAction
  actorId: string
  actorEmail?: string
  appId?: string
  targetId?: string
  targetType?: string
  details?: Record<string, unknown>
  ip?: string
  userAgent?: string
  createdAt: string
}

// ── Write audit log (fire-and-forget) ───────────────────

export function writeAuditLog(entry: Omit<AuditLogEntry, 'id' | 'createdAt'>): void {
  const log: AuditLogEntry = {
    ...entry,
    id: generateAuditLogId(),
    createdAt: new Date().toISOString(),
  }

  // Fire-and-forget — don't block the request
  create<AuditLogEntry>(AUDIT_LOG_FILE, log).catch(() => {
    // Silently ignore storage errors
  })
}

// ── Query audit log ─────────────────────────────────────

export async function queryAuditLog(options?: {
  appId?: string
  actorId?: string
  action?: string
  limit?: number
  offset?: number
}): Promise<{ entries: AuditLogEntry[]; total: number }> {
  const all = await getAll<AuditLogEntry>(AUDIT_LOG_FILE)
  let filtered = all

  if (options?.appId) {
    filtered = filtered.filter((e) => e.appId === options.appId)
  }
  if (options?.actorId) {
    filtered = filtered.filter((e) => e.actorId === options.actorId)
  }
  if (options?.action) {
    filtered = filtered.filter((e) => e.action === options.action)
  }

  // Sort newest first
  filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const total = filtered.length
  const offset = options?.offset ?? 0
  const limit = options?.limit ?? 50
  const entries = filtered.slice(offset, offset + limit)

  return { entries, total }
}
