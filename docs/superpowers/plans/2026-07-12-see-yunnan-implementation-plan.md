# See Yunnan — Implementation Plan

**Date:** 2026-07-12  
**Spec:** [docs/superpowers/specs/2026-07-12-see-yunnan-design.md](../specs/2026-07-12-see-yunnan-design.md)  
**Repo:** https://github.com/2587568774-bot/-app---  
**Approach:** A — content-first MVP  
**Phase 1 surface:** Next.js Web (user + admin) + Supabase  
**Out of scope now:** iOS app, guide online checkout split, social feed

---

## 0. Working agreements

- One backend only: **Supabase** (later iOS reuses it).
- Premium source of truth: `subscriptions` table.
  - Preferred: Stripe webhooks.
  - Early personal payout OK: **admin manual grant/extend**.
- Ship full region tree early; deep content can be incomplete.
- Primary UI locales: `en`, `zh-Hans`, `zh-Hant`, `ja`, `ko`.
- Commit small vertical slices; keep `main` runnable after each milestone.
- Never commit service-role keys, Stripe secret keys, or `.env.local`.

### Target monorepo layout
```
apps/web/                 Next.js App Router (user site + /admin)
packages/shared/          shared types, locales, constants
supabase/
  migrations/             SQL schema + RLS
  functions/              edge functions (weather, stripe, offline pack, notify)
  seed/                   region import scripts/data
docs/
  superpowers/specs/
  superpowers/plans/
```

### Local prerequisites (founder)
- [ ] Node.js 20+
- [ ] pnpm or npm
- [ ] Supabase project (URL + anon key + service role for server only)
- [ ] Stripe test keys **or** decide “manual grant only” for first internal demo
- [ ] GitHub push access

---

## Milestone M0 — Foundation (repo + auth + schema shell)

**Goal:** empty but real app boots; auth works; DB schema exists; i18n shell works.

### Tasks
1. Scaffold monorepo folders and root README scripts.
2. Create `apps/web` with Next.js (App Router) + TypeScript + Tailwind.
3. Add `next-intl` with 5 locales and language switcher stub.
4. Add Supabase clients:
   - browser client (anon)
   - server client (cookies)
   - admin client (service role, server-only)
5. Write first migration:
   - `profiles`, `regions`, `region_i18n`, `region_metrics`, `region_media`
   - `guides`, `guide_applications`, `guide_inquiries`
   - `subscriptions`, `offline_packs`, `app_settings`
   - enums/checks for roles, statuses, levels
6. Enable RLS policies per spec (public read published regions; owner/admin rules).
7. Auth trigger: on signup create `profiles` row.
8. Pages shell:
   - `/[locale]` home
   - `/[locale]/account`
   - login magic link + Google button placeholder
9. `/admin` layout gated by `profiles.role = admin` (deny others).
10. Seed `app_settings`:
    - `premium_price_usd = 19.90`
    - `platform_commission_rate = 0.15`
    - `ads_enabled = true`

### Done when
- `pnpm dev` shows localized home.
- Can sign in on staging Supabase.
- Migrations apply cleanly on fresh project.

### Files (expected)
- `apps/web/package.json`
- `apps/web/src/app/[locale]/...`
- `supabase/migrations/20260712_0001_init.sql`
- `packages/shared/src/constants.ts`

---

## Milestone M1 — Region tree + place pages + weather + search

**Goal:** visitor can browse province → city → county and open a detail page.

### Tasks
1. Import Yunnan administrative divisions to county level (codes, names, parents, centroids if available).
2. Seed `region_i18n` at least for `zh-Hans` + `en` names (others fallback).
3. Publish all regions with low completeness OK.
4. Build routes:
   - cities index
   - city detail + child counties
   - place/county detail
5. Place detail UI sections:
   - header + altitude
   - metrics chips (climate, COL, migration score)
   - food/scenery/migration blurbs (if present)
   - weather strip
6. Weather Edge Function:
   - input lat/lng
   - Open-Meteo fetch
   - cache ~10–30 minutes
7. Search by name across i18n + slug.
8. Completeness score function (filled fields / total fields).
9. Empty-state copy for missing content (“完善中 / Filling in”).

### Done when
- Every city/county is reachable by navigation or search.
- At least weather works for places with coordinates.
- No login required for browse.

### Data notes
- Prefer official division codes as `regions.code`.
- `slug` unique globally or unique per parent; document choice in migration.
- Keep import script idempotent (`upsert` by code).

---

## Milestone M2 — Admin CMS + media + multilingual editing

**Goal:** you can operate content without touching SQL.

### Tasks
1. Admin region tree browser.
2. Edit region core fields + metrics.
3. Edit `region_i18n` per locale; mark machine translation.
4. Upload images to Storage bucket `region-media`; attach to `region_media`.
5. Bulk actions: publish/unpublish, recompute completeness.
6. Featured regions for home (`app_settings` or `regions.is_featured`).
7. Basic audit timestamps (`updated_at`, `updated_by` if easy).
8. Protect storage: public read for published assets; write admin-only.

### Done when
- Non-engineer admin can improve a county page end-to-end.
- Home can show featured/high-completeness places.

---

