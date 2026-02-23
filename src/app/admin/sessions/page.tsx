"use client"

import { useEffect, useState, useCallback } from "react"
import { useLang } from "@/components/layout/lang-provider"

interface SessionItem {
  id: string
  userId: string
  userEmail: string
  device: string
  ip: string
  lastActiveAt: string
  createdAt: string
}

interface Meta {
  total: number
  page: number
  limit: number
}

export default function AdminSessionsPage() {
  const { t } = useLang()
  const [sessions, setSessions] = useState<SessionItem[]>([])
  const [meta, setMeta] = useState<Meta>({ total: 0, page: 1, limit: 20 })
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [revoking, setRevoking] = useState<string | null>(null)
  const [revokingAll, setRevokingAll] = useState<string | null>(null)

  const fetchSessions = useCallback(async () => {
    const token = localStorage.getItem("lmu_admin_token")
    if (!token) return

    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "20",
      })
      if (search) params.set("search", search)

      const res = await fetch(`/api/admin/sessions?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setSessions(data.data?.sessions ?? [])
      setMeta(data.meta ?? { total: 0, page: 1, limit: 20 })
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [page, search])

  useEffect(() => {
    fetchSessions()
  }, [fetchSessions])

  const revokeSession = async (sessionId: string) => {
    const token = localStorage.getItem("lmu_admin_token")
    if (!token) return

    setRevoking(sessionId)
    try {
      await fetch(`/api/admin/sessions/${sessionId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      await fetchSessions()
    } catch {
      // ignore
    } finally {
      setRevoking(null)
    }
  }

  const revokeAllForUser = async (userId: string) => {
    const token = localStorage.getItem("lmu_admin_token")
    if (!token) return

    setRevokingAll(userId)
    try {
      const userSessions = sessions.filter((s) => s.userId === userId)
      await Promise.all(
        userSessions.map((s) =>
          fetch(`/api/admin/sessions/${s.id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      )
      await fetchSessions()
    } catch {
      // ignore
    } finally {
      setRevokingAll(null)
    }
  }

  const totalPages = Math.ceil(meta.total / meta.limit)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">{t("admin.sessions.title")}</h1>
        <span className="text-sm text-zinc-500">
          {meta.total} {t("admin.sessions.total")}
        </span>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder={t("admin.sessions.searchPlaceholder")}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          className="w-full max-w-sm px-3 py-2 border border-zinc-200 rounded-lg text-sm outline-none focus:border-zinc-400"
        />
      </div>

      <div className="bg-white rounded-lg border border-zinc-200">
        {loading ? (
          <p className="px-4 py-8 text-zinc-400 text-sm text-center">{t("common.loading")}</p>
        ) : sessions.length === 0 ? (
          <p className="px-4 py-8 text-zinc-400 text-sm text-center">{t("admin.sessions.empty")}</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 text-left text-zinc-500">
                <th className="px-4 py-2 font-medium">{t("admin.table.email")}</th>
                <th className="px-4 py-2 font-medium">{t("admin.sessions.device")}</th>
                <th className="px-4 py-2 font-medium">{t("admin.sessions.ip")}</th>
                <th className="px-4 py-2 font-medium">{t("admin.sessions.lastActive")}</th>
                <th className="px-4 py-2 font-medium">{t("admin.sessions.createdAt")}</th>
                <th className="px-4 py-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => {
                const isFirstForUser =
                  sessions.findIndex((s) => s.userId === session.userId) ===
                  sessions.indexOf(session)
                const userSessionCount = sessions.filter(
                  (s) => s.userId === session.userId
                ).length

                return (
                  <tr key={session.id} className="border-b border-zinc-50 hover:bg-zinc-50">
                    <td className="px-4 py-2 text-zinc-900">{session.userEmail}</td>
                    <td className="px-4 py-2 text-zinc-700">{session.device ?? "-"}</td>
                    <td className="px-4 py-2 text-zinc-500 font-mono text-xs">
                      {session.ip ?? "-"}
                    </td>
                    <td className="px-4 py-2 text-zinc-500">
                      {new Date(session.lastActiveAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-zinc-500">
                      {new Date(session.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => revokeSession(session.id)}
                          disabled={revoking === session.id}
                          className="text-red-600 hover:text-red-800 text-xs font-medium disabled:opacity-40"
                        >
                          {revoking === session.id
                            ? t("admin.sessions.revoking")
                            : t("admin.sessions.revoke")}
                        </button>
                        {isFirstForUser && userSessionCount > 1 && (
                          <button
                            onClick={() => revokeAllForUser(session.userId)}
                            disabled={revokingAll === session.userId}
                            className="text-red-600 hover:text-red-800 text-xs font-medium border border-red-200 px-2 py-0.5 rounded disabled:opacity-40"
                          >
                            {revokingAll === session.userId
                              ? t("admin.sessions.revoking")
                              : t("admin.sessions.revokeAll")}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="px-3 py-1 text-sm border border-zinc-200 rounded disabled:opacity-40"
          >
            {t("admin.pagination.prev")}
          </button>
          <span className="text-sm text-zinc-600">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="px-3 py-1 text-sm border border-zinc-200 rounded disabled:opacity-40"
          >
            {t("admin.pagination.next")}
          </button>
        </div>
      )}
    </div>
  )
}
