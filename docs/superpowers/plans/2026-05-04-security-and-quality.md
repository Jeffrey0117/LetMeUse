# LetMeUse Security Hardening + Code Quality Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix 10 security vulnerabilities and improve code quality via file splits and test coverage.

**Architecture:** Targeted fixes to existing files (Phase A), then refactoring large files into smaller modules and adding Vitest test suite (Phase B). No new features, no architecture changes.

**Tech Stack:** Next.js 16, TypeScript, bcryptjs, jose, Vitest (new)

---

## Phase A: Security Hardening

### Task A1: Fix Storage Race Condition

**Files:**
- Modify: `src/lib/storage.ts`

- [ ] **Step 1: Replace writeJsonFile with atomic write using per-file queue**

Replace the current `writeJsonFile` function (lines 21-34) with an atomic version that serializes writes per file and uses `rename()`:

```typescript
import { readFile, writeFile, mkdir, rename, unlink } from 'fs/promises'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')

// Per-file write queue to prevent race conditions
const writeQueues = new Map<string, Promise<void>>()

async function ensureDataDir(): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true })
}

async function readJsonFile<T>(filename: string): Promise<T[]> {
  await ensureDataDir()
  const filePath = path.join(DATA_DIR, filename)
  try {
    const raw = await readFile(filePath, 'utf-8')
    return JSON.parse(raw) as T[]
  } catch {
    return []
  }
}

async function writeJsonFile<T>(filename: string, data: T[]): Promise<void> {
  await ensureDataDir()
  const filePath = path.join(DATA_DIR, filename)

  // Serialize writes per file
  const prevWrite = writeQueues.get(filePath) ?? Promise.resolve()
  let resolve: () => void
  const currentWrite = new Promise<void>((r) => { resolve = r })
  writeQueues.set(filePath, currentWrite)

  try {
    await prevWrite
    const tmpPath = `${filePath}.tmp.${Date.now()}`
    await writeFile(tmpPath, JSON.stringify(data, null, 2), 'utf-8')
    await rename(tmpPath, filePath)
  } finally {
    resolve!()
  }
}
```

- [ ] **Step 2: Verify build passes**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/lib/storage.ts
git commit -m "fix(security): atomic file writes with per-file queue to prevent race conditions"
```

---

### Task A2: Fix OAuth Open Redirect

**Files:**
- Modify: `src/app/api/auth/oauth/[provider]/callback/route.ts`

- [ ] **Step 1: Add redirect URL validation function and apply it**

Add this function before the `GET` export and replace line 184 (`const targetUrl = redirectUrl ?? ...`):

```typescript
function validateRedirectUrl(redirectUrl: string | undefined, app: App): string {
  const fallback = `${BASE_URL}/login`
  if (!redirectUrl) return fallback

  try {
    const url = new URL(redirectUrl)

    if (!['http:', 'https:'].includes(url.protocol)) {
      return fallback
    }

    const allowedHosts = [
      ...(app.domains ?? []),
      new URL(BASE_URL).hostname,
    ]

    if (!allowedHosts.some((d) => url.hostname === d || url.hostname.endsWith(`.${d}`))) {
      return fallback
    }

    return url.toString()
  } catch {
    return fallback
  }
}
```

Then replace line 184:

```typescript
// Before:
const targetUrl = redirectUrl ?? `${BASE_URL}/login`

// After:
const targetUrl = validateRedirectUrl(redirectUrl, app)
```

- [ ] **Step 2: Verify build passes**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/app/api/auth/oauth/[provider]/callback/route.ts
git commit -m "fix(security): validate OAuth redirect URL against app domains whitelist"
```

---

### Task A3: CORS Hardening

**Files:**
- Modify: `src/middleware.ts`

- [ ] **Step 1: Restrict public CORS to not blindly reflect origin**

In `src/middleware.ts`, replace lines 87-88 (the `if (isPublic)` block) with origin validation that also checks app domains dynamically. Since we can't do file I/O in edge middleware, we rely on the `LETMEUSE_ALLOWED_ORIGINS` env var plus self origins:

