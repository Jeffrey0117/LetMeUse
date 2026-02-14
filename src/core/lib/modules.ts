import config, { type LetMeUseModule } from '../../../letmeuse.config'
import type { TranslationKey } from '@/lib/i18n'

export function isModuleEnabled(moduleName: string): boolean {
  return config.modules[moduleName]?.enabled ?? false
}

export function getEnabledModules(): Record<string, LetMeUseModule> {
  const enabled: Record<string, LetMeUseModule> = {}
  for (const [key, mod] of Object.entries(config.modules)) {
    if (mod.enabled) {
      enabled[key] = mod
    }
  }
  return enabled
}

export interface NavItem {
  href: string
  label: TranslationKey
  icon: string
}

export function getAdminNavItems(): NavItem[] {
  const items: NavItem[] = [
    { href: '/admin', label: 'admin.nav.dashboard', icon: 'LayoutDashboard' },
  ]

  if (isModuleEnabled('auth')) {
    items.push({ href: '/admin/users', label: 'admin.nav.users', icon: 'Users' })
    items.push({ href: '/admin/apps', label: 'admin.nav.apps', icon: 'KeyRound' })
    items.push({ href: '/admin/roles', label: 'admin.nav.roles', icon: 'ShieldCheck' })
    items.push({ href: '/admin/audit', label: 'admin.nav.audit', icon: 'FileText' })
  }

  for (const [, mod] of Object.entries(config.modules)) {
    if (mod.enabled && mod.adminPath && !['/admin/users', '/admin/apps'].includes(mod.adminPath)) {
      items.push({ href: mod.adminPath, label: mod.label, icon: mod.icon })
    }
  }

  return items
}

export function getPublicNavItems(): NavItem[] {
  const items: NavItem[] = [
    { href: '/', label: 'nav.dashboard', icon: 'Home' },
  ]

  if (isModuleEnabled('ads')) {
    items.push({ href: '/projects', label: 'nav.projects', icon: 'FolderOpen' })
    items.push({ href: '/ads', label: 'nav.ads', icon: 'Megaphone' })
  }

  if (isModuleEnabled('widgets')) {
    items.push({ href: '/templates', label: 'nav.templates', icon: 'LayoutGrid' })
  }

  if (isModuleEnabled('auth')) {
    items.push({ href: '/admin', label: 'nav.admin', icon: 'Shield' })
  }

  return items
}

export function getConfig() {
  return config
}
