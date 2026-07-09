-- ============================================================
-- Creative Muse Fine Jewellery — Complete Database Schema
-- Run this in the Supabase SQL Editor
-- ============================================================

-- 1. ENUMS
-- ============================================================
CREATE TYPE product_status AS ENUM ('draft', 'active', 'out_of_stock', 'archived');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned', 'refunded');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
CREATE TYPE review_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE subscriber_status AS ENUM ('active', 'unsubscribed');
CREATE TYPE appointment_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');
CREATE TYPE admin_role_name AS ENUM ('super_admin', 'admin', 'content_manager', 'product_manager', 'order_manager', 'support_staff');

-- 2. ADMIN & SECURITY
-- ============================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE admin_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  permissions JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE admin_role_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES admin_roles(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role_id)
);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  old_values JSONB,
  new_values JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. CATEGORIES & COLLECTIONS
-- ============================================================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image TEXT,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  sort_order INT NOT NULL DEFAULT 0,
  featured BOOLEAN NOT NULL DEFAULT false,
  active BOOLEAN NOT NULL DEFAULT true,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  featured BOOLEAN NOT NULL DEFAULT false,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. PRODUCTS
-- ============================================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  sku TEXT UNIQUE,
  short_description TEXT,
  full_description TEXT,
  current_price DECIMAL(12,2) NOT NULL CHECK (current_price >= 0),
  original_price DECIMAL(12,2) CHECK (original_price >= 0),
  cost_price DECIMAL(12,2) CHECK (cost_price >= 0),
  discount_percentage DECIMAL(5,2) CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
  badge TEXT,
  status product_status NOT NULL DEFAULT 'draft',
  stock_quantity INT CHECK (stock_quantity >= 0),
  low_stock_threshold INT DEFAULT 5,
  material TEXT,
  metal_type TEXT,
  metal_colour TEXT,
  gold_purity TEXT,
  gross_weight TEXT,
  net_weight TEXT,
  gemstone TEXT,
  certification_type TEXT,
  certification_number TEXT,
  rating_average DECIMAL(3,2) NOT NULL DEFAULT 0,
  review_count INT NOT NULL DEFAULT 0,
  featured BOOLEAN NOT NULL DEFAULT false,
  best_seller BOOLEAN NOT NULL DEFAULT false,
  new_arrival BOOLEAN NOT NULL DEFAULT false,
  trending BOOLEAN NOT NULL DEFAULT false,
  wedding BOOLEAN NOT NULL DEFAULT false,
  seo_title TEXT,
  seo_description TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES profiles(id),
  updated_by UUID REFERENCES profiles(id)
);

CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_featured ON products(featured) WHERE featured = true;
CREATE INDEX idx_products_best_seller ON products(best_seller) WHERE best_seller = true;
CREATE INDEX idx_products_category ON products(id);

CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_main BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_product_images_product ON product_images(product_id);

CREATE TABLE product_360_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  frame_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_product_360_product ON product_360_images(product_id);

CREATE TABLE product_categories (
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, category_id)
);

CREATE TABLE product_collections (
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, collection_id)
);

-- 5. HOMEPAGE & CONTENT
-- ============================================================
CREATE TABLE homepage_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT NOT NULL UNIQUE,
  title TEXT,
  subtitle TEXT,
  content JSONB NOT NULL DEFAULT '{}',
  is_published BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  description TEXT,
  image TEXT,
  link TEXT,
  cta_text TEXT,
  banner_type TEXT NOT NULL DEFAULT 'promo',
  sort_order INT NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  city TEXT,
  rating INT NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  review TEXT NOT NULL,
  image TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. COMMERCE
