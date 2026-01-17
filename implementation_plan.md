# Implementation Plan - AI-Powered Dine-In System (Gemini Phase 1)

**Goal**: Implement "Deep Research" recommendations to enhance the Dine-In system with dynamic AI-powered venue categorization, menu organization, and image generation, leveraging Google Gemini and Maps Grounding.

## User Review Required
> [!IMPORTANT]
> **No Database Storage for Categories**: As per research, venue and menu categories will be dynamic (cached in session/Redis) and NOT stored in the permanent database schema. This allows for real-time evolution of categories without schema migrations.
>
> **Edge Function Updates**: The `gemini-features` function will be significantly expanded.

## Proposed Changes

### Backend (Supabase Edge Functions)
#### [MODIFY] [gemini-features/index.ts](file:///Users/jeanbosco/workspace/dinein/supabase/functions/gemini-features/index.ts)
- Add new actions: `categorize-venue`, `categorize-menu`.
- Implement `handleCategorizeVenue`:
    - Uses `googleSearch` (or Maps grounding if available in SDK) to fetch location context.
    - Returns structured JSON: primary category, cuisine types, ambiance, price range.
- Implement `handleCategorizeMenu`:
    - Takes list of menu items.
    - Returns structured JSON with dietary tags, flavor profiles, and smart grouping.
- Update `geminiRequestSchema` and `payloadSchemas`.

### Frontend (Apps/Web)
#### [NEW] [src/components/venues/CategoryBadges.tsx](file:///Users/jeanbosco/workspace/dinein/apps/web/src/components/venues/CategoryBadges.tsx)
- UI component to display dynamic tags (Cuisine, Ambiance, etc.).
- Skeleton state for loading.

#### [NEW] [src/hooks/useAICategorization.ts](file:///Users/jeanbosco/workspace/dinein/apps/web/src/hooks/useAICategorization.ts)
- Custom hook to fetch categories implementation.
- Implements `sessionStorage` caching (key: `categories_${venueId}`).
- Fallback to basic DB data if AI fails.

#### [MODIFY] [src/pages/venue/VenueDetails.tsx](file:///Users/jeanbosco/workspace/dinein/apps/web/src/pages/venue/VenueDetails.tsx)
- Integrate `useAICategorization`.
- Display `CategoryBadges` in the hero/header section.
- Pass AI-derived categories to Menu components.

#### [MODIFY] [src/components/menu/MenuGrid.tsx](file:///Users/jeanbosco/workspace/dinein/apps/web/src/components/menu/MenuGrid.tsx)
- Accept optional `aiCategories` prop.
- If present, use AI categories to group items functionality (e.g., "Vegetarian", "Spicy", "Chef's Specials") instead of just default DB categories.

## Verification Plan

### Automated Tests
- **Unit Tests**: Add tests for `CategoryBadges` and `useAICategorization` (mocking the API).
- **E2E Tests**: Update `vendor-journey.spec.ts` to verify the AI tags appear (mocking the Edge Function response to avoid costs/flakes).

### Manual Verification
1. **Venue Categorization**:
    - Open a Venue Details page.
    - Verify "Calculating smart categories..." skeleton appears.
    - Verify tags appear (e.g., "Italian", "Romantic", "$$$").
    - Refresh page -> Verify immediate load (from cache).
2. **Menu Categorization**:
    - Check menu items.
    - Verify they have enhanced tags (computed dynamically).
3. **Image Generation** (Existing but verified):
    - Trigger `generate-asset` for a menu item.
    - Verify image appears in Supabase Storage and updates the UI.

## Risks & Mitigations
- **Latency**: AI calls can take 2-4s.
    - *Mitigation*: Aggressive client-side caching (sessionStorage) + Optimistic UI (show basic DB data first).
- **Cost**: High volume of calls.
    - *Mitigation*: The Edge Function already has rate limiting. Use caching to minimize repeat calls.
- **Accuracy**: AI might hallucinate.
    - *Mitigation*: Use `googleSearch` grounding. Display "AI Generated" disclaimer if needed.
