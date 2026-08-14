-- ============================================================
-- Hero Media Content Fields (UPGRADE ONLY)
--
-- NOTE: supabase/migration-hero-media.sql now contains the full
-- table INCLUDING these columns. Run that file instead.
--
-- This file exists only for databases where the original
-- migration-hero-media.sql was already applied without the
-- content fields. It is idempotent (safe to run anytime).
-- ============================================================

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
