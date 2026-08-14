-- ============================================================
-- Hero Media (homepage hero carousel) — COMPLETE single file
-- Creates the hero_media table (with content fields), RLS
-- policies and the storage bucket.
--
-- Safe to run at any time:
--   * fresh install  -> creates the full table
--   * already exists -> adds any missing content columns
--
-- Requires the Storage extension (already enabled) and
-- public.has_admin_role() from schema.sql.
-- ============================================================

-- 1. HERO MEDIA TABLE (all columns)
CREATE TABLE IF NOT EXISTS public.hero_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT '',
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
  media_url TEXT NOT NULL,
  badge TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. CONTENT FIELDS (editable slide copy, CTAs, stats, product link)
--    If the table already existed without these, add them now.
ALTER TABLE public.hero_media
  ADD COLUMN IF NOT EXISTS title TEXT,
  ADD COLUMN IF NOT EXISTS highlight TEXT,
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS price TEXT,
  ADD COLUMN IF NOT EXISTS best_seller_label TEXT,
  ADD COLUMN IF NOT EXISTS primary_cta_text TEXT,
  ADD COLUMN IF NOT EXISTS primary_cta_link TEXT,
  ADD COLUMN IF NOT EXISTS secondary_cta_text TEXT,
  ADD COLUMN IF NOT EXISTS secondary_cta_link TEXT,
  ADD COLUMN IF NOT EXISTS product_id TEXT,
  ADD COLUMN IF NOT EXISTS stats JSONB;

ALTER TABLE public.hero_media ENABLE ROW LEVEL SECURITY;

-- Anyone can read active hero media
DROP POLICY IF EXISTS "Anyone can read active hero media" ON public.hero_media;
CREATE POLICY "Anyone can read active hero media" ON public.hero_media
  FOR SELECT USING (is_active = true OR public.has_admin_role());

-- Admins manage hero media
DROP POLICY IF EXISTS "Admins can insert hero media" ON public.hero_media;
CREATE POLICY "Admins can insert hero media" ON public.hero_media
  FOR INSERT WITH CHECK (public.has_admin_role());

DROP POLICY IF EXISTS "Admins can update hero media" ON public.hero_media;
CREATE POLICY "Admins can update hero media" ON public.hero_media
  FOR UPDATE USING (public.has_admin_role()) WITH CHECK (public.has_admin_role());

DROP POLICY IF EXISTS "Admins can delete hero media" ON public.hero_media;
CREATE POLICY "Admins can delete hero media" ON public.hero_media
  FOR DELETE USING (public.has_admin_role());

-- 3. STORAGE BUCKET FOR UPLOADS
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'hero-media', 'hero-media', true, 52428800,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm']
)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public read hero-media" ON storage.objects;
CREATE POLICY "Public read hero-media" ON storage.objects
  FOR SELECT USING (bucket_id = 'hero-media');

DROP POLICY IF EXISTS "Admin insert hero-media" ON storage.objects;
CREATE POLICY "Admin insert hero-media" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'hero-media' AND public.has_admin_role());

DROP POLICY IF EXISTS "Admin update hero-media" ON storage.objects;
CREATE POLICY "Admin update hero-media" ON storage.objects
  FOR UPDATE USING (bucket_id = 'hero-media' AND public.has_admin_role());

DROP POLICY IF EXISTS "Admin delete hero-media" ON storage.objects;
CREATE POLICY "Admin delete hero-media" ON storage.objects
  FOR DELETE USING (bucket_id = 'hero-media' AND public.has_admin_role());
