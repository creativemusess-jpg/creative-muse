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
      subcategories: {
        Row: SubcategoryRow;
        Insert: SubcategoryInsert;
        Update: SubcategoryUpdate;
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
      order_notifications: {
        Row: OrderNotificationRow;
        Insert: OrderNotificationInsert;
        Update: OrderNotificationUpdate;
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
      customer_addresses: {
        Row: CustomerAddressRow;
        Insert: CustomerAddressInsert;
        Update: CustomerAddressUpdate;
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
      shoppable_reels: {
        Row: ShoppableReelRow;
        Insert: ShoppableReelInsert;
        Update: ShoppableReelUpdate;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      product_status: "draft" | "active" | "out_of_stock" | "archived";
      order_status:
        | "pending"
        | "confirmed"
        | "processing"
        | "shipped"
        | "out_for_delivery"
        | "delivered"
        | "cancelled"
        | "returned"
        | "refunded";
      payment_status: "pending" | "paid" | "failed" | "refunded";
      review_status: "pending" | "approved" | "rejected";
      subscriber_status: "active" | "unsubscribed";
      appointment_status: "pending" | "confirmed" | "completed" | "cancelled";
      admin_role_name:
        | "super_admin"
        | "admin"
        | "content_manager"
        | "product_manager"
        | "order_manager"
        | "support_staff";
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
  hero_image: string | null;
  hero_video: string | null;
  hero_video_mobile: string | null;
  banner_heading: string | null;
  banner_description: string | null;
  cta_button_text: string | null;
  cta_link: string | null;
  mobile_banner: string | null;
  desktop_banner: string | null;
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
  hero_image?: string | null;
  hero_video?: string | null;
  hero_video_mobile?: string | null;
  banner_heading?: string | null;
  banner_description?: string | null;
  cta_button_text?: string | null;
  cta_link?: string | null;
  mobile_banner?: string | null;
  desktop_banner?: string | null;
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
  hero_image?: string | null;
  hero_video?: string | null;
  hero_video_mobile?: string | null;
  banner_heading?: string | null;
  banner_description?: string | null;
  cta_button_text?: string | null;
  cta_link?: string | null;
  mobile_banner?: string | null;
  desktop_banner?: string | null;
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

export interface SubcategoryRow {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  sort_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SubcategoryInsert {
  id?: string;
  category_id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  sort_order?: number;
  active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface SubcategoryUpdate {
  name?: string;
  slug?: string;
  description?: string | null;
  image?: string | null;
  sort_order?: number;
  active?: boolean;
  updated_at?: string;
}

export interface ProductRow {
  id: string;
  name: string;
  slug: string;
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
  rating_average: number;
  review_count: number;
  seo_title: string | null;
  seo_description: string | null;
  focus_keyword: string | null;
  canonical_url: string | null;
  social_image: string | null;
  image_alt_text: string | null;
  subcategory_id: string | null;
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
  rating_average?: number;
  review_count?: number;
  seo_title?: string | null;
  seo_description?: string | null;
  focus_keyword?: string | null;
  canonical_url?: string | null;
  social_image?: string | null;
  image_alt_text?: string | null;
  subcategory_id?: string | null;
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
  rating_average?: number;
  review_count?: number;
  seo_title?: string | null;
  seo_description?: string | null;
  focus_keyword?: string | null;
  canonical_url?: string | null;
  social_image?: string | null;
  image_alt_text?: string | null;
  subcategory_id?: string | null;
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

export interface AutoScrollSettings {
  autoScrollEnabled?: boolean;
  scrollDirection?: "left" | "right";
  scrollSpeed?: number;
  pauseOnHover?: boolean;
  autoResumeEnabled?: boolean;
  autoResumeDelaySeconds?: number;
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
  auto_scroll_enabled: boolean;
  scroll_direction: string;
  scroll_speed: number;
  pause_on_hover: boolean;
  auto_resume_enabled: boolean;
  auto_resume_delay_seconds: number;
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
  welcome_email_sent_at: string | null;
  first_order_at: string | null;
  updated_at: string | null;
  created_at: string;
}

export interface OrderRow {
  id: string;
  order_number: string;
  checkout_attempt_id: string | null;
  customer_id: string | null;
  customer_email: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  subtotal: number;
  discount_amount: number;
  coupon_code: string | null;
  gift_packaging_enabled: boolean;
  gift_packaging_price: number;
  gift_packaging_name: string;
  gift_message: string;
  shipping_amount: number;
  tax_amount: number;
  total_amount: number;
  payment_method: string | null;
  payment_status: string;
  order_status: string;
  delivery_address: Json | null;
  delivery_method: string | null;
  delivery_state_code: string | null;
  delivery_city: string | null;
  delivery_district: string | null;
  delivery_pincode: string | null;
  delivery_locality: string | null;
  delivery_country_code: string | null;
  shipping_address: Json | null;
  tax_snapshot: Json | null;
  tracking_id: string | null;
  tracking_number: string | null;
  courier: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  invoice_number: string | null;
  invoice_pdf_url: string | null;
  invoice_token: string | null;
  invoice_token_expires_at: string | null;
  cancelled_at: string | null;
  cancelled_by: string | null;
  cancellation_reason: string | null;
  archived_at: string | null;
  archived_by: string | null;
  packed_at: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  actual_delivery_at: string | null;
  estimated_delivery_at: string | null;
  tracking_url: string | null;
  courier_name: string | null;
  shipping_service: string | null;
  shipment_id: string | null;
  package_number: string | null;
  routing_code: string | null;
  package_weight: number | null;
  package_count: number;
  last_notification_at: string | null;
  duplicated_from_id: string | null;
  is_archived: boolean;
}

export interface OrderItemRow {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_image: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
  variant_info: Json | null;
}

export interface OrderNotificationRow {
  id: string;
  order_id: string | null;
  customer_id: string | null;
  notification_type: string;
  idempotency_key: string | null;
  intended_recipient: string | null;
  actual_recipient: string;
  subject: string;
  provider: string | null;
  provider_message_id: string | null;
  status: string;
  attempt_count: number;
  sent_at: string | null;
  delivered_at: string | null;
  failed_at: string | null;
  bounced_at: string | null;
  error_summary: string | null;
  initiated_by: string | null;
  is_test: boolean;
  test_template: string | null;
  test_recipient: string | null;
  source: string;
  metadata: Json;
  created_at: string;
  updated_at: string;
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
  auto_scroll_enabled?: boolean;
  scroll_direction?: string;
  scroll_speed?: number;
  pause_on_hover?: boolean;
  auto_resume_enabled?: boolean;
  auto_resume_delay_seconds?: number;
}

export interface HomepageSectionUpdate {
  title?: string | null;
  subtitle?: string | null;
  content?: Json;
  is_published?: boolean;
  sort_order?: number;
  updated_at?: string;
  auto_scroll_enabled?: boolean;
  scroll_direction?: string;
  scroll_speed?: number;
  pause_on_hover?: boolean;
  auto_resume_enabled?: boolean;
  auto_resume_delay_seconds?: number;
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
  welcome_email_sent_at?: string | null;
  first_order_at?: string | null;
  updated_at?: string | null;
}

export interface CustomerAddressRow {
  id: string;
  customer_id: string;
  full_name: string;
  phone: string;
  email: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  postal_code: string;
  landmark: string;
  address_type: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface CustomerAddressInsert {
  id?: string;
  customer_id: string;
  full_name?: string;
  phone?: string;
  email?: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  landmark?: string;
  address_type?: string;
  is_default?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CustomerAddressUpdate {
  full_name?: string;
  phone?: string;
  email?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  landmark?: string;
  address_type?: string;
  is_default?: boolean;
  updated_at?: string;
}

export interface OrderInsert {
  id?: string;
  order_number: string;
  checkout_attempt_id?: string | null;
  customer_id?: string | null;
  customer_email?: string | null;
  customer_name?: string | null;
  customer_phone?: string | null;
  subtotal?: number;
  total_amount: number;
  discount_amount?: number;
  coupon_code?: string | null;
  gift_packaging_enabled?: boolean;
  gift_packaging_price?: number;
  gift_packaging_name?: string;
  gift_message?: string;
  shipping_amount?: number;
  tax_amount?: number;
  tax_snapshot?: Json | null;
  payment_method?: string | null;
  payment_status?: string;
  order_status?: string;
  delivery_address?: Json | null;
  delivery_method?: string | null;
  delivery_state_code?: string | null;
  delivery_city?: string | null;
  delivery_district?: string | null;
  delivery_pincode?: string | null;
  delivery_locality?: string | null;
  delivery_country_code?: string | null;
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
  customer_phone?: string | null;
  subtotal?: number;
  total_amount?: number;
  discount_amount?: number;
  gift_packaging_enabled?: boolean;
  gift_packaging_price?: number;
  gift_packaging_name?: string;
  gift_message?: string;
  shipping_amount?: number;
  tax_amount?: number;
  tax_snapshot?: Json | null;
  payment_method?: string | null;
  payment_status?: string;
  order_status?: string;
  delivery_address?: Json | null;
  delivery_method?: string | null;
  delivery_state_code?: string | null;
  delivery_city?: string | null;
  delivery_district?: string | null;
  delivery_pincode?: string | null;
  delivery_locality?: string | null;
  delivery_country_code?: string | null;
  shipping_address?: Json | null;
  tracking_id?: string | null;
  tracking_number?: string | null;
  courier?: string | null;
  notes?: string | null;
  invoice_number?: string | null;
  invoice_pdf_url?: string | null;
  invoice_token?: string | null;
  invoice_token_expires_at?: string | null;
  cancelled_at?: string | null;
  cancelled_by?: string | null;
  cancellation_reason?: string | null;
  packed_at?: string | null;
  shipped_at?: string | null;
  delivered_at?: string | null;
  actual_delivery_at?: string | null;
  estimated_delivery_at?: string | null;
  tracking_url?: string | null;
  courier_name?: string | null;
  shipping_service?: string | null;
  shipment_id?: string | null;
  package_number?: string | null;
  routing_code?: string | null;
  package_weight?: number | null;
  package_count?: number;
  last_notification_at?: string | null;
  duplicated_from_id?: string | null;
  is_archived?: boolean;
  archived_at?: string | null;
  archived_by?: string | null;
}

export interface OrderItemInsert {
  id?: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_image?: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
  variant_info?: Json | null;
}

export interface OrderItemUpdate {
  product_name?: string;
  product_image?: string | null;
  quantity?: number;
  unit_price?: number;
  total_price?: number;
  variant_info?: Json | null;
}

export interface OrderNotificationInsert {
  id?: string;
  order_id?: string | null;
  customer_id?: string | null;
  notification_type: string;
  idempotency_key?: string | null;
  intended_recipient?: string | null;
  actual_recipient: string;
  subject: string;
  provider?: string | null;
  provider_message_id?: string | null;
  status?: string;
  attempt_count?: number;
  sent_at?: string | null;
  delivered_at?: string | null;
  failed_at?: string | null;
  bounced_at?: string | null;
  error_summary?: string | null;
  initiated_by?: string | null;
  is_test?: boolean;
  test_template?: string | null;
  test_recipient?: string | null;
  source?: string;
  metadata?: Json;
  created_at?: string;
  updated_at?: string;
}

export interface OrderNotificationUpdate {
  order_id?: string | null;
  customer_id?: string | null;
  notification_type?: string;
  idempotency_key?: string | null;
  intended_recipient?: string | null;
  actual_recipient?: string;
  subject?: string;
  provider?: string | null;
  provider_message_id?: string | null;
  status?: string;
  attempt_count?: number;
  sent_at?: string | null;
  delivered_at?: string | null;
  failed_at?: string | null;
  bounced_at?: string | null;
  error_summary?: string | null;
  initiated_by?: string | null;
  is_test?: boolean;
  test_template?: string | null;
  test_recipient?: string | null;
  source?: string;
  metadata?: Json;
  updated_at?: string;
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

export interface ShoppableReelRow {
  id: string;
  video_url: string;
  poster_url: string | null;
  product_id: string;
  sort_order: number;
  is_active: boolean;
  alt_text: string | null;
  created_at: string;
  updated_at: string;
}

export interface ShoppableReelInsert {
  id?: string;
  video_url: string;
  poster_url?: string | null;
  product_id: string;
  sort_order?: number;
  is_active?: boolean;
  alt_text?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ShoppableReelUpdate {
  video_url?: string;
  poster_url?: string | null;
  product_id?: string;
  sort_order?: number;
  is_active?: boolean;
  alt_text?: string | null;
  updated_at?: string;
}

export interface ProductFlagRow {
  id: string;
  name: string;
  slug: string;
  badge_label: string | null;
  badge_bg_color: string;
  badge_text_color: string;
  badge_border_color: string | null;
  icon: string | null;
  priority: number;
  status: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProductFlagInsert {
  id?: string;
  name: string;
  slug: string;
  badge_label?: string | null;
  badge_bg_color?: string;
  badge_text_color?: string;
  badge_border_color?: string | null;
  icon?: string | null;
  priority?: number;
  status?: string;
  display_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ProductFlagUpdate {
  name?: string;
  slug?: string;
  badge_label?: string | null;
  badge_bg_color?: string;
  badge_text_color?: string;
  badge_border_color?: string | null;
  icon?: string | null;
  priority?: number;
  status?: string;
  display_order?: number;
  updated_at?: string;
}

export interface ProductProductFlagRow {
  product_id: string;
  flag_id: string;
  created_at: string;
}

export interface SpecificationDefinitionRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  field_type: string;
  options: any;
  placeholder: string | null;
  is_required: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface SpecificationDefinitionInsert {
  id?: string;
  name: string;
  slug: string;
  description?: string | null;
  field_type?: string;
  options?: any;
  placeholder?: string | null;
  is_required?: boolean;
  is_active?: boolean;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface SpecificationDefinitionUpdate {
  name?: string;
  slug?: string;
  description?: string | null;
  field_type?: string;
  options?: any;
  placeholder?: string | null;
  is_required?: boolean;
  is_active?: boolean;
  sort_order?: number;
  updated_at?: string;
}

export interface ProductSpecificationRow {
  id: string;
  product_id: string;
  specification_definition_id: string;
  value: string;
  sort_order: number;
  created_at: string;
}

export interface ProductSpecificationInsert {
  id?: string;
  product_id: string;
  specification_definition_id: string;
  value: string;
  sort_order?: number;
  created_at?: string;
}

export interface ProductSpecificationUpdate {
  value?: string;
  sort_order?: number;
}

export interface AttributeDefinitionRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  field_type: string;
  options: any;
  placeholder: string | null;
  is_required: boolean;
  is_active: boolean;
  sort_order: number;
  category_id: string | null;
  use_as_filter: boolean;
  show_in_product_list: boolean;
  is_searchable: boolean;
  created_at: string;
  updated_at: string;
}

export interface AttributeDefinitionInsert {
  id?: string;
  name: string;
  slug: string;
  description?: string | null;
  field_type?: string;
  options?: any;
  placeholder?: string | null;
  is_required?: boolean;
  is_active?: boolean;
  sort_order?: number;
  category_id?: string | null;
  use_as_filter?: boolean;
  show_in_product_list?: boolean;
  is_searchable?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AttributeDefinitionUpdate {
  name?: string;
  slug?: string;
  description?: string | null;
  field_type?: string;
  options?: any;
  placeholder?: string | null;
  is_required?: boolean;
  is_active?: boolean;
  sort_order?: number;
  category_id?: string | null;
  use_as_filter?: boolean;
  show_in_product_list?: boolean;
  is_searchable?: boolean;
  updated_at?: string;
}

export interface ProductAttributeRow {
  id: string;
  product_id: string;
  attribute_definition_id: string;
  value: string;
  sort_order: number;
  created_at: string;
}

export interface ProductAttributeInsert {
  id?: string;
  product_id: string;
  attribute_definition_id: string;
  value: string;
  sort_order?: number;
  created_at?: string;
}

export interface ProductAttributeUpdate {
  value?: string;
  sort_order?: number;
}

export interface CouponScopeRow {
  id: string;
  coupon_id: string;
  scope_type: string;
  scope_id: string | null;
  scope_label: string | null;
  rule_type: string;
  created_at: string;
}

export interface CouponScopeInsert {
  id?: string;
  coupon_id: string;
  scope_type: string;
  scope_id?: string | null;
  scope_label?: string | null;
  rule_type?: string;
  created_at?: string;
}

export interface CouponRestrictionRow {
  id: string;
  coupon_id: string;
  restriction_type: string;
  restriction_value: string;
  created_at: string;
}

export interface CouponRestrictionInsert {
  id?: string;
  coupon_id: string;
  restriction_type: string;
  restriction_value: string;
  created_at?: string;
}
