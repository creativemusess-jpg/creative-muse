-- ============================================================
-- Creative Muse — Checkout & Payments Migration
-- Run this in the Supabase SQL Editor
-- ============================================================

-- 1. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  payment_method TEXT NOT NULL,
  transaction_reference TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'INR',
  status payment_status NOT NULL DEFAULT 'pending',
  is_demo BOOLEAN NOT NULL DEFAULT true,
  safe_metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. COUPON_USAGE TABLE
CREATE TABLE IF NOT EXISTS coupon_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id UUID REFERENCES coupons(id) ON DELETE SET NULL,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  discount_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. CUSTOMER_ADDRESSES TABLE
CREATE TABLE IF NOT EXISTS customer_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT DEFAULT '',
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'India',
  landmark TEXT DEFAULT '',
  address_type TEXT DEFAULT 'Home',
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. ADD MISSING COLUMNS TO CUSTOMERS
ALTER TABLE customers ADD COLUMN IF NOT EXISTS auth_user_id UUID UNIQUE;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS provider TEXT DEFAULT 'email';
ALTER TABLE customers ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ;

-- 5. RLS POLICIES

-- Payments: customers can read their own
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Customers can read own payments" ON payments;
CREATE POLICY "Customers can read own payments" ON payments
  FOR SELECT USING (
    customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid())
  );
DROP POLICY IF EXISTS "Service can insert payments" ON payments;
CREATE POLICY "Service can insert payments" ON payments
  FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Admin full access to payments" ON payments;
CREATE POLICY "Admin full access to payments" ON payments
  FOR ALL USING (public.has_admin_role());

-- Coupon usage: customers can read their own
ALTER TABLE coupon_usage ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Customers can read own coupon usage" ON coupon_usage;
CREATE POLICY "Customers can read own coupon usage" ON coupon_usage
  FOR SELECT USING (
    customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid())
  );
DROP POLICY IF EXISTS "Service can insert coupon usage" ON coupon_usage;
CREATE POLICY "Service can insert coupon usage" ON coupon_usage
  FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Admin full access to coupon usage" ON coupon_usage;
CREATE POLICY "Admin full access to coupon usage" ON coupon_usage
  FOR ALL USING (public.has_admin_role());

-- Customer addresses: customers manage their own
ALTER TABLE customer_addresses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Customers manage own addresses" ON customer_addresses;
CREATE POLICY "Customers manage own addresses" ON customer_addresses
  FOR ALL USING (
    customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid())
  );

-- Customers: can read/update own profile
DROP POLICY IF EXISTS "Customers can insert own profile" ON customers;
CREATE POLICY "Customers can insert own profile" ON customers
  FOR INSERT WITH CHECK (auth_user_id = auth.uid());
DROP POLICY IF EXISTS "Customers can read own profile" ON customers;
CREATE POLICY "Customers can read own profile" ON customers
  FOR SELECT USING (auth_user_id = auth.uid());
DROP POLICY IF EXISTS "Customers can update own profile" ON customers;
CREATE POLICY "Customers can update own profile" ON customers
  FOR UPDATE USING (auth_user_id = auth.uid());

-- Orders: customers can read own
DROP POLICY IF EXISTS "Customers can read own orders" ON orders;
CREATE POLICY "Customers can read own orders" ON orders
  FOR SELECT USING (
    customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid())
  );
DROP POLICY IF EXISTS "Anyone can insert orders" ON orders;
CREATE POLICY "Anyone can insert orders" ON orders
  FOR INSERT WITH CHECK (true);

-- Order items: customers can read own
DROP POLICY IF EXISTS "Customers can read own order items" ON order_items;
CREATE POLICY "Customers can read own order items" ON order_items
  FOR SELECT USING (
    order_id IN (SELECT id FROM orders WHERE customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid()))
  );
DROP POLICY IF EXISTS "Anyone can insert order items" ON order_items;
CREATE POLICY "Anyone can insert order items" ON order_items
  FOR INSERT WITH CHECK (true);

-- 6. INDEXES
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_customer_id ON payments(customer_id);
CREATE INDEX IF NOT EXISTS idx_coupon_usage_coupon_id ON coupon_usage(coupon_id);
CREATE INDEX IF NOT EXISTS idx_coupon_usage_order_id ON coupon_usage(order_id);
CREATE INDEX IF NOT EXISTS idx_customer_addresses_customer_id ON customer_addresses(customer_id);
CREATE INDEX IF NOT EXISTS idx_customers_auth_user_id ON customers(auth_user_id);

-- 7. ADD START_DATE AND EXPIRY_DATE TO COUPONS IF MISSING
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS start_date TIMESTAMPTZ;
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS expiry_date TIMESTAMPTZ;
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS usage_count INT NOT NULL DEFAULT 0;
