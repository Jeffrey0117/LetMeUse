# GitLoop + CloudPipe + Pipee Git Integration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give CloudPipe/Pipee users self-hosted git capabilities — push code to Gitea, auto-deploy via GitLoop.

**Architecture:** Three-layer integration: (1) GitLoop gets a CloudPipe API client so Gitea push events trigger CloudPipe deploys, (2) CloudPipe learns to accept Gitea webhooks alongside GitHub webhooks and can auto-create Gitea repos, (3) Pipee gets git-based deployment as an alternative to ZIP upload, with auto-created Gitea repos and push-to-deploy.

**Tech Stack:** Node.js (CommonJS for CloudPipe/Pipee, TypeScript for GitLoop), Gitea REST API v1, SQLite (better-sqlite3), PM2, JWT auth.

**Project Locations:**
- GitLoop: `C:/Users/jeffb/Desktop/code/workhub/gitloop/`
- CloudPipe: `C:/Users/jeffb/Desktop/code/cloudpipe/`
- Pipee: `C:/Users/jeffb/Desktop/code/pipee/`

---

## File Map

### GitLoop (TypeScript)
| File | Action | Responsibility |
|------|--------|---------------|
| `src/integrations/cloudpipe-client.ts` | **Create** | CloudPipe REST API client (deploy, status) |
| `src/config/env.ts` | Modify | Add `CLOUDPIPE_URL`, `CLOUDPIPE_PASSWORD` env vars |
| `src/types/index.ts` | Modify | Add `CloudPipeDeployResult` type |
| `src/index.ts` | Modify | Wire deploy trigger into Gitea push handler |
| `src/telegram/notifier.ts` | Modify | Add deploy start/complete notifications |

### CloudPipe (CommonJS)
| File | Action | Responsibility |
|------|--------|---------------|
| `src/core/gitea.js` | **Create** | Gitea API client (create repo, register webhook) |
| `src/core/admin/webhook-handler.js` | Modify | Accept Gitea webhook format (`X-Gitea-Signature`) |
| `src/core/admin/deploy-handlers.js` | Modify | Add init-gitea-repo endpoint |
| `src/core/admin.js` | Modify | Route new gitea endpoints |

### Pipee (CommonJS)
| File | Action | Responsibility |
|------|--------|---------------|
| `src/core/db.js` | Modify | Add `repo_url`, `branch`, `last_commit` to sites table |
| `src/core/git-deploy.js` | **Create** | Git clone/pull deploy logic for static sites |
| `src/core/user-api.js` | Modify | Add git deploy endpoints, link repo to site |
| `public/console.html` | Modify | Show git repo URL, clone command, deploy-from-git button |

---

## Task 1: GitLoop — CloudPipe Deploy Client

**Files:**
- Create: `C:/Users/jeffb/Desktop/code/workhub/gitloop/src/integrations/cloudpipe-client.ts`
- Modify: `C:/Users/jeffb/Desktop/code/workhub/gitloop/src/config/env.ts`
- Modify: `C:/Users/jeffb/Desktop/code/workhub/gitloop/src/types/index.ts`

- [ ] **Step 1: Add CloudPipe env vars to GitLoop config**

In `src/config/env.ts`, add these fields to the `envSchema` object:

```typescript
  // CloudPipe integration
  CLOUDPIPE_URL: z.string().default('http://localhost:8787'),
  CLOUDPIPE_PASSWORD: z.string().default(''),
  CLOUDPIPE_REPO_MAP: z.string().default(''),  // JSON: {"owner/repo": "projectId"}
```

- [ ] **Step 2: Add CloudPipe types**

In `src/types/index.ts`, append:

```typescript
/** CloudPipe deploy result */
export interface CloudPipeDeployResult {
  readonly success: boolean
  readonly deployment?: {
    readonly id: string
    readonly status: 'success' | 'failed' | 'building'
    readonly commit?: string
    readonly duration?: number
    readonly error?: string
  }
  readonly message?: string
}
```

- [ ] **Step 3: Create CloudPipe API client**

Create `src/integrations/cloudpipe-client.ts`:

