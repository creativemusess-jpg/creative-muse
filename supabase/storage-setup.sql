-- Run this in Supabase SQL Editor to create storage buckets for product images
-- Requires the Storage extension to be enabled

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('product-images', 'product-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  ('product-360-images', 'product-360-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('category-images', 'category-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
ON CONFLICT (id) DO NOTHING;

-- Storage policies: Public can read
CREATE POLICY "Public read product-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

CREATE POLICY "Public read product-360-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-360-images');

CREATE POLICY "Public read category-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'category-images');

-- Storage policies: Admins can upload/update/delete
CREATE POLICY "Admin insert product-images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images' AND public.has_admin_role());

CREATE POLICY "Admin update product-images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'product-images' AND public.has_admin_role());

CREATE POLICY "Admin delete product-images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-images' AND public.has_admin_role());

CREATE POLICY "Admin insert product-360-images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-360-images' AND public.has_admin_role());

CREATE POLICY "Admin update product-360-images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'product-360-images' AND public.has_admin_role());

CREATE POLICY "Admin delete product-360-images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-360-images' AND public.has_admin_role());

CREATE POLICY "Admin insert category-images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'category-images' AND public.has_admin_role());

CREATE POLICY "Admin update category-images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'category-images' AND public.has_admin_role());

CREATE POLICY "Admin delete category-images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'category-images' AND public.has_admin_role());
