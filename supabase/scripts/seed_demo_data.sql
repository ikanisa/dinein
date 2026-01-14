-- ==========================================
-- IDEMPOTENT DEMO DATA SEED SCRIPT
-- ==========================================
-- This script creates demo data for QA and demos.
-- It is fully idempotent (safe to run multiple times).
-- 
-- USAGE:
--   psql "$DATABASE_URL" -f supabase/scripts/seed_demo_data.sql
--
-- REQUIREMENTS:
--   - All migrations must be applied first
--   - Auth users must be created separately via Supabase Auth
--     (this script references auth.uid values that should exist)

-- ============================================================================
-- 1. DEMO ADMIN USER
-- ============================================================================
-- Note: You must first create this user in Supabase Auth, then insert here
-- Using a deterministic UUID for demo purposes

DO $$
DECLARE
  demo_admin_auth_id uuid := '00000000-0000-0000-0000-000000000001'::uuid;
BEGIN
  -- Insert admin user if not exists
  INSERT INTO public.admin_users (id, auth_user_id, role, is_active)
  VALUES (
    gen_random_uuid(),
    demo_admin_auth_id,
    'admin',
    true
  )
  ON CONFLICT (auth_user_id) DO NOTHING;
  
  -- Insert admin profile if not exists
  INSERT INTO public.profiles (id, name, role, notifications_enabled)
  VALUES (
    demo_admin_auth_id,
    'Demo Admin',
    'ADMIN',
    true
  )
  ON CONFLICT (id) DO NOTHING;
END $$;

-- ============================================================================
-- 2. DEMO VENDORS
-- ============================================================================

-- Zion Reggae Bar (Demo Vendor 1)
INSERT INTO public.vendors (
  id, country, google_place_id, slug, name, address, 
  lat, lng, status, phone, whatsapp
)
VALUES (
  '11111111-1111-1111-1111-111111111111'::uuid,
  'MT',
  'ChIJDemo_Zion_Bar_Malta',
  'zion-reggae-bar',
  'Zion Reggae Bar',
  'Triq San Pawl, St. Paul''s Bay, Malta',
  35.9500,
  14.4000,
  'active',
  '+35699123456',
  '+35699123456'
)
ON CONFLICT (google_place_id) DO UPDATE SET
  name = EXCLUDED.name,
  status = EXCLUDED.status;

-- Victoria Gastro Pub (Demo Vendor 2)
INSERT INTO public.vendors (
  id, country, google_place_id, slug, name, address,
  lat, lng, status, phone, whatsapp
)
VALUES (
  '22222222-2222-2222-2222-222222222222'::uuid,
  'MT',
  'ChIJDemo_Victoria_Pub_Malta',
  'victoria-gastro-pub',
  'Victoria Gastro Pub',
  'Triq il-Kbira, Victoria, Gozo, Malta',
  36.0444,
  14.2392,
  'active',
  '+35621556677',
  '+35679556677'
)
ON CONFLICT (google_place_id) DO UPDATE SET
  name = EXCLUDED.name,
  status = EXCLUDED.status;

-- ============================================================================
-- 3. DEMO VENDOR USERS (owner, manager, staff)
-- ============================================================================

DO $$
DECLARE
  zion_vendor_id uuid := '11111111-1111-1111-1111-111111111111'::uuid;
  victoria_vendor_id uuid := '22222222-2222-2222-2222-222222222222'::uuid;
  
  -- Demo auth user IDs (create these in Supabase Auth first)
  owner_auth_id uuid := '00000000-0000-0000-0000-000000000010'::uuid;
  manager_auth_id uuid := '00000000-0000-0000-0000-000000000011'::uuid;
  staff_auth_id uuid := '00000000-0000-0000-0000-000000000012'::uuid;
