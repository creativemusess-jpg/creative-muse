-- ============================================================
-- Checkout gift fields + Shoppable Reels admin upload policies
-- ============================================================

-- Checkout inserts these fields during payment. Keep this migration
-- idempotent so older Supabase projects can be brought up to date safely.
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS checkout_attempt_id TEXT,
  ADD COLUMN IF NOT EXISTS customer_phone TEXT,
  ADD COLUMN IF NOT EXISTS delivery_address JSONB,
  ADD COLUMN IF NOT EXISTS delivery_method TEXT,
  ADD COLUMN IF NOT EXISTS delivery_state_code TEXT,
  ADD COLUMN IF NOT EXISTS delivery_city TEXT,
  ADD COLUMN IF NOT EXISTS delivery_district TEXT,
  ADD COLUMN IF NOT EXISTS delivery_pincode TEXT,
  ADD COLUMN IF NOT EXISTS delivery_locality TEXT,
  ADD COLUMN IF NOT EXISTS delivery_country_code TEXT NOT NULL DEFAULT 'IN',
  ADD COLUMN IF NOT EXISTS subtotal DECIMAL(12,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS shipping_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tax_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tax_snapshot JSONB,
  ADD COLUMN IF NOT EXISTS payment_method TEXT,
  ADD COLUMN IF NOT EXISTS gift_packaging_enabled BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS gift_packaging_price DECIMAL(12,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS gift_packaging_name TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS gift_message TEXT NOT NULL DEFAULT '';

CREATE UNIQUE INDEX IF NOT EXISTS orders_checkout_attempt_id_key
  ON public.orders(checkout_attempt_id)
  WHERE checkout_attempt_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS public.shoppable_reels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_url TEXT NOT NULL,
  poster_url TEXT,
  product_id TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  alt_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_shoppable_reels_active_sort
  ON public.shoppable_reels(is_active, sort_order);
CREATE INDEX IF NOT EXISTS idx_shoppable_reels_product
  ON public.shoppable_reels(product_id);

ALTER TABLE public.shoppable_reels ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read active shoppable reels" ON public.shoppable_reels;
CREATE POLICY "Anyone can read active shoppable reels" ON public.shoppable_reels
  FOR SELECT TO public
  USING (is_active = true);

DROP POLICY IF EXISTS "Admin full access to shoppable reels" ON public.shoppable_reels;
CREATE POLICY "Admin full access to shoppable reels" ON public.shoppable_reels
  FOR ALL TO authenticated
  USING (public.has_admin_role())
  WITH CHECK (public.has_admin_role());

GRANT SELECT ON public.shoppable_reels TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.shoppable_reels TO authenticated;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'reel-videos',
  'reel-videos',
  true,
  52428800,
  ARRAY['video/mp4', 'video/webm', 'video/quicktime']
)
ON CONFLICT (id) DO UPDATE
SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Public read reel-videos" ON storage.objects;
CREATE POLICY "Public read reel-videos" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'reel-videos');

DROP POLICY IF EXISTS "Admin insert reel-videos" ON storage.objects;
CREATE POLICY "Admin insert reel-videos" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'reel-videos' AND public.has_admin_role());

DROP POLICY IF EXISTS "Admin update reel-videos" ON storage.objects;
CREATE POLICY "Admin update reel-videos" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'reel-videos' AND public.has_admin_role())
  WITH CHECK (bucket_id = 'reel-videos' AND public.has_admin_role());

DROP POLICY IF EXISTS "Admin delete reel-videos" ON storage.objects;
CREATE POLICY "Admin delete reel-videos" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'reel-videos' AND public.has_admin_role());
