/**
 * Database provider entry point.
 *
 * Currently uses JSON file storage.
 * To migrate to SQLite or PostgreSQL:
 *
 * 1. Create a new class implementing Repository (e.g. SqliteRepository)
 * 2. Update getRepository() to return the new implementation
 * 3. Run migrations via repo.runMigrations()
 *
 * Example:
 *   // sqlite-repository.ts
 *   import Database from 'better-sqlite3'
 *   export class SqliteRepository implements Repository { ... }
 *
 *   // index.ts
 *   import { SqliteRepository } from './sqlite-repository'
 *   const DB_TYPE = process.env.DB_TYPE ?? 'json'
 *   if (DB_TYPE === 'sqlite') return new SqliteRepository()
 */

import type { Repository } from './repository'
import { JsonRepository } from './json-repository'

export type { Repository, QueryOptions } from './repository'
export { COLLECTIONS } from './repository'

let instance: Repository | null = null

export function getRepository(): Repository {
  if (instance) return instance

  // Future: check process.env.DB_TYPE for 'sqlite' | 'postgres' | 'json'
  instance = new JsonRepository()
  return instance
}
