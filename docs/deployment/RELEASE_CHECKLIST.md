# DineIn Malta PWA - Release Checklist

**Version**: 1.0.0  
**Last Updated**: 2026-01-17

---

## Pre-Release Verification

### 1. Code Quality Gates
- [ ] `npm run typecheck` passes
- [ ] `npm run lint` passes (no errors)
- [ ] `npm run test` passes (unit tests)
- [ ] `npm run build` completes successfully

### 2. E2E Test Suite
```bash
cd apps/web && npx playwright test --project=chromium
```
- [ ] smoke.spec.ts (4 tests)
- [ ] client-journey.spec.ts (10 tests)
- [ ] vendor-journey.spec.ts (11 tests)
- [ ] admin-journey.spec.ts (10 tests)
- [ ] rbac-security.spec.ts (7 tests)

**Required**: 42/42 tests pass

### 3. Build Artifacts Verification
```bash
cd apps/web && npm run build
```
- [ ] `dist/_headers` exists
- [ ] `dist/_redirects` exists
- [ ] `dist/index.html` exists
- [ ] `dist/sw.js` exists
- [ ] `dist/manifest.webmanifest` exists
- [ ] Bundle size < 10MB total

### 4. Security Headers Check
Verify all headers in `dist/_headers`:
- [ ] X-Content-Type-Options: nosniff
- [ ] X-Frame-Options: DENY
- [ ] X-XSS-Protection: 1; mode=block
- [ ] Referrer-Policy: strict-origin-when-cross-origin
- [ ] Content-Security-Policy: (configured)
- [ ] Strict-Transport-Security: max-age=31536000
- [ ] Cross-Origin-Opener-Policy: same-origin
- [ ] Cross-Origin-Resource-Policy: same-origin

---

## Supabase Backend Verification

### 5. Database Health
- [ ] All migrations applied
- [ ] RLS enabled on all public tables
- [ ] No pending migrations in `supabase/migrations/`

### 6. Edge Functions
- [ ] `order_create` - ACTIVE
- [ ] `vendor_claim` - ACTIVE
- [ ] `tables_generate` - ACTIVE
- [ ] `order_update_status` - ACTIVE
- [ ] `order_mark_paid` - ACTIVE
- [ ] `gemini-features` - ACTIVE
- [ ] `places-nearby` - ACTIVE

### 7. Auth Configuration
- [ ] Anonymous auth enabled (for clients)
- [ ] Email/password auth enabled (for vendors)
- [ ] Google OAuth configured (for admins)
- [ ] Leaked password protection enabled ⚠️

---

## Deployment Steps

### 8. Deploy to Cloudflare Pages

**Option A: Manual Deploy**
```bash
cd apps/web
npm run build
wrangler pages deploy dist --project-name=dinein-malta
```

**Option B: Git Push (CI/CD)**
```bash
git add .
git commit -m "Release: v1.0.0 - Production deployment"
git push origin main
```

### 9. Post-Deployment Verification

- [ ] Production URL loads (no white screen)
- [ ] Homepage displays correctly
- [ ] No critical console errors
- [ ] PWA install prompt appears (mobile)
- [ ] Service worker registered

### 10. Core Flow Verification

**Client Flow:**
- [ ] Can browse vendors
- [ ] Can view menu
- [ ] Can add items to cart
- [ ] Can proceed to checkout

**Vendor/Manager Flow:**
- [ ] Login page accessible at `/manager/login`
- [ ] Protected routes redirect to login
- [ ] (With auth) Dashboard loads

**Admin Flow:**
- [ ] Login page accessible at `/admin/login`
- [ ] Google OAuth works
- [ ] Protected routes redirect to login

---

## Rollback Procedure

### If Issues Detected:

1. **Navigate to Cloudflare Dashboard**
   - Pages → `dinein-malta` → Deployments

2. **Find Last Working Deployment**
   - Look for green checkmark (✓)
   - Note the commit hash

3. **Execute Rollback**
   - Click ⋮ → "Rollback to this deployment"
   - Wait 30 seconds

4. **Verify Rollback**
   - Hard refresh (`Cmd+Shift+R`)
   - Check app functionality

5. **Notify Team**
   - Document the issue
   - Create incident report

---

## Environment Variables

### Required in Cloudflare Pages:
| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key |

### NOT Required in Cloudflare (server-side only):
- `GEMINI_API_KEY` (only in Supabase Edge Functions)

---

## Monitoring

### Post-Release Monitoring (First 24 Hours):

- [ ] Check Cloudflare Analytics for errors
- [ ] Monitor Supabase logs for failed requests
- [ ] Check for console errors in production
- [ ] Verify Core Web Vitals (LCP < 2.5s)

### Alerts to Watch:
- 5xx errors in Cloudflare
- Auth failures spike
- Edge function timeouts
- Database connection issues

---

## Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Developer | | | |
| QA | | | |
| Product Owner | | | |

---

**GO/NO-GO Decision**: ______________

**Notes:**
