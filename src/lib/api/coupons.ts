import { supabase } from "../supabase";

const db = () => supabase as any;

export const couponsApi = {
  async list(): Promise<any[]> {
    const { data, error } = await db().from("coupons").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return (data as any[]) || [];
  },

  async getById(id: string): Promise<any | null> {
    const { data, error } = await db().from("coupons").select("*").eq("id", id).maybeSingle();
    if (error) return null;
    return data as any;
  },

  async create(data: any): Promise<any> {
    const { data: result, error } = await db().from("coupons").insert(data).select().single();
    if (error) throw error;
    return result;
  },

  async update(id: string, data: any): Promise<void> {
    const { error } = await db().from("coupons").update(data).eq("id", id);
    if (error) throw error;
  },

  async delete(id: string): Promise<void> {
    const { error } = await db().from("coupons").delete().eq("id", id);
    if (error) throw error;
  },
};
