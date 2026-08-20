-- Card label (admin-controlled product "eyebrow" line shown above the product
-- name on storefront cards, e.g. "FINE JEWELLERY · HANDCRAFTED").
--
-- When the label is NULL/blank the storefront renders no metadata line and
-- reserves no extra vertical space.
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS card_label TEXT;

COMMENT ON COLUMN products.card_label IS
  'Short uppercase metadata label shown on the storefront product card above the product name. Empty/NULL hides the line entirely.';

-- Backfill the previous storefront fallback ("<metal> · <stone>", e.g.
-- "FINE JEWELLERY · HANDCRAFTED") so existing cards keep their look until an
-- admin edits the label.
UPDATE products
SET card_label = TRIM(
    COALESCE(NULLIF(TRIM(material), ''), NULLIF(TRIM(gold_purity), ''), NULLIF(TRIM(metal_type), ''), 'Fine Jewellery')
    || ' · ' ||
    COALESCE(NULLIF(TRIM(gemstone), ''), 'Handcrafted')
  )
WHERE card_label IS NULL;