-- ============================================================
-- Hero Media Management (homepage hero carousel)
-- Run this in the Supabase SQL Editor (Database > SQL Editor).
-- Requires the Storage extension to be enabled (it already is).
-- ============================================================

-- 1. HERO MEDIA TABLE
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

ALTER TABLE public.hero_media ENABLE ROW LEVEL SECURITY;

-- Anyone can read active hero media
CREATE POLICY "Anyone can read active hero media" ON public.hero_media
  FOR SELECT USING (is_active = true OR public.has_admin_role());

-- Admins manage hero media
CREATE POLICY "Admins can insert hero media" ON public.hero_media
  FOR INSERT WITH CHECK (public.has_admin_role());

CREATE POLICY "Admins can update hero media" ON public.hero_media
  FOR UPDATE USING (public.has_admin_role()) WITH CHECK (public.has_admin_role());

CREATE POLICY "Admins can delete hero media" ON public.hero_media
  FOR DELETE USING (public.has_admin_role());

-- 2. STORAGE BUCKET FOR UPLOADS
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'hero-media', 'hero-media', true, 52428800,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read hero-media" ON storage.objects
  FOR SELECT USING (bucket_id = 'hero-media');

CREATE POLICY "Admin insert hero-media" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'hero-media' AND public.has_admin_role());

CREATE POLICY "Admin update hero-media" ON storage.objects
  FOR UPDATE USING (bucket_id = 'hero-media' AND public.has_admin_role());

CREATE POLICY "Admin delete hero-media" ON storage.objects
  FOR DELETE USING (bucket_id = 'hero-media' AND public.has_admin_role());
