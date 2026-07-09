export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
      };
      admin_roles: {
        Row: AdminRoleRow;
        Insert: AdminRoleInsert;
        Update: AdminRoleUpdate;
      };
      admin_role_assignments: {
        Row: AdminRoleAssignmentRow;
        Insert: AdminRoleAssignmentInsert;
        Update: AdminRoleAssignmentUpdate;
      };
      audit_logs: {
        Row: AuditLogRow;
        Insert: AuditLogInsert;
        Update: AuditLogUpdate;
      };
      categories: {
        Row: CategoryRow;
        Insert: CategoryInsert;
        Update: CategoryUpdate;
      };
      collections: {
        Row: CollectionRow;
        Insert: CollectionInsert;
        Update: CollectionUpdate;
      };
      products: {
        Row: ProductRow;
        Insert: ProductInsert;
        Update: ProductUpdate;
      };
      product_images: {
        Row: ProductImageRow;
        Insert: ProductImageInsert;
        Update: ProductImageUpdate;
      };
      product_360_images: {
        Row: Product360ImageRow;
        Insert: Product360ImageInsert;
        Update: Product360ImageUpdate;
      };
      product_categories: {
        Row: ProductCategoryRow;
        Insert: ProductCategoryInsert;
        Update: ProductCategoryUpdate;
      };
      product_collections: {
        Row: ProductCollectionRow;
        Insert: ProductCollectionInsert;
        Update: ProductCollectionUpdate;
      };
      homepage_sections: {
        Row: HomepageSectionRow;
        Insert: HomepageSectionInsert;
        Update: HomepageSectionUpdate;
      };
      banners: {
        Row: BannerRow;
        Insert: BannerInsert;
        Update: BannerUpdate;
      };
      testimonials: {
        Row: TestimonialRow;
        Insert: TestimonialInsert;
        Update: TestimonialUpdate;
      };
      faqs: {
        Row: FaqRow;
        Insert: FaqInsert;
        Update: FaqUpdate;
      };
      newsletter_subscribers: {
        Row: NewsletterSubscriberRow;
        Insert: NewsletterSubscriberInsert;
        Update: NewsletterSubscriberUpdate;
      };
      reviews: {
        Row: ReviewRow;
        Insert: ReviewInsert;
        Update: ReviewUpdate;
      };
      customers: {
        Row: CustomerRow;
        Insert: CustomerInsert;
        Update: CustomerUpdate;
      };
      orders: {
        Row: OrderRow;
        Insert: OrderInsert;
        Update: OrderUpdate;
      };
      order_items: {
        Row: OrderItemRow;
        Insert: OrderItemInsert;
        Update: OrderItemUpdate;
      };
      coupons: {
        Row: CouponRow;
        Insert: CouponInsert;
        Update: CouponUpdate;
      };
      enquiries: {
        Row: EnquiryRow;
        Insert: EnquiryInsert;
        Update: EnquiryUpdate;
      };
      appointments: {
        Row: AppointmentRow;
        Insert: AppointmentInsert;
        Update: AppointmentUpdate;
      };
      site_settings: {
        Row: SiteSettingRow;
        Insert: SiteSettingInsert;
        Update: SiteSettingUpdate;
      };
      media: {
        Row: MediaRow;
        Insert: MediaInsert;
        Update: MediaUpdate;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      product_status: "draft" | "active" | "out_of_stock" | "archived";
      order_status: "pending" | "confirmed" | "processing" | "shipped" | "out_for_delivery" | "delivered" | "cancelled" | "returned" | "refunded";
      payment_status: "pending" | "paid" | "failed" | "refunded";
      review_status: "pending" | "approved" | "rejected";
      subscriber_status: "active" | "unsubscribed";
      appointment_status: "pending" | "confirmed" | "completed" | "cancelled";
      admin_role_name: "super_admin" | "admin" | "content_manager" | "product_manager" | "order_manager" | "support_staff";
    };
  };
}

