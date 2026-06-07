/**
 * API helper functions for communicating with the LetMeUse backend
 */

import { translateError } from './i18n'

export interface ApiDeps {
  baseUrl: string
  t: (key: string) => string
}

/**
 * API error with HTTP status — 讓呼叫端能區分「真的被拒 (401/403)」vs
 * 「暫時性失敗 (429 限流 / 5xx / 網路)」。後者不該觸發 clearTokens。
 */
export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

export async function apiPost(deps: ApiDeps, path: string, body: Record<string, unknown>): Promise<unknown> {
  const res = await fetch(`${deps.baseUrl}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const json = await res.json()
  if (!res.ok) {
    const raw = (json as { error?: string }).error ?? ''
    throw new ApiError(translateError(raw, deps.t) || deps.t('error.generic'), res.status)
  }
  return (json as { data?: unknown }).data ?? json
}

export async function apiGet(deps: ApiDeps, path: string, token?: string): Promise<unknown> {
  const headers: Record<string, string> = {}
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(`${deps.baseUrl}${path}`, { headers })
  const json = await res.json()
  if (!res.ok) {
    const raw = (json as { error?: string }).error ?? ''
    throw new ApiError(translateError(raw, deps.t) || deps.t('error.generic'), res.status)
  }
  return (json as { data?: unknown }).data ?? json
}

export async function apiPutAuth(deps: ApiDeps, path: string, body: Record<string, unknown>, token: string): Promise<unknown> {
  const res = await fetch(`${deps.baseUrl}${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  })
  const json = await res.json()
  if (!res.ok) {
    const raw = (json as { error?: string }).error ?? ''
    throw new ApiError(translateError(raw, deps.t) || deps.t('error.generic'), res.status)
  }
  return (json as { data?: unknown }).data ?? json
}

export async function apiPostAuth(deps: ApiDeps, path: string, body: Record<string, unknown>, token: string): Promise<unknown> {
  const res = await fetch(`${deps.baseUrl}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  })
  const json = await res.json()
  if (!res.ok) {
    const raw = (json as { error?: string }).error ?? ''
    throw new ApiError(translateError(raw, deps.t) || deps.t('error.generic'), res.status)
  }
  return (json as { data?: unknown }).data ?? json
}
