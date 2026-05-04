'use client'

import type { TranslationKey } from '@/lib/i18n'

interface UserProfile {
  id: string
  email: string
  displayName: string
  avatar?: string
  role: string
  createdAt: string
}

interface ProfileSectionProps {
  user: UserProfile
  editingName: boolean
  nameValue: string
  savingName: boolean
  onEditName: () => void
  onCancelEdit: () => void
  onNameChange: (value: string) => void
  onSaveName: () => void
  formatDate: (dateStr: string) => string
  t: (key: TranslationKey) => string
}

export function ProfileSection({
  user,
  editingName,
  nameValue,
  savingName,
  onEditName,
  onCancelEdit,
  onNameChange,
  onSaveName,
  formatDate,
  t,
}: ProfileSectionProps) {
  const initials = user.displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-6 mb-6">
      <div className="flex items-center gap-4 mb-6">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.displayName}
            className="w-16 h-16 rounded-full object-cover border border-zinc-200"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-500 text-lg font-semibold">
            {initials}
          </div>
        )}
        <div className="flex-1 min-w-0">
          {editingName ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={nameValue}
                onChange={(e) => onNameChange(e.target.value)}
                className="flex-1 px-3 py-1.5 border border-zinc-200 rounded-lg text-sm outline-none focus:border-zinc-400"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onSaveName()
                  if (e.key === 'Escape') onCancelEdit()
                }}
              />
              <button
                onClick={onSaveName}
                disabled={savingName || !nameValue.trim()}
                className="px-3 py-1.5 bg-zinc-900 text-white text-xs font-medium rounded-lg hover:bg-zinc-800 disabled:opacity-50"
              >
                {savingName ? t('account.saving') : t('account.save')}
              </button>
              <button
                onClick={onCancelEdit}
                className="px-3 py-1.5 border border-zinc-200 text-zinc-600 text-xs font-medium rounded-lg hover:bg-zinc-50"
              >
                {t('projects.cancel')}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-zinc-900 truncate">
                {user.displayName}
              </h2>
              <button
                onClick={onEditName}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium shrink-0"
              >
                {t('projects.edit')}
              </button>
            </div>
          )}
          <p className="text-sm text-zinc-500 truncate">{user.email}</p>
        </div>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between py-2 border-b border-zinc-100">
          <span className="text-zinc-500">{t('account.email')}</span>
          <span className="text-zinc-900 font-medium">{user.email}</span>
        </div>
        <div className="flex items-center justify-between py-2 border-b border-zinc-100">
          <span className="text-zinc-500">{t('account.role')}</span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-700 capitalize">
            {user.role}
          </span>
        </div>
        <div className="flex items-center justify-between py-2">
          <span className="text-zinc-500">{t('account.memberSince')}</span>
          <span className="text-zinc-900 font-medium">{formatDate(user.createdAt)}</span>
        </div>
      </div>
    </div>
  )
}
