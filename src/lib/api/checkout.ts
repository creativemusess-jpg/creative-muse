import { supabase } from "../supabase";
import { storefrontSupabase } from "../supabase-storefront";
import { calculateTotals, type CalcInput, type CheckoutTotals, DEFAULT_TAX_SETTINGS, DEFAULT_DELIVERY } from "../checkout";

const db = () => supabase as any;
const adb = () => storefrontSupabase as any;

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

export interface CheckoutTotalsLegacy {
  subtotal: number;
  discountAmount: number;
  shipping: number;
  tax: number;
  total: number;
  couponCode: string | null;
}

export type { CheckoutTotals } from "../checkout";

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
): CheckoutTotalsLegacy {
  const shipping = shippingOverride ?? (subtotal > 5000 || subtotal === 0 ? 0 : 250);
  const tax = 0;
  const total = Math.max(0, subtotal + shipping + tax - discountAmount);
  return { subtotal, discountAmount, shipping, tax, total, couponCode: null };
}

export async function validateAndRecalculateTotals(params: {
  subtotal: number;
  discountAmount: number;
  deliveryMethod: "standard" | "express";
  deliveryStateCode?: string;
}): Promise<CheckoutTotals> {
  const settings = await db().from("site_settings").select("*").eq("setting_key", "tax_settings").maybeSingle();
  const storedTaxSettings = settings?.data?.setting_value || null;
  const taxSettings = storedTaxSettings || DEFAULT_TAX_SETTINGS;

  return calculateTotals({
    subtotal: params.subtotal,
    couponDiscount: params.discountAmount,
    deliveryMethod: params.deliveryMethod,
    deliveryStateCode: params.deliveryStateCode,
    taxSettings,
  });
}

async function generateOrderNumber(): Promise<string> {
  try {
    const { data, error } = await adb().rpc("generate_order_number");
    if (data && !error) return data;
  } catch {}
  const year = new Date().getFullYear();
  const rand = crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase();
  return `CM-${year}-${rand}`;
}

function buildOrderPayload(
  orderNumber: string,
  checkoutAttemptId: string,
  params: CreateOrderParams,
  overrides?: { shipping?: number; tax?: number; total?: number; taxSnapshot?: Record<string, any> },
) {
  const addr = params.deliveryAddress;
  return {
    order_number: orderNumber,
    checkout_attempt_id: checkoutAttemptId,
    customer_id: params.customerId,
    customer_name: params.customerName,
    customer_email: params.customerEmail,
    customer_phone: params.customerPhone,
    delivery_address: {
      addressLine1: addr.addressLine1,
      addressLine2: addr.addressLine2 || "",
      city: addr.city,
      state: addr.state,
      stateCode: addr.stateCode || "",
      district: addr.district || "",
      postalCode: addr.postalCode,
      pincode: addr.pincode || addr.postalCode,
      locality: addr.locality || "",
      country: addr.country || "India",
      landmark: addr.landmark || "",
      addressType: addr.addressType || "Home",
    },
    delivery_method: params.deliveryMethod,
    delivery_state_code: addr.stateCode || "",
    delivery_city: addr.city,
    delivery_district: addr.district || "",
    delivery_pincode: addr.pincode || addr.postalCode,
    delivery_locality: addr.locality || "",
    delivery_country_code: "IN",
    subtotal: params.subtotal,
    discount_amount: params.discountAmount,
    coupon_code: params.couponCode,
    shipping_amount: overrides?.shipping ?? params.shipping,
    tax_amount: overrides?.tax ?? params.tax,
    total_amount: overrides?.total ?? params.total,
    tax_snapshot: overrides?.taxSnapshot ?? params.taxSnapshot ?? null,
    payment_method: params.paymentMethod,
    payment_status: params.paymentMethod === "cod" ? "pending" : "paid",
    order_status: "confirmed",
  };
}

interface CreateOrderParams {
  customerId: string;
  customerName: string;
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
  deliveryMethod: string;
  deliveryAddress: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    stateCode?: string;
    district?: string;
    postalCode: string;
    pincode?: string;
    locality?: string;
    country: string;
    landmark?: string;
    addressType?: string;
  };
  taxSnapshot?: Record<string, any>;
  checkoutAttemptId?: string;
}