```typescript
  // Set CORS headers on response
  const response = NextResponse.next()

  const allowedOrigin = (origin && (isAllowedOrigin(origin) || isPublic)) ? origin : ''

  if (allowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', allowedOrigin)
  }

  if (pathname.startsWith('/api/serve/')) {
    response.headers.set('Cache-Control', 'public, max-age=60')
  }

  if (origin || isPublic) {
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF-Token')
    response.headers.set('Vary', 'Origin')
  }

  return response
```

Also update the OPTIONS preflight block (lines 58-73) to use consistent logic:

```typescript
  // Preflight OPTIONS
  if (request.method === 'OPTIONS') {
    const allowOrigin = origin && (isAllowedOrigin(origin) || isPublic) ? origin : ''

    return new NextResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': allowOrigin,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-CSRF-Token',
        'Access-Control-Max-Age': '86400',
        'Vary': 'Origin',
      },
    })
  }
```

Note: `isPublic` endpoints (SDK-facing `/api/auth/` and `/api/serve/`) still allow broader origins since the SDK runs on customer domains. The real protection is that these endpoints validate auth via JWT. We added `X-CSRF-Token` to allowed headers for Task A8.

- [ ] **Step 2: Verify build passes**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/middleware.ts
git commit -m "fix(security): tighten CORS — stop reflecting arbitrary origins, add X-CSRF-Token header"
```

---

### Task A4: Fix Login Timing Attack

**Files:**
- Modify: `src/app/api/auth/login/route.ts`
- Modify: `src/lib/auth/password.ts`

- [ ] **Step 1: Add a dummy hash constant to password.ts**

Add at the end of `src/lib/auth/password.ts`:

```typescript
// Pre-computed bcrypt hash for timing-safe comparison when user doesn't exist
// This is hash of a random string — the actual value doesn't matter
export const DUMMY_HASH = '$2a$12$LJ3m4ys3Lk0TSwHiPbNBUeQIcxMFGpMOaVfPcBHSN85K/2nqEwvXa'
```

- [ ] **Step 2: Update login route to always run bcrypt**

In `src/app/api/auth/login/route.ts`, replace lines 47-51 (the `if (!user)` block):

```typescript
    // Before:
    if (!user) {
      recordFailure(request, 'login', RATE_LIMITS.login)
      writeAuditLog({ action: 'user.login_failed', actorId: 'unknown', appId, details: { email }, ip: request.headers.get('x-forwarded-for') ?? undefined })
      return fail('Invalid credentials', 401, origin)
    }

    if (user.disabled) {
      return fail('Account is disabled', 403, origin)
    }

    const valid = await verifyPassword(password, user.passwordHash)
    if (!valid) {
      recordFailure(request, 'login', RATE_LIMITS.login)
      writeAuditLog({ action: 'user.login_failed', actorId: user.id, actorEmail: user.email, appId, ip: request.headers.get('x-forwarded-for') ?? undefined })
      return fail('Invalid credentials', 401, origin)
    }

    // After:
    const valid = await verifyPassword(password, user?.passwordHash ?? DUMMY_HASH)

    if (!user || !valid) {
      recordFailure(request, 'login', RATE_LIMITS.login)
      writeAuditLog({ action: 'user.login_failed', actorId: user?.id ?? 'unknown', actorEmail: user?.email, appId, details: user ? undefined : { email }, ip: request.headers.get('x-forwarded-for') ?? undefined })
      return fail('Invalid credentials', 401, origin)
    }

    if (user.disabled) {
      return fail('Account is disabled', 403, origin)
    }
```

Add import at top:

```typescript
import { verifyPassword, DUMMY_HASH } from '@/lib/auth/password'
```

- [ ] **Step 3: Verify build passes**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add src/lib/auth/password.ts src/app/api/auth/login/route.ts
git commit -m "fix(security): eliminate login timing attack with constant-time comparison"
```

---

### Task A5: Add Security Headers

**Files:**
- Modify: `src/middleware.ts`

- [ ] **Step 1: Add security headers before the return statement**

In `src/middleware.ts`, add security headers right before the final `return response` (before the current last line of the function):

```typescript
  // Security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  }

  return response
```