```typescript
import { env } from '../config/env.js'
import type { CloudPipeDeployResult } from '../types/index.js'

function getAuth(): string {
  if (!env.CLOUDPIPE_PASSWORD) return ''
  // CloudPipe uses JWT — get one via login endpoint
  return env.CLOUDPIPE_PASSWORD  // Will be used as pre-shared JWT
}

function getRepoMap(): Record<string, string> {
  try {
    return env.CLOUDPIPE_REPO_MAP ? JSON.parse(env.CLOUDPIPE_REPO_MAP) : {}
  } catch {
    return {}
  }
}

/** Look up CloudPipe project ID for a Gitea repo */
export function resolveProjectId(repoFullName: string): string | null {
  const map = getRepoMap()
  return map[repoFullName] ?? map[repoFullName.split('/')[1]] ?? null
}

/** Trigger a deploy on CloudPipe */
export async function triggerDeploy(projectId: string): Promise<CloudPipeDeployResult> {
  const token = getAuth()
  if (!token) {
    return { success: false, message: 'CLOUDPIPE_PASSWORD not configured' }
  }

  const url = `${env.CLOUDPIPE_URL}/api/_admin/deploy/projects/${encodeURIComponent(projectId)}/deploy?sync=true`

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })

    const data = await res.json() as Record<string, unknown>

    if (!res.ok) {
      return { success: false, message: String(data.error ?? `HTTP ${res.status}`) }
    }

    return {
      success: Boolean(data.success),
      deployment: data.deployment as CloudPipeDeployResult['deployment'],
    }
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : 'Unknown error' }
  }
}

/** Check if CloudPipe integration is configured */
export function isCloudPipeEnabled(): boolean {
  return Boolean(env.CLOUDPIPE_URL && env.CLOUDPIPE_PASSWORD)
}
```

- [ ] **Step 4: Verify TypeScript compiles**

Run: `cd C:/Users/jeffb/Desktop/code/workhub/gitloop && npx tsc --noEmit`
Expected: No errors

- [ ] **Step 5: Commit**

```bash
cd C:/Users/jeffb/Desktop/code/workhub/gitloop
git add src/integrations/cloudpipe-client.ts src/config/env.ts src/types/index.ts
git commit -m "feat: add CloudPipe deploy API client"
```

---

## Task 2: GitLoop — Wire Deploy Trigger into Push Handler

**Files:**
- Modify: `C:/Users/jeffb/Desktop/code/workhub/gitloop/src/telegram/notifier.ts`
- Modify: `C:/Users/jeffb/Desktop/code/workhub/gitloop/src/index.ts`

- [ ] **Step 1: Add deploy notifications to notifier**

In `src/telegram/notifier.ts`, add two new export functions after the existing `notifyGiteaPR`:

```typescript
/** Notify deploy triggered */
export async function notifyDeployTriggered(
  repo: string,
  projectId: string,
  commit: string
): Promise<void> {
  const text = [
    `\u{1F680} *部署觸發* \u2014 \`${escapeMarkdown(repo)}\``,
    `CloudPipe 專案: \`${escapeMarkdown(projectId)}\``,
    `Commit: \`${commit.slice(0, 7)}\``,
  ].join('\n')

  await sendMessage(text)
}

/** Notify deploy result */
export async function notifyDeployResult(
  repo: string,
  projectId: string,
  success: boolean,
  message: string,
  duration?: number
): Promise<void> {
  const emoji = success ? '\u{2705}' : '\u{274C}'
  const durationText = duration ? ` (${Math.round(duration / 1000)}s)` : ''

  const text = [
    `${emoji} *部署${success ? '成功' : '失敗'}* \u2014 \`${escapeMarkdown(repo)}\`${durationText}`,
    `專案: \`${escapeMarkdown(projectId)}\``,
    success ? '' : `錯誤: ${escapeMarkdown(message)}`,
  ].filter(Boolean).join('\n')

  await sendMessage(text)
}
```

Also add imports at the top — these functions use `sendMessage` and `escapeMarkdown` which are already defined in the file.

- [ ] **Step 2: Wire deploy trigger into Gitea push handler**

In `src/index.ts`, add the import at the top:

```typescript
import { isCloudPipeEnabled, resolveProjectId, triggerDeploy } from './integrations/cloudpipe-client.js'
import { notifyDeployTriggered, notifyDeployResult } from './telegram/notifier.js'
```

Note: `notifyDeployTriggered` and `notifyDeployResult` need to be added to the existing import from `./telegram/notifier.js`. Merge them into the existing import statement.

Then modify the `onPush` handler in `setWebhookHandlers`:

```typescript
setWebhookHandlers({
  onPush: async (event) => {
    console.error(`[gitloop] Gitea push: ${event.repository.full_name} (${event.commits.length} commits)`)
    await notifyGiteaPush(event)

    // CloudPipe auto-deploy
    if (isCloudPipeEnabled()) {
      const repoName = event.repository.full_name
      const projectId = resolveProjectId(repoName)
      if (projectId) {
        const branch = event.ref.replace('refs/heads/', '')
        const commit = event.after ?? event.commits[0]?.sha ?? ''
        console.error(`[gitloop] Triggering CloudPipe deploy: ${projectId} (${commit.slice(0, 7)})`)
        await notifyDeployTriggered(repoName, projectId, commit)
        const result = await triggerDeploy(projectId)
        await notifyDeployResult(
          repoName, projectId, result.success,
          result.message ?? result.deployment?.error ?? '',
          result.deployment?.duration
        )
      }
    }
  },
  onPullRequest: async (event) => {
    console.error(`[gitloop] Gitea PR ${event.action}: ${event.repository.full_name}#${event.number}`)
    await notifyGiteaPR(event)
  },
})
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `cd C:/Users/jeffb/Desktop/code/workhub/gitloop && npx tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
cd C:/Users/jeffb/Desktop/code/workhub/gitloop
git add src/index.ts src/telegram/notifier.ts
git commit -m "feat: auto-deploy to CloudPipe on Gitea push"
```

