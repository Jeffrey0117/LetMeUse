/**
 * SQLite schema — table definitions and indexes.
 *
 * Each collection gets its own table with:
 *   - `id` TEXT PRIMARY KEY (extracted for fast lookups)
 *   - `data` TEXT (full JSON object)
 *
 * Hot-path columns are indexed via json_extract().
 */

import type Database from 'better-sqlite3'

// ── Table definitions ────────────────────────────────────

const TABLES: string[] = [
  // Core auth
  `CREATE TABLE IF NOT EXISTS apps (
    id TEXT PRIMARY KEY,
    data TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    data TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    data TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS refresh_tokens (
    id TEXT PRIMARY KEY,
    data TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS verification_tokens (
    id TEXT PRIMARY KEY,
    data TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS audit_log (
    id TEXT PRIMARY KEY,
    data TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS roles (
    id TEXT PRIMARY KEY,
    data TEXT NOT NULL
  )`,

  // Billing
  `CREATE TABLE IF NOT EXISTS plans (
    id TEXT PRIMARY KEY,
    data TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS subscriptions (
    id TEXT PRIMARY KEY,
    data TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS invoices (
    id TEXT PRIMARY KEY,
    data TEXT NOT NULL
  )`,

  // Other
  `CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    data TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS ads (
    id TEXT PRIMARY KEY,
    data TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS webhook_events (
    id TEXT PRIMARY KEY,
    data TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS checkout_sessions (
    id TEXT PRIMARY KEY,
    data TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS email_leads (
    id TEXT PRIMARY KEY,
    data TEXT NOT NULL
  )`,
]

// ── Indexes for hot-path queries ─────────────────────────

const INDEXES: string[] = [
  // Users: lookup by (appId, email) — login, register, duplicate check
  `CREATE INDEX IF NOT EXISTS idx_users_app_email ON users(
    json_extract(data, '$.appId'),
    json_extract(data, '$.email')
  )`,
  // Users: list by appId
  `CREATE INDEX IF NOT EXISTS idx_users_app ON users(
    json_extract(data, '$.appId')
  )`,

  // Sessions: lookup by userId (list sessions, cleanup)
  `CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(
    json_extract(data, '$.userId')
  )`,
  // Sessions: lookup by refreshTokenId
  `CREATE INDEX IF NOT EXISTS idx_sessions_rt ON sessions(
    json_extract(data, '$.refreshTokenId')
  )`,

  // Refresh tokens: lookup by tokenHash (validation)
  `CREATE INDEX IF NOT EXISTS idx_rt_token_hash ON refresh_tokens(
    json_extract(data, '$.tokenHash')
  )`,
  // Refresh tokens: lookup by userId (cleanup)
  `CREATE INDEX IF NOT EXISTS idx_rt_user ON refresh_tokens(
    json_extract(data, '$.userId')
  )`,

  // Verification tokens: lookup by token string
  `CREATE INDEX IF NOT EXISTS idx_vt_token ON verification_tokens(
    json_extract(data, '$.token')
  )`,

  // Audit log: filter by appId + time range
  `CREATE INDEX IF NOT EXISTS idx_audit_app_time ON audit_log(
    json_extract(data, '$.appId'),
    json_extract(data, '$.createdAt')
  )`,
  // Audit log: filter by action
  `CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_log(
    json_extract(data, '$.action')
  )`,

  // Roles: lookup by appId
  `CREATE INDEX IF NOT EXISTS idx_roles_app ON roles(
    json_extract(data, '$.appId')
  )`,

  // Subscriptions: lookup by userId + appId
  `CREATE INDEX IF NOT EXISTS idx_subs_user_app ON subscriptions(
    json_extract(data, '$.userId'),
    json_extract(data, '$.appId')
  )`,
]

// ── Create all tables and indexes ────────────────────────

export function createTables(db: Database.Database): void {
  db.exec('BEGIN')
  try {
    for (const sql of TABLES) {
      db.exec(sql)
    }
    for (const sql of INDEXES) {
      db.exec(sql)
    }
    db.exec('COMMIT')
  } catch (err) {
    db.exec('ROLLBACK')
    throw err
  }
}