## Milestone M3 — Guides (apply, review, list, inquiry)

**Goal:** two-sided connection without payments.

### Tasks
1. Public guides list + filters (region, language, specialty).
2. Guide detail page.
3. Apply form → `guide_applications` + pending `guides` row.
4. Admin review queue: approve/reject with reason.
5. On approve: public profile live; optional `profiles.role = guide`.
6. Inquiry form (login required) → `guide_inquiries`.
7. Notify:
   - Edge Function email (Resend/Supabase email) to guide + admin BCC
   - Admin inquiries inbox
8. Member priority ranking helper (shared function) used by list query.

### Done when
- New guide can apply and appear only after approval.
- User inquiry creates a trackable lead.

---

## Milestone M4 — Premium ($19.90), ads, offline, priority

**Goal:** monetization path live (Stripe and/or personal collection).

### Tasks
1. Pricing page with benefits copy in 5 locales.
2. Entitlement helper: `isPremium(userId)` reads active subscription.
3. Ad slots on home + place detail; hidden for premium.
4. **Path A — Stripe**
   - Checkout session Edge Function
   - Customer portal optional
   - Webhook updates `subscriptions`
5. **Path B — Personal collection (early)**
   - Pricing page shows payment instructions / contact
   - Admin “Grant Premium” UI: user email + months
   - Writes `subscriptions` with `provider = manual`
6. Offline packs:
   - member selects region
   - Edge Function builds JSON pack
   - client stores via IndexedDB/Cache
   - weather excluded or marked live-only
7. Guide list uses priority sort for premium viewers.
8. Account page shows subscription status + offline downloads.

### Done when
- A test user can become premium by Stripe **or** manual grant.
- Premium user sees no ads, can save a pack, sees priority guide ordering.

### Payment recommendation for launch week
- Build **both**: manual grant first (unblocks you), Stripe next (scale).
- Same entitlements code path for both.

---

## Milestone M5 — Launch hardening

**Goal:** public URL is safe, findable, and operable.

### Tasks
1. SEO: metadata, sitemap, robots, place pages SSR.
2. Performance: image sizes, list pagination, caching headers.
3. Error monitoring (Sentry or similar) optional but recommended.
4. Privacy policy + terms pages.
5. Rate-limit inquiry + auth abuse basics.
6. Seed/polish top destinations content pack.
7. Production env checklist + deploy (Vercel recommended for Next.js).
8. Backup note: Supabase PITR/export discipline.

### Done when
- Production web is public.
- Admin can run daily ops.
- Analytics baseline (even simple page views).

---

## Later (not this plan’s execution, only interface freeze)

- SwiftUI iOS app, same Supabase schema.
- Guide paid booking + **15%** platform commission + payouts.
- Broader locales with human review.
- Android after iOS.

**Interface freeze for mobile:** do not rename tables/columns casually after M3; prefer additive migrations.

---

## Execution order (recommended coding sequence)

1. M0 schema + web shell + auth  
2. M1 import + browse + weather  
3. M2 admin CMS  
4. M3 guides + inquiries  
5. M4 premium (manual grant → Stripe)  
6. M5 deploy + SEO + content batch  

Do **not** start iOS until M4 entitlements are stable.

---

## Task checklist for first coding session (M0 kickoff)

- [ ] Create folders `apps/web`, `packages/shared`, `supabase`
- [ ] `npx create-next-app` in `apps/web` (TS, Tailwind, App Router, ESLint)
- [ ] Add env example: `apps/web/.env.example`
- [ ] Add `supabase/migrations/20260712_0001_init.sql`
- [ ] Add shared constants: locales, price, commission
- [ ] Wire minimal home + locale switch
- [ ] Document how to link Supabase CLI / dashboard SQL paste
- [ ] Push to GitHub

---

## Test plan (lightweight)

| Area | Checks |
|------|--------|
| Auth | signup/login/logout; profile row created |
| RLS | anon can read published region; cannot write; non-admin denied `/admin` |
| Browse | city→county navigation; search hit; missing blurb safe |
| Weather | valid coords return data; bad coords graceful |
| Guides | pending hidden; approved visible; reject reason stored |
| Inquiries | only authed; visible to owner/guide/admin |
| Premium | manual grant unlocks ads/offline/priority; expiry removes benefits |
| i18n | switch locale; fallback chain works |

---

## Risk list & mitigations

| Risk | Mitigation |
|------|------------|
| No Mac / delayed iOS | Web-first; freeze API |
| Stripe account friction | Manual premium grant path |
| Huge county content gap | Completeness score + placeholders |
| Translation quality | Fallback + MT flag + admin edit |
| Secrets leak | server-only admin client; no secrets in git |
| Repo name `-app---` confusing | rename to `see-yunnan` when convenient |

---

## Definition of Phase 1 complete

Phase 1 is complete when M0–M5 done-when criteria are all true, and the design success criteria in the spec are met on a production URL.

---

## Next action after this plan is accepted

Start **M0 coding** in repo:
1. scaffold Next.js + shared + supabase migration  
2. commit  
3. ask founder for Supabase keys (privately) to connect real project  

**Do not implement M1+ until M0 boots.**
