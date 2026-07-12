# Supabase setup for See Yunnan

## 1. Create project

1. Open [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a project
3. Copy:
   - Project URL
   - `anon` public key
   - `service_role` key (server only)

## 2. Apply schema

In Supabase SQL Editor, run in order:

1. `supabase/migrations/20260712_0001_init.sql`
2. `supabase/seed/yunnan_regions.sql`

## 3. Configure web app

```bash
cd apps/web
cp .env.example .env.local
```

Fill:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
DATA_SOURCE=auto
```

`DATA_SOURCE`:

- `auto` (default): use Supabase when env exists, else local JSON
- `local`: force local JSON stores
- `supabase`: prefer Supabase

## 4. Promote admin

After first login/signup:

```sql
update public.profiles
set role = 'admin'
where id = '<your-user-uuid>';
```

## 5. Current dual-mode coverage

| Domain | Local JSON | Supabase |
|--------|------------|----------|
| Regions browse | yes | yes (published rows) |
| Guides public list | yes | partial (approved rows) |
| Guides apply/review/inquiries | yes | schema ready, writes still local |
| Premium grant/offline | yes | schema ready, writes still local |
| Admin region drafts | yes | local only for now |

## 6. Verify

```bash
# from repo root
npm run dev
```

Open:

- `/en/cities` should still work without Supabase
- with Supabase seeded, region source becomes `supabase`