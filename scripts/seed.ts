import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import bcrypt from 'bcryptjs'
import { nanoid } from 'nanoid'

const DATA_DIR = path.join(process.cwd(), 'data')

const now = new Date().toISOString()

const projects = [
  {
    id: 'proj_demo001',
    name: 'My Blog',
    description: 'Personal blog with tech articles',
    domain: 'https://myblog.com',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'proj_demo002',
    name: 'E-Commerce Store',
    description: 'Online store for electronics',
    domain: 'https://mystore.com',
    createdAt: now,
    updatedAt: now,
  },
]

const ads = [
  {
    id: 'ad_demo0001',
    projectId: 'proj_demo001',
    name: 'Blog Promo Banner',
    type: 'bottom-banner' as const,
    status: 'enabled' as const,
    position: 'fixed-bottom' as const,
    headline: 'Subscribe to our newsletter!',
    bodyText: 'Get the latest tech articles delivered to your inbox every week.',
    ctaText: 'Subscribe Now',
    ctaUrl: 'https://myblog.com/subscribe',
    style: {
      backgroundColor: '#1e293b',
      textColor: '#f8fafc',
      ctaBackgroundColor: '#3b82f6',
      ctaTextColor: '#ffffff',
      borderRadius: '0px',
      zIndex: 9999,
      maxWidth: '100%',
      padding: '16px',
      customCSS: '',
    },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'ad_demo0002',
    projectId: 'proj_demo001',
    name: 'Sidebar Ad',
    type: 'sidebar' as const,
    status: 'enabled' as const,
    position: 'sidebar-right' as const,
    headline: 'Check out our course!',
    bodyText: 'Learn TypeScript in 30 days with our comprehensive course.',
    ctaText: 'Learn More',
    ctaUrl: 'https://myblog.com/courses/typescript',
    imageUrl: '',
    style: {
      backgroundColor: '#ffffff',
      textColor: '#1e293b',
      ctaBackgroundColor: '#10b981',
      ctaTextColor: '#ffffff',
      borderRadius: '12px',
      zIndex: 1000,
      maxWidth: '320px',
      padding: '20px',
      customCSS: '',
    },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'ad_demo0003',
    projectId: 'proj_demo002',
    name: 'Summer Sale Card',
    type: 'in-article-card' as const,
    status: 'draft' as const,
    position: 'inline' as const,
    headline: 'Summer Sale - Up to 50% Off!',
    bodyText: 'Shop the biggest sale of the year on all electronics.',
    ctaText: 'Shop Now',
    ctaUrl: 'https://mystore.com/sale',
    style: {
      backgroundColor: '#fef3c7',
      textColor: '#92400e',
      ctaBackgroundColor: '#f59e0b',
      ctaTextColor: '#ffffff',
      borderRadius: '16px',
      zIndex: 1000,
      maxWidth: '600px',
      padding: '24px',
      customCSS: '',
    },
    createdAt: now,
    updatedAt: now,
  },
]

// ── Auth seed data ──────────────────────────────────────

const adminEmail = process.env.LETMEUSE_DEFAULT_ADMIN_EMAIL ?? 'admin@example.com'
const adminPassword = process.env.LETMEUSE_DEFAULT_ADMIN_PASSWORD ?? 'changeme'

const defaultAppId = process.env.LETMEUSE_DEFAULT_APP_ID ?? `app_${nanoid(8)}`
const defaultAppDomains = process.env.LETMEUSE_DEFAULT_APP_DOMAINS
  ? process.env.LETMEUSE_DEFAULT_APP_DOMAINS.split(',').map(s => s.trim()).filter(Boolean)
  : ['http://localhost:3000', 'http://localhost:5173']

const defaultApp = {
  id: defaultAppId,
  name: 'letmeuse-demo',
  secret: nanoid(32),
  domains: defaultAppDomains,
  createdAt: now,
  updatedAt: now,
}

async function seed() {
  await mkdir(DATA_DIR, { recursive: true })

  // Seed projects
  await writeFile(
    path.join(DATA_DIR, 'projects.json'),
    JSON.stringify(projects, null, 2)
  )

  // Seed ads
  await writeFile(
    path.join(DATA_DIR, 'ads.json'),
    JSON.stringify(ads, null, 2)
  )

  // Seed default app
  await writeFile(
    path.join(DATA_DIR, 'apps.json'),
    JSON.stringify([defaultApp], null, 2)
  )

  // Seed admin user
  const passwordHash = await bcrypt.hash(adminPassword, 10)
  const adminUser = {
    id: `usr_${nanoid(12)}`,
    appId: defaultApp.id,
    email: adminEmail,
    passwordHash,
    displayName: 'Admin',
    role: 'admin',
    disabled: false,
    createdAt: now,
    updatedAt: now,
  }

  await writeFile(
    path.join(DATA_DIR, 'users.json'),
    JSON.stringify([adminUser], null, 2)
  )

  // Seed empty refresh tokens
  await writeFile(
    path.join(DATA_DIR, 'refresh_tokens.json'),
    JSON.stringify([], null, 2)
  )

  console.log('Seeded data:')
  console.log(`  - ${projects.length} projects`)
  console.log(`  - ${ads.length} ads`)
  console.log(`  - 1 app (${defaultApp.name}), ID: ${defaultApp.id}`)
  console.log(`  - 1 admin user (${adminEmail})`)
  console.log(`\nDefault app credentials:`)
  console.log(`  APP_ID:     ${defaultApp.id}`)
  console.log(`  APP_SECRET: ${defaultApp.secret}`)
  console.log(`\nAdmin login:`)
  console.log(`  Email:    ${adminEmail}`)
  console.log(`  Password: ${adminPassword}`)
}

seed().catch(console.error)
