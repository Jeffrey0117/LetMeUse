import { readFile, writeFile, mkdir, rename } from 'fs/promises'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const DB_TYPE = process.env.DB_TYPE ?? 'json'

// ── SQLite helpers (lazy-loaded) ────────────────────────

let _sqliteDb: import('better-sqlite3').Database | null = null

function getSqlite(): import('better-sqlite3').Database {
  if (_sqliteDb) return _sqliteDb
  const { getSqliteDb } = require('./db/sqlite') as { getSqliteDb: () => import('better-sqlite3').Database }
  _sqliteDb = getSqliteDb()
  return _sqliteDb
}

/** Map 'users.json' → 'users' */
function toTable(filename: string): string {
  return filename.replace(/\.json$/, '')
}

// ── JSON file helpers (original) ────────────────────────

const writeQueues = new Map<string, Promise<void>>()

async function ensureDataDir(): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true })
}

async function readJsonFile<T>(filename: string): Promise<T[]> {
  await ensureDataDir()
  const filePath = path.join(DATA_DIR, filename)
  try {
    const raw = await readFile(filePath, 'utf-8')
    return JSON.parse(raw) as T[]
  } catch {
    return []
  }
}

async function writeJsonFile<T>(filename: string, data: T[]): Promise<void> {
  await ensureDataDir()
  const filePath = path.join(DATA_DIR, filename)

  // Serialize writes per file to prevent race conditions
  const prevWrite = writeQueues.get(filePath) ?? Promise.resolve()
  let resolve: () => void
  const currentWrite = new Promise<void>((r) => { resolve = r })
  writeQueues.set(filePath, currentWrite)

  try {
    await prevWrite
    const tmpPath = `${filePath}.tmp.${Date.now()}`
    await writeFile(tmpPath, JSON.stringify(data, null, 2), 'utf-8')
    await rename(tmpPath, filePath)
  } finally {
    resolve!()
  }
}

// ── Generic CRUD ─────────────────────────────────────────

export interface HasId {
  id: string
}

export async function getAll<T extends HasId>(filename: string): Promise<T[]> {
  if (DB_TYPE === 'sqlite') {
    const db = getSqlite()
    const table = toTable(filename)
    const rows = db.prepare(`SELECT data FROM "${table}"`).all() as { data: string }[]
    return rows.map((r) => JSON.parse(r.data) as T)
  }
  return readJsonFile<T>(filename)
}

export async function getById<T extends HasId>(
  filename: string,
  id: string
): Promise<T | null> {
  if (DB_TYPE === 'sqlite') {
    const db = getSqlite()
    const table = toTable(filename)
    const row = db.prepare(`SELECT data FROM "${table}" WHERE id = ?`).get(id) as { data: string } | undefined
    return row ? JSON.parse(row.data) as T : null
  }
  const items = await readJsonFile<T>(filename)
  return items.find((item) => item.id === id) ?? null
}

export async function create<T extends HasId>(
  filename: string,
  item: T
): Promise<T> {
  if (DB_TYPE === 'sqlite') {
    const db = getSqlite()
    const table = toTable(filename)
    db.prepare(`INSERT INTO "${table}" (id, data) VALUES (?, ?)`).run(item.id, JSON.stringify(item))
    return item
  }
  const items = await readJsonFile<T>(filename)
  const updated = [...items, item]
  await writeJsonFile(filename, updated)
  return item
}

export async function update<T extends HasId>(
  filename: string,
  id: string,
  updates: Partial<T>
): Promise<T | null> {
  if (DB_TYPE === 'sqlite') {
    const db = getSqlite()
    const table = toTable(filename)
    const row = db.prepare(`SELECT data FROM "${table}" WHERE id = ?`).get(id) as { data: string } | undefined
    if (!row) return null
    const existing = JSON.parse(row.data) as T
    const merged = { ...existing, ...updates }
    db.prepare(`UPDATE "${table}" SET data = ? WHERE id = ?`).run(JSON.stringify(merged), id)
    return merged
  }
  const items = await readJsonFile<T>(filename)
  const index = items.findIndex((item) => item.id === id)
  if (index === -1) return null
  const updatedItem = { ...items[index], ...updates }
  const updatedItems = items.map((item, i) => (i === index ? updatedItem : item))
  await writeJsonFile(filename, updatedItems)
  return updatedItem
}

export async function remove<T extends HasId>(
  filename: string,
  id: string
): Promise<boolean> {
  if (DB_TYPE === 'sqlite') {
    const db = getSqlite()
    const table = toTable(filename)
    const result = db.prepare(`DELETE FROM "${table}" WHERE id = ?`).run(id)
    return result.changes > 0
  }
  const items = await readJsonFile<T>(filename)
  const filtered = items.filter((item) => item.id !== id)
  if (filtered.length === items.length) return false
  await writeJsonFile(filename, filtered)
  return true
}

export async function findByField<T extends HasId>(
  filename: string,
  field: keyof T,
  value: unknown
): Promise<T[]> {
  if (DB_TYPE === 'sqlite') {
    const db = getSqlite()
    const table = toTable(filename)
    const rows = db.prepare(
      `SELECT data FROM "${table}" WHERE json_extract(data, '$.${String(field)}') = ?`
    ).all(value) as { data: string }[]
    return rows.map((r) => JSON.parse(r.data) as T)
  }
  const items = await readJsonFile<T>(filename)
  return items.filter((item) => item[field] === value)
}

// ── File constants ───────────────────────────────────────

export const PROJECTS_FILE = 'projects.json'
export const ADS_FILE = 'ads.json'
export const APPS_FILE = 'apps.json'
export const USERS_FILE = 'users.json'
export const REFRESH_TOKENS_FILE = 'refresh_tokens.json'
export const VERIFICATION_TOKENS_FILE = 'verification_tokens.json'
export const WEBHOOK_EVENTS_FILE = 'webhook_events.json'
export const ROLES_FILE = 'roles.json'
export const AUDIT_LOG_FILE = 'audit_log.json'
export const SESSIONS_FILE = 'sessions.json'
export const PLANS_FILE = 'plans.json'
export const SUBSCRIPTIONS_FILE = 'subscriptions.json'
export const INVOICES_FILE = 'invoices.json'
export const CHECKOUT_SESSIONS_FILE = 'checkout_sessions.json'
export const EMAIL_LEADS_FILE = 'email_leads.json'
