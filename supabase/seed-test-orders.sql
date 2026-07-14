-- ============================================================
-- Seed test orders + order_items for end-to-end checkout test
-- Run this in the Supabase SQL Editor (single execution)
-- ============================================================

-- Ensure orders table has columns used by admin panel
ALTER TABLE orders ADD COLUMN IF NOT EXISTS fulfillment_status TEXT DEFAULT 'unfulfilled';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_cost DECIMAL(12,2) DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS subtotal DECIMAL(12,2);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tax_amount DECIMAL(12,2) DEFAULT 0;

-- Ensure customers table has total_spent (may not exist on fresh schema)
ALTER TABLE customers ADD COLUMN IF NOT EXISTS total_orders INT NOT NULL DEFAULT 0;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS total_spent DECIMAL(12,2) NOT NULL DEFAULT 0;

-- First ensure test customers exist
INSERT INTO customers (email, full_name, phone, shipping_address, total_orders, total_spent)
SELECT 'priya.sharma@example.com', 'Priya Sharma', '+91-98765-43210',
  '{}'::jsonb, 0, 0
WHERE NOT EXISTS (SELECT 1 FROM customers WHERE email = 'priya.sharma@example.com');

INSERT INTO customers (email, full_name, phone, shipping_address, total_orders, total_spent)
SELECT 'ananya.gupta@example.com', 'Ananya Gupta', '+91-99887-76655',
  '{}'::jsonb, 0, 0
WHERE NOT EXISTS (SELECT 1 FROM customers WHERE email = 'ananya.gupta@example.com');

INSERT INTO customers (email, full_name, phone, shipping_address, total_orders, total_spent)
SELECT 'rohit.verma@example.com', 'Rohit Verma', '+91-87654-32109',
  '{}'::jsonb, 0, 0
WHERE NOT EXISTS (SELECT 1 FROM customers WHERE email = 'rohit.verma@example.com');

INSERT INTO customers (email, full_name, phone, shipping_address, total_orders, total_spent)
SELECT 'neha.patel@example.com', 'Neha Patel', '+91-76543-21098',
  '{}'::jsonb, 0, 0
WHERE NOT EXISTS (SELECT 1 FROM customers WHERE email = 'neha.patel@example.com');

INSERT INTO customers (email, full_name, phone, shipping_address, total_orders, total_spent)
SELECT 'arjun.singh@example.com', 'Arjun Singh', '+91-88990-01122',
  '{}'::jsonb, 0, 0
WHERE NOT EXISTS (SELECT 1 FROM customers WHERE email = 'arjun.singh@example.com');

-- Generate order numbers using sequence
CREATE SEQUENCE IF NOT EXISTS test_order_seq START 1001;

-- ============================================================
-- ORDER 1: Fully delivered (paid + fulfilled)
-- ============================================================
DO $$
DECLARE
  v_order_id UUID;
  v_order_num TEXT;
  v_cust_id UUID;
BEGIN
  SELECT id INTO v_cust_id FROM customers WHERE email = 'priya.sharma@example.com';
  v_order_num := 'CM-2026-' || LPAD(nextval('test_order_seq')::text, 6, '0');

  INSERT INTO orders (order_number, customer_id, customer_email, customer_name, total_amount, discount_amount, coupon_code, payment_status, order_status, shipping_address, tracking_id, courier, notes, created_at, updated_at)
  VALUES (v_order_num, v_cust_id, 'priya.sharma@example.com', 'Priya Sharma', 54300, 3200, 'WELCOME10', 'paid', 'delivered',
    '{"line1":"42, Seaside Apartments","city":"Mumbai","state":"Maharashtra","pincode":"400001","phone":"+91-98765-43210"}'::jsonb,
    'TRACK-IND-12345678', 'India Post', 'Left at reception. Signature received.', now() - interval '14 days', now() - interval '2 days');

  v_order_id := currval(pg_get_serial_sequence('orders', 'id'));
  -- Actually, UUIDs don't use sequences. Let me get the order id differently.
  SELECT id INTO v_order_id FROM orders WHERE order_number = v_order_num;

  INSERT INTO order_items (order_id, product_id, product_name, product_sku, product_image, quantity, unit_price, total_price)
  SELECT v_order_id, p.id, p.name, p.sku, (SELECT url FROM product_images WHERE product_id = p.id LIMIT 1), 1, 48500, 48500
  FROM products p WHERE p.slug = 'aarav-solitaire';

  INSERT INTO order_items (order_id, product_id, product_name, product_sku, product_image, quantity, unit_price, total_price)
  SELECT v_order_id, p.id, p.name, p.sku, (SELECT url FROM product_images WHERE product_id = p.id LIMIT 1), 1, 5800, 5800
  FROM products p WHERE p.slug = 'luna-crescent';

  UPDATE customers SET total_orders = total_orders + 1, total_spent = total_spent + 54300 WHERE id = v_cust_id;
