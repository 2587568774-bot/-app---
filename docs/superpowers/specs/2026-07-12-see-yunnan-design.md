# See Yunnan / 看见云南 — Product Design Spec

**Date:** 2026-07-12  
**Repo:** https://github.com/2587568774-bot/-app---  
**Status:** Approved (Approach A)  
**Phase 1 surface:** Overseas user Web + Admin (iOS later on same backend)

---

## 1. Product summary

**See Yunnan (看见云南)** is an overseas-facing guide to Yunnan, China, covering the province down to **county level**. Users browse structured place intel (weather, climate, altitude, food, scenery, cost of living, migration friendliness), then connect with local guides.

**Business model (Phase 1):**
- Monthly Premium: **USD $19.90**
- Benefits: **ad-free**, **offline packs**, **priority guide matching**
- Guide marketplace commission: **15%** (configured now; online paid bookings in Phase 2)

**Content pipeline:** public data baseline → optional AI draft → guide supplements → admin polish.

**Backend:** Supabase (Auth, Postgres, Storage, Edge Functions).  
**Web stack:** Next.js (App Router) + Tailwind + Stripe (or lighter personal payout path for early stage).  
**Future:** SwiftUI iOS client reusing the same Supabase project.

---

## 2. Goals & non-goals

### Goals (Phase 1)
- Publish full Yunnan administrative tree: province → cities → counties
- Unified place detail template with completeness scoring
- Multilingual UX (primary: en, zh-Hans, zh-Hant, ja, ko; architecture supports more)
- Guide open application + admin review + public profiles + inquiry leads
- Premium subscription with the three stated benefits
- Admin CMS for regions, i18n copy, media, guide review, basic metrics
- All durable state in Supabase for later iOS reuse

### Non-goals (Phase 1)
- App Store / native iOS app (no Mac yet)
- Guide online checkout & automatic split payout
- Social feed / short video
- Hotel/ticket e-commerce
- Perfect human translation for every locale on day one

---

## 3. Personas & roles

| Role | Needs |
|------|--------|
| Visitor | Browse places, switch language, understand basics without login |
| Member | Ad-free, offline packs, priority guide presentation |
| Guide | Apply, get approved, receive inquiry leads |
| Admin | Maintain region content, review guides, monitor subscriptions |

---

## 4. Information architecture

### User Web nav
1. Discover  
2. Guides  
3. Premium  
4. Account  

### Key routes
```
/                         Discover home
/cities                   City list
/cities/[slug]            City + child counties
/places/[slug]            County/place detail
/guides                   Guide list
/guides/[id]              Guide detail
/pricing                  Premium
/apply/guide              Guide application
/account                  Profile, language, offline packs, subscription
/admin/*                  Admin console (role-gated)
```

### Place detail modules
- Live weather (API, cached)
- Climate type & best months
- Altitude
- Food blurb
- Scenery blurb
- Cost of living index
- Migration friendliness score
- Summary / intro
- Related guides
- Offline download (members)
- Ad slot (non-members only)

---

## 5. Core user flows

### Browse a county
Discover → city → county → detail → optional related guide → optional subscribe/offline.

### Guide inquiry (Phase 1)
Guides → filter → detail → submit inquiry (login required) → email/admin notify → offline coordination.  
No in-app chat, no online payment.

### Guide onboarding
Apply → pending → admin approve/reject → public profile if approved.

### Subscribe
Pricing → login → Stripe Checkout (or approved early personal-collect path) → webhook updates `subscriptions` → benefits unlock.

---

## 6. Data model (Supabase)

### Tables
1. **profiles** — `id`, display_name, avatar_url, preferred_locale, role (`user|guide|admin`)
2. **regions** — tree (`parent_id`, level `province|city|county`, code, slug, lat/lng, altitude_m, status, completeness_score)
3. **region_i18n** — (`region_id`, locale) name, summary, food/scenery/migration blurbs; optional `machine_translated`
4. **region_metrics** — climate_type, cost_of_living_index, migration_friendliness, best_months, sources, updated_at
5. **region_media** — images, sort, credit
6. **guides** — user_id, status, headline, bio, languages[], service_region_ids[], specialties[], priority_score, contact fields (visibility rules)
7. **guide_applications** — application audit trail, reject reason
8. **guide_inquiries** — user_id, guide_id, region_id?, message, contact_email, status `new|contacted|closed`
9. **subscriptions** — user_id, status, plan `monthly`, price_usd 19.90, period end, provider ids
10. **offline_packs** — user_id, region_id, version, payload path/timestamp
11. **app_settings** — e.g. `platform_commission_rate=0.15`, ads flags, featured region ids

### Weather
Not primary durable storage. Fetch via Edge Function (Open-Meteo by lat/lng) with short TTL cache.

