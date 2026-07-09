import { supabase } from "../supabase";
import { storefrontSupabase } from "../supabase-storefront";

const db = () => supabase as any;
const sdb = () => storefrontSupabase as any;

export interface ValidatedCoupon {
  id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  maxDiscount: number;
  isValid: boolean;
  message: string;
  discountAmount: number;
}

export interface CheckoutTotals {
  subtotal: number;
  discountAmount: number;
  shipping: number;
  tax: number;
  total: number;
  couponCode: string | null;
}

export async function validateCoupon(
  code: string,
  subtotal: number,
  customerId?: string,
): Promise<ValidatedCoupon> {
  const trimmed = code.trim().toUpperCase();
  if (!trimmed) {
    return { id: "", code: "", discountType: "percentage", discountValue: 0, maxDiscount: 0, isValid: false, message: "Please enter a coupon code.", discountAmount: 0 };
  }

  const { data: coupon } = await db()
    .from("coupons")
    .select("*")
    .ilike("code", trimmed)
    .maybeSingle();

  if (!coupon) {
    return { id: "", code: trimmed, discountType: "percentage", discountValue: 0, maxDiscount: 0, isValid: false, message: "Invalid coupon code.", discountAmount: 0 };
  }

  if (!coupon.is_active) {
    return { id: coupon.id, code: trimmed, discountType: coupon.discount_type, discountValue: coupon.discount_value, maxDiscount: coupon.max_discount || 0, isValid: false, message: "This coupon is no longer active.", discountAmount: 0 };
  }

  const now = new Date();
  if (coupon.start_date && new Date(coupon.start_date) > now) {
    return { id: coupon.id, code: trimmed, discountType: coupon.discount_type, discountValue: coupon.discount_value, maxDiscount: coupon.max_discount || 0, isValid: false, message: "This coupon is not yet valid.", discountAmount: 0 };
  }
  if (coupon.expiry_date && new Date(coupon.expiry_date) < now) {
    return { id: coupon.id, code: trimmed, discountType: coupon.discount_type, discountValue: coupon.discount_value, maxDiscount: coupon.max_discount || 0, isValid: false, message: "This coupon has expired.", discountAmount: 0 };
  }

  if (coupon.min_cart_value && subtotal < coupon.min_cart_value) {
    return { id: coupon.id, code: trimmed, discountType: coupon.discount_type, discountValue: coupon.discount_value, maxDiscount: coupon.max_discount || 0, isValid: false, message: `Minimum order value is ₹${Number(coupon.min_cart_value).toLocaleString("en-IN")}.`, discountAmount: 0 };
  }

  if (coupon.total_usage_limit && (coupon.usage_count || 0) >= coupon.total_usage_limit) {
    return { id: coupon.id, code: trimmed, discountType: coupon.discount_type, discountValue: coupon.discount_value, maxDiscount: coupon.max_discount || 0, isValid: false, message: "This coupon has reached its usage limit.", discountAmount: 0 };
  }

  if (customerId && coupon.per_user_usage_limit) {
    const { count } = await db()
      .from("coupon_usage")
      .select("*", { count: "exact", head: true })
      .eq("coupon_id", coupon.id)
      .eq("customer_id", customerId);
    if (count && count >= coupon.per_user_usage_limit) {
      return { id: coupon.id, code: trimmed, discountType: coupon.discount_type, discountValue: coupon.discount_value, maxDiscount: coupon.max_discount || 0, isValid: false, message: "You have already used this coupon.", discountAmount: 0 };
    }
  }

  let discountAmount =
    coupon.discount_type === "percentage"
      ? (subtotal * coupon.discount_value) / 100
      : coupon.discount_value;
  if (coupon.max_discount) discountAmount = Math.min(discountAmount, coupon.max_discount);

  return {
    id: coupon.id,
    code: trimmed,
    discountType: coupon.discount_type,
    discountValue: coupon.discount_value,
    maxDiscount: coupon.max_discount || 0,
    isValid: true,
    message: `Coupon applied! You save ₹${Math.round(discountAmount).toLocaleString("en-IN")}.`,
    discountAmount: Math.round(discountAmount),
  };
}

export function calculateTotals(
  subtotal: number,
  discountAmount: number,
  shippingOverride?: number,
): CheckoutTotals {
  const shipping = shippingOverride ?? (subtotal > 5000 || subtotal === 0 ? 0 : 250);
  const tax = 0;
  const total = Math.max(0, subtotal + shipping + tax - discountAmount);
  return { subtotal, discountAmount, shipping, tax, total, couponCode: null };
}

