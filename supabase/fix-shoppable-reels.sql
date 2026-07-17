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
  FOR ALL USING (
    auth.uid() IN (
      SELECT user_id FROM admin_role_assignments
    )
  );

INSERT INTO storage.buckets (id, name, public)
VALUES ('reel-videos', 'reel-videos', true)
ON CONFLICT (id) DO NOTHING;
