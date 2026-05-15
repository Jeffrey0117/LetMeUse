/**
 * Migration: Hash existing plaintext refresh tokens → SHA-256 tokenHash
 *
 * Usage:
 *   npx tsx scripts/hash-refresh-tokens.ts          # dry-run
 *   npx tsx scripts/hash-refresh-tokens.ts --run     # execute
 *
 * This script:
 *   1. Reads all refresh_tokens from SQLite
 *   2. For each record with a `token` field (plaintext), hashes it to `tokenHash`
 *   3. Removes the old `token` field
 *   4. Writes the updated record back
 *
 * Safe to re-run: records that already have `tokenHash` are skipped.
 */

import Database from 'better-sqlite3'
import { createHash } from 'crypto'
import path from 'path'
import { existsSync } from 'fs'

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

const dbPath = path.join(process.cwd(), 'data', 'letmeuse.db')
const dryRun = !process.argv.includes('--run')

if (!existsSync(dbPath)) {
  console.error(`Database not found: ${dbPath}`)
  process.exit(1)
}

const db = new Database(dbPath, { readonly: dryRun })

interface RawRow {
  id: string
  data: string
}

const rows = db.prepare('SELECT id, data FROM refresh_tokens').all() as RawRow[]

console.log(`Found ${rows.length} refresh token records`)

let migrated = 0
let skipped = 0
let errors = 0

const updateStmt = dryRun ? null : db.prepare('UPDATE refresh_tokens SET data = ? WHERE id = ?')

if (!dryRun) {
  db.exec('BEGIN')
}

try {
  for (const row of rows) {
    const record = JSON.parse(row.data) as Record<string, unknown>

    // Already migrated
    if (record.tokenHash && !record.token) {
      skipped++
      continue
    }

    // Has plaintext token — hash it
    if (record.token && typeof record.token === 'string') {
      const hashed = hashToken(record.token as string)

      if (dryRun) {
        const preview = (record.token as string).slice(0, 20) + '...'
        console.log(`  [DRY] ${row.id}: token=${preview} → tokenHash=${hashed.slice(0, 16)}...`)
        migrated++
        continue
      }

      const { token: _removed, ...rest } = record
      const updated = { ...rest, tokenHash: hashed }
      updateStmt!.run(JSON.stringify(updated), row.id)
      migrated++
    } else {
      console.warn(`  [WARN] ${row.id}: no token or tokenHash field found`)
      errors++
    }
  }

  if (!dryRun) {
    db.exec('COMMIT')
  }
} catch (err) {
  if (!dryRun) {
    db.exec('ROLLBACK')
  }
  console.error('Migration failed:', err)
  process.exit(1)
}

db.close()

console.log('')
console.log(`Results${dryRun ? ' (DRY RUN)' : ''}:`)
console.log(`  Migrated: ${migrated}`)
console.log(`  Skipped (already hashed): ${skipped}`)
console.log(`  Errors: ${errors}`)

if (dryRun && migrated > 0) {
  console.log('')
  console.log('Run with --run to execute the migration:')
  console.log('  npx tsx scripts/hash-refresh-tokens.ts --run')
}
