import fs from 'fs';
import path from 'path';
import type { OfflinePack, PremiumStore, Subscription } from './types';
import { PREMIUM_PRICE_USD } from '@see-yunnan/shared';

const storePath = path.join(process.cwd(), 'src/data/premium-store.json');

function emptyStore(): PremiumStore {
  return {
    updated_at: new Date().toISOString(),
    subscriptions: [],
    offline_packs: [],
    ads_enabled: true,
  };
}

export function readPremiumStore(): PremiumStore {
  try {
    if (!fs.existsSync(storePath)) return emptyStore();
    return JSON.parse(fs.readFileSync(storePath, 'utf8')) as PremiumStore;
  } catch {
    return emptyStore();
  }
}

export function writePremiumStore(store: PremiumStore) {
  store.updated_at = new Date().toISOString();
  fs.writeFileSync(storePath, JSON.stringify(store, null, 2), 'utf8');
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function getSubscriptionByEmail(email: string): Subscription | undefined {
  const key = normalizeEmail(email);
  const now = Date.now();
  const store = readPremiumStore();
  const sub = store.subscriptions
    .filter((s) => s.email === key)
    .sort((a, b) => b.updated_at.localeCompare(a.updated_at))[0];
  if (!sub) return undefined;
  if (sub.status === 'active' && new Date(sub.current_period_end).getTime() <= now) {
    sub.status = 'expired';
    sub.updated_at = new Date().toISOString();
    writePremiumStore(store);
  }
  return sub;
}

export function isPremiumEmail(email?: string | null): boolean {
  if (!email) return false;
  const sub = getSubscriptionByEmail(email);
  return Boolean(sub && sub.status === 'active' && new Date(sub.current_period_end).getTime() > Date.now());
}

export function listSubscriptions(): Subscription[] {
  return readPremiumStore().subscriptions
    .slice()
    .sort((a, b) => b.updated_at.localeCompare(a.updated_at));
}

export function grantPremium(input: {
  email: string;
  months?: number;
  note?: string;
  provider?: 'manual' | 'stripe';
}): Subscription {
  const store = readPremiumStore();
  const email = normalizeEmail(input.email);
  const months = Math.max(1, Number(input.months) || 1);
  const now = new Date();
  const existing = store.subscriptions.find((s) => s.email === email && s.status === 'active');
  const base = existing && new Date(existing.current_period_end) > now
    ? new Date(existing.current_period_end)
    : now;
  const end = new Date(base);
  end.setMonth(end.getMonth() + months);

  if (existing) {
    existing.status = 'active';
    existing.current_period_end = end.toISOString();
    existing.note = input.note || existing.note;
    existing.provider = input.provider || existing.provider || 'manual';
    existing.updated_at = now.toISOString();
    writePremiumStore(store);
    return existing;
  }

  const sub: Subscription = {
    id: `sub-${Date.now().toString(36)}`,
    email,
    status: 'active',
    plan: 'monthly',
    price_usd: PREMIUM_PRICE_USD,
    provider: input.provider || 'manual',
    current_period_end: end.toISOString(),
    note: input.note,
    created_at: now.toISOString(),
    updated_at: now.toISOString(),
  };
  store.subscriptions.unshift(sub);
  writePremiumStore(store);
  return sub;
}

export function revokePremium(email: string) {
  const store = readPremiumStore();
  const key = normalizeEmail(email);
  const sub = store.subscriptions.find((s) => s.email === key && s.status === 'active');
  if (!sub) return { ok: false as const, error: 'Active subscription not found' };
  sub.status = 'canceled';
  sub.updated_at = new Date().toISOString();
  writePremiumStore(store);
  return { ok: true as const, subscription: sub };
}

export function listOfflinePacks(email?: string): OfflinePack[] {
  const store = readPremiumStore();
  if (!email) return store.offline_packs;
  const key = normalizeEmail(email);
  return store.offline_packs.filter((p) => p.email === key);
}

export function saveOfflinePack(email: string, region_slug: string): OfflinePack | { error: string } {
  if (!isPremiumEmail(email)) return { error: 'Premium required' };
  const store = readPremiumStore();
  const key = normalizeEmail(email);
  const existing = store.offline_packs.find((p) => p.email === key && p.region_slug === region_slug);
  if (existing) {
    existing.version += 1;
    existing.downloaded_at = new Date().toISOString();
    writePremiumStore(store);
    return existing;
  }
  const pack: OfflinePack = {
    id: `pack-${Date.now().toString(36)}`,
    email: key,
    region_slug,
    version: 1,
    downloaded_at: new Date().toISOString(),
  };
  store.offline_packs.unshift(pack);
  writePremiumStore(store);
  return pack;
}

export function adsEnabledFor(email?: string | null): boolean {
  const store = readPremiumStore();
  if (!store.ads_enabled) return false;
  return !isPremiumEmail(email);
}