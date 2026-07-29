-- Category hero/banner CMS fields and video storage.
-- Run in Supabase SQL Editor or include in your migration workflow.

ALTER TABLE categories ADD COLUMN IF NOT EXISTS hero_image TEXT;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS hero_video TEXT;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS banner_heading TEXT;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS banner_description TEXT;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS cta_button_text TEXT;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS cta_link TEXT;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS mobile_banner TEXT;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS desktop_banner TEXT;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'category-videos',
  'category-videos',
  true,
  52428800,
  ARRAY['video/mp4', 'video/webm', 'video/quicktime']
)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public read category-videos" ON storage.objects;
CREATE POLICY "Public read category-videos" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'category-videos');

DROP POLICY IF EXISTS "Admin insert category-videos" ON storage.objects;
CREATE POLICY "Admin insert category-videos" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'category-videos' AND public.has_admin_role());

DROP POLICY IF EXISTS "Admin update category-videos" ON storage.objects;
CREATE POLICY "Admin update category-videos" ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'category-videos' AND public.has_admin_role())
  WITH CHECK (bucket_id = 'category-videos' AND public.has_admin_role());

DROP POLICY IF EXISTS "Admin delete category-videos" ON storage.objects;
CREATE POLICY "Admin delete category-videos" ON storage.objects
  FOR DELETE
  USING (bucket_id = 'category-videos' AND public.has_admin_role());
