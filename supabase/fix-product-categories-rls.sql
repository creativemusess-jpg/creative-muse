-- Fix: Add missing RLS policies for product_categories and product_collections junction tables
-- Run this in Supabase SQL Editor

-- Product categories: allow admin full access
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'product_categories'
      AND policyname = 'Admin full access to product_categories'
  ) THEN
    CREATE POLICY "Admin full access to product_categories" ON public.product_categories
      FOR ALL USING (public.has_admin_role())
      WITH CHECK (public.has_admin_role());
  END IF;
END $$;

-- Product collections: allow admin full access
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'product_collections'
      AND policyname = 'Admin full access to product_collections'
  ) THEN
    CREATE POLICY "Admin full access to product_collections" ON public.product_collections
      FOR ALL USING (public.has_admin_role())
      WITH CHECK (public.has_admin_role());
  END IF;
END $$;

-- Verify
SELECT schemaname, tablename, policyname, permissive, cmd
FROM pg_policies
WHERE tablename IN ('product_categories', 'product_collections')
ORDER BY tablename, cmd;
