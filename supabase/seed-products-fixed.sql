-- CORRECTED SEED: Insert all 8 existing products into Supabase
-- Run this in the Supabase SQL Editor (single execution)

-- First verify categories exist
SELECT 'categories count: ' || COUNT(*)::text FROM categories;

-- ============================================================
-- INSERTS (using slug-based category lookup)
-- ============================================================

-- 1. Aarav Solitaire Ring
INSERT INTO products (name, slug, sku, short_description, full_description, current_price, original_price, discount_percentage, badge, status, stock_quantity, material, metal_type, metal_colour, gold_purity, gross_weight, gemstone, certification_type, rating_average, review_count, best_seller, featured, tags, published_at)
SELECT 'Aarav Solitaire Ring', 'aarav-solitaire', 'CM-RG-AARAV-018',
  'A brilliant round solitaire set in a whisper-thin 18K gold band.',
  'The Aarav solitaire is hand-set in our Vadodara atelier with a VS-clarity brilliant round diamond, cradled in a four-prong 18K yellow gold setting engineered for everyday wear.',
  48500, 62000, ROUND(((62000-48500)/62000.0)*100), 'Best Seller', 'active', 10,
  '18K Gold', 'Gold', 'Yellow Gold', '18K (750)', '3.2 g (approx.)', 'Diamond',
  'BIS Hallmark · IGI Diamond Certificate', 4.9, 218, true, true,
  ARRAY['ring', 'solitaire', 'bridal', 'engagement', 'diamond', 'aarav'], now()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'aarav-solitaire');

INSERT INTO product_categories (product_id, category_id)
SELECT p.id, c.id FROM products p, categories c WHERE p.slug = 'aarav-solitaire' AND c.slug = 'rings'
ON CONFLICT DO NOTHING;

INSERT INTO product_collections (product_id, collection_id)
SELECT p.id, c.id FROM products p, collections c WHERE p.slug = 'aarav-solitaire' AND c.slug = 'solitaire-classics'
ON CONFLICT DO NOTHING;

-- 2. Celestia Drop Earrings
INSERT INTO products (name, slug, sku, short_description, full_description, current_price, original_price, discount_percentage, badge, status, stock_quantity, material, metal_type, metal_colour, gold_purity, gross_weight, gemstone, certification_type, rating_average, review_count, new_arrival, featured, tags, published_at)
SELECT 'Celestia Drop Earrings', 'celestia-drop', 'CM-EA-CELESTIA-018',
  'Freshwater pearl drops on a delicate 18K white gold hook.',
  'Luminous freshwater pearls suspended from a whisper-fine 18K white gold hook — an effortless piece that moves beautifully from day into evening.',
  22800, 28000, ROUND(((28000-22800)/28000.0)*100), 'New', 'active', 15,
  'White Gold', 'Gold', 'White Gold', '18K (750)', '2.6 g (pair)', 'Pearl',
  'BIS Hallmark', 4.8, 94, true, true,
  ARRAY['earrings', 'pearl', 'white gold', 'drop earrings', 'occasion'], now()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'celestia-drop');

INSERT INTO product_categories (product_id, category_id)
SELECT p.id, c.id FROM products p, categories c WHERE p.slug = 'celestia-drop' AND c.slug = 'earrings'
ON CONFLICT DO NOTHING;

INSERT INTO product_collections (product_id, collection_id)
SELECT p.id, c.id FROM products p, collections c WHERE p.slug = 'celestia-drop' AND c.slug = 'pearl-edit'
ON CONFLICT DO NOTHING;

-- 3. Serene Diamond Bracelet
INSERT INTO products (name, slug, sku, short_description, full_description, current_price, original_price, discount_percentage, badge, status, stock_quantity, material, metal_type, metal_colour, gold_purity, gross_weight, gemstone, certification_type, rating_average, review_count, trending, featured, tags, published_at)
SELECT 'Serene Diamond Bracelet', 'serene-bracelet', 'CM-BR-SERENE-950',
  'A tennis-inspired platinum line set with F/VS diamonds.',
  'Each stone in the Serene bracelet is prong-set in 950 platinum and matched for colour and clarity, giving a continuous river of brilliance around the wrist.',
  67500, 82000, ROUND(((82000-67500)/82000.0)*100), 'Trending', 'active', 4,
  'Platinum', 'Platinum', 'Platinum', 'PT 950', '8.4 g', 'Diamond',
  'PGI Platinum · IGI Diamond Certificate', 5.0, 156, true, true,
  ARRAY['bracelet', 'diamond', 'platinum', 'tennis', 'gift'], now()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'serene-bracelet');

