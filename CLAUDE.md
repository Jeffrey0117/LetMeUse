# LetMeUse

Auth-as-a-Service platform — embeddable authentication for any app.

## Stack

- Next.js 16 + React 19 + TypeScript
- Tailwind CSS 4
- File-based JSON storage (users, apps, refresh tokens)
- JWT (access + refresh tokens)
- Email verification via Resend API
- OAuth support
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
  login/route.ts         — Email/password login
  register/route.ts      — User registration
  verify-email/route.ts  — Email verification
  refresh/route.ts       — Token refresh
  me/route.ts            — Current user profile
  oauth/[provider]/      — OAuth flows

src/app/api/admin/
  apps/route.ts          — App management
  users/route.ts         — User management
  sessions/route.ts      — Active sessions
  stats/route.ts         — System statistics
  audit-log/route.ts     — Audit trail

src/lib/
  auth/jwt.ts            — JWT operations
  auth/password.ts       — Bcrypt hashing
  auth/email.ts          — Resend integration
  auth/middleware.ts      — Auth middleware
  storage.ts             — JSON file CRUD
  session.ts             — Session management
  rate-limit.ts          — Rate limiting
  audit.ts               — Audit logging
```

## API (Key Endpoints)

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login → JWT + refresh token |
| POST | `/api/auth/verify-email` | Verify email token |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | Invalidate refresh token |
| GET | `/api/auth/me` | Current user profile |
| GET | `/api/admin/apps` | List registered apps |
| POST | `/api/admin/apps` | Create app |
| GET | `/api/admin/users` | List users (search, filter) |
| GET | `/api/admin/stats` | System statistics |
| GET | `/api/admin/sessions` | Active sessions |
| GET | `/api/admin/audit-log` | Audit log |
| GET | `/api/billing/plans` | List billing plans |

## Env

- `LETMEUSE_DEFAULT_ADMIN_EMAIL` — initial admin
- `LETMEUSE_DEFAULT_ADMIN_PASSWORD` — initial admin password
- `LETMEUSE_ALLOWED_ORIGINS` — CORS origins
- `RESEND_API_KEY` — optional email service

## CloudPipe

- Manifest: `data/manifests/letmeuse.json` (9 tools)
- Auth: bearer (env: LETMEUSE_TOKEN)
- Entry: `index.js`
