import { NextResponse } from 'next/server'

// 廣告產生器 (projects/ads) 已移到獨立的 adman 專案。
// LetMeUse 是純 auth IdP — 此端點停用 (本來是匿名 CRUD = 安全洞)。
function gone() {
  return NextResponse.json(
    { error: 'This feature has moved to the standalone adman app.' },
    { status: 410 }
  )
}

export function GET() { return gone() }
export function POST() { return gone() }
export function PUT() { return gone() }
export function DELETE() { return gone() }
