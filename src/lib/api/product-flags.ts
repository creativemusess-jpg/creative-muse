import { supabase } from "../supabase";

const db = () => supabase as any;

export const productFlagsApi = {
  async list(): Promise<any[]> {
    const { data, error } = await db().from("product_flags").select("*").order("display_order", { ascending: true });
    if (error) throw error;
    return (data as any[]) || [];
  },

  async getById(id: string): Promise<any | null> {
    const { data, error } = await db().from("product_flags").select("*").eq("id", id).maybeSingle();
    if (error) return null;
    return data as any;
  },

  async create(data: any): Promise<any> {
    const { data: result, error } = await db().from("product_flags").insert(data).select().single();
    if (error) throw error;
    return result;
  },

  async update(id: string, data: any): Promise<void> {
    const { error } = await db().from("product_flags").update(data).eq("id", id);
    if (error) throw error;
  },

  async delete(id: string): Promise<void> {
    const { error } = await db().from("product_flags").delete().eq("id", id);
    if (error) throw error;
  },

  async getByProduct(productId: string): Promise<any[]> {
    const { data, error } = await db()
      .from("product_product_flags")
      .select("flag_id, product_flags!inner(*)")
      .eq("product_id", productId);
    if (error) throw error;
    return ((data as any[]) || []).map((r: any) => r.product_flags);
  },

  async setProductFlags(productId: string, flagIds: string[]): Promise<void> {
    const { error: delErr } = await db().from("product_product_flags").delete().eq("product_id", productId);
    if (delErr) throw delErr;
    if (flagIds.length > 0) {
      const rows = flagIds.map((flag_id) => ({ product_id: productId, flag_id }));
      const { error: insErr } = await db().from("product_product_flags").insert(rows);
      if (insErr) throw insErr;
    }
  },
};
