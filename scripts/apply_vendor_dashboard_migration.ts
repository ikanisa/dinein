#!/usr/bin/env tsx
/**
 * Helper script to apply vendor dashboard migration
 * 
 * This script reads the migration SQL and provides instructions for applying it.
 * Due to Supabase security restrictions, DDL must be applied via:
 * 1. Supabase Dashboard SQL Editor (Recommended)
 * 2. Supabase CLI
 * 3. Direct psql connection
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MIGRATION_FILE = path.join(__dirname, '../supabase/migrations/20250122000000_add_order_status_workflow.sql');

console.log('📋 Vendor Dashboard Migration Helper\n');
console.log('='.repeat(60));

// Read migration SQL
if (!fs.existsSync(MIGRATION_FILE)) {
  console.error(`❌ Migration file not found: ${MIGRATION_FILE}`);
  process.exit(1);
}

const migrationSQL = fs.readFileSync(MIGRATION_FILE, 'utf-8');

console.log('\n✅ Migration file found');
console.log(`📄 File: ${MIGRATION_FILE}`);
console.log(`📊 Size: ${migrationSQL.length} characters\n`);

console.log('='.repeat(60));
console.log('📝 MIGRATION SUMMARY');
console.log('='.repeat(60));
console.log(`
This migration:
1. Adds new order status values: new, preparing, ready, completed
2. Maps existing orders: received → new, served → completed
3. Updates status transition validation function
4. Creates performance indexes

IMPORTANT: This will modify your database schema.
`);

console.log('='.repeat(60));
console.log('🚀 APPLY MIGRATION');
console.log('='.repeat(60));
console.log(`
Option 1: Supabase Dashboard (RECOMMENDED)
────────────────────────────────────────────
1. Go to: https://supabase.com/dashboard/project/elhlcdiosomutugpneoc/sql
2. Click "New Query"
3. Copy the SQL below (between the lines)
4. Paste into SQL Editor
5. Review carefully
6. Click "Run"

SQL to copy:
────────────────────────────────────────────
${migrationSQL}
────────────────────────────────────────────

Option 2: Supabase CLI
────────────────────────────────────────────
If you have Supabase CLI installed:

  supabase db push

Or apply specific migration:

  supabase migration up 20250122000000_add_order_status_workflow

Option 3: Direct psql
────────────────────────────────────────────
  psql "postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/postgres" \\
    -f ${MIGRATION_FILE}
`);

console.log('='.repeat(60));
console.log('✅ VERIFICATION');
console.log('='.repeat(60));
console.log(`
After applying, verify with:

  SELECT unnest(enum_range(NULL::order_status)) AS status;

Should return: received, served, cancelled, new, preparing, ready, completed
`);

console.log('='.repeat(60));
console.log('⚠️  IMPORTANT NOTES');
console.log('='.repeat(60));
console.log(`
- Backup your database before applying (recommended)
- This migration is safe to run multiple times (uses IF NOT EXISTS)
- Existing orders will be automatically mapped to new statuses
- Frontend code already supports both old and new statuses
`);

console.log('\n✨ Migration helper complete!\n');
