export type NormalizedOrderItem = {
  id: string;
  orderId: string;
  productId: string | null;
  productName: string;
  productImage: string | null;
  sku: string | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  selectedSize: string | null;
  selectedVariant: string | null;
};

export function normalizeOrderItem(raw: any): NormalizedOrderItem {
  const variant = raw.variant_info
    ? (typeof raw.variant_info === "string" ? JSON.parse(raw.variant_info) : raw.variant_info)
    : null;
  return {
    id: raw.id,
    orderId: raw.order_id,
    productId: raw.product_id || null,
    productName: raw.product_name || "",
    productImage: raw.product_image || null,
    sku: raw.product_sku || null,
    quantity: raw.quantity || 0,
    unitPrice: raw.unit_price || 0,
    lineTotal: raw.total_price || 0,
    selectedSize: variant?.size || null,
    selectedVariant: variant?.variant || null,
  };
}

export function normalizeOrderItems(raws: any[]): NormalizedOrderItem[] {
  return (raws || []).map(normalizeOrderItem);
}
