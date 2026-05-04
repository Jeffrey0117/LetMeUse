'use client'

import type { TranslationKey } from '@/lib/i18n'

interface PasswordSectionProps {
  showPasswordForm: boolean
  currentPassword: string
  newPassword: string
  confirmPassword: string
  passwordError: string
  savingPassword: boolean
  onShowForm: () => void
  onHideForm: () => void
  onCurrentPasswordChange: (value: string) => void
  onNewPasswordChange: (value: string) => void
  onConfirmPasswordChange: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
  t: (key: TranslationKey) => string
}

export function PasswordSection({
  showPasswordForm,
  currentPassword,
  newPassword,
  confirmPassword,
  passwordError,
  savingPassword,
  onShowForm,
  onHideForm,
  onCurrentPasswordChange,
  onNewPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
  t,
}: PasswordSectionProps) {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-zinc-900">{t('account.changePassword')}</h3>
        {!showPasswordForm && (
          <button
            onClick={onShowForm}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            {t('projects.edit')}
          </button>
        )}
      </div>

      {showPasswordForm && (
        <form onSubmit={onSubmit} className="space-y-4">
          {passwordError && (
            <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg border border-red-200">
              {passwordError}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              {t('account.currentPassword')}
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => onCurrentPasswordChange(e.target.value)}
              required
              className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm outline-none focus:border-zinc-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              {t('account.newPassword')}
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => onNewPasswordChange(e.target.value)}
              required
              minLength={8}
              className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm outline-none focus:border-zinc-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              {t('account.confirmPassword')}
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => onConfirmPasswordChange(e.target.value)}
              required
              minLength={8}
              className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm outline-none focus:border-zinc-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={savingPassword}
              className="px-4 py-2 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-800 disabled:opacity-50"
            >
              {savingPassword ? t('account.saving') : t('account.save')}
            </button>
            <button
              type="button"
              onClick={onHideForm}
              className="px-4 py-2 border border-zinc-200 text-zinc-600 text-sm font-medium rounded-lg hover:bg-zinc-50"
            >
              {t('projects.cancel')}
            </button>
          </div>
        </form>
      )}

      {!showPasswordForm && (
        <p className="text-sm text-zinc-400">{'********'}</p>
      )}
    </div>
  )
}
