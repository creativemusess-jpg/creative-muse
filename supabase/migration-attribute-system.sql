-- ============================================================
-- Creative Muse — Enterprise Product Attribute System
-- Run in Supabase SQL Editor after migration-pim-system.sql
-- ============================================================

-- 1. RENAME existing specification tables to attribute tables (if not already renamed)
-- ============================================================
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'specification_definitions')
     AND NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'attribute_definitions') THEN
    ALTER TABLE specification_definitions RENAME TO attribute_definitions;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'product_specifications')
     AND NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'product_attributes') THEN
    ALTER TABLE product_specifications RENAME TO product_attributes;
  END IF;
END $$;

-- 2. ADD new columns to attribute_definitions
-- ============================================================
ALTER TABLE attribute_definitions ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES categories(id) ON DELETE SET NULL;
ALTER TABLE attribute_definitions ADD COLUMN IF NOT EXISTS use_as_filter BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE attribute_definitions ADD COLUMN IF NOT EXISTS show_in_product_list BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE attribute_definitions ADD COLUMN IF NOT EXISTS is_searchable BOOLEAN NOT NULL DEFAULT false;

-- Drop old field_type check (constraint name NOT auto-renamed with table) and add extended one
ALTER TABLE attribute_definitions DROP CONSTRAINT IF EXISTS specification_definitions_field_type_check;
ALTER TABLE attribute_definitions DROP CONSTRAINT IF EXISTS attr_def_field_type_check;
ALTER TABLE attribute_definitions ADD CONSTRAINT attr_def_field_type_check
  CHECK (field_type IN ('text','number','dropdown','boolean','date','color','url','multi_select','single_select','measurement'));

-- Rename column in renamed table (if not already renamed)
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'product_attributes' AND column_name = 'specification_definition_id'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'product_attributes' AND column_name = 'attribute_definition_id'
  ) THEN
    ALTER TABLE product_attributes RENAME COLUMN specification_definition_id TO attribute_definition_id;
  END IF;
END $$;