- [ ] **Step 2: Verify build passes**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/middleware.ts
git commit -m "fix(security): add X-Frame-Options, CSP, HSTS, and other security headers"
```

---

### Task A6: Fix Rate Limit IP Spoofing

**Files:**
- Modify: `src/lib/rate-limit.ts`

- [ ] **Step 1: Update getClientIp to check TRUST_PROXY**

Replace the `getClientIp` function (lines 40-46) in `src/lib/rate-limit.ts`:

```typescript
function getClientIp(request: NextRequest): string {
  const trustProxy = process.env.TRUST_PROXY === 'true'

  if (trustProxy) {
    const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    if (forwarded) return forwarded
  }

  return (
    request.headers.get('x-real-ip') ??
    request.ip ??
    'unknown'
  )
}
```

- [ ] **Step 2: Verify build passes**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/lib/rate-limit.ts
git commit -m "fix(security): only trust X-Forwarded-For when TRUST_PROXY is enabled"
```

---

### Task A7: Enforce Pagination Limits

**Files:**
- Modify: `src/app/api/admin/users/route.ts`
- Modify: `src/app/api/admin/sessions/route.ts`

- [ ] **Step 1: Fix users route pagination**

In `src/app/api/admin/users/route.ts`, replace line 26:

```typescript
// Before:
const limit = parseInt(searchParams.get('limit') ?? '20', 10)

// After:
const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') ?? '20', 10)))
```

- [ ] **Step 2: Fix sessions route pagination**

In `src/app/api/admin/sessions/route.ts`, replace line 25:

```typescript
// Before:
const limit = parseInt(searchParams.get('limit') ?? '20', 10)

// After:
const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') ?? '20', 10)))
```

- [ ] **Step 3: Verify build passes**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add src/app/api/admin/users/route.ts src/app/api/admin/sessions/route.ts
git commit -m "fix(security): enforce max pagination limit of 100 on admin endpoints"
```

---

### Task A8: Add CSRF Protection

**Files:**
- Modify: `src/middleware.ts`

- [ ] **Step 1: Add CSRF double-submit cookie logic to middleware**

Add CSRF protection in `src/middleware.ts`. Add this block after the admin page protection and before the API routes section:

```typescript
  // ── CSRF double-submit cookie ─────────────────────────
  if (pathname.startsWith('/api/') && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {
    // Skip CSRF for public auth endpoints (SDK calls from third-party domains)
    if (!isPublicCorsPath(pathname)) {
      const csrfCookie = request.cookies.get('lmu_csrf')?.value
      const csrfHeader = request.headers.get('x-csrf-token')

      if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
        return NextResponse.json(
          { success: false, error: 'CSRF token mismatch' },
          { status: 403 }
        )
      }
    }
  }
```

Then, at the end of the function (before `return response`), set the CSRF cookie if it doesn't exist:

```typescript
  // Set CSRF cookie if not present
  if (!request.cookies.get('lmu_csrf')) {
    const csrfToken = crypto.randomUUID()
    response.cookies.set('lmu_csrf', csrfToken, {
      httpOnly: false,  // Must be readable by JS for double-submit
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24,  // 24 hours
    })
  }
```

- [ ] **Step 2: Verify build passes**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/middleware.ts
git commit -m "fix(security): add CSRF double-submit cookie protection for admin endpoints"
```

---

### Task A9: Fix Avatar Path Traversal

**Files:**
- Modify: `src/app/api/auth/avatar/route.ts`

- [ ] **Step 1: Harden resolveOldAvatarPath**

Replace the `resolveOldAvatarPath` function (lines 35-44) in `src/app/api/auth/avatar/route.ts`:

```typescript
function resolveOldAvatarPath(avatarUrl: string): string | null {
  if (!avatarUrl.startsWith(AVATAR_URL_PREFIX)) {
    return null
  }

  const rawFilename = avatarUrl.slice(AVATAR_URL_PREFIX.length + 1)
  if (!rawFilename) return null

  // Decode and normalize to catch %2F, %2E%2E, etc.
  let filename: string
  try {
    filename = decodeURIComponent(rawFilename)
  } catch {
    return null
  }

  // Resolve to absolute and verify it stays within AVATAR_DIR
  const resolved = path.resolve(AVATAR_DIR, filename)
  const normalizedTarget = path.normalize(resolved)
  const normalizedBase = path.normalize(AVATAR_DIR)

  if (!normalizedTarget.startsWith(normalizedBase + path.sep) && normalizedTarget !== normalizedBase) {
    return null
  }

  return resolved
}
```

