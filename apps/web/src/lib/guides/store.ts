import fs from 'fs';
import path from 'path';
import { PLATFORM_COMMISSION_RATE } from '@see-yunnan/shared';
import type { Guide, GuideInquiry, GuidesStore } from './types';

const storePath = path.join(process.cwd(), 'src/data/guides-store.json');

function emptyStore(): GuidesStore {
  return { updated_at: new Date().toISOString(), guides: [], applications: [], inquiries: [] };
}

export function readGuidesStore(): GuidesStore {
  try {
    if (!fs.existsSync(storePath)) return emptyStore();
    return JSON.parse(fs.readFileSync(storePath, 'utf8')) as GuidesStore;
  } catch {
    return emptyStore();
  }
}

export function writeGuidesStore(store: GuidesStore) {
  store.updated_at = new Date().toISOString();
  fs.writeFileSync(storePath, JSON.stringify(store, null, 2), 'utf8');
}

export function listApprovedGuides(opts?: {
  region?: string;
  language?: string;
  q?: string;
  premiumBoost?: boolean;
}): Guide[] {
  const store = readGuidesStore();
  let list = store.guides.filter((g) => g.status === 'approved');

  if (opts?.region) {
    const r = opts.region.toLowerCase();
    list = list.filter((g) => g.service_region_slugs.some((s) => s.toLowerCase().includes(r)));
  }
  if (opts?.language) {
    const lang = opts.language.toLowerCase();
    list = list.filter((g) => g.languages.some((l) => l.toLowerCase() === lang));
  }
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    list = list.filter(
      (g) =>
        g.display_name.toLowerCase().includes(q) ||
        g.headline.toLowerCase().includes(q) ||
        g.bio.toLowerCase().includes(q) ||
        g.specialties.some((s) => s.toLowerCase().includes(q)),
    );
  }

  return list.sort((a, b) => {
    const boost = opts?.premiumBoost ? 10 : 0;
    const as = a.priority_score + boost;
    const bs = b.priority_score + boost;
    return bs - as || a.display_name.localeCompare(b.display_name);
  });
}

export function getGuide(id: string): Guide | undefined {
  return readGuidesStore().guides.find((g) => g.id === id);
}

export function listAllGuides(): Guide[] {
  return readGuidesStore().guides.slice().sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export function createGuideApplication(input: {
  display_name: string;
  headline: string;
  bio: string;
  years_experience: number;
  languages: string[];
  service_region_slugs: string[];
  specialties: string[];
  contact_email: string;
}): Guide {
  const store = readGuidesStore();
  const id = `g-${Date.now().toString(36)}`;
  const guide: Guide = {
    id,
    status: 'pending',
    display_name: input.display_name,
    headline: input.headline,
    bio: input.bio,
    years_experience: input.years_experience,
    languages: input.languages,
    service_region_slugs: input.service_region_slugs,
    specialties: input.specialties,
    priority_score: 20,
    contact_email: input.contact_email,
    cover_url: null,
    created_at: new Date().toISOString(),
    reject_reason: null,
  };
  store.guides.unshift(guide);
  store.applications.unshift({
    id: `app-${Date.now().toString(36)}`,
    guide_id: id,
    created_at: new Date().toISOString(),
    payload: input,
  });
  writeGuidesStore(store);
  return guide;
}

export function reviewGuide(id: string, decision: 'approved' | 'rejected', reject_reason?: string) {
  const store = readGuidesStore();
  const guide = store.guides.find((g) => g.id === id);
  if (!guide) return { ok: false as const, error: 'Guide not found' };
  guide.status = decision;
  guide.reject_reason = decision === 'rejected' ? reject_reason || 'Rejected' : null;
  if (decision === 'approved') guide.priority_score = Math.max(guide.priority_score, 40);
  writeGuidesStore(store);
  return { ok: true as const, guide };
}

export function createInquiry(input: {
  guide_id: string;
  message: string;
  contact_email: string;
  contact_name?: string;
  region_slug?: string;
  estimated_budget_usd?: number;
}): GuideInquiry | { error: string } {
  const store = readGuidesStore();
  const guide = store.guides.find((g) => g.id === input.guide_id && g.status === 'approved');
  if (!guide) return { error: 'Guide not available' };

  const budget = Number(input.estimated_budget_usd);
  const hasBudget = Number.isFinite(budget) && budget > 0;
  const platform_commission_rate = PLATFORM_COMMISSION_RATE;
  const platform_fee_usd = hasBudget ? Math.round(budget * platform_commission_rate * 100) / 100 : undefined;
  const guide_net_usd = hasBudget ? Math.round((budget - (platform_fee_usd || 0)) * 100) / 100 : undefined;

  const inquiry: GuideInquiry = {
    id: `inq-${Date.now().toString(36)}`,
    guide_id: input.guide_id,
    region_slug: input.region_slug,
    message: input.message,
    contact_email: input.contact_email,
    contact_name: input.contact_name,
    status: 'new',
    created_at: new Date().toISOString(),
    estimated_budget_usd: hasBudget ? budget : undefined,
    platform_commission_rate,
    platform_fee_usd,
    guide_net_usd,
  };
  store.inquiries.unshift(inquiry);
  writeGuidesStore(store);
  return inquiry;
}

export function listInquiries() {
  return readGuidesStore().inquiries.slice().sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export function updateInquiryStatus(id: string, status: 'new' | 'contacted' | 'closed') {
  const store = readGuidesStore();
  const row = store.inquiries.find((i) => i.id === id);
  if (!row) return { ok: false as const, error: 'Inquiry not found' };
  row.status = status;
  writeGuidesStore(store);
  return { ok: true as const, inquiry: row };
}

export function guideCommissionSummary() {
  const inquiries = listInquiries().filter((i) => typeof i.estimated_budget_usd === 'number');
  const totalBudget = inquiries.reduce((n, i) => n + (i.estimated_budget_usd || 0), 0);
  const totalFee = inquiries.reduce((n, i) => n + (i.platform_fee_usd || 0), 0);
  return {
    rate: PLATFORM_COMMISSION_RATE,
    inquiry_count: inquiries.length,
    total_budget_usd: Math.round(totalBudget * 100) / 100,
    total_platform_fee_usd: Math.round(totalFee * 100) / 100,
  };
}
