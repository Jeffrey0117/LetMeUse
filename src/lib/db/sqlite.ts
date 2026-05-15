/**
 * SQLite connection — lazy singleton with WAL mode.
 *
 * Usage:
 *   import { getSqliteDb } from '@/lib/db/sqlite'
 *   const db = getSqliteDb()
 *   db.prepare('SELECT ...').all()
 */

import Database from 'better-sqlite3'
import path from 'path'
import { createTables } from './schema'

const DATA_DIR = path.join(process.cwd(), 'data')

let db: Database.Database | null = null

export function getSqliteDb(): Database.Database {
  if (db) return db

  const dbPath = path.join(DATA_DIR, 'letmeuse.db')
  db = new Database(dbPath)

  // Performance pragmas
  db.pragma('journal_mode = WAL')
  db.pragma('busy_timeout = 5000')
  db.pragma('synchronous = NORMAL')
  db.pragma('foreign_keys = ON')

  // Create tables + indexes on first connection
  createTables(db)

  return db
}

/**
 * Close the database connection (for graceful shutdown).
 */
export function closeSqliteDb(): void {
  if (db) {
    db.close()
    db = null
  }
}
