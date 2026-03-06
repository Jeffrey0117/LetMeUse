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

## CloudPipe MCP Integration

- Manifest: `cloudpipe/data/manifests/letmeuse.json` (9 tools)
- Auth: bearer token in `cloudpipe/data/manifests/auth.json`
- Token: 1-year admin JWT (app_yX0u0SiJ, admin user, expires 2027-03), signed with demo app secret
- If token expires: regenerate with `node -e` using jose/HS256, secret from `data/apps.json` demo app
- Entry: `index.js` (Next.js)

## Integrating LetMeUse into a New Project (IMPORTANT)

This is the standard workflow. Follow it exactly — do NOT explore LetMeUse source code.

### Step 1: Register App via CloudPipe MCP

```
letmeuse_create_app({ name: "ProjectName", domains: ["https://project.isnowfriend.com", "http://localhost:PORT"] })
```

Returns `{ id: "app_XXX", secret: "...", ... }`. Save the `id` — that's your app ID.

**Fallback** (if MCP returns 401): directly edit `data/apps.json`, add entry, then `restart_project("letmeuse")`.

### Step 2: Frontend — Add SDK

Every HTML page that needs auth:

```html
<script src="https://letmeuse.isnowfriend.com/letmeuse.js"
  data-app-id="app_XXX" data-locale="zh" data-theme="light">
</script>
```

### Step 3: Frontend — Auth Flow

```javascript
// Wait for SDK to load
function waitForLetMeUse() {
  return new Promise(resolve => {
    if (typeof letmeuse !== 'undefined') return resolve()
    const check = setInterval(() => {
      if (typeof letmeuse !== 'undefined') { clearInterval(check); resolve() }
    }, 100)
    setTimeout(() => { clearInterval(check); resolve() }, 3000)
  })
}

// Auth state management
await waitForLetMeUse()
letmeuse.onAuthChange(async (user) => {
  // user = { id, email, name, ... } or null (logged out)
  if (user) {
    // Sync user to your backend
    const token = letmeuse.getToken()
    await fetch('/api/auth/callback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ userId: user.id, email: user.email, name: user.name })
    })
  }
})

// Trigger login modal
letmeuse.login()

// Get current token for API calls
const token = letmeuse.getToken()

// Logout
letmeuse.logout()
```

**IMPORTANT**: `onAuthChange` callback receives `user | null`, NOT a token. Call `letmeuse.getToken()` separately.

### Step 4: Backend — JWT Decode Middleware

Decode the LetMeUse JWT to get userId/email. No signature verification needed (internal trust).

```javascript
// Fastify example
function decodeToken(token) {
  const payload = token.split('.')[1]
  const decoded = Buffer.from(payload, 'base64url').toString()
  return JSON.parse(decoded)  // { sub: "usr_XXX", email: "...", name: "...", ... }
}

function requireAuth(request, reply, done) {
  const auth = request.headers.authorization
  if (!auth?.startsWith('Bearer ')) return reply.code(401).send({ error: 'Unauthorized' })
  try {
    const payload = decodeToken(auth.slice(7))
    request.userId = payload.sub
    request.userEmail = payload.email
    request.userName = payload.name
    done()
  } catch { reply.code(401).send({ error: 'Invalid token' }) }
}
```

### Step 5: Backend — Sync User Route

```javascript
// POST /api/auth/callback — sync LetMeUse user to local DB
app.post('/api/auth/callback', { preHandler: [requireAuth] }, async (request, reply) => {
  const user = syncUser({ id: request.userId, email: request.userEmail, name: request.userName })
  return { success: true, data: user }
})
```

### Reference Implementation

See **Quickky** (`C:\Users\jeffb\Desktop\code\quickky`) for a complete working example:
- `public/app.js` — frontend auth flow with `waitForLetMeUse()` + `onAuthChange()`
- `src/middleware/auth.js` — backend JWT decode middleware
- `src/routes/auth.js` — user sync route

### Common Mistakes (DO NOT DO)

- DO NOT explore LetMeUse source code to figure out auth — use this workflow
- DO NOT try to login to LetMeUse admin UI — use MCP tools or edit data files
- DO NOT verify JWT signatures — just decode the payload (internal trust)
- DO NOT store tokens in localStorage manually — the SDK handles it
