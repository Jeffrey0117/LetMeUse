/**
 * Database provider entry point.
 *
 * Set DB_TYPE=sqlite in .env to use SQLite backend.
 * Default: JSON file storage (no setup required).
 */

import type { Repository } from './repository'
import { JsonRepository } from './json-repository'

export type { Repository, QueryOptions } from './repository'
export { COLLECTIONS } from './repository'

const DB_TYPE = process.env.DB_TYPE ?? 'json'

let instance: Repository | null = null

export function getRepository(): Repository {
  if (instance) return instance

  if (DB_TYPE === 'sqlite') {
    // Dynamic import to avoid loading better-sqlite3 when using JSON
    const { SqliteRepository } = require('./sqlite-repository') as { SqliteRepository: new () => Repository }
    instance = new SqliteRepository()
  } else {
    instance = new JsonRepository()
  }

  return instance
}
