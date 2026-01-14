-- ==========================================
-- STAFF vs ADMIN ACCESS VERIFICATION TESTS
-- ==========================================
-- Run these queries to verify RLS policies work correctly.
-- 
-- USAGE: 
--   1. Create test users in Supabase Auth
--   2. Set role to test user using: SET ROLE authenticated;
--   3. Set auth.uid() using: SELECT set_config('request.jwt.claims', '{"sub": "<user_uuid>"}', true);
--   4. Run queries and verify expected results
--
-- This script assumes demo seed data has been applied.

-- ============================================================================
-- TEST 1: Anonymous User Access
-- ============================================================================
-- Anonymous users should only see active vendors and available menu items

-- Reset to anon role
RESET ROLE;
SET ROLE anon;

-- Should return active vendors (expect 2 demo vendors)
SELECT 'TEST 1.1: Anon sees active vendors' as test;
SELECT id, name, status FROM vendors WHERE status = 'active';
-- Expected: 2 rows (Zion Reggae Bar, Victoria Gastro Pub)

-- Should return available menu items for active vendors
SELECT 'TEST 1.2: Anon sees available menu items' as test;
SELECT id, name, price FROM menu_items WHERE is_available = true LIMIT 5;
-- Expected: menu items from active vendors only

-- Should NOT see admin_users
SELECT 'TEST 1.3: Anon cannot see admin_users' as test;
SELECT count(*) as admin_count FROM admin_users;
-- Expected: 0 rows (RLS blocks access)

-- Should NOT see audit_logs
SELECT 'TEST 1.4: Anon cannot see audit_logs' as test;
SELECT count(*) as audit_count FROM audit_logs;
-- Expected: 0 rows (RLS blocks access)

RESET ROLE;

-- ============================================================================
-- TEST 2: Client User Access
-- ============================================================================
-- Clients can see active vendors, their own orders/reservations, own profile

-- Set to authenticated role with demo client UUID
SET ROLE authenticated;
SELECT set_config('request.jwt.claims', '{"sub": "00000000-0000-0000-0000-000000000020"}', true);

-- Should see own profile
SELECT 'TEST 2.1: Client sees own profile' as test;
SELECT id, name, role FROM profiles WHERE id = '00000000-0000-0000-0000-000000000020'::uuid;
-- Expected: 1 row (Demo Client)

-- Should NOT see other profiles
SELECT 'TEST 2.2: Client cannot see other profiles' as test;
SELECT count(*) as other_profiles FROM profiles WHERE id != '00000000-0000-0000-0000-000000000020'::uuid;
-- Expected: 0 rows (RLS blocks)

-- Should see active vendors
SELECT 'TEST 2.3: Client sees active vendors' as test;
SELECT count(*) as vendor_count FROM vendors WHERE status = 'active';
-- Expected: 2 rows

-- Should NOT see admin_users
SELECT 'TEST 2.4: Client cannot see admin_users' as test;
SELECT count(*) as admin_count FROM admin_users;
-- Expected: 0 rows

-- Should NOT see audit_logs
SELECT 'TEST 2.5: Client cannot see audit_logs' as test;
SELECT count(*) as audit_count FROM audit_logs;
-- Expected: 0 rows

RESET ROLE;

-- ============================================================================
-- TEST 3: Vendor Staff Access
-- ============================================================================
-- Staff can see their vendor's data but cannot modify vendor profile

SET ROLE authenticated;
SELECT set_config('request.jwt.claims', '{"sub": "00000000-0000-0000-0000-000000000012"}', true);

-- Should see their vendor
SELECT 'TEST 3.1: Vendor staff sees their vendor' as test;
SELECT id, name FROM vendors WHERE id = '11111111-1111-1111-1111-111111111111'::uuid;
-- Expected: 1 row (Zion Reggae Bar)

-- Should see their vendor's orders (if any)
SELECT 'TEST 3.2: Vendor staff sees vendor orders' as test;
SELECT count(*) as order_count FROM orders WHERE vendor_id = '11111111-1111-1111-1111-111111111111'::uuid;
-- Expected: orders for Zion Reggae Bar

-- Should NOT see other vendor's data
SELECT 'TEST 3.3: Vendor staff cannot see other vendor orders' as test;
SELECT count(*) as other_orders FROM orders WHERE vendor_id = '22222222-2222-2222-2222-222222222222'::uuid;
-- Expected: 0 rows (or only if they placed order as client)

-- Should NOT see admin_users
SELECT 'TEST 3.4: Vendor staff cannot see admin_users' as test;
SELECT count(*) as admin_count FROM admin_users;
-- Expected: 0 rows

-- Should NOT see audit_logs
SELECT 'TEST 3.5: Vendor staff cannot see audit_logs' as test;
SELECT count(*) as audit_count FROM audit_logs;
-- Expected: 0 rows

RESET ROLE;

-- ============================================================================
-- TEST 4: Admin User Access
-- ============================================================================
-- Admins can see everything

SET ROLE authenticated;
SELECT set_config('request.jwt.claims', '{"sub": "00000000-0000-0000-0000-000000000001"}', true);

-- Should see ALL vendors (including non-active)
SELECT 'TEST 4.1: Admin sees all vendors' as test;
SELECT count(*) as all_vendors FROM vendors;
-- Expected: all vendors in system

-- Should see ALL profiles
SELECT 'TEST 4.2: Admin sees all profiles' as test;
SELECT count(*) as all_profiles FROM profiles;
-- Expected: all profiles in system

-- Should see admin_users
SELECT 'TEST 4.3: Admin sees admin_users' as test;
SELECT count(*) as admin_count FROM admin_users;
-- Expected: >= 1 (demo admin)

-- Should see audit_logs
SELECT 'TEST 4.4: Admin sees audit_logs' as test;
SELECT count(*) as audit_count FROM audit_logs;
-- Expected: all audit logs

-- Should see ALL orders
SELECT 'TEST 4.5: Admin sees all orders' as test;
SELECT count(*) as all_orders FROM orders;
-- Expected: all orders in system

-- Should see api_rate_limits
SELECT 'TEST 4.6: Admin sees rate limits' as test;
SELECT count(*) as rate_limit_count FROM api_rate_limits;
-- Expected: all rate limit records

RESET ROLE;

-- ============================================================================
-- TEST 5: Rate Limits RLS Verification
-- ============================================================================

SET ROLE authenticated;
SELECT set_config('request.jwt.claims', '{"sub": "00000000-0000-0000-0000-000000000020"}', true);

-- Insert a rate limit for current user (simulating API usage)
INSERT INTO api_rate_limits (user_id, endpoint, request_count, window_start)
VALUES ('00000000-0000-0000-0000-000000000020'::uuid, '/api/test', 1, now())
ON CONFLICT (user_id, endpoint) DO UPDATE SET request_count = api_rate_limits.request_count + 1;

-- Should see only own rate limits
SELECT 'TEST 5.1: User sees own rate limits' as test;
SELECT count(*) as own_limits FROM api_rate_limits WHERE user_id = '00000000-0000-0000-0000-000000000020'::uuid;
-- Expected: 1 row

-- Should NOT see others' rate limits
SELECT 'TEST 5.2: User cannot see others rate limits' as test;
SELECT count(*) as other_limits FROM api_rate_limits WHERE user_id != '00000000-0000-0000-0000-000000000020'::uuid;
-- Expected: 0 rows (RLS blocks)

RESET ROLE;

-- ============================================================================
-- SUMMARY
-- ============================================================================
SELECT 'All RLS verification tests complete. Review results above.' as summary;
