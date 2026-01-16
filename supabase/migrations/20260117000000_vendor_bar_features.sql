-- Migration: Add vendor bar features
-- Adds columns for MOMO payment, AI-generated content

-- Add new columns to vendors table
ALTER TABLE vendors
ADD COLUMN IF NOT EXISTS momo_code TEXT,
ADD COLUMN IF NOT EXISTS ai_description TEXT,
ADD COLUMN IF NOT EXISTS ai_image_url TEXT;

-- Add AI image URL to menu_items
ALTER TABLE menu_items
ADD COLUMN IF NOT EXISTS ai_image_url TEXT;

-- Create index for momo_code lookups
CREATE INDEX IF NOT EXISTS idx_vendors_momo_code ON vendors(momo_code) WHERE momo_code IS NOT NULL;

-- Add comment documentation
COMMENT ON COLUMN vendors.momo_code IS 'Mobile money payment code (MTN MOMO or similar)';
COMMENT ON COLUMN vendors.ai_description IS 'AI-generated description from Google Search/Places data';
COMMENT ON COLUMN vendors.ai_image_url IS 'AI-generated representative image URL via Nano Banana Pro';
COMMENT ON COLUMN menu_items.ai_image_url IS 'AI-generated food photography image URL';

-- RLS policies already exist for vendors table with column-level access
-- No new RLS policies needed as existing policies cover all columns
