-- ============================================================
-- FIX: Reel poster auto-capture fails with HTTP 400
-- ------------------------------------------------------------
-- Cause: the live `reel-videos` bucket only allows video mime
-- types, so the JPEG poster upload is rejected (400).
-- Fix: append image/jpeg + image/png to the bucket's
-- allowed_mime_types (keeps every existing type).
--
-- Safe to run multiple times. Run in: Supabase > SQL Editor
-- ============================================================

UPDATE storage.buckets
SET allowed_mime_types = (
  SELECT ARRAY(SELECT DISTINCT unnest(allowed_mime_types || ARRAY['image/jpeg', 'image/png']))
)
WHERE id = 'reel-videos';

-- Verify (should list image/jpeg and image/png):
SELECT id, allowed_mime_types, file_size_limit
FROM storage.buckets
WHERE id = 'reel-videos';
