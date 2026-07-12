import { getSupabasePublicClient } from '@/lib/supabase/public';
import type { Subscription } from './types';

export async function getSubscriptionByEmailFromSupabase(
  email: string,
): Promise<Subscription | null | undefined> {
  // profiles are keyed by auth uid, not email in current schema.
  // Until auth is fully wired, return undefined to signal "not available".
  void email;
  const supabase = getSupabasePublicClient();
  if (!supabase) return undefined;
  return undefined;
}