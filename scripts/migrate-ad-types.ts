/**
 * Migration script: converts old ad type IDs to new ones in data/ads.json.
 *
 * Mapping:
 *   sidebar        → sidebar-card
 *   in-article-card → in-article-banner
 *   bottom-banner   → bottom-banner (no change)
 *
 * Also updates positions for migrated types:
 *   sidebar-card with no valid position → sidebar-right
 *   in-article-banner with no valid position → inline
 *
 * Usage: npx tsx scripts/migrate-ad-types.ts
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

const TYPE_MAP: Record<string, string> = {
  sidebar: 'sidebar-card',
  'in-article-card': 'in-article-banner',
}

const TYPE_DEFAULT_POSITIONS: Record<string, string> = {
  'bottom-banner': 'fixed-bottom',
  'top-notification': 'fixed-top',
  'in-article-banner': 'inline',
  'modal-popup': 'fixed',
  'sidebar-card': 'sidebar-right',
}

const filePath = join(process.cwd(), 'data', 'ads.json')

if (!existsSync(filePath)) {
  console.log('No data/ads.json found — nothing to migrate.')
  process.exit(0)
}

const raw = readFileSync(filePath, 'utf-8')
const ads: Array<Record<string, unknown>> = JSON.parse(raw)

let changed = 0

const migrated = ads.map((ad) => {
  const oldType = ad.type as string
  const newType = TYPE_MAP[oldType] ?? oldType

  if (newType === oldType) return ad

  changed++
  const defaultPos = TYPE_DEFAULT_POSITIONS[newType] ?? ad.position

  return {
    ...ad,
    type: newType,
    position: defaultPos,
  }
})

writeFileSync(filePath, JSON.stringify(migrated, null, 2), 'utf-8')
console.log(`Migration complete. ${changed} ad(s) updated out of ${ads.length} total.`)
