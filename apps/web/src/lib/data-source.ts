export type DataSourceMode = 'local' | 'supabase' | 'auto';

export function getDataSourceMode(): DataSourceMode {
  const raw = (process.env.DATA_SOURCE || 'auto').toLowerCase();
  if (raw === 'local' || raw === 'supabase' || raw === 'auto') return raw;
  return 'auto';
}

export function hasSupabaseEnv(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function shouldUseSupabase(): boolean {
  const mode = getDataSourceMode();
  if (mode === 'local') return false;
  if (mode === 'supabase') return hasSupabaseEnv();
  return hasSupabaseEnv();
}