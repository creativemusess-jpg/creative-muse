/* eslint-disable @typescript-eslint/no-explicit-any, no-empty */
import { supabase } from "../supabase";
import { normalizeOrderItems, type NormalizedOrderItem } from "./order-items";
import { adminApi } from "./admin";

const db = () => supabase as any;

async function logAction(action: string, entityId?: string, oldValues?: any, newValues?: any) {
  try {
    await adminApi.logAction(action, "order", entityId, oldValues, newValues);
  } catch {}
}

async function getAdminUser() {
  const { data } = await supabase.auth.getUser();
  return data.user;
}

async function ensureInvoiceNumber(orderId: string, orderNumber: string): Promise<string> {
  const { data: order } = await db()
    .from("orders")
    .select("invoice_number")
    .eq("id", orderId)
    .maybeSingle();
  if (order?.invoice_number) return order.invoice_number;
  const year = new Date().getFullYear();
  const { data: lastInv } = await db()
    .from("orders")
    .select("invoice_number")
    .not("invoice_number", "is", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  let seq = 1;
  if (lastInv?.invoice_number) {
    const parts = lastInv.invoice_number.split("-");
    seq = parseInt(parts[parts.length - 1], 10) + 1;
  }
  const invoiceNumber = `CM-INV-${year}-${String(seq).padStart(6, "0")}`;
  const { error } = await db()
    .from("orders")
    .update({ invoice_number: invoiceNumber })
    .eq("id", orderId);
  if (error) {
    const fallbackSeq = Date.now().toString(36).toUpperCase();
    const fallbackInv = `CM-INV-${year}-${fallbackSeq}`;
    await db().from("orders").update({ invoice_number: fallbackInv }).eq("id", orderId);
    return fallbackInv;
  }
  return invoiceNumber;
}

export const ordersApi = {
  async list(
    filters: {
      status?: string;
      search?: string;
      page?: number;
      per_page?: number;
      archived?: boolean;
      customerId?: string;
    } = {},
  ) {
    let query = db().from("orders").select("*", { count: "exact" });

    if (filters.archived) {
      query = query.eq("is_archived", true);
    } else {
      query = query.eq("is_archived", false);
    }

    if (filters.status) query = query.eq("order_status", filters.status);
    if (filters.customerId) query = query.eq("customer_id", filters.customerId);

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
      const { data: items } = await db().from("order_items").select("*").in("order_id", orderIds);
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

    const missingImageIds = [
      ...new Set(
        [...normalizedByOrder.values()]
          .flat()
          .filter((i) => !i.productImage && i.productId)
          .map((i) => i.productId!),
      ),
    ];
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
    const { data: order, error: orderError } = await db()
      .from("orders")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (orderError || !order) return null;

    const { data: items } = await db().from("order_items").select("*").eq("order_id", id);
    const normalized = normalizeOrderItems(items || []);

    const missingImageIds = [
      ...new Set(normalized.filter((i) => !i.productImage && i.productId).map((i) => i.productId!)),
    ];
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

  async updateStatus(
    id: string,
    status: string,
    trackingId?: string,
    courier?: string,
  ): Promise<void> {
    const { data: oldOrder } = await db().from("orders").select("*").eq("id", id).maybeSingle();
    const updatePayload: any = {
      order_status: status,
      updated_at: new Date().toISOString(),
    };
    if (trackingId !== undefined) {
      updatePayload.tracking_id = trackingId || null;
      updatePayload.tracking_number = trackingId || null;
    }
    if (courier !== undefined) updatePayload.courier = courier || null;
    if (status === "shipped") updatePayload.shipped_at = new Date().toISOString();
    if (status === "delivered") updatePayload.delivered_at = new Date().toISOString();
    if (status === "cancelled") {
      const user = await getAdminUser();
      updatePayload.cancelled_at = new Date().toISOString();
      updatePayload.cancelled_by = user?.id || null;
    }
    const { error } = await db().from("orders").update(updatePayload).eq("id", id);
    if (error) throw error;
    await logAction(`order_status_${status}`, id, oldValues(oldOrder), updatePayload);
  },

  async updatePaymentStatus(id: string, status: string): Promise<void> {
    const { data: oldOrder } = await db()
      .from("orders")
      .select("payment_status, total_amount")
      .eq("id", id)
      .maybeSingle();
    const { error } = await db()
      .from("orders")
      .update({
        payment_status: status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);
    if (error) throw error;
    await logAction(`payment_status_${status}`, id, oldValues(oldOrder), {
      payment_status: status,
    });
  },

  async addNote(id: string, note: string): Promise<void> {
    const user = await getAdminUser();
    const { data: order } = await db().from("orders").select("notes").eq("id", id).maybeSingle();
    const existingNotes = order?.notes || "";
    const timestamp = new Date().toISOString();
    const userName = user?.email || "Admin";
    const newNoteEntry = `[${timestamp}] ${userName}: ${note}`;
    const updatedNotes = existingNotes ? `${existingNotes}\n${newNoteEntry}` : newNoteEntry;
    const { error } = await db()
      .from("orders")
      .update({
        notes: updatedNotes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);
    if (error) throw error;
    await logAction("note_added", id);
  },

  async deleteNote(id: string, noteTimestamp: string): Promise<void> {
    const { data: order } = await db().from("orders").select("notes").eq("id", id).maybeSingle();
    if (!order?.notes) return;
    const lines = order.notes
      .split("\n")
      .filter((l: string) => !l.startsWith(`[${noteTimestamp}]`));
    await db()
      .from("orders")
      .update({ notes: lines.join("\n"), updated_at: new Date().toISOString() })
      .eq("id", id);
    await logAction("note_deleted", id);
  },

  async updateTracking(
    id: string,
    data: {
      courier_name?: string;
      tracking_id?: string;
      tracking_number?: string;
      tracking_url?: string;
      shipment_id?: string;
      shipping_service?: string;
      estimated_delivery_at?: string;
      package_weight?: number;
      package_count?: number;
    },
  ): Promise<void> {
    const { error } = await db()
      .from("orders")
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);
    if (error) throw error;
    await logAction("tracking_updated", id, null, data);
  },

  async addCancellationReason(id: string, reason: string): Promise<void> {
    const user = await getAdminUser();
    const { error } = await db()
      .from("orders")
      .update({
        cancellation_reason: reason,
        cancelled_at: new Date().toISOString(),
        cancelled_by: user?.id || null,
        order_status: "cancelled",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);
    if (error) throw error;
    await logAction("order_cancelled", id, null, { cancellation_reason: reason });
  },

  async duplicateOrder(id: string): Promise<string | null> {
    const { data: original } = await db().from("orders").select("*").eq("id", id).maybeSingle();
    if (!original) return null;
    const { data: originalItems } = await db().from("order_items").select("*").eq("order_id", id);
    const year = new Date().getFullYear();
    const rand = crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase();
    const newOrderNumber = `CM-${year}-${rand}`;
    const { data: newOrder, error: orderErr } = await db()
      .from("orders")
      .insert({
        order_number: newOrderNumber,
        customer_id: original.customer_id,
        customer_email: original.customer_email,
        customer_name: original.customer_name,
        customer_phone: original.customer_phone,
        subtotal: original.subtotal,
        discount_amount: 0,
        shipping_amount: original.shipping_amount,
        tax_amount: original.tax_amount,
        total_amount: original.total_amount,
        payment_status: "pending",
        order_status: "pending",
        shipping_address: original.shipping_address,
        delivery_address: original.delivery_address,
        duplicated_from_id: original.id,
        notes: `Duplicated from order ${original.order_number}`,
      })
      .select()
      .single();
    if (orderErr || !newOrder) throw new Error("Failed to create duplicate order");
    if (originalItems) {
      const newItems = originalItems.map((item: any) => ({
        order_id: newOrder.id,
        product_id: item.product_id,
        product_name: item.product_name,
        product_sku: item.product_sku,
        product_image: item.product_image,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price,
        variant_info: item.variant_info,
      }));
      const { error: itemsErr } = await db().from("order_items").insert(newItems);
      if (itemsErr) throw new Error("Failed to create duplicate order items");
    }
    await logAction("order_duplicated", id, null, {
      new_order_id: newOrder.id,
      new_order_number: newOrderNumber,
    });
    return newOrder.id;
  },

  async archiveOrder(id: string): Promise<void> {
    const user = await getAdminUser();
    const { error } = await db()
      .from("orders")
      .update({
        is_archived: true,
        archived_at: new Date().toISOString(),
        archived_by: user?.id || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);
    if (error) throw error;
    await logAction("order_archived", id);
  },

  async restoreOrder(id: string): Promise<void> {
    const { error } = await db()
      .from("orders")
      .update({
        is_archived: false,
        archived_at: null,
        archived_by: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);
    if (error) throw error;
    await logAction("order_restored", id);
  },

  async getCustomerSummary(customerId: string): Promise<{
    totalOrders: number;
    totalCompleted: number;
    totalCancelled: number;
    totalSpent: number;
    totalRefunded: number;
    lastOrderDate: string | null;
    customerSince: string | null;
  }> {
    const { data: customer } = await db()
      .from("customers")
      .select("*")
      .eq("id", customerId)
      .maybeSingle();
    if (!customer)
      return {
        totalOrders: 0,
        totalCompleted: 0,
        totalCancelled: 0,
        totalSpent: 0,
        totalRefunded: 0,
        lastOrderDate: null,
        customerSince: null,
      };
    const { data: orders } = await db()
      .from("orders")
      .select("order_status, total_amount")
      .eq("customer_id", customerId);
    const orderList = (orders as any[]) || [];
    return {
      totalOrders: customer.total_orders || orderList.length,
      totalCompleted: orderList.filter((o: any) => o.order_status === "delivered").length,
      totalCancelled: orderList.filter((o: any) => o.order_status === "cancelled").length,
      totalSpent:
        customer.total_spent ||
        orderList.reduce((s: number, o: any) => s + (o.total_amount || 0), 0),
      totalRefunded: orderList
        .filter((o: any) => o.order_status === "refunded")
        .reduce((s: number, o: any) => s + (o.total_amount || 0), 0),
      lastOrderDate: orderList.length > 0 ? orderList[0].created_at : null,
      customerSince: customer.created_at || null,
    };
  },

  async getAuditLogsForOrder(orderId: string): Promise<any[]> {
    const { data } = await db()
      .from("audit_logs")
      .select("*, profiles:user_id(full_name, email)")
      .eq("entity_id", orderId)
      .eq("entity_type", "order")
      .order("created_at", { ascending: false })
      .limit(100);
    return (data as any[]) || [];
  },

  async getPaymentsForOrder(orderId: string): Promise<any[]> {
    const { data } = await db()
      .from("payments")
      .select("*")
      .eq("order_id", orderId)
      .order("created_at", { ascending: false });
    return (data as any[]) || [];
  },

  async createRefund(orderId: string, amount: number, reason: string): Promise<void> {
    const { data: order } = await db()
      .from("orders")
      .select("payment_status, total_amount")
      .eq("id", orderId)
      .maybeSingle();
    if (!order) throw new Error("Order not found");
    if (amount > order.total_amount) throw new Error("Refund amount exceeds order total");
    const { data: payments } = await db().from("payments").select("*").eq("order_id", orderId);
    const totalPaid = ((payments as any[]) || []).reduce(
      (s: number, p: any) => s + (p.status === "paid" ? Number(p.amount) : 0),
      0,
    );
    if (amount > totalPaid) throw new Error("Refund amount exceeds amount paid");
    const user = await getAdminUser();
    const { error } = await db()
      .from("payments")
      .insert({
        order_id: orderId,
        amount: -amount,
        status: "refunded",
        payment_method: "manual_refund",
        is_demo: true,
        transaction_reference: `REF-${Date.now()}`,
        safe_metadata: { refund_reason: reason, processed_by: user?.id },
      });
    if (error) throw error;
    const newPaymentStatus = amount >= totalPaid ? "refunded" : "partially_refunded";
    await db()
      .from("orders")
      .update({
        payment_status: newPaymentStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId);
    await logAction("refund_created", orderId, null, {
      amount,
      reason,
      payment_status: newPaymentStatus,
    });
  },

  async ensureInvoiceNumber(id: string): Promise<string> {
    return ensureInvoiceNumber(id, "");
  },
};

function oldValues(obj: any) {
  if (!obj) return null;
  const safe: any = {};
  const fields = ["order_status", "payment_status", "total_amount", "tracking_id", "courier"];
  for (const f of fields) {
    if (f in obj) safe[f] = obj[f];
  }
  return safe;
}