END $$;

-- ============================================================
-- ORDER 2: Shipped / In transit (paid, shipped)
-- ============================================================
DO $$
DECLARE
  v_order_id UUID;
  v_order_num TEXT;
  v_cust_id UUID;
BEGIN
  SELECT id INTO v_cust_id FROM customers WHERE email = 'ananya.gupta@example.com';
  v_order_num := 'CM-2026-' || LPAD(nextval('test_order_seq')::text, 6, '0');

  INSERT INTO orders (order_number, customer_id, customer_email, customer_name, total_amount, payment_status, order_status, shipping_address, tracking_id, courier, notes, created_at, updated_at)
  VALUES (v_order_num, v_cust_id, 'ananya.gupta@example.com', 'Ananya Gupta', 67500, 'paid', 'shipped',
    '{"line1":"12, Green Park Colony","city":"Delhi","state":"Delhi","pincode":"110016","phone":"+91-99887-76655"}'::jsonb,
    'TRACK-DEL-98765432', 'Bluedart', 'Handle with care — fragile item.',
    now() - interval '5 days', now() - interval '1 day');

  SELECT id INTO v_order_id FROM orders WHERE order_number = v_order_num;

  INSERT INTO order_items (order_id, product_id, product_name, product_sku, quantity, unit_price, total_price)
  SELECT v_order_id, p.id, p.name, p.sku, 1, 67500, 67500
  FROM products p WHERE p.slug = 'serene-bracelet';

  UPDATE customers SET total_orders = total_orders + 1, total_spent = total_spent + 67500 WHERE id = v_cust_id;
END $$;

-- ============================================================
-- ORDER 3: Processing (paid, processing)
-- ============================================================
DO $$
DECLARE
  v_order_id UUID;
  v_order_num TEXT;
  v_cust_id UUID;
BEGIN
  SELECT id INTO v_cust_id FROM customers WHERE email = 'rohit.verma@example.com';
  v_order_num := 'CM-2026-' || LPAD(nextval('test_order_seq')::text, 6, '0');

  INSERT INTO orders (order_number, customer_id, customer_email, customer_name, total_amount, discount_amount, coupon_code, payment_status, order_status, shipping_address, notes, created_at)
  VALUES (v_order_num, v_cust_id, 'rohit.verma@example.com', 'Rohit Verma', 38900, 3900, 'ROHIT20', 'paid', 'processing',
    '{"line1":"5A, Lake View Road","city":"Bangalore","state":"Karnataka","pincode":"560042","phone":"+91-87654-32109"}'::jsonb,
    'Rush order — needed for anniversary.',
    now() - interval '2 days');

  SELECT id INTO v_order_id FROM orders WHERE order_number = v_order_num;

  INSERT INTO order_items (order_id, product_id, product_name, product_sku, quantity, unit_price, total_price)
  SELECT v_order_id, p.id, p.name, p.sku, 1, 38900, 38900
  FROM products p WHERE p.slug = 'priya-kundan';

  UPDATE customers SET total_orders = total_orders + 1, total_spent = total_spent + 38900 WHERE id = v_cust_id;
END $$;

