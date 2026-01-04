# Cloudflare Pages Setup - Exact Configuration

## For Repository: ikanisa/dinein-malta

### Project Settings

**Project name**: `dinein` ✅  
**Deployment URL**: `dinein.pages.dev` ✅  
**Production branch**: `main` ✅

---

## Build Configuration

### Framework Preset
**Select**: `Vite`

*(If Vite is not available, select `None` and use manual settings below)*

---

### Root Directory (IMPORTANT - Set This First!)

**Root directory**: 
```
apps/web
```

**Why?** This is a monorepo. The app lives in `apps/web/`, not the root.

---

### Build Command

**If using Vite preset:**
```
npm install --legacy-peer-deps && npm run build
```

**If using None preset:**
```
npm install --legacy-peer-deps && npm run build
```

*(Since root directory is `apps/web`, no need for `cd`)*

*(The `cd apps/web` is only needed if root directory isn't set)*

---

### Build Output Directory

**Output directory**:
```
dist
```

*(Cloudflare will look for this relative to the root directory. Since root is `apps/web`, it will find `apps/web/dist`)*

---

### Node Version

**Node version**: `20` (or `20.x`)

---

## Environment Variables

Add these **exact** variables:

### Variable 1
- **Name**: `VITE_SUPABASE_URL`
- **Value**: `https://elhlcdiosomutugpneoc.supabase.co`

### Variable 2
- **Name**: `VITE_SUPABASE_ANON_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsaGxjZGlvc29tdXR1Z3BuZW9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5MDU3NTMsImV4cCI6MjA3NDQ4MTc1M30.d92ZJG5E_9r7bOlRLBXRI6gcB_7ERVbL-Elp7fk4avY`

**Apply to**: Both `Production` and `Preview` environments

---

## Complete Configuration Summary

```
Project name: dinein
Repository: ikanisa/dinein-malta
Production branch: main

Framework preset: Vite
Root directory: apps/web
Build command: npm ci --legacy-peer-deps && npm run build
Build output directory: dist
Node version: 20

Environment variables:
  VITE_SUPABASE_URL = https://elhlcdiosomutugpneoc.supabase.co
  VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsaGxjZGlvc29tdXR1Z3BuZW9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5MDU3NTMsImV4cCI6MjA3NDQ4MTc1M30.d92ZJG5E_9r7bOlRLBXRI6gcB_7ERVbL-Elp7fk4avY
```

---

## Step-by-Step in Cloudflare Dashboard

1. **Framework preset**: 
   - Dropdown → Select `Vite`
   - OR if not available → Select `None`

2. **Root directory** (Advanced section):
   - Click "Show advanced"
   - Enter: `apps/web`

3. **Build command**:
   - Enter: `npm install --legacy-peer-deps && npm run build`

4. **Build output directory**:
   - Enter: `dist`

5. **Environment variables**:
   - Click "Add variable"
   - Add `VITE_SUPABASE_URL` with value
   - Click "Add variable" again
   - Add `VITE_SUPABASE_ANON_KEY` with value
   - Make sure both are enabled for Production

6. **Save and Deploy**

---

## Why These Settings?

### Root Directory: `apps/web`
- Your app is in a monorepo
- `package.json` is at `apps/web/package.json`
- `node_modules` will be in `apps/web/node_modules`
- Build output will be `apps/web/dist`

### Build Command: `npm ci --legacy-peer-deps && npm run build`
- `npm ci` = Clean install (faster, more reliable)
- `--legacy-peer-deps` = Needed for dependency compatibility
- `npm run build` = Runs Vite build script

### Output: `dist`
- Vite outputs to `dist/` by default
- Since root is `apps/web`, Cloudflare looks for `apps/web/dist`
- But you specify `dist` (relative to root)

---

## After Deployment

Your site will be live at: **https://dinein.pages.dev**

### Verify Deployment

1. ✅ Site loads
2. ✅ Check browser console for errors
3. ✅ Test routes: `/`, `/explore`, `/v/:slug`
4. ✅ Verify service worker registers
5. ✅ Check Network tab - API calls should work

---

## Troubleshooting

### Build Error: "Cannot find package.json"
- **Fix**: Make sure root directory is `apps/web`

### Build Error: "Command failed"
- **Fix**: Check Node version is 20
- **Fix**: Try build command: `npm install && npm run build`

### Routes Return 404
- **Fix**: Verify `_redirects` file exists in `apps/web/public/`
- **Fix**: Check it's copied to `dist/` after build

### Environment Variables Not Working
- **Fix**: Variables must start with `VITE_`
- **Fix**: Rebuild after adding variables
- **Fix**: Check variables are set for Production environment

---

**Ready to deploy!** 🚀