export async function createOrder(params: {
  customerId: string;
  customerEmail: string;
  customerPhone: string;
  items: Array<{ productId: string; name: string; image: string; sku: string; qty: number; unitPrice: number; lineTotal: number }>;
  subtotal: number;
  discountAmount: number;
  couponCode: string | null;
  couponId: string | null;
  shipping: number;
  tax: number;
  total: number;
  paymentMethod: string;
  deliveryAddress: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    landmark?: string;
    addressType?: string;
  };
}): Promise<{ orderNumber: string; orderId: string; error: string | null }> {
  try {
    const now = new Date();
    const yearStr = now.getFullYear().toString();
    const { count } = await db()
      .from("orders")
      .select("*", { count: "exact", head: true });
    const seq = ((count || 0) + 1).toString().padStart(6, "0");
    const orderNumber = `CM-${yearStr}-${seq}`;

    const txRef = `DEMO-CM-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const { data: order, error: orderErr } = await db()
      .from("orders")
      .insert({
        order_number: orderNumber,
        customer_id: params.customerId,
        customer_email: params.customerEmail,
        customer_phone: params.customerPhone,
        delivery_address: params.deliveryAddress,
        subtotal: params.subtotal,
        discount_amount: params.discountAmount,
        coupon_code: params.couponCode,
        shipping_amount: params.shipping,
        tax_amount: params.tax,
        total_amount: params.total,
        payment_method: params.paymentMethod,
        payment_status: params.paymentMethod === "cod" ? "pending" : "paid",
        order_status: "confirmed",
      })
      .select()
      .single();

    if (orderErr || !order) {
      return { orderNumber: "", orderId: "", error: orderErr?.message || "Failed to create order" };
    }

    const slugs = [...new Set(params.items.map((i) => i.productId))];
    const { data: productRows } = await db()
      .from("products")
      .select("id, slug")
      .in("slug", slugs);
    const slugToUuid = new Map<string, string>();
    if (productRows) {
      for (const p of productRows) slugToUuid.set(p.slug, p.id);
    }

    const orderItems = params.items.map((item) => ({
      order_id: order.id,
      product_id: slugToUuid.get(item.productId) || item.productId,
      product_name: item.name,
      product_image: item.image,
      product_sku: item.sku,
      quantity: item.qty,
      unit_price: item.unitPrice,
      total_price: item.lineTotal,
    }));

    const { error: itemsErr } = await db()
      .from("order_items")
      .insert(orderItems);
    if (itemsErr) throw new Error(`Failed to create order items: ${itemsErr.message}`);

    const { error: payErr } = await db()
      .from("payments")
      .insert({
        order_id: order.id,
        customer_id: params.customerId,
        payment_method: params.paymentMethod,
        transaction_reference: txRef,
        amount: params.total,
        currency: "INR",
        status: params.paymentMethod === "cod" ? "pending" : "paid",
        is_demo: true,
        safe_metadata: { method: params.paymentMethod, isDemo: true },
      });
    if (payErr) throw new Error(`Failed to create payment: ${payErr.message}`);

    if (params.couponId && params.couponCode) {
      const { error: usageErr } = await db()
        .from("coupon_usage")
        .insert({
          coupon_id: params.couponId,
          order_id: order.id,
          customer_id: params.customerId,
          discount_amount: params.discountAmount,
        });
      if (!usageErr) {
        await db()
          .from("coupons")
          .update({ usage_count: (supabase as any).rpc ? undefined : undefined })
          .eq("id", params.couponId);
      }
    }

    for (const item of params.items) {
      const pid = slugToUuid.get(item.productId) || item.productId;
      const { data: product } = await db()
        .from("products")
        .select("stock_quantity")
        .eq("id", pid)
        .single();
      if (product && product.stock_quantity != null) {
        const newStock = Math.max(0, product.stock_quantity - item.qty);
        await db()
          .from("products")
          .update({ stock_quantity: newStock })
          .eq("id", pid);
      }
    }

    const { error: custErr } = await db()
      .from("customers")
      .update({
        total_orders: (supabase as any).rpc("increment") ? undefined : undefined,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.customerId);
    if (custErr) console.error("Failed to update customer stats:", custErr);

    return { orderNumber, orderId: order.id, error: null };
  } catch (err: any) {
    return { orderNumber: "", orderId: "", error: err.message || "Unknown error creating order" };
  }
}
