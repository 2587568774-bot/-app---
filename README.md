# See Yunnan / 看见云南

Overseas-facing Yunnan place guide (province → county) with local guides and Premium subscription.

- **Design spec:** [docs/superpowers/specs/2026-07-12-see-yunnan-design.md](docs/superpowers/specs/2026-07-12-see-yunnan-design.md)
- **Implementation plan:** [docs/superpowers/plans/2026-07-12-see-yunnan-implementation-plan.md](docs/superpowers/plans/2026-07-12-see-yunnan-implementation-plan.md)
- **Phase 1:** Web (user + admin) + Supabase
- **Later:** iOS (SwiftUI) on the same backend

## Product (short)

- Place intel: weather, climate, altitude, food, scenery, cost of living, migration friendliness
- Guides: open application, review, inquiry leads
- Premium: **$19.90/month** — ad-free, offline packs, priority guide matching
- Guide commission (future orders): **15%**
- Early monetization: personal collection + admin grant supported before Stripe

## Repo structure

```
apps/web                 Next.js user site + /admin shell
packages/shared          locales, price, shared constants
supabase/migrations      Postgres schema + RLS
docs/                    product specs & plans
```

## Quick start (Web)

```bash
# from repo root
npm install
cp apps/web/.env.example apps/web/.env.local
# fill Supabase URL + anon key
npm run dev
```

Open http://localhost:3000/en

## Supabase

1. Create a Supabase project
2. Run SQL in `supabase/migrations/20260712_0001_init.sql`
3. Put keys into `apps/web/.env.local`
4. Promote your user to admin:

```sql
update public.profiles set role = 'admin' where id = '<your-user-uuid>';
```

## Status

M0 done. M0–M2: monorepo, region browse/search/weather, admin region CMS draft editor. Next: M3 guides.

## Admin CMS (M2 shell)

- /[locale]/admin dashboard
- /[locale]/admin/regions completeness list
- Edit form saves to pps/web/src/data/admin-drafts.json (local draft; Supabase write later)
