/**
 * API helper functions for communicating with the LetMeUse backend
 */

import { translateError } from './i18n'

export interface ApiDeps {
  baseUrl: string
  t: (key: string) => string
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
    throw new Error(translateError(raw, deps.t) || deps.t('error.generic'))
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
    throw new Error(translateError(raw, deps.t) || deps.t('error.generic'))
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
    throw new Error(translateError(raw, deps.t) || deps.t('error.generic'))
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
    throw new Error(translateError(raw, deps.t) || deps.t('error.generic'))
  }
  return (json as { data?: unknown }).data ?? json
}
