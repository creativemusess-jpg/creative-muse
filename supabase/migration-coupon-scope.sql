-- Add coupon_scope column to coupons table
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS coupon_scope TEXT DEFAULT 'entire_store' CHECK (coupon_scope IN ('entire_store','selected_categories','selected_products'));
