import { supabase } from "../supabase";

const db = () => supabase as any;

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export const faqsApi = {
  async list(publishedOnly = true): Promise<FAQ[]> {
    let query = db().from("faqs").select("*").order("sort_order");
    if (publishedOnly) query = query.eq("is_published", true);
    const { data, error } = await query;
    if (error) throw error;
    return (data as FAQ[]) || [];
  },

  async listAll(): Promise<FAQ[]> {
    const { data, error } = await db().from("faqs").select("*").order("sort_order");
    if (error) throw error;
    return (data as FAQ[]) || [];
  },

  async getById(id: string): Promise<FAQ | null> {
    const { data, error } = await db().from("faqs").select("*").eq("id", id).maybeSingle();
    if (error) return null;
    return data as FAQ;
  },

  async create(data: Omit<FAQ, "id" | "created_at" | "updated_at">): Promise<FAQ> {
    const { data: result, error } = await db().from("faqs").insert(data).select().single();
    if (error) throw error;
    return result as FAQ;
  },

  async update(id: string, data: Partial<Omit<FAQ, "id" | "created_at" | "updated_at">>): Promise<FAQ> {
    const { data: result, error } = await db()
      .from("faqs")
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return result as FAQ;
  },

  async delete(id: string): Promise<void> {
    const { error } = await db().from("faqs").delete().eq("id", id);
    if (error) throw error;
  },

  async reorder(faqs: { id: string; sort_order: number }[]): Promise<void> {
    for (const faq of faqs) {
      const { error } = await db().from("faqs").update({ sort_order: faq.sort_order }).eq("id", faq.id);
      if (error) throw error;
    }
  },
};