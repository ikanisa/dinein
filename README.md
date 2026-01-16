# DineIn Malta - Monorepo

> **Status**: Active Development 🚧  
> **Type**: AI-First Mobile PWA 📱  
> **Design System**: Soft Liquid Glass ✨

**DineIn** is a next-generation restaurant ordering and reservation platform built for Malta. It leverages an AI-first approach to deliver a "native-app-like" Progressive Web App (PWA) experience with a premium "Soft Liquid Glass" aesthetic.

---

## 🚀 Mission

To revolutionize the dining experience in Malta by providing a seamless, beautiful, and intelligent platform for:
- **Diners**: Easy QR ordering, reservations, and payments.
- **Staff**: Efficient order management and table service.
- **Admins**: Comprehensive platform oversight.

---

## 🛠 Tech Stack

This project uses a modern, high-performance stack designed for scalability and user experience.

- **Frontend**: [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/) (Monorepo support)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + Custom "Soft Liquid Glass" Design Tokens
- **State Management**: [React Query](https://tanstack.com/query/latest) (Server State)
- **Backend**: [Supabase](https://supabase.com/) (PostgreSQL, Auth, RLS, Realtime)
- **Edge Logic**: [Supabase Edge Functions](https://supabase.com/docs/guides/functions) (Deno)
- **Deployment**: [Cloudflare Pages](https://pages.cloudflare.com/)

---

## 📂 Architecture

The project follows a standard monorepo structure:

```
/
├── apps/
│   └── web/            # Main PWA application (Client, Staff, Admin views)
├── supabase/
│   ├── functions/      # Edge functions (TypeScript/Deno)
│   └── migrations/     # Database schema changes
├── packages/           # Shared libraries (future use)
└── docs/               # Project documentation
```

### Key Documentation
- **[API Integration Guide](docs/API_INTEGRATION.md)**: Details on data fetching, hooks, and error handling.
- **[Database Schema](docs/DATABASE_SCHEMA.md)**: Comprehensive guide to tables, RLS policies, and enums.

---

## ✨ Key Features

### 1. Role-Based Access Control (RBAC)
Strict separation of concerns enforced via Database RLS and Application logic.
- **Admin**: Full system access, vendor management, global settings.
- **Staff**: Order management, menu updates, reservation handling for their specific vendor.
- **Client**: Public access for ordering and reservations.

### 2. "Soft Liquid Glass" UI/UX
A custom design system featuring:
- **Glassmorphism**: Translucent layers and blurs.
- **Fluid Motion**: Smooth transitions and micro-interactions.
- **Mobile-First**: Touch-optimized targets and gestures.

### 3. AI-First Capabilities
- **Smart Parsing**: Intelligent text processing for inputs.
- **Assistive Features**: Planned AI integrations for menu recommendations and staff assistance.

---

## 🚦 Getting Started

### Prerequisites
- Node.js (v18+)
- npm (v9+)
- Supabase CLI (if working on backend/migrations)

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install
```

### Local Development

Run the web application locally:

```bash
# Starts the dev server for apps/web
npm run dev
```

The app will be available at `http://localhost:5173`.

### Backend Development

If you are working on database changes or edge functions:

```bash
# Start local Supabase instance
npx supabase start

# Serve edge functions locally
npx supabase functions serve
```

---

## 📦 Building for Production

To build the PWA for deployment:

```bash
npm run build
```

This acts as a standard command for `npm run build -w apps/web`.

---

## 🧪 Testing & Verification

- **Linting**: `npm run lint`
- **Type Checking**: `npm run typecheck -w apps/web`

---

## 🔒 Security & Standards

- **RLS Everywhere**: No database access without explicit RLS policies.
- **Type Safety**: Full TypeScript coverage.
- **Secrets**: Never commit `.env` files. Use Supabase secrets for backend config.

---

## 📝 License

Proprietary Software. All rights reserved.
