import { nanoid } from 'nanoid'

export function generateProjectId(): string {
  return `proj_${nanoid(8)}`
}

export function generateAdId(): string {
  return `ad_${nanoid(8)}`
}

export function generateAppId(): string {
  return `app_${nanoid(8)}`
}

export function generateUserId(): string {
  return `usr_${nanoid(12)}`
}

export function generateRefreshTokenId(): string {
  return `rt_${nanoid(16)}`
}

export function generateVerificationTokenId(): string {
  return `vt_${nanoid(16)}`
}

export function generateVerificationToken(): string {
  return nanoid(48)
}

export function generateAppSecret(): string {
  return nanoid(32)
}

export function generateWebhookEventId(): string {
  return `whe_${nanoid(12)}`
}

export function generateRoleId(): string {
  return `role_${nanoid(8)}`
}

export function generateAuditLogId(): string {
  return `audit_${nanoid(12)}`
}

export function generateSessionId(): string {
  return `sess_${nanoid(12)}`
}

export function generatePlanId(): string {
  return `plan_${nanoid(8)}`
}

export function generateSubscriptionId(): string {
  return `sub_${nanoid(12)}`
}

export function generateInvoiceId(): string {
  return `inv_${nanoid(12)}`
}
