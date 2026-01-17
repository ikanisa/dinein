# DineIn Architecture Overview

> System architecture and component diagrams for the DineIn Malta PWA.

---

## System Architecture

```mermaid
graph TD
    subgraph "Frontend (Cloudflare Pages)"
        PWA[React PWA]
        SW[Service Worker]
        PWA --> SW
    end

    subgraph "Backend (Supabase)"
        Auth[GoTrue Auth]
        DB[(PostgreSQL)]
        Realtime[Realtime Engine]
        Edge[Edge Functions]
        Storage[Object Storage]
    end

    subgraph "External Services"
        Gemini[Google Gemini AI]
        GA4[Google Analytics]
        Sentry[Sentry Error Tracking]
    end

    PWA -->|Auth| Auth
    PWA -->|REST API| DB
    PWA -->|WebSocket| Realtime
    PWA -->|Functions| Edge
    Edge --> Gemini
    Edge --> DB
    Edge --> Storage
    PWA --> GA4
    PWA --> Sentry
```

---

## Data Flow

### Order Lifecycle

```mermaid
sequenceDiagram
    participant C as Client
    participant E as Edge Function
    participant DB as Database
    participant R as Realtime
    participant V as Vendor

    C->>E: POST order_create
    E->>DB: INSERT order
    E->>DB: INSERT order_items
    E-->>C: 201 { order }
    
    DB->>R: Broadcast change
    R->>V: New order event
    
    V->>E: POST order_update_status
    E->>DB: UPDATE order
    E-->>V: 200 { order }
    
    DB->>R: Broadcast change
    R->>C: Status update
```

---

## Component Structure

```
apps/web/
├── App.tsx                 # Root component, routing
├── pages/                  # Route components
│   ├── ClientMenu.tsx      # Customer menu view
│   ├── ClientOrderStatus.tsx
│   ├── VendorLogin.tsx
│   ├── vendor/             # Vendor dashboard
│   ├── Admin*.tsx          # Admin portal
│   └── SettingsPage.tsx
├── components/
│   ├── common/             # Shared components
│   ├── menu/               # Menu components
│   ├── ui/                 # Design system
│   └── shared/             # Layout components
├── hooks/                  # React hooks
├── services/               # API & external services
├── context/                # React context providers
└── utils/                  # Utility functions
```

---

## Security Model

### Authentication Layers

| Layer | Implementation | Purpose |
|-------|---------------|---------|
| Frontend | Route guards | UI access control |
| API | Bearer token | Request authentication |
| Database | RLS policies | Row-level security |
| Edge Functions | Auth middleware | Function authorization |

### Role-Based Access

```mermaid
graph LR
    subgraph Roles
        Client[Anonymous Client]
        Vendor[Vendor Staff]
        Admin[Administrator]
    end

    subgraph Access
        Menu[Browse Menu]
        Order[Place Order]
        Dashboard[Vendor Dashboard]
        Management[Admin Management]
    end

    Client --> Menu
    Client --> Order
    Vendor --> Dashboard
    Vendor --> Menu
    Vendor --> Order
    Admin --> Management
    Admin --> Dashboard
    Admin --> Menu
```

---

## Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 18 + TypeScript | UI framework |
| **Styling** | Tailwind CSS + Custom Tokens | Design system |
| **Build** | Vite | Development & bundling |
| **State** | React Context + TanStack Query | State management |
| **Backend** | Supabase (Postgres + GoTrue) | BaaS |
| **AI** | Google Gemini | Search & image generation |
| **Hosting** | Cloudflare Pages | CDN + edge hosting |
| **Monitoring** | Sentry + GA4 | Error tracking + analytics |

---

## Database Schema

See [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) for full table definitions.

Key tables:
- `vendors` - Restaurant/bar profiles
- `menu_items` - Menu entries
- `orders` - Customer orders
- `order_items` - Order line items
- `vendor_users` - Staff accounts
- `admin_users` - Admin accounts
