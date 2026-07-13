-- Add auto-scroll configuration columns to homepage_sections table
-- These allow CMS-based control of carousel autoplay behavior per section

ALTER TABLE homepage_sections
  ADD COLUMN IF NOT EXISTS auto_scroll_enabled BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS scroll_direction TEXT NOT NULL DEFAULT 'left',
  ADD COLUMN IF NOT EXISTS scroll_speed REAL NOT NULL DEFAULT 30,
  ADD COLUMN IF NOT EXISTS pause_on_hover BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS auto_resume_enabled BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS auto_resume_delay_seconds INTEGER NOT NULL DEFAULT 3;

-- Add check constraint for valid scroll direction
ALTER TABLE homepage_sections
  DROP CONSTRAINT IF EXISTS homepage_sections_scroll_direction_check;

ALTER TABLE homepage_sections
  ADD CONSTRAINT homepage_sections_scroll_direction_check
  CHECK (scroll_direction IN ('left', 'right'));

-- Update existing carousel sections with sensible defaults
UPDATE homepage_sections
SET
  auto_scroll_enabled = true,
  scroll_direction = 'left',
  scroll_speed = 30,
  pause_on_hover = true,
  auto_resume_enabled = true,
  auto_resume_delay_seconds = 3
WHERE section_key IN ('new_arrivals');
