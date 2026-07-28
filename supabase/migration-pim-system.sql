-- ============================================================
-- Creative Muse — PIM System: Dynamic Specs, Flags, Coupons
-- Run in Supabase SQL Editor after schema.sql
-- ============================================================

-- 1. PRODUCT FLAGS (replaces hardcoded boolean flags)
-- ============================================================
CREATE TABLE IF NOT EXISTS product_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  badge_label TEXT,
  badge_bg_color TEXT NOT NULL DEFAULT '#1a1a2e',
  badge_text_color TEXT NOT NULL DEFAULT '#ffffff',
  badge_border_color TEXT DEFAULT 'transparent',
  icon TEXT,
  priority INT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive')),
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS product_product_flags (
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  flag_id UUID NOT NULL REFERENCES product_flags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (product_id, flag_id)
);

CREATE INDEX IF NOT EXISTS idx_ppf_product ON product_product_flags(product_id);
CREATE INDEX IF NOT EXISTS idx_ppf_flag ON product_product_flags(flag_id);
CREATE INDEX IF NOT EXISTS idx_product_flags_status ON product_flags(status);
CREATE INDEX IF NOT EXISTS idx_product_flags_order ON product_flags(display_order);

-- 2. SPECIFICATION DEFINITIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS specification_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  field_type TEXT NOT NULL DEFAULT 'text' CHECK (field_type IN ('text','dropdown','number','boolean','date')),
  options JSONB DEFAULT '[]'::jsonb,
  placeholder TEXT,
  is_required BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_spec_def_active ON specification_definitions(is_active);
CREATE INDEX IF NOT EXISTS idx_spec_def_order ON specification_definitions(sort_order);

-- 3. PRODUCT SPECIFICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS product_specifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  specification_definition_id UUID NOT NULL REFERENCES specification_definitions(id) ON DELETE CASCADE,
  value TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ps_product ON product_specifications(product_id);
CREATE INDEX IF NOT EXISTS idx_ps_definition ON product_specifications(specification_definition_id);
CREATE INDEX IF NOT EXISTS idx_ps_unique ON product_specifications(product_id, specification_definition_id);

