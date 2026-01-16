-- Migration: Create countries table for multi-country support
-- Scalable design for future country additions

-- Create countries table
CREATE TABLE IF NOT EXISTS public.countries (
    code VARCHAR(2) PRIMARY KEY, -- ISO 3166-1 alpha-2 code (e.g., 'MT', 'RW')
    name TEXT NOT NULL,
    currency TEXT NOT NULL DEFAULT 'EUR',
    currency_symbol TEXT NOT NULL DEFAULT '€',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Insert initial countries (Malta and Rwanda)
INSERT INTO public.countries (code, name, currency, currency_symbol, is_active) VALUES
    ('MT', 'Malta', 'EUR', '€', true),
    ('RW', 'Rwanda', 'RWF', 'FRw', true)
ON CONFLICT (code) DO UPDATE SET
    name = EXCLUDED.name,
    currency = EXCLUDED.currency,
    currency_symbol = EXCLUDED.currency_symbol,
    is_active = EXCLUDED.is_active;

-- Add updated_at trigger
DROP TRIGGER IF EXISTS trg_countries_updated_at ON public.countries;
CREATE TRIGGER trg_countries_updated_at
BEFORE UPDATE ON public.countries
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS policies
ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;

-- Everyone can read active countries
DROP POLICY IF EXISTS "countries_read_active" ON public.countries;
CREATE POLICY "countries_read_active"
ON public.countries FOR SELECT
USING (is_active = true OR public.is_admin());

-- Only admins can modify countries
DROP POLICY IF EXISTS "countries_admin_write" ON public.countries;
CREATE POLICY "countries_admin_write"
ON public.countries FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Remove the old country constraint on vendors table (it was 'MT' only)
ALTER TABLE public.vendors DROP CONSTRAINT IF EXISTS vendors_country_mt_chk;

-- Add foreign key from vendors to countries
ALTER TABLE public.vendors 
DROP CONSTRAINT IF EXISTS vendors_country_fk;

ALTER TABLE public.vendors 
ADD CONSTRAINT vendors_country_fk 
FOREIGN KEY (country) REFERENCES public.countries(code);

-- Create index for quick lookups
CREATE INDEX IF NOT EXISTS idx_countries_active ON public.countries(is_active) WHERE is_active = true;

COMMENT ON TABLE public.countries IS 'Supported countries for DineIn deployment (scalable for future expansion)';
COMMENT ON COLUMN public.countries.code IS 'ISO 3166-1 alpha-2 country code';
COMMENT ON COLUMN public.countries.currency IS 'ISO 4217 currency code';
