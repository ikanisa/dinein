---
description: Fullstack refactor + repo/system repair workflow for monorepo Staff/Admin AI-first PWAs
---

# Fullstack Refactor & Repair Workflow

This workflow audits, checks, and repairs the full stack (Frontend, Backend, Database) to ensure system health.

## 1. Diagnostics & Audit
Run full system diagnostics to identify issues.

```bash
# Frontend Diagnostics
npm run typecheck
npm run lint

# Database/Backend Diagnostics
supabase db diff
```

## 2. Planning
Analyze the output of diagnostics.
- Identify type errors.
- Identify linting violations.
- Check for schema drift.
- Create an `implementation_plan.md` detailing the fixes.

## 3. Repair Execution
Execute fixes in phases.

### A. Database & Backend
- Apply missing migrations.
- Fix RLS policies if needed.
- Fix Edge Function types/logic.

### B. Frontend
- Fix global type errors.
- Fix component linting issues.
- Ensure strict boolean attributes (React 19 compliance).
- Standardize UI components (Soft Liquid Glass).

## 4. Verification
Validate the repairs.

```bash
npm run build
npm run test:e2e:smoke # if available, or manual verification
```

## 5. Documentation
- Update `walkthrough.md` with changes.
- Ensure rollback plan is clear.
