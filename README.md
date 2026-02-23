# LetMeUse

Auth-as-a-Service platform. Add authentication to any website with a single `<script>` tag.

> Sister project of [ReelScript](https://github.com/Jeffrey0117/ReelScript) - powers its user authentication system.

## Features

- **SDK** - Drop-in login/register/profile modal with Shadow DOM isolation
- **Multi-App** - Manage multiple client apps from one instance
- **OAuth** - Google social login (per-app credentials)
- **Email Verification** - Verify email with SMTP (nodemailer)
- **Forgot Password** - Inline forgot/reset password flow in SDK
- **Avatar Upload** - Profile photo upload with preview
- **RBAC** - Custom roles and granular permissions
- **Webhooks** - Event notifications with HMAC signing
- **Audit Log** - Track all auth events
- **Session Management** - View and revoke user sessions
- **Billing** - Plans, subscriptions, and invoices (pluggable payment provider)
- **i18n** - English and Chinese
- **Auto Theme** - SDK detects host page dark/light mode via MutationObserver

## Quick Start

```bash
pnpm install
cp .env.example .env.local
pnpm seed        # creates demo app + admin user (skips if data exists)
pnpm dev
```

Default admin: `admin@example.com` / `changeme`

> Use `pnpm seed --force` to overwrite existing data.

## Environment Variables

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

If SMTP is not configured, emails are logged to the console (dev mode).

## SDK Integration

Add this script tag to any website:

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

### Script Attributes

| Attribute | Values | Default | Description |
|-----------|--------|---------|-------------|
| `data-app-id` | string | - | **Required.** Your app ID |
| `data-theme` | `light` / `dark` / `auto` | `light` | Color theme (`auto` detects host page) |
| `data-accent` | hex color | `#2563eb` | Accent color |
| `data-locale` | `en` / `zh` | `en` | Language |
| `data-mode` | `modal` / `redirect` | `modal` | Auth UI mode |

### SDK API

```js
window.letmeuse

// Auth
letmeuse.login()        // Open login modal
letmeuse.register()     // Open register modal
letmeuse.logout()       // Log out
letmeuse.getToken()     // Get current access token
letmeuse.user           // Current user object or null
letmeuse.ready          // true when SDK is initialized

// Profile
letmeuse.openProfile()  // Open profile settings modal (name, avatar, password)

// Events
const unsub = letmeuse.onAuthChange((user) => {
  // Called when auth state changes
})

// UI Components
letmeuse.renderProfileCard('#profile')  // Render profile card widget
letmeuse.renderAvatar('#avatar')        // Render avatar with dropdown

// Admin
letmeuse.openAdmin()    // Open admin panel
```

### SDK Modal Features

- **Login** - Email + password with "Forgot password?" inline flow
- **Register** - Email + password + display name
- **Profile** - Edit display name, upload avatar, change password, email verification status
- **Auto theme** - Detects dark/light mode from host page's `<html>` class or color-scheme

## API Endpoints

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| POST | `/api/auth/refresh` | Refresh access token |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/profile` | Update profile |
| POST | `/api/auth/avatar` | Upload avatar photo |
| POST | `/api/auth/change-password` | Change password |
| POST | `/api/auth/forgot-password` | Request password reset email |
| POST | `/api/auth/reset-password` | Reset password with token |
| GET | `/api/auth/verify-email` | Verify email with token |
| GET | `/api/auth/sessions` | List user sessions |
| DELETE | `/api/auth/sessions` | Revoke session |
| GET | `/api/auth/providers` | List OAuth providers for app |
| GET | `/api/auth/oauth/:provider` | Start OAuth flow |

### Admin (requires admin role)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | List users |
| GET/PATCH/DELETE | `/api/admin/users/:id` | User CRUD |
| GET | `/api/admin/stats` | Dashboard stats |
| GET/POST | `/api/admin/apps` | App management |
| GET/PATCH/DELETE | `/api/admin/apps/:id` | Single app CRUD |
| GET/POST | `/api/admin/roles` | Role management |
| GET/PATCH/DELETE | `/api/admin/roles/:id` | Single role CRUD |
| GET | `/api/admin/audit-log` | Audit log |
| GET | `/api/admin/webhooks` | Webhook events |
| GET/POST | `/api/admin/plans` | Plan management |
| GET/PATCH/DELETE | `/api/admin/plans/:id` | Single plan CRUD |

### Billing

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/billing/plans` | List plans for app |
| POST/DELETE | `/api/billing/subscription` | Manage subscription |
| GET | `/api/billing/invoices` | List invoices |

## Build

```bash
pnpm build          # Full build (embed + SDK + Next.js)
pnpm build:sdk      # Build SDK only
pnpm build:embed    # Build embed script only
```

## Tech Stack

- Next.js 16 (App Router) + React 19
- Tailwind CSS 4
- Zod 4 (validation)
- jose (JWT HS256) + bcryptjs (passwords)
- nodemailer (SMTP email)
- esbuild (SDK/embed compilation)
- JSON file storage (with database migration path)

## License

MIT