-- ============================================================
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,
  total_orders INT NOT NULL DEFAULT 0,
  total_spent DECIMAL(12,2) NOT NULL DEFAULT 0,
  account_status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  customer_id UUID REFERENCES customers(id),
  customer_email TEXT,
  customer_name TEXT,
  total_amount DECIMAL(12,2) NOT NULL,
  discount_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  coupon_code TEXT,
  payment_status payment_status NOT NULL DEFAULT 'pending',
  order_status order_status NOT NULL DEFAULT 'pending',
  shipping_address JSONB,
  tracking_id TEXT,
  courier TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  product_name TEXT NOT NULL,
  product_sku TEXT,
  product_image TEXT,
  quantity INT NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(12,2) NOT NULL,
  total_price DECIMAL(12,2) NOT NULL,
  variant_info JSONB
);

CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(order_status);

-- 7. MARKETING
-- ============================================================
CREATE TABLE newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  source TEXT,
  status subscriber_status NOT NULL DEFAULT 'active',
  discount_code TEXT,
  consent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  email TEXT,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  images TEXT[] NOT NULL DEFAULT '{}',
  status review_status NOT NULL DEFAULT 'pending',
  is_verified_purchase BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_status ON reviews(status);

CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(12,2) NOT NULL CHECK (discount_value > 0),
  min_cart_value DECIMAL(12,2),
  max_discount DECIMAL(12,2),
  start_date TIMESTAMPTZ,
  expiry_date TIMESTAMPTZ,
  total_usage_limit INT,
  per_user_usage_limit INT,
  first_order_only BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. ENQUIRIES & APPOINTMENTS
-- ============================================================
CREATE TABLE enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  preferred_date DATE,
  preferred_time TIME,
  message TEXT,
  status appointment_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. SETTINGS & MEDIA
-- ============================================================
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  filename TEXT NOT NULL,
  alt_text TEXT,
  mime_type TEXT,
  file_size BIGINT,
  width INT,
  height INT,
  uploaded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_role_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_360_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- 10a. Public read policies
-- Anyone can read active products
CREATE POLICY "Anyone can read active products" ON products
  FOR SELECT USING (status = 'active');

-- Anyone can read active categories
CREATE POLICY "Anyone can read active categories" ON categories
  FOR SELECT USING (active = true);

-- Anyone can read active collections
CREATE POLICY "Anyone can read active collections" ON collections
  FOR SELECT USING (active = true);

-- Anyone can read published homepage sections
CREATE POLICY "Anyone can read published homepage sections" ON homepage_sections
  FOR SELECT USING (is_published = true);

-- Anyone can read active banners
CREATE POLICY "Anyone can read active banners" ON banners
  FOR SELECT USING (active = true);

-- Anyone can read published testimonials
CREATE POLICY "Anyone can read published testimonials" ON testimonials
  FOR SELECT USING (is_published = true);

-- Anyone can read published FAQs
CREATE POLICY "Anyone can read published FAQs" ON faqs
  FOR SELECT USING (is_published = true);

-- Anyone can read approved reviews
CREATE POLICY "Anyone can read approved reviews" ON reviews
  FOR SELECT USING (status = 'approved');

-- 10b. Product images are public (linked to active products)
CREATE POLICY "Anyone can read product images" ON product_images
  FOR SELECT USING (true);

-- 10c. Newsletter insert policy (anyone can subscribe)
CREATE POLICY "Anyone can subscribe to newsletter" ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);

-- 10d. Enquiries insert policy (anyone can submit)
CREATE POLICY "Anyone can submit an enquiry" ON enquiries
  FOR INSERT WITH CHECK (true);

-- 10e. Appointments insert policy (anyone can book)
CREATE POLICY "Anyone can book an appointment" ON appointments
  FOR INSERT WITH CHECK (true);

-- 11. ADMIN RLS HELPER
-- ============================================================
-- Function to check if a user has admin role
CREATE OR REPLACE FUNCTION public.has_admin_role(required_role TEXT DEFAULT NULL)
RETURNS BOOLEAN AS $$
DECLARE
  has_role BOOLEAN;
BEGIN
  IF required_role IS NULL THEN
    SELECT EXISTS (
      SELECT 1 FROM admin_role_assignments ara
      JOIN admin_roles ar ON ara.role_id = ar.id
      WHERE ara.user_id = auth.uid()
    ) INTO has_role;
  ELSE
    SELECT EXISTS (
      SELECT 1 FROM admin_role_assignments ara
      JOIN admin_roles ar ON ara.role_id = ar.id
      WHERE ara.user_id = auth.uid() AND ar.name = required_role
    ) INTO has_role;
  END IF;
  RETURN has_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin can read/write everything (policies use the helper)
