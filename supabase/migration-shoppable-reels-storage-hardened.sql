-- ============================================================
-- Shoppable Reels — hardened, idempotent storage + RLS migration
-- ------------------------------------------------------------
-- Fixes: "new row violates row-level security policy" when an
-- admin uploads a reel video to the `reel-videos` bucket.
--
-- Root cause: the bucket and its storage.objects policies were
-- defined in prior migration files that may not have been applied
-- to the live Supabase project (or were later removed). With RLS
-- enabled on storage.objects but no matching INSERT policy, every
-- upload is rejected with the RLS error above.
--
-- This file is SAFE to run multiple times. It:
--   * recreates has_admin_role() with a strict search_path + grants
--   * upserts the reel-videos bucket
--   * recreates storage policies (public read, admin write) so they
--     exist regardless of prior state
--   * recreates shoppable_reels table + RLS + grants
--
-- Security model (NO RLS disabled, NO anonymous writes):
--   PUBLIC  -> SELECT on published reels + read bucket objects
--   ADMIN   -> INSERT/UPDATE/DELETE (gated by has_admin_role())
-- ============================================================

BEGIN;

-- ------------------------------------------------------------
-- 1. Admin helper (strict search_path, explicit grants)
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.has_admin_role(required_role TEXT DEFAULT NULL)
RETURNS BOOLEAN AS $$
DECLARE
  has_role BOOLEAN;
BEGIN
  IF required_role IS NULL THEN
    SELECT EXISTS (
      SELECT 1 FROM public.admin_role_assignments ara
      JOIN public.admin_roles ar ON ara.role_id = ar.id
      WHERE ara.user_id = auth.uid()
    ) INTO has_role;
  ELSE
    SELECT EXISTS (
      SELECT 1 FROM public.admin_role_assignments ara
      JOIN public.admin_roles ar ON ara.role_id = ar.id
      WHERE ara.user_id = auth.uid() AND ar.name = required_role
    ) INTO has_role;
  END IF;
  RETURN COALESCE(has_role, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

REVOKE ALL ON FUNCTION public.has_admin_role(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_admin_role(text) TO anon, authenticated, service_role;

-- ------------------------------------------------------------
-- 2. reel-videos bucket
-- ------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'reel-videos',
  'reel-videos',
  true,
  52428800,
  ARRAY['video/mp4', 'video/webm', 'video/quicktime', 'image/jpeg', 'image/png']
)
ON CONFLICT (id) DO UPDATE
SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ------------------------------------------------------------
-- 3. reel-videos storage policies (recreate to guarantee state)
-- ------------------------------------------------------------
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

-- ------------------------------------------------------------
-- 4. shoppable_reels table + RLS
-- ------------------------------------------------------------
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

COMMIT;