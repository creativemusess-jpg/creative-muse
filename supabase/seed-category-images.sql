-- Idempotent migration: populate missing category images
-- Run this in Supabase SQL Editor after the category-images bucket has images uploaded

DO $$
DECLARE
  cat RECORD;
  url TEXT;
BEGIN
  FOR cat IN SELECT * FROM categories LOOP
    IF cat.image IS NULL OR TRIM(cat.image) = '' THEN
      url := 'https://qsbywhfaoajhspytgmbc.supabase.co/storage/v1/object/public/category-images/categories/'
             || cat.slug || '.png';
      UPDATE categories
        SET image = url,
            updated_at = NOW()
        WHERE id = cat.id;
      RAISE NOTICE 'Set image for %: %', cat.slug, url;
    ELSE
      RAISE NOTICE 'Skipped %: image already set', cat.slug;
    END IF;
  END LOOP;
END $$;

-- Verify
SELECT slug, name, image IS NOT NULL AS has_image FROM categories ORDER BY sort_order;
