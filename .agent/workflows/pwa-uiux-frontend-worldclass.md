---
description: 
---

bash -lc 'set -euo pipefail
DIR="$HOME/.gemini/antigravity/global_workflows"
mkdir -p "$DIR"

cat > "$DIR/pwa-uiux-frontend-worldclass.md" <<'"'"'EOF'"'"'
---
description: Convert “world-class PWA UI/UX research” into a concrete mobile-first UI/UX + frontend implementation plan (native-like feel, perf budgets, a11y, PWA architecture, testing + monitoring)
---

# PWA UI/UX + Frontend Workflow (World-Class, Mobile-First)

## Goal
Design and implement a world-class mobile-first web app/PWA with a native-like experience:
- Touch-first UX, minimal cognitive load, strong navigation
- High performance on slow networks + low-end devices
- WCAG 2.2 AA direction (practical)
- Safe PWA install/offline/update behavior
- A repeatable component system + performance budgets + test gates

## Inputs (confirm quickly; if missing, proceed with assumptions and list them)
- App archetype: Commerce | Discovery feed | Booking | Messaging | Dashboard portal | Other
- Audience: Client-facing mobile-first OR Staff/Admin portal OR Both
- Primary journeys (must list 3–5):
  - e.g., browse → view detail → act (book/order/submit) → confirmation
- Network target: 2G/3G resilience required? (yes/no)
- Tech stack: React/Vite/Next/etc + styling system
- PWA scope: offline read-only vs offline actions vs fully offline

---

# Required Outputs (non-negotiable)
1) **UX Blueprint**
- IA (navigation map)
- Screen list (mobile-first) + primary components per screen
- States inventory (loading/empty/error/success) for every screen
- Copy tone rules (short, clear, actionable)

2) **Design System Spec**
- Tokens: spacing, typography, radius, blur, shadows, color, motion
- Component inventory: Button, Input, Select, Card, Sheet/Drawer, Modal, Toast, Skeleton, Tabs, Table/List, Badge, Tooltip, Navbar/Tabbar

3) **Frontend Architecture Plan**
- Routing + code splitting strategy
- Data fetching/caching pattern
- Error boundary pattern (no blank screens)
- Performance budget + how to enforce it

4) **PWA Plan**
- Manifest + icons checklist
- Service worker strategy (cache rules + update safety)
- Offline UX policy (what works offline, what doesn’t)

5) **Accessibility Plan**
- WCAG 2.2 AA practical checklist (automated + manual)

6) **Implementation Task List**
- Small, verifiable steps with “how to verify”

7) **Verification Pack**
- Core flows checklist + mobile viewports + slow network sanity
- Lighthouse/a11y targets
- Rollback notes (especially if service worker changes)

---

# Phase 0 — Pick the “North Star” behaviors (do this first)
## 0.1 Choose 2 reference behaviors (name them)
- “Starbucks-like” = offline browse/cart continuity + skeletons + resilient UX
- “Uber-like” = tiny initial payload + usable on bad networks
- “Twitter Lite-like” = low data usage + fast scrolling feed
- “Tinder-like” = route splitting + prefetch + smooth transitions
Select only what fits the product. Don’t imitate everything.

## 0.2 Define success metrics (must include)
- Core Web Vitals targets (LCP/CLS/INP direction)
- Max initial JS budget (gzipped)
- Lighthouse minimums for: Performance, Accessibility, Best Practices, SEO
- Crash-free sessions target (via error monitoring)

Deliverable: 1-page “North Star spec”.

---

# Phase 1 — Mobile-first IA + Navigation (thumb-first)
## 1.1 Navigation decision (pick one primary)
Client-facing apps:
- Bottom Tab Bar (max 5 items) recommended for primary sections
- Hamburger for secondary/rare pages only
- FAB only if a single primary create action dominates
Staff/Admin portals:
- Sidebar (desktop) + compact mobile nav; keep clarity over decoration

## 1.2 Thumb zone rules (client-facing)
- Primary actions in bottom third
- Avoid critical CTAs top-right-only
- Confirm one-handed usability for primary journey

## 1.3 Breakpoints (mobile-first)
Use content-based breakpoints, but default check set:
- 360×800 (baseline)
- 390×844
- 768×1024
- 1366×768
- 1440+
Ensure no horizontal scroll and no layout “jumps”.

Deliverable: navigation map + route list + breakpoint plan.

---

# Phase 2 — Touch + Typography + Content (make it feel native)
## 2.1 Touch targets & spacing
- Tap targets >= 44px (iOS) / ~48dp (Android)
- At least 8px spacing between tappable targets
- Expand hit area beyond icon bounds

## 2.2 Typography rules
- Base font >= 16px (avoid iOS auto-zoom)
- Line-height 1.5–1.6
- Clear hierarchy (headings differ meaningfully)
- Prefer short labels, action verbs, and scannable layouts

## 2.3 Cognitive load
- Glanceable screens: one primary action
- Progressive disclosure for dense info
- Empty states must teach next action

Deliverable: typography scale + spacing grid + content rules.

---

# Phase 3 — Visual system (minimalist + glass, performance-safe)
## 3.1 Minimalism rules
- Fewer layers; hierarchy via spacing, size, and contrast
- “Decoration” never blocks readability or speed

