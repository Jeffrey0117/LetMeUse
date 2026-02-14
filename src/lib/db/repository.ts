/**
 * Database Repository Interface
 *
 * Abstraction layer over the storage backend.
 * Currently implemented with JSON files, but designed to be
 * swapped out for SQLite, PostgreSQL, or any other database.
 *
 * Usage:
 *   import { getRepository } from '@/lib/db/repository'
 *   const repo = getRepository()
 *   const users = await repo.findAll('users', { appId: 'app_xxx' })
 */

export interface QueryOptions {
  where?: Record<string, unknown>
  orderBy?: { field: string; direction: 'asc' | 'desc' }
  limit?: number
  offset?: number
}

export interface Repository {
  // CRUD
  findAll<T>(collection: string, options?: QueryOptions): Promise<{ data: T[]; total: number }>
  findById<T>(collection: string, id: string): Promise<T | null>
  findOne<T>(collection: string, where: Record<string, unknown>): Promise<T | null>
  create<T>(collection: string, item: T): Promise<T>
  update<T>(collection: string, id: string, updates: Partial<T>): Promise<T | null>
  remove(collection: string, id: string): Promise<boolean>

  // Batch operations
  createMany<T>(collection: string, items: T[]): Promise<T[]>
  removeMany(collection: string, ids: string[]): Promise<number>

  // Migrations
  runMigrations?(): Promise<void>

  // Health check
  ping(): Promise<boolean>
}

// ── Collection name constants ───────────────────────────

export const COLLECTIONS = {
  PROJECTS: 'projects',
  ADS: 'ads',
  APPS: 'apps',
  USERS: 'users',
  REFRESH_TOKENS: 'refresh_tokens',
  VERIFICATION_TOKENS: 'verification_tokens',
  WEBHOOK_EVENTS: 'webhook_events',
  ROLES: 'roles',
  AUDIT_LOG: 'audit_log',
  SESSIONS: 'sessions',
  PLANS: 'plans',
  SUBSCRIPTIONS: 'subscriptions',
  INVOICES: 'invoices',
} as const
