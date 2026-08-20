-- ============================================================
-- Homepage Promotional Banners
-- Creates the homepage_banners table, RLS policies and the
-- storage bucket used for banner image uploads.
--
-- Safe to run at any time (idempotent).
--
-- Requires the Storage extension (already enabled) and
-- public.has_admin_role() from schema.sql.
-- ============================================================

-- 1. HOMEPAGE BANNERS TABLE
CREATE TABLE IF NOT EXISTS public.homepage_banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT '',
  desktop_image TEXT NOT NULL DEFAULT '',
  tablet_image TEXT,
  mobile_image TEXT,
  button_enabled BOOLEAN NOT NULL DEFAULT false,
  button_text TEXT,
  button_url TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  display_order INT NOT NULL DEFAULT 0,
  alt_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.homepage_banners ENABLE ROW LEVEL SECURITY;

-- Anyone can read active banners; admins can see everything
DROP POLICY IF EXISTS "Anyone can read active homepage banners" ON public.homepage_banners;
CREATE POLICY "Anyone can read active homepage banners" ON public.homepage_banners
  FOR SELECT USING (status = 'active' OR public.has_admin_role());

-- Admins manage banners
DROP POLICY IF EXISTS "Admins can insert homepage banners" ON public.homepage_banners;
CREATE POLICY "Admins can insert homepage banners" ON public.homepage_banners
  FOR INSERT WITH CHECK (public.has_admin_role());

DROP POLICY IF EXISTS "Admins can update homepage banners" ON public.homepage_banners;
CREATE POLICY "Admins can update homepage banners" ON public.homepage_banners
  FOR UPDATE USING (public.has_admin_role()) WITH CHECK (public.has_admin_role());

DROP POLICY IF EXISTS "Admins can delete homepage banners" ON public.homepage_banners;
CREATE POLICY "Admins can delete homepage banners" ON public.homepage_banners
  FOR DELETE USING (public.has_admin_role());

-- 2. STORAGE BUCKET FOR BANNER UPLOADS
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'homepage-banners', 'homepage-banners', true, 52428800,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public read homepage-banners" ON storage.objects;
CREATE POLICY "Public read homepage-banners" ON storage.objects
  FOR SELECT USING (bucket_id = 'homepage-banners');

DROP POLICY IF EXISTS "Admin insert homepage-banners" ON storage.objects;
CREATE POLICY "Admin insert homepage-banners" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'homepage-banners' AND public.has_admin_role());

DROP POLICY IF EXISTS "Admin update homepage-banners" ON storage.objects;
CREATE POLICY "Admin update homepage-banners" ON storage.objects
  FOR UPDATE USING (bucket_id = 'homepage-banners' AND public.has_admin_role());

DROP POLICY IF EXISTS "Admin delete homepage-banners" ON storage.objects;
CREATE POLICY "Admin delete homepage-banners" ON storage.objects
  FOR DELETE USING (bucket_id = 'homepage-banners' AND public.has_admin_role());
