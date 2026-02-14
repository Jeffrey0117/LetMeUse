/**
 * JSON File Repository — implements Repository interface
 * using the existing JSON file storage system.
 *
 * This is the default backend that works without any database setup.
 */

import type { Repository, QueryOptions } from './repository'
import { getAll, getById, create, update, remove } from '../storage'
import type { HasId } from '../storage'

const COLLECTION_FILE_MAP: Record<string, string> = {
  projects: 'projects.json',
  ads: 'ads.json',
  apps: 'apps.json',
  users: 'users.json',
  refresh_tokens: 'refresh_tokens.json',
  verification_tokens: 'verification_tokens.json',
  webhook_events: 'webhook_events.json',
  roles: 'roles.json',
  audit_log: 'audit_log.json',
  sessions: 'sessions.json',
  plans: 'plans.json',
  subscriptions: 'subscriptions.json',
  invoices: 'invoices.json',
}

function getFileName(collection: string): string {
  return COLLECTION_FILE_MAP[collection] ?? `${collection}.json`
}

export class JsonRepository implements Repository {
  async findAll<T>(collection: string, options?: QueryOptions): Promise<{ data: T[]; total: number }> {
    const file = getFileName(collection)
    let items = await getAll<T & HasId>(file)

    // Apply where filters
    if (options?.where) {
      for (const [key, value] of Object.entries(options.where)) {
        items = items.filter((item) => (item as Record<string, unknown>)[key] === value)
      }
    }

    // Apply ordering
    if (options?.orderBy) {
      const { field, direction } = options.orderBy
      items.sort((a, b) => {
        const aVal = (a as Record<string, unknown>)[field]
        const bVal = (b as Record<string, unknown>)[field]
        if (aVal === bVal) return 0
        if (aVal === undefined || aVal === null) return 1
        if (bVal === undefined || bVal === null) return -1
        const cmp = aVal < bVal ? -1 : 1
        return direction === 'desc' ? -cmp : cmp
      })
    }

    const total = items.length
    const offset = options?.offset ?? 0
    const limit = options?.limit ?? items.length

    return {
      data: items.slice(offset, offset + limit) as unknown as T[],
      total,
    }
  }

  async findById<T>(collection: string, id: string): Promise<T | null> {
    const file = getFileName(collection)
    return getById<T & HasId>(file, id) as Promise<T | null>
  }

  async findOne<T>(collection: string, where: Record<string, unknown>): Promise<T | null> {
    const file = getFileName(collection)
    const items = await getAll<T & HasId>(file)
    const match = items.find((item) => {
      return Object.entries(where).every(([key, value]) => (item as Record<string, unknown>)[key] === value)
    })
    return (match as unknown as T) ?? null
  }

  async create<T>(collection: string, item: T): Promise<T> {
    const file = getFileName(collection)
    return create<T & HasId>(file, item as T & HasId) as unknown as Promise<T>
  }

  async update<T>(collection: string, id: string, updates: Partial<T>): Promise<T | null> {
    const file = getFileName(collection)
    return update<T & HasId>(file, id, updates as Partial<T & HasId>) as unknown as Promise<T | null>
  }

  async remove(collection: string, id: string): Promise<boolean> {
    const file = getFileName(collection)
    return remove(file, id)
  }

  async createMany<T>(collection: string, items: T[]): Promise<T[]> {
    const results: T[] = []
    for (const item of items) {
      const created = await this.create<T>(collection, item)
      results.push(created)
    }
    return results
  }

  async removeMany(collection: string, ids: string[]): Promise<number> {
    let count = 0
    for (const id of ids) {
      const removed = await this.remove(collection, id)
      if (removed) count++
    }
    return count
  }

  async ping(): Promise<boolean> {
    return true
  }
}
