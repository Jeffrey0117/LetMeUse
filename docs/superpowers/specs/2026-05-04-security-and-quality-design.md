# LetMeUse Security Hardening + Code Quality Design

**Date:** 2026-05-04
**Status:** Approved
**Scope:** Phase A (Security) + Phase B (Code Quality)

---

## Phase A: Security Hardening (10 fixes)

### A1. Storage Race Condition Fix
**File:** `src/lib/storage.ts`
- Add per-file write queue using Promise chain serialization
- Replace double `writeFile` with `writeFile` to tmp + atomic `rename()`
- No API changes — internal implementation only

### A2. OAuth Open Redirect Prevention
**File:** `src/app/api/auth/oauth/[provider]/callback/route.ts`
- Validate `redirectUrl` from state against app's registered `domains`
- Reject non-matching domains, fallback to `BASE_URL/login`
- Only allow `http:` and `https:` protocols

### A3. CORS Hardening
**Files:** `src/lib/api-result.ts`, `src/middleware.ts`
- Build origin whitelist from: app domains + `LETMEUSE_ALLOWED_ORIGINS` env + localhost dev
- Only set `Access-Control-Allow-Origin` for whitelisted origins
- Never reflect arbitrary origin

### A4. Login Timing Attack Fix
**File:** `src/app/api/auth/login/route.ts`
- When user not found, perform dummy `bcrypt.compare()` against a pre-hashed value
- Eliminates timing difference between "user not found" and "wrong password"

### A5. Security Headers
**File:** `src/middleware.ts`
- Add: `X-Frame-Options: DENY`
- Add: `X-Content-Type-Options: nosniff`
- Add: `Referrer-Policy: strict-origin-when-cross-origin`
- Add: `Strict-Transport-Security: max-age=31536000; includeSubDomains` (production only)
- Add: `Permissions-Policy: camera=(), microphone=(), geolocation=()`

### A6. Rate Limit IP Spoofing Fix
**File:** `src/lib/rate-limit.ts`
- Add `TRUST_PROXY` env var check
- Only trust `X-Forwarded-For` when `TRUST_PROXY=true`
- Fallback to connection IP

### A7. Pagination Limits
**Files:** All admin API routes (`src/app/api/admin/users/route.ts`, etc.)
- Enforce `MAX_LIMIT = 100`
- `limit = Math.min(Math.max(requested, 1), MAX_LIMIT)`

### A8. CSRF Protection
**Files:** `src/middleware.ts`, SDK
- Double-submit cookie pattern (stateless)
- Generate CSRF token cookie on first request
- Require `X-CSRF-Token` header matching cookie for POST/PUT/DELETE
- SDK auto-reads cookie and sends header

### A9. Avatar Path Traversal Fix
**File:** `src/app/api/auth/avatar/route.ts`
- `decodeURIComponent()` the filename
- `path.resolve()` + verify result starts with `AVATAR_DIR`

### A10. Bcrypt Rounds Increase
**File:** `src/lib/auth/password.ts`
- Change `SALT_ROUNDS` from 10 to 12

---

## Phase B: Code Quality (4 items)

### B1. SDK Split (1798 lines -> 6-8 modules)
**Current:** `src/sdk/letmeuse-sdk.ts`
**Target structure:**
```
src/sdk/
  index.ts          — Entry point, LetMeUse class, public API
  auth.ts           — Token management, refresh, storage
  api.ts            — API request helpers (apiGet, apiPost)
  theme.ts          — Theme system (light/dark/auto, CSS vars)
  i18n.ts           — Translations (en/zh)
  ui/
    login-modal.ts  — Login/register modal UI
    profile-modal.ts — Profile settings modal
    avatar-widget.ts — Avatar button + dropdown
    styles.ts       — Shared CSS generation
```
- esbuild still bundles to single IIFE `/public/letmeuse.js`
- Public API unchanged: `window.letmeuse.*`
- All imports internal only

### B2. Ad Form Split (773 lines -> 4 files)
**Current:** `src/components/ads/ad-form.tsx`
**Target:**
```
src/components/ads/
  ad-form.tsx            — Main form (slimmed)
  embed-code-block.tsx   — Embed code display
  oauth-config-form.tsx  — OAuth config section
  purchase-verify-form.tsx — PV config section
```

### B3. Admin Page Splits
- `src/app/admin/apps/page.tsx` — Extract app form components
- `src/app/admin/plans/page.tsx` — Extract plan form
- `src/app/account/page.tsx` — Extract profile sections

### B4. Test Framework + Core Tests
- Add Vitest as dev dependency
- Test targets (80%+ coverage):
  - `src/lib/storage.ts`
  - `src/lib/auth/jwt.ts`
  - `src/lib/auth/password.ts`
  - `src/lib/rate-limit.ts`
  - `src/lib/webhook.ts`
  - `src/lib/session.ts`
