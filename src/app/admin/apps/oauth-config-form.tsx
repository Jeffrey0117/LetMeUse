'use client'

import { useState } from 'react'

interface OAuthConfig {
  clientId: string
  clientSecret: string
  enabled: boolean
}

export interface OAuthProviders {
  google?: OAuthConfig
  github?: OAuthConfig
}

export interface AppItemWithOAuth {
  id: string
  oauthProviders?: OAuthProviders
}

export function OAuthBadge({ provider, enabled }: { provider: string; enabled: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
        enabled
          ? 'bg-green-50 text-green-700 border border-green-200'
          : 'bg-zinc-50 text-zinc-400 border border-zinc-200'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${enabled ? 'bg-green-500' : 'bg-zinc-300'}`} />
      {provider}
    </span>
  )
}

interface OAuthEditFormProps {
  app: AppItemWithOAuth
  saving: boolean
  onSave: (providers: OAuthProviders) => void
  onCancel: () => void
}

export function OAuthEditForm({ app, saving, onSave, onCancel }: OAuthEditFormProps) {
  const [googleClientId, setGoogleClientId] = useState(app.oauthProviders?.google?.clientId ?? '')
  const [googleClientSecret, setGoogleClientSecret] = useState(app.oauthProviders?.google?.clientSecret ?? '')
  const [googleEnabled, setGoogleEnabled] = useState(app.oauthProviders?.google?.enabled ?? false)
  const [githubClientId, setGithubClientId] = useState(app.oauthProviders?.github?.clientId ?? '')
  const [githubClientSecret, setGithubClientSecret] = useState(app.oauthProviders?.github?.clientSecret ?? '')
  const [githubEnabled, setGithubEnabled] = useState(app.oauthProviders?.github?.enabled ?? false)

  function handleSave() {
    onSave({
      google: { clientId: googleClientId, clientSecret: googleClientSecret, enabled: googleEnabled },
      github: { clientId: githubClientId, clientSecret: githubClientSecret, enabled: githubEnabled },
    })
  }

  const inputClass = 'w-full px-2.5 py-1.5 border border-zinc-200 rounded text-xs outline-none focus:border-zinc-400 font-mono'

  return (
    <div className="mt-3 space-y-4">
      {/* Google */}
      <div className="bg-zinc-50 rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-zinc-700">Google OAuth</span>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={googleEnabled}
              onChange={(e) => setGoogleEnabled(e.target.checked)}
              className="w-3.5 h-3.5 rounded"
            />
            <span className="text-xs text-zinc-600">Enabled</span>
          </label>
        </div>
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Client ID"
            value={googleClientId}
            onChange={(e) => setGoogleClientId(e.target.value)}
            className={inputClass}
          />
          <input
            type="password"
            placeholder="Client Secret"
            value={googleClientSecret}
            onChange={(e) => setGoogleClientSecret(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {/* GitHub */}
      <div className="bg-zinc-50 rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-zinc-700">GitHub OAuth</span>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={githubEnabled}
              onChange={(e) => setGithubEnabled(e.target.checked)}
              className="w-3.5 h-3.5 rounded"
            />
            <span className="text-xs text-zinc-600">Enabled</span>
          </label>
        </div>
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Client ID"
            value={githubClientId}
            onChange={(e) => setGithubClientId(e.target.value)}
            className={inputClass}
          />
          <input
            type="password"
            placeholder="Client Secret"
            value={githubClientSecret}
            onChange={(e) => setGithubClientSecret(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-3 py-1.5 text-xs bg-zinc-900 text-white rounded-md hover:bg-zinc-800 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save OAuth Settings'}
        </button>
        <button
          onClick={onCancel}
          className="px-3 py-1.5 text-xs border border-zinc-200 rounded-md hover:bg-zinc-50"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
