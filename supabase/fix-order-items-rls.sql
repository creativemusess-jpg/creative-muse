-- ============================================================
-- Creative Muse — Fix order_items RLS Policies
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Admin full access to order_items (reuse has_admin_role helper from schema.sql)
DROP POLICY IF EXISTS "Admin full access to order_items" ON order_items;
CREATE POLICY "Admin full access to order_items" ON order_items
  FOR ALL USING (public.has_admin_role())
  WITH CHECK (public.has_admin_role());

-- 2. Customers can read their own order items
DROP POLICY IF EXISTS "Customers can read own order items" ON order_items;
CREATE POLICY "Customers can read own order items" ON order_items
  FOR SELECT USING (
    order_id IN (
      SELECT id FROM orders
      WHERE customer_id IN (
        SELECT id FROM customers WHERE auth_user_id = auth.uid()
      )
    )
  );

-- 3. Anyone can insert order items (needed for checkout flow)
DROP POLICY IF EXISTS "Anyone can insert order items" ON order_items;
CREATE POLICY "Anyone can insert order items" ON order_items
  FOR INSERT WITH CHECK (true);
