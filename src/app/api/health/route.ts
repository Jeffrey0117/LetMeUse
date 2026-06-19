import { NextResponse } from 'next/server'
import { getRedis } from '@/lib/redis'

const DB_TYPE = process.env.DB_TYPE ?? 'json'

export async function GET() {
  let sqliteOk = false
  let redisOk = false

  // Check SQLite
  if (DB_TYPE === 'sqlite') {
    try {
      const { getSqliteDb } = require('@/lib/db/sqlite') as { getSqliteDb: () => import('better-sqlite3').Database }
      const db = getSqliteDb()
      const row = db.prepare('SELECT 1 as ok').get() as { ok: number } | undefined
      sqliteOk = row?.ok === 1
    } catch {
      sqliteOk = false
    }
  }

  // Check Redis
  try {
    const redis = getRedis()
    if (redis) {
      const pong = await redis.ping()
      redisOk = pong === 'PONG'
    }
  } catch {
    redisOk = false
  }

  const allOk = (DB_TYPE !== 'sqlite' || sqliteOk)

  return NextResponse.json(
    {
      status: allOk ? 'ok' : 'degraded',
      sqlite: DB_TYPE === 'sqlite' ? sqliteOk : null,
      redis: redisOk,
      uptime: process.uptime(),
    },
    { status: allOk ? 200 : 503 }
  )
}
