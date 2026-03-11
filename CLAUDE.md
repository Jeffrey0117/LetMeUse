# LetMeUse

Auth-as-a-Service platform — embeddable authentication for any app.

## Stack

- Next.js 16 + React 19 + TypeScript
- Tailwind CSS 4
- File-based JSON storage (users, apps, refresh tokens)
- JWT (jose, HS256) — access (24h) + refresh (30d) tokens
- Email verification via Resend API
- OAuth support (Google, GitHub)
- esbuild for SDK bundling
- Port: 4006

## Run

```bash
pnpm dev          # dev server
pnpm build        # build (embed + SDK + next)
pnpm start        # production
```

## Key Files

```
src/app/api/auth/
  login/route.ts             — Email/password login
  register/route.ts          — User registration
  verify-email/route.ts      — Email verification
  refresh/route.ts           — Token refresh
  me/route.ts                — Current user profile
  profile/route.ts           — Update profile (PUT)
  change-password/route.ts   — Change password
  avatar/route.ts            — Upload avatar (POST multipart)
  forgot-password/route.ts   — Password reset
  logout/route.ts            — Invalidate refresh token
  providers/route.ts         — List OAuth providers for app
  oauth/[provider]/          — OAuth flows

src/app/api/admin/
  apps/route.ts              — App management
  users/route.ts             — User management
  sessions/route.ts          — Active sessions
  stats/route.ts             — System statistics
  audit-log/route.ts         — Audit trail
  webhooks/route.ts          — Webhook event log + retry

src/lib/
  auth/jwt.ts                — JWT signing (HS256, jose)
  auth/password.ts           — Bcrypt hashing
  auth/email.ts              — Resend integration
  auth/middleware.ts          — Auth middleware
  auth-models.ts             — User, App, Session interfaces
  billing/models.ts          — Plan, Subscription, Invoice
  rbac.ts                    — Role-based access control
  webhook.ts                 — Webhook dispatch + retry
  storage.ts                 — JSON file CRUD
  session.ts                 — Session management
  rate-limit.ts              — Rate limiting
  audit.ts                   — Audit logging

src/sdk/letmeuse-sdk.ts      — Client SDK source (→ /public/letmeuse.js)
```

## API (Key Endpoints)

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login -> JWT + refresh token |
| POST | `/api/auth/verify-email` | Verify email token |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | Invalidate refresh token |
| GET | `/api/auth/me` | Current user profile |
| PUT | `/api/auth/profile` | Update display name |
| POST | `/api/auth/change-password` | Change password |
| POST | `/api/auth/avatar` | Upload avatar (multipart) |
| GET | `/api/auth/providers?app_id=X` | List OAuth providers |
| GET | `/api/admin/apps` | List registered apps |
| POST | `/api/admin/apps` | Create app |
| GET | `/api/admin/users` | List users (search, filter) |
| GET | `/api/admin/stats` | System statistics |
| GET | `/api/admin/webhooks` | Webhook event log |
| GET | `/api/billing/plans` | List billing plans |

## Env

- `LETMEUSE_DEFAULT_ADMIN_EMAIL` — initial admin
- `LETMEUSE_DEFAULT_ADMIN_PASSWORD` — initial admin password
- `LETMEUSE_ALLOWED_ORIGINS` — CORS origins
- `RESEND_API_KEY` — optional email service

## CloudPipe MCP Integration

- Manifest: `cloudpipe/data/manifests/letmeuse.json` (9 tools)
- Auth: bearer token in `cloudpipe/data/manifests/auth.json`
- Token: 1-year admin JWT (app_yX0u0SiJ, admin user, expires 2027-03), signed with demo app secret
- If token expires: regenerate with `node -e` using jose/HS256, secret from `data/apps.json` demo app
- Entry: `index.js` (Next.js)

---

## SDK Client API (`window.letmeuse`)

Script tag: `<script src="https://letmeuse.isnowfriend.com/letmeuse.js" data-app-id="APP_ID" ...>`

### Script Tag Attributes

| Attribute | Required | Values | Default | Description |
|-----------|----------|--------|---------|-------------|
| `data-app-id` | **Yes** | `"app_XXX"` | — | App ID from create_app |
| `data-theme` | No | `light`, `dark`, `auto` | `light` | `auto` detects from host page (data-theme attr, .dark class, OS) |
| `data-accent` | No | CSS hex color | `#2563eb` | Buttons, links, focus rings. **Match your site brand!** |
| `data-locale` | No | `en`, `zh` | `en` | UI language |
| `data-mode` | No | `modal`, `redirect` | `modal` | modal = Shadow DOM popup, redirect = navigate to LetMeUse |

