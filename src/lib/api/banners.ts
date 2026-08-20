import { supabase } from "../supabase";

const db = () => supabase as any;

export type BannerStatus = "active" | "archived";

export interface HomepageBanner {
  id: string;
  name: string;
  desktop_image: string;
  tablet_image: string | null;
  mobile_image: string | null;
  button_enabled: boolean;
  button_text: string | null;
  button_url: string | null;
  button_position_x: number | null;
  button_position_y: number | null;
  button_position_mobile_x: number | null;
  button_position_mobile_y: number | null;
  object_position_x: number | null;
  object_position_y: number | null;
  status: BannerStatus;
  display_order: number;
  alt_text: string | null;
  created_at: string;
  updated_at: string;
}

export interface HomepageBannerInput {
  name: string;
  desktop_image: string;
  tablet_image?: string | null;
  mobile_image?: string | null;
  button_enabled?: boolean;
  button_text?: string | null;
  button_url?: string | null;
  button_position_x?: number | null;
  button_position_y?: number | null;
  button_position_mobile_x?: number | null;
  button_position_mobile_y?: number | null;
  object_position_x?: number | null;
  object_position_y?: number | null;
  status?: BannerStatus;
  display_order?: number;
  alt_text?: string | null;
}

export const BANNER_BUTTON_DEFAULT = { x: 50, y: 82 } as const;

export const homepageBannersApi = {
  async list(status?: BannerStatus | "all"): Promise<HomepageBanner[]> {
    let query = db()
      .from("homepage_banners")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (status && status !== "all") query = query.eq("status", status);
    const { data, error } = await query;
    if (error) throw error;
    return (data as HomepageBanner[]) || [];
  },

  async create(input: HomepageBannerInput): Promise<HomepageBanner> {
    const { data, error } = await db().from("homepage_banners").insert(input).select().single();
    if (error) throw error;
    return data as HomepageBanner;
  },

  async update(id: string, input: Partial<HomepageBannerInput>): Promise<void> {
    const { error } = await db()
      .from("homepage_banners")
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) throw error;
  },

  async setStatus(id: string, status: BannerStatus): Promise<void> {
    const { error } = await db()
      .from("homepage_banners")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) throw error;
  },

  async reorder(id: string, displayOrder: number): Promise<void> {
    await this.update(id, { display_order: displayOrder });
  },

  async remove(id: string): Promise<void> {
    const { error } = await db().from("homepage_banners").delete().eq("id", id);
    if (error) throw error;
  },

  async supportsButtonPosition(): Promise<boolean> {
    const { error } = await db().from("homepage_banners").select("id,button_position_x").limit(1);
    return !error;
  },

  async supportsObjectPosition(): Promise<boolean> {
    const { error } = await db().from("homepage_banners").select("id,object_position_x").limit(1);
    return !error;
  },
};

export const BANNER_GUIDE = {
  desktop: { width: 1920, height: 700, ratio: "≈2.74:1" },
  tablet: { width: 1920, height: 700, ratio: "≈2.74:1" },
  mobile: { width: 1080, height: 1350, ratio: "4:5" },
  mobileAlt: { width: 1080, height: 1200, ratio: "9:10" },
} as const;