-- ============================================================
-- ORDER 4: New / Pending (pending payment, pending)
-- ============================================================
DO $$
DECLARE
  v_order_id UUID;
  v_order_num TEXT;
  v_cust_id UUID;
BEGIN
  SELECT id INTO v_cust_id FROM customers WHERE email = 'neha.patel@example.com';
  v_order_num := 'CM-2026-' || LPAD(nextval('test_order_seq')::text, 6, '0');

  INSERT INTO orders (order_number, customer_id, customer_email, customer_name, total_amount, payment_status, order_status, shipping_address, created_at)
  VALUES (v_order_num, v_cust_id, 'neha.patel@example.com', 'Neha Patel', 18400, 'pending', 'pending',
    '{"line1":"78, Harmony Tower","city":"Ahmedabad","state":"Gujarat","pincode":"380001","phone":"+91-76543-21098"}'::jsonb,
    now() - interval '6 hours');

  SELECT id INTO v_order_id FROM orders WHERE order_number = v_order_num;

  INSERT INTO order_items (order_id, product_id, product_name, product_sku, quantity, unit_price, total_price)
  SELECT v_order_id, p.id, p.name, p.sku, 1, 18400, 18400
  FROM products p WHERE p.slug = 'meera-jhumka';

  UPDATE customers SET total_orders = total_orders + 1, total_spent = total_spent + 18400 WHERE id = v_cust_id;
END $$;

-- ============================================================
-- ORDER 5: Confirmed but not yet fulfilled (paid, confirmed)
-- ============================================================
DO $$
DECLARE
  v_order_id UUID;
  v_order_num TEXT;
  v_cust_id UUID;
BEGIN
  SELECT id INTO v_cust_id FROM customers WHERE email = 'arjun.singh@example.com';
  v_order_num := 'CM-2026-' || LPAD(nextval('test_order_seq')::text, 6, '0');

  INSERT INTO orders (order_number, customer_id, customer_email, customer_name, total_amount, payment_status, order_status, shipping_address, tracking_id, courier, notes, created_at)
  VALUES (v_order_num, v_cust_id, 'arjun.singh@example.com', 'Arjun Singh', 92000, 'paid', 'confirmed',
    '{"line1":"33, Oak Estate","city":"Pune","state":"Maharashtra","pincode":"411001","phone":"+91-88990-01122"}'::jsonb,
    'TRACK-RDY-55667788', 'DTDC', 'Awaiting pickup from atelier.',
    now() - interval '1 day');

  SELECT id INTO v_order_id FROM orders WHERE order_number = v_order_num;

  INSERT INTO order_items (order_id, product_id, product_name, product_sku, quantity, unit_price, total_price)
  SELECT v_order_id, p.id, p.name, p.sku, 1, 92000, 92000
  FROM products p WHERE p.slug = 'royal-polki';

  UPDATE customers SET total_orders = total_orders + 1, total_spent = total_spent + 92000 WHERE id = v_cust_id;
END $$;

-- ============================================================
-- ORDER 6: Cancelled (refunded payment)
-- ============================================================
DO $$
DECLARE
  v_order_id UUID;
  v_order_num TEXT;
  v_cust_id UUID;
BEGIN
  SELECT id INTO v_cust_id FROM customers WHERE email = 'priya.sharma@example.com';
  v_order_num := 'CM-2026-' || LPAD(nextval('test_order_seq')::text, 6, '0');

  INSERT INTO orders (order_number, customer_id, customer_email, customer_name, total_amount, payment_status, order_status, shipping_address, notes, created_at, updated_at)
  VALUES (v_order_num, v_cust_id, 'priya.sharma@example.com', 'Priya Sharma', 15600, 'refunded', 'cancelled',
    '{"line1":"42, Seaside Apartments","city":"Mumbai","state":"Maharashtra","pincode":"400001"}'::jsonb,
    'Customer cancelled — ordered wrong size.',
    now() - interval '10 days', now() - interval '9 days');

  SELECT id INTO v_order_id FROM orders WHERE order_number = v_order_num;

  INSERT INTO order_items (order_id, product_id, product_name, product_sku, quantity, unit_price, total_price)
  SELECT v_order_id, p.id, p.name, p.sku, 1, 15600, 15600
  FROM products p WHERE p.slug = 'luna-crescent';

  -- Don't increment customer totals for cancelled order (or do — data reflects what happened)
  UPDATE customers SET total_spent = total_spent + 15600 WHERE id = v_cust_id;
