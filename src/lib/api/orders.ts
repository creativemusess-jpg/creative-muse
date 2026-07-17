import { supabase } from "../supabase";
import { normalizeOrderItems, type NormalizedOrderItem } from "./order-items";

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
    const normalizedByOrder = new Map<string, NormalizedOrderItem[]>();
    for (const [orderId, rawItems] of itemsByOrder) {
      normalizedByOrder.set(orderId, normalizeOrderItems(rawItems));
    }

    const missingImageIds = [...new Set(
      [...normalizedByOrder.values()].flat().filter(i => !i.productImage && i.productId).map(i => i.productId!)
    )];
    if (missingImageIds.length > 0) {
      const { data: fallbackImages } = await db()
        .from("product_images")
        .select("product_id, url, is_main")
        .in("product_id", missingImageIds);
      if (fallbackImages) {
        const imageMap = new Map<string, string>();
        for (const pi of fallbackImages) {
          if (imageMap.has(pi.product_id)) {
            if (pi.is_main) imageMap.set(pi.product_id, pi.url);
          } else {
            imageMap.set(pi.product_id, pi.url);
          }
        }
        for (const items of normalizedByOrder.values()) {
          for (const item of items) {
            if (!item.productImage && item.productId) {
              item.productImage = imageMap.get(item.productId) || null;
            }
          }
        }
      }
    }

    return {
      data: orders.map((o: any) => ({
        ...o,
        _items: normalizedByOrder.get(o.id) || [],
      })),
      count: count || 0,
    };
  },

  async getById(id: string): Promise<{ order: any; items: NormalizedOrderItem[] } | null> {
    const { data: order, error: orderError } = await db().from("orders").select("*").eq("id", id).maybeSingle();
    if (orderError || !order) return null;

    const { data: items } = await db().from("order_items").select("*").eq("order_id", id);
    const normalized = normalizeOrderItems(items || []);

    const missingImageIds = [...new Set(normalized.filter(i => !i.productImage && i.productId).map(i => i.productId!))];
    if (missingImageIds.length > 0) {
      const { data: fallbackImages } = await db()
        .from("product_images")
        .select("product_id, url, is_main")
        .in("product_id", missingImageIds);
      if (fallbackImages) {
        const imageMap = new Map<string, string>();
        for (const pi of fallbackImages) {
          if (imageMap.has(pi.product_id)) {
            if (pi.is_main) imageMap.set(pi.product_id, pi.url);
          } else {
            imageMap.set(pi.product_id, pi.url);
          }
        }
        for (const item of normalized) {
          if (!item.productImage && item.productId) {
            item.productImage = imageMap.get(item.productId) || null;
          }
        }
      }
    }

    return { order: order as any, items: normalized };
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

  async updatePaymentStatus(id: string, status: string): Promise<void> {
    const { error } = await db().from("orders").update({
      payment_status: status,
      updated_at: new Date().toISOString(),
    }).eq("id", id);
    if (error) throw error;
  },

  async addNote(id: string, note: string): Promise<void> {
    const { data: order } = await db().from("orders").select("notes").eq("id", id).maybeSingle();
    const existingNotes = order?.notes || "";
    const newNote = `[${new Date().toLocaleString()}] ${note}`;
    const updatedNotes = existingNotes ? `${existingNotes}\n${newNote}` : newNote;
    const { error } = await db().from("orders").update({
      notes: updatedNotes,
      updated_at: new Date().toISOString(),
    }).eq("id", id);
    if (error) throw error;
  },
};
