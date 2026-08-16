-- ============================================================
-- Product publishing & archive system (Creative Muse)
-- Idempotent — safe to run multiple times.
-- Run in the Supabase SQL editor.
-- ============================================================

-- 1. Scheduled publishing.
--    A product is publicly visible only when:
--      status = 'active' AND (publish_at IS NULL OR publish_at <= now())
--    publish_at = NULL means "no scheduling restriction" (backward compatible).
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS publish_at TIMESTAMPTZ;

-- 2. Archive metadata (mirrors the orders archive pattern).
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS archived_by UUID REFERENCES public.profiles(id);

-- 3. Index so the visibility predicate stays cheap as the catalog grows.
CREATE INDEX IF NOT EXISTS idx_products_status_publish_at
  ON public.products(status, publish_at);

-- 4. RLS: public/customer reads must honour the time-based visibility rule.
DROP POLICY IF EXISTS "Anyone can read active products" ON public.products;
CREATE POLICY "Anyone can read active products" ON public.products
  FOR SELECT USING (
    status = 'active'
    AND (publish_at IS NULL OR publish_at <= now())
  );

-- 4b. Child/junction read policies gate on the parent's visibility too, so a
--     future-scheduled product's id never leaks through category/collection/360 joins.
DROP POLICY IF EXISTS public_read_active_product_categories ON public.product_categories;
CREATE POLICY public_read_active_product_categories ON public.product_categories
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.id = product_categories.product_id
        AND p.status = 'active'
        AND (p.publish_at IS NULL OR p.publish_at <= now())
    )
  );

DROP POLICY IF EXISTS public_read_active_product_collections ON public.product_collections;
CREATE POLICY public_read_active_product_collections ON public.product_collections
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.id = product_collections.product_id
        AND p.status = 'active'
        AND (p.publish_at IS NULL OR p.publish_at <= now())
    )
  );

DROP POLICY IF EXISTS public_read_active_product_360_images ON public.product_360_images;
CREATE POLICY public_read_active_product_360_images ON public.product_360_images
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.id = product_360_images.product_id
        AND p.status = 'active'
        AND (p.publish_at IS NULL OR p.publish_at <= now())
    )
  );