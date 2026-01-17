# DineIn Operations Runbook

> Standard operating procedures for deployment, monitoring, and incident response.

---

## Quick Reference

| Action | Command |
|--------|---------|
| Deploy frontend | `git push origin main` (auto-deploy) |
| Build locally | `npm run build` |
| Run E2E tests | `npm run test:e2e` |
| View logs | Supabase Dashboard → Logs |
| Rollback | Cloudflare Dashboard → Deployments → Rollback |

---

## 1. Deployment

### Frontend (Cloudflare Pages)

**Automatic deployment on push to `main`.**

#### Pre-Deploy Checklist

```bash
# 1. Run verification suite
cd apps/web
npm run typecheck
npm run lint
npm run test
npm run build

# 2. Run E2E tests
npm run test:e2e

# 3. Commit and push
git add .
git commit -m "Release: [description]"
git push origin main
```

#### Manual Deploy (if needed)

```bash
npx wrangler pages deploy dist
```

### Edge Functions (Supabase)

```bash
# Deploy all functions
cd /path/to/project
npx supabase functions deploy

# Deploy specific function
npx supabase functions deploy gemini-features
```

---

## 2. Rollback Procedures

### Frontend Rollback

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to Pages → dinein
3. Click "Deployments"
4. Find previous working deployment
5. Click "..." → "Rollback to this deployment"

**Rollback time: < 1 minute**

### Database Rollback

1. Go to Supabase Dashboard → Database → Migrations
2. Identify problematic migration
3. Apply rollback SQL:

```sql
-- Example: Revert a column addition
ALTER TABLE vendors DROP COLUMN IF EXISTS new_column;
```

4. Update migration tracking if needed

---

## 3. Monitoring & Alerting

### Error Tracking (Sentry)

- **Dashboard:** [sentry.io/organizations/dinein](https://sentry.io)
- **Alert rules:** Notify on new issues
- **Check frequency:** Daily review

### Performance (Web Vitals)

Tracked automatically via `webVitals.ts`:
- LCP > 2.5s → Sentry breadcrumb
- FCP > 1.8s → Sentry breadcrumb
- Budget exceeded > 50% → Sentry warning

### Uptime

- Cloudflare provides built-in uptime monitoring
- Set up alerts for 5xx errors spike

---

## 4. Common Issues & Fixes

### Issue: Build Fails

**Symptoms:** CI/CD pipeline red

**Resolution:**
1. Check build logs in Cloudflare
2. Common causes:
   - TypeScript errors: `npm run typecheck`
   - Missing dependencies: `npm install`
   - Environment variable missing

### Issue: Edge Function Timeout

**Symptoms:** 504 Gateway Timeout

**Resolution:**
1. Check Supabase logs for function
2. Verify database query performance
3. Add indexes if query is slow
4. Consider breaking up function logic

### Issue: RLS Blocking Access

**Symptoms:** Empty data when expected

**Resolution:**
1. Check user role assignment
2. Verify RLS policy conditions
3. Test with `SELECT * FROM table` in SQL Editor (as service role)
4. Review [RLS_VERIFICATION.md](RLS_VERIFICATION.md)

### Issue: Auth Not Working

**Symptoms:** Login fails, unauthorized errors

**Resolution:**
1. Check Supabase Auth settings
2. Verify OAuth provider configuration
3. Check browser console for auth errors
4. Clear cookies and retry

---

## 5. Incident Response

### Severity Levels

| Level | Example | Response Time |
|-------|---------|---------------|
| **P1** | Site down, payments broken | < 15 min |
| **P2** | Feature broken, workaround exists | < 1 hour |
| **P3** | Minor bug, cosmetic issue | < 24 hours |

### Response Template

```
## Incident Report

**Date:** YYYY-MM-DD HH:MM
**Severity:** P1/P2/P3
**Duration:** X minutes

### Summary
Brief description of what happened.

### Impact
Who was affected and how.

### Root Cause
Technical explanation.

### Resolution
Steps taken to fix.

### Prevention
What we'll do to prevent recurrence.
```

---

## 6. Scheduled Maintenance

### Weekly

- [ ] Review Sentry errors
- [ ] Check Lighthouse scores
- [ ] Review Core Web Vitals

### Monthly

- [ ] `npm audit` for security updates
- [ ] Review and rotate secrets if needed
- [ ] Test critical user flows manually

### Quarterly

- [ ] Full Lighthouse audit
- [ ] Database performance review
- [ ] User feedback analysis

---

## Contact

| Role | Contact |
|------|---------|
| On-call | [TBD] |
| Backend | Supabase Dashboard |
| Frontend | Cloudflare Dashboard |
