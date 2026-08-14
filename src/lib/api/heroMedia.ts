import { supabase } from "../supabase";

const db = () => supabase as any;

export interface HeroStat {
  number: string;
  label: string;
}

export interface HeroMediaItem {
  id: string;
  name: string;
  media_type: "image" | "video";
  media_url: string;
  badge: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  title: string | null;
  highlight: string | null;
  description: string | null;
  price: string | null;
  best_seller_label: string | null;
  primary_cta_text: string | null;
  primary_cta_link: string | null;
  secondary_cta_text: string | null;
  secondary_cta_link: string | null;
  product_id: string | null;
  stats: HeroStat[] | null;
}

export interface HeroMediaInput {
  name: string;
  media_type: "image" | "video";
  media_url: string;
  badge?: string | null;
  sort_order?: number;
  is_active?: boolean;
  title?: string | null;
  highlight?: string | null;
  description?: string | null;
  price?: string | null;
  best_seller_label?: string | null;
  primary_cta_text?: string | null;
  primary_cta_link?: string | null;
  secondary_cta_text?: string | null;
  secondary_cta_link?: string | null;
  product_id?: string | null;
  stats?: HeroStat[] | null;
}

export type HeroContentDefaults = Pick<
  HeroMediaItem,
  | "badge"
  | "title"
  | "highlight"
  | "description"
  | "price"
  | "best_seller_label"
  | "primary_cta_text"
  | "primary_cta_link"
  | "secondary_cta_text"
  | "secondary_cta_link"
  | "product_id"
  | "stats"
>;

export const HERO_DEFAULT_CONTENT: HeroContentDefaults[] = [
  {
    badge: "Vadodara's Premier Fine Jewellery",
    title: "Where Every Gem",
    highlight: "Tells Your Story",
    description:
      "Handcrafted fine jewellery for life's most precious moments. From bridal masterpieces to everyday elegance — designed in Vadodara, treasured for generations.",
    price: "₹48,500",
    best_seller_label: "Aarav Solitaire",
    primary_cta_text: "Explore Collections",
    primary_cta_link: "/shop",
    secondary_cta_text: "Visit Our Store",
    secondary_cta_link: "/contact",
    product_id: null,
    stats: [
      { number: "15+", label: "Years of Craft" },
      { number: "50K+", label: "Happy Customers" },
      { number: "100%", label: "Hallmarked Gold" },
    ],
  },
  {
    badge: "Bridal Edit 2025",
    title: "Celebrate Life's",
    highlight: "Golden Moments",
    description:
      "Exquisite bridal sets crafted to make your special day unforgettable. Each piece tells a story of love, tradition, and timeless beauty.",
    price: "Starting ₹12,500",
    best_seller_label: "Aarav Solitaire",
    primary_cta_text: "Explore Collections",
    primary_cta_link: "/shop",
    secondary_cta_text: "Visit Our Store",
    secondary_cta_link: "/contact",
    product_id: null,
    stats: [
      { number: "15+", label: "Years of Craft" },
      { number: "50K+", label: "Happy Customers" },
      { number: "100%", label: "Hallmarked Gold" },
    ],
  },
];

export const heroMediaApi = {
  async list(activeOnly = false): Promise<HeroMediaItem[]> {
    let query = db()
      .from("hero_media")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (activeOnly) query = query.eq("is_active", true);
    const { data, error } = await query;
    if (error) throw error;
    return (data as HeroMediaItem[]) || [];
  },

  async create(input: HeroMediaInput): Promise<HeroMediaItem> {
    const { data, error } = await db().from("hero_media").insert(input).select().single();
    if (error) throw error;
    return data as HeroMediaItem;
  },

  async update(id: string, input: Partial<HeroMediaInput>): Promise<void> {
    const { error } = await db()
      .from("hero_media")
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) throw error;
  },

  async remove(id: string): Promise<void> {
    const { error } = await db().from("hero_media").delete().eq("id", id);
    if (error) throw error;
  },
};