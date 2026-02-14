/**
 * JSON → Database Migration Script
 *
 * Usage:
 *   npx tsx src/lib/db/migrate.ts
 *
 * This script reads all JSON data files and inserts them into
 * the database using the Repository interface. It can be used
 * when switching from JSON file storage to SQLite/PostgreSQL.
 *
 * Prerequisites:
 *   1. Set DB_TYPE=sqlite (or postgres) in .env
 *   2. Run schema.sql to create tables
 *   3. Run this migration script
 *
 * Note: This is a reference implementation. Update getRepository()
 * in src/lib/db/index.ts to return the proper database repository
 * before running this script.
 */

import { readFile } from 'fs/promises'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')

const FILE_TO_COLLECTION: Record<string, string> = {
  'projects.json': 'projects',
  'ads.json': 'ads',
  'apps.json': 'apps',
  'users.json': 'users',
  'refresh_tokens.json': 'refresh_tokens',
  'verification_tokens.json': 'verification_tokens',
  'webhook_events.json': 'webhook_events',
  'roles.json': 'roles',
  'audit_log.json': 'audit_log',
  'sessions.json': 'sessions',
  'plans.json': 'plans',
  'subscriptions.json': 'subscriptions',
  'invoices.json': 'invoices',
}

async function readJsonData(filename: string): Promise<unknown[]> {
  try {
    const raw = await readFile(path.join(DATA_DIR, filename), 'utf-8')
    return JSON.parse(raw)
  } catch {
    return []
  }
}

async function migrate() {
  console.log('Starting JSON → Database migration...\n')

  for (const [file, collection] of Object.entries(FILE_TO_COLLECTION)) {
    const data = await readJsonData(file)
    console.log(`  ${collection}: ${data.length} records`)

    if (data.length === 0) continue

    // TODO: When a real database repository is implemented,
    // use getRepository().createMany(collection, data) here.
    // For now, this just reports what would be migrated.
  }

  console.log('\nMigration plan complete.')
  console.log('To actually migrate, implement a database repository')
  console.log('and uncomment the createMany calls above.')
}

migrate().catch(console.error)