-- For simplicity, we add one broad admin policy per table.
-- Fine-grained role-based policies can be added on top.

-- Example: Admin full access to products
CREATE POLICY "Admin full access to products" ON products
  FOR ALL USING (public.has_admin_role())
  WITH CHECK (public.has_admin_role());

-- Admin full access to categories
CREATE POLICY "Admin full access to categories" ON categories
  FOR ALL USING (public.has_admin_role())
  WITH CHECK (public.has_admin_role());

-- Admin full access to collections
CREATE POLICY "Admin full access to collections" ON collections
  FOR ALL USING (public.has_admin_role())
  WITH CHECK (public.has_admin_role());

-- Admin full access to product images
CREATE POLICY "Admin full access to product images" ON product_images
  FOR ALL USING (public.has_admin_role())
  WITH CHECK (public.has_admin_role());

-- Admin full access to product 360 images
CREATE POLICY "Admin full access to product 360 images" ON product_360_images
  FOR ALL USING (public.has_admin_role())
  WITH CHECK (public.has_admin_role());

-- Admin full access to product categories junction
CREATE POLICY "Admin full access to product_categories" ON product_categories
  FOR ALL USING (public.has_admin_role())
  WITH CHECK (public.has_admin_role());

-- Admin full access to product collections junction
CREATE POLICY "Admin full access to product_collections" ON product_collections
  FOR ALL USING (public.has_admin_role())
  WITH CHECK (public.has_admin_role());

-- Admin full access to homepage sections
CREATE POLICY "Admin full access to homepage sections" ON homepage_sections
  FOR ALL USING (public.has_admin_role())
  WITH CHECK (public.has_admin_role());

-- Admin full access to banners
CREATE POLICY "Admin full access to banners" ON banners
  FOR ALL USING (public.has_admin_role())
  WITH CHECK (public.has_admin_role());

-- Admin full access to testimonials
CREATE POLICY "Admin full access to testimonials" ON testimonials
  FOR ALL USING (public.has_admin_role())
  WITH CHECK (public.has_admin_role());

-- Admin full access to FAQs
CREATE POLICY "Admin full access to FAQs" ON faqs
  FOR ALL USING (public.has_admin_role())
  WITH CHECK (public.has_admin_role());

-- Admin full access to reviews
CREATE POLICY "Admin full access to reviews" ON reviews
  FOR ALL USING (public.has_admin_role())
  WITH CHECK (public.has_admin_role());

-- Admin full access to newsletter subscribers
CREATE POLICY "Admin full access to newsletter" ON newsletter_subscribers
  FOR ALL USING (public.has_admin_role())
  WITH CHECK (public.has_admin_role());

-- Admin full access to customers
CREATE POLICY "Admin full access to customers" ON customers
  FOR ALL USING (public.has_admin_role())
  WITH CHECK (public.has_admin_role());

-- Admin full access to orders
CREATE POLICY "Admin full access to orders" ON orders
  FOR ALL USING (public.has_admin_role())
  WITH CHECK (public.has_admin_role());

-- Admin full access to coupons
CREATE POLICY "Admin full access to coupons" ON coupons
  FOR ALL USING (public.has_admin_role())
  WITH CHECK (public.has_admin_role());

-- Admin full access to enquiries
CREATE POLICY "Admin full access to enquiries" ON enquiries
  FOR ALL USING (public.has_admin_role())
  WITH CHECK (public.has_admin_role());

-- Admin full access to appointments
CREATE POLICY "Admin full access to appointments" ON appointments
  FOR ALL USING (public.has_admin_role())
  WITH CHECK (public.has_admin_role());

-- Admin full access to site settings
CREATE POLICY "Admin full access to site settings" ON site_settings
  FOR ALL USING (public.has_admin_role())
  WITH CHECK (public.has_admin_role());

