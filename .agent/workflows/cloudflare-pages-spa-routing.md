---
description: Prevent 404s on refresh / deep links for SPA routing on Cloudflare Pages
---

# Cloudflare Pages SPA Routing Fix

## Problem
Single Page Applications (SPAs) return 404 errors when users:
- Refresh the page on any route other than `/`
- Navigate directly to a deep link (e.g., `/dashboard`, `/orders/123`)

This happens because Cloudflare tries to serve a file matching the URL path, which doesn't exist.

## Solution

### 1. Create `public/_redirects` file

```
# =============================================================================
# Cloudflare Pages Redirects - SPA Routing
# =============================================================================

# API routes - pass through (for future Pages Functions)
/api/*  /api/:splat  200

# Static assets - explicit pass-through (no rewrite)
/assets/*  /assets/:splat  200
/icons/*   /icons/:splat   200

# SPA fallback - all other routes serve index.html
/*  /index.html  200
```

> [!IMPORTANT]
> The `/* /index.html 200` rule MUST be the LAST rule in the file.
> Cloudflare processes rules top-to-bottom; the first match wins.

### 2. Ensure Vite copies public files

In `vite.config.ts`:
```typescript
build: {
  copyPublicDir: true,  // This is the default, but be explicit
}
```

### 3. Verify build output

After running `npm run build`, check that `dist/_redirects` exists:

```bash
cat dist/_redirects
```

## Verification Checklist

// turbo
1. Run `npm run build` in the web app directory

// turbo
2. Verify `_redirects` is in dist:
   ```bash
   ls -la dist/_redirects && cat dist/_redirects
   ```

3. Check that `index.html` exists in dist:
   ```bash
   ls -la dist/index.html
   ```

4. Deploy to Cloudflare Pages

5. Test deep link navigation:
   - Navigate to `/dashboard` directly
   - Refresh the page
   - Should NOT see 404

## Cloudflare Dashboard Settings (Monorepo)

For monorepo projects, ensure these settings in Cloudflare Pages:

| Setting | Value |
|---------|-------|
| Root directory | `apps/web` |
| Build command | `npm run build` |
| Build output directory | `dist` |

## Troubleshooting

### Still getting 404s after deploy?

1. **Purge cache**: Cloudflare Dashboard → Caching → Configuration → Purge Everything
2. **Wait for propagation**: Edge nodes may take 1-2 minutes to update
3. **Check deployment logs**: Verify `_redirects` was included in the upload
4. **Verify output directory**: Ensure Cloudflare is serving from the correct `dist` folder

### _redirects not being processed?

- File must be at the ROOT of your build output (e.g., `dist/_redirects`)
- No syntax errors (use spaces, not tabs)
- Status code must be `200` for rewrites (not `301` or `302`)

## Related Workflows

- `/cloudflare-pages-headers-security` - Add security headers
- `/cloudflare-pages-cache-stale` - Fix stale assets after deploy
- `/cloudflare-pages-setup` - Initial Cloudflare Pages setup
