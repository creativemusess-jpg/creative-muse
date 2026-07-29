-- Attach generated Creative Muse hero videos to category pages.
-- These files live in public/category-videos and will be served by the app.

UPDATE categories
SET
  hero_video = '/category-videos/earrings-hero.mp4',
  cta_button_text = COALESCE(cta_button_text, 'View Collection'),
  cta_link = COALESCE(cta_link, '#products')
WHERE slug = 'earrings';

UPDATE categories
SET
  hero_video = '/category-videos/necklace-hero.mp4',
  cta_button_text = COALESCE(cta_button_text, 'View Collection'),
  cta_link = COALESCE(cta_link, '#products')
WHERE slug = 'necklace';

UPDATE categories
SET
  hero_video = '/category-videos/necklaces-hero.mp4',
  cta_button_text = COALESCE(cta_button_text, 'View Collection'),
  cta_link = COALESCE(cta_link, '#products')
WHERE slug = 'necklaces';

UPDATE categories
SET
  hero_video = '/category-videos/rings-hero.mp4',
  cta_button_text = COALESCE(cta_button_text, 'View Collection'),
  cta_link = COALESCE(cta_link, '#products')
WHERE slug = 'rings';

UPDATE categories
SET
  hero_video = '/category-videos/hoops-hero.mp4',
  cta_button_text = COALESCE(cta_button_text, 'View Collection'),
  cta_link = COALESCE(cta_link, '#products')
WHERE slug = 'hoops';

UPDATE categories
SET
  hero_video = '/category-videos/earcuffs-hero.mp4',
  cta_button_text = COALESCE(cta_button_text, 'View Collection'),
  cta_link = COALESCE(cta_link, '#products')
WHERE slug = 'earcuffs';

UPDATE categories
SET
  hero_video = '/category-videos/kada-hero.mp4',
  cta_button_text = COALESCE(cta_button_text, 'View Collection'),
  cta_link = COALESCE(cta_link, '#products')
WHERE slug = 'kada';

UPDATE categories
SET
  hero_video = '/category-videos/bracelets-hero.mp4',
  cta_button_text = COALESCE(cta_button_text, 'View Collection'),
  cta_link = COALESCE(cta_link, '#products')
WHERE slug = 'bracelets';
