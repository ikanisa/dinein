-- Migration: Cleanup deprecated objects
-- Removes tables, functions, triggers no longer used in Malta-only DineIn deployment
-- WARNING: This migration is non-reversible. Data in dropped tables will be lost.

BEGIN;

-- ============================================================================
-- PHASE 1: Drop deprecated tables (cascades will remove triggers and indexes)
-- ============================================================================

-- Drop mobile_money_ussd_codes table (African mobile money, not used in Malta)
DROP TABLE IF EXISTS mobile_money_ussd_codes CASCADE;

-- Drop api_rate_limits table (not used in frontend)
DROP TABLE IF EXISTS api_rate_limits CASCADE;

-- ============================================================================
-- PHASE 2: Drop deprecated functions
-- ============================================================================

-- Drop check_rate_limit function overloads (linked to api_rate_limits)
DROP FUNCTION IF EXISTS check_rate_limit(TEXT, TEXT, INTEGER, INTERVAL);
DROP FUNCTION IF EXISTS check_rate_limit(TEXT, INTEGER, INTERVAL);

-- Drop apply_production_migrations (utility function, edge function handles this)
DROP FUNCTION IF EXISTS apply_production_migrations();

COMMIT;

-- Migration complete
-- Expected result: 10 tables, 12 functions remaining
