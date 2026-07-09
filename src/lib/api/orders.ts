import { supabase } from "../supabase";

const db = () => supabase as any;

export const ordersApi = {
  async list(filters: { status?: string; search?: string; page?: number; per_page?: number } = {}) {
    let query = db().from("orders").select("*", { count: "exact" });

    if (filters.status) query = query.eq("order_status", filters.status);
    if (filters.search) {
      query = query.or(
        `order_number.ilike.%${filters.search}%,customer_name.ilike.%${filters.search}%,customer_email.ilike.%${filters.search}%`,
      );
    }

    query = query.order("created_at", { ascending: false });

    const page = filters.page || 1;
    const perPage = filters.per_page || 20;
    const from = (page - 1) * perPage;
    query = query.range(from, from + perPage - 1);

    const { data, error, count } = await query;
    if (error) throw error;
    return { data: (data as any[]) || [], count: count || 0 };
  },

  async getById(id: string): Promise<{ order: any; items: any[] } | null> {
    const { data: order, error: orderError } = await db().from("orders").select("*").eq("id", id).maybeSingle();
    if (orderError || !order) return null;

    const { data: items } = await db().from("order_items").select("*").eq("order_id", id);

    return { order: order as any, items: (items as any[]) || [] };
  },

  async updateStatus(id: string, status: string, trackingId?: string, courier?: string): Promise<void> {
    const { error } = await db().from("orders").update({
      order_status: status,
      tracking_id: trackingId || null,
      courier: courier || null,
      updated_at: new Date().toISOString(),
    }).eq("id", id);
    if (error) throw error;
  },
};
