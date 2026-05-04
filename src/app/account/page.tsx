'use client'

import { Suspense, useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { useLang } from '@/components/layout/lang-provider'
import { ProfileSection } from './profile-section'
import { PasswordSection } from './password-section'

interface UserProfile {
  id: string
  email: string
  displayName: string
  avatar?: string
  role: string
  createdAt: string
}

function useToken(appId: string): string | null {
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const hash = window.location.hash
    if (hash.includes("token=")) {
      const params = new URLSearchParams(hash.slice(1))
      const hashToken = params.get("token")
      if (hashToken) {
        setToken(hashToken)
        return
      }
    }

    if (appId) {
      const stored = localStorage.getItem(`lmu_${appId}_access_token`)
      if (stored) {
        setToken(stored)
        return
      }
    }

    const adminToken = localStorage.getItem("lmu_admin_token")
    if (adminToken) {
      setToken(adminToken)
    }
  }, [appId])

  return token
}

function AccountContent() {
  const { t, locale } = useLang()
  const searchParams = useSearchParams()
  const appId = searchParams.get("app") ?? ""
  const token = useToken(appId)

  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [editingName, setEditingName] = useState(false)
  const [nameValue, setNameValue] = useState("")
  const [savingName, setSavingName] = useState(false)

  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [passwordSuccess, setPasswordSuccess] = useState("")
  const [savingPassword, setSavingPassword] = useState(false)

  const [loggingOut, setLoggingOut] = useState(false)

  const fetchProfile = useCallback(async () => {
    if (!token) {
      setLoading(false)
      return
    }

    try {
      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? "Failed to load profile")
        return
      }

      setUser(data.data.user)
      setNameValue(data.data.user.displayName)
    } catch {
      setError("Network error")
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  async function handleSaveName() {
    if (!token || !nameValue.trim()) return
    setSavingName(true)

    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ displayName: nameValue.trim() }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? "Failed to update name")
        return
      }

      setUser((prev) => (prev ? { ...prev, displayName: nameValue.trim() } : prev))
      setEditingName(false)
    } catch {
      setError("Network error")
    } finally {
      setSavingName(false)
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    setPasswordError("")
    setPasswordSuccess("")

    if (newPassword !== confirmPassword) {
      setPasswordError(t("account.passwordMismatch"))
      return
    }

    if (!token) return
    setSavingPassword(true)

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      const data = await res.json()

      if (!res.ok) {
        setPasswordError(data.error ?? "Failed to change password")
        return
      }

      setPasswordSuccess(t("account.passwordChanged"))
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setShowPasswordForm(false)
    } catch {
      setPasswordError("Network error")
    } finally {
      setSavingPassword(false)
    }
  }

  async function handleLogout() {
    if (!token) return
    setLoggingOut(true)

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })
    } catch {
      // Continue with local cleanup even if API fails
    }

    if (appId) {
      localStorage.removeItem(`lmu_${appId}_access_token`)
      localStorage.removeItem(`lmu_${appId}_refresh_token`)
    }
    localStorage.removeItem("lmu_admin_token")
    document.cookie = "lmu_admin_token=; path=/; max-age=0"

    const loginUrl = appId ? `/login?app=${appId}` : "/login"
    window.location.href = loginUrl
  }

  function formatDate(dateStr: string): string {
    try {
      return new Date(dateStr).toLocaleDateString(
        locale === "zh" ? "zh-TW" : "en-US",
        { year: "numeric", month: "long", day: "numeric" }
      )
    } catch {
      return dateStr
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-zinc-400">{t("common.loading")}</p>
      </div>
    )
  }

  if (!token || (!user && !loading)) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <p className="text-sm text-zinc-500 mb-4">{t("account.notAuthenticated")}</p>
          <a
            href={appId ? `/login?app=${appId}` : "/login"}
            className="inline-block px-4 py-2 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-800"
          >
            {t("auth.login")}
          </a>
        </div>
      </div>
    )
  }

  if (error && !user) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg border border-red-200">
          {error}
        </div>
      </div>
    )
  }

  if (!user) return null


  return (
    <div className="w-full max-w-lg mx-auto py-12">
      <h1 className="text-2xl font-bold text-zinc-900 mb-8">{t("account.title")}</h1>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg border border-red-200 mb-6">
          {error}
        </div>
      )}

      {passwordSuccess && (
        <div className="bg-green-50 text-green-600 text-sm px-4 py-3 rounded-lg border border-green-200 mb-6">
          {passwordSuccess}
        </div>
      )}

      <ProfileSection
        user={user}
        editingName={editingName}
        nameValue={nameValue}
        savingName={savingName}
        onEditName={() => setEditingName(true)}
        onCancelEdit={() => {
          setEditingName(false)
          setNameValue(user.displayName)
        }}
        onNameChange={setNameValue}
        onSaveName={handleSaveName}
        formatDate={formatDate}
        t={t}
      />

      <PasswordSection
        showPasswordForm={showPasswordForm}
        currentPassword={currentPassword}
        newPassword={newPassword}
        confirmPassword={confirmPassword}
        passwordError={passwordError}
        savingPassword={savingPassword}
        onShowForm={() => {
          setShowPasswordForm(true)
          setPasswordError("")
          setPasswordSuccess("")
        }}
        onHideForm={() => {
          setShowPasswordForm(false)
          setCurrentPassword("")
          setNewPassword("")
          setConfirmPassword("")
          setPasswordError("")
        }}
        onCurrentPasswordChange={setCurrentPassword}
        onNewPasswordChange={setNewPassword}
        onConfirmPasswordChange={setConfirmPassword}
        onSubmit={handleChangePassword}
        t={t}
      />

      {/* Logout */}
      <div className="bg-white border border-zinc-200 rounded-xl p-6">
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full py-2.5 border border-red-200 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 disabled:opacity-50 transition-colors"
        >
          {loggingOut ? t("account.loggingOut") : t("account.logout")}
        </button>
      </div>
    </div>
  )
}

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <Suspense fallback={
        <div className="flex items-center justify-center py-20">
          <p className="text-sm text-zinc-400">Loading...</p>
        </div>
      }>
        <AccountContent />
      </Suspense>
    </div>
  )
}
