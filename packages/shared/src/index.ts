export const APP_NAME = {
  en: 'See Yunnan',
  'zh-Hans': '看见云南',
  'zh-Hant': '看見雲南',
  ja: 'シー・ユンナン',
  ko: '시 윈난',
} as const;

export const LOCALES = ['en', 'zh-Hans', 'zh-Hant', 'ja', 'ko'] as const;
export type AppLocale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: AppLocale = 'en';

export const PREMIUM_PRICE_USD = 19.9;
export const PLATFORM_COMMISSION_RATE = 0.15;

export const USER_ROLES = ['user', 'guide', 'admin'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const REGION_LEVELS = ['province', 'city', 'county'] as const;
export type RegionLevel = (typeof REGION_LEVELS)[number];

export const GUIDE_STATUSES = ['pending', 'approved', 'rejected', 'suspended'] as const;
export type GuideStatus = (typeof GUIDE_STATUSES)[number];

export const SUBSCRIPTION_STATUSES = [
  'active',
  'canceled',
  'past_due',
  'expired',
] as const;
export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUSES)[number];

export const FALLBACK_LOCALE_CHAIN: AppLocale[] = ['en', 'zh-Hans'];
