export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'expired';

export type Subscription = {
  id: string;
  email: string;
  status: SubscriptionStatus;
  plan: 'monthly';
  price_usd: number;
  provider: 'manual' | 'stripe';
  current_period_end: string;
  note?: string;
  created_at: string;
  updated_at: string;
};

export type OfflinePack = {
  id: string;
  email: string;
  region_slug: string;
  version: number;
  downloaded_at: string;
};

export type PremiumStore = {
  updated_at: string;
  subscriptions: Subscription[];
  offline_packs: OfflinePack[];
  ads_enabled: boolean;
};