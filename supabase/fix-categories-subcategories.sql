-- ============================================================
-- Creative Muse — Categories, Subcategories & Product SEO
-- Run in Supabase Dashboard → SQL Editor
-- Idempotent — safe to run multiple times.
-- ============================================================

-- 1. SUBCATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.subcategories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  image TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(category_id, slug)
);

-- Enable RLS on subcategories
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;

-- Anyone can read active subcategories
DROP POLICY IF EXISTS "Anyone can read active subcategories" ON public.subcategories;
CREATE POLICY "Anyone can read active subcategories" ON public.subcategories
  FOR SELECT USING (active = true);

-- Admin full access to subcategories
DROP POLICY IF EXISTS "Admin full access to subcategories" ON public.subcategories;
CREATE POLICY "Admin full access to subcategories" ON public.subcategories
  FOR ALL USING (public.has_admin_role())
  WITH CHECK (public.has_admin_role());

-- 2. ADD SUBCATEGORY_ID TO PRODUCTS
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS subcategory_id UUID REFERENCES public.subcategories(id) ON DELETE SET NULL;

-- 3. ADD SEO COLUMNS TO PRODUCTS
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS focus_keyword TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS canonical_url TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS social_image TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS image_alt_text TEXT;

-- 4. UPSERT THE 7 REQUIRED CATEGORIES
INSERT INTO public.categories (name, slug, sort_order, active, description)
VALUES
  ('Earrings', 'earrings', 1, true, 'Beautiful earrings for every occasion'),
  ('Necklace', 'necklace', 2, true, 'Stunning necklaces and pendants'),
  ('Rings', 'rings', 3, true, 'Elegant rings for every finger'),
  ('Hoops', 'hoops', 4, true, 'Trendy hoop earrings'),
  ('Earcuffs', 'earcuffs', 5, true, 'Modern earcuff designs'),
  ('Kada', 'kada', 6, true, 'Traditional and contemporary kada'),
  ('Bracelets', 'bracelets', 7, true, 'Beautiful bracelets for every wrist')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  active = true,
  sort_order = EXCLUDED.sort_order,
  description = EXCLUDED.description;

-- 5. INSERT SUBCATEGORIES (only if they don't exist within their category)
-- Necklace subcategories
INSERT INTO public.subcategories (category_id, name, slug, sort_order, active)
SELECT c.id, 'Statement Necklace', 'statement-necklace', 1, true
FROM public.categories c WHERE c.slug = 'necklace'
AND NOT EXISTS (SELECT 1 FROM public.subcategories s WHERE s.category_id = c.id AND s.slug = 'statement-necklace');

INSERT INTO public.subcategories (category_id, name, slug, sort_order, active)
SELECT c.id, 'Charm Necklace', 'charm-necklace', 2, true
FROM public.categories c WHERE c.slug = 'necklace'
AND NOT EXISTS (SELECT 1 FROM public.subcategories s WHERE s.category_id = c.id AND s.slug = 'charm-necklace');

INSERT INTO public.subcategories (category_id, name, slug, sort_order, active)
SELECT c.id, 'Everyday Necklace', 'everyday-necklace', 3, true
FROM public.categories c WHERE c.slug = 'necklace'
AND NOT EXISTS (SELECT 1 FROM public.subcategories s WHERE s.category_id = c.id AND s.slug = 'everyday-necklace');

-- Kada subcategories
INSERT INTO public.subcategories (category_id, name, slug, sort_order, active)
SELECT c.id, 'Statement Kada', 'statement-kada', 1, true
FROM public.categories c WHERE c.slug = 'kada'
AND NOT EXISTS (SELECT 1 FROM public.subcategories s WHERE s.category_id = c.id AND s.slug = 'statement-kada');

INSERT INTO public.subcategories (category_id, name, slug, sort_order, active)
SELECT c.id, 'Resin Kada', 'resin-kada', 2, true
FROM public.categories c WHERE c.slug = 'kada'
AND NOT EXISTS (SELECT 1 FROM public.subcategories s WHERE s.category_id = c.id AND s.slug = 'resin-kada');

INSERT INTO public.subcategories (category_id, name, slug, sort_order, active)
SELECT c.id, 'Wooden Kada', 'wooden-kada', 3, true
FROM public.categories c WHERE c.slug = 'kada'
AND NOT EXISTS (SELECT 1 FROM public.subcategories s WHERE s.category_id = c.id AND s.slug = 'wooden-kada');

INSERT INTO public.subcategories (category_id, name, slug, sort_order, active)
SELECT c.id, 'Colorful Kada', 'colorful-kada', 4, true
FROM public.categories c WHERE c.slug = 'kada'
AND NOT EXISTS (SELECT 1 FROM public.subcategories s WHERE s.category_id = c.id AND s.slug = 'colorful-kada');

INSERT INTO public.subcategories (category_id, name, slug, sort_order, active)
SELECT c.id, 'Everyday Kada', 'everyday-kada', 5, true
FROM public.categories c WHERE c.slug = 'kada'
AND NOT EXISTS (SELECT 1 FROM public.subcategories s WHERE s.category_id = c.id AND s.slug = 'everyday-kada');

-- Bracelets subcategories
INSERT INTO public.subcategories (category_id, name, slug, sort_order, active)
SELECT c.id, 'Gold Bracelet', 'gold-bracelet', 1, true
FROM public.categories c WHERE c.slug = 'bracelets'
AND NOT EXISTS (SELECT 1 FROM public.subcategories s WHERE s.category_id = c.id AND s.slug = 'gold-bracelet');

INSERT INTO public.subcategories (category_id, name, slug, sort_order, active)
SELECT c.id, 'Charm Bracelet', 'charm-bracelet', 2, true
FROM public.categories c WHERE c.slug = 'bracelets'
AND NOT EXISTS (SELECT 1 FROM public.subcategories s WHERE s.category_id = c.id AND s.slug = 'charm-bracelet');

INSERT INTO public.subcategories (category_id, name, slug, sort_order, active)
SELECT c.id, 'Tennis Bracelet', 'tennis-bracelet', 3, true
FROM public.categories c WHERE c.slug = 'bracelets'
AND NOT EXISTS (SELECT 1 FROM public.subcategories s WHERE s.category_id = c.id AND s.slug = 'tennis-bracelet');

INSERT INTO public.subcategories (category_id, name, slug, sort_order, active)
SELECT c.id, 'Everyday Bracelet', 'everyday-bracelet', 4, true
FROM public.categories c WHERE c.slug = 'bracelets'
AND NOT EXISTS (SELECT 1 FROM public.subcategories s WHERE s.category_id = c.id AND s.slug = 'everyday-bracelet');

-- 6. CLEAR OLD NAV ITEMS — Deactivate old categories not in the new 7
-- (Mangalsutra, Pendants, Bangles, Wedding Sets)
UPDATE public.categories SET active = false
WHERE slug IN ('mangalsutra', 'pendants', 'bangles', 'wedding-sets')
  AND active = true;

-- 7. UPDATE "Necklaces" (plural) to "Necklace" (singular) if slug differs
-- This is handled by the INSERT above (slug 'necklace' vs existing 'necklaces')
-- The old 'necklaces' category is kept inactive
UPDATE public.categories SET active = false
WHERE slug = 'necklaces' AND active = true;
