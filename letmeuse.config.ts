import type { TranslationKey } from '@/lib/i18n'

export interface LetMeUseModule {
  enabled: boolean
  label: TranslationKey
  icon: string
  adminPath?: string
  publicPath?: string
}

export interface LetMeUseConfig {
  name: string
  description: string
  modules: Record<string, LetMeUseModule>
  payment: 'none' | 'stripe' | 'ecpay'
  superAdminEmails: string[]
}

const config: LetMeUseConfig = {
  name: 'LetMeUse',
  description: 'Embeddable SaaS infrastructure platform',
  modules: {
    ads: {
      enabled: true,
      label: 'module.ads',
      icon: 'Megaphone',
      adminPath: '/admin/ads',
      publicPath: '/ads',
    },
    auth: {
      enabled: true,
      label: 'module.auth',
      icon: 'Shield',
      adminPath: '/admin/users',
    },
    widgets: {
      enabled: true,
      label: 'module.widgets',
      icon: 'LayoutGrid',
      adminPath: '/admin/widgets',
      publicPath: '/templates',
    },
    analytics: {
      enabled: false,
      label: 'module.analytics',
      icon: 'BarChart3',
      adminPath: '/admin/analytics',
    },
    billing: {
      enabled: false,
      label: 'module.billing',
      icon: 'CreditCard',
      adminPath: '/admin/plans',
    },
  },
  payment: 'none',
  superAdminEmails: [],
}

export default config
