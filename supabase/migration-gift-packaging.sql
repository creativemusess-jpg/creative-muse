-- Gift Packaging + Estimated Delivery settings & order fields

-- 1. Add gift packaging columns to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS gift_packaging_enabled BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS gift_packaging_price DECIMAL(12,2) NOT NULL DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS gift_packaging_name TEXT NOT NULL DEFAULT '';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS gift_message TEXT NOT NULL DEFAULT '';

-- 2. Seed gift_packaging_config into site_settings
INSERT INTO site_settings (setting_key, setting_value)
SELECT 'gift_packaging_config', jsonb_build_object(
  'enabled', true,
  'name', 'Premium Gift Packaging',
  'description', 'Luxury gift box with ribbon and message card.',
  'price', 199,
  'max_quantity', 1,
  'allow_gift_message', true,
  'max_message_length', 200,
  'default_enabled', false,
  'display_order', 1,
  'status', 'active'
)
WHERE NOT EXISTS (
  SELECT 1 FROM site_settings WHERE setting_key = 'gift_packaging_config'
);

-- 3. Seed estimated_delivery_config into site_settings
INSERT INTO site_settings (setting_key, setting_value)
SELECT 'estimated_delivery_config', jsonb_build_object(
  'enabled', true,
  'min_days', 3,
  'max_days', 5
)
WHERE NOT EXISTS (
  SELECT 1 FROM site_settings WHERE setting_key = 'estimated_delivery_config'
);
