---
description: Kick off any task in our AI-first Staff/Admin monorepo PWAs with a plan, task list, and verification gates
---

bash -lc 'set -euo pipefail
FILE="$HOME/.gemini/antigravity/global_workflows/kickoff.md"
mkdir -p "$(dirname "$FILE")"

cat > "$FILE" <<'"'"'EOF'"'"'
---
description: Global kickoff for all projects — robust, concise execution contract for AI-first monorepo PWAs (Staff/Admin + optional client app)
---

# /kickoff (GLOBAL)

## Goal
Start any task with a strict execution contract: correct scope, correct plan, correct gates, correct next workflows.

---

## 1) Classify the request (pick ONE)
FEATURE | BUGFIX | AUDIT | REFACTOR | GO-LIVE | DEPLOY | PERFORMANCE | SECURITY | UX-POLISH | DOCS

Then immediately propose a workflow chain (don’t execute yet):
- Multi-area work → /parallel-split
- Repo/system audit → /fullstack-audit (or /worldclass-pwa-audit if UX/perf heavy)
- Refactor/repair → /fullstack-refactor-repair (or /refactor-safely for small)
- Go-live decision → /go-live-readiness
- Browser QA → /browser-fullstack-test
- Cloudflare deploy → /cloudflare-pages-setup + /cloudflare-pages-env-vars + /cloudflare-pages-spa-routing + /cloudflare-pages-release
- Standards sync → /apply-standards
- README overhaul → /readme-comprehensive

---

## 2) Execution Contract (must output first)
Write a short contract:
- **Goal (1 sentence)**
- **In-scope (3–7 bullets)**
- **Out-of-scope (bullets)**
- **Repo + app path(s)** (monorepo locations)
- **App type**: Staff/Admin portal OR Client-facing mobile-first OR Both
- **Environments**: local/preview/prod (URLs if known)
- **Constraints**: stack choices, deadlines, “must not change” items

Ask ONLY blocking questions. If not blocked, proceed with explicit assumptions.

---

## 3) Universal Non-Negotiables (apply to all projects)
- Roles: Staff + Admin must exist (extra roles allowed).
- RBAC must be enforced in **UI + server/edge + DB/RLS (if used)**. Never UI-only.
- Every screen/route has **loading + empty + error + retry** (no blank screens).
- No infinite loading: timeouts + error boundaries + surfaced root cause.
- Minimalist modern UI; “Soft Liquid Glass” only when readability stays high.
- Motion must respect prefers-reduced-motion.
- Small diffs, phased changes; no drive-by refactors.
- “Done” requires: **Plan + Task List + Walkthrough (verification + risks + rollback).**

---

## 4) Baseline Snapshot (before changes)
Capture current state (even if quick):
- Build status: lint/typecheck/tests/build (or note missing scripts)
- Runtime status: does app load? any endless spinner? console errors?
- Auth status: login works? redirect loops?
- Data status: key requests succeed? any 401/403/5xx? any RLS denies?
- Deploy status (if relevant): Cloudflare settings + env vars separation

Output: a short “Baseline” block with evidence notes.

---

## 5) Implementation Plan (required artifact)
Produce a plan with only applicable sections:

### A) Architecture touchpoints
- Frontend: routing, app shell, data layer, state, error boundaries
- Backend/Edge: endpoints/functions, authz, validation, error format, logs
- DB/Supabase: schema, migrations, RLS/policies, indexes, seeds
- PWA: manifest, SW/cache strategy, offline + update safety
- Deploy: Cloudflare Pages settings, env discipline, SPA routing, headers/caching, rollback

### B) RBAC enforcement path (must be explicit)
- Role matrix: Staff vs Admin capabilities
- UI: route guards + UI control gating
- Server/Edge: authz checks
- DB/RLS: policy alignment (if used)

### C) UX rules for this task
- Portal vs client-app navigation choice
- State inventory: loading/empty/error/success
- Component system changes (tokens/components)
- Motion + reduced-motion

### D) Risks + Mitigations
List top risks + how you will reduce them.

### E) Rollback plan
- Code rollback (revert/rollback deploy)
- DB rollback or mitigation
- Service worker/update safety if touched

---

## 6) Task List (required artifact)
Write small tasks in safe order; each task must include “How to verify”:
1) Repro / baseline evidence (for bugs)
2) Contracts/types first (reduce churn)
3) DB/RLS/migrations (if needed) + rollback/mitigation
4) Backend/Edge implementation + authz
5) Frontend wiring + UX states + component updates
6) Tests (unit or smoke checklist)
7) Browser verification + RBAC attack simulation
8) Deploy steps + rollback readiness (if applicable)

---

## 7) Quality Gates (must be explicit)
List exact commands (or note they don’t exist and propose minimal scripts):
- lint:
- typecheck:
- tests:
- build:
- preview/dev:

Minimum browser checks:
- Staff: login → core flow
- Admin: login → admin-only action
- Staff tries admin URL directly → blocked
- Staff tries admin action via API replay → blocked
- Deep-link refresh works
- Mobile viewport sanity

If client-facing:
- 360×800 + 390×844 core journey
- touch targets >=44px, keyboard/input sane
- slow network sanity (no dead ends)

---

## 8) Output Format Rule (always)
When you finish work, output:
1) **What changed** (by area: UI / backend / DB / deploy)
2) **How to verify** (exact steps)
3) **Evidence** (screenshots/recordings/notes)
4) **Risks**
5) **Rollback**

Declare DONE only if gates pass and verification is documented.
EOF

echo "Updated: $FILE"
wc -c "$FILE" | awk "{print \"Chars:\", \$1}"
'
