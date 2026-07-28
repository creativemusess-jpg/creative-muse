-- ============================================================
-- RLS policies for renamed attribute tables
-- Run after migration-attribute-system.sql
-- ============================================================

-- Attribute Definitions
ALTER TABLE public.attribute_definitions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read active attribute definitions" ON public.attribute_definitions;
CREATE POLICY "Anyone can read active attribute definitions" ON public.attribute_definitions
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin full access to attribute_definitions" ON public.attribute_definitions;
CREATE POLICY "Admin full access to attribute_definitions" ON public.attribute_definitions
  FOR ALL USING (public.has_admin_role())
  WITH CHECK (public.has_admin_role());

-- Product Attributes
ALTER TABLE public.product_attributes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read product_attributes" ON public.product_attributes;
CREATE POLICY "Anyone can read product_attributes" ON public.product_attributes
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin full access to product_attributes" ON public.product_attributes;
CREATE POLICY "Admin full access to product_attributes" ON public.product_attributes
  FOR ALL USING (public.has_admin_role())
  WITH CHECK (public.has_admin_role());
