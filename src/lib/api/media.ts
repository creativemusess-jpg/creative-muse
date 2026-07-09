import { supabase } from "../supabase";

const db = () => supabase as any;

export const mediaApi = {
  async list(filters: { search?: string; page?: number; per_page?: number } = {}) {
    let query = db().from("media").select("*", { count: "exact" });
    if (filters.search) query = query.or(`filename.ilike.%${filters.search}%,alt_text.ilike.%${filters.search}%`);
    query = query.order("created_at", { ascending: false });
    const page = filters.page || 1;
    const perPage = filters.per_page || 20;
    const from = (page - 1) * perPage;
    query = query.range(from, from + perPage - 1);
    const { data, error, count } = await query;
    if (error) throw error;
    return { data: (data as any[]) || [], count: count || 0 };
  },

  async delete(id: string): Promise<void> {
    await db().from("media").delete().eq("id", id);
  },
};