-- Admin full access to media
CREATE POLICY "Admin full access to media" ON media
  FOR ALL USING (public.has_admin_role())
  WITH CHECK (public.has_admin_role());

-- Admin full access to profiles (only their own or all for admins)
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id OR public.has_admin_role());

CREATE POLICY "Admin can update profiles" ON profiles
  FOR UPDATE USING (public.has_admin_role())
  WITH CHECK (public.has_admin_role());

-- Admin roles and assignments (super_admin only)
CREATE POLICY "Super admin can manage roles" ON admin_roles
  FOR ALL USING (public.has_admin_role('super_admin'))
  WITH CHECK (public.has_admin_role('super_admin'));

CREATE POLICY "Super admin can manage role assignments" ON admin_role_assignments
  FOR ALL USING (public.has_admin_role('super_admin'))
  WITH CHECK (public.has_admin_role('super_admin'));

-- Audit logs (admins can read, system inserts via trigger/function)
CREATE POLICY "Admins can read audit logs" ON audit_logs
  FOR SELECT USING (public.has_admin_role());

-- 12. AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 13. SEED DEFAULT ADMIN ROLES
-- ============================================================
INSERT INTO admin_roles (name, description, permissions) VALUES
  ('super_admin', 'Full access to all features', '["*"]'),
  ('admin', 'Manage products, orders, customers, content', '["products", "categories", "orders", "customers", "homepage", "coupons", "newsletter", "reviews"]'),
  ('content_manager', 'Manage homepage, banners, testimonials, FAQ, media', '["homepage", "banners", "testimonials", "faq", "media"]'),
  ('product_manager', 'Manage products, categories, collections, stock, images', '["products", "categories", "collections", "stock", "media"]'),
  ('order_manager', 'Manage orders, payments, shipping', '["orders", "payments", "shipping"]'),
  ('support_staff', 'View customers, enquiries, appointments, reviews', '["customers_read", "enquiries", "appointments", "reviews_read"]')
ON CONFLICT (name) DO NOTHING;

-- 14. SEED CATEGORIES
-- ============================================================
INSERT INTO categories (name, slug, description, sort_order, featured, active) VALUES
  ('Rings', 'rings', 'Engagement rings, solitaires, and everyday bands', 1, true, true),
  ('Necklaces', 'necklaces', 'Statement necklaces, chokers, and layered chains', 2, true, true),
  ('Earrings', 'earrings', 'Jhumkas, drops, studs, and chandeliers', 3, true, true),
  ('Bracelets', 'bracelets', 'Tennis bracelets, bangles, and cuffs', 4, true, true),
  ('Mangalsutra', 'mangalsutra', 'Traditional and contemporary mangalsutra designs', 5, true, true),
  ('Pendants', 'pendants', 'Everyday pendants and lockets', 6, true, true),
  ('Bangles', 'bangles', 'Gold and diamond bangles', 7, true, true),
  ('Wedding Sets', 'wedding-sets', 'Complete bridal jewellery sets', 8, true, true)
ON CONFLICT (slug) DO NOTHING;

-- 15. SEED COLLECTIONS
-- ============================================================
INSERT INTO collections (name, slug, description, sort_order, active) VALUES
  ('Solitaire Classics', 'solitaire-classics', 'Timeless solitaire designs', 1, true),
  ('Pearl Edit', 'pearl-edit', 'Elegant pearl jewellery', 2, true),
  ('Diamond Essentials', 'diamond-essentials', 'Essential diamond pieces', 3, true),
  ('Bridal Heritage', 'bridal-heritage', 'Traditional bridal collections', 4, true),
  ('Everyday Muse', 'everyday-muse', 'Lightweight everyday pieces', 5, true),
  ('Forever Vows', 'forever-vows', 'Wedding and engagement jewellery', 6, true),
  ('Temple Treasures', 'temple-treasures', 'Temple jewellery inspired designs', 7, true)
ON CONFLICT (slug) DO NOTHING;
