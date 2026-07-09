-- ============================================================
-- Creative Muse — Fix orders RLS Insert Policy
-- Run this in the Supabase Dashboard → SQL Editor
-- ============================================================
-- Relationship: orders.customer_id → customers.id → customers.auth_user_id → auth.users.id

-- Replace the permissive "Anyone can insert orders" policy
-- with an ownership-based policy using the actual column names.
DROP POLICY IF EXISTS "Anyone can insert orders" ON public.orders;

CREATE POLICY "Customers can insert own orders" ON public.orders
  FOR INSERT
  TO authenticated
  WITH CHECK (
    customer_id IN (
      SELECT id FROM public.customers WHERE auth_user_id = auth.uid()
    )
  );
