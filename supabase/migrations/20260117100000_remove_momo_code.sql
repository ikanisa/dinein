-- Migration: Remove momo_code column (Malta focus - not needed)
-- This is for Malta-only deployment where Revolut is the payment method

-- Drop index first
DROP INDEX IF EXISTS idx_vendors_momo_code;

-- Remove momo_code column
ALTER TABLE vendors DROP COLUMN IF EXISTS momo_code;

-- Remove comment (will fail silently if column already dropped)
-- COMMENT ON COLUMN vendors.momo_code IS NULL; -- Not needed after drop

-- Migration complete
