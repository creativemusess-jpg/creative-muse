import { supabase } from "../supabase";
import type { ShoppableReelRow, ShoppableReelInsert, ShoppableReelUpdate } from "../db/types";

const db = () => supabase as any;

export const reelsApi = {
  async listActive(): Promise<ShoppableReelRow[]> {
    const { data, error } = await db()
      .from("shoppable_reels")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");
    if (error) throw error;
    return (data as ShoppableReelRow[]) || [];
  },

  async listAll(): Promise<ShoppableReelRow[]> {
    const { data, error } = await db()
      .from("shoppable_reels")
      .select("*")
      .order("sort_order");
    if (error) throw error;
    return (data as ShoppableReelRow[]) || [];
  },

  async get(id: string): Promise<ShoppableReelRow | null> {
    const { data, error } = await db()
      .from("shoppable_reels")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data as ShoppableReelRow | null;
  },

  async create(input: ShoppableReelInsert): Promise<ShoppableReelRow> {
    const { data, error } = await db()
      .from("shoppable_reels")
      .insert({
        ...input,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();
    if (error) throw error;
    return data as ShoppableReelRow;
  },

  async update(id: string, input: ShoppableReelUpdate): Promise<void> {
    const { error } = await db()
      .from("shoppable_reels")
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) throw error;
  },

  async delete(id: string): Promise<void> {
    const { error } = await db()
      .from("shoppable_reels")
      .delete()
      .eq("id", id);
    if (error) throw error;
  },

  async uploadVideo(file: File): Promise<string> {
    const ext = file.name.split(".").pop() || "mp4";
    const fileName = `reels/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const { data, error } = await supabase.storage
      .from("reel-videos")
      .upload(fileName, file, { cacheControl: "31536000", upsert: false });
    if (error) throw new Error(`Video upload failed: ${error.message}`);
    const { data: urlData } = supabase.storage.from("reel-videos").getPublicUrl(data.path);
    return urlData.publicUrl;
  },
};