INSERT INTO product_categories (product_id, category_id)
SELECT p.id, c.id FROM products p, categories c WHERE p.slug = 'serene-bracelet' AND c.slug = 'bracelets'
ON CONFLICT DO NOTHING;

INSERT INTO product_collections (product_id, collection_id)
SELECT p.id, c.id FROM products p, collections c WHERE p.slug = 'serene-bracelet' AND c.slug = 'diamond-essentials'
ON CONFLICT DO NOTHING;

-- 4. Priya Kundan Necklace
INSERT INTO products (name, slug, sku, short_description, full_description, current_price, original_price, discount_percentage, badge, status, stock_quantity, material, metal_type, metal_colour, gold_purity, gross_weight, gemstone, certification_type, rating_average, review_count, wedding, featured, tags, published_at)
SELECT 'Priya Kundan Necklace', 'priya-kundan', 'CM-NK-PRIYA-022',
  'Traditional uncut kundan set in 22K gold, finished with meenakari on the reverse.',
  'The Priya necklace pairs uncut kundan stones with hand-painted meenakari on the reverse — a heritage bridal silhouette crafted in the Jaipur tradition.',
  38900, 48000, ROUND(((48000-38900)/48000.0)*100), 'Wedding', 'active', 8,
  '22K Gold', 'Gold', 'Yellow Gold', '22K (916)', '32.5 g', 'Kundan',
  'BIS Hallmark', 4.9, 312, true, true,
  ARRAY['necklace', 'kundan', 'bridal', 'wedding', 'traditional'], now()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'priya-kundan');

INSERT INTO product_categories (product_id, category_id)
SELECT p.id, c.id FROM products p, categories c WHERE p.slug = 'priya-kundan' AND c.slug = 'necklaces'
ON CONFLICT DO NOTHING;

INSERT INTO product_collections (product_id, collection_id)
SELECT p.id, c.id FROM products p, collections c WHERE p.slug = 'priya-kundan' AND c.slug = 'bridal-heritage'
ON CONFLICT DO NOTHING;

-- 5. Luna Crescent Pendant
INSERT INTO products (name, slug, sku, short_description, full_description, current_price, original_price, discount_percentage, badge, status, stock_quantity, material, metal_type, metal_colour, gold_purity, gross_weight, gemstone, certification_type, rating_average, review_count, new_arrival, featured, tags, published_at)
SELECT 'Luna Crescent Pendant', 'luna-crescent', 'CM-PD-LUNA-014',
  'A crescent silhouette in 14K rose gold, tipped with a Burmese ruby.',
  'The Luna pendant is a modern take on the crescent motif — cast in 14K rose gold with a single Burmese ruby set at the tip. Includes a matching 45cm rose gold chain.',
  15600, 19800, ROUND(((19800-15600)/19800.0)*100), 'New', 'active', 20,
  '14K Gold', 'Gold', 'Rose Gold', '14K (585)', '1.9 g', 'Ruby',
  'BIS Hallmark', 4.7, 67, true, true,
  ARRAY['pendant', 'ruby', 'rose gold', 'crescent', 'gift'], now()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'luna-crescent');

INSERT INTO product_categories (product_id, category_id)
SELECT p.id, c.id FROM products p, categories c WHERE p.slug = 'luna-crescent' AND c.slug = 'pendants'
ON CONFLICT DO NOTHING;

INSERT INTO product_collections (product_id, collection_id)
SELECT p.id, c.id FROM products p, collections c WHERE p.slug = 'luna-crescent' AND c.slug = 'everyday-muse'
ON CONFLICT DO NOTHING;

-- 6. Eternal Mangalsutra
INSERT INTO products (name, slug, sku, short_description, full_description, current_price, original_price, discount_percentage, badge, status, stock_quantity, material, metal_type, metal_colour, gold_purity, gross_weight, gemstone, certification_type, rating_average, review_count, best_seller, featured, tags, published_at)
SELECT 'Eternal Mangalsutra', 'eternal-mangalsutra', 'CM-MS-ETERNAL-022',
  'Twin-vati mangalsutra with a diamond-set pendant and 22K black-bead chain.',
  'A contemporary mangalsutra with two 22K gold vatis and a central diamond cluster, strung on a traditional black-bead chain — a piece designed to be worn every day.',
  54200, 68000, ROUND(((68000-54200)/68000.0)*100), 'Best Seller', 'active', 12,
  '22K Gold', 'Gold', 'Yellow Gold', '22K (916)', '12.4 g', 'Diamond',
  'BIS Hallmark · IGI Diamond Certificate', 5.0, 445, true, true,
  ARRAY['mangalsutra', 'diamond', 'bridal', 'black beads', 'daily wear'], now()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'eternal-mangalsutra');

