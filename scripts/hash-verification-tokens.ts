/**
 * Migration: hash plaintext verification tokens → tokenHash (SHA-256).
 *
 * Reads all verification_tokens, replaces `token` with `tokenHash`,
 * and writes the updated records back.
 *
 * Usage:
 *   npx tsx scripts/hash-verification-tokens.ts
 *   npx tsx scripts/hash-verification-tokens.ts --dry-run
 */

import { createHash } from 'crypto'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import path from 'path'

const DRY_RUN = process.argv.includes('--dry-run')
const DATA_DIR = path.join(process.cwd(), 'data')
const DB_TYPE = process.env.DB_TYPE ?? 'json'

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

interface OldToken {
  id: string
  token: string
  tokenHash?: string
  [key: string]: unknown
}

interface NewToken {
  id: string
  tokenHash: string
  [key: string]: unknown
}

function migrateJson(): void {
  const filePath = path.join(DATA_DIR, 'verification_tokens.json')
  if (!existsSync(filePath)) {
    console.log('No verification_tokens.json found — nothing to migrate.')
    return
  }

  const raw = readFileSync(filePath, 'utf-8')
  const tokens: OldToken[] = JSON.parse(raw)

  let migrated = 0
  let skipped = 0

  const updated: NewToken[] = tokens.map((t) => {
    if (t.tokenHash && !t.token) {
      skipped++
      return t as unknown as NewToken
    }

    if (!t.token) {
      skipped++
      return t as unknown as NewToken
    }

    migrated++
    const { token: plainToken, ...rest } = t
    return { ...rest, tokenHash: hashToken(plainToken) } as NewToken
  })

  console.log(`JSON: ${migrated} tokens to hash, ${skipped} already hashed.`)

  if (DRY_RUN) {
    console.log('[DRY RUN] No changes written.')
    return
  }

  writeFileSync(filePath, JSON.stringify(updated, null, 2), 'utf-8')
  console.log('JSON migration complete.')
}

function migrateSqlite(): void {
  let Database: typeof import('better-sqlite3')
  try {
    Database = require('better-sqlite3')
  } catch {
    console.log('better-sqlite3 not available — skipping SQLite migration.')
    return
  }

  const dbPath = path.join(DATA_DIR, 'letmeuse.db')
  if (!existsSync(dbPath)) {
    console.log('No letmeuse.db found — nothing to migrate.')
    return
  }

  const db = new Database(dbPath)

  const rows = db.prepare('SELECT id, data FROM verification_tokens').all() as { id: string; data: string }[]

  let migrated = 0
  let skipped = 0

  const updateStmt = db.prepare('UPDATE verification_tokens SET data = ? WHERE id = ?')

  const runMigration = db.transaction(() => {
    for (const row of rows) {
      const parsed = JSON.parse(row.data) as OldToken

      if (parsed.tokenHash && !parsed.token) {
        skipped++
        continue
      }

      if (!parsed.token) {
        skipped++
        continue
      }

      const { token: plainToken, ...rest } = parsed
      const updated = { ...rest, tokenHash: hashToken(plainToken) }

      if (!DRY_RUN) {
        updateStmt.run(JSON.stringify(updated), row.id)
      }
      migrated++
    }
  })

  runMigration()

  console.log(`SQLite: ${migrated} tokens hashed, ${skipped} already hashed.`)
  if (DRY_RUN) {
    console.log('[DRY RUN] No changes written.')
  } else {
    console.log('SQLite migration complete.')
  }

  db.close()
}

console.log(`Migrating verification tokens (DB_TYPE=${DB_TYPE})...`)

if (DB_TYPE === 'sqlite') {
  migrateSqlite()
} else {
  migrateJson()
}
