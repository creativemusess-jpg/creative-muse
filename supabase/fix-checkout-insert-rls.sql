-- ============================================================
-- Creative Muse - Fix checkout insert RLS ownership
-- Run this in the Supabase Dashboard -> SQL Editor
-- ============================================================

DROP POLICY IF EXISTS "Service can insert payments" ON public.payments;
DROP POLICY IF EXISTS "Customers can insert own payments" ON public.payments;
CREATE POLICY "Customers can insert own payments" ON public.payments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    customer_id IN (
      SELECT id FROM public.customers WHERE auth_user_id = auth.uid()
    )
    AND order_id IN (
      SELECT id FROM public.orders
      WHERE customer_id IN (
        SELECT id FROM public.customers WHERE auth_user_id = auth.uid()
      )
    )
    AND status = 'pending'
  );

DROP POLICY IF EXISTS "Service can insert coupon usage" ON public.coupon_usage;
DROP POLICY IF EXISTS "Customers can insert own coupon usage" ON public.coupon_usage;
CREATE POLICY "Customers can insert own coupon usage" ON public.coupon_usage
  FOR INSERT
  TO authenticated
  WITH CHECK (
    customer_id IN (
      SELECT id FROM public.customers WHERE auth_user_id = auth.uid()
    )
    AND order_id IN (
      SELECT id FROM public.orders
      WHERE customer_id IN (
        SELECT id FROM public.customers WHERE auth_user_id = auth.uid()
      )
    )
  );

DROP POLICY IF EXISTS "Anyone can insert order items" ON public.order_items;
DROP POLICY IF EXISTS "Customers can insert own order items" ON public.order_items;
CREATE POLICY "Customers can insert own order items" ON public.order_items
  FOR INSERT
  TO authenticated
  WITH CHECK (
    order_id IN (
      SELECT id FROM public.orders
      WHERE customer_id IN (
        SELECT id FROM public.customers WHERE auth_user_id = auth.uid()
      )
    )
  );
