-- AdMan Database Schema
-- Use this as a reference for migrating from JSON to SQLite/PostgreSQL.
--
-- Migration steps:
-- 1. Install better-sqlite3 or pg (pnpm add better-sqlite3 @types/better-sqlite3)
-- 2. Create SqliteRepository implementing Repository interface
-- 3. Set DB_TYPE=sqlite in .env
-- 4. Run this schema to create tables
-- 5. Use seed script to migrate existing JSON data

-- ── Projects ────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  domain TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ── Ads ─────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS ads (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  position TEXT NOT NULL,
  category TEXT DEFAULT 'ad',
  content TEXT NOT NULL, -- JSON blob
  enabled INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_ads_project ON ads(project_id);

-- ── Apps ────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS apps (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  secret TEXT NOT NULL,
  domains TEXT NOT NULL DEFAULT '[]', -- JSON array
  webhook_url TEXT,
  oauth_providers TEXT, -- JSON blob
  require_email_verification INTEGER DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ── Users ───────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  app_id TEXT NOT NULL REFERENCES apps(id),
  email TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  display_name TEXT NOT NULL,
  avatar TEXT,
  role TEXT NOT NULL DEFAULT 'user',
  disabled INTEGER NOT NULL DEFAULT 0,
  email_verified INTEGER DEFAULT 0,
  oauth_provider TEXT,
  oauth_id TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  last_login_at TEXT
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_app ON users(app_id, email);
CREATE INDEX IF NOT EXISTS idx_users_app ON users(app_id);

-- ── Refresh Tokens ──────────────────────────────────────

CREATE TABLE IF NOT EXISTS refresh_tokens (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  app_id TEXT NOT NULL REFERENCES apps(id),
  token TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user ON refresh_tokens(user_id);

-- ── Verification Tokens ─────────────────────────────────

CREATE TABLE IF NOT EXISTS verification_tokens (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  app_id TEXT NOT NULL REFERENCES apps(id),
  type TEXT NOT NULL, -- 'email_verification' | 'password_reset'
  token TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_verification_tokens_token ON verification_tokens(token);

-- ── Roles ───────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS roles (
  id TEXT PRIMARY KEY,
  app_id TEXT NOT NULL REFERENCES apps(id),
  name TEXT NOT NULL,
  description TEXT,
  permissions TEXT NOT NULL DEFAULT '[]', -- JSON array
  is_default INTEGER DEFAULT 0,
  is_builtin INTEGER DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_roles_name_app ON roles(app_id, name);

-- ── Webhook Events ──────────────────────────────────────

CREATE TABLE IF NOT EXISTS webhook_events (
  id TEXT PRIMARY KEY,
  app_id TEXT NOT NULL REFERENCES apps(id),
  event TEXT NOT NULL,
  payload TEXT NOT NULL, -- JSON blob
  url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  status_code INTEGER,
  error TEXT,
  attempts INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_webhook_events_app ON webhook_events(app_id);

-- ── Audit Log ───────────────────────────────────────────

CREATE TABLE IF NOT EXISTS audit_log (
  id TEXT PRIMARY KEY,
  action TEXT NOT NULL,
  actor_id TEXT NOT NULL,
  actor_email TEXT,
  app_id TEXT,
  target_id TEXT,
  target_type TEXT,
  details TEXT, -- JSON blob
  ip TEXT,
  user_agent TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_audit_log_actor ON audit_log(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_app ON audit_log(app_id);

-- ── Sessions ────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  app_id TEXT NOT NULL REFERENCES apps(id),
  refresh_token_id TEXT NOT NULL,
  ip TEXT,
  user_agent TEXT,
  device TEXT,
  last_active_at TEXT NOT NULL DEFAULT (datetime('now')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);

-- ── Plans ───────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS plans (
  id TEXT PRIMARY KEY,
  app_id TEXT NOT NULL REFERENCES apps(id),
  name TEXT NOT NULL,
  description TEXT,
  price_monthly REAL NOT NULL DEFAULT 0,
  price_yearly REAL,
  currency TEXT NOT NULL DEFAULT 'USD',
  features TEXT NOT NULL DEFAULT '[]', -- JSON array
  limits TEXT, -- JSON object
  is_active INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_plans_app ON plans(app_id);

-- ── Subscriptions ───────────────────────────────────────

CREATE TABLE IF NOT EXISTS subscriptions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  app_id TEXT NOT NULL REFERENCES apps(id),
  plan_id TEXT NOT NULL REFERENCES plans(id),
  status TEXT NOT NULL DEFAULT 'active',
  interval TEXT NOT NULL DEFAULT 'monthly',
  current_period_start TEXT NOT NULL,
  current_period_end TEXT NOT NULL,
  cancelled_at TEXT,
  provider_subscription_id TEXT,
  provider_customer_id TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);

-- ── Invoices ────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS invoices (
  id TEXT PRIMARY KEY,
  subscription_id TEXT NOT NULL REFERENCES subscriptions(id),
  user_id TEXT NOT NULL REFERENCES users(id),
  app_id TEXT NOT NULL REFERENCES apps(id),
  amount REAL NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'pending',
  period_start TEXT NOT NULL,
  period_end TEXT NOT NULL,
  paid_at TEXT,
  provider_invoice_id TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_invoices_user ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_subscription ON invoices(subscription_id);
