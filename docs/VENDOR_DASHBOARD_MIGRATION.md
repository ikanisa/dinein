# Vendor Dashboard Migration Guide

This guide covers the database migration required for the new vendor dashboard order status workflow.

## Migration Overview

The migration `20250122000000_add_order_status_workflow.sql` adds new order statuses and updates the order workflow from:
- **Old**: `received` → `served`/`cancelled`
- **New**: `new` → `preparing` → `ready` → `completed` (or `cancelled` at any time)

## Prerequisites

- Access to Supabase Dashboard SQL Editor
- Admin/Superuser database access (for production)
- Backup of production database (recommended)

## Step 1: Review Migration SQL

The migration file is located at:
```
supabase/migrations/20250122000000_add_order_status_workflow.sql
```

Review the SQL to understand what changes will be made:
- Adds new enum values: `new`, `preparing`, `ready`, `completed`
- Maps existing `received` orders to `new`
- Maps existing `served` orders to `completed`
- Updates status transition validation function
- Creates performance indexes

## Step 2: Apply Migration

### Option A: Supabase Dashboard (Recommended)

1. Log in to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **SQL Editor**
4. Click **New Query**
5. Copy the entire contents of `supabase/migrations/20250122000000_add_order_status_workflow.sql`
6. Paste into the SQL Editor
7. Review the SQL carefully
8. Click **Run** to execute

### Option B: Supabase CLI

```bash
# If using Supabase CLI
supabase db push

# Or apply specific migration
supabase migration up 20250122000000_add_order_status_workflow
```

### Option C: Direct psql Connection

```bash
psql "postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/postgres" \
  -f supabase/migrations/20250122000000_add_order_status_workflow.sql
```

## Step 3: Verify Migration

Run this query in SQL Editor to verify the migration:

```sql
-- Check enum values
SELECT unnest(enum_range(NULL::order_status)) AS status;

-- Should return: received, served, cancelled, new, preparing, ready, completed

-- Check order status distribution
SELECT status, COUNT(*) 
FROM orders 
GROUP BY status;

-- Check that old statuses were mapped
SELECT 
  CASE 
    WHEN status = 'new' THEN 'Mapped from received'
    WHEN status = 'completed' THEN 'Mapped from served'
    ELSE 'Unchanged'
  END AS mapping_status,
  COUNT(*) 
FROM orders 
GROUP BY mapping_status;
```

## Step 4: Update Edge Functions (If Needed)

If you have Edge Functions that validate order status transitions, update them to support the new workflow:

- `order_update_status` function should allow new transitions
- Any validation logic should use new status values

## Step 5: Test New Workflow

1. Log in to vendor dashboard at `/vendor/live`
2. Create a test order (via client interface)
3. Verify order appears with status `NEW` (red indicator)
4. Click "Accept" - should change to `PREPARING` (yellow)
5. Click "Mark Ready" - should change to `READY` (green)
6. Click "Complete" - order should disappear from active queue

## Rollback Plan

If issues occur, you can rollback by:

```sql
-- Note: This will revert status values but may cause data inconsistencies
UPDATE orders SET status = 'received' WHERE status = 'new';
UPDATE orders SET status = 'served' WHERE status = 'completed';

-- Remove new enum values (complex - requires dropping and recreating enum)
-- Consider keeping enum values for future use
```

## Post-Migration Checklist

- [ ] Migration applied successfully
- [ ] Enum values verified
- [ ] Order status mapping verified
- [ ] Frontend dashboard loads correctly
- [ ] New order workflow tested
- [ ] Real-time subscriptions working
- [ ] No errors in browser console
- [ ] Vendor can complete full order workflow

## Support

If you encounter issues:
1. Check Supabase logs in Dashboard
2. Review browser console for errors
3. Verify RLS policies allow status updates
4. Check Edge Function logs if using custom validation

## Related Documentation

- [Vendor Dashboard User Guide](./VENDOR_DASHBOARD_GUIDE.md)
- [Database Schema](./DATABASE_SCHEMA.md)
- [User Journeys](./user-journeys.md)
