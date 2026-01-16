---
description: Mobile-first "native app-like" PWA checklist + implementation tasks (Discovery/DineIn style)
---

# PWA MOBILE-FIRST WORKFLOW

## Goal
Audit and upgrade a mobile-first PWA to deliver a native-like experience with world-class touch interactions, performance, and offline resilience.

## Target Audience
Consumer-facing mobile apps (DineIn, Discovery) where the primary experience is mobile with touch-first navigation.

---

## PHASE 1: AUDIT CHECKLIST

### 1A) PWA Core Requirements
- [ ] **HTTPS** — Mandatory for service workers
- [ ] **manifest.json** — Complete with icons, theme_color, display: standalone, orientation
- [ ] **Service Worker** — Registered with sensible caching strategy
- [ ] **Offline Fallback** — User sees controlled fallback page, not browser error
- [ ] **Install Prompt** — Custom install UX for iOS (Add to Home Screen guidance) and Android/Desktop
- [ ] **Update Prompt** — Notify user when new version available (skipWaiting + clientsClaim)

### 1B) Mobile-First Touch Ergonomics
- [ ] **Touch Targets ≥ 44px** — All interactive elements (buttons, links, checkboxes)
- [ ] **Bottom Navigation** — Primary actions in thumb zone for one-handed use
- [ ] **Safe Area Insets** — Content respects notch/home indicator (`env(safe-area-inset-*)`)
- [ ] **Pull to Refresh** — Native-like gesture for list/feed pages
- [ ] **Swipe Gestures** — Sheets/modals support swipe-to-dismiss
- [ ] **No Accidental Horizontal Scroll** — Mostly vertical scrolling model
- [ ] **Tap Feedback** — Visual feedback on touch (ripple, scale, haptics where supported)

### 1C) Performance (Native-Like Speed)
- [ ] **First Contentful Paint < 1.5s** — Critical for perceived speed
- [ ] **Skeleton Loaders** — Show content placeholders, not spinners
- [ ] **Route Code Splitting** — Only load what's needed
- [ ] **Image Optimization** — WebP/AVIF, lazy loading, proper sizing
- [ ] **Font Loading** — Preload, swap strategy, subset if large
- [ ] **Bundle Analysis** — No bloated dependencies (target < 500KB gzipped)
- [ ] **Virtualized Lists** — For feeds > 50 items (react-window, react-virtual)

### 1D) Content States (No Blank Screens)
- [ ] **Loading State** — Skeleton for every data-fetching route
- [ ] **Empty State** — Clear message + CTA when no data
- [ ] **Error State** — Actionable error with retry option
- [ ] **Offline State** — Explain what works offline, what doesn't

### 1E) Accessibility (WCAG AA)
- [ ] **Color Contrast** — Text ≥ 4.5:1, large text ≥ 3:1
- [ ] **Keyboard Navigation** — Tab order, focus visible, no traps
- [ ] **Screen Reader** — Semantic HTML, aria-labels, announcements
- [ ] **Reduced Motion** — Respects `prefers-reduced-motion`
- [ ] **No Hover-Only Actions** — Everything accessible via touch/keyboard

### 1F) Native-Feel Enhancements
- [ ] **Status Bar Color** — `theme-color` meta adapts to light/dark mode
- [ ] **Standalone Mode** — Falls back cleanly if not installed
- [ ] **Deep Links** — SPA routing handles refresh/deep links
- [ ] **Orientation Lock** — Portrait primary for consumer apps
- [ ] **Viewport Fit** — `viewport-fit=cover` for edge-to-edge content

---

## PHASE 2: IMPLEMENTATION PRIORITIES

### P0 — Must-Fix Before Production
1. Missing touch targets < 44px
2. No offline fallback or blank screen on network fail
3. No loading/error states on key pages
4. Broken SPA routing on refresh

### P1 — Should-Fix
1. Missing skeleton loaders
2. No pull-to-refresh on feeds
3. Font blocking first paint
4. Large bundle size

### P2 — Improvements
1. Add haptic feedback where supported
2. Add swipe-to-dismiss on modals
3. Background sync for pending actions
4. IndexedDB for offline persistence

---

## PHASE 3: VERIFICATION

### Automated Tests
- Run `npm run typecheck` for type errors
- Run `npm run build` for build success
- Run Lighthouse audit (target 90+ PWA score)
- Run `npx axe-core` on key pages for accessibility

### Manual Verification (Mobile Device)
1. Open app in Chrome/Safari mobile
2. Test "Add to Home Screen" flow
3. Enable airplane mode, verify offline fallback appears
4. Verify all buttons/links are ≥ 44px
5. Test pull-to-refresh on list pages
6. Test bottom nav thumb reachability
7. Verify loading/empty/error states on each page

### Device Testing Matrix
- iOS Safari (iPhone 14 / SE)
- Android Chrome (Pixel 7 / budget device)
- Desktop Chrome (1920x1080)
- Tablet (iPad / Android tablet)

---

## OUTPUT ARTIFACTS

1. **Audit Report** — Scorecard + findings list
2. **Implementation Plan** — Prioritized fixes (P0/P1/P2)
3. **Task List** — Checkboxes for execution
4. **Walkthrough** — What was fixed + verification evidence

---

## COMMON PATTERNS

### Install Prompt (iOS + Android)
```tsx
// Standard install prompt with iOS fallback guidance
const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  
  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);
  
  if (isIOS) {
    return <IOSInstallGuide />;
  }
  
  return deferredPrompt ? <InstallButton onClick={() => deferredPrompt.prompt()} /> : null;
};
```

### Safe Area Padding
```css
.bottom-nav {
  padding-bottom: calc(16px + env(safe-area-inset-bottom));
}
```

### Skeleton Loader
```tsx
const MenuSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-8 w-48 bg-surface-highlight rounded mb-4" />
    <div className="h-24 w-full bg-surface-highlight rounded" />
  </div>
);
```

### Touch Feedback
```tsx
const Touchable = ({ children, onPress }) => (
  <motion.button
    whileTap={{ scale: 0.96, opacity: 0.8 }}
    onClick={onPress}
    className="min-w-[44px] min-h-[44px]"
  >
    {children}
  </motion.button>
);
```