INSERT INTO product_categories (product_id, category_id)
SELECT p.id, c.id FROM products p, categories c WHERE p.slug = 'eternal-mangalsutra' AND c.slug = 'mangalsutra'
ON CONFLICT DO NOTHING;

INSERT INTO product_collections (product_id, collection_id)
SELECT p.id, c.id FROM products p, collections c WHERE p.slug = 'eternal-mangalsutra' AND c.slug = 'forever-vows'
ON CONFLICT DO NOTHING;

-- 7. Meera Jhumka Earrings
INSERT INTO products (name, slug, sku, short_description, full_description, current_price, original_price, discount_percentage, badge, status, stock_quantity, material, metal_type, metal_colour, gold_purity, gross_weight, gemstone, certification_type, rating_average, review_count, trending, featured, tags, published_at)
SELECT 'Meera Jhumka Earrings', 'meera-jhumka', 'CM-EA-MEERA-022',
  'Bell-shaped jhumkas in 22K gold with emerald drops and pearl fringe.',
  'Hand-crafted 22K gold jhumkas with cabochon emeralds and a delicate freshwater pearl fringe — rooted in temple jewellery traditions of southern India.',
  18400, 23500, ROUND(((23500-18400)/23500.0)*100), 'Trending', 'active', 10,
  '22K Gold', 'Gold', 'Yellow Gold', '22K (916)', '9.1 g (pair)', 'Emerald',
  'BIS Hallmark', 4.8, 189, true, true,
  ARRAY['earrings', 'jhumka', 'emerald', 'pearl', 'traditional'], now()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'meera-jhumka');

INSERT INTO product_categories (product_id, category_id)
SELECT p.id, c.id FROM products p, categories c WHERE p.slug = 'meera-jhumka' AND c.slug = 'earrings'
ON CONFLICT DO NOTHING;

INSERT INTO product_collections (product_id, collection_id)
SELECT p.id, c.id FROM products p, collections c WHERE p.slug = 'meera-jhumka' AND c.slug = 'temple-treasures'
ON CONFLICT DO NOTHING;

-- 8. Royal Polki Choker
INSERT INTO products (name, slug, sku, short_description, full_description, current_price, original_price, discount_percentage, badge, status, stock_quantity, material, metal_type, metal_colour, gold_purity, gross_weight, gemstone, certification_type, rating_average, review_count, wedding, featured, tags, published_at)
SELECT 'Royal Polki Choker', 'royal-polki', 'CM-NK-ROYAL-022',
  'Uncut polki choker in 22K gold, finished with a South Sea pearl fringe.',
  'The Royal Polki choker is set with uncut polki diamonds in 22K gold, closed at the back with an adjustable dori and finished with a South Sea pearl fringe — a statement bridal heirloom.',
  92000, 115000, ROUND(((115000-92000)/115000.0)*100), 'Wedding', 'active', 3,
  '22K Gold', 'Gold', 'Yellow Gold', '22K (916)', '48.6 g', 'Polki',
  'BIS Hallmark', 4.9, 78, true, true,
  ARRAY['choker', 'polki', 'kundan', 'bridal', 'wedding', 'pearl'], now()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'royal-polki');

INSERT INTO product_categories (product_id, category_id)
SELECT p.id, c.id FROM products p, categories c WHERE p.slug = 'royal-polki' AND c.slug = 'necklaces'
ON CONFLICT DO NOTHING;

INSERT INTO product_collections (product_id, collection_id)
SELECT p.id, c.id FROM products p, collections c WHERE p.slug = 'royal-polki' AND c.slug = 'bridal-heritage'
ON CONFLICT DO NOTHING;

-- ============================================================
-- VERIFICATION
-- ============================================================
SELECT '=== VERIFICATION ===' as verification;
SELECT COUNT(*) || ' products inserted' FROM products;
SELECT COUNT(*) || ' categories found' FROM categories;
SELECT COUNT(*) || ' product_categories links' FROM product_categories;
SELECT p.name, c.name as category FROM products p
LEFT JOIN product_categories pc ON p.id = pc.product_id
LEFT JOIN categories c ON pc.category_id = c.id
ORDER BY p.name;
