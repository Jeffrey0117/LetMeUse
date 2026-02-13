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

export function generateAppSecret(): string {
  return nanoid(32)
}