---

## Task 3: CloudPipe — Accept Gitea Webhook Format

**Files:**
- Modify: `C:/Users/jeffb/Desktop/code/cloudpipe/src/core/admin/webhook-handler.js`

- [ ] **Step 1: Add Gitea signature verification**

In `webhook-handler.js`, the current code only checks `X-Hub-Signature-256` (GitHub format). Add Gitea support by modifying the signature verification block inside `handleWebhook`. Replace the existing signature check with:

```javascript
      if (project.webhookSecret) {
        // Support both GitHub (X-Hub-Signature-256) and Gitea (X-Gitea-Signature)
        const ghSignature = req.headers['x-hub-signature-256']
        const giteaSignature = req.headers['x-gitea-signature']

        if (ghSignature) {
          // GitHub format: sha256=<hex>
          if (!deploy.verifyGitHubWebhook(body, ghSignature, project.webhookSecret)) {
            logWebhook(projectId, 'rejected', { reason: '簽名驗證失敗 (GitHub)' })
            res.writeHead(401, { 'content-type': 'application/json' })
            return res.end(JSON.stringify({ error: 'Invalid signature' }))
          }
        } else if (giteaSignature) {
          // Gitea format: plain hex HMAC-SHA256
          const crypto = require('crypto')
          const expected = crypto.createHmac('sha256', project.webhookSecret).update(body).digest('hex')
          if (giteaSignature !== expected) {
            logWebhook(projectId, 'rejected', { reason: '簽名驗證失敗 (Gitea)' })
            res.writeHead(401, { 'content-type': 'application/json' })
            return res.end(JSON.stringify({ error: 'Invalid signature' }))
          }
        } else {
          logWebhook(projectId, 'rejected', { reason: '缺少簽名 header' })
          res.writeHead(401, { 'content-type': 'application/json' })
          return res.end(JSON.stringify({ error: 'Missing signature' }))
        }
      }
```

- [ ] **Step 2: Handle Gitea push payload format**

In the same function, after `const payload = JSON.parse(body)`, the current code reads `payload.ref` and `payload.after`. Gitea push payloads use the same field names as GitHub (`ref`, `after`, `head_commit`), so no additional parsing is needed. But add Gitea delivery header support for dedup:

Replace:
```javascript
      const deliveryId = req.headers['x-github-delivery']
```

With:
```javascript
      const deliveryId = req.headers['x-github-delivery'] || req.headers['x-gitea-delivery']
```

- [ ] **Step 3: Commit**

```bash
cd C:/Users/jeffb/Desktop/code/cloudpipe
git add src/core/admin/webhook-handler.js
git commit -m "feat: accept Gitea webhook format alongside GitHub"
```

---

## Task 4: CloudPipe — Gitea API Client + Auto Repo Creation

**Files:**
- Create: `C:/Users/jeffb/Desktop/code/cloudpipe/src/core/gitea.js`
- Modify: `C:/Users/jeffb/Desktop/code/cloudpipe/src/core/admin/deploy-handlers.js`
- Modify: `C:/Users/jeffb/Desktop/code/cloudpipe/src/core/admin.js`

- [ ] **Step 1: Create Gitea API client for CloudPipe**

Create `src/core/gitea.js`:

