import { NextResponse } from 'next/server'

// 這支原本讓「任何 app 的任何會員」上傳檔案(含 SVG)到本站 public/uploads,
// 等於讓外人把可執行內容放上發 token 的這個網域。唯一的呼叫端是已移到 adman
// 的廣告編輯器,所以停用。頭像上傳走 /api/auth/avatar,不受影響。
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