export async function createOrder(params: CreateOrderParams): Promise<{ orderNumber: string; orderId: string; error: string | null }> {
  try {
    const checkoutAttemptId = params.checkoutAttemptId || crypto.randomUUID();
    const txRef = `DEMO-CM-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const serverTotals = await validateAndRecalculateTotals({
      subtotal: params.subtotal,
      discountAmount: params.discountAmount,
      deliveryMethod: params.deliveryMethod as "standard" | "express",
      deliveryStateCode: params.deliveryAddress.stateCode,
    });

    const finalAmount = Math.round(serverTotals.grandTotal);
    if (Math.abs(finalAmount - params.total) > 1) {
      console.warn("Client/server total mismatch — using server-calculated amount", { client: params.total, server: finalAmount });
    }

    let orderNumber = await generateOrderNumber();
    const payload = buildOrderPayload(orderNumber, checkoutAttemptId, params, {
      shipping: serverTotals.shippingCharge,
      tax: serverTotals.gstAmount,
      total: finalAmount,
      taxSnapshot: serverTotals as any,
    });
    let { data: order, error: orderErr } = await adb()
      .from("orders")
      .insert(payload)
      .select()
      .single();

    if (orderErr?.code === "23505" && orderErr.message?.includes("orders_order_number")) {
      orderNumber = await generateOrderNumber();
      const retry = await adb()
        .from("orders")
        .insert(buildOrderPayload(orderNumber, checkoutAttemptId, params))
        .select()
        .single();
      if (retry.error || !retry.data) {
        console.error("Order creation retry failed:", retry.error);
        return { orderNumber: "", orderId: "", error: "Your order could not be created. Please try again." };
      }
      order = retry.data;
    } else if (orderErr || !order) {
      console.error("Order creation failed:", orderErr);
      return { orderNumber: "", orderId: "", error: orderErr?.message || "Failed to create order" };
    }

    const slugs = [...new Set(params.items.map((i) => i.productId))];
    const { data: productRows } = await adb()
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

    const { error: itemsErr } = await adb()
      .from("order_items")
      .insert(orderItems);
    if (itemsErr) throw new Error(`Failed to create order items: ${itemsErr.message}`);

    const paymentAmount = finalAmount || params.total;
    const { error: payErr } = await adb()
      .from("payments")
      .insert({
        order_id: order.id,
        customer_id: params.customerId,
        payment_method: params.paymentMethod,
        transaction_reference: txRef,
        amount: paymentAmount,
        currency: "INR",
        status: params.paymentMethod === "cod" ? "pending" : "paid",
        is_demo: true,
        safe_metadata: { method: params.paymentMethod, isDemo: true, deliveryMethod: params.deliveryMethod },
      });
    if (payErr) throw new Error(`Failed to create payment: ${payErr.message}`);

    if (params.couponId && params.couponCode) {
      const { error: usageErr } = await adb()
        .from("coupon_usage")
        .insert({
          coupon_id: params.couponId,
          order_id: order.id,
          customer_id: params.customerId,
          discount_amount: params.discountAmount,
        });
      if (!usageErr) {
        await adb()
          .from("coupons")
          .update({ usage_count: (storefrontSupabase as any).rpc ? undefined : undefined })
          .eq("id", params.couponId);
      }
    }

    for (const item of params.items) {
      const pid = slugToUuid.get(item.productId) || item.productId;
      const { data: product } = await adb()
        .from("products")
        .select("stock_quantity")
        .eq("id", pid)
        .single();
      if (product && product.stock_quantity != null) {
        const newStock = Math.max(0, product.stock_quantity - item.qty);
        await adb()
          .from("products")
          .update({ stock_quantity: newStock })
          .eq("id", pid);
      }
    }

    const { error: custErr } = await adb()
      .from("customers")
      .update({
        total_orders: (storefrontSupabase as any).rpc ? undefined : undefined,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.customerId);
    if (custErr) console.error("Failed to update customer stats:", custErr);

    return { orderNumber, orderId: order.id, error: null };
  } catch (err: any) {
    return { orderNumber: "", orderId: "", error: err.message || "Unknown error creating order" };
  }
}
