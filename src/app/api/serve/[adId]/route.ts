import { NextResponse } from 'next/server'

// 廣告/小工具嵌入已移到獨立的 adman 專案。這裡原本公開提供舊廣告內容給
// /embed/letmeuse.js 畫到別人的頁面上,而那支嵌入碼對內容沒有做好跳脫。
// 兩者一併停用。
function gone() {
  return NextResponse.json(
    { error: 'This feature has moved to the standalone adman app.' },
    { status: 410 }
  )
}

export function GET() { return gone() }
