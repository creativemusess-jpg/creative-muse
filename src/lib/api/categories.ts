import { supabase } from "../supabase";

const db = () => supabase as any;

export function normalizeCategory(cat: any) {
  if (!cat) return null;
  return {
    ...cat,
    imageUrl: cat.image?.trim() || null,
  };
}

export const categoriesApi = {
  async list(activeOnly = false): Promise<any[]> {
    let query = db().from("categories").select("*").order("sort_order");
    if (activeOnly) query = query.eq("active", true);
    const { data, error } = await query;
    if (error) throw error;
    return ((data as any[]) || []).map(normalizeCategory);
  },

  async listWithCounts(activeOnly = false): Promise<any[]> {
    const categories = await categoriesApi.list(activeOnly);
    if (categories.length === 0) return [];
    const ids = categories.map((c: any) => c.id);
    const { data: counts, error } = await db()
      .from("product_categories")
      .select("category_id")
      .in("category_id", ids);
    if (error) throw error;
    const countMap = new Map<string, number>();
    for (const row of counts || []) {
      countMap.set(row.category_id, (countMap.get(row.category_id) || 0) + 1);
    }
    return categories.map((c: any) => ({
      ...c,
      productCount: countMap.get(c.id) || 0,
    }));
  },

  async getById(id: string): Promise<any | null> {
    const { data, error } = await db().from("categories").select("*").eq("id", id).maybeSingle();
    if (error || !data) return null;
    return normalizeCategory(data);
  },

  async getBySlug(slug: string): Promise<any | null> {
    const { data, error } = await db().from("categories").select("*").eq("slug", slug).maybeSingle();
    if (error || !data) return null;
    return normalizeCategory(data);
  },

  async create(data: any): Promise<any> {
    const { data: result, error } = await db().from("categories").insert(data).select().single();
    if (error) throw error;
    return normalizeCategory(result);
  },

  async update(id: string, data: any): Promise<any> {
    const { data: result, error } = await db().from("categories").update({ ...data, updated_at: new Date().toISOString() }).eq("id", id).select().single();
    if (error) throw error;
    return normalizeCategory(result);
  },

  async delete(id: string): Promise<void> {
    const { error } = await db().from("categories").delete().eq("id", id);
    if (error) throw error;
  },
};

export const collectionsApi = {
  async list(activeOnly = false): Promise<any[]> {
    let query = db().from("collections").select("*").order("sort_order");
    if (activeOnly) query = query.eq("active", true);
    const { data, error } = await query;
    if (error) throw error;
    return (data as any[]) || [];
  },

  async getById(id: string): Promise<any | null> {
    const { data, error } = await db().from("collections").select("*").eq("id", id).maybeSingle();
    if (error) return null;
    return data as any;
  },

  async create(data: any): Promise<any> {
    const { data: result, error } = await db().from("collections").insert(data).select().single();
    if (error) throw error;
    return result;
  },

  async update(id: string, data: any): Promise<any> {
    const { data: result, error } = await db().from("collections").update({ ...data, updated_at: new Date().toISOString() }).eq("id", id).select().single();
    if (error) throw error;
    return result;
  },

  async delete(id: string): Promise<void> {
    const { error } = await db().from("collections").delete().eq("id", id);
    if (error) throw error;
  },
};
