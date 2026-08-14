import { supabase } from "../supabase";

const db = () => supabase as any;

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
}

export interface HeroMediaInput {
  name: string;
  media_type: "image" | "video";
  media_url: string;
  badge?: string | null;
  sort_order?: number;
  is_active?: boolean;
}

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