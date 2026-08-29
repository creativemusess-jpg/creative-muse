/* eslint-disable @typescript-eslint/no-explicit-any */
import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

if (typeof globalThis.WebSocket === "undefined" && typeof window === "undefined") {
  const { default: Ws } = await import("ws");
  (globalThis as any).WebSocket = Ws;
}
import { normalizeOrderItems } from "@/lib/api/order-items";
import {
  normalizeStoreSettings,
  renderOrderTemplate,
  renderWelcomeEmail,
  TEMPLATE_LABELS,
} from "./templates";
import type { EmailTemplateKey, OrderEmailData } from "./types";

type SendRequest = {
  template: EmailTemplateKey;
  orderId?: string;
  customerId?: string;
  recipient?: string;
  source?: string;
  isTest?: boolean;
  initiatedBy?: string;
  accessToken?: string;
  resendNotificationId?: string;
};

type PreviewRequest = Omit<SendRequest, "resendNotificationId"> & {
  viewport?: "desktop" | "mobile";
};

const ORDER_TEMPLATES = new Set<EmailTemplateKey>([
  "order_confirmation",
  "invoice",
  "payment_confirmation",
  "shipped",
  "delivered",
  "cancellation",
  "refund",
  "payment_failed",
]);

function env(name: string): string {
  return (
    (typeof process !== "undefined" ? process.env[name] : "") ||
    (import.meta.env as any)[name] ||
    ""
  );
}

function getSupabase(accessToken?: string) {
  const url = env("VITE_SUPABASE_URL");
  const anon = env("VITE_SUPABASE_ANON_KEY");
  if (!url || !anon) throw new Error("Supabase environment variables are not configured.");
  return createClient(url, anon, {
    global: accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : undefined,
    auth: { persistSession: false, autoRefreshToken: false },
  }) as any;
}

function getServiceSupabase() {
  const url = env("VITE_SUPABASE_URL");
  const key = env("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not configured. Add it to your .env (server-only, never prefix with VITE_) and to Vercel → Settings → Environment Variables. Get it from Supabase Dashboard → Project Settings → API → service_role key. This is required for transactional email logging (order_notifications) which bypasses RLS via service role.",
    );
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  }) as any;
}

function isValidEmail(value?: string | null) {
  return !!value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function safeError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error || "Unknown error");
  return message.replace(/key\s*[:=]\s*[\w.-]+/gi, "key=[redacted]").slice(0, 500);
}

function siteUrl() {
  const value =
    env("SITE_URL") ||
    env("VERCEL_PROJECT_PRODUCTION_URL") ||
    env("VERCEL_URL") ||
    "https://creativemuse.in";
  const trimmed = value.trim().replace(/\/$/, "");
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function publicAssetUrl(value?: string | null) {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("//")) return `https:${trimmed}`;
  const path = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return `${siteUrl()}${path}`;
}

async function requireActor(accessToken?: string) {
  if (!accessToken) return null;
  const db = getSupabase(accessToken);
  const { data } = await db.auth.getUser(accessToken);
  return data?.user || null;
}

async function requireEmailTestingPermission(accessToken?: string) {
  const user = await requireActor(accessToken);
  if (!user) throw new Error("Admin authentication is required.");
  const db = getSupabase(accessToken);
  const { data: assignments, error } = await db
    .from("admin_role_assignments")
    .select("admin_roles(name, permissions)")
    .eq("user_id", user.id);
  if (error) throw new Error("Unable to verify admin permissions.");
  const roles = (assignments || []).map((a: any) => a.admin_roles).filter(Boolean);
  const allowed = roles.some((role: any) => {
    const permissions = role.permissions || [];
    return (
      permissions.includes("*") ||
      permissions.includes("manage_email_testing") ||
      ["super_admin", "admin"].includes(role.name)
    );
  });
  if (!allowed) throw new Error("You do not have permission to send test emails.");
  return user;
}

async function loadStoreSettings(db: any) {
  const { data } = await db.from("site_settings").select("*");
  const map: Record<string, any> = {};
  for (const row of data || []) map[row.setting_key] = row.setting_value;
  return normalizeStoreSettings(map);
}

