import { supabase } from "../supabase";

export interface InventoryItem {
  id: string;
  name: string;
  sku: string | null;
  stock_quantity: number;
  committed: number;
  low_stock_threshold: number;
  status: string;
  current_price: number;
  slug: string;
  category_name?: string;
}

export interface InventoryAdjustment {
  id: string;
  product_id: string;
  previous_quantity: number;
  new_quantity: number;
  difference: number;
  reason: string;
  created_by: string | null;
  created_at: string;
  product_name?: string;
}

export const inventoryApi = {
  async list(threshold = 10): Promise<InventoryItem[]> {
    const { data: products } = await supabase
      .from("products")
      .select("id, name, sku, stock_quantity, low_stock_threshold, status, current_price, slug, category_id")
      .order("name");
    return (products ?? []).map((p: any) => ({
      id: p.id, name: p.name, sku: p.sku,
      stock_quantity: p.stock_quantity ?? 0,
      committed: 0, low_stock_threshold: p.low_stock_threshold ?? threshold,
      status: p.status, current_price: p.current_price ?? 0, slug: p.slug,
    }));
  },

  async adjust(productId: string, newQuantity: number, reason: string, createdBy?: string): Promise<void> {
    const { data: product } = await supabase.from("products").select("stock_quantity").eq("id", productId).single();
    const prev = (product as any)?.stock_quantity ?? 0;
    const diff = newQuantity - prev;

    await supabase.from("products").update({ stock_quantity: newQuantity }).eq("id", productId);
    await supabase.from("inventory_adjustments").insert({
      product_id: productId, previous_quantity: prev, new_quantity: newQuantity,
      difference: diff, reason, created_by: createdBy,
    });
  },

  async getHistory(productId: string): Promise<InventoryAdjustment[]> {
    const { data } = await supabase
      .from("inventory_adjustments")
      .select("*")
      .eq("product_id", productId)
      .order("created_at", { ascending: false })
      .limit(50);
    return (data ?? []).map((a: any) => ({
      ...a, product_name: undefined,
    }));
  },

  async getAllAdjustments(limit = 100): Promise<InventoryAdjustment[]> {
    const { data } = await supabase
      .from("inventory_adjustments")
      .select("*, products!inner(name)")
      .order("created_at", { ascending: false })
      .limit(limit);
    return (data ?? []).map((a: any) => ({
      id: a.id, product_id: a.product_id,
      previous_quantity: a.previous_quantity, new_quantity: a.new_quantity,
      difference: a.difference, reason: a.reason, created_by: a.created_by,
      created_at: a.created_at, product_name: a.products?.name || "Unknown",
    }));
  },
};