export interface ProfileRow {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProfileInsert {
  id: string;
  email: string;
  full_name?: string | null;
  avatar_url?: string | null;
  phone?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ProfileUpdate {
  full_name?: string | null;
  avatar_url?: string | null;
  phone?: string | null;
  updated_at?: string;
}

export interface AdminRoleRow {
  id: string;
  name: string;
  description: string | null;
  permissions: string[];
  created_at: string;
}

export interface AdminRoleInsert {
  id?: string;
  name: string;
  description?: string | null;
  permissions?: string[];
  created_at?: string;
}

export interface AdminRoleUpdate {
  name?: string;
  description?: string | null;
  permissions?: string[];
}

export interface AdminRoleAssignmentRow {
  id: string;
  user_id: string;
  role_id: string;
  assigned_by: string | null;
  created_at: string;
}

export interface AdminRoleAssignmentInsert {
  id?: string;
  user_id: string;
  role_id: string;
  assigned_by?: string | null;
  created_at?: string;
}

export interface AdminRoleAssignmentUpdate {
  role_id?: string;
  assigned_by?: string | null;
}

export interface AuditLogRow {
  id: string;
  user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  old_values: Json | null;
  new_values: Json | null;
  ip_address: string | null;
  created_at: string;
}

export interface AuditLogInsert {
  id?: string;
  user_id?: string | null;
  action: string;
  entity_type: string;
  entity_id?: string | null;
  old_values?: Json | null;
  new_values?: Json | null;
  ip_address?: string | null;
  created_at?: string;
}

export interface AuditLogUpdate {
  action?: string;
  entity_type?: string;
  entity_id?: string | null;
  old_values?: Json | null;
  new_values?: Json | null;
}

export interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  parent_id: string | null;
  sort_order: number;
  featured: boolean;
  active: boolean;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
}

export interface CategoryInsert {
  id?: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  parent_id?: string | null;
  sort_order?: number;
  featured?: boolean;
  active?: boolean;
  seo_title?: string | null;
  seo_description?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CategoryUpdate {
  name?: string;
  slug?: string;
  description?: string | null;
  image?: string | null;
  parent_id?: string | null;
  sort_order?: number;
  featured?: boolean;
  active?: boolean;
  seo_title?: string | null;
  seo_description?: string | null;
  updated_at?: string;
}

export interface CollectionRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  sort_order: number;
  featured: boolean;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductRow {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  short_description: string | null;
  full_description: string | null;
  current_price: number;
  original_price: number | null;
  cost_price: number | null;
  discount_percentage: number | null;
  badge: string | null;
  status: string;
  stock_quantity: number | null;
  low_stock_threshold: number | null;
  material: string | null;
  metal_type: string | null;
  metal_colour: string | null;
  gold_purity: string | null;
  gross_weight: string | null;
  net_weight: string | null;
  gemstone: string | null;
  certification_type: string | null;
  certification_number: string | null;
  rating_average: number;
  review_count: number;
  featured: boolean;
  best_seller: boolean;
  new_arrival: boolean;
  trending: boolean;
  wedding: boolean;
  seo_title: string | null;
  seo_description: string | null;
  tags: string[];
  published_at: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}

export interface ProductInsert {
  id?: string;
  name: string;
  slug: string;
  sku?: string | null;
  short_description?: string | null;
  full_description?: string | null;
  current_price: number;
  original_price?: number | null;
  cost_price?: number | null;
  discount_percentage?: number | null;
  badge?: string | null;
  status?: string;
  stock_quantity?: number | null;
  low_stock_threshold?: number | null;
  material?: string | null;
  metal_type?: string | null;
  metal_colour?: string | null;
  gold_purity?: string | null;
  gross_weight?: string | null;
  net_weight?: string | null;
  gemstone?: string | null;
  certification_type?: string | null;
  certification_number?: string | null;
  rating_average?: number;
  review_count?: number;
  featured?: boolean;
  best_seller?: boolean;
  new_arrival?: boolean;
  trending?: boolean;
  wedding?: boolean;
  seo_title?: string | null;
  seo_description?: string | null;
  tags?: string[];
  published_at?: string | null;
  created_at?: string;
  updated_at?: string;
  created_by?: string | null;
  updated_by?: string | null;
}

export interface ProductUpdate {
  name?: string;
  slug?: string;
  sku?: string | null;
  short_description?: string | null;
  full_description?: string | null;
  current_price?: number;
  original_price?: number | null;
  cost_price?: number | null;
  discount_percentage?: number | null;
  badge?: string | null;
  status?: string;
  stock_quantity?: number | null;
  low_stock_threshold?: number | null;
  material?: string | null;
  metal_type?: string | null;
  metal_colour?: string | null;
  gold_purity?: string | null;
  gross_weight?: string | null;
  net_weight?: string | null;
  gemstone?: string | null;
  certification_type?: string | null;
  certification_number?: string | null;
  rating_average?: number;
  review_count?: number;
  featured?: boolean;
  best_seller?: boolean;
  new_arrival?: boolean;
  trending?: boolean;
  wedding?: boolean;
  seo_title?: string | null;
  seo_description?: string | null;
  tags?: string[];
  published_at?: string | null;
  updated_at?: string;
  created_by?: string | null;
  updated_by?: string | null;
}

export interface ProductImageRow {
  id: string;
  product_id: string;
  url: string;
  alt_text: string | null;
  sort_order: number;
  is_main: boolean;
  created_at: string;
}

export interface ProductImageInsert {
  id?: string;
  product_id: string;
  url: string;
  alt_text?: string | null;
  sort_order?: number;
  is_main?: boolean;
  created_at?: string;
}

export interface ProductImageUpdate {
  url?: string;
  alt_text?: string | null;
  sort_order?: number;
  is_main?: boolean;
}

export interface Product360ImageRow {
  id: string;
  product_id: string;
  url: string;
  frame_order: number;
  created_at: string;
}

export interface ProductCategoryRow {
  product_id: string;
  category_id: string;
}

export interface ProductCollectionRow {
  product_id: string;
  collection_id: string;
}

export interface HomepageSectionRow {
  id: string;
  section_key: string;
  title: string | null;
  subtitle: string | null;
  content: Json;
  is_published: boolean;
  sort_order: number;
  updated_at: string;
}

export interface BannerRow {
  id: string;
  title: string | null;
  description: string | null;
  image: string | null;
  link: string | null;
  cta_text: string | null;
  banner_type: string;
  sort_order: number;
  active: boolean;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface TestimonialRow {
  id: string;
  customer_name: string;
  city: string | null;
  rating: number;
  review: string;
  image: string | null;
  is_published: boolean;
  sort_order: number;
  created_at: string;
}

export interface FaqRow {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface NewsletterSubscriberRow {
  id: string;
  email: string;
  source: string | null;
  status: string;
  discount_code: string | null;
  consent: boolean;
  created_at: string;
}

export interface ReviewRow {
  id: string;
  product_id: string;
  customer_name: string;
  email: string | null;
  rating: number;
  review: string | null;
  images: string[];
  status: string;
  is_verified_purchase: boolean;
  created_at: string;
}

export interface CustomerRow {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  total_orders: number;
  total_spent: number;
  account_status: string;
  created_at: string;
}

export interface OrderRow {
  id: string;
  order_number: string;
  customer_id: string | null;
  customer_email: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  subtotal: number;
  discount_amount: number;
  coupon_code: string | null;
  shipping_amount: number;
  tax_amount: number;
  total_amount: number;
  payment_method: string | null;
  payment_status: string;
  order_status: string;
  delivery_address: Json | null;
  shipping_address: Json | null;
  tracking_id: string | null;
  courier: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItemRow {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_sku: string | null;
  product_image: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
  variant_info: Json | null;
}

export interface CouponRow {
  id: string;
  code: string;
  description: string | null;
  discount_type: string;
  discount_value: number;
  min_cart_value: number | null;
  max_discount: number | null;
  start_date: string | null;
  expiry_date: string | null;
  total_usage_limit: number | null;
  per_user_usage_limit: number | null;
  first_order_only: boolean;
  is_active: boolean;
  created_at: string;
}

export interface EnquiryRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface AppointmentRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  preferred_date: string | null;
  preferred_time: string | null;
  message: string | null;
  status: string;
  created_at: string;
}

export interface SiteSettingRow {
  id: string;
  setting_key: string;
  setting_value: Json;
  updated_at: string;
}

export interface MediaRow {
  id: string;
  url: string;
  filename: string;
  alt_text: string | null;
  mime_type: string | null;
  file_size: number | null;
  width: number | null;
  height: number | null;
  uploaded_by: string | null;
  created_at: string;
}

export interface CollectionInsert {
  id?: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  sort_order?: number;
  featured?: boolean;
  active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CollectionUpdate {
  name?: string;
  slug?: string;
  description?: string | null;
  image?: string | null;
  sort_order?: number;
  featured?: boolean;
  active?: boolean;
}

export interface Product360ImageInsert {
  id?: string;
  product_id: string;
  url: string;
  frame_order?: number;
  created_at?: string;
}

export interface Product360ImageUpdate {
  url?: string;
  frame_order?: number;
}

export interface ProductCategoryInsert {
  product_id: string;
  category_id: string;
}

export interface ProductCategoryUpdate {
  product_id?: string;
  category_id?: string;
}

export interface ProductCollectionInsert {
  product_id: string;
  collection_id: string;
}

export interface ProductCollectionUpdate {
  product_id?: string;
  collection_id?: string;
}

export interface HomepageSectionInsert {
  id?: string;
  section_key: string;
  title?: string | null;
  subtitle?: string | null;
  content?: Json;
  is_published?: boolean;
  sort_order?: number;
  updated_at?: string;
}

export interface HomepageSectionUpdate {
  title?: string | null;
  subtitle?: string | null;
  content?: Json;
  is_published?: boolean;
  sort_order?: number;
  updated_at?: string;
}

export interface BannerInsert {
  id?: string;
  title?: string | null;
  description?: string | null;
  image?: string | null;
  link?: string | null;
  cta_text?: string | null;
  banner_type?: string;
  sort_order?: number;
  active?: boolean;
  start_date?: string | null;
  end_date?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface BannerUpdate {
  title?: string | null;
  description?: string | null;
  image?: string | null;
  link?: string | null;
  cta_text?: string | null;
  banner_type?: string;
  sort_order?: number;
  active?: boolean;
  start_date?: string | null;
  end_date?: string | null;
}

export interface TestimonialInsert {
  id?: string;
  customer_name: string;
  city?: string | null;
  rating?: number;
  review: string;
  image?: string | null;
  is_published?: boolean;
  sort_order?: number;
  created_at?: string;
}

export interface TestimonialUpdate {
  customer_name?: string;
  city?: string | null;
  rating?: number;
  review?: string;
  image?: string | null;
  is_published?: boolean;
  sort_order?: number;
}

export interface FaqInsert {
  id?: string;
  question: string;
  answer: string;
  sort_order?: number;
  is_published?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface FaqUpdate {
  question?: string;
  answer?: string;
  sort_order?: number;
  is_published?: boolean;
}

export interface NewsletterSubscriberInsert {
  id?: string;
  email: string;
  source?: string | null;
  status?: string;
  discount_code?: string | null;
  consent?: boolean;
  created_at?: string;
}

export interface NewsletterSubscriberUpdate {
  source?: string | null;
  status?: string;
  discount_code?: string | null;
}

export interface ReviewInsert {
  id?: string;
  product_id: string;
  customer_name: string;
  email?: string | null;
  rating: number;
  review?: string | null;
  images?: string[];
  status?: string;
  is_verified_purchase?: boolean;
  created_at?: string;
}

export interface ReviewUpdate {
  customer_name?: string;
  email?: string | null;
  rating?: number;
  review?: string | null;
  images?: string[];
  status?: string;
  is_verified_purchase?: boolean;
}

export interface CustomerInsert {
  id?: string;
  email: string;
  full_name?: string | null;
  phone?: string | null;
  total_orders?: number;
  total_spent?: number;
  account_status?: string;
  created_at?: string;
}

export interface CustomerUpdate {
  full_name?: string | null;
  phone?: string | null;
  total_orders?: number;
  total_spent?: number;
  account_status?: string;
}

export interface OrderInsert {
  id?: string;
  order_number: string;
  customer_id?: string | null;
  customer_email?: string | null;
  customer_name?: string | null;
  total_amount: number;
  discount_amount?: number;
  coupon_code?: string | null;
  payment_status?: string;
  order_status?: string;
  shipping_address?: Json | null;
  tracking_id?: string | null;
  courier?: string | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface OrderUpdate {
  customer_email?: string | null;
  customer_name?: string | null;
  total_amount?: number;
  discount_amount?: number;
  payment_status?: string;
  order_status?: string;
  shipping_address?: Json | null;
  tracking_id?: string | null;
  courier?: string | null;
  notes?: string | null;
}

export interface OrderItemInsert {
  id?: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_sku?: string | null;
  product_image?: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
  variant_info?: Json | null;
}

export interface OrderItemUpdate {
  product_name?: string;
  product_sku?: string | null;
  product_image?: string | null;
  quantity?: number;
  unit_price?: number;
  total_price?: number;
  variant_info?: Json | null;
}

export interface CouponInsert {
  id?: string;
  code: string;
  description?: string | null;
  discount_type: string;
  discount_value: number;
  min_cart_value?: number | null;
  max_discount?: number | null;
  start_date?: string | null;
  expiry_date?: string | null;
  total_usage_limit?: number | null;
  per_user_usage_limit?: number | null;
  first_order_only?: boolean;
  is_active?: boolean;
  created_at?: string;
}

export interface CouponUpdate {
  code?: string;
  description?: string | null;
  discount_type?: string;
  discount_value?: number;
  min_cart_value?: number | null;
  max_discount?: number | null;
  start_date?: string | null;
  expiry_date?: string | null;
  total_usage_limit?: number | null;
  per_user_usage_limit?: number | null;
  first_order_only?: boolean;
  is_active?: boolean;
}

export interface EnquiryInsert {
  id?: string;
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
  is_read?: boolean;
  created_at?: string;
}

export interface EnquiryUpdate {
  name?: string;
  email?: string;
  phone?: string | null;
  subject?: string | null;
  message?: string;
  is_read?: boolean;
}

export interface AppointmentInsert {
  id?: string;
  name: string;
  email: string;
  phone: string;
  preferred_date?: string | null;
  preferred_time?: string | null;
  message?: string | null;
  status?: string;
  created_at?: string;
}

export interface AppointmentUpdate {
  name?: string;
  email?: string;
  phone?: string;
  preferred_date?: string | null;
  preferred_time?: string | null;
  message?: string | null;
  status?: string;
}

export interface SiteSettingInsert {
  id?: string;
  setting_key: string;
  setting_value: Json;
  updated_at?: string;
}

export interface SiteSettingUpdate {
  setting_key?: string;
  setting_value?: Json;
}

export interface MediaInsert {
  id?: string;
  url: string;
  filename: string;
  alt_text?: string | null;
  mime_type?: string | null;
  file_size?: number | null;
  width?: number | null;
  height?: number | null;
  uploaded_by?: string | null;
  created_at?: string;
}

export interface MediaUpdate {
  url?: string;
  filename?: string;
  alt_text?: string | null;
  mime_type?: string | null;
  file_size?: number | null;
  width?: number | null;
  height?: number | null;
}
