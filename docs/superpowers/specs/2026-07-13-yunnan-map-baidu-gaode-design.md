# See Yunnan Map + External Panorama Design

**Date:** 2026-07-13  
**Project:** 看见云南 / See Yunnan（海外版 Web）  
**Status:** Approved for implementation planning  
**Phase:** Phase 1 — Navigation & discovery

## Goal

Add a custom schematic Yunnan map on the cities page so users can browse prefecture-level cities, drill into counties, open place details, jump to Amap (Gaode) for navigation, and jump to Baidu Map panorama for real-world street/scenic views.

This phase optimizes for **导览定位** first. Marketing VR immersion and guide-service map features are deferred.

## Decisions (approved)

| Topic | Decision |
|---|---|
| Primary goal | Navigation first; marketing + guide business later |
| Map type | Custom schematic Yunnan map (not a full live tile map) |
| Real map jump | Open **Amap / 高德** for navigation |
| Panorama / VR | **No in-site VR player**; open **Baidu Map panorama** |
| Drill-down | City/prefecture first → county list in sheet |
| Placement | Top of **cities list page**; keep city cards below |
| Actions UI | Actions live in map popup/sheet (not crowded into every card) |
| County display | County list inside the city sheet (not all counties plotted on the base map) |
| Access control | Free in Phase 1 (no Premium lock) |

## Out of scope (Phase 1)

- In-site 360° / WebXR / panorama player
- True administrative boundary SVG heatmaps
- Home-page large map module
- Guide service-area polygons
- Offline map tiles
- Guaranteed panorama coverage for every county
- Editing map pin positions in admin CMS

Related but separate already-built work (not redefined here):
- Food image cards, culture photos, ethnic distribution on place pages
- Admin editor for food / culture images / ethnic mix

## User experience

### Page: `/{locale}/cities`

Layout order:

1. Page title + intro
2. **Yunnan schematic map** (new)
3. Search box
4. Existing city cards list

### Map interaction

1. Show Yunnan outline / schematic base + **16 city pins**
2. Tap a city pin → open bottom sheet
3. City sheet contains:
   - City name + short summary
   - Actions: **Details** | **Amap** | **Baidu Panorama**
   - Scrollable **county list** under the city
4. Tap a county → sheet focuses county:
   - County name
   - Same three actions
   - Back control to return to city level
5. Tap backdrop / close → dismiss sheet

### City cards

- Keep current card → city detail behavior
- Do **not** force Amap / Baidu buttons onto every card in Phase 1
- Map sheet is the fast external-jump path; cards remain browse-first

## Data

### Existing place fields

Each city and county already has:

- multi-language `names`
- `slug`
- `lat` / `lng`
- summary and related intel fields

### New map pin config

Add local schematic coordinates for the 16 cities only, e.g. `map-points.ts`:

- `slug`
- `x` percent (0–100) within map container
- `y` percent (0–100) within map container

These are **visual layout points**, not geodetic projections.

Counties are listed in the sheet from existing region dataset relationships; they are not plotted as base-map pins in Phase 1.

## External links

Centralize builders in `lib/maps/links.ts`:

- `buildAmapUrl(lat, lng, name)`
- `buildBaiduPanoramaUrl(lat, lng, name)`

Rules:

- Open in new tab: `target="_blank"` + `rel="noopener noreferrer"`
- Use each place’s own `lat` / `lng` and localized display name
- Mobile may deep-link into apps when the provider supports it; desktop opens web pages
- If `lat` / `lng` missing: hide Amap and Baidu buttons; keep Details only
- No complex retry when provider pages fail

### Provider roles

| Action | Provider | Purpose |
|---|---|---|
| Navigate | Amap (高德) | Real-world routing / location |
| Panorama | Baidu Map panorama | Real street / scenic panorama |
| In-site detail | See Yunnan | Structured place intel |

## Visual design

Reuse existing brand tokens:

- `paper` background
- `plateau` primary
- `camellia` accent
- `ink` text

Map chrome:

- Rounded card container, light border/shadow, consistent with city cards
- City pins: solid dots + short labels
- Active pin: larger, highlighted ring
- Sheet: bottom sheet on mobile; same component on desktop as bottom/center card

## Component breakdown

| Component / module | Responsibility |
|---|---|
| `YunnanMap` | Schematic map surface + pins + selection state |
| `MapPlaceSheet` | City/county sheet content and drill-down list |
| `MapActionButtons` | Details / Amap / Baidu actions |
| `lib/maps/links.ts` | External URL builders |
| `lib/maps/map-points.ts` | 16 schematic pin positions |
| `map` message namespace | i18n labels for map UX |
| `/{locale}/cities` page | Compose map above existing search + cards |

No new navigation tab in Phase 1.

## i18n

Add `map` strings for all supported locales (`en`, `zh-Hans`, `zh-Hant`, `ja`, `ko`), including:

- map section title / helper text
- counties heading
- Details
- Amap navigation
- Baidu panorama
- Back
- Close
- missing coordinates state

## Access control

Phase 1 map + external jumps are free for all users.

## Error / edge cases

| Case | Behavior |
|---|---|
| Missing coordinates | Hide Amap + Baidu; keep Details |
| Provider has no panorama | Accept Baidu fallback UI; do not block |
| Unknown slug / missing city data | Do not open sheet |
| Very long county lists | Sheet body scrolls |

## Success criteria

1. Cities page shows schematic Yunnan map above the list
2. User can select any of 16 cities and see its counties
3. City and county both expose Details / Amap / Baidu Panorama
4. Details routes to existing city/county pages
5. Labels work in supported locales
6. No in-site panorama player is introduced

## Later phases (not now)

- Home-page marketing map / VR entry
- Guide service-area map features
- True boundary SVG map
- In-site 360 player if real assets arrive
- Admin editing of schematic pin positions

## Implementation notes

- Prefer lightweight React + SVG/static schematic assets over map SDKs
- Keep pin config data-driven and easy to tweak
- Reuse existing region data APIs for names, counties, coordinates
- Keep changes localized to cities page + new map modules/components
- Do not regress existing city cards, search, or multi-language routing
