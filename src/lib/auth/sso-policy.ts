// SSO 靠 email 對應目標 app 的帳號。多數 app 不強制驗證信箱,任何人都能在那些
// app 用別人的 email 註冊,所以沒驗證過的來源帳號不能拿來進入目標 app 已存在
// 的帳號,否則就是跨 app 帳號接管。目標 app 還沒有這個 email 時可以開新帳號,
// 新帳號繼承「未驗證」狀態,碰不到任何既有資料。
export function canRedeemIntoExistingAccount(source: { emailVerified?: boolean }): boolean {
  return source.emailVerified === true
}
