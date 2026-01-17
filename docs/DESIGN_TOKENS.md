# DineIn Design System - Design Tokens

This document describes the design tokens used in the DineIn "Soft Liquid Glass" design system.

## Quick Start

```tsx
// In your component
import '../design-tokens.css';

// Use CSS variables directly
<div style={{ padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)' }} />

// Or via Tailwind classes (mapped in tailwind.config.js)
<div className="p-4 rounded-lg bg-glass text-foreground" />
```

## Token Categories

### 1. Spacing Scale (4px Base)

| Token | Value | Use Case |
|-------|-------|----------|
| `--space-1` | 4px | Tight spacing (icon margins) |
| `--space-2` | 8px | Small gaps |
| `--space-4` | 16px | Standard padding |
| `--space-6` | 24px | Section spacing |
| `--space-8` | 32px | Large gaps |

### 2. Colors

#### Light Mode
| Token | Hex | Purpose |
|-------|-----|---------|
| `--bg-main` | #FFF7F2 | Page background |
| `--text-main` | #1A1A2E | Primary text |
| `--text-muted` | #464866 | Secondary text (WCAG 6.2:1) |
| `--primary-500` | #FF6B35 | Brand color |
| `--secondary-500` | #00B4D8 | Accent color |

#### Dark Mode
| Token | Hex | Purpose |
|-------|-----|---------|
| `--bg-main` | #0E1120 | Page background |
| `--text-main` | #F5F7FF | Primary text |
| `--text-muted` | #B8C4E0 | Secondary text (WCAG 8.5:1) |

### 3. Glass Effects

```css
/* Glass panel with blur */
.glass-panel {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--blur-xl));
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-glass);
}
```

### 4. Border Radius

| Token | Value | Use Case |
|-------|-------|----------|
| `--radius-md` | 8px | Buttons, inputs |
| `--radius-lg` | 12px | Cards |
| `--radius-xl` | 16px | Modals |
| `--radius-full` | 9999px | Circular elements |

### 5. Shadows

| Token | Use Case |
|-------|----------|
| `--shadow-sm` | Subtle elevation |
| `--shadow-md` | Cards, dropdowns |
| `--shadow-lg` | Modals |
| `--shadow-glass` | Glass panels |

### 6. Typography

```css
--font-display: 'Fraunces', Georgia, serif;  /* Headlines */
--font-body: 'Manrope', -apple-system, sans-serif;  /* Body text */
```

## Component Examples

### GlassCard
```tsx
<GlassCard className="p-4">
  <h3 className="text-foreground">Title</h3>
  <p className="text-muted">Description</p>
</GlassCard>
```

### Button (touch-friendly)
```tsx
<button className="min-w-[48px] min-h-[48px] bg-primary-500 text-white rounded-lg">
  Submit
</button>
```

## File Location

Tokens are defined in: `apps/web/design-tokens.css`

Tailwind mappings in: `apps/web/tailwind.config.js`