-- 4. COUPON SCOPES (include/exclude rules)
-- ============================================================
CREATE TABLE IF NOT EXISTS coupon_scopes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id UUID NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
  scope_type TEXT NOT NULL CHECK (scope_type IN ('entire_store','category','product','collection','brand','tag','vendor')),
  scope_id TEXT,
  scope_label TEXT,
  rule_type TEXT NOT NULL DEFAULT 'include' CHECK (rule_type IN ('include','exclude')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cs_coupon ON coupon_scopes(coupon_id);
CREATE INDEX IF NOT EXISTS idx_cs_type ON coupon_scopes(scope_type);

-- 5. COUPON RESTRICTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS coupon_restrictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id UUID NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
  restriction_type TEXT NOT NULL CHECK (restriction_type IN (
    'min_purchase','max_discount','usage_limit','per_user_limit',
    'customer_group','first_order_only','guest_only','logged_in_only',
    'start_date','expiry_date','min_items','max_items'
  )),
  restriction_value TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cr_coupon ON coupon_restrictions(coupon_id);

-- 6. ADD MISSING COLUMNS TO COUPONS TABLE
-- ============================================================
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS start_date TIMESTAMPTZ;
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS coupon_type TEXT DEFAULT 'global' CHECK (coupon_type IN ('global','targeted'));
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS customer_group TEXT;
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS guest_allowed BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS logged_in_only BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS min_items INT;
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS max_items INT;

-- 7. MIGRATE EXISTING HARDCODED FLAGS TO product_flags
-- ============================================================
INSERT INTO product_flags (name, slug, badge_label, badge_bg_color, badge_text_color, priority, display_order, status)
VALUES
  ('Featured', 'featured', 'Featured', '#1a1a2e', '#ffffff', 10, 1, 'active'),
  ('Best Seller', 'best-seller', 'Best Seller', '#421D22', '#ffffff', 20, 2, 'active'),
  ('New Arrival', 'new-arrival', 'New', '#421D22', '#ffffff', 30, 3, 'active'),
  ('Trending', 'trending', 'Trending', '#421D22', '#ffffff', 40, 4, 'active'),
  ('Wedding', 'wedding', 'Wedding', '#7A2533', '#ffffff', 50, 5, 'active')
ON CONFLICT (slug) DO NOTHING;

-- Link existing flagged products to product_flags
INSERT INTO product_product_flags (product_id, flag_id)
SELECT p.id, pf.id
FROM products p, product_flags pf
WHERE (pf.slug = 'featured' AND p.featured = true)
   OR (pf.slug = 'best-seller' AND p.best_seller = true)
   OR (pf.slug = 'new-arrival' AND p.new_arrival = true)
   OR (pf.slug = 'trending' AND p.trending = true)
   OR (pf.slug = 'wedding' AND p.wedding = true)
ON CONFLICT DO NOTHING;

-- 8. MIGRATE EXISTING JEWELLERY SPECS TO specification_definitions
-- ============================================================
INSERT INTO specification_definitions (name, slug, field_type, options, sort_order, is_active)
VALUES
  ('Metal Type', 'metal-type', 'dropdown', '["Gold","Silver","Platinum","Copper","Brass","Titanium","Iron","Steel","Aluminium","Wood","Plastic","Carbon Fiber"]', 1, true),
  ('Metal Colour', 'metal-colour', 'text', '[]', 2, true),
  ('Purity', 'purity', 'dropdown', '["24K (999)","22K (916)","18K (750)","14K (585)","10K (417)","PT 950","PT 900","Silver 925"]', 3, true),
  ('Gemstone', 'gemstone', 'text', '[]', 4, true),
  ('Gross Weight', 'gross-weight', 'text', '[]', 5, true),
  ('Net Weight', 'net-weight', 'text', '[]', 6, true),
  ('Certification', 'certification', 'text', '[]', 7, true),
  ('Certification Number', 'certification-number', 'text', '[]', 8, true),
  ('Material', 'material', 'dropdown', '["Gold","Silver","Platinum","Stainless Steel","Iron","Brass","Copper","Aluminium","Titanium","Wood","Leather","Cotton","Polyester","Silk","Wool","Acrylic","Glass","Ceramic","Carbon Fiber","Resin","Plastic"]', 9, true),
  ('Brand', 'brand', 'text', '[]', 10, true),
  ('Model', 'model', 'text', '[]', 11, true),
  ('Size', 'size', 'text', '[]', 12, true),
  ('Colour', 'colour', 'text', '[]', 13, true),
  ('Warranty', 'warranty', 'text', '[]', 14, true),
  ('Country of Origin', 'country-of-origin', 'dropdown', '["India","China","USA","Italy","France","UK","Japan","Germany","South Korea","Thailand","Vietnam","Brazil","Turkey","Other"]', 15, true)
ON CONFLICT (slug) DO NOTHING;

-- Migrate existing product spec data from hardcoded columns
INSERT INTO product_specifications (product_id, specification_definition_id, value, sort_order)
SELECT p.id, sd.id, p.metal_type, 1
FROM products p, specification_definitions sd
WHERE sd.slug = 'metal-type' AND p.metal_type IS NOT NULL AND p.metal_type != ''
ON CONFLICT DO NOTHING;

INSERT INTO product_specifications (product_id, specification_definition_id, value, sort_order)
SELECT p.id, sd.id, p.metal_colour, 2
FROM products p, specification_definitions sd
WHERE sd.slug = 'metal-colour' AND p.metal_colour IS NOT NULL AND p.metal_colour != ''
ON CONFLICT DO NOTHING;

INSERT INTO product_specifications (product_id, specification_definition_id, value, sort_order)
SELECT p.id, sd.id, p.gold_purity, 3
FROM products p, specification_definitions sd
WHERE sd.slug = 'purity' AND p.gold_purity IS NOT NULL AND p.gold_purity != ''
ON CONFLICT DO NOTHING;

INSERT INTO product_specifications (product_id, specification_definition_id, value, sort_order)
SELECT p.id, sd.id, p.gemstone, 4
FROM products p, specification_definitions sd
WHERE sd.slug = 'gemstone' AND p.gemstone IS NOT NULL AND p.gemstone != ''
ON CONFLICT DO NOTHING;

INSERT INTO product_specifications (product_id, specification_definition_id, value, sort_order)
SELECT p.id, sd.id, p.gross_weight, 5
FROM products p, specification_definitions sd
WHERE sd.slug = 'gross-weight' AND p.gross_weight IS NOT NULL AND p.gross_weight != ''
ON CONFLICT DO NOTHING;

INSERT INTO product_specifications (product_id, specification_definition_id, value, sort_order)
SELECT p.id, sd.id, p.net_weight, 6
FROM products p, specification_definitions sd
WHERE sd.slug = 'net-weight' AND p.net_weight IS NOT NULL AND p.net_weight != ''
ON CONFLICT DO NOTHING;

INSERT INTO product_specifications (product_id, specification_definition_id, value, sort_order)
SELECT p.id, sd.id, p.certification_type, 7
FROM products p, specification_definitions sd
WHERE sd.slug = 'certification' AND p.certification_type IS NOT NULL AND p.certification_type != ''
ON CONFLICT DO NOTHING;

INSERT INTO product_specifications (product_id, specification_definition_id, value, sort_order)
SELECT p.id, sd.id, p.certification_number, 8
FROM products p, specification_definitions sd
WHERE sd.slug = 'certification-number' AND p.certification_number IS NOT NULL AND p.certification_number != ''
ON CONFLICT DO NOTHING;

-- 9. INSERT DEFAULT FLAGS FOR COUPON SCOPES
-- ============================================================
INSERT INTO specification_definitions (name, slug, field_type, options, sort_order, is_active)
VALUES
  ('Capacity', 'capacity', 'text', '[]', 16, true),
  ('Voltage', 'voltage', 'text', '[]', 17, true),
  ('Power', 'power', 'text', '[]', 18, true),
  ('Finish', 'finish', 'text', '[]', 19, true),
  ('Texture', 'texture', 'text', '[]', 20, true),
  ('Fabric', 'fabric', 'dropdown', '["Cotton","Polyester","Silk","Wool","Linen","Nylon","Rayon","Velvet","Lace","Denim","Leather","Satin","Organza","Tulle","Jute"]', 21, true),
  ('Pattern', 'pattern', 'text', '[]', 22, true),
  ('Occasion', 'occasion', 'dropdown', '["Casual","Formal","Party","Wedding","Festive","Office","Daily Wear","Evening","Travel","Sport"]', 23, true)
ON CONFLICT (slug) DO NOTHING;
