---
description: Add PWA + security headers + caching sanity (without stale JS after deploy).
---

# Cloudflare Pages Headers Security Workflow

This workflow ensures production-grade security headers, PWA compliance, and proper caching for Cloudflare Pages deployments.

## When to Use

- Before go-live / production deployment
- After modifying `_headers` or `_redirects`
- When security audit flags missing headers
- When investigating stale asset issues after deploy

## Prerequisites

- Cloudflare Pages project configured
- `apps/web/public/_headers` file exists
- Build copies `public/` to `dist/`

---

## Workflow Steps

### 1. Audit Current Headers

```bash
# Check if _headers exists and review contents
cat apps/web/public/_headers
```

**Expected security headers (minimum):**
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` (disable unused APIs)
- `Content-Security-Policy` (restrict sources)
- `Strict-Transport-Security` (HSTS with preload)

**Production-grade additions:**
- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Resource-Policy: same-origin`

### 2. Verify Caching Strategy

| Path | Recommended Cache | Why |
|------|------------------|-----|
| `/*.html`, `/index.html`, `/` | `no-cache, no-store, must-revalidate` | Fresh after deploys |
| `/assets/*` | `public, max-age=31536000, immutable` | Vite hashed assets |
| `/sw.js`, `/workbox-*.js` | `no-cache, no-store, must-revalidate` | Critical for PWA updates |
| `/manifest.json` | `no-cache` | Allows PWA updates |
| `/icons/*`, `/favicon.ico` | `public, max-age=86400` | 24h cache, rarely changes |
| `/fonts/*` | `public, max-age=31536000, immutable` | Long cache, content-stable |
| `/offline.html` | `no-cache, no-store, must-revalidate` | Must be fresh fallback |

### 3. Build and Verify

// turbo
```bash
cd apps/web && npm run build && ls -la dist/_headers
```

**Expected:** `_headers` file is copied to `dist/`

### 4. Test Headers Locally

```bash
cd apps/web && npm run preview
```

Then in another terminal:
```bash
curl -I http://localhost:4173/
```

**Check for:**
- All security headers present
- `Cache-Control` on root is `no-cache`

### 5. Deploy to Preview

```bash
cd apps/web && wrangler pages deploy dist --project-name=dinein-malta --branch=preview-headers
```

### 6. Validate with Security Scanner

After deployment, scan with:
- https://securityheaders.com
- https://observatory.mozilla.org

**Target grade: A+**

### 7. Verify No Stale Assets

1. Deploy new version
2. Hard refresh (`Cmd+Shift+R`)
3. Check Network tab: new JS bundle hash should load
4. No 404s or old cached JS serving

---

## Rollback

If headers cause issues (CSP blocking, COOP breaking OAuth):

1. **Cloudflare Dashboard:** Pages → Deployments → Rollback to previous
2. **Or revert _headers:** `git checkout HEAD~1 -- apps/web/public/_headers && npm run build`

---

## Reference: Complete _headers Template

```
# Global Security Headers
/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(self), payment=(), usb=()
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://*.supabase.co; frame-ancestors 'none';
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  Cross-Origin-Opener-Policy: same-origin
  Cross-Origin-Resource-Policy: same-origin

# HTML - No cache
/*.html
  Cache-Control: no-cache, no-store, must-revalidate

/
  Cache-Control: no-cache, no-store, must-revalidate

# Hashed assets - Immutable
/assets/*
  Cache-Control: public, max-age=31536000, immutable

# Service Worker - Never cache
/sw.js
  Cache-Control: no-cache, no-store, must-revalidate

# Manifest
/manifest.json
  Cache-Control: no-cache
```

---

## Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| CSP blocking scripts | Missing source in CSP | Add domain to `script-src` |
| OAuth popup broken | COOP: same-origin | Use `same-origin-allow-popups` |
| Fonts not loading | CORP blocking cross-origin | Add `cross-origin` to CSP `font-src` |
| Old JS after deploy | HTML cached | Verify HTML has `no-cache` |
