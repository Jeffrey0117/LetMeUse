#!/usr/bin/env tsx
/**
 * JSON → SQLite Migration Script
 *
 * Reads all JSON data files from data/ and inserts into SQLite tables.
 *
 * Usage:
 *   npx tsx scripts/migrate-to-sqlite.ts            # dry-run (preview)
 *   npx tsx scripts/migrate-to-sqlite.ts --run       # execute migration
 *   npx tsx scripts/migrate-to-sqlite.ts --run --force  # overwrite existing DB
 */

import Database from 'better-sqlite3'
import { readFileSync, existsSync, renameSync } from 'fs'
import path from 'path'
import { createTables } from '../src/lib/db/schema'

const DATA_DIR = path.join(process.cwd(), 'data')
const DB_PATH = path.join(DATA_DIR, 'letmeuse.db')

const args = process.argv.slice(2)
const dryRun = !args.includes('--run')
const force = args.includes('--force')

// Map JSON filenames → table names
const FILE_TABLE_MAP: Record<string, string> = {
  'apps.json': 'apps',
  'users.json': 'users',
  'sessions.json': 'sessions',
  'refresh_tokens.json': 'refresh_tokens',
  'verification_tokens.json': 'verification_tokens',
  'audit_log.json': 'audit_log',
  'roles.json': 'roles',
  'plans.json': 'plans',
  'subscriptions.json': 'subscriptions',
  'invoices.json': 'invoices',
  'projects.json': 'projects',
  'ads.json': 'ads',
  'webhook_events.json': 'webhook_events',
  'checkout_sessions.json': 'checkout_sessions',
  'email_leads.json': 'email_leads',
}

interface HasId {
  id: string
}

function readJsonData(filename: string): HasId[] {
  const filePath = path.join(DATA_DIR, filename)
  if (!existsSync(filePath)) return []
  try {
    const raw = readFileSync(filePath, 'utf-8')
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function main(): void {
  console.log('=== LetMeUse JSON → SQLite Migration ===\n')

  if (dryRun) {
    console.log('  DRY RUN — no changes will be made.')
    console.log('  Use --run to execute migration.\n')
  }

  // Check existing DB
  if (existsSync(DB_PATH) && !force) {
    if (dryRun) {
      console.log(`  DB already exists at ${DB_PATH}`)
      console.log('  Use --force to overwrite.\n')
    } else {
      console.log(`  DB already exists at ${DB_PATH}`)
      console.log('  Use --force to overwrite. Aborting.')
      process.exit(1)
    }
  }

  // Scan JSON files
  let totalRecords = 0
  const fileSummary: { file: string; table: string; count: number }[] = []

  for (const [filename, table] of Object.entries(FILE_TABLE_MAP)) {
    const items = readJsonData(filename)
    fileSummary.push({ file: filename, table, count: items.length })
    totalRecords += items.length
  }

  console.log('  Source files:\n')
  for (const { file, table, count } of fileSummary) {
    const status = count > 0 ? `${count} records` : 'empty'
    console.log(`    ${file.padEnd(30)} → ${table.padEnd(22)} (${status})`)
  }
  console.log(`\n  Total: ${totalRecords} records across ${fileSummary.filter(f => f.count > 0).length} collections.\n`)

  if (dryRun) {
    console.log('  Run with --run to execute migration.')
    return
  }

  // Execute migration
  console.log('  Creating database...')

  // Backup existing DB if force
  if (existsSync(DB_PATH) && force) {
    const backupPath = `${DB_PATH}.bak.${Date.now()}`
    renameSync(DB_PATH, backupPath)
    console.log(`  Backed up existing DB to ${path.basename(backupPath)}`)
  }

  const db = new Database(DB_PATH)
  db.pragma('journal_mode = WAL')
  db.pragma('synchronous = NORMAL')

  // Create tables
  createTables(db)
  console.log('  Tables and indexes created.')

  // Insert data
  let migrated = 0
  let skipped = 0

  for (const { file, table, count } of fileSummary) {
    if (count === 0) continue

    const items = readJsonData(file)
    const stmt = db.prepare(`INSERT OR IGNORE INTO "${table}" (id, data) VALUES (?, ?)`)

    const insertAll = db.transaction((rows: HasId[]) => {
      let inserted = 0
      for (const item of rows) {
        if (!item.id) {
          skipped++
          continue
        }
        const result = stmt.run(item.id, JSON.stringify(item))
        if (result.changes > 0) inserted++
        else skipped++
      }
      return inserted
    })

    const inserted = insertAll(items)
    migrated += inserted
    console.log(`  ✓ ${table}: ${inserted} records inserted`)
  }

  // Verify counts
  console.log('\n  Verification:')
  for (const { table, count } of fileSummary) {
    if (count === 0) continue
    const row = db.prepare(`SELECT COUNT(*) as cnt FROM "${table}"`).get() as { cnt: number }
    const match = row.cnt === count ? '✓' : '✗'
    console.log(`    ${match} ${table}: ${row.cnt} rows (expected ${count})`)
  }

  db.close()

  console.log(`\n  Migration complete: ${migrated} records migrated, ${skipped} skipped.`)
  console.log(`  Database: ${DB_PATH}`)
  console.log('\n  Next steps:')
  console.log('  1. Add DB_TYPE=sqlite to .env')
  console.log('  2. Restart the server')
  console.log('  3. Verify auth works correctly')
  console.log('  4. (Optional) Archive JSON files to data/json-backup/')
}

main()