BEGIN
  -- Zion: Owner
  INSERT INTO public.vendor_users (vendor_id, auth_user_id, role, is_active)
  VALUES (zion_vendor_id, owner_auth_id, 'owner', true)
  ON CONFLICT (vendor_id, auth_user_id) DO UPDATE SET role = 'owner';
  
  -- Zion: Manager
  INSERT INTO public.vendor_users (vendor_id, auth_user_id, role, is_active)
  VALUES (zion_vendor_id, manager_auth_id, 'manager', true)
  ON CONFLICT (vendor_id, auth_user_id) DO UPDATE SET role = 'manager';
  
  -- Zion: Staff
  INSERT INTO public.vendor_users (vendor_id, auth_user_id, role, is_active)
  VALUES (zion_vendor_id, staff_auth_id, 'staff', true)
  ON CONFLICT (vendor_id, auth_user_id) DO UPDATE SET role = 'staff';
  
  -- Create profiles for vendor users
  INSERT INTO public.profiles (id, name, role) VALUES
    (owner_auth_id, 'Venue Owner', 'VENDOR'),
    (manager_auth_id, 'Venue Manager', 'VENDOR'),
    (staff_auth_id, 'Venue Staff', 'VENDOR')
  ON CONFLICT (id) DO NOTHING;
END $$;

-- ============================================================================
-- 4. DEMO MENU ITEMS (sample from each vendor)
-- ============================================================================

-- Zion Reggae Bar menu items
INSERT INTO public.menu_items (vendor_id, category, name, description, price, is_available)
VALUES
  ('11111111-1111-1111-1111-111111111111'::uuid, 'Coffees & Teas', 'Espresso', 'Classic Italian espresso', 1.50, true),
  ('11111111-1111-1111-1111-111111111111'::uuid, 'Coffees & Teas', 'Cappuccino', 'Espresso with steamed milk foam', 2.50, true),
  ('11111111-1111-1111-1111-111111111111'::uuid, 'Coffees & Teas', 'Latte', 'Espresso with steamed milk', 3.00, true),
  ('11111111-1111-1111-1111-111111111111'::uuid, 'Pizza', 'Margherita', 'Classic tomato and mozzarella', 10.00, true),
  ('11111111-1111-1111-1111-111111111111'::uuid, 'Pizza', 'Capricciosa', 'Ham, mushrooms, artichokes, olives', 12.00, true),
  ('11111111-1111-1111-1111-111111111111'::uuid, 'Burgers', 'Zion Burger', 'House specialty burger', 14.00, true),
  ('11111111-1111-1111-1111-111111111111'::uuid, 'Burgers', 'Cheese Burger', 'Classic cheeseburger', 10.00, true),
  ('11111111-1111-1111-1111-111111111111'::uuid, 'Cocktails', 'Cuban Mojito', 'Rum, mint, lime, soda', 8.00, true),
  ('11111111-1111-1111-1111-111111111111'::uuid, 'Cocktails', 'Aperol Spritz', 'Aperol, prosecco, soda', 8.00, true),
  ('11111111-1111-1111-1111-111111111111'::uuid, 'Beer', 'Cisk Lager Pint', 'Local Maltese lager', 4.80, true)
ON CONFLICT DO NOTHING;