async function ensureInvoiceNumber(db: any, order: any): Promise<string> {
  if (order.invoice_number) return order.invoice_number;
  const year = new Date().getFullYear();
  const { data: lastInv } = await db
    .from("orders")
    .select("invoice_number")
    .not("invoice_number", "is", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  const last =
    Number(
      String(lastInv?.invoice_number || "")
        .split("-")
        .pop(),
    ) || 0;
  const invoiceNumber = `CM-INV-${year}-${String(last + 1).padStart(6, "0")}`;
  await db.from("orders").update({ invoice_number: invoiceNumber }).eq("id", order.id);
  return invoiceNumber;
}

async function loadOrderEmailData(orderId: string, accessToken?: string): Promise<OrderEmailData> {
  const readableDb = accessToken ? getSupabase(accessToken) : getServiceSupabase();
  const serviceDb = getServiceSupabase();
  const { data: order, error: orderError } = await readableDb
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .maybeSingle();
  if (orderError || !order) throw new Error("Order not found or not accessible.");

  const [{ data: itemRows }, { data: payments }, store] = await Promise.all([
    serviceDb.from("order_items").select("*").eq("order_id", orderId),
    serviceDb
      .from("payments")
      .select("*")
      .eq("order_id", orderId)
      .order("created_at", { ascending: false }),
    loadStoreSettings(serviceDb),
  ]);

  const invoiceNumber = await ensureInvoiceNumber(serviceDb, order);
  const base = siteUrl().replace(/\/$/, "");
  const normalizedItems = normalizeOrderItems(itemRows || []).map((item) => ({
    ...item,
    productImage: publicAssetUrl(item.productImage),
  }));
  return {
    order: { ...order, invoice_number: invoiceNumber },
    items: normalizedItems,
    payments: payments || [],
    invoiceNumber,
    store,
    secureOrderUrl: `${base}/account/orders/${encodeURIComponent(order.order_number)}`,
    secureInvoiceUrl: `${base}/account/orders/${encodeURIComponent(order.order_number)}?download=invoice`,
    secureTrackingUrl: `${base}/track-order?order=${encodeURIComponent(order.order_number)}`,
  };
}

async function loadCustomerEmailData(customerId: string | undefined, accessToken?: string) {
  const db = accessToken ? getSupabase(accessToken) : getServiceSupabase();
  const serviceDb = getServiceSupabase();
  const store = await loadStoreSettings(serviceDb);
  if (!customerId) return { customer: null, store };
  const { data: customer } = await db
    .from("customers")
    .select("*")
    .eq("id", customerId)
    .maybeSingle();
  return { customer, store };
}

function validateTemplateData(template: EmailTemplateKey, data?: OrderEmailData) {
  if (!ORDER_TEMPLATES.has(template)) return [] as string[];
  if (!data) throw new Error("Order data is required for this template.");
  const warnings: string[] = [];
  const order = data.order;
  if (
    template === "shipped" &&
    (!(order.courier_name || order.courier) || !(order.tracking_number || order.tracking_id))
  ) {
    throw new Error("Shipped Email requires saved courier and tracking number.");
  }
  if (template === "delivered" && order.order_status !== "delivered") {
    warnings.push(
      "This order is not marked delivered. The test email will be clearly logged as a test.",
    );
  }
  if (template === "cancellation" && order.order_status !== "cancelled") {
    throw new Error("Cancellation Email requires a cancelled order.");
  }
  if (template === "refund" && !data.payments?.some((p) => p.status === "refunded")) {
    throw new Error("Refund Email requires an existing refund record.");
  }
  return warnings;
}

function renderTemplate(
  template: EmailTemplateKey,
  request: PreviewRequest | SendRequest,
  orderData?: OrderEmailData,
  customerData?: any,
) {
  if (template === "welcome") {
    return renderWelcomeEmail({
      customer: customerData?.customer,
      store: customerData.store,
      isTest: request.isTest,
      intendedRecipient: customerData?.customer?.email || null,
    });
  }
  if (!orderData) throw new Error("Order data is required.");
  return renderOrderTemplate(template, {
    ...orderData,
    isTest: request.isTest,
    intendedRecipient: orderData.order.customer_email || null,
  });
}

async function sendProviderEmail(payload: {
  to: string;
  subject: string;
  html: string;
  text: string;
}) {
  const provider =
    env("TRANSACTIONAL_EMAIL_PROVIDER") || (env("RESEND_API_KEY") ? "resend" : "development_log");
  if (provider === "resend") {
    const key = env("RESEND_API_KEY");
    if (!key) throw new Error("RESEND_API_KEY is not configured.");
    const from = normalizeEmailFrom(env("EMAIL_FROM"));
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
        text: payload.text,
      }),
    });
    const json = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(json?.message || "Email provider rejected the message.");
    return { provider, providerMessageId: json?.id || null };
  }
  console.info("[development_log email]", { to: payload.to, subject: payload.subject });
  return { provider: "development_log", providerMessageId: `dev_${Date.now().toString(36)}` };
}

