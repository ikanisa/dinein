-- Migration: Add new order status workflow (new -> preparing -> ready -> completed)
-- This migration extends the order_status enum and updates transition validation

-- Add new status values to enum
ALTER TYPE public.order_status ADD VALUE IF NOT EXISTS 'new';
ALTER TYPE public.order_status ADD VALUE IF NOT EXISTS 'preparing';
ALTER TYPE public.order_status ADD VALUE IF NOT EXISTS 'ready';
ALTER TYPE public.order_status ADD VALUE IF NOT EXISTS 'completed';

-- Map existing orders to new status values
UPDATE public.orders SET status = 'new' WHERE status = 'received';
UPDATE public.orders SET status = 'completed' WHERE status = 'served';

-- Update the status transition validation function to allow new workflow
CREATE OR REPLACE FUNCTION public.validate_order_status_transition(
  old_status public.order_status,
  new_status public.order_status
)
RETURNS boolean
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  -- Allow same status (for other field updates)
  IF old_status = new_status THEN
    RETURN true;
  END IF;
  
  -- New workflow transitions:
  -- new -> preparing -> ready -> completed
  -- new -> cancelled (at any time)
  -- Any status -> cancelled (emergency cancel)
  
  IF new_status = 'cancelled' THEN
    RETURN true; -- Can cancel from any status
  END IF;
  
  -- Valid forward transitions
  IF old_status = 'new' AND new_status IN ('preparing', 'cancelled') THEN
    RETURN true;
  END IF;
  
  IF old_status = 'preparing' AND new_status IN ('ready', 'cancelled') THEN
    RETURN true;
  END IF;
  
  IF old_status = 'ready' AND new_status IN ('completed', 'cancelled') THEN
    RETURN true;
  END IF;
  
  -- Legacy support: Allow served -> completed mapping
  IF old_status = 'served' AND new_status = 'completed' THEN
    RETURN true;
  END IF;
  
  -- Legacy support: Allow received -> new/preparing
  IF old_status = 'received' AND new_status IN ('new', 'preparing', 'cancelled') THEN
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$;

-- Create index for vendor queries on active orders
CREATE INDEX IF NOT EXISTS idx_orders_vendor_status 
ON public.orders(vendor_id, status) 
WHERE status IN ('new', 'preparing', 'ready');

-- Create index for created_at DESC for order sorting
CREATE INDEX IF NOT EXISTS idx_orders_created_at_desc 
ON public.orders(created_at DESC);
