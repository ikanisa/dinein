# Refactor Plan: Remove Location Features

## Goal
Remove all code, functions, and UI/UX related to location sharing, location detection, Google Places, and Google Maps. The app is a "DineIn" experience where users are already at the venue.

## Scope
- **Backend (Edge Functions):** Delete `nearby_places_live`. Refactor `gemini-features` to remove location context.
- **Frontend (Web):** Delete location services and utilities.
- **Documentation:** Update user journeys.

## Proposed Changes

### 1. Delete Files
- `apps/web/services/locationService.ts`
- `apps/web/utils/location.ts`
- `apps/web/__tests__/services/locationService.test.ts`
- `supabase/functions/nearby_places_live/index.ts`

### 2. Refactor Files
- **`supabase/functions/gemini-features/index.ts`**:
  - Remove `googleMaps` tool from Gemini configuration.
  - Remove `lat`/`lng` parameters and context from the prompt.
  - Remove distance calculations.
- **`docs/user-journeys.md`**:
  - Remove steps involving "Grant Location Permission" or "Find Nearby Venues".

## Verification Plan
1. **Static Analysis**: Run `grep` to ensure no stray references to `locationService` or `geolocation` remain.
2. **Typecheck**: `npm run typecheck` to catch broken imports.
3. **Build**: `npm run build` to ensure the app compiles.