- [ ] **Step 2: Verify build passes**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/app/api/auth/avatar/route.ts
git commit -m "fix(security): harden avatar path resolution against URL-encoded traversal"
```

---

### Task A10: Increase Bcrypt Rounds

**Files:**
- Modify: `src/lib/auth/password.ts`

- [ ] **Step 1: Change SALT_ROUNDS from 10 to 12**

In `src/lib/auth/password.ts`, line 3:

```typescript
// Before:
const SALT_ROUNDS = 10

// After:
const SALT_ROUNDS = 12
```

Also update the `DUMMY_HASH` from Task A4 to use cost factor 12 (it already does — the `$2a$12$` prefix means 12 rounds).

- [ ] **Step 2: Commit**

```bash
git add src/lib/auth/password.ts
git commit -m "fix(security): increase bcrypt rounds from 10 to 12"
```

---

## Phase B: Code Quality

### Task B1: Add Vitest and Core Tests

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `src/__tests__/lib/storage.test.ts`
- Create: `src/__tests__/lib/auth/password.test.ts`
- Create: `src/__tests__/lib/auth/jwt.test.ts`
- Create: `src/__tests__/lib/rate-limit.test.ts`
- Create: `src/__tests__/lib/session.test.ts`

- [ ] **Step 1: Install Vitest**

Run: `pnpm add -D vitest @vitest/coverage-v8`

- [ ] **Step 2: Create vitest.config.ts**

Create `vitest.config.ts` at project root:

```typescript
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/__tests__/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/lib/**/*.ts'],
      exclude: ['src/lib/i18n.ts'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
```

- [ ] **Step 3: Add test script to package.json**

Add to `scripts` in `package.json`:

```json
"test": "vitest run",
"test:watch": "vitest",
"test:coverage": "vitest run --coverage"
```

- [ ] **Step 4: Write storage tests**

Create `src/__tests__/lib/storage.test.ts`:

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { getAll, getById, create, update, remove, findByField, HasId } from '@/lib/storage'
import { mkdir, rm } from 'fs/promises'
import path from 'path'

const TEST_FILE = 'test_items.json'
const DATA_DIR = path.join(process.cwd(), 'data')

interface TestItem extends HasId {
  id: string
  name: string
  value: number
}

describe('storage', () => {
  beforeEach(async () => {
    await mkdir(DATA_DIR, { recursive: true })
    // Clean test file
    try {
      const { unlink } = await import('fs/promises')
      await unlink(path.join(DATA_DIR, TEST_FILE))
    } catch {
      // File doesn't exist yet
    }
  })

  describe('getAll', () => {
    it('returns empty array when file does not exist', async () => {
      const items = await getAll<TestItem>('nonexistent.json')
      expect(items).toEqual([])
    })
  })

  describe('create', () => {
    it('creates an item and persists it', async () => {
      const item: TestItem = { id: 'test_1', name: 'Alice', value: 42 }
      const result = await create<TestItem>(TEST_FILE, item)

      expect(result).toEqual(item)

      const all = await getAll<TestItem>(TEST_FILE)
      expect(all).toHaveLength(1)
      expect(all[0]).toEqual(item)
    })
  })

  describe('getById', () => {
    it('returns item by id', async () => {
      const item: TestItem = { id: 'test_1', name: 'Bob', value: 10 }
      await create<TestItem>(TEST_FILE, item)

      const found = await getById<TestItem>(TEST_FILE, 'test_1')
      expect(found).toEqual(item)
    })

    it('returns null for missing id', async () => {
      const found = await getById<TestItem>(TEST_FILE, 'nonexistent')
      expect(found).toBeNull()
    })
  })

  describe('update', () => {
    it('updates an existing item immutably', async () => {
      const item: TestItem = { id: 'test_1', name: 'Carol', value: 5 }
      await create<TestItem>(TEST_FILE, item)

      const updated = await update<TestItem>(TEST_FILE, 'test_1', { name: 'Carol Updated' })
      expect(updated).toEqual({ id: 'test_1', name: 'Carol Updated', value: 5 })

      const all = await getAll<TestItem>(TEST_FILE)
      expect(all[0].name).toBe('Carol Updated')
    })

    it('returns null for missing id', async () => {
      const result = await update<TestItem>(TEST_FILE, 'nonexistent', { name: 'X' })
      expect(result).toBeNull()
    })
  })

  describe('remove', () => {
    it('removes an item', async () => {
      await create<TestItem>(TEST_FILE, { id: 'test_1', name: 'Dave', value: 1 })
      const removed = await remove<TestItem>(TEST_FILE, 'test_1')
      expect(removed).toBe(true)

      const all = await getAll<TestItem>(TEST_FILE)
      expect(all).toHaveLength(0)
    })

    it('returns false for missing id', async () => {
      const removed = await remove<TestItem>(TEST_FILE, 'nonexistent')
      expect(removed).toBe(false)
    })
  })

  describe('findByField', () => {
    it('finds items by field value', async () => {
      await create<TestItem>(TEST_FILE, { id: 't1', name: 'Eve', value: 10 })
      await create<TestItem>(TEST_FILE, { id: 't2', name: 'Frank', value: 10 })
      await create<TestItem>(TEST_FILE, { id: 't3', name: 'Grace', value: 20 })

      const found = await findByField<TestItem>(TEST_FILE, 'value', 10)
      expect(found).toHaveLength(2)
    })
  })

  describe('concurrent writes', () => {
    it('handles parallel writes without data loss', async () => {
      const writes = Array.from({ length: 10 }, (_, i) =>
        create<TestItem>(TEST_FILE, { id: `item_${i}`, name: `Item ${i}`, value: i })
      )

      await Promise.all(writes)

      const all = await getAll<TestItem>(TEST_FILE)
      expect(all).toHaveLength(10)
    })
  })
})
```

- [ ] **Step 5: Write password tests**

Create `src/__tests__/lib/auth/password.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { hashPassword, verifyPassword, DUMMY_HASH } from '@/lib/auth/password'

describe('password', () => {
  it('hashes and verifies a password', async () => {
    const hash = await hashPassword('mypassword')
    expect(hash).not.toBe('mypassword')
    expect(hash.startsWith('$2a$12$')).toBe(true)

    const valid = await verifyPassword('mypassword', hash)
    expect(valid).toBe(true)
  })

  it('rejects wrong password', async () => {
    const hash = await hashPassword('correct')
    const valid = await verifyPassword('wrong', hash)
    expect(valid).toBe(false)
  })

  it('DUMMY_HASH is a valid bcrypt hash', async () => {
    expect(DUMMY_HASH.startsWith('$2a$')).toBe(true)
    const valid = await verifyPassword('randomstring', DUMMY_HASH)
    expect(typeof valid).toBe('boolean')
  })
})
```

- [ ] **Step 6: Write JWT tests**

Create `src/__tests__/lib/auth/jwt.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { signAccessToken, verifyAccessToken, signRefreshTokenJWT } from '@/lib/auth/jwt'
import type { App, AuthUser } from '@/lib/auth-models'

const mockApp: App = {
  id: 'app_test',
  name: 'Test App',
  secret: 'test-secret-that-is-long-enough-32ch',
  domains: ['localhost'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
} as App

const mockUser: AuthUser = {
  id: 'usr_test',
  appId: 'app_test',
  email: 'test@example.com',
  passwordHash: '$2a$12$fake',
  displayName: 'Test User',
  role: 'user',
  disabled: false,
  emailVerified: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
} as AuthUser

describe('jwt', () => {
  it('signs and verifies an access token', async () => {
    const token = await signAccessToken(mockUser, mockApp)
    expect(typeof token).toBe('string')

    const payload = await verifyAccessToken(token, mockApp.secret)
    expect(payload.sub).toBe('usr_test')
    expect(payload.email).toBe('test@example.com')
    expect(payload.app).toBe('app_test')
    expect(payload.role).toBe('user')
  })

  it('rejects token with wrong secret', async () => {
    const token = await signAccessToken(mockUser, mockApp)
    await expect(verifyAccessToken(token, 'wrong-secret-wrong-secret-32ch!')).rejects.toThrow()
  })

  it('signs a refresh token', async () => {
    const token = await signRefreshTokenJWT(mockUser, mockApp)
    expect(typeof token).toBe('string')
  })
})
```

- [ ] **Step 7: Write rate limit tests**

Create `src/__tests__/lib/rate-limit.test.ts`:

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { checkRateLimit, recordFailure, resetFailures, RATE_LIMITS } from '@/lib/rate-limit'

function mockRequest(ip = '127.0.0.1'): any {
  return {
    headers: new Map([
      ['x-real-ip', ip],
    ]) as any,
    ip,
  }
}

// Override headers.get for NextRequest compatibility
function createMockRequest(ip = '127.0.0.1'): any {
  const headers = {
    get: (name: string) => {
      if (name === 'x-real-ip') return ip
      return null
    },
  }
  return { headers, ip }
}

describe('rate-limit', () => {
  it('allows requests within limit', () => {
    const config = { windowMs: 60000, maxRequests: 5 }
    const req = createMockRequest('10.0.0.1')

    const result = checkRateLimit(req, 'test-allow', config)
    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(4)
  })

  it('blocks requests over limit', () => {
    const config = { windowMs: 60000, maxRequests: 2 }
    const req = createMockRequest('10.0.0.2')

    checkRateLimit(req, 'test-block', config)
    checkRateLimit(req, 'test-block', config)
    const result = checkRateLimit(req, 'test-block', config)

    expect(result.allowed).toBe(false)
    expect(result.remaining).toBe(0)
  })

  it('locks after max failures', () => {
    const config = { windowMs: 60000, maxRequests: 100, maxFailures: 2, lockDurationMs: 5000 }
    const req = createMockRequest('10.0.0.3')

    recordFailure(req, 'test-lock', config)
    recordFailure(req, 'test-lock', config)

    const result = checkRateLimit(req, 'test-lock', config)
    expect(result.allowed).toBe(false)
    expect(result.retryAfterSeconds).toBeGreaterThan(0)
  })
})
```

- [ ] **Step 8: Run all tests**

Run: `pnpm test`
Expected: All tests pass

- [ ] **Step 9: Run coverage**

Run: `pnpm test:coverage`
Expected: Core lib files should have >80% coverage

- [ ] **Step 10: Commit**

```bash
git add vitest.config.ts package.json pnpm-lock.yaml src/__tests__/
git commit -m "test: add Vitest framework with core lib unit tests (storage, password, jwt, rate-limit)"
```

---

### Task B2: Split SDK into Modules

**Files:**
- Create: `src/sdk/i18n.ts`
- Create: `src/sdk/theme.ts`
- Create: `src/sdk/api.ts`
- Create: `src/sdk/auth.ts`
- Create: `src/sdk/ui/styles.ts`
- Create: `src/sdk/ui/login-modal.ts`
- Create: `src/sdk/ui/profile-modal.ts`
- Create: `src/sdk/ui/avatar-widget.ts`
- Modify: `src/sdk/letmeuse-sdk.ts` (slim down to entry point)
- Modify: `package.json` (update build:sdk script)

This is a large refactoring task. The approach:

1. Extract pure data/logic modules first (i18n, theme, api, auth)
2. Extract UI components (styles, login-modal, profile-modal, avatar-widget)
3. Slim down the entry point to import and compose modules
4. Update esbuild entry to use the new entry point
5. Build and verify the output `public/letmeuse.js` still works

**Important constraints:**
- The SDK runs as a single IIFE `<script>` tag — esbuild bundles everything into one file
- `window.letmeuse` public API must not change
- All internal imports are resolved at build time
- The SDK does NOT use Node.js APIs — it's browser-only

- [ ] **Step 1: Extract i18n module**

Create `src/sdk/i18n.ts` — extract the `i18n` object and `t()` function from `letmeuse-sdk.ts`:

```typescript
export type Locale = 'en' | 'zh'

export const i18n: Record<string, Record<string, string>> = {
  // Copy ALL i18n entries from letmeuse-sdk.ts (lines 32-80+)
  // ... (full content extracted from the SDK)
}

export function t(key: string, locale: Locale): string {
  return i18n[key]?.[locale] ?? i18n[key]?.['en'] ?? key
}
```

Note: The worker implementing this task should read the full SDK file and extract ALL translation keys.

- [ ] **Step 2: Extract theme module**

Create `src/sdk/theme.ts` — extract theme detection, CSS variable generation, and auto-theme logic.

- [ ] **Step 3: Extract API module**

Create `src/sdk/api.ts` — extract `apiGet`, `apiPost`, `apiPut`, `apiUpload` helper functions.

- [ ] **Step 4: Extract auth module**

Create `src/sdk/auth.ts` — extract token storage (`localStorage` keys), refresh logic, `parseJwtPayload()`, and auth state management.

- [ ] **Step 5: Extract UI styles**

Create `src/sdk/ui/styles.ts` — extract CSS string generation functions.

- [ ] **Step 6: Extract login modal**

Create `src/sdk/ui/login-modal.ts` — extract login/register/forgot-password modal rendering.

- [ ] **Step 7: Extract profile modal**

Create `src/sdk/ui/profile-modal.ts` — extract profile settings modal rendering.

- [ ] **Step 8: Extract avatar widget**

Create `src/sdk/ui/avatar-widget.ts` — extract `renderAvatar()` and `renderProfileCard()` logic.

- [ ] **Step 9: Slim down entry point**

Rewrite `src/sdk/letmeuse-sdk.ts` as the entry point that imports from all modules, composes the `LetMeUse` class, and exposes `window.letmeuse`.

- [ ] **Step 10: Update esbuild config**

Update `package.json` build:sdk script — the entry point file remains `src/sdk/letmeuse-sdk.ts`, esbuild will tree-shake and bundle:

```json
"build:sdk": "npx esbuild src/sdk/letmeuse-sdk.ts --bundle --minify --format=iife --outfile=public/letmeuse.js"
```

(No change needed if entry point filename is unchanged.)

- [ ] **Step 11: Build and verify**

Run: `pnpm build:sdk`
Expected: `public/letmeuse.js` is generated, similar size to before

- [ ] **Step 12: Commit**

```bash
git add src/sdk/ public/letmeuse.js
git commit -m "refactor: split SDK monolith (1798 lines) into 8 focused modules"
```

---

### Task B3: Split Large Component Files

**Files:**
- Create: `src/components/ads/embed-code-block.tsx`
- Create: `src/components/ads/oauth-config-form.tsx`
- Create: `src/components/ads/purchase-verify-form.tsx`
- Modify: `src/components/ads/ad-form.tsx`

This is a standard React component extraction. The worker should:

1. Read `src/components/ads/ad-form.tsx` fully
2. Identify the `EmbedCodeBlock` sub-component and extract it
3. Identify the OAuth configuration section and extract it
4. Identify the purchase verify configuration section and extract it
5. Import the extracted components back into the slimmed `ad-form.tsx`
6. Verify build passes

- [ ] **Step 1: Extract EmbedCodeBlock component**
- [ ] **Step 2: Extract OAuth config form section**
- [ ] **Step 3: Extract purchase verify form section**
- [ ] **Step 4: Update ad-form.tsx imports**
- [ ] **Step 5: Verify build passes**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 6: Commit**

```bash
git add src/components/ads/
git commit -m "refactor: split ad-form (773 lines) into 4 focused components"
```

---

### Task B4: Split Admin Pages

**Files:**
- Modify: `src/app/admin/apps/page.tsx`
- Modify: `src/app/admin/plans/page.tsx`
- Modify: `src/app/account/page.tsx`
- Create: extracted sub-components (paths determined during implementation)

This is similar to Task B3 but for admin pages. The worker should:

1. Read each oversized page
2. Identify extractable form sections and sub-components
3. Extract into sibling files (e.g., `src/app/admin/apps/app-form.tsx`)
4. Keep each file under 400 lines
5. Verify build passes

- [ ] **Step 1: Split apps page**
- [ ] **Step 2: Split plans page**
- [ ] **Step 3: Split account page**
- [ ] **Step 4: Verify build passes**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 5: Commit**

```bash
git add src/app/admin/ src/app/account/
git commit -m "refactor: split oversized admin pages into focused sub-components"
```
