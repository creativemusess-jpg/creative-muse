import { supabase } from "../supabase";
import { normalizeOrderItems } from "./order-items";
import type { NormalizedOrderItem } from "./order-items";

const db = () => supabase as any;

export const ordersApi = {
  async list(filters: { status?: string; search?: string; page?: number; per_page?: number } = {}) {
    let query = db().from("orders").select("*", { count: "exact" });

    if (filters.status) query = query.eq("order_status", filters.status);

    if (filters.search) {
      const searchTerm = filters.search;
      const orderIdsFromItems: string[] = [];
      const { data: itemMatches } = await db()
        .from("order_items")
        .select("order_id")
        .or(`product_name.ilike.%${searchTerm}%,product_sku.ilike.%${searchTerm}%`);
      if (itemMatches?.length) {
        const seen = new Set<string>();
        for (const m of itemMatches) {
          if (m.order_id && !seen.has(m.order_id)) {
            seen.add(m.order_id);
            orderIdsFromItems.push(m.order_id);
          }
        }
      }
      if (orderIdsFromItems.length > 0) {
        query = query.or(
          `order_number.ilike.%${searchTerm}%,customer_name.ilike.%${searchTerm}%,customer_email.ilike.%${searchTerm}%,id.in.(${orderIdsFromItems.join(",")})`,
        );
      } else {
        query = query.or(
          `order_number.ilike.%${searchTerm}%,customer_name.ilike.%${searchTerm}%,customer_email.ilike.%${searchTerm}%`,
        );
      }
    }

    query = query.order("created_at", { ascending: false });

    const page = filters.page || 1;
    const perPage = filters.per_page || 20;
    const from = (page - 1) * perPage;
    query = query.range(from, from + perPage - 1);

    const { data, error, count } = await query;
    if (error) throw error;
    const orders = (data as any[]) || [];

    const orderIds = orders.map((o: any) => o.id);
    const itemsByOrder = new Map<string, any[]>();
    if (orderIds.length > 0) {
      const { data: items } = await db()
        .from("order_items")
        .select("*")
        .in("order_id", orderIds);
      if (items) {
        for (const item of items) {
          const list = itemsByOrder.get(item.order_id);
          if (list) list.push(item);
          else itemsByOrder.set(item.order_id, [item]);
        }
      }
    }
    return {
      data: orders.map((o: any) => ({
        ...o,
        _items: normalizeOrderItems(itemsByOrder.get(o.id) || []),
      })),
      count: count || 0,
    };
  },

  async getById(id: string): Promise<{ order: any; items: any[] } | null> {
    const { data: order, error: orderError } = await db().from("orders").select("*").eq("id", id).maybeSingle();
    if (orderError || !order) return null;

    const { data: items } = await db().from("order_items").select("*").eq("order_id", id);

    return { order: order as any, items: normalizeOrderItems(items || []) };
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