### RLS (summary)
- Published regions/i18n/metrics: public read; admin write
- Guides: approved public read; owner update; admin all
- Applications/inquiries: owner + related guide + admin
- Subscriptions/offline packs: owner + admin

---

## 7. Premium rules

| Benefit | Behavior |
|---------|----------|
| Ad-free | Hide ad slots when `subscription.status == active` |
| Offline packs | Generate versioned JSON pack; store client-side (Web cache) |
| Priority guides | Sorting boost + “Priority response” badge for members |

**Price:** $19.90 USD / month  

**Still free:** browsing published place data, viewing approved guides, submitting inquiries (login), applying as guide.

---

## 8. Guide marketplace (Phase 1 vs 2)

### Phase 1
- Open apply + review
- Public profile
- Inquiry leads only
- Commission rate stored as **15%** for future orders

### Phase 2
- Bookable services + online payment
- Platform retains 15%; payout to guides
- Optional messaging

### Simple priority scoring (Phase 1)
```
sort_score =
  priority_score
  + language_match ? 20 : 0
  + region_match ? 30 : 0
  + member_viewer_boost ? 10 : 0
```

---

## 9. i18n strategy

- UI strings via next-intl (or equivalent)
- Primary locales at launch quality bar: **en, zh-Hans, zh-Hant, ja, ko**
- Architecture allows additional locales
- Content fallback: requested locale → **en** → **zh-Hans**
- Machine-translated rows marked for later human polish

---

## 10. Tech stack

| Layer | Choice |
|-------|--------|
| User + Admin Web | Next.js App Router, Tailwind |
| Backend | Supabase |
| Payments (default) | Stripe Billing monthly |
| Weather | Open-Meteo via Edge Function |
| Repo layout | monorepo-style folders under this GitHub repo |
| Later mobile | SwiftUI + Supabase Swift SDK |

### Suggested repo layout
```
/apps/web
/supabase
/docs
/packages/shared
```

### Payment note (personal / early-stage)
Stripe is the default for overseas cards and subscription state machines.  
If the founder needs a lighter **personal collection** path before Stripe is fully ready, Phase 1 may use a **manual Premium grant** flow (admin marks user active after verified personal payment) or a hosted invoice link — with the same `subscriptions` table as source of truth. Automated entitlements still prefer Stripe webhooks as soon as available. Avoid putting long-lived payment secrets in the client.

---

## 11. Visual direction

- Names: 看见云南 / See Yunnan
- Tone: clean, trustworthy, editorial travel-tool hybrid
- Palette: plateau blue `#1F6F8B`, camellia accent `#C45C26`, warm paper `#F7F4EF`, ink `#1A1A1A`, pine green `#2F6F4E`
- Type: Inter + system CJK stack
- Logo: wordmark first; graphic later

---

## 12. Milestones

| ID | Deliverable |
|----|-------------|
| M0 | Repo scaffold, Supabase schema/RLS, auth shell, i18n shell |
| M1 | Full region tree import, place pages, search, weather |
| M2 | Admin CMS, media, completeness, multilingual editing |
| M3 | Guide apply/review/list/detail/inquiries |
| M4 | Premium $19.90, ad-free, offline packs, priority guides |
| M5 | SEO, performance, monitoring, content batch for launch |
| Later | iOS SwiftUI on same backend |

**Content policy:** publish full tree early; deep-complete hotspot cities first (Kunming, Dali, Lijiang, Xishuangbanna, Shangri-La, etc.).

---

## 13. Success criteria (Phase 1)

- Anonymous users can browse province→city→county intel
- Five primary languages switch with fallback
- Admin can edit content and review guides
- Logged-in users can submit guide inquiries
- Paying members get ad-free + offline + priority guide UX
- Single Supabase backend ready for iOS reuse

---

## 14. Founder checklist

1. Keep GitHub repo access working (rename to `see-yunnan` recommended)
2. Create Supabase project
3. Create Stripe account (test mode) **or** agree temporary personal-collection + admin grant
4. Confirm English name **See Yunnan**
5. 10–20 images (or use placeholders)
6. Domain + privacy/terms before public launch
7. Google OAuth client for Supabase
8. Admin emails
9. Later: Mac, Xcode, Apple Developer Program

---

## 15. Decisions log

| Topic | Decision |
|-------|----------|
| Scope | Whole Yunnan to county level |
| Approach | A — content-first MVP |
| Backend | Supabase |
| Phase 1 client | Web user + admin (not iOS yet) |
| Premium | $19.90/mo; ads off, offline, guide priority |
| Guides | Open apply + review; inquiries only in P1 |
| Commission | 15% (P2 orders) |
| Languages | Global architecture; P1 focus en + zh-Hans + zh-Hant + ja + ko |
| Content | Public data + guides + admin polish |
| Native path | iOS first later; Android reserved |

---

## 16. Approval

- Approach A approved by product owner  
- Design sections 1–5 approved  
- This document is the source of truth for implementation planning
