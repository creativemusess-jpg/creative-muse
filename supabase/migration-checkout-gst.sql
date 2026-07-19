-- ============================================================
-- Creative Muse — Checkout GST & Delivery Migration
-- Adds delivery/tax snapshot columns to orders table
-- Run this in the Supabase SQL Editor
-- ============================================================

-- Delivery method snapshot
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_method TEXT;

-- Tax breakdown snapshot (JSON)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tax_snapshot JSONB DEFAULT NULL;

-- Delivery address structured fields
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_state_code TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_city TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_district TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_pincode TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_locality TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_country_code TEXT DEFAULT 'IN';

-- Billing address
ALTER TABLE orders ADD COLUMN IF NOT EXISTS billing_address JSONB DEFAULT NULL;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS billing_same_as_delivery BOOLEAN NOT NULL DEFAULT true;

-- Estimated delivery
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_estimate TEXT;

-- Abandoned checkouts tracking
CREATE TABLE IF NOT EXISTS abandoned_checkouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  customer_email TEXT,
  cart_value NUMERIC(12,2) NOT NULL DEFAULT 0,
  last_step TEXT,
  delivery_pincode TEXT,
  delivery_state TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_abandoned_checkouts_customer_id ON abandoned_checkouts(customer_id);
CREATE INDEX IF NOT EXISTS idx_abandoned_checkouts_created_at ON abandoned_checkouts(created_at);

ALTER TABLE customer_addresses ADD COLUMN IF NOT EXISTS phone TEXT;