### Properties (NOT methods)

| Property | Type | Description |
|----------|------|-------------|
| `ready` | `boolean` | SDK initialized. **Do NOT call `ready()` or `isReady()`** |
| `user` | `object \| null` | `{ id, email, displayName, avatar, role, emailVerified }`. **Do NOT call `user()` or `getUser()`** |

### Methods

| Method | Signature | Description |
|--------|-----------|-------------|
| `login()` | `() => void` | Open login modal (or redirect) |
| `register()` | `() => void` | Open register modal |
| `logout()` | `() => Promise<void>` | Clear tokens, notify server, fire callbacks |
| `getToken()` | `() => string \| null` | Current JWT access token |
| `onAuthChange(cb)` | `(cb: (user\|null) => void) => () => void` | Subscribe. Returns unsubscribe fn. Fires immediately if ready. |
| `openProfile()` | `() => void` | Profile settings modal (name, avatar, password, email verify) |
| `renderAvatar(el)` | `(selector\|HTMLElement) => () => void` | Embed avatar button + dropdown. Returns cleanup fn. |
| `renderProfileCard(el)` | `(selector\|HTMLElement) => () => void` | Embed profile card widget. Returns cleanup fn. |
| `openAdmin()` | `() => void` | Open admin panel in new tab |

---

## JWT Token Payload

```json
{ "sub": "usr_XXX", "email": "...", "name": "...", "role": "user", "permissions": ["ads.read"], "app": "app_XXX", "iat": 1234567890, "exp": 1234654290 }
```

- Algorithm: HS256, signed with app secret
- Access token: 24h expiry. Refresh token: 30d expiry.
- **Decode base64url payload only — no signature verification needed (internal trust)**

---

## Webhook Events

POST to app's `webhookUrl`. Signed with `X-LetMeUse-Signature` (HMAC-SHA256 of body using app **secret**).

| Event | Trigger | Payload |
|-------|---------|---------|
| `user.registered` | New signup | userId, email, displayName |
| `user.login` | Login | userId, email |
| `user.updated` | Profile changed | userId, email, displayName |
| `user.disabled` | Admin disables | userId |
| `user.enabled` | Admin re-enables | userId |
| `user.deleted` | User deleted | userId |
| `user.email_verified` | Email verified | userId, email |
| `user.password_reset` | Password reset | userId |

Envelope: `{ "event": "user.registered", "payload": {...}, "timestamp": "ISO", "appId": "app_XXX" }`
Headers: `X-LetMeUse-Signature`, `X-LetMeUse-Event`, `Content-Type: application/json`
Retry: 3 attempts [0s, 2s, 5s], 10s timeout each.

---

## Integrating LetMeUse

For full step-by-step integration with code generation, use: `/integrate-letmeuse {project} {domain}`

Quick reference:
1. `letmeuse_create_app({ name, domains, webhookUrl })` — save id + secret
2. Add `<script src=".../letmeuse.js" data-app-id="APP_ID" data-accent="#yourcolor">` to layout
3. Frontend: `onAuthChange(user => ...)` + `getToken()` for Bearer header
4. Backend: decode JWT base64url payload to get `{ sub, email, name, role }`
5. Webhook: verify `X-LetMeUse-Signature` with HMAC-SHA256, handle `user.*` events

Reference: **duk.tw** (React/Next.js), **Quickky** (Vanilla/Fastify)

---

## Common Mistakes

| Mistake | Correct |
|---------|---------|
| `letmeuse.ready()` or `isReady()` | `letmeuse.ready` (property) |
| `letmeuse.user()` or `getUser()` | `letmeuse.user` (property) |
| Forget `data-accent` (default blue) | Set to your brand color |
| Forget `data-theme="dark"` | Use `dark` or `auto` for dark sites |
| Expect token from `onAuthChange` | Callback gets `user`, call `getToken()` separately |
| Store tokens in localStorage | SDK manages `lmu_{appId}_*` automatically |
| Verify JWT signature | Decode base64url only (internal trust) |
| Use app ID for webhook HMAC | Use app **secret** |
| Explore LetMeUse source code | Use this doc + `/integrate-letmeuse` command |
