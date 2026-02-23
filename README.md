# LetMeUse

**Auth-as-a-Service platform.** Add authentication to any website with a single `<script>` tag.

**認證即服務平台。** 只需一行 `<script>` 標籤即可為任何網站加入完整的登入/註冊/帳號管理系統。

> **Sister Project / 姊妹專案:** [ShipShop](https://github.com/Jeffrey0117/ShipShop) — Modular SaaS template with multi-tenant architecture, billing, and 10 pluggable feature modules. LetMeUse extracts and externalizes the auth layer as a standalone service that any website can consume via SDK.
>
> ShipShop 是模組化 SaaS 模板（多租戶、計費、10 個可插拔功能模組）。LetMeUse 將其中的認證層獨立出來，成為任何網站都能透過 SDK 使用的獨立認證服務。

---

## Features / 功能

| Feature | Description |
|---------|-------------|
| **SDK Modal** | Drop-in login / register / profile modal with Shadow DOM isolation<br>即插即用的登入/註冊/個人資料 Modal，Shadow DOM 隔離樣式 |
| **Multi-App** | Manage multiple client apps from one instance<br>一個實例管理多個客戶端應用 |
| **OAuth** | Google social login with per-app credentials<br>Google 第三方登入，每個 App 獨立設定 |
| **Email Verification** | SMTP email verification via nodemailer<br>透過 nodemailer SMTP 進行 Email 驗證 |
| **Forgot Password** | Inline forgot / reset password flow in SDK modal<br>SDK Modal 內建忘記密碼/重設密碼流程 |
| **Avatar Upload** | Profile photo upload with camera overlay preview<br>大頭照上傳，帶相機覆蓋層預覽 |
| **Auto Theme** | SDK detects host page dark/light mode via MutationObserver<br>SDK 透過 MutationObserver 自動偵測宿主頁面深/淺色模式 |
| **RBAC** | Custom roles and granular permissions<br>自訂角色與細粒度權限 |
| **Webhooks** | Event notifications with HMAC signing<br>事件通知，HMAC 簽章驗證 |
| **Audit Log** | Track all auth events<br>追蹤所有認證事件 |
| **Sessions** | View and revoke user sessions<br>檢視與撤銷使用者 Session |
| **Billing** | Plans, subscriptions, invoices (pluggable provider)<br>方案、訂閱、發票（可插拔支付供應商） |
| **i18n** | English + Chinese<br>英文 + 中文 |

---

## Quick Start / 快速開始

```bash
pnpm install
cp .env.example .env.local
pnpm seed        # Create demo app + admin user (skips if data exists)
pnpm dev
```

Default admin / 預設管理員: `admin@example.com` / `changeme`

> `pnpm seed --force` to overwrite existing data. / 使用 `--force` 強制覆蓋現有資料。

---

## Environment Variables / 環境變數

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_BASE_URL` | Yes | Public URL (e.g. `http://localhost:3000`) |
| `LETMEUSE_DEFAULT_ADMIN_EMAIL` | No | Seed admin email |
| `LETMEUSE_DEFAULT_ADMIN_PASSWORD` | No | Seed admin password |
| `LETMEUSE_ALLOWED_ORIGINS` | No | Comma-separated CORS origins |
| `SMTP_HOST` | No | SMTP server host |
| `SMTP_PORT` | No | SMTP server port |
| `SMTP_USER` | No | SMTP username |
| `SMTP_PASS` | No | SMTP password |
| `SMTP_FROM` | No | Sender email address |

> If SMTP is not configured, emails are logged to the console (dev mode).
> 若未設定 SMTP，Email 將輸出到 console（開發模式）。

---

## SDK Integration / SDK 整合

Add this script tag to any website: / 在任何網站加入以下 script 標籤：

```html
<script
  src="https://your-letmeuse-instance.com/letmeuse.js"
  data-app-id="app_xxxxxxxx"
  data-theme="auto"
  data-accent="#6366f1"
  data-locale="zh"
  data-mode="modal"
></script>
```

### Script Attributes / 標籤屬性

| Attribute | Values | Default | Description |
|-----------|--------|---------|-------------|
| `data-app-id` | string | — | **Required.** Your app ID / 你的 App ID |
| `data-theme` | `light` / `dark` / `auto` | `light` | Color theme / 顏色主題（`auto` 自動偵測） |
| `data-accent` | hex color | `#2563eb` | Accent color / 強調色 |
| `data-locale` | `en` / `zh` | `en` | Language / 語言 |
| `data-mode` | `modal` / `redirect` | `modal` | Auth UI mode / 認證 UI 模式 |

### SDK API

```js
window.letmeuse

// Auth / 認證
letmeuse.login()        // Open login modal / 開啟登入 Modal
letmeuse.register()     // Open register modal / 開啟註冊 Modal
letmeuse.logout()       // Log out / 登出
letmeuse.getToken()     // Get current access token / 取得 Access Token
letmeuse.user           // Current user or null / 目前使用者或 null
letmeuse.ready          // true when initialized / 初始化完成時為 true

// Profile / 個人資料
letmeuse.openProfile()  // Open profile modal (name, avatar, password)
                        // 開啟個人資料 Modal（名稱、頭像、密碼）

// Events / 事件
const unsub = letmeuse.onAuthChange((user) => {
  // Called when auth state changes / 認證狀態變更時觸發
})

// UI Components / UI 元件
letmeuse.renderProfileCard('#el')  // Render profile card / 渲染個人資料卡片
letmeuse.renderAvatar('#el')       // Render avatar with dropdown / 渲染頭像下拉選單

// Admin / 管理
letmeuse.openAdmin()    // Open admin panel / 開啟管理面板
```

---

## API Endpoints / API 端點

### Auth / 認證

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register / 註冊 |
| POST | `/api/auth/login` | Login / 登入 |
| POST | `/api/auth/logout` | Logout / 登出 |
| POST | `/api/auth/refresh` | Refresh token / 刷新 Token |
| GET | `/api/auth/me` | Get current user / 取得目前使用者 |
| PUT | `/api/auth/profile` | Update profile / 更新個人資料 |
| POST | `/api/auth/avatar` | Upload avatar / 上傳頭像 |
| POST | `/api/auth/change-password` | Change password / 變更密碼 |
| POST | `/api/auth/forgot-password` | Forgot password email / 寄送重設密碼信 |
| POST | `/api/auth/reset-password` | Reset password / 重設密碼 |
| GET | `/api/auth/verify-email` | Verify email / 驗證 Email |
| GET | `/api/auth/sessions` | List sessions / 列出 Session |
| DELETE | `/api/auth/sessions` | Revoke session / 撤銷 Session |
| GET | `/api/auth/providers` | List OAuth providers / 列出 OAuth 提供者 |
| GET | `/api/auth/oauth/:provider` | Start OAuth flow / 啟動 OAuth 流程 |

### Admin / 管理（requires admin role / 需要管理員角色）

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | List users / 列出使用者 |
| GET/PATCH/DELETE | `/api/admin/users/:id` | User CRUD |
| GET | `/api/admin/stats` | Dashboard stats / 儀表板統計 |
| GET/POST | `/api/admin/apps` | App management / App 管理 |
| GET/PATCH/DELETE | `/api/admin/apps/:id` | Single app CRUD |
| GET/POST | `/api/admin/roles` | Role management / 角色管理 |
| GET/PATCH/DELETE | `/api/admin/roles/:id` | Single role CRUD |
| GET | `/api/admin/audit-log` | Audit log / 稽核日誌 |
| GET | `/api/admin/webhooks` | Webhook events / Webhook 事件 |
| GET/POST | `/api/admin/plans` | Plan management / 方案管理 |
| GET/PATCH/DELETE | `/api/admin/plans/:id` | Single plan CRUD |

### Billing / 計費

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/billing/plans` | List plans / 列出方案 |
| POST/DELETE | `/api/billing/subscription` | Manage subscription / 管理訂閱 |
| GET | `/api/billing/invoices` | List invoices / 列出發票 |

---

## Build / 建置

```bash
pnpm build          # Full build (embed + SDK + Next.js)
pnpm build:sdk      # Build SDK only
pnpm build:embed    # Build embed script only
```

## Tech Stack / 技術棧

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) + React 19 |
| Styling | Tailwind CSS 4 |
| Validation | Zod 4 |
| Auth | jose (JWT HS256) + bcryptjs |
| Email | nodemailer (SMTP) |
| Build | esbuild (SDK / embed compilation) |
| Storage | JSON file (with database migration path) |

## License

MIT
