export const AD_TYPES = ['bottom-banner', 'sidebar', 'in-article-card'] as const
export type AdType = (typeof AD_TYPES)[number]

export const AD_STATUSES = ['enabled', 'disabled', 'draft'] as const
export type AdStatus = (typeof AD_STATUSES)[number]

export const AD_POSITIONS = [
  'fixed-bottom',
  'fixed-top',
  'inline',
  'sidebar-left',
  'sidebar-right',
] as const
export type AdPosition = (typeof AD_POSITIONS)[number]

export const AD_TYPE_LABELS: Record<AdType, string> = {
  'bottom-banner': 'Bottom Banner',
  'sidebar': 'Sidebar',
  'in-article-card': 'In-Article Card',
}

export const AD_STATUS_LABELS: Record<AdStatus, string> = {
  enabled: 'Enabled',
  disabled: 'Disabled',
  draft: 'Draft',
}

export const AD_POSITION_LABELS: Record<AdPosition, string> = {
  'fixed-bottom': 'Fixed Bottom',
  'fixed-top': 'Fixed Top',
  'inline': 'Inline',
  'sidebar-left': 'Sidebar Left',
  'sidebar-right': 'Sidebar Right',
}
