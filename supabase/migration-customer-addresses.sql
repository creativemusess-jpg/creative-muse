-- Customer Addresses table
-- Ensures proper relational architecture with full fields

CREATE TABLE IF NOT EXISTS customer_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  phone TEXT DEFAULT '',
  email TEXT DEFAULT '',
  address_line1 TEXT NOT NULL,
  address_line2 TEXT DEFAULT '',
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  landmark TEXT DEFAULT '',
  address_type TEXT DEFAULT 'Home',
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add missing columns if table already exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'customer_addresses') THEN
    BEGIN
      ALTER TABLE customer_addresses ADD COLUMN IF NOT EXISTS full_name TEXT NOT NULL DEFAULT '';
    EXCEPTION WHEN duplicate_column THEN END;
    BEGIN
      ALTER TABLE customer_addresses ADD COLUMN IF NOT EXISTS email TEXT DEFAULT '';
    EXCEPTION WHEN duplicate_column THEN END;
    BEGIN
      ALTER TABLE customer_addresses ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
    EXCEPTION WHEN duplicate_column THEN END;
    BEGIN
      ALTER TABLE customer_addresses ADD COLUMN IF NOT EXISTS phone TEXT DEFAULT '';
    EXCEPTION WHEN duplicate_column THEN END;
    BEGIN
      ALTER TABLE customer_addresses ADD COLUMN IF NOT EXISTS landmark TEXT DEFAULT '';
    EXCEPTION WHEN duplicate_column THEN END;
  END IF;
END $$;

-- Index for fast lookup
CREATE INDEX IF NOT EXISTS idx_customer_addresses_customer_id ON customer_addresses(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_addresses_is_default ON customer_addresses(is_default);

-- Enable RLS
ALTER TABLE customer_addresses ENABLE ROW LEVEL SECURITY;

-- Policy: customers can manage their own addresses
DROP POLICY IF EXISTS customer_addresses_select ON customer_addresses;
CREATE POLICY customer_addresses_select ON customer_addresses
  FOR SELECT USING (customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid()));

DROP POLICY IF EXISTS customer_addresses_insert ON customer_addresses;
CREATE POLICY customer_addresses_insert ON customer_addresses
  FOR INSERT WITH CHECK (customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid()));

DROP POLICY IF EXISTS customer_addresses_update ON customer_addresses;
CREATE POLICY customer_addresses_update ON customer_addresses
  FOR UPDATE USING (customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid()));

DROP POLICY IF EXISTS customer_addresses_delete ON customer_addresses;
CREATE POLICY customer_addresses_delete ON customer_addresses
  FOR DELETE USING (customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid()));
