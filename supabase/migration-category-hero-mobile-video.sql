-- Category hero media: mobile video support + storage setup.
-- Idempotent. Run in the Supabase SQL Editor.

-- Mobile hero video column (desktop video stays in hero_video).
ALTER TABLE categories ADD COLUMN IF NOT EXISTS hero_video_mobile TEXT;

-- Ensure the category-videos bucket exists (video media for hero sliders).
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'category-videos',
  'category-videos',
  true,
  52428800,
  ARRAY['video/mp4', 'video/webm', 'video/quicktime']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: public read, admin write (uses has_admin_role() from schema.sql).
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

-- Verify
SELECT slug,
       hero_image,
       hero_video,
       hero_video_mobile,
       mobile_banner,
       desktop_banner
FROM categories
ORDER BY sort_order;