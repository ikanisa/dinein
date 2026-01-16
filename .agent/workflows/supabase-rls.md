---
description: Design/update Supabase RLS policies for Staff/Admin systems safely (least privilege, no duplicates)
---

# Supabase RLS Workflow

Design and manage Row-Level Security policies for Staff/Admin monorepo systems.

## Prerequisites

- **Supabase Project ID**: Required. Find it in the Supabase dashboard or run `mcp_supabase-mcp-server_list_projects`.
- **Authentication**: Must have access to Supabase MCP server (check via `mcp_supabase-mcp-server_list_tables`).

## Audit Phase

### 1. Inventory Current State

```bash
# List all tables in public schema
mcp_supabase-mcp-server_list_tables --project_id=PROJECT_ID --schemas=["public"]

# List current migrations
mcp_supabase-mcp-server_list_migrations --project_id=PROJECT_ID
```

### 2. Run RLS Verification Script

Execute in Supabase SQL Editor or via MCP:
```sql
-- File: supabase/scripts/verify_rls_status.sql
```

The script checks:
- RLS enabled on all critical tables
- All expected policies exist
- No tables with RLS enabled but no policies (security gap)
- Anonymous access policies for public discovery

### 3. Run Role Access Verification

Execute in Supabase SQL Editor:
```sql
-- File: supabase/scripts/verify_staff_vs_admin_access.sql
```

Tests cover:
- Anonymous user access (read only public data)
- Client user access (own orders/reservations)
- Vendor staff access (vendor-scoped data)
- Admin access (all data)
- Cross-tenant isolation

## Role Hierarchy

| Role | RLS Check Function | Access Scope |
|------|-------------------|--------------|
| **Anonymous** | N/A | Active vendors, available menu items, active tables |
| **Client** | `auth.uid()` | Own orders, reservations, profile |
| **Manager** (Vendor) | `is_vendor_member(vendor_id)` | Vendor-scoped data + manage venue |
| **Admin** | `is_admin()` | All data |

## Helper Functions Reference

| Function | Purpose |
|----------|---------|
| `is_admin()` | Returns true if current user is active admin |
| `is_vendor_member(vendor_id)` | Returns true if user belongs to vendor |
| `vendor_role_for(vendor_id)` | Returns user's role for vendor (owner/manager/staff) |
| `can_edit_vendor_profile(vendor_id)` | Returns true if user can edit vendor (admin + owner/manager) |
| `can_manage_vendor_ops(vendor_id)` | Returns true if user can manage vendor ops (admin + any vendor member) |
| `get_user_role()` | Returns 'admin', 'vendor', or 'client' |

## Creating New RLS Policies

### Policy Naming Convention

```
{table}_{role}_{operation}
```

Examples:
- `orders_select` - General select policy
- `orders_insert_client` - Client-only insert
- `orders_update_vendor` - Vendor-only update
- `vendors_anon_select_active` - Anonymous read of active vendors

### Policy Template

```sql
-- Enable RLS on table
ALTER TABLE public.{table_name} ENABLE ROW LEVEL SECURITY;

-- SELECT policy
DROP POLICY IF EXISTS "{table}_select" ON public.{table};
CREATE POLICY "{table}_select"
ON public.{table} FOR SELECT
USING (
  public.is_admin()
  OR public.is_vendor_member({vendor_id_column})
  OR {additional_conditions}
);

-- INSERT policy (restrict to specific roles)
DROP POLICY IF EXISTS "{table}_insert" ON public.{table};
CREATE POLICY "{table}_insert"
ON public.{table} FOR INSERT
WITH CHECK ({condition});

-- UPDATE policy (admin + vendor members)
DROP POLICY IF EXISTS "{table}_update" ON public.{table};
CREATE POLICY "{table}_update"
ON public.{table} FOR UPDATE
USING (public.is_admin() OR public.is_vendor_member({vendor_id_column}))
WITH CHECK (public.is_admin() OR public.is_vendor_member({vendor_id_column}));

-- DELETE policy (usually admin only)
DROP POLICY IF EXISTS "{table}_delete" ON public.{table};
CREATE POLICY "{table}_delete"
ON public.{table} FOR DELETE
USING (public.is_admin());
```

## Migration Workflow

### 1. Create Migration File

```bash
# Format: YYYYMMDDHHMMSS_{descriptive_name}.sql
touch supabase/migrations/$(date +%Y%m%d%H%M%S)_rls_update.sql
```

### 2. Include Rollback Procedure

Every migration MUST include rollback comments:

```sql
-- ==========================================
-- RLS UPDATE: {description}
-- ==========================================
-- ROLLBACK PROCEDURE:
-- DROP POLICY IF EXISTS "policy_name" ON public.table_name;
-- (repeat for each policy added)
```

### 3. Apply Migration

```bash
# Via Supabase CLI
supabase db push

# Or via MCP
mcp_supabase-mcp-server_apply_migration --project_id=PROJECT_ID --name="rls_update" --query="..."
```

### 4. Verify Changes

Run verification scripts after every migration:
```sql
-- verify_rls_status.sql
-- verify_staff_vs_admin_access.sql
```

## Common Patterns

### Anonymous Read (Public Discovery)

```sql
CREATE POLICY "vendors_anon_select_active"
ON public.vendors FOR SELECT
TO anon
USING (status = 'active');
```

### Own Data Only (Client)

```sql
CREATE POLICY "orders_select_own"
ON public.orders FOR SELECT
USING (client_auth_user_id = auth.uid());
```

### Vendor-Scoped Access (Staff)

```sql
CREATE POLICY "orders_select_vendor"
ON public.orders FOR SELECT
USING (
  public.is_admin()
  OR public.is_vendor_member(vendor_id)
  OR client_auth_user_id = auth.uid()
);
```

### Admin Override

```sql
CREATE POLICY "admin_users_write"
ON public.admin_users FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());
```

## Security Checklist

- [ ] RLS enabled on ALL tables with sensitive data
- [ ] No tables with RLS enabled but zero policies
- [ ] Helper functions use `SECURITY DEFINER` with `SET search_path = public`
- [ ] Cross-tenant isolation tested (vendor A cannot see vendor B data)
- [ ] Client isolation tested (client A cannot see client B orders)
- [ ] Admin can see/modify all data
- [ ] Anonymous users limited to public/active data
- [ ] INSERT policies restrict who can create records
- [ ] UPDATE/DELETE policies are as restrictive as needed
- [ ] No duplicate policies (use DROP POLICY IF EXISTS)
- [ ] Rollback procedure documented in migration

## Troubleshooting

### RLS Blocked Access Unexpectedly

```sql
-- Check if RLS is enabled
SELECT relname, relrowsecurity FROM pg_class 
WHERE relname = 'your_table';

-- Check policies for table
SELECT * FROM pg_policies WHERE tablename = 'your_table';

-- Test with specific user context
SET ROLE authenticated;
SELECT set_config('request.jwt.claims', '{"sub": "user_uuid"}', true);
SELECT * FROM your_table;
RESET ROLE;
```

### Performance Issues

RLS policies with subqueries can be slow. Optimize by:
1. Using helper functions (cached per transaction)
2. Adding appropriate indexes for RLS filter columns
3. Using `SECURITY DEFINER` functions to bypass nested RLS checks

## Documentation

After making RLS changes, update:
- `docs/DATABASE_SCHEMA.md` - RLS Policies Summary section
- `docs/RLS_VERIFICATION.md` - Verification instructions
- `docs/RLS_TEST_EVIDENCE.md` - Test results and sign-off