END $$;

-- ============================================================
-- ORDER 7: Partially refunded (refunded, delivered)
-- ============================================================
DO $$
DECLARE
  v_order_id UUID;
  v_order_num TEXT;
  v_cust_id UUID;
BEGIN
  SELECT id INTO v_cust_id FROM customers WHERE email = 'ananya.gupta@example.com';
  v_order_num := 'CM-2026-' || LPAD(nextval('test_order_seq')::text, 6, '0');

  INSERT INTO orders (order_number, customer_id, customer_email, customer_name, total_amount, discount_amount, payment_status, order_status, shipping_address, notes, created_at, updated_at)
  VALUES (v_order_num, v_cust_id, 'ananya.gupta@example.com', 'Ananya Gupta', 47000, 1000, 'refunded', 'returned',
    '{"line1":"12, Green Park Colony","city":"Delhi","state":"Delhi","pincode":"110016"}'::jsonb,
    'Returned — item did not match color. Partial refund issued.',
    now() - interval '20 days', now() - interval '3 days');

  SELECT id INTO v_order_id FROM orders WHERE order_number = v_order_num;

  INSERT INTO order_items (order_id, product_id, product_name, product_sku, quantity, unit_price, total_price)
  SELECT v_order_id, p.id, p.name, p.sku, 1, 22800, 22800
  FROM products p WHERE p.slug = 'celestia-drop';

  INSERT INTO order_items (order_id, product_id, product_name, product_sku, quantity, unit_price, total_price)
  SELECT v_order_id, p.id, p.name, p.sku, 1, 25200, 25200
  FROM products p WHERE p.slug = 'meera-jhumka';

  UPDATE customers SET total_orders = total_orders + 1, total_spent = total_spent + 47000 WHERE id = v_cust_id;
END $$;

-- ============================================================
-- ORDER 8: Out for delivery (paid, out_for_delivery)
-- ============================================================
DO $$
DECLARE
  v_order_id UUID;
  v_order_num TEXT;
  v_cust_id UUID;
BEGIN
  SELECT id INTO v_cust_id FROM customers WHERE email = 'neha.patel@example.com';
  v_order_num := 'CM-2026-' || LPAD(nextval('test_order_seq')::text, 6, '0');

  INSERT INTO orders (order_number, customer_id, customer_email, customer_name, total_amount, payment_status, order_status, shipping_address, tracking_id, courier, created_at, updated_at)
  VALUES (v_order_num, v_cust_id, 'neha.patel@example.com', 'Neha Patel', 54200, 'paid', 'out_for_delivery',
    '{"line1":"78, Harmony Tower","city":"Ahmedabad","state":"Gujarat","pincode":"380001"}'::jsonb,
    'TRACK-AHM-11223344', 'Delhivery',
    now() - interval '7 days', now() - interval '3 hours');

  SELECT id INTO v_order_id FROM orders WHERE order_number = v_order_num;

  INSERT INTO order_items (order_id, product_id, product_name, product_sku, quantity, unit_price, total_price)
  SELECT v_order_id, p.id, p.name, p.sku, 1, 54200, 54200
  FROM products p WHERE p.slug = 'eternal-mangalsutra';

  UPDATE customers SET total_orders = total_orders + 1, total_spent = total_spent + 54200 WHERE id = v_cust_id;
END $$;

-- Verify
SELECT 'Orders inserted:' AS info, COUNT(*) FROM orders WHERE order_number LIKE 'CM-2026-001%';
SELECT 'Order items inserted:' AS info, COUNT(*) FROM order_items
  WHERE order_id IN (SELECT id FROM orders WHERE order_number LIKE 'CM-2026-001%');