function normalizeEmailFrom(value?: string) {
  const fallback = "Creative Muse Fine Jewellery <onboarding@resend.dev>";
  const cleaned = (value || fallback)
    .trim()
    .replace(/^['"]+|['"]+$/g, "")
    .trim();
  const simpleEmail = /^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/;
  const namedEmail = /^.{1,120}\s<([^\s<>@]+@[^\s<>@]+\.[^\s<>@]+)>$/;

  if (simpleEmail.test(cleaned) || namedEmail.test(cleaned)) return cleaned;

  throw new Error(
    "EMAIL_FROM is invalid. Use email@example.com or Name <email@example.com>. In Vercel, enter the value without surrounding quotes.",
  );
}

async function insertNotification(db: any, row: Record<string, any>) {
  const { data, error } = await db.from("order_notifications").insert(row).select("*").single();
  if (error?.code === "23505" && row.idempotency_key) {
    const existing = await db
      .from("order_notifications")
      .select("*")
      .eq("idempotency_key", row.idempotency_key)
      .maybeSingle();
    return { data: existing.data, duplicate: true };
  }
  if (error) throw error;
  return { data, duplicate: false };
}

async function updateNotification(db: any, id: string, row: Record<string, any>) {
  await db
    .from("order_notifications")
    .update({ ...row, updated_at: new Date().toISOString() })
    .eq("id", id);
}

function idempotencyFor(
  template: EmailTemplateKey,
  orderData?: OrderEmailData,
  customerId?: string,
) {
  if (template === "welcome" && customerId) return `welcome:${customerId}`;
  if (!orderData) return undefined;
  if (template === "order_confirmation" || template === "invoice")
    return `${template}:${orderData.order.id}:v1`;
  if (template === "payment_confirmation") {
    const paid = orderData.payments?.find((p) => p.status === "paid");
    return `payment-paid:${paid?.id || orderData.order.id}`;
  }
  if (template === "shipped")
    return `shipment:${orderData.order.shipment_id || orderData.order.id}`;
  if (template === "delivered") return `delivered:${orderData.order.id}`;
  if (template === "cancellation") return `cancelled:${orderData.order.id}`;
  if (template === "refund") {
    const refund = orderData.payments?.find((p) => p.status === "refunded");
    return `refund:${refund?.id || orderData.order.id}`;
  }
  return `${template}:${orderData.order.id}`;
}

export const getEmailTestingConfig = createServerFn({ method: "GET" }).handler(async () => ({
  testMode: env("EMAIL_TEST_MODE") === "true",
  defaultRecipient: env("EMAIL_TEST_RECIPIENT"),
  provider:
    env("TRANSACTIONAL_EMAIL_PROVIDER") || (env("RESEND_API_KEY") ? "resend" : "development_log"),
}));

export const previewTransactionalEmail = createServerFn({ method: "POST" })
  .validator((data: PreviewRequest) => data)
  .handler(async ({ data }) => {
    const isOrder = ORDER_TEMPLATES.has(data.template);
    const orderData = isOrder
      ? await loadOrderEmailData(data.orderId || "", data.accessToken)
      : undefined;
    const customerData =
      data.template === "welcome"
        ? await loadCustomerEmailData(data.customerId, data.accessToken)
        : undefined;
    const warnings = validateTemplateData(data.template, orderData);
    const rendered = renderTemplate(
      data.template,
      { ...data, isTest: true },
      orderData,
      customerData,
    );
    return { ...rendered, templateLabel: TEMPLATE_LABELS[data.template], warnings };
  });

export const sendTransactionalEmail = createServerFn({ method: "POST" })
  .validator((data: SendRequest) => data)
  .handler(async ({ data }) => {
    const db = getServiceSupabase();
    const actor =
      data.source === "admin_settings" || data.isTest
        ? await requireEmailTestingPermission(data.accessToken)
        : await requireActor(data.accessToken);

    const isOrder = ORDER_TEMPLATES.has(data.template);
    const orderData = isOrder
      ? await loadOrderEmailData(data.orderId || "", data.accessToken)
      : undefined;
    const customerData =
      data.template === "welcome"
        ? await loadCustomerEmailData(data.customerId, data.accessToken)
        : undefined;
    const warnings = validateTemplateData(data.template, orderData);
    const intendedRecipient =
      orderData?.order.customer_email || customerData?.customer?.email || data.recipient || "";
    const testMode = env("EMAIL_TEST_MODE") === "true" || data.isTest === true;
    const testRecipient = data.recipient || env("EMAIL_TEST_RECIPIENT");
    const actualRecipient = testMode ? testRecipient : intendedRecipient;
    if (!isValidEmail(actualRecipient)) throw new Error("A valid recipient email is required.");

    const rendered = renderTemplate(
      data.template,
      { ...data, isTest: testMode },
      orderData,
      customerData,
    );
    const subject =
      testMode && !rendered.subject.startsWith("[TEST]")
        ? `[TEST] ${rendered.subject}`
        : rendered.subject;

    const idempotency =
      testMode || data.resendNotificationId
        ? undefined
        : idempotencyFor(data.template, orderData, data.customerId);

    const inserted = await insertNotification(db, {
      order_id: orderData?.order.id || null,
      customer_id:
        orderData?.order.customer_id || customerData?.customer?.id || data.customerId || null,
      notification_type: data.template,
      idempotency_key: idempotency,
      intended_recipient: intendedRecipient || null,
      actual_recipient: actualRecipient,
      subject,
      provider:
        env("TRANSACTIONAL_EMAIL_PROVIDER") ||
        (env("RESEND_API_KEY") ? "resend" : "development_log"),
      status: "sending",
      initiated_by: actor?.id || data.initiatedBy || null,
      is_test: testMode,
      test_template: testMode ? data.template : null,
      test_recipient: testMode ? actualRecipient : null,
      source: data.source || (testMode ? "admin_settings" : "system"),
      metadata: {
        template_label: TEMPLATE_LABELS[data.template],
        resend_notification_id: data.resendNotificationId || null,
        warnings,
      },
    });
    if (inserted.duplicate) {
      return {
        status: "duplicate",
        notification: inserted.data,
        warnings,
      };
    }

    try {
      const providerResult = await sendProviderEmail({
        to: actualRecipient,
        subject,
        html: rendered.html,
        text: rendered.text,
      });
      const now = new Date().toISOString();
      await updateNotification(db, inserted.data.id, {
        status: "sent",
        provider: providerResult.provider,
        provider_message_id: providerResult.providerMessageId,
        sent_at: now,
      });
      if (data.template === "welcome" && !testMode && customerData?.customer?.id) {
        await db
          .from("customers")
          .update({ welcome_email_sent_at: now })
          .eq("id", customerData.customer.id);
      }
      if (orderData?.order.id) {
        await db.from("orders").update({ last_notification_at: now }).eq("id", orderData.order.id);
        await db.from("audit_logs").insert({
          user_id: actor?.id || null,
          action: `${data.template}_email_sent${testMode ? "_test" : ""}`,
          entity_type: "order",
          entity_id: orderData.order.id,
          new_values: {
            actual_recipient: actualRecipient,
            intended_recipient: intendedRecipient,
            provider_message_id: providerResult.providerMessageId,
            is_test: testMode,
          },
        });
      }
      return {
        status: "sent",
        template: TEMPLATE_LABELS[data.template],
        recipient: actualRecipient,
        subject,
        provider: providerResult.provider,
        providerMessageId: providerResult.providerMessageId,
        sentAt: now,
        warnings,
      };
    } catch (error) {
      const now = new Date().toISOString();
      await updateNotification(db, inserted.data.id, {
        status: "failed",
        failed_at: now,
        error_summary: safeError(error),
      });
      if (orderData?.order.id) {
        await db.from("audit_logs").insert({
          user_id: actor?.id || null,
          action: `${data.template}_email_failed${testMode ? "_test" : ""}`,
          entity_type: "order",
          entity_id: orderData.order.id,
          new_values: { is_test: testMode, error_summary: safeError(error) },
        });
      }
      throw new Error(safeError(error));
    }
  });

export const listOrderNotifications = createServerFn({ method: "POST" })
  .validator(
    (data: { orderId?: string; isTest?: boolean; limit?: number; accessToken?: string }) => data,
  )
  .handler(async ({ data }) => {
    await requireEmailTestingPermission(data.accessToken);
    const db = getServiceSupabase();
    let query = db
      .from("order_notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(data.limit || 25);
    if (data.orderId) query = query.eq("order_id", data.orderId);
    if (typeof data.isTest === "boolean") query = query.eq("is_test", data.isTest);
    const { data: rows, error } = await query;
    if (error) throw error;
    return rows || [];
  });
