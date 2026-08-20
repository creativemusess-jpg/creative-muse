-- ============================================================
-- Homepage banner button positions
-- Adds percentage-based X/Y fields so the SHOP NOW button on
-- each banner can be positioned independently for desktop /
-- tablet (shared) and mobile via the admin drag-and-drop editor.
--
-- Safe to run at any time (idempotent). Columns default to the
-- existing centred-bottom placement (X 50%, Y 82%).
-- ============================================================

ALTER TABLE public.homepage_banners
  ADD COLUMN IF NOT EXISTS button_position_x NUMERIC(5,2) NOT NULL DEFAULT 50,
  ADD COLUMN IF NOT EXISTS button_position_y NUMERIC(5,2) NOT NULL DEFAULT 82,
  ADD COLUMN IF NOT EXISTS button_position_mobile_x NUMERIC(5,2) NOT NULL DEFAULT 50,
  ADD COLUMN IF NOT EXISTS button_position_mobile_y NUMERIC(5,2) NOT NULL DEFAULT 82;