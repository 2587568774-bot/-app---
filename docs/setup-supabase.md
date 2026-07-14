# Supabase setup for See Yunnan

## 1. Project keys
Put these in `apps/web/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
DATA_SOURCE=auto
```

Use Legacy API keys if needed:
- anon public -> NEXT_PUBLIC_SUPABASE_ANON_KEY
- service_role secret -> SUPABASE_SERVICE_ROLE_KEY

## 2. SQL to run (in order)
1. `supabase/migrations/20260712_0001_init.sql`
2. `supabase/seed/yunnan_regions.sql`
3. `supabase/seed/city_content_enrichment.sql`

## 3. Auth (manual)
1. Authentication -> Providers -> Email enabled
2. Redirect URL: `http://localhost:3000/auth/callback`
3. Google OAuth optional later

## 4. Local app
```powershell
cd E:\\无尽的\\see-yunnan
npm run dev
```

Open:
- http://localhost:3000/en/cities
- http://localhost:3000/en/cities/kunming
- http://localhost:3000/en/pricing
- http://localhost:3000/en/account