```javascript
/**
 * Gitea API Client for CloudPipe
 *
 * Creates repos, registers webhooks, manages git hosting
 * for CloudPipe-managed projects.
 */

const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const CONFIG_PATH = path.join(__dirname, '../../config.json')

function getConfig() {
  try {
    return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'))
  } catch {
    return {}
  }
}

function getGiteaConfig() {
  const config = getConfig()
  return config.gitea || {}
}

async function giteaFetch(apiPath, options = {}) {
  const cfg = getGiteaConfig()
  if (!cfg.url || !cfg.token) {
    throw new Error('Gitea not configured. Set gitea.url and gitea.token in config.json')
  }

  const { method = 'GET', body } = options
  const url = `${cfg.url}/api/v1${apiPath}`

  const res = await fetch(url, {
    method,
    headers: {
      'Authorization': `token ${cfg.token}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Gitea API ${method} ${apiPath} failed (${res.status}): ${text}`)
  }

  const contentType = res.headers.get('content-type') || ''
  if (contentType.includes('json')) {
    return res.json()
  }
  return res.text()
}

/** Create a new Gitea repository */
async function createRepo(name, description = '', isPrivate = true) {
  return giteaFetch('/user/repos', {
    method: 'POST',
    body: {
      name,
      description,
      private: isPrivate,
      auto_init: true,
      default_branch: 'main',
    },
  })
}

/** Register a webhook on a Gitea repo */
async function createWebhook(owner, repoName, targetUrl, secret) {
  return giteaFetch(`/repos/${owner}/${repoName}/hooks`, {
    method: 'POST',
    body: {
      type: 'gitea',
      config: {
        url: targetUrl,
        content_type: 'json',
        secret,
      },
      events: ['push'],
      active: true,
    },
  })
}

/** Get repo info */
async function getRepo(owner, name) {
  return giteaFetch(`/repos/${owner}/${name}`)
}

/** List commits for a repo */
async function listCommits(owner, name, branch, limit = 10) {
  const params = new URLSearchParams({ limit: String(limit) })
  if (branch) params.set('sha', branch)
  return giteaFetch(`/repos/${owner}/${name}/git/commits?${params}`)
}

/** Check if Gitea is configured */
function isGiteaEnabled() {
  const cfg = getGiteaConfig()
  return Boolean(cfg.url && cfg.token)
}

/** Get the clone URL for a repo */
function getCloneUrl(owner, repoName) {
  const cfg = getGiteaConfig()
  return `${cfg.url}/${owner}/${repoName}.git`
}

/** Get Gitea owner from config */
function getOwner() {
  const cfg = getGiteaConfig()
  return cfg.owner || 'cloudpipe'
}

module.exports = {
  giteaFetch,
  createRepo,
  createWebhook,
  getRepo,
  listCommits,
  isGiteaEnabled,
  getCloneUrl,
  getOwner,
}
```

- [ ] **Step 2: Add init-gitea-repo handler to deploy-handlers**

In `src/core/admin/deploy-handlers.js`, add at the end (before `module.exports`):

```javascript
async function handleInitGiteaRepo(req, res, id) {
  try {
    const gitea = require('../gitea')
    if (!gitea.isGiteaEnabled()) {
      res.writeHead(400, { 'content-type': 'application/json' })
      return res.end(JSON.stringify({ error: 'Gitea not configured' }))
    }

    const project = deploy.getProject(id)
    if (!project) {
      res.writeHead(404, { 'content-type': 'application/json' })
      return res.end(JSON.stringify({ error: '專案不存在' }))
    }

    const owner = gitea.getOwner()

    // Create repo on Gitea
    const repo = await gitea.createRepo(id, project.name || id)

    // Generate webhook secret
    const crypto = require('crypto')
    const webhookSecret = crypto.randomBytes(32).toString('hex')

    // Get CloudPipe's external URL for webhook callback
    const config = JSON.parse(fs.readFileSync(path.join(ROOT, 'config.json'), 'utf8'))
    const baseUrl = config.externalUrl || `http://localhost:${config.port || 8787}`
    const webhookUrl = `${baseUrl}/webhook/${id}`

    // Register webhook on Gitea repo
    await gitea.createWebhook(owner, id, webhookUrl, webhookSecret)

    // Update project with Gitea repo info
    const cloneUrl = gitea.getCloneUrl(owner, id)
    deploy.updateProject(id, {
      repoUrl: cloneUrl,
      branch: 'main',
      webhookSecret,
      deployMethod: 'github',  // same deploy logic works for Gitea
    })

    res.writeHead(200, { 'content-type': 'application/json' })
    res.end(JSON.stringify({
      success: true,
      repo: {
        clone_url: cloneUrl,
        html_url: repo.html_url,
        owner,
        name: id,
      },
      webhook: { url: webhookUrl },
    }))
  } catch (err) {
    res.writeHead(500, { 'content-type': 'application/json' })
    res.end(JSON.stringify({ error: err.message }))
  }
}
```

Add `handleInitGiteaRepo` to the module.exports of deploy-handlers.js.

- [ ] **Step 3: Route the new endpoint in admin.js**

In `src/core/admin.js`, find the section that routes deploy endpoints. Add this route alongside the existing ones:

```javascript
    // POST /api/_admin/deploy/projects/:id/init-gitea
    if (req.method === 'POST' && pathname.match(/^\/api\/_admin\/deploy\/projects\/[^/]+\/init-gitea$/)) {
      if (!requireAuth(req)) { res.writeHead(401); return res.end('Unauthorized') }
      const id = pathname.split('/')[5]
      return deployHandlers.handleInitGiteaRepo(req, res, id)
    }
```

- [ ] **Step 4: Commit**

```bash
cd C:/Users/jeffb/Desktop/code/cloudpipe
git add src/core/gitea.js src/core/admin/deploy-handlers.js src/core/admin.js
git commit -m "feat: Gitea integration — auto repo creation + webhook registration"
```

---

## Task 5: Pipee — Git Database Schema + Deploy Logic

**Files:**
- Modify: `C:/Users/jeffb/Desktop/code/pipee/src/core/db.js`
- Create: `C:/Users/jeffb/Desktop/code/pipee/src/core/git-deploy.js`

- [ ] **Step 1: Add git fields to Pipee sites schema**

In `src/core/db.js`, add a migration after `initSchema(db)` call inside `getDb()`:

```javascript
  _db = new Database(DB_PATH);
  _db.pragma('journal_mode = WAL');
  _db.pragma('busy_timeout = 5000');

  initSchema(_db);
  migrateGitFields(_db);

  return _db;
```

Add the migration function:

```javascript
function migrateGitFields(db) {
  // Add git columns to sites table if they don't exist
  const columns = db.prepare("PRAGMA table_info(sites)").all().map(c => c.name);

  if (!columns.includes('repo_url')) {
    db.exec("ALTER TABLE sites ADD COLUMN repo_url TEXT DEFAULT NULL");
  }
  if (!columns.includes('branch')) {
    db.exec("ALTER TABLE sites ADD COLUMN branch TEXT DEFAULT 'main'");
  }
  if (!columns.includes('last_commit')) {
    db.exec("ALTER TABLE sites ADD COLUMN last_commit TEXT DEFAULT NULL");
  }
  if (!columns.includes('deploy_method')) {
    db.exec("ALTER TABLE sites ADD COLUMN deploy_method TEXT DEFAULT 'upload'");
  }
}
```

Also update the `updateSite` function's `allowed` array to include the new fields:

```javascript
  const allowed = ['config', 'size', 'repo_url', 'branch', 'last_commit', 'deploy_method'];
```

- [ ] **Step 2: Create git deploy module**

Create `src/core/git-deploy.js`:

```javascript
/**
 * Pipee Git Deploy
 *
 * Clone/pull from a git repo and deploy as static site.
 * Used as alternative to ZIP upload.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { STATIC_DIR } = require('./static');

const GIT_CACHE_DIR = path.join(__dirname, '../../data/git-cache');

/** Ensure git cache directory exists */
function ensureGitCache() {
  if (!fs.existsSync(GIT_CACHE_DIR)) {
    fs.mkdirSync(GIT_CACHE_DIR, { recursive: true });
  }
}

/** Clone or pull a git repo, then copy files to site directory */
function deployFromGit(slug, repoUrl, branch = 'main') {
  ensureGitCache();

  const cacheDir = path.join(GIT_CACHE_DIR, slug);
  let commit;

  if (fs.existsSync(path.join(cacheDir, '.git'))) {
    // Pull latest
    execSync(`git -C "${cacheDir}" fetch origin`, {
      stdio: 'pipe', windowsHide: true, timeout: 30000,
    });
    execSync(`git -C "${cacheDir}" reset --hard origin/${branch}`, {
      stdio: 'pipe', windowsHide: true, timeout: 10000,
    });
  } else {
    // Fresh clone
    if (fs.existsSync(cacheDir)) {
      fs.rmSync(cacheDir, { recursive: true, force: true });
    }
    execSync(`git clone --depth 1 --branch ${branch} "${repoUrl}" "${cacheDir}"`, {
      stdio: 'pipe', windowsHide: true, timeout: 60000,
    });
  }

  // Get current commit
  commit = execSync(`git -C "${cacheDir}" rev-parse HEAD`, {
    encoding: 'utf-8', windowsHide: true,
  }).trim();

  // Validate: must have index.html
  if (!fs.existsSync(path.join(cacheDir, 'index.html'))) {
    throw new Error('NO_INDEX_HTML');
  }

  // Copy to site directory (excluding .git)
  const siteDir = path.join(STATIC_DIR, slug);
  const tempDir = path.join(STATIC_DIR, `.tmp-git-${slug}-${Date.now()}`);

  copyDirExcludeGit(cacheDir, tempDir);

  // Atomic swap
  const oldDir = path.join(STATIC_DIR, `.old-${slug}-${Date.now()}`);
  if (fs.existsSync(siteDir)) {
    fs.renameSync(siteDir, oldDir);
  }
  try {
    fs.renameSync(tempDir, siteDir);
  } catch (err) {
    if (fs.existsSync(oldDir)) {
      try { fs.renameSync(oldDir, siteDir); } catch { /* best effort */ }
    }
    throw err;
  }
  if (fs.existsSync(oldDir)) {
    setTimeout(() => {
      try { fs.rmSync(oldDir, { recursive: true, force: true }); } catch { /* ignore */ }
    }, 1000);
  }

  // Calculate size
  const size = getDirSize(siteDir);

  return { commit, size };
}

/** Copy directory recursively, excluding .git */
function copyDirExcludeGit(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === '.git') continue;
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirExcludeGit(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/** Calculate directory size */
function getDirSize(dir) {
  let size = 0;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isFile()) {
      size += fs.statSync(fullPath).size;
    } else if (entry.isDirectory()) {
      size += getDirSize(fullPath);
    }
  }
  return size;
}

module.exports = { deployFromGit };
```

- [ ] **Step 3: Commit**

```bash
cd C:/Users/jeffb/Desktop/code/pipee
git add src/core/db.js src/core/git-deploy.js
git commit -m "feat: git deploy module — clone/pull from Gitea repos"
```

---

## Task 6: Pipee — Git API Endpoints

**Files:**
- Modify: `C:/Users/jeffb/Desktop/code/pipee/src/core/user-api.js`

- [ ] **Step 1: Add git endpoints to Pipee user API**

In `src/core/user-api.js`, add import at the top:

```javascript
const { deployFromGit } = require('./git-deploy');
```

Add new route handlers in the `handle` function, after the existing `handleDeploy` route match:

```javascript
  // POST /api/user/sites/:slug/link-repo
  const linkRepoMatch = pathname.match(/^\/api\/user\/sites\/([a-z0-9][a-z0-9-]*[a-z0-9])\/link-repo$/);
  if (req.method === 'POST' && linkRepoMatch) {
    return handleLinkRepo(req, res, linkRepoMatch[1], config);
  }

  // POST /api/user/sites/:slug/git-deploy
  const gitDeployMatch = pathname.match(/^\/api\/user\/sites\/([a-z0-9][a-z0-9-]*[a-z0-9])\/git-deploy$/);
  if (req.method === 'POST' && gitDeployMatch) {
    return handleGitDeploy(req, res, gitDeployMatch[1], config);
  }
```

Then add the handler functions:

```javascript
// ── POST /api/user/sites/:slug/link-repo ──

async function handleLinkRepo(req, res, slug, config) {
  const result = verifyUserRequest(req, config);
  if (!result) return jsonErr(res, 'Not authenticated', 'UNAUTHORIZED', 401);

  const { user } = result;
  const site = db.getSite(slug);
  if (!site) return jsonErr(res, 'Site not found', 'NOT_FOUND', 404);
  if (site.user_id !== user.id) return jsonErr(res, 'Not your site', 'FORBIDDEN', 403);

  let body;
  try {
    body = await collectBody(req, 4096);
  } catch {
    return jsonErr(res, 'Failed to read body', 'BAD_REQUEST', 400);
  }

  let data;
  try {
    data = JSON.parse(body.toString('utf8'));
  } catch {
    return jsonErr(res, 'Invalid JSON', 'BAD_REQUEST', 400);
  }

  const repoUrl = (data.repo_url || '').trim();
  const branch = (data.branch || 'main').trim();

  if (!repoUrl) {
    return jsonErr(res, 'repo_url is required', 'BAD_REQUEST', 400);
  }

  // Basic URL validation
  if (!repoUrl.startsWith('http://') && !repoUrl.startsWith('https://') && !repoUrl.startsWith('git@')) {
    return jsonErr(res, 'Invalid repo URL', 'BAD_REQUEST', 400);
  }

  db.updateSite(slug, {
    repo_url: repoUrl,
    branch,
    deploy_method: 'git',
  });

  return jsonOk(res, {
    slug,
    repo_url: repoUrl,
    branch,
    deploy_method: 'git',
  });
}

// ── POST /api/user/sites/:slug/git-deploy ──

async function handleGitDeploy(req, res, slug, config) {
  const result = verifyUserRequest(req, config);
  if (!result) return jsonErr(res, 'Not authenticated', 'UNAUTHORIZED', 401);

  const { user } = result;
  const site = db.getSite(slug);
  if (!site) return jsonErr(res, 'Site not found', 'NOT_FOUND', 404);
  if (site.user_id !== user.id) return jsonErr(res, 'Not your site', 'FORBIDDEN', 403);

  if (!site.repo_url) {
    return jsonErr(res, 'No git repo linked. Use link-repo first.', 'NO_REPO', 400);
  }

  try {
    const { commit, size } = deployFromGit(slug, site.repo_url, site.branch || 'main');
    db.updateSite(slug, { last_commit: commit, size });

    const siteUrl = getSiteUrl(req, slug, config);

    return jsonOk(res, {
      url: siteUrl,
      slug,
      commit: commit.slice(0, 7),
      size,
    });
  } catch (err) {
    if (err.message === 'NO_INDEX_HTML') {
      return jsonErr(res, 'Repository must contain index.html at the root', 'NO_INDEX_HTML', 400);
    }
    return jsonErr(res, 'Git deploy failed', 'DEPLOY_FAILED', 500);
  }
}
```

- [ ] **Step 2: Commit**

```bash
cd C:/Users/jeffb/Desktop/code/pipee
git add src/core/user-api.js
git commit -m "feat: git deploy API endpoints — link-repo + git-deploy"
```

---

## Task 7: Pipee — Webhook Endpoint for Auto-Deploy

**Files:**
- Modify: `C:/Users/jeffb/Desktop/code/pipee/src/core/server.js` (or wherever the main HTTP handler is)
- Modify: `C:/Users/jeffb/Desktop/code/pipee/src/core/user-api.js`

- [ ] **Step 1: Add webhook endpoint to Pipee**

First, check the Pipee server routing. Add a webhook route. In `src/core/user-api.js`, add at the end of the `handle` function's route list:

```javascript
  // POST /api/webhook/:slug (Gitea push → auto deploy)
  const webhookMatch = pathname.match(/^\/api\/webhook\/([a-z0-9][a-z0-9-]*[a-z0-9])$/);
  if (req.method === 'POST' && webhookMatch) {
    return handleWebhookDeploy(req, res, webhookMatch[1], config);
  }
```

Add the handler:

```javascript
// ── POST /api/webhook/:slug (Gitea auto-deploy) ──

async function handleWebhookDeploy(req, res, slug, config) {
  const site = db.getSite(slug);
  if (!site) {
    res.writeHead(404, { 'content-type': 'application/json' });
    return res.end(JSON.stringify({ error: 'Site not found' }));
  }

  if (!site.repo_url || site.deploy_method !== 'git') {
    res.writeHead(400, { 'content-type': 'application/json' });
    return res.end(JSON.stringify({ error: 'Site not configured for git deploy' }));
  }

  // Verify Gitea signature if webhook secret is set
  const siteConfig = JSON.parse(site.config || '{}');
  if (siteConfig.webhookSecret) {
    let body;
    try {
      body = await collectBody(req, 1024 * 1024);  // 1MB max for webhook payload
    } catch {
      res.writeHead(400, { 'content-type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Failed to read body' }));
    }

    const crypto = require('crypto');
    const signature = req.headers['x-gitea-signature'] || '';
    const expected = crypto.createHmac('sha256', siteConfig.webhookSecret).update(body).digest('hex');
    if (signature !== expected) {
      res.writeHead(401, { 'content-type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Invalid signature' }));
    }
  }

  // Respond immediately, deploy in background
  res.writeHead(200, { 'content-type': 'application/json' });
  res.end(JSON.stringify({ success: true, message: 'Deploy triggered' }));

  try {
    const { commit, size } = deployFromGit(slug, site.repo_url, site.branch || 'main');
    db.updateSite(slug, { last_commit: commit, size });
    console.log(`[webhook] Deployed ${slug} from git (${commit.slice(0, 7)})`);
  } catch (err) {
    console.error(`[webhook] Git deploy failed for ${slug}:`, err.message);
  }
}
```

- [ ] **Step 2: Commit**

```bash
cd C:/Users/jeffb/Desktop/code/pipee
git add src/core/user-api.js
git commit -m "feat: Gitea webhook endpoint for auto-deploy on push"
```

---

## Task 8: Pipee — Console UI Git Features

**Files:**
- Modify: `C:/Users/jeffb/Desktop/code/pipee/public/console.html`

- [ ] **Step 1: Add git info to site cards**

In `console.html`, find the function that renders site cards (likely something like `renderSites` or `loadSites`). In the site card template, add a git section that shows when a site has a repo linked:

```javascript
// Inside the site card rendering, after the existing URL/size display:
const gitSection = site.repo_url ? `
  <div class="site-git" style="margin-top:8px; padding:8px; background:var(--bg-secondary); border-radius:6px; font-size:13px;">
    <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
      <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
      <span style="font-weight:500;">Git</span>
      ${site.last_commit ? `<code style="font-size:11px; opacity:0.7;">${site.last_commit.slice(0, 7)}</code>` : ''}
    </div>
    <code style="font-size:11px; display:block; padding:4px 6px; background:var(--bg-primary); border-radius:4px; word-break:break-all;">git clone ${site.repo_url}</code>
    <button onclick="gitDeploy('${site.slug}')" style="margin-top:6px; padding:4px 12px; font-size:12px; cursor:pointer; border:1px solid var(--border); border-radius:4px; background:var(--accent); color:white;">
      Deploy from Git
    </button>
  </div>
` : `
  <div style="margin-top:8px;">
    <button onclick="showLinkRepo('${site.slug}')" style="padding:4px 12px; font-size:12px; cursor:pointer; border:1px solid var(--border); border-radius:4px; background:transparent; color:var(--text-secondary);">
      + Link Git Repo
    </button>
  </div>
`;
```

- [ ] **Step 2: Add JavaScript functions for git operations**

Add these functions to the script section of `console.html`:

```javascript
async function showLinkRepo(slug) {
  const repoUrl = prompt('Enter Gitea/Git repo URL:');
  if (!repoUrl) return;

  const branch = prompt('Branch (default: main):', 'main') || 'main';

  try {
    const res = await fetch(`/api/user/sites/${slug}/link-repo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('pipee_token')}`,
      },
      body: JSON.stringify({ repo_url: repoUrl, branch }),
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.error || 'Failed to link repo');
      return;
    }

    loadSites(); // Refresh the site list
  } catch (err) {
    alert('Failed to link repo: ' + err.message);
  }
}

