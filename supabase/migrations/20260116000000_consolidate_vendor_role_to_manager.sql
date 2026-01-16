-- ==========================================
-- MIGRATION: Simplify vendor_role to 'manager' only
-- ==========================================
-- This migration:
-- 1. Consolidates all vendor_users roles to 'manager'
-- 2. Simplifies RLS helper functions (removes owner/staff checks)
-- 3. Updates policies to use simplified functions
--
-- ROLLBACK PROCEDURE:
-- This migration is data-modifying but not destructive.
-- To rollback: manually restore role values if needed, but the
-- enum simplification is backward compatible.

-- ============================================================================
-- 1. CONSOLIDATE EXISTING DATA
-- ============================================================================
-- Update all vendor_users to have role = 'manager'
-- This is safe because 'manager' is already a valid enum value

UPDATE public.vendor_users 
SET role = 'manager'::vendor_role 
WHERE role IN ('owner', 'staff');

-- ============================================================================
-- 2. SIMPLIFY can_edit_vendor_profile FUNCTION
-- ============================================================================
-- Before: Required owner/manager role
-- After: Any vendor member can edit their venue (or admin)

CREATE OR REPLACE FUNCTION public.can_edit_vendor_profile(p_vendor_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.is_admin() OR public.is_vendor_member(p_vendor_id);
$$;

-- ============================================================================
-- 3. SIMPLIFY vendor_users RLS POLICY
-- ============================================================================
-- Before: Only owner/manager could write
-- After: Any manager of the vendor can write (all are equal now)

DROP POLICY IF EXISTS "vendor_users_write" ON public.vendor_users;
CREATE POLICY "vendor_users_write"
ON public.vendor_users FOR ALL
USING (public.is_admin() OR public.is_vendor_member(vendor_id))
WITH CHECK (public.is_admin() OR public.is_vendor_member(vendor_id));

-- ============================================================================
-- 4. UPDATE DOCUMENTATION COMMENT
-- ============================================================================

COMMENT ON COLUMN public.vendor_users.role IS 'Vendor role (currently all users are "manager")';

-- ============================================================================
-- MIGRATION NOTES
-- ============================================================================
-- The vendor_role enum still exists with values ('owner','manager','staff')
-- for backward compatibility, but all users are now 'manager'.
-- 
-- To fully remove old enum values would require:
-- 1. Create new enum type
-- 2. Alter column to use new type
-- 3. Drop old type
-- This is not done here to avoid complexity and potential downtime.
--
-- The simplified model:
-- - Client: No vendor_users record
-- - Manager: Has vendor_users record (any role value)
-- - Admin: Has admin_users record
