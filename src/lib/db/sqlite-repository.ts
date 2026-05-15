/**
 * SQLite Repository — implements Repository interface using better-sqlite3.
 *
 * Each collection maps to a table with (id TEXT, data TEXT).
 * Queries use json_extract() for WHERE filters, with indexes on hot paths.
 */

import type { Repository, QueryOptions } from './repository'
import { getSqliteDb } from './sqlite'

// Map collection names → table names (same names, but validated)
const VALID_TABLES = new Set([
  'apps', 'users', 'sessions', 'refresh_tokens', 'verification_tokens',
  'audit_log', 'roles', 'plans', 'subscriptions', 'invoices',
  'projects', 'ads', 'webhook_events', 'checkout_sessions', 'email_leads',
])

function assertTable(collection: string): string {
  if (!VALID_TABLES.has(collection)) {
    throw new Error(`Unknown collection: ${collection}`)
  }
  return collection
}

export class SqliteRepository implements Repository {
  async findAll<T>(collection: string, options?: QueryOptions): Promise<{ data: T[]; total: number }> {
    const table = assertTable(collection)
    const db = getSqliteDb()

    const whereClauses: string[] = []
    const params: unknown[] = []

    // Build WHERE from options.where
    if (options?.where) {
      for (const [key, value] of Object.entries(options.where)) {
        whereClauses.push(`json_extract(data, '$.${key}') = ?`)
        params.push(value)
      }
    }

    const whereStr = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : ''

    // Count total before pagination
    const countRow = db.prepare(`SELECT COUNT(*) as cnt FROM ${table} ${whereStr}`).get(...params) as { cnt: number }
    const total = countRow.cnt

    // Build ORDER BY
    let orderStr = ''
    if (options?.orderBy) {
      const dir = options.orderBy.direction === 'desc' ? 'DESC' : 'ASC'
      orderStr = `ORDER BY json_extract(data, '$.${options.orderBy.field}') ${dir}`
    }

    // Build LIMIT / OFFSET
    let limitStr = ''
    if (options?.limit != null) {
      limitStr = `LIMIT ${options.limit}`
      if (options?.offset != null) {
        limitStr += ` OFFSET ${options.offset}`
      }
    } else if (options?.offset != null) {
      limitStr = `LIMIT -1 OFFSET ${options.offset}`
    }

    const rows = db.prepare(
      `SELECT data FROM ${table} ${whereStr} ${orderStr} ${limitStr}`
    ).all(...params) as { data: string }[]

    return {
      data: rows.map((r) => JSON.parse(r.data) as T),
      total,
    }
  }

  async findById<T>(collection: string, id: string): Promise<T | null> {
    const table = assertTable(collection)
    const db = getSqliteDb()
    const row = db.prepare(`SELECT data FROM ${table} WHERE id = ?`).get(id) as { data: string } | undefined
    return row ? JSON.parse(row.data) as T : null
  }

  async findOne<T>(collection: string, where: Record<string, unknown>): Promise<T | null> {
    const table = assertTable(collection)
    const db = getSqliteDb()

    const clauses: string[] = []
    const params: unknown[] = []
    for (const [key, value] of Object.entries(where)) {
      clauses.push(`json_extract(data, '$.${key}') = ?`)
      params.push(value)
    }

    const row = db.prepare(
      `SELECT data FROM ${table} WHERE ${clauses.join(' AND ')} LIMIT 1`
    ).get(...params) as { data: string } | undefined

    return row ? JSON.parse(row.data) as T : null
  }

  async create<T>(collection: string, item: T): Promise<T> {
    const table = assertTable(collection)
    const db = getSqliteDb()
    const id = (item as Record<string, unknown>).id as string
    db.prepare(`INSERT INTO ${table} (id, data) VALUES (?, ?)`).run(id, JSON.stringify(item))
    return item
  }

  async update<T>(collection: string, id: string, updates: Partial<T>): Promise<T | null> {
    const table = assertTable(collection)
    const db = getSqliteDb()

    const row = db.prepare(`SELECT data FROM ${table} WHERE id = ?`).get(id) as { data: string } | undefined
    if (!row) return null

    const existing = JSON.parse(row.data) as Record<string, unknown>
    const merged = { ...existing, ...updates }
    db.prepare(`UPDATE ${table} SET data = ? WHERE id = ?`).run(JSON.stringify(merged), id)
    return merged as T
  }

  async remove(collection: string, id: string): Promise<boolean> {
    const table = assertTable(collection)
    const db = getSqliteDb()
    const result = db.prepare(`DELETE FROM ${table} WHERE id = ?`).run(id)
    return result.changes > 0
  }

  async createMany<T>(collection: string, items: T[]): Promise<T[]> {
    const table = assertTable(collection)
    const db = getSqliteDb()
    const stmt = db.prepare(`INSERT INTO ${table} (id, data) VALUES (?, ?)`)
    const insertAll = db.transaction((rows: T[]) => {
      for (const item of rows) {
        const id = (item as Record<string, unknown>).id as string
        stmt.run(id, JSON.stringify(item))
      }
    })
    insertAll(items)
    return items
  }

  async removeMany(collection: string, ids: string[]): Promise<number> {
    const table = assertTable(collection)
    const db = getSqliteDb()
    const placeholders = ids.map(() => '?').join(',')
    const result = db.prepare(`DELETE FROM ${table} WHERE id IN (${placeholders})`).run(...ids)
    return result.changes
  }

  async runMigrations(): Promise<void> {
    // Tables are created in getSqliteDb() → createTables()
    // No additional migrations needed for now
  }

  async ping(): Promise<boolean> {
    try {
      const db = getSqliteDb()
      const row = db.prepare('SELECT 1 as ok').get() as { ok: number }
      return row.ok === 1
    } catch {
      return false
    }
  }
}
