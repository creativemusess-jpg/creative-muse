-- ============================================================
-- Fix: Add RLS policies for PIM system tables
-- ============================================================

-- Product Flags
ALTER TABLE public.product_flags ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read active product flags" ON public.product_flags;
CREATE POLICY "Anyone can read active product flags" ON public.product_flags
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin full access to product_flags" ON public.product_flags;
CREATE POLICY "Admin full access to product_flags" ON public.product_flags
  FOR ALL USING (public.has_admin_role())
  WITH CHECK (public.has_admin_role());

-- Product <-> Product Flags junction
ALTER TABLE public.product_product_flags ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read product_product_flags" ON public.product_product_flags;
CREATE POLICY "Anyone can read product_product_flags" ON public.product_product_flags
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin full access to product_product_flags" ON public.product_product_flags;
CREATE POLICY "Admin full access to product_product_flags" ON public.product_product_flags
  FOR ALL USING (public.has_admin_role())
  WITH CHECK (public.has_admin_role());

-- Specification Definitions
ALTER TABLE public.specification_definitions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read active specification definitions" ON public.specification_definitions;
CREATE POLICY "Anyone can read active specification definitions" ON public.specification_definitions
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin full access to specification_definitions" ON public.specification_definitions;
CREATE POLICY "Admin full access to specification_definitions" ON public.specification_definitions
  FOR ALL USING (public.has_admin_role())
  WITH CHECK (public.has_admin_role());

-- Product Specifications
ALTER TABLE public.product_specifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read product_specifications" ON public.product_specifications;
CREATE POLICY "Anyone can read product_specifications" ON public.product_specifications
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin full access to product_specifications" ON public.product_specifications;
CREATE POLICY "Admin full access to product_specifications" ON public.product_specifications
  FOR ALL USING (public.has_admin_role())
  WITH CHECK (public.has_admin_role());

-- Coupon Scopes
ALTER TABLE public.coupon_scopes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read coupon_scopes" ON public.coupon_scopes;
CREATE POLICY "Anyone can read coupon_scopes" ON public.coupon_scopes
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin full access to coupon_scopes" ON public.coupon_scopes;
CREATE POLICY "Admin full access to coupon_scopes" ON public.coupon_scopes
  FOR ALL USING (public.has_admin_role())
  WITH CHECK (public.has_admin_role());

-- Coupon Restrictions
ALTER TABLE public.coupon_restrictions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read coupon_restrictions" ON public.coupon_restrictions;
CREATE POLICY "Anyone can read coupon_restrictions" ON public.coupon_restrictions
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin full access to coupon_restrictions" ON public.coupon_restrictions;
CREATE POLICY "Admin full access to coupon_restrictions" ON public.coupon_restrictions
  FOR ALL USING (public.has_admin_role())
  WITH CHECK (public.has_admin_role());