-- Rename indexes (only if old exists and new doesn't)
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_spec_def_active' AND schemaname = 'public')
     AND NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_attr_def_active' AND schemaname = 'public') THEN
    ALTER INDEX idx_spec_def_active RENAME TO idx_attr_def_active;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_spec_def_order' AND schemaname = 'public')
     AND NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_attr_def_order' AND schemaname = 'public') THEN
    ALTER INDEX idx_spec_def_order RENAME TO idx_attr_def_order;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_ps_product' AND schemaname = 'public')
     AND NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_pa_product' AND schemaname = 'public') THEN
    ALTER INDEX idx_ps_product RENAME TO idx_pa_product;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_ps_definition' AND schemaname = 'public')
     AND NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_pa_definition' AND schemaname = 'public') THEN
    ALTER INDEX idx_ps_definition RENAME TO idx_pa_definition;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_ps_unique' AND schemaname = 'public')
     AND NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_pa_unique' AND schemaname = 'public') THEN
    ALTER INDEX idx_ps_unique RENAME TO idx_pa_unique;
  END IF;
END $$;

-- 3. Migrate existing specification data to new attribute names
-- ============================================================
-- Create attribute definitions for the old hardcoded fields (if not already present)
INSERT INTO attribute_definitions (name, slug, field_type, options, sort_order, is_active, use_as_filter, show_in_product_list)
SELECT 'Metal Type', 'metal-type', 'dropdown', '["Gold","Silver","Platinum","Copper","Brass","Titanium","Iron","Steel","Aluminium","Wood","Plastic","Carbon Fiber"]', 1, true, true, true
WHERE NOT EXISTS (SELECT 1 FROM attribute_definitions WHERE slug = 'metal-type');

INSERT INTO attribute_definitions (name, slug, field_type, options, sort_order, is_active, use_as_filter, show_in_product_list)
SELECT 'Metal Colour', 'metal-colour', 'text', '[]', 2, true, true, true
WHERE NOT EXISTS (SELECT 1 FROM attribute_definitions WHERE slug = 'metal-colour');

INSERT INTO attribute_definitions (name, slug, field_type, options, sort_order, is_active, use_as_filter, show_in_product_list)
SELECT 'Purity', 'purity', 'dropdown', '["24K (999)","22K (916)","18K (750)","14K (585)","10K (417)","PT 950","PT 900","Silver 925"]', 3, true, true, true
WHERE NOT EXISTS (SELECT 1 FROM attribute_definitions WHERE slug = 'purity');

INSERT INTO attribute_definitions (name, slug, field_type, options, sort_order, is_active, use_as_filter, show_in_product_list)
SELECT 'Gemstone', 'gemstone', 'text', '[]', 4, true, false, true
WHERE NOT EXISTS (SELECT 1 FROM attribute_definitions WHERE slug = 'gemstone');

INSERT INTO attribute_definitions (name, slug, field_type, options, sort_order, is_active, use_as_filter, show_in_product_list)
SELECT 'Gross Weight', 'gross-weight', 'measurement', '["g","kg","mg","oz","lb"]', 5, true, false, true
WHERE NOT EXISTS (SELECT 1 FROM attribute_definitions WHERE slug = 'gross-weight');

INSERT INTO attribute_definitions (name, slug, field_type, options, sort_order, is_active, use_as_filter, show_in_product_list)
SELECT 'Certification', 'certification', 'text', '[]', 6, true, false, false
WHERE NOT EXISTS (SELECT 1 FROM attribute_definitions WHERE slug = 'certification');

INSERT INTO attribute_definitions (name, slug, field_type, options, sort_order, is_active, use_as_filter, show_in_product_list)
SELECT 'Certification Number', 'certification-number', 'text', '[]', 7, true, false, false
WHERE NOT EXISTS (SELECT 1 FROM attribute_definitions WHERE slug = 'certification-number');

INSERT INTO attribute_definitions (name, slug, field_type, options, sort_order, is_active, use_as_filter, show_in_product_list)
SELECT 'Material', 'material', 'dropdown', '["Gold","Silver","Platinum","Stainless Steel","Iron","Brass","Copper","Aluminium","Titanium","Wood","Leather","Cotton","Polyester","Silk","Wool","Acrylic","Glass","Ceramic","Carbon Fiber","Resin","Plastic"]', 8, true, true, true
WHERE NOT EXISTS (SELECT 1 FROM attribute_definitions WHERE slug = 'material');

-- Migrate existing hardcoded product column values to product_attributes
INSERT INTO product_attributes (product_id, attribute_definition_id, value, sort_order)
SELECT p.id, ad.id, p.metal_type, 1
FROM products p, attribute_definitions ad
WHERE ad.slug = 'metal-type' AND p.metal_type IS NOT NULL AND p.metal_type != ''
ON CONFLICT DO NOTHING;

INSERT INTO product_attributes (product_id, attribute_definition_id, value, sort_order)
SELECT p.id, ad.id, p.metal_colour, 2
FROM products p, attribute_definitions ad
WHERE ad.slug = 'metal-colour' AND p.metal_colour IS NOT NULL AND p.metal_colour != ''
ON CONFLICT DO NOTHING;

INSERT INTO product_attributes (product_id, attribute_definition_id, value, sort_order)
SELECT p.id, ad.id, p.gold_purity, 3
FROM products p, attribute_definitions ad
WHERE ad.slug = 'purity' AND p.gold_purity IS NOT NULL AND p.gold_purity != ''
ON CONFLICT DO NOTHING;

INSERT INTO product_attributes (product_id, attribute_definition_id, value, sort_order)
SELECT p.id, ad.id, p.gemstone, 4
FROM products p, attribute_definitions ad
WHERE ad.slug = 'gemstone' AND p.gemstone IS NOT NULL AND p.gemstone != ''
ON CONFLICT DO NOTHING;

INSERT INTO product_attributes (product_id, attribute_definition_id, value, sort_order)
SELECT p.id, ad.id, p.gross_weight, 5
FROM products p, attribute_definitions ad
WHERE ad.slug = 'gross-weight' AND p.gross_weight IS NOT NULL AND p.gross_weight != ''
ON CONFLICT DO NOTHING;

INSERT INTO product_attributes (product_id, attribute_definition_id, value, sort_order)
SELECT p.id, ad.id, p.certification_type, 6
FROM products p, attribute_definitions ad
WHERE ad.slug = 'certification' AND p.certification_type IS NOT NULL AND p.certification_type != ''
ON CONFLICT DO NOTHING;

INSERT INTO product_attributes (product_id, attribute_definition_id, value, sort_order)
SELECT p.id, ad.id, p.certification_number, 7
FROM products p, attribute_definitions ad
WHERE ad.slug = 'certification-number' AND p.certification_number IS NOT NULL AND p.certification_number != ''
ON CONFLICT DO NOTHING;

INSERT INTO product_attributes (product_id, attribute_definition_id, value, sort_order)
SELECT p.id, ad.id, p.material, 8
FROM products p, attribute_definitions ad
WHERE ad.slug = 'material' AND p.material IS NOT NULL AND p.material != ''
ON CONFLICT DO NOTHING;
