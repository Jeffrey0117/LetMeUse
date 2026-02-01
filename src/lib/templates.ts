import type { AdType, AdPosition } from './constants'

export interface AdTemplate {
  id: string
  category: TemplateCategory
  name: { en: string; zh: string }
  description: { en: string; zh: string }
  dateRange: { en: string; zh: string }
  headline: { en: string; zh: string }
  bodyText: { en: string; zh: string }
  ctaText: { en: string; zh: string }
  style: {
    backgroundColor: string
    textColor: string
    ctaBackgroundColor: string
    ctaTextColor: string
    borderRadius: string
    padding: string
    maxWidth: string
  }
  suggestedType: AdType
  suggestedPosition: AdPosition
}

export type TemplateCategory = 'shopping' | 'seasonal' | 'member'

export const TEMPLATE_CATEGORIES = ['all', 'shopping', 'seasonal', 'member'] as const
export type TemplateCategoryFilter = (typeof TEMPLATE_CATEGORIES)[number]

export const AD_TEMPLATES: AdTemplate[] = [
  {
    id: '618-shopping',
    category: 'shopping',
    name: { en: '618 Shopping Festival', zh: '618 購物節' },
    description: {
      en: 'Mid-year mega sale event, one of the biggest e-commerce festivals',
      zh: '年中超級大促，電商最大購物節之一',
    },
    dateRange: { en: 'Jun 1 – Jun 18', zh: '6月1日 – 6月18日' },
    headline: {
      en: '618 Shopping Festival — Up to 70% Off!',
      zh: '618 購物節 — 全場低至3折！',
    },
    bodyText: {
      en: 'Massive discounts on top brands. Limited-time deals you don\'t want to miss!',
      zh: '精選品牌超值折扣，限時搶購，錯過不再！',
    },
    ctaText: { en: 'Shop Now', zh: '立即搶購' },
    style: {
      backgroundColor: '#b91c1c',
      textColor: '#fef3c7',
      ctaBackgroundColor: '#f59e0b',
      ctaTextColor: '#7c2d12',
      borderRadius: '8px',
      padding: '16px',
      maxWidth: '100%',
    },
    suggestedType: 'bottom-banner',
    suggestedPosition: 'fixed-bottom',
  },
  {
    id: 'double-11',
    category: 'shopping',
    name: { en: 'Double 11 Singles\' Day', zh: '雙11 光棍節' },
    description: {
      en: 'The world\'s largest online shopping event on November 11',
      zh: '全球最大線上購物節，每年11月11日',
    },
    dateRange: { en: 'Nov 1 – Nov 11', zh: '11月1日 – 11月11日' },
    headline: {
      en: 'Double 11 — Biggest Sale of the Year!',
      zh: '雙11 — 年度最大購物狂歡！',
    },
    bodyText: {
      en: 'Exclusive deals, flash sales, and free shipping. Don\'t miss out!',
      zh: '獨家優惠、限時秒殺、免運費，千萬別錯過！',
    },
    ctaText: { en: 'Grab Deals', zh: '搶優惠' },
    style: {
      backgroundColor: '#ea580c',
      textColor: '#ffffff',
      ctaBackgroundColor: '#18181b',
      ctaTextColor: '#ffffff',
      borderRadius: '8px',
      padding: '16px',
      maxWidth: '100%',
    },
    suggestedType: 'bottom-banner',
    suggestedPosition: 'fixed-bottom',
  },
  {
    id: 'double-12',
    category: 'shopping',
    name: { en: 'Double 12 Shopping Festival', zh: '雙12 購物節' },
    description: {
      en: 'Year-end shopping festival on December 12 with great deals',
      zh: '年末購物盛典，12月12日精選好物大促',
    },
    dateRange: { en: 'Dec 1 – Dec 12', zh: '12月1日 – 12月12日' },
    headline: {
      en: 'Double 12 — Year-End Deals Are Here!',
      zh: '雙12 — 年末好物大促來了！',
    },
    bodyText: {
      en: 'Wrap up the year with incredible savings across all categories.',
      zh: '全品類超值優惠，為今年畫下完美句點。',
    },
    ctaText: { en: 'Shop Deals', zh: '搶好物' },
    style: {
      backgroundColor: '#4f46e5',
      textColor: '#ffffff',
      ctaBackgroundColor: '#a855f7',
      ctaTextColor: '#ffffff',
      borderRadius: '8px',
      padding: '16px',
      maxWidth: '100%',
    },
    suggestedType: 'in-article-banner',
    suggestedPosition: 'inline',
  },
  {
    id: 'anniversary',
    category: 'member',
    name: { en: 'Anniversary Sale', zh: '周年慶' },
    description: {
      en: 'Celebrate your store anniversary with special offers',
      zh: '慶祝店慶，推出專屬優惠回饋顧客',
    },
    dateRange: { en: 'Flexible', zh: '彈性日期' },
    headline: {
      en: 'Anniversary Sale — Thank You for Your Support!',
      zh: '周年慶 — 感謝您的支持！',
    },
    bodyText: {
      en: 'Exclusive anniversary deals for our loyal customers. Limited time only!',
      zh: '專屬周年慶優惠回饋忠實顧客，限時限量！',
    },
    ctaText: { en: 'Celebrate Now', zh: '立即慶祝' },
    style: {
      backgroundColor: '#1e3a5f',
      textColor: '#f5e6c8',
      ctaBackgroundColor: '#d4a843',
      ctaTextColor: '#1e3a5f',
      borderRadius: '8px',
      padding: '16px',
      maxWidth: '100%',
    },
    suggestedType: 'top-notification',
    suggestedPosition: 'fixed-top',
  },
  {
    id: 'member-day',
    category: 'member',
    name: { en: 'Member\'s Day', zh: '會員日' },
    description: {
      en: 'Exclusive deals and rewards for registered members',
      zh: '會員專屬優惠與獎勵活動',
    },
    dateRange: { en: 'Flexible', zh: '彈性日期' },
    headline: {
      en: 'Member\'s Day — Exclusive VIP Rewards!',
      zh: '會員日 — VIP 專屬好禮！',
    },
    bodyText: {
      en: 'Members enjoy extra discounts, points multipliers, and free gifts.',
      zh: '會員獨享加倍折扣、點數加乘及免費好禮。',
    },
    ctaText: { en: 'Claim Reward', zh: '領取好禮' },
    style: {
      backgroundColor: '#581c87',
      textColor: '#f3e8ff',
      ctaBackgroundColor: '#c0c0c0',
      ctaTextColor: '#581c87',
      borderRadius: '8px',
      padding: '16px',
      maxWidth: '100%',
    },
    suggestedType: 'modal-popup',
    suggestedPosition: 'fixed',
  },
  {
    id: 'mid-year',
    category: 'seasonal',
    name: { en: 'Mid-Year Sale', zh: '年中慶' },
    description: {
      en: 'Mid-year clearance sale with refreshing summer deals',
      zh: '年中清倉大促，夏日清爽好物優惠',
    },
    dateRange: { en: 'Jun – Jul', zh: '6月 – 7月' },
    headline: {
      en: 'Mid-Year Sale — Fresh Deals for Summer!',
      zh: '年中慶 — 夏日清爽好物特惠！',
    },
    bodyText: {
      en: 'Cool prices for the hot season. Refresh your wardrobe and home!',
      zh: '炎夏涼價，煥新衣櫥與居家好物！',
    },
    ctaText: { en: 'Shop Summer', zh: '夏日特惠' },
    style: {
      backgroundColor: '#0d9488',
      textColor: '#ffffff',
      ctaBackgroundColor: '#ffffff',
      ctaTextColor: '#0d9488',
      borderRadius: '8px',
      padding: '16px',
      maxWidth: '100%',
    },
    suggestedType: 'sidebar-card',
    suggestedPosition: 'sidebar-right',
  },
  {
    id: 'back-to-school',
    category: 'seasonal',
    name: { en: 'Back to School', zh: '開學季' },
    description: {
      en: 'Back-to-school deals on supplies, tech, and essentials',
      zh: '開學用品、3C、必備好物優惠',
    },
    dateRange: { en: 'Aug – Sep', zh: '8月 – 9月' },
    headline: {
      en: 'Back to School — Gear Up & Save!',
      zh: '開學季 — 裝備齊全省更多！',
    },
    bodyText: {
      en: 'Everything you need for the new semester at unbeatable prices.',
      zh: '新學期所需一次備齊，超值優惠不容錯過。',
    },
    ctaText: { en: 'Get Ready', zh: '立即準備' },
    style: {
      backgroundColor: '#15803d',
      textColor: '#ffffff',
      ctaBackgroundColor: '#eab308',
      ctaTextColor: '#15803d',
      borderRadius: '8px',
      padding: '16px',
      maxWidth: '100%',
    },
    suggestedType: 'in-article-banner',
    suggestedPosition: 'inline',
  },
  {
    id: 'year-end-clearance',
    category: 'seasonal',
    name: { en: 'Year-End Clearance', zh: '年終出清' },
    description: {
      en: 'Final clearance sale to wrap up the year with huge savings',
      zh: '年終最後出清，超殺折扣為今年收尾',
    },
    dateRange: { en: 'Dec – Jan', zh: '12月 – 1月' },
    headline: {
      en: 'Year-End Clearance — Everything Must Go!',
      zh: '年終出清 — 全面清倉！',
    },
    bodyText: {
      en: 'Last chance to save big before the new year. Prices slashed site-wide!',
      zh: '新年前最後一波，全站瘋狂降價！',
    },
    ctaText: { en: 'Clear Now', zh: '立即搶購' },
    style: {
      backgroundColor: '#dc2626',
      textColor: '#ffffff',
      ctaBackgroundColor: '#ffffff',
      ctaTextColor: '#dc2626',
      borderRadius: '8px',
      padding: '16px',
      maxWidth: '100%',
    },
    suggestedType: 'bottom-banner',
    suggestedPosition: 'fixed-bottom',
  },
]

export function getTemplateById(id: string): AdTemplate | undefined {
  return AD_TEMPLATES.find((t) => t.id === id)
}
