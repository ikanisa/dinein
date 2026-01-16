# Task List: Remove Location Features

## Planning
- [x] Create Implementation Plan
- [x] Identify files to delete

## Execution
- [x] Delete `apps/web/services/locationService.ts`
- [x] Delete `apps/web/utils/location.ts`
- [x] Delete `apps/web/__tests__/services/locationService.test.ts`
- [x] Delete `supabase/functions/nearby_places_live` directory
- [x] Refactor `supabase/functions/gemini-features/index.ts` to remove location logic
- [x] Update `docs/user-journeys.md`

## Verification
- [x] Run `grep` to check for leftover reference
- [x] Run `npm run typecheck`
- [x] Run `npm run build`
