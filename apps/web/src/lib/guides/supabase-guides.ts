import { getSupabasePublicClient } from '@/lib/supabase/public';
import type { Guide } from './types';

type GuideRow = {
  id: string;
  status: Guide['status'];
  headline: string | null;
  bio: string | null;
  years_experience: number | null;
  languages: string[] | null;
  service_region_ids: string[] | null;
  specialties: string[] | null;
  priority_score: number | null;
  contact_email: string | null;
  cover_url: string | null;
  created_at: string;
  user_id: string;
};

export async function listApprovedGuidesFromSupabase(opts?: {
  language?: string;
  q?: string;
}): Promise<Guide[] | null> {
  const supabase = getSupabasePublicClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('guides')
    .select('*')
    .eq('status', 'approved')
    .order('priority_score', { ascending: false });

  if (error || !data) {
    console.warn('[guides] supabase load failed', error?.message);
    return null;
  }

  let guides: Guide[] = (data as GuideRow[]).map((g) => ({
    id: g.id,
    status: g.status,
    display_name: g.headline || 'Guide',
    headline: g.headline || '',
    bio: g.bio || '',
    years_experience: g.years_experience || 0,
    languages: g.languages || [],
    service_region_slugs: [], // ids only in DB for now; keep empty until join map added
    specialties: g.specialties || [],
    priority_score: g.priority_score || 0,
    contact_email: g.contact_email || '',
    cover_url: g.cover_url,
    created_at: g.created_at,
  }));

  if (opts?.language) {
    const lang = opts.language.toLowerCase();
    guides = guides.filter((g) => g.languages.some((l) => l.toLowerCase() === lang));
  }
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    guides = guides.filter(
      (g) =>
        g.display_name.toLowerCase().includes(q) ||
        g.headline.toLowerCase().includes(q) ||
        g.bio.toLowerCase().includes(q),
    );
  }
  return guides;
}