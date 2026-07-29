-- ============================================================
-- Shoppable Reels — table + RLS + storage bucket
-- ============================================================

CREATE TABLE IF NOT EXISTS shoppable_reels (
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

ALTER TABLE shoppable_reels ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read active shoppable reels" ON shoppable_reels;
CREATE POLICY "Anyone can read active shoppable reels" ON shoppable_reels
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admin full access to shoppable reels" ON shoppable_reels;
CREATE POLICY "Admin full access to shoppable reels" ON shoppable_reels
  FOR ALL TO authenticated
  USING (public.has_admin_role())
  WITH CHECK (public.has_admin_role());

GRANT SELECT ON shoppable_reels TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON shoppable_reels TO authenticated;

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
