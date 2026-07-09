import { supabase } from "../supabase";

const db = () => supabase as any;

export const enquiriesApi = {
  async list(filters: { search?: string; page?: number; per_page?: number } = {}) {
    let query = db().from("enquiries").select("*", { count: "exact" });
    if (filters.search) query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
    query = query.order("created_at", { ascending: false });
    const page = filters.page || 1;
    const perPage = filters.per_page || 20;
    const from = (page - 1) * perPage;
    query = query.range(from, from + perPage - 1);
    const { data, error, count } = await query;
    if (error) throw error;
    return { data: (data as any[]) || [], count: count || 0 };
  },

  async getById(id: string): Promise<any | null> {
    const { data, error } = await db().from("enquiries").select("*").eq("id", id).maybeSingle();
    if (error) return null;
    return data as any;
  },

  async markRead(id: string): Promise<void> {
    await db().from("enquiries").update({ is_read: true }).eq("id", id);
  },

  async delete(id: string): Promise<void> {
    await db().from("enquiries").delete().eq("id", id);
  },
};
