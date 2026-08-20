-- Homepage banners: image crop/focus position (object-position), stored as
-- percentages of the banner frame (0-100). The hero frame keeps a FIXED
-- responsive aspect ratio on the website; these values control which part of
-- the uploaded image is visible inside that frame via CSS object-position.
ALTER TABLE public.homepage_banners
  ADD COLUMN IF NOT EXISTS object_position_x NUMERIC(5,2) NOT NULL DEFAULT 50,
  ADD COLUMN IF NOT EXISTS object_position_y NUMERIC(5,2) NOT NULL DEFAULT 50;