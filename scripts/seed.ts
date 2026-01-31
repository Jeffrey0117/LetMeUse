import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

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

async function seed() {
  await mkdir(DATA_DIR, { recursive: true })
  await writeFile(
    path.join(DATA_DIR, 'projects.json'),
    JSON.stringify(projects, null, 2)
  )
  await writeFile(
    path.join(DATA_DIR, 'ads.json'),
    JSON.stringify(ads, null, 2)
  )
  console.log('Seeded data:')
  console.log(`  - ${projects.length} projects`)
  console.log(`  - ${ads.length} ads`)
}

seed().catch(console.error)
