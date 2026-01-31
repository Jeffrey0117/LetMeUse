import Link from 'next/link'
import { getAll, PROJECTS_FILE, ADS_FILE } from '@/lib/storage'
import type { Project, Ad } from '@/lib/models'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const projects = await getAll<Project>(PROJECTS_FILE)
  const ads = await getAll<Ad>(ADS_FILE)
  const enabledAds = ads.filter((a) => a.status === 'enabled')
  const draftAds = ads.filter((a) => a.status === 'draft')

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-zinc-900">Dashboard</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Overview of your advertisements
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link
          href="/projects"
          className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
        >
          <p className="text-sm font-medium text-zinc-500">Projects</p>
          <p className="mt-1 text-3xl font-bold text-zinc-900">
            {projects.length}
          </p>
        </Link>
        <Link
          href="/ads"
          className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
        >
          <p className="text-sm font-medium text-zinc-500">Total Ads</p>
          <p className="mt-1 text-3xl font-bold text-zinc-900">{ads.length}</p>
        </Link>
        <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-zinc-500">Active Ads</p>
          <p className="mt-1 text-3xl font-bold text-emerald-600">
            {enabledAds.length}
          </p>
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <Link
          href="/ads/new"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 transition-colors"
        >
          + New Ad
        </Link>
        <Link
          href="/projects"
          className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 transition-colors"
        >
          Manage Projects
        </Link>
      </div>

      {draftAds.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-zinc-900">Draft Ads</h2>
          <div className="mt-3 space-y-2">
            {draftAds.map((ad) => (
              <Link
                key={ad.id}
                href={`/ads/${ad.id}/edit`}
                className="block rounded-md border border-amber-200 bg-amber-50 p-3 text-sm hover:bg-amber-100 transition-colors"
              >
                <span className="font-medium text-amber-900">{ad.name}</span>
                <span className="ml-2 text-amber-700">{ad.headline}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