## 3.2 Soft Liquid Glass rules (when used)
- Glass surfaces must have sufficient contrast (don’t blur text backgrounds into mush)
- Use blur + translucency on headers/modals/cards, not everywhere
- Prefer GPU-friendly properties (opacity/transform), avoid heavy filters everywhere

## 3.3 Dark mode + reduced motion
- Respect system theme when possible
- Respect prefers-reduced-motion: reduce/disable non-essential animations

Deliverable: token file + component styling rules.

---

# Phase 4 — Component system (build once, reuse everywhere)
Must implement/standardize:
- AppShell (header/tabbar/sidebar), PageHeader, Card
- Buttons (primary/secondary/ghost), IconButton with padding
- Inputs (text/select/textarea), FormField wrapper with validation UI
- Feedback: Toast, Alert, InlineError
- Loaders: Skeleton library (preferred) + small spinner
- Overlays: Modal + BottomSheet/Drawer (client apps favor sheet)
- Lists/Feed: ListItem patterns + virtualization strategy where needed

Deliverable: component inventory + ownership rules (where components live in monorepo).

---

# Phase 5 — Frontend architecture (speed + reliability)
## 5.1 Code splitting
- Route-level splitting is mandatory for non-trivial apps
- Prefetch likely-next routes for core journeys (only when safe)

## 5.2 Data fetching + caching
Choose a single consistent pattern:
- Server state cache (e.g., TanStack Query) recommended
Rules:
- Every request path has: timeout + error handling + retry strategy
- Never allow infinite loading: always show actionable error state

## 5.3 Error boundaries (no blank screens)
- App-level error boundary (recover UI)
- Route-level boundary (contain failures)

## 5.4 Long lists
- Virtualize feeds/menus/vendor lists
- Avoid blocking main thread; keep interactions responsive

Deliverable: architecture diagram + “no infinite loading” enforcement rules.

---

# Phase 6 — PWA implementation (safe and intentional)
## 6.1 Manifest checklist
- name/short_name, start_url, display=standalone (if appropriate), theme/background
- icons: 192 + 512 and maskable variants

## 6.2 Service worker strategy (choose intentionally)
- Static assets: Cache First (hashed assets)
- App shell HTML/entry: Network First or Stale-While-Revalidate (avoid stale bundle traps)
- API: Network First with fallback messaging; cache only if safe
- Offline page/message: controlled UX

## 6.3 Update safety (critical)
- Avoid “stale JS after deploy”
- Ensure user sees a safe update prompt or silent refresh strategy that doesn’t break sessions

Deliverable: SW caching policy + update flow + offline UX policy.

---

# Phase 7 — Accessibility (WCAG 2.2 AA practical gate)
Must meet:
- Semantic structure: headings, landmarks, labels
- Keyboard navigability (where relevant)
- Focus visible and logical tab order
- Contrast readable (glass must not reduce contrast)
- No hover-only controls
Testing:
- Automated: axe/lighthouse
- Manual: keyboard-only, screen reader spot-check for core flows

Deliverable: a11y issue list + fixes + retest notes.

---

# Phase 8 — Performance budgets + enforcement (treat performance as a feature)
## 8.1 Budget targets (set and enforce)
Example starting budgets (adjust per app):
- Initial JS (gzipped): <= 200KB (client-facing), <= 350KB (portal)
- Initial CSS (gzipped): <= 50KB
- Total requests on first load: <= 50
- Image: <= 100KB per typical mobile image (where feasible)

## 8.2 Core Web Vitals direction
- LCP < 2.5s target
- CLS < 0.1 target
- INP good direction (avoid main-thread blocking)

## 8.3 Techniques checklist
- Preload critical resources carefully
- Defer non-critical scripts
- WebP/AVIF + responsive images
- Reduce third-party scripts; load async
- Virtualize long lists
- Use skeletons for perceived speed

Deliverable: perf budget + measurement plan + top fixes list.

---

# Phase 9 — Testing + monitoring (ship with confidence)
Minimum gates:
- Unit tests for core logic (or deterministic checklist if time-limited)
- E2E smoke flows (login + primary journeys)
- Lighthouse CI or repeatable Lighthouse run with recorded scores
- Error monitoring (client) + key event logs (server/edge if exists)
- Post-launch: monitor web vitals (RUM) + JS error rate

Deliverable: test plan + smoke checklist + monitoring setup notes.

---

# Final “DONE” criteria (must be explicit)
- Mobile-first primary journey feels native-like (touch targets, nav, motion, speed)
- No blank screens; states everywhere
- Lighthouse meets agreed minimums
- Accessibility issues are addressed or explicitly tracked
- PWA install works; offline/update behavior is safe
- Rollback plan exists (especially if SW changes)

---

# Recommended workflow chain (choose based on task)
- New build or major redesign: run this workflow, then /parallel-split
- Hard QA pass: /browser-fullstack-test
- Measure readiness: /worldclass-pwa-audit
- Production gate: /go-live-readiness
EOF

echo ""
echo "Installed workflow:"
ls -la "$DIR/pwa-uiux-frontend-worldclass.md"
'