-- Victoria Gastro Pub menu items
INSERT INTO public.menu_items (vendor_id, category, name, description, price, is_available)
VALUES
  ('22222222-2222-2222-2222-222222222222'::uuid, 'Starters', 'Garlic Bread', 'Freshly baked with garlic butter', 5.50, true),
  ('22222222-2222-2222-2222-222222222222'::uuid, 'Starters', 'Calamari Fritti', 'Crispy fried calamari', 14.50, true),
  ('22222222-2222-2222-2222-222222222222'::uuid, 'Pizza', 'Margherita', 'Classic tomato and mozzarella', 8.95, true),
  ('22222222-2222-2222-2222-222222222222'::uuid, 'Pizza', 'Quattro Formaggi', 'Four cheese pizza', 14.50, true),
  ('22222222-2222-2222-2222-222222222222'::uuid, 'Burgers', 'Honest Burger', 'Classic beef burger', 13.50, true),
  ('22222222-2222-2222-2222-222222222222'::uuid, 'Burgers', 'Victoria Truffle Burger', 'Premium truffle burger', 15.50, true),
  ('22222222-2222-2222-2222-222222222222'::uuid, 'Mains', 'Fish & Chips', 'Beer battered fish with fries', 19.50, true),
  ('22222222-2222-2222-2222-222222222222'::uuid, 'Mains', 'Maltese Style Rabbit', 'Traditional braised rabbit', 22.50, true),
  ('22222222-2222-2222-2222-222222222222'::uuid, 'Pasta', 'Spaghetti Carbonara', 'Classic Roman carbonara', 14.50, true),
  ('22222222-2222-2222-2222-222222222222'::uuid, 'Beverages', 'Coca Cola', 'Classic cola', 4.00, true)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 5. DEMO TABLES
-- ============================================================================

-- Zion Reggae Bar tables
INSERT INTO public.tables (vendor_id, table_number, label, public_code, is_active)
VALUES
  ('11111111-1111-1111-1111-111111111111'::uuid, 1, 'Table 1', 'ZION-T1-ABC', true),
  ('11111111-1111-1111-1111-111111111111'::uuid, 2, 'Table 2', 'ZION-T2-DEF', true),
  ('11111111-1111-1111-1111-111111111111'::uuid, 3, 'Table 3', 'ZION-T3-GHI', true),
  ('11111111-1111-1111-1111-111111111111'::uuid, 4, 'Bar Seat 1', 'ZION-B1-JKL', true),
  ('11111111-1111-1111-1111-111111111111'::uuid, 5, 'Bar Seat 2', 'ZION-B2-MNO', true)
ON CONFLICT (vendor_id, table_number) DO NOTHING;

-- Victoria Gastro Pub tables
INSERT INTO public.tables (vendor_id, table_number, label, public_code, is_active)
VALUES
  ('22222222-2222-2222-2222-222222222222'::uuid, 1, 'Table 1', 'VIC-T1-PQR', true),
  ('22222222-2222-2222-2222-222222222222'::uuid, 2, 'Table 2', 'VIC-T2-STU', true),
  ('22222222-2222-2222-2222-222222222222'::uuid, 3, 'Table 3', 'VIC-T3-VWX', true),
  ('22222222-2222-2222-2222-222222222222'::uuid, 4, 'Terrace 1', 'VIC-TR1-YZA', true),
  ('22222222-2222-2222-2222-222222222222'::uuid, 5, 'Terrace 2', 'VIC-TR2-BCD', true)
ON CONFLICT (vendor_id, table_number) DO NOTHING;

-- ============================================================================
-- 6. DEMO CLIENT USER
-- ============================================================================

DO $$
DECLARE
  client_auth_id uuid := '00000000-0000-0000-0000-000000000020'::uuid;
BEGIN
  -- Create client profile
  INSERT INTO public.profiles (id, name, role, notifications_enabled)
  VALUES (client_auth_id, 'Demo Client', 'CLIENT', true)
  ON CONFLICT (id) DO NOTHING;
END $$;

-- ============================================================================
-- VERIFICATION QUERY
-- ============================================================================
-- Run this to verify seed data was inserted:

SELECT 'Seed Data Summary' as info;
SELECT 'admin_users' as table_name, count(*) as count FROM admin_users
UNION ALL SELECT 'vendors', count(*) FROM vendors
UNION ALL SELECT 'vendor_users', count(*) FROM vendor_users
UNION ALL SELECT 'menu_items', count(*) FROM menu_items
UNION ALL SELECT 'tables', count(*) FROM tables
UNION ALL SELECT 'profiles', count(*) FROM profiles
ORDER BY table_name;
