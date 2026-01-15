#!/bin/bash
# Quick script to display migration SQL for easy copy-paste to Supabase Dashboard

echo "📋 Vendor Dashboard Migration - SQL to Copy"
echo "============================================"
echo ""
echo "Copy the SQL below and paste into Supabase Dashboard SQL Editor:"
echo "→ https://supabase.com/dashboard/project/elhlcdiosomutugpneoc/sql"
echo ""
echo "─────────────────────────────────────────────────────────────────"
cat supabase/migrations/20250122000000_add_order_status_workflow.sql
echo "─────────────────────────────────────────────────────────────────"
echo ""
echo "✅ After applying, verify with:"
echo "   SELECT unnest(enum_range(NULL::order_status)) AS status;"
echo ""
