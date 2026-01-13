# Deployment Guide

This document describes how to deploy the DineIn PWA to Firebase Hosting.

## Prerequisites

- Node.js 18+
- Firebase CLI (`npm install -g firebase-tools`)
- Access to the Firebase project

## Environment Variables

Create a `.env` file in `apps/web/` with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Build & Deploy

### Local Development

```bash
cd apps/web
npm install
npm run dev
```

### Production Build

```bash
cd apps/web
npm run build
```

### Deploy to Firebase

```bash
# Login to Firebase
firebase login

# Deploy to hosting
firebase deploy --only hosting
```

## Supabase Backend

The backend uses Supabase with:
- PostgreSQL database
- Row-Level Security (RLS) policies
- Edge Functions

### Database Migrations

Migrations are located in `supabase/migrations/`. Apply them using:

```bash
supabase db push
```

### Edge Functions

Deploy edge functions with:

```bash
supabase functions deploy
```

## Verification

After deployment, verify:

1. **PWA loads correctly** at the Firebase hosting URL
2. **Venues load** from Supabase
3. **Service worker** registers for offline support
4. **Icons and manifest** are properly served
