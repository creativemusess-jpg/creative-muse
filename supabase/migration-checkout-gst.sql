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
