-- ==========================================
-- RLS HARDENING COMPLETE
-- Migration: 20260114100000
-- ==========================================
-- This migration:
-- 1. Enables RLS on api_rate_limits table
-- 2. Adds policies for api_rate_limits (user own data + admin access)
-- 3. Adds admin visibility for profiles table
-- 4. Updates function grants
--
-- ROLLBACK PROCEDURE:
-- ALTER TABLE public.api_rate_limits DISABLE ROW LEVEL SECURITY;
-- DROP POLICY IF EXISTS "api_rate_limits_select_own" ON public.api_rate_limits;
-- DROP POLICY IF EXISTS "api_rate_limits_modify_own" ON public.api_rate_limits;
-- DROP POLICY IF EXISTS "api_rate_limits_admin_all" ON public.api_rate_limits;
-- DROP POLICY IF EXISTS "profiles_admin_select_all" ON public.profiles;

-- ============================================================================
-- 1. ENABLE RLS ON api_rate_limits
-- ============================================================================

ALTER TABLE public.api_rate_limits ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 2. ADD POLICIES FOR api_rate_limits
-- ============================================================================

-- Users can only view their own rate limit records
DROP POLICY IF EXISTS "api_rate_limits_select_own" ON public.api_rate_limits;
CREATE POLICY "api_rate_limits_select_own"
ON public.api_rate_limits FOR SELECT
USING (user_id = auth.uid());

-- Users can only modify their own rate limit records
-- (Note: The check_rate_limit function uses security definer so it bypasses RLS)
DROP POLICY IF EXISTS "api_rate_limits_modify_own" ON public.api_rate_limits;
CREATE POLICY "api_rate_limits_modify_own"
ON public.api_rate_limits FOR ALL
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Admins can view all rate limit records (for monitoring/debugging)
DROP POLICY IF EXISTS "api_rate_limits_admin_all" ON public.api_rate_limits;
CREATE POLICY "api_rate_limits_admin_all"
ON public.api_rate_limits FOR SELECT
USING (public.is_admin());

-- ============================================================================
-- 3. ADD ADMIN VISIBILITY FOR profiles
-- ============================================================================

-- Admins need to view all profiles for user management
DROP POLICY IF EXISTS "profiles_admin_select_all" ON public.profiles;
CREATE POLICY "profiles_admin_select_all"
ON public.profiles FOR SELECT
USING (public.is_admin());

-- ============================================================================
-- 4. UPDATE check_rate_limit FUNCTION TO USE SECURITY DEFINER
-- ============================================================================
-- Ensure the rate limit function bypasses RLS to allow atomic operations

CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_user_id uuid,
  p_endpoint text,
  p_limit int,
  p_window interval default interval '1 hour'
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count int;
  v_window_start timestamptz;
BEGIN
  SELECT request_count, window_start
    INTO v_count, v_window_start
  FROM public.api_rate_limits
  WHERE user_id = p_user_id
    AND endpoint = p_endpoint;

  IF v_count IS NULL OR v_window_start < now() - p_window THEN
    INSERT INTO public.api_rate_limits (user_id, endpoint, request_count, window_start)
    VALUES (p_user_id, p_endpoint, 1, now())
    ON CONFLICT (user_id, endpoint)
    DO UPDATE SET request_count = 1, window_start = now();
    RETURN true;
  END IF;

  IF v_count < p_limit THEN
    UPDATE public.api_rate_limits
    SET request_count = request_count + 1
    WHERE user_id = p_user_id
      AND endpoint = p_endpoint;
    RETURN true;
  END IF;

  RETURN false;
END;
$$;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION public.check_rate_limit(uuid, text, int, interval) TO authenticated;

-- ============================================================================
-- MIGRATION NOTES
-- ============================================================================
-- This migration is additive and safe to run.
-- The check_rate_limit function is SECURITY DEFINER so it bypasses RLS,
-- allowing atomic rate limit checks regardless of which user calls it.
-- 
-- After this migration:
-- - Users can only see their own rate limit data
-- - Admins can see all rate limit data (for debugging)
-- - Admins can see all user profiles (for user management)
-- - The check_rate_limit function continues to work correctly