async function gitDeploy(slug) {
  if (!confirm('Deploy latest code from git?')) return;

  const btn = event.target;
  btn.disabled = true;
  btn.textContent = 'Deploying...';

  try {
    const res = await fetch(`/api/user/sites/${slug}/git-deploy`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('pipee_token')}`,
      },
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.error || 'Deploy failed');
      return;
    }

    loadSites(); // Refresh
  } catch (err) {
    alert('Deploy failed: ' + err.message);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Deploy from Git';
  }
}
```

- [ ] **Step 3: Update the site list fetch to include git fields**

Make sure the `loadSites` function (or equivalent) passes the `repo_url`, `branch`, `last_commit`, and `deploy_method` fields from the API response to the card renderer. The API already returns these from `db.listSitesByUser()` since SQLite returns all columns.

In the site mapping in `handleUserSites`, update to include:

```javascript
const sites = db.listSitesByUser(user.id).map(s => ({
    slug: s.slug,
    url: getSiteUrl(req, s.slug, config),
    size: s.size,
    config: JSON.parse(s.config || '{}'),
    repo_url: s.repo_url,
    branch: s.branch,
    last_commit: s.last_commit,
    deploy_method: s.deploy_method,
    created_at: s.created_at,
    updated_at: s.updated_at,
}));
```

- [ ] **Step 4: Commit**

```bash
cd C:/Users/jeffb/Desktop/code/pipee
git add public/console.html src/core/user-api.js
git commit -m "feat: Pipee console git UI — link repo, deploy from git"
```

---

## Task 9: CloudPipe MCP Tool for Gitea

**Files:**
- Create or modify: `C:/Users/jeffb/Desktop/code/cloudpipe/data/manifests/gitloop.json` (if exists, else create)
- Modify: `C:/Users/jeffb/Desktop/code/cloudpipe/mcp/core-tools.js`

- [ ] **Step 1: Add Gitea MCP tools to CloudPipe core tools**

In `mcp/core-tools.js`, add a new tool for initializing Gitea repos:

```javascript
{
  name: 'init_repo',
  description: 'Create a Gitea repository for a CloudPipe project and register a deploy webhook',
  inputSchema: {
    type: 'object',
    properties: {
      projectId: { type: 'string', description: 'CloudPipe project ID' },
    },
    required: ['projectId'],
  },
  handler: async ({ projectId }) => {
    const res = await fetch(`${ADMIN_URL}/api/_admin/deploy/projects/${encodeURIComponent(projectId)}/init-gitea`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${getToken()}`, 'Content-Type': 'application/json' },
    })
    return res.json()
  },
},
```

Note: Check the existing pattern in `core-tools.js` for how tools are registered and follow the same pattern. The tool may need to be added to the `tools` array.

- [ ] **Step 2: Commit**

```bash
cd C:/Users/jeffb/Desktop/code/cloudpipe
git add mcp/core-tools.js
git commit -m "feat: add init_repo MCP tool for Gitea integration"
```

---

## Task 10: Config + Documentation

**Files:**
- Modify: `C:/Users/jeffb/Desktop/code/workhub/gitloop/.env` (add CloudPipe vars)
- Modify: `C:/Users/jeffb/Desktop/code/cloudpipe/config.json` (add Gitea section)

- [ ] **Step 1: Add CloudPipe env vars to GitLoop .env**

Append to `.env`:

```
# CloudPipe integration
CLOUDPIPE_URL=http://localhost:8787
CLOUDPIPE_PASSWORD=
CLOUDPIPE_REPO_MAP={}
```

- [ ] **Step 2: Add Gitea config to CloudPipe config.json**

Add a `gitea` section to `config.json`:

```json
{
  "gitea": {
    "url": "http://localhost:3000",
    "token": "",
    "owner": "cloudpipe"
  }
}
```

- [ ] **Step 3: Commit all config changes**

```bash
cd C:/Users/jeffb/Desktop/code/workhub/gitloop
git add .env
git commit -m "chore: add CloudPipe integration env vars"
```

---

## Verification Checklist

After all tasks:

1. **GitLoop** → TypeScript compiles (`npx tsc --noEmit`)
2. **GitLoop** → Gitea push event triggers CloudPipe deploy (with CLOUDPIPE_REPO_MAP configured)
3. **CloudPipe** → Accepts both `X-Hub-Signature-256` and `X-Gitea-Signature` headers
4. **CloudPipe** → `POST /api/_admin/deploy/projects/{id}/init-gitea` creates Gitea repo + webhook
5. **Pipee** → `POST /api/user/sites/{slug}/link-repo` links a git repo to a site
6. **Pipee** → `POST /api/user/sites/{slug}/git-deploy` deploys from git
7. **Pipee** → `POST /api/webhook/{slug}` auto-deploys on Gitea push
8. **Pipee** → Console UI shows git info and deploy button
