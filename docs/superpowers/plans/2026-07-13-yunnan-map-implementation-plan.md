# Yunnan Map + External Links — Implementation Plan

**Date:** 2026-07-13  
**Spec:** [docs/superpowers/specs/2026-07-13-yunnan-map-baidu-gaode-design.md](../specs/2026-07-13-yunnan-map-baidu-gaode-design.md)  
**Approach:** A — schematic base map + pins + bottom sheet  
**Surface:** cities list page only

## Tasks

1. Add `map` i18n keys to all 5 locales
2. Add `lib/maps/links.ts` (Amap + Baidu panorama URL builders)
3. Add `lib/maps/map-points.ts` (16 schematic pin positions)
4. Add `YunnanMap` client component (SVG outline + pins + sheet state)
5. Add `MapPlaceSheet` + `MapActionButtons`
6. Compose into `/{locale}/cities` above search + cards
7. Manual verify: select city → counties → Details / Amap / Baidu

## Done when

- Cities page shows map
- 16 pins selectable
- County list in sheet
- External links open correctly
- Locales switch correctly
