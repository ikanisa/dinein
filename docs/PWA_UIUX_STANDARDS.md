# DineIn PWA Standards Reference

> Complete PWA & UI/UX specification for the DineIn Malta mobile-first Progressive Web App.

---

## 1. North Star Behaviors

| Behavior | Inspiration | Implementation |
|----------|-------------|----------------|
| **Offline-First** | Starbucks | Menu caching, offline cart, queued orders via IndexedDB |
| **Fast on Slow Networks** | Uber | Route-level code splitting, critical CSS inlined, aggressive caching |
| **Native-Like Feel** | iOS/Android apps | Haptic feedback, smooth animations, safe area handling |

---

## 2. Performance Budgets

### Core Web Vitals Targets

| Metric | Target | Status |
|--------|--------|--------|
| **LCP** | < 2.5s | ⚠️ 3.6s (improving) |
| **CLS** | < 0.1 | ✅ 0 |
| **INP** | < 200ms | ✅ Good |
| **FCP** | < 1.8s | ⚠️ 3.2s (improving) |
| **TBT** | < 200ms | ⚠️ Deferred services |

### Bundle Budgets

| Asset | Budget | Current | Status |
|-------|--------|---------|--------|
| Initial JS (gzipped) | ≤ 200KB | ~80KB | ✅ |
| Initial CSS (gzipped) | ≤ 50KB | ~13KB | ✅ |
| Total requests (first load) | ≤ 50 | 14 | ✅ |

---

## 3. PWA Configuration

### Manifest (vite.config.ts → VitePWA)

```json
{
  "name": "DineIn Malta",
  "short_name": "DineIn",
  "display": "standalone",
  "orientation": "portrait",
  "theme_color": "#0E1120",
  "background_color": "#0E1120",
  "start_url": "/"
}
```

### Icons Required

| Size | Purpose | File |
|------|---------|------|
| 192×192 | Any | `/icons/icon-192.png` ✅ |
| 192×192 | Maskable | `/icons/icon-192-maskable.png` ✅ |
| 512×512 | Any | `/icons/icon-512.png` ✅ |
| 512×512 | Maskable | `/icons/icon-512-maskable.png` ✅ |
| 180×180 | Apple Touch | `/apple-touch-icon.png` ✅ |

### Service Worker Strategy (Workbox)

| Resource | Strategy | TTL |
|----------|----------|-----|
| Menu data | CacheFirst | 1 hour |
| Order data | NetworkFirst | 5 min |
| Static assets | CacheFirst | 1 year |
| JS/CSS bundles | StaleWhileRevalidate | 7 days |
| Supabase API | NetworkFirst | 1 hour |

### Offline UX Policy

1. **Menu browsing**: Available offline (cached)
2. **Cart management**: Available offline (local state)
3. **Order submission**: Queued offline, synced when online
4. **Fallback page**: `/offline.html` with retry button

### Update Safety

- `registerType: 'autoUpdate'` with skipWaiting
- `UpdatePrompt` component for user notification
- 1-hour dismiss timeout before re-prompting

---

## 4. Accessibility (WCAG 2.2 AA)

### Current Score: 95%

### Touch Targets

- Minimum: 44×44px (all interactive elements)
- Spacing: 8px between targets
- Implementation: `min-h-touch` utility class

### Typography

- Base font: 16px (prevents iOS zoom)
- Line height: 1.5 (readable)
- Font family: Manrope (body), Fraunces (headings)

### Keyboard Navigation

- Skip link: `AccessibleSkipLink.tsx` ✅
- Focus visible: All interactive elements ✅
- Tab order: Logical flow ✅

### Screen Reader Support

- ARIA labels on all buttons/icons ✅
- Live regions for cart updates ✅
- Proper heading hierarchy ✅

### Color Contrast

- Text on surfaces: 4.5:1 minimum
- Glass panels: High-contrast text colors
- Status colors: Distinct and readable

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  :root {
    --duration-fast: 0.01ms;
    --duration-normal: 0.01ms;
    --duration-slow: 0.01ms;
  }
}
```

---

## 5. Design System

### Tokens Location

`/apps/web/design-tokens.css` (370 lines)

### Color Modes

- Light mode: Default
- Dark mode: `[data-theme="dark"]`
- System preference detection via ThemeContext

### Glass Morphism ("Soft Liquid Glass")

```css
.glass-panel {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--blur-xl));
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-glass);
}
```

### Component Library

| Component | Location | Features |
|-----------|----------|----------|
| Button | `common/Button.tsx` | 6 variants, haptic, loading |
| GlassCard | `GlassCard.tsx` | 3 variants, glow, accent |
| Input | `ui/Input.tsx` | Filled/outline, validation |
| Modal | `ui/Modal.tsx` | Accessible, animated |
| BottomSheet | `ui/BottomSheet.tsx` | Swipe-to-close |
| Toast | `ui/Toast.tsx` | react-hot-toast |
| PageHeader | `common/PageHeader.tsx` | Fixed, glass, nav options |
| VirtualMenuList | `menu/VirtualMenuList.tsx` | Windowed rendering |

---

## 6. Frontend Architecture

### Code Splitting

- Route-level: All pages lazy-loaded
- Vendor chunks: react, router, supabase, framer-motion
- Monitoring: Deferred after page load

### Data Fetching

- TanStack Query with retry (3×)
- Stale time: 5 minutes
- GC time: 10 minutes

### State Management

- React Context: Auth, Cart, Theme
- Local Storage: Preferences, cached data
- IndexedDB: Offline order queue

### Error Handling

- ErrorBoundary at app level
- Suspense fallbacks per route
- Toast notifications for user feedback

---

## 7. Testing Requirements

### E2E Smoke Tests (Playwright)

- [ ] Client journey: Browse → Order → Checkout
- [ ] Vendor journey: Login → Dashboard → Order management
- [ ] Admin journey: Login → Vendor management
- [ ] RBAC: Route protection verification

### Lighthouse CI Targets

| Category | Target |
|----------|--------|
| Performance | ≥ 80 |
| Accessibility | ≥ 95 |
| Best Practices | ≥ 95 |
| SEO | ≥ 90 |

### Unit Tests

- Component: Vitest + Testing Library
- Services: Vitest mocks

---

## 8. Mobile-First Breakpoints

| Breakpoint | Width | Usage |
|------------|-------|-------|
| xs | 0-359px | Small phones (rare) |
| sm (default) | 360-639px | Most phones |
| md | 640-767px | Large phones |
| lg | 768-1023px | Tablets |
| xl | 1024-1439px | Small desktop |
| 2xl | 1440px+ | Large desktop |

**Note**: 360×800 is the baseline design target (most common mobile).

---

## 9. Safe Area Handling

```css
:root {
  --safe-top: env(safe-area-inset-top);
  --safe-bottom: env(safe-area-inset-bottom);
  --safe-left: env(safe-area-inset-left);
  --safe-right: env(safe-area-inset-right);
}
```

Used for:
- Fixed headers: `pt-safe-top`
- Bottom bars/sheets: `pb-safe-bottom`
- Full-width content: `px-safe-left px-safe-right`

---

## 10. Monitoring & Analytics

### Error Tracking

- Sentry integration (production only)
- Deferred initialization (non-blocking)
- Offline error filtering

### Web Vitals

- Automatic CWV reporting
- Sent to analytics + Sentry
- Poor ratings logged as breadcrumbs

### Analytics

- Google Analytics 4
- Event tracking: orders, venue views, searches
- Page view tracking

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-17 | Claude | Initial specification |
