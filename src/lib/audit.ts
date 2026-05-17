import { create, getAll, getSqlite, DB_TYPE, AUDIT_LOG_FILE } from './storage'
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
  const limit = options?.limit ?? 50
  const offset = options?.offset ?? 0

  if (DB_TYPE === 'sqlite') {
    return queryAuditLogSql(options?.appId, options?.actorId, options?.action, limit, offset)
  }

  return queryAuditLogJson(options?.appId, options?.actorId, options?.action, limit, offset)
}

function queryAuditLogSql(
  appId?: string,
  actorId?: string,
  action?: string,
  limit = 50,
  offset = 0
): { entries: AuditLogEntry[]; total: number } {
  const db = getSqlite()
  const whereClauses: string[] = []
  const params: unknown[] = []

  if (appId) {
    whereClauses.push("json_extract(data, '$.appId') = ?")
    params.push(appId)
  }
  if (actorId) {
    whereClauses.push("json_extract(data, '$.actorId') = ?")
    params.push(actorId)
  }
  if (action) {
    whereClauses.push("json_extract(data, '$.action') = ?")
    params.push(action)
  }

  const whereStr = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : ''

  const countRow = db.prepare(
    `SELECT COUNT(*) as cnt FROM audit_log ${whereStr}`
  ).get(...params) as { cnt: number }

  const rows = db.prepare(
    `SELECT data FROM audit_log ${whereStr} ORDER BY json_extract(data, '$.createdAt') DESC LIMIT ? OFFSET ?`
  ).all(...params, limit, offset) as { data: string }[]

  return {
    entries: rows.map((r) => JSON.parse(r.data) as AuditLogEntry),
    total: countRow.cnt,
  }
}

async function queryAuditLogJson(
  appId?: string,
  actorId?: string,
  action?: string,
  limit = 50,
  offset = 0
): Promise<{ entries: AuditLogEntry[]; total: number }> {
  const all = await getAll<AuditLogEntry>(AUDIT_LOG_FILE)
  let filtered = all

  if (appId) {
    filtered = filtered.filter((e) => e.appId === appId)
  }
  if (actorId) {
    filtered = filtered.filter((e) => e.actorId === actorId)
  }
  if (action) {
    filtered = filtered.filter((e) => e.action === action)
  }

  // Sort newest first (immutable)
  const sorted = [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const total = sorted.length
  const entries = sorted.slice(offset, offset + limit)

  return { entries, total }
}
