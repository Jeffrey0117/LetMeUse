import {
  isModuleEnabled,
  getEnabledModules,
  getAdminNavItems,
  getPublicNavItems,
  type NavItem,
} from '../lib/modules'
import type { LetMeUseModule } from '../../../letmeuse.config'

export function useModuleEnabled(moduleName: string): boolean {
  return isModuleEnabled(moduleName)
}

export function useEnabledModules(): Record<string, LetMeUseModule> {
  return getEnabledModules()
}

export function useAdminNav(): NavItem[] {
  return getAdminNavItems()
}

export function usePublicNav(): NavItem[] {
  return getPublicNavItems()
}
