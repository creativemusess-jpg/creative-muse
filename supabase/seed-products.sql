-- Seed existing products into Supabase
-- Run AFTER schema.sql in the Supabase SQL Editor
-- Maps existing static product data to the new schema

-- Helper insert function (run once)
CREATE OR REPLACE FUNCTION get_category_id(slug TEXT) RETURNS UUID AS $$
  SELECT id FROM categories WHERE slug = slug LIMIT 1;
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION get_collection_id(slug TEXT) RETURNS UUID AS $$
  SELECT id FROM collections WHERE slug = slug LIMIT 1;
$$ LANGUAGE SQL;

-- 1. Aarav Solitaire Ring
WITH p AS (
  INSERT INTO products (name, slug, sku, short_description, full_description, current_price, original_price, badge, status, stock_quantity, material, metal_type, metal_colour, gold_purity, gross_weight, gemstone, certification_type, rating_average, review_count, best_seller, tags, published_at)
  VALUES (
    'Aarav Solitaire Ring', 'aarav-solitaire', 'CM-RG-AARAV-018',
    'A brilliant round solitaire set in a whisper-thin 18K gold band.',
    'The Aarav solitaire is hand-set in our Vadodara atelier with a VS-clarity brilliant round diamond, cradled in a four-prong 18K yellow gold setting engineered for everyday wear.',
    48500, 62000, 'Best Seller', 'active', 10,
    '18K Gold', 'Gold', 'Yellow Gold', '18K (750)', '3.2 g (approx.)', 'Diamond',
    'BIS Hallmark · IGI Diamond Certificate', 4.9, 218, true,
    ARRAY['ring', 'solitaire', 'bridal', 'engagement', 'diamond', 'aarav'],
    now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    current_price = EXCLUDED.current_price,
    original_price = EXCLUDED.original_price,
    status = 'active'
  RETURNING id
)
INSERT INTO product_categories (product_id, category_id)
SELECT p.id, c.id FROM p, categories c WHERE c.slug = 'rings'
ON CONFLICT DO NOTHING;

INSERT INTO product_collections (product_id, collection_id)
SELECT p.id, c.id FROM products p, collections c WHERE p.slug = 'aarav-solitaire' AND c.slug = 'solitaire-classics'
ON CONFLICT DO NOTHING;

-- 2. Celestia Drop Earrings
INSERT INTO products (name, slug, sku, short_description, full_description, current_price, original_price, badge, status, stock_quantity, material, metal_type, metal_colour, gold_purity, gross_weight, gemstone, certification_type, rating_average, review_count, new_arrival, tags, published_at)
VALUES (
  'Celestia Drop Earrings', 'celestia-drop', 'CM-EA-CELESTIA-018',
  'Freshwater pearl drops on a delicate 18K white gold hook.',
  'Luminous freshwater pearls suspended from a whisper-fine 18K white gold hook — an effortless piece that moves beautifully from day into evening.',
  22800, 28000, 'New', 'active', 15,
  'White Gold', 'Gold', 'White Gold', '18K (750)', '2.6 g (pair)', 'Pearl',
  'BIS Hallmark', 4.8, 94, true,
  ARRAY['earrings', 'pearl', 'white gold', 'drop earrings', 'occasion'],
  now()
)
ON CONFLICT (slug) DO UPDATE SET current_price = EXCLUDED.current_price, status = 'active';

INSERT INTO product_categories (product_id, category_id)
SELECT p.id, c.id FROM products p, categories c WHERE p.slug = 'celestia-drop' AND c.slug = 'earrings'
ON CONFLICT DO NOTHING;

INSERT INTO product_collections (product_id, collection_id)
SELECT p.id, c.id FROM products p, collections c WHERE p.slug = 'celestia-drop' AND c.slug = 'pearl-edit'
ON CONFLICT DO NOTHING;

-- 3. Serene Diamond Bracelet
INSERT INTO products (name, slug, sku, short_description, full_description, current_price, original_price, badge, status, stock_quantity, material, metal_type, metal_colour, gold_purity, gross_weight, gemstone, certification_type, rating_average, review_count, trending, tags, published_at)
VALUES (
  'Serene Diamond Bracelet', 'serene-bracelet', 'CM-BR-SERENE-950',
  'A tennis-inspired platinum line set with F/VS diamonds.',
  'Each stone in the Serene bracelet is prong-set in 950 platinum and matched for colour and clarity, giving a continuous river of brilliance around the wrist.',
  67500, 82000, 'Trending', 'active', 4,
  'Platinum', 'Platinum', 'Platinum', 'PT 950', '8.4 g', 'Diamond',
  'PGI Platinum · IGI Diamond Certificate', 5.0, 156, true,
  ARRAY['bracelet', 'diamond', 'platinum', 'tennis', 'gift'],
  now()
)
ON CONFLICT (slug) DO UPDATE SET current_price = EXCLUDED.current_price, stock_quantity = EXCLUDED.stock_quantity, status = 'active';

INSERT INTO product_categories (product_id, category_id)
SELECT p.id, c.id FROM products p, categories c WHERE p.slug = 'serene-bracelet' AND c.slug = 'bracelets'
ON CONFLICT DO NOTHING;

INSERT INTO product_collections (product_id, collection_id)
SELECT p.id, c.id FROM products p, collections c WHERE p.slug = 'serene-bracelet' AND c.slug = 'diamond-essentials'
ON CONFLICT DO NOTHING;

-- 4. Priya Kundan Necklace
INSERT INTO products (name, slug, sku, short_description, full_description, current_price, original_price, badge, status, stock_quantity, material, metal_type, metal_colour, gold_purity, gross_weight, gemstone, certification_type, rating_average, review_count, wedding, tags, published_at)
VALUES (
  'Priya Kundan Necklace', 'priya-kundan', 'CM-NK-PRIYA-022',
  'Traditional uncut kundan set in 22K gold, finished with meenakari on the reverse.',
  'The Priya necklace pairs uncut kundan stones with hand-painted meenakari on the reverse — a heritage bridal silhouette crafted in the Jaipur tradition.',
  38900, 48000, 'Wedding', 'active', 8,
  '22K Gold', 'Gold', 'Yellow Gold', '22K (916)', '32.5 g', 'Kundan',
  'BIS Hallmark', 4.9, 312, true,
  ARRAY['necklace', 'kundan', 'bridal', 'wedding', 'traditional'],
  now()
)
ON CONFLICT (slug) DO UPDATE SET current_price = EXCLUDED.current_price, status = 'active';

INSERT INTO product_categories (product_id, category_id)
SELECT p.id, c.id FROM products p, categories c WHERE p.slug = 'priya-kundan' AND c.slug = 'necklaces'
ON CONFLICT DO NOTHING;

INSERT INTO product_collections (product_id, collection_id)
SELECT p.id, c.id FROM products p, collections c WHERE p.slug = 'priya-kundan' AND c.slug = 'bridal-heritage'
ON CONFLICT DO NOTHING;

-- 5. Luna Crescent Pendant
INSERT INTO products (name, slug, sku, short_description, full_description, current_price, original_price, badge, status, stock_quantity, material, metal_type, metal_colour, gold_purity, gross_weight, gemstone, certification_type, rating_average, review_count, new_arrival, tags, published_at)
VALUES (
  'Luna Crescent Pendant', 'luna-crescent', 'CM-PD-LUNA-014',
  'A crescent silhouette in 14K rose gold, tipped with a Burmese ruby.',
  'The Luna pendant is a modern take on the crescent motif — cast in 14K rose gold with a single Burmese ruby set at the tip. Includes a matching 45cm rose gold chain.',
  15600, 19800, 'New', 'active', 20,
  '14K Gold', 'Gold', 'Rose Gold', '14K (585)', '1.9 g', 'Ruby',
  'BIS Hallmark', 4.7, 67, true,
  ARRAY['pendant', 'ruby', 'rose gold', 'crescent', 'gift'],
  now()
)
ON CONFLICT (slug) DO UPDATE SET current_price = EXCLUDED.current_price, status = 'active';

INSERT INTO product_categories (product_id, category_id)
SELECT p.id, c.id FROM products p, categories c WHERE p.slug = 'luna-crescent' AND c.slug = 'pendants'
ON CONFLICT DO NOTHING;

INSERT INTO product_collections (product_id, collection_id)
SELECT p.id, c.id FROM products p, collections c WHERE p.slug = 'luna-crescent' AND c.slug = 'everyday-muse'
ON CONFLICT DO NOTHING;

-- 6. Eternal Mangalsutra
INSERT INTO products (name, slug, sku, short_description, full_description, current_price, original_price, badge, status, stock_quantity, material, metal_type, metal_colour, gold_purity, gross_weight, gemstone, certification_type, rating_average, review_count, best_seller, tags, published_at)
VALUES (
  'Eternal Mangalsutra', 'eternal-mangalsutra', 'CM-MS-ETERNAL-022',
  'Twin-vati mangalsutra with a diamond-set pendant and 22K black-bead chain.',
  'A contemporary mangalsutra with two 22K gold vatis and a central diamond cluster, strung on a traditional black-bead chain — a piece designed to be worn every day.',
  54200, 68000, 'Best Seller', 'active', 12,
  '22K Gold', 'Gold', 'Yellow Gold', '22K (916)', '12.4 g', 'Diamond',
  'BIS Hallmark · IGI Diamond Certificate', 5.0, 445, true,
  ARRAY['mangalsutra', 'diamond', 'bridal', 'black beads', 'daily wear'],
  now()
)
ON CONFLICT (slug) DO UPDATE SET current_price = EXCLUDED.current_price, status = 'active';

INSERT INTO product_categories (product_id, category_id)
SELECT p.id, c.id FROM products p, categories c WHERE p.slug = 'eternal-mangalsutra' AND c.slug = 'mangalsutra'
ON CONFLICT DO NOTHING;

INSERT INTO product_collections (product_id, collection_id)
SELECT p.id, c.id FROM products p, collections c WHERE p.slug = 'eternal-mangalsutra' AND c.slug = 'forever-vows'
ON CONFLICT DO NOTHING;

-- 7. Meera Jhumka Earrings
INSERT INTO products (name, slug, sku, short_description, full_description, current_price, original_price, badge, status, stock_quantity, material, metal_type, metal_colour, gold_purity, gross_weight, gemstone, certification_type, rating_average, review_count, trending, tags, published_at)
VALUES (
  'Meera Jhumka Earrings', 'meera-jhumka', 'CM-EA-MEERA-022',
  'Bell-shaped jhumkas in 22K gold with emerald drops and pearl fringe.',
  'Hand-crafted 22K gold jhumkas with cabochon emeralds and a delicate freshwater pearl fringe — rooted in temple jewellery traditions of southern India.',
  18400, 23500, 'Trending', 'active', 10,
  '22K Gold', 'Gold', 'Yellow Gold', '22K (916)', '9.1 g (pair)', 'Emerald',
  'BIS Hallmark', 4.8, 189, true,
  ARRAY['earrings', 'jhumka', 'emerald', 'pearl', 'traditional'],
  now()
)
ON CONFLICT (slug) DO UPDATE SET current_price = EXCLUDED.current_price, status = 'active';

INSERT INTO product_categories (product_id, category_id)
SELECT p.id, c.id FROM products p, categories c WHERE p.slug = 'meera-jhumka' AND c.slug = 'earrings'
ON CONFLICT DO NOTHING;

INSERT INTO product_collections (product_id, collection_id)
SELECT p.id, c.id FROM products p, collections c WHERE p.slug = 'meera-jhumka' AND c.slug = 'temple-treasures'
ON CONFLICT DO NOTHING;

-- 8. Royal Polki Choker
INSERT INTO products (name, slug, sku, short_description, full_description, current_price, original_price, badge, status, stock_quantity, material, metal_type, metal_colour, gold_purity, gross_weight, gemstone, certification_type, rating_average, review_count, wedding, tags, published_at)
VALUES (
  'Royal Polki Choker', 'royal-polki', 'CM-NK-ROYAL-022',
  'Uncut polki choker in 22K gold, finished with a South Sea pearl fringe.',
  'The Royal Polki choker is set with uncut polki diamonds in 22K gold, closed at the back with an adjustable dori and finished with a South Sea pearl fringe — a statement bridal heirloom.',
  92000, 115000, 'Wedding', 'active', 3,
  '22K Gold', 'Gold', 'Yellow Gold', '22K (916)', '48.6 g', 'Polki',
  'BIS Hallmark', 4.9, 78, true,
  ARRAY['choker', 'polki', 'kundan', 'bridal', 'wedding', 'pearl'],
  now()
)
ON CONFLICT (slug) DO UPDATE SET current_price = EXCLUDED.current_price, status = 'active';

INSERT INTO product_categories (product_id, category_id)
SELECT p.id, c.id FROM products p, categories c WHERE p.slug = 'royal-polki' AND c.slug = 'necklaces'
ON CONFLICT DO NOTHING;

INSERT INTO product_collections (product_id, collection_id)
SELECT p.id, c.id FROM products p, collections c WHERE p.slug = 'royal-polki' AND c.slug = 'bridal-heritage'
ON CONFLICT DO NOTHING;

-- Seed homepage sections (default content from the existing homepage)
INSERT INTO homepage_sections (section_key, title, content, is_published, sort_order) VALUES
  ('hero', 'Hero Section', '{
    "eyebrow": "Creative Muse Fine Jewellery",
    "heading": "Handcrafted",
    "highlighted": "Elegance",
    "subheading": "for Life''s Most Treasured Moments",
    "description": "Discover exquisite 22K gold, platinum and diamond jewellery, handcrafted by master artisans in Vadodara since 1995. Each piece tells a story of heritage, precision and timeless beauty.",
    "primary_cta": "Explore Collection",
    "secondary_cta": "Book Appointment",
    "certification_text": "BIS Hallmarked · IGI Certified · PGI Platinum",
    "stats": [
      {"value": "30+", "label": "Years Legacy"},
      {"value": "12000+", "label": "Happy Customers"},
      {"value": "100%", "label": "Certified Purity"}
    ]
  }', true, 1),
  ('shop_by_category', 'Shop by Category', '{}', true, 2),
  ('best_sellers', 'Best Sellers', '{}', true, 3),
  ('new_arrivals', 'New Arrivals', '{}', true, 4),
  ('banners', 'Promotional Banners', '{}', true, 5),
  ('testimonials', 'Testimonials', '{}', true, 6),
  ('faq', 'FAQ', '{}', true, 7),
  ('newsletter', 'Newsletter', '{
    "heading": "Join the Inner Circle",
    "description": "Be the first to discover new collections, exclusive previews and 10% off your first order.",
    "discount_percentage": 10,
    "placeholder": "Enter your email address"
  }', true, 8),
  ('store', 'Store Information', '{
    "address": "Creative Muse Fine Jewellery\nSRP Complex, Beside SCA School\nNew Sama Road, Vadodara\nGujarat, India — 390024",
    "phone": "+91 98765 43210",
    "email": "hello@creativemuse.in",
    "timings": "Mon–Sat: 10:30 AM – 8:30 PM\nSunday: 11:00 AM – 5:00 PM"
  }', true, 9),
  ('premium_arrivals', 'Premium Jewellery', '{}', true, 10)
ON CONFLICT (section_key) DO NOTHING;

-- Set default auto-scroll on new_arrivals
UPDATE homepage_sections
SET
  auto_scroll_enabled = true,
  scroll_direction = 'left',
  scroll_speed = 30,
  pause_on_hover = true,
  auto_resume_enabled = true,
  auto_resume_delay_seconds = 3
WHERE section_key = 'new_arrivals'
  AND auto_scroll_enabled IS NULL;

-- Set default auto-scroll on premium_arrivals
UPDATE homepage_sections
SET
  auto_scroll_enabled = true,
  scroll_direction = 'right',
  scroll_speed = 25,
  pause_on_hover = true,
  auto_resume_enabled = true,
  auto_resume_delay_seconds = 3
WHERE section_key = 'premium_arrivals'
  AND auto_scroll_enabled IS NULL;

-- Seed testimonials
INSERT INTO testimonials (customer_name, city, rating, review, is_published, sort_order) VALUES
  ('Ananya Sharma', 'Mumbai', 5, 'I purchased my engagement ring from Creative Muse and the craftsmanship is absolutely stunning. The diamond certification gave me complete confidence in my purchase.', true, 1),
  ('Rohan Mehta', 'Vadodara', 5, 'Been a customer for over 10 years. Their attention to detail and customer service is unmatched in Vadodara. Recently got my mother a mangalsutra from their new collection.', true, 2),
  ('Priya Patel', 'Ahmedabad', 5, 'The bridal set I ordered for my wedding was even more beautiful in person. The team helped me design custom pieces that matched my wedding lehenga perfectly.', true, 3)
ON CONFLICT DO NOTHING;

-- Seed FAQs
INSERT INTO faqs (question, answer, sort_order, is_published) VALUES
  ('What is the purity of your gold jewellery?', 'All our gold jewellery is BIS Hallmarked. We offer 22K (916) and 18K (750) gold. Our platinum pieces are PGI certified 950 platinum. Every piece comes with a certificate of authenticity.', 1, true),
  ('Do you provide diamond certification?', 'Yes, all diamond jewellery comes with an IGI or GIA diamond certificate that details the 4Cs — cut, colour, clarity and carat weight of your diamond.', 2, true),
  ('What is your return and exchange policy?', 'We offer a 15-day easy return policy on unworn pieces in their original packaging. Custom and engraved pieces are not eligible for returns. Please visit our Refund Policy page for complete details.', 3, true),
  ('How should I care for my jewellery?', 'Store each piece separately in the pouch provided. Avoid contact with perfumes, chlorine and abrasives. Wipe gently with a soft cloth after each wear. We recommend an annual professional cleaning.', 4, true),
  ('Do you offer jewellery repair and resizing?', 'Yes, we provide complimentary resizing within 30 days of purchase. Paid repair and resizing services are available for all pieces, regardless of where they were purchased.', 5, true),
  ('Can I book a private appointment?', 'Absolutely. We offer private appointments at our Vadodara atelier where you can view our collections in a relaxed setting with personalised attention from our design consultants.', 6, true)
ON CONFLICT DO NOTHING;

-- Seed site settings
INSERT INTO site_settings (setting_key, setting_value) VALUES
  ('store_name', '"Creative Muse Fine Jewellery"'),
  ('store_tagline', '"Handcrafted Elegance for Life''s Most Treasured Moments"'),
  ('store_email', '"hello@creativemuse.in"'),
  ('store_phone', '"+91 98765 43210"'),
  ('store_address', '"Creative Muse Fine Jewellery, SRP Complex, Beside SCA School, New Sama Road, Vadodara, Gujarat, India — 390024"'),
  ('social_instagram', '"https://instagram.com/creativemuse"'),
  ('social_facebook', '"https://facebook.com/creativemuse"'),
  ('social_youtube', '"https://youtube.com/@creativemuse"'),
  ('whatsapp_number', '"919876543210"'),
  ('free_shipping_threshold', '25000'),
  ('cod_available', 'true'),
  ('currency', '"INR"'),
  ('currency_symbol', '"₹"')
ON CONFLICT (setting_key) DO NOTHING;
