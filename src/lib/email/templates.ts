/* eslint-disable @typescript-eslint/no-explicit-any */
import { CREATIVE_MUSE_BUSINESS_PROFILE } from "@/lib/business-profile";
import type {
  CustomerEmailData,
  EmailRenderResult,
  EmailTemplateKey,
  OrderEmailData,
  StoreEmailSettings,
} from "./types";

const NAVY = "#111b33";
const GOLD = "#b7892f";
const IVORY = "#fffaf2";
const BORDER = "#ead8b8";
const TEXT = "#2c2c2c";
const DASH = "&mdash;";
const WRAP = "word-break:break-word;overflow-wrap:anywhere;";

export const TEMPLATE_LABELS: Record<EmailTemplateKey, string> = {
  welcome: "Welcome Email",
  order_confirmation: "Order Confirmation",
  invoice: "Invoice Email",
  payment_confirmation: "Payment Confirmation",
  shipped: "Shipped Email",
  delivered: "Delivered Email",
  cancellation: "Cancellation Email",
  refund: "Refund Email",
  payment_failed: "Payment Failed Email",
};

const PLACEHOLDER_RE =
  /(123|jewel street|9876543210|98765 43210|example\.|example@|test@|john doe|jane doe|lorem ipsum|placeholder|dummy|fake|creativemuse\.in|srp complex|new sama road|sca school)/i;

function settingText(...values: unknown[]) {
  for (const value of values) {
    const text = typeof value === "string" ? value.trim() : "";
    if (text && !PLACEHOLDER_RE.test(text)) return text;
  }
  return "";
}

function publicUrl(value: string, fallback = CREATIVE_MUSE_BUSINESS_PROFILE.website) {
  const trimmed = value.trim().replace(/\/$/, "");
  if (!trimmed) return fallback;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("//")) return `https:${trimmed.replace(/\/$/, "")}`;
  return fallback;
}

function publicAsset(value: string, siteUrl: string) {
  const trimmed = value.trim();
  if (!trimmed || PLACEHOLDER_RE.test(trimmed)) return CREATIVE_MUSE_BUSINESS_PROFILE.logoUrl;
  if (/^https:\/\//i.test(trimmed)) return trimmed;
  if (/^http:\/\//i.test(trimmed) || /^localhost\b/i.test(trimmed)) {
    return CREATIVE_MUSE_BUSINESS_PROFILE.logoUrl;
  }
  if (trimmed.startsWith("//")) return `https:${trimmed}`;
  const path = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return `${siteUrl}${path}`;
}

export function normalizeStoreSettings(settings: Record<string, any> = {}): StoreEmailSettings {
  const storeInfo = settings.store_info || settings.business_info || {};
  const social = settings.social_links || {};
  const siteUrl = publicUrl(
    settingText(storeInfo.website, settings.website_url, settings.site_url),
    CREATIVE_MUSE_BUSINESS_PROFILE.website,
  );

  return {
    businessName:
      settingText(storeInfo.name, settings.store_name) || CREATIVE_MUSE_BUSINESS_PROFILE.name,
    logoUrl: publicAsset(settingText(storeInfo.logo_url, settings.logo_url), siteUrl),
    supportEmail:
      settingText(storeInfo.email, settings.store_email, settings.support_email) ||
      CREATIVE_MUSE_BUSINESS_PROFILE.email,
    supportPhone:
      settingText(storeInfo.phone, settings.store_phone) || CREATIVE_MUSE_BUSINESS_PROFILE.phone,
    websiteUrl: siteUrl,
    businessAddress:
      settingText(storeInfo.address, settings.store_address) ||
      CREATIVE_MUSE_BUSINESS_PROFILE.address,
    gstin: settingText(storeInfo.gstin, settings.gstin),
    returnPolicyUrl: publicUrl(settingText(settings.return_policy_url), `${siteUrl}/refund-policy`),
    privacyPolicyUrl: publicUrl(
      settingText(settings.privacy_policy_url),
      `${siteUrl}/privacy-policy`,
    ),
    instagramUrl: settingText(social.instagram),
    facebookUrl: settingText(social.facebook),
    youtubeUrl: settingText(social.youtube),
    invoiceFooterText:
      settingText(settings.invoice_footer_text) ||
      "Thank you for choosing Creative Muse Fine Jewellery",
    copyrightText:
      settingText(settings.copyright_text) ||
      "Copyright 2026 All Rights Reserved By Creative Muse",
  };
}

function esc(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function field(value: unknown, fallback = DASH): string {
  const text = String(value ?? "").trim();
  return text ? esc(text) : fallback;
}

function money(value: unknown): string {
  const n = Number(value || 0);
  const safe = Number.isFinite(n) ? n : 0;
  return `&#8377;${safe.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

function date(value: unknown): string {
  if (!value) return DASH;
  const d = new Date(String(value));
  if (Number.isNaN(d.getTime())) return DASH;
  return esc(
    d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),
  );
}

function dateTime(value: unknown): string {
  if (!value) return DASH;
  const d = new Date(String(value));
  if (Number.isNaN(d.getTime())) return DASH;
  return esc(
    d.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }),
  );
}

function addressLines(addr: any): string {
  if (!addr) return "";
  if (typeof addr === "string") return esc(addr).replace(/\r?\n/g, "<br />");
  return [
    addr.name || addr.full_name,
    addr.addressLine1 || addr.address_line1 || addr.line1 || addr.address,
    addr.addressLine2 || addr.address_line2 || addr.line2,
    addr.landmark,
    [addr.locality, addr.city].filter(Boolean).join(", "),
    [addr.state, addr.postalCode || addr.postal_code || addr.pincode].filter(Boolean).join(" - "),
    addr.country,
  ]
    .filter(Boolean)
    .map(esc)
    .join("<br />");
}

function firstName(name?: string | null, email?: string | null) {
  const display = (name || email?.split("@")[0] || "Customer").trim();
  return display.split(/\s+/)[0] || "Customer";
}

function shell(
  title: string,
  body: string,
  store: StoreEmailSettings,
  opts: { isTest?: boolean; intendedRecipient?: string | null } = {},
): EmailRenderResult {
  const preheader = `${title} - ${store.businessName}`;
  const testBadge = opts.isTest
    ? `
    <tr><td class="cm-pad" style="padding:0 24px 14px 24px;text-align:center;${WRAP}">
      <span style="display:inline-block;border:1px solid #d7a53a;background:#fff6dc;color:${NAVY};border-radius:999px;padding:6px 12px;font:700 11px Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase">Test Email</span>
      ${opts.intendedRecipient ? `<div style="font:12px Arial,sans-serif;color:#776a58;margin-top:6px;${WRAP}">Intended recipient: ${field(opts.intendedRecipient)}</div>` : ""}
    </td></tr>`
    : "";

  const html = `<!doctype html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="x-apple-disable-message-reformatting" />
    <title>${esc(title)}</title>
    <style>
      body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
      table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
      img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; max-width: 100%; height: auto; }
      a { ${WRAP} }
      .cm-container, .cm-container * { box-sizing: border-box; }
      .cm-wrap { ${WRAP} }
      @media only screen and (max-width: 620px) {
        body { margin: 0 !important; padding: 0 !important; }
        .cm-shell { padding: 0 !important; }
        .cm-container { width: 100% !important; max-width: 100% !important; border-radius: 0 !important; border-left: 0 !important; border-right: 0 !important; }
        .cm-pad { padding-left: 16px !important; padding-right: 16px !important; }
        .cm-stack, .cm-stack > tbody, .cm-stack > tbody > tr, .cm-stack > tbody > tr > td, .cm-stack > tr, .cm-stack > tr > td, .cm-stack td { display: block !important; width: 100% !important; max-width: 100% !important; text-align: left !important; padding-left: 0 !important; padding-right: 0 !important; }
        .cm-title { font-size: 32px !important; line-height: 1.08 !important; }
        .cm-stat-label, .cm-stat-value { display: block !important; width: 100% !important; text-align: left !important; }
        .cm-stat-label { padding-bottom: 3px !important; border-bottom: 0 !important; }
        .cm-stat-value { padding-top: 0 !important; }
        .cm-button { display: block !important; width: 100% !important; }
        .cm-product-image { width: 60px !important; height: 60px !important; }
      }
    </style>
  </head>
  <body style="margin:0;background:${IVORY};color:${TEXT};font-family:Arial,Helvetica,sans-serif;width:100%">
    <div style="display:none;max-height:0;overflow:hidden">${esc(preheader)}</div>
    <table role="presentation" class="cm-shell" width="100%" cellspacing="0" cellpadding="0" style="width:100%;background:${IVORY};padding:24px 10px;border-collapse:collapse">
      <tr>
        <td align="center" style="padding:0">
          <table role="presentation" class="cm-container" width="100%" cellspacing="0" cellpadding="0" style="width:100%;max-width:680px;background:#fffdf8;border:1px solid ${BORDER};border-radius:14px;overflow:hidden;box-shadow:0 12px 34px rgba(33,24,12,.08);border-collapse:separate">
            <tr><td align="center" style="padding:20px 24px 12px 24px;border-bottom:1px solid ${BORDER};${WRAP}">
              <img src="${esc(store.logoUrl)}" width="86" height="86" alt="${esc(store.businessName)}" style="display:block;width:86px;max-width:86px;height:auto;margin:0 auto 8px auto;object-fit:contain" />
              <div style="font:700 11px Arial,sans-serif;letter-spacing:.24em;color:#333;text-transform:uppercase;${WRAP}">${esc(store.businessName)}</div>
            </td></tr>
            ${testBadge}
            ${body}
            <tr><td style="border-top:1px solid ${BORDER};padding:18px 24px;background:#fff9ef;${WRAP}">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse">
                <tr class="cm-stack">
                  <td valign="top" style="font:12px Arial,sans-serif;color:#635848;line-height:1.6;${WRAP}">
                    <strong style="color:${NAVY}">${esc(store.businessName)}</strong><br />
                    <a href="mailto:${esc(store.supportEmail)}" style="color:#635848;text-decoration:none;${WRAP}">${esc(store.supportEmail)}</a><br />
                    <a href="tel:${esc(store.supportPhone.replace(/\s+/g, ""))}" style="color:#635848;text-decoration:none;${WRAP}">${esc(store.supportPhone)}</a>
                  </td>
                  <td valign="top" align="right" style="font:12px Arial,sans-serif;color:#635848;line-height:1.6;${WRAP}">
                    <a href="${esc(store.websiteUrl)}" style="color:#635848;text-decoration:none;${WRAP}">${esc(store.websiteUrl.replace(/^https?:\/\//, ""))}</a><br />
                    ${esc(store.businessAddress)}
                  </td>
                </tr>
              </table>
              <div style="text-align:center;margin-top:16px;font:11px Arial,sans-serif;color:#6f6252;line-height:1.6;${WRAP}">
                ${esc(store.copyrightText)}
              </div>
            </td></tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { subject: title, html, text: stripHtml(html) };
}

function stripHtml(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/&mdash;/g, "-")
    .replace(/&#8377;/g, "Rs. ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+\n/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function heroTitle(kicker: string, title: string, copy: string, icon = "&#10003;") {
  return `<tr><td class="cm-pad" style="padding:34px 34px 20px 34px;${WRAP}">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse">
      <tr class="cm-stack">
        <td width="74" valign="top" style="padding:0 16px 12px 0"><div style="width:58px;height:58px;border:2px solid ${GOLD};border-radius:50%;text-align:center;line-height:58px;color:${GOLD};font:32px Georgia,serif">${icon}</div></td>
        <td style="${WRAP}">
          ${kicker ? `<div style="font:600 20px Georgia,serif;color:${GOLD};text-transform:uppercase;letter-spacing:.03em;${WRAP}">${esc(kicker)}</div>` : ""}
          <div class="cm-title" style="font:500 40px Georgia,serif;line-height:1.08;color:${NAVY};margin-top:2px;${WRAP}">${esc(title)}</div>
          <div style="font:14px Arial,sans-serif;line-height:1.7;color:${TEXT};margin-top:8px;${WRAP}">${esc(copy)}</div>
        </td>
      </tr>
    </table>
  </td></tr>`;
}

function statGrid(rows: Array<[string, string]>) {
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;border:1px solid ${BORDER};border-radius:10px;overflow:hidden;border-collapse:separate;table-layout:fixed">
    ${rows
      .map(
        ([label, value]) => `<tr>
      <td class="cm-stat-label" width="34%" valign="top" style="width:34%;padding:12px 14px;border-bottom:1px solid ${BORDER};font:700 11px Arial,sans-serif;color:#5c5145;text-transform:uppercase;letter-spacing:.06em;${WRAP}">${esc(label)}</td>
      <td class="cm-stat-value cm-wrap" width="66%" valign="top" style="width:66%;padding:12px 14px;border-bottom:1px solid ${BORDER};font:14px Arial,sans-serif;line-height:1.55;color:${NAVY};${WRAP}">${value}</td>
    </tr>`,
      )
      .join("")}
  </table>`;
}

function orderItems(data: OrderEmailData) {
  const items = data.items.length
    ? data.items
    : [
        {
          id: "missing-item",
          productId: null,
          orderId: data.order.id || "",
          productName: "Order item",
          productImage: null,
          quantity: 0,
          unitPrice: 0,
          lineTotal: 0,
          selectedSize: null,
          selectedVariant: null,
        },
      ];

  return items
    .map(
      (item) => `
    <tr>
      <td style="padding:12px;border-bottom:1px solid ${BORDER};${WRAP}">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;table-layout:fixed">
          <tr>
            <td width="76" valign="top" style="width:76px;padding:0 12px 0 0">
              ${item.productImage ? `<img class="cm-product-image" src="${esc(item.productImage)}" alt="${field(item.productName, "Product image")}" width="64" height="64" style="display:block;width:64px;max-width:64px;height:auto;border-radius:8px;background:#fff7e8;border:1px solid ${BORDER};object-fit:contain" />` : ""}
            </td>
            <td valign="top" style="${WRAP}">
              <div style="font:700 15px Arial,sans-serif;line-height:1.4;color:${NAVY};${WRAP}">${field(item.productName, "Order item")}</div>
              <div style="font:12px Arial,sans-serif;color:#6d6258;margin-top:4px;line-height:1.5;${WRAP}">
                Qty: ${field(item.quantity)} | Unit: ${money(item.unitPrice)}
                ${item.selectedSize ? `<br />Size: ${field(item.selectedSize)}` : ""}
                ${item.selectedVariant ? `<br />Variant: ${field(item.selectedVariant)}` : ""}
              </div>
              <div style="font:700 14px Arial,sans-serif;color:${NAVY};margin-top:6px;${WRAP}">Total: ${money(item.lineTotal)}</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>`,
    )
    .join("");
}

function totals(data: OrderEmailData) {
  const order = data.order;
  const rows = [
    ["Subtotal", money(order.subtotal)],
    Number(order.discount_amount || 0) > 0 ? ["Discount", `-${money(order.discount_amount)}`] : null,
    ["Shipping", Number(order.shipping_amount || 0) === 0 ? "Free" : money(order.shipping_amount)],
  ].filter(Boolean) as Array<[string, string]>;
  return `${statGrid(rows)}
    <div class="cm-wrap" style="border-top:2px solid ${NAVY};margin-top:10px;padding-top:12px;text-align:right;font:700 20px Georgia,serif;color:${NAVY};${WRAP}">
      Grand Total ${money(order.total_amount)}
    </div>`;
}

function buttons(buttons: Array<[string, string | undefined, boolean?]>) {
  const active = buttons.filter(([, href]) => href);
  if (!active.length) return "";
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;margin-top:20px;border-collapse:collapse;table-layout:fixed"><tr class="cm-stack">
    ${active
      .map(
        ([label, href, primary]) => `<td style="padding:4px">
      <a class="cm-button" href="${esc(href)}" style="display:block;width:100%;box-sizing:border-box;text-align:center;text-decoration:none;border-radius:6px;padding:13px 14px;font:700 12px Arial,sans-serif;line-height:1.35;letter-spacing:.06em;text-transform:uppercase;${WRAP}${primary ? `background:${GOLD};color:#fff;border:1px solid ${GOLD}` : `background:#fff;color:${GOLD};border:1px solid ${GOLD}`}">${esc(label)}</a>
    </td>`,
      )
      .join("")}
  </tr></table>`;
}

export function renderWelcomeEmail(data: CustomerEmailData): EmailRenderResult {
  const customer = data.customer || {};
  const name = firstName(customer.full_name || customer.name, customer.email);
  const body = `
    ${heroTitle("Welcome To", "Creative Muse", `Hello ${name}, we're delighted to have you with us. Every piece is crafted to celebrate life's most meaningful moments.`, "&#9671;")}
    <tr><td class="cm-pad" style="padding:0 34px 24px 34px;${WRAP}">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;background:#fff7eb;border:1px solid ${BORDER};border-radius:12px;border-collapse:separate;table-layout:fixed">
        <tr class="cm-stack">
          ${["Curated Fine Jewellery", "Secure Payments", "Insured Delivery", "Easy Order Tracking"].map((label) => `<td align="center" style="padding:18px 10px;border-right:1px solid ${BORDER};font:700 11px Arial,sans-serif;line-height:1.45;letter-spacing:.06em;text-transform:uppercase;color:${NAVY};${WRAP}"><div style="font:26px Georgia,serif;color:${GOLD};margin-bottom:6px">&#9671;</div>${label}</td>`).join("")}
        </tr>
      </table>
      ${buttons([
        ["Explore Jewellery", `${data.store.websiteUrl}/shop`, true],
        ["View My Account", `${data.store.websiteUrl}/account`],
      ])}
    </td></tr>`;
  return shell("Welcome to Creative Muse Jewellery", body, data.store, data);
}

export function renderOrderConfirmationEmail(data: OrderEmailData): EmailRenderResult {
  const order = data.order;
  const body = `
    ${heroTitle("Thank You", "For Your Order", "Your order has been successfully confirmed.")}
    <tr><td class="cm-pad" style="padding:0 34px 24px 34px;${WRAP}">
      ${statGrid([
        ["Order Number", field(order.order_number)],
        ["Invoice Number", field(data.invoiceNumber || order.invoice_number)],
        ["Order Date", date(order.created_at)],
        ["Payment Status", `<span style="color:#12743b;font-weight:700;${WRAP}">${field(order.payment_status)}</span>`],
        ["Order Status", `<span style="color:#12743b;font-weight:700;${WRAP}">${field(order.order_status)}</span>`],
      ])}
      <h3 style="font:600 15px Georgia,serif;color:${GOLD};letter-spacing:.08em;text-transform:uppercase;margin:22px 0 10px;${WRAP}">Order Summary</h3>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;border:1px solid ${BORDER};border-radius:10px;overflow:hidden;border-collapse:separate;table-layout:fixed">${orderItems(data)}</table>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;margin-top:16px;border-collapse:collapse;table-layout:fixed"><tr class="cm-stack">
        <td valign="top" style="width:50%;padding-right:8px">${totals(data)}</td>
        <td valign="top" style="width:50%;padding-left:8px">${statGrid([
          ["Customer", field(order.customer_name)],
          ["Email", field(order.customer_email)],
          ["Phone", field(order.customer_phone)],
          ["Delivery", addressLines(order.delivery_address || order.shipping_address) || DASH],
          ["Method", field(order.delivery_method || "Standard Delivery")],
          ["Estimated", date(order.estimated_delivery_at)],
        ])}</td>
      </tr></table>
      ${buttons([
        ["View Order", data.secureOrderUrl, true],
        ["Download Invoice", data.secureInvoiceUrl],
        ["Continue Shopping", `${data.store.websiteUrl}/shop`],
      ])}
      <div class="cm-wrap" style="margin-top:16px;border:1px solid ${BORDER};border-radius:8px;padding:12px;text-align:center;font:13px Arial,sans-serif;color:#5d554d;line-height:1.6;${WRAP}">Tracking details will be shared once your order is shipped.</div>
    </td></tr>`;
  return shell(`Order Confirmed - #${field(order.order_number, "Order")}`, body, data.store, data);
}

export function renderPaymentConfirmationEmail(data: OrderEmailData): EmailRenderResult {
  const order = data.order;
  const payment = data.payments?.find((p) => p.status === "paid") || data.payments?.[0] || {};
  const body = `
    ${heroTitle("", "Payment Received", "Thank you for your purchase. Your payment has been successfully received.")}
    <tr><td class="cm-pad" style="padding:0 34px 24px 34px;${WRAP}">
      ${statGrid([
        ["Order Number", field(order.order_number)],
        ["Invoice Number", field(data.invoiceNumber || order.invoice_number)],
        ["Amount Paid", money(payment.amount || order.total_amount)],
        ["Payment Method", field(payment.payment_method || order.payment_method)],
        ["Payment Date & Time", dateTime(payment.created_at || order.updated_at)],
        ["Safe Transaction Reference", field(payment.transaction_reference)],
        ["Payment Status", `<span style="color:#12743b;font-weight:700;${WRAP}">${field(order.payment_status)}</span>`],
      ])}
      ${buttons([
        ["Download Invoice", data.secureInvoiceUrl, true],
        ["View Order", data.secureOrderUrl],
      ])}
    </td></tr>`;
  return shell(`Payment Received - Order #${field(order.order_number, "Order")}`, body, data.store, data);
}

export function renderShippedEmail(data: OrderEmailData): EmailRenderResult {
  const order = data.order;
  const body = `
    ${heroTitle("Your Order Is", "On Its Way", `Hello ${firstName(order.customer_name, order.customer_email)}, your order has been shipped and is on its way to you.`, "&#9635;")}
    <tr><td class="cm-pad" style="padding:0 34px 24px 34px;${WRAP}">
      ${statGrid([
        ["Order Number", field(order.order_number)],
        ["Shipment ID", field(order.shipment_id)],
        ["Courier", field(order.courier_name || order.courier)],
        ["Tracking Number", field(order.tracking_number || order.tracking_id)],
        ["Shipped Date", date(order.shipped_at || order.updated_at)],
        ["Estimated Delivery", date(order.estimated_delivery_at)],
      ])}
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;margin-top:18px;border:1px solid ${BORDER};border-radius:10px;overflow:hidden;border-collapse:separate;table-layout:fixed">${orderItems(data)}</table>
      <div style="margin-top:16px">${statGrid([["Delivery Address", addressLines(order.delivery_address || order.shipping_address) || DASH]])}</div>
      ${buttons([
        ["Track Shipment", data.secureTrackingUrl || order.tracking_url, true],
        ["View Order", data.secureOrderUrl],
      ])}
    </td></tr>`;
  return shell("Your Creative Muse Order Has Been Shipped", body, data.store, data);
}

export function renderDeliveredEmail(data: OrderEmailData): EmailRenderResult {
  const order = data.order;
  const body = `
    ${heroTitle("Your Order Has", "Been Delivered", "Your order has been delivered successfully. We hope you love your purchase.", "&#9635;")}
    <tr><td class="cm-pad" style="padding:0 34px 24px 34px;${WRAP}">
      ${statGrid([
        ["Order Number", field(order.order_number)],
        ["Delivered On", date(order.delivered_at || order.actual_delivery_at || order.updated_at)],
        ["Delivery Status", `<span style="color:#12743b;font-weight:700;${WRAP}">Delivered</span>`],
      ])}
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;margin-top:18px;border:1px solid ${BORDER};border-radius:10px;overflow:hidden;border-collapse:separate;table-layout:fixed">${orderItems(data)}</table>
      ${buttons([
        ["Download Invoice", data.secureInvoiceUrl, true],
        ["Contact Support", `mailto:${data.store.supportEmail}`],
        ["Continue Shopping", `${data.store.websiteUrl}/shop`],
      ])}
      <div class="cm-wrap" style="margin-top:16px;border:1px solid ${BORDER};border-radius:8px;padding:14px;font:13px Arial,sans-serif;line-height:1.6;color:${TEXT};${WRAP}">Easy returns and exchanges are available according to our return policy.</div>
    </td></tr>`;
  return shell(`Your Order Has Been Delivered - ${field(order.order_number, "Order")}`, body, data.store, data);
}

export function renderCancellationEmail(data: OrderEmailData): EmailRenderResult {
  const order = data.order;
  const body = `
    ${heroTitle("Your Order Has", "Been Cancelled", "We're sorry to hear that you've chosen to cancel your order. Here are your order details for reference.", "&#9633;")}
    <tr><td class="cm-pad" style="padding:0 34px 24px 34px;${WRAP}">
      ${statGrid([
        ["Order Number", field(order.order_number)],
        ["Cancellation Date", date(order.cancelled_at || order.updated_at)],
        ["Cancellation Reason", field(order.cancellation_reason)],
        ["Amount Paid", money(order.total_amount)],
        ["Refund Status", field(order.payment_status === "refunded" ? "Refunded" : "Pending")],
      ])}
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;margin-top:18px;border:1px solid ${BORDER};border-radius:10px;overflow:hidden;border-collapse:separate;table-layout:fixed">${orderItems(data)}</table>
      ${buttons([["View Order", data.secureOrderUrl, true]])}
    </td></tr>`;
  return shell(`Order Cancelled - #${field(order.order_number, "Order")}`, body, data.store, data);
}

export function renderRefundEmail(data: OrderEmailData): EmailRenderResult {
  const order = data.order;
  const refund = data.payments?.find((p) => p.status === "refunded") || {};
  const body = `
    ${heroTitle("Your Refund Has", "Been Processed", "We've processed your refund. The amount will be credited using the details below.", "&#9633;")}
    <tr><td class="cm-pad" style="padding:0 34px 24px 34px;${WRAP}">
      ${statGrid([
        ["Order Number", field(order.order_number)],
        ["Refund Amount", money(Math.abs(Number(refund.amount || order.total_amount || 0)))],
        [
          "Refund Type",
          field(
            Math.abs(Number(refund.amount || 0)) >= Number(order.total_amount || 0)
              ? "Full refund"
              : "Partial refund",
          ),
        ],
        ["Refund Method", field(refund.payment_method || order.payment_method)],
        ["Refund Reference", field(refund.transaction_reference)],
        ["Refund Date", date(refund.created_at || order.updated_at)],
        ["Expected Bank Processing Time", "5-7 business days"],
      ])}
      ${buttons([["View Order", data.secureOrderUrl, true]])}
    </td></tr>`;
  return shell(`Refund Processed - #${field(order.order_number, "Order")}`, body, data.store, data);
}

export function renderPaymentFailedEmail(data: OrderEmailData): EmailRenderResult {
  const order = data.order;
  const body = `
    ${heroTitle("Payment", "Could Not Be Completed", "Your payment attempt could not be completed. You can retry payment or contact support for help.", "!")}
    <tr><td class="cm-pad" style="padding:0 34px 24px 34px;${WRAP}">
      ${statGrid([
        ["Order Reference", field(order.order_number)],
        ["Amount", money(order.total_amount)],
        ["Payment Status", `<span style="color:#9b1c1c;font-weight:700;${WRAP}">Failed</span>`],
      ])}
      ${buttons([
        ["View Order", data.secureOrderUrl, true],
        ["Contact Support", `mailto:${data.store.supportEmail}`],
      ])}
    </td></tr>`;
  return shell(`Payment Failed - #${field(order.order_number, "Order")}`, body, data.store, data);
}

export function renderOrderTemplate(
  template: EmailTemplateKey,
  data: OrderEmailData,
): EmailRenderResult {
  switch (template) {
    case "order_confirmation":
      return renderOrderConfirmationEmail(data);
    case "invoice":
      return renderOrderConfirmationEmail(data);
    case "payment_confirmation":
      return renderPaymentConfirmationEmail(data);
    case "shipped":
      return renderShippedEmail(data);
    case "delivered":
      return renderDeliveredEmail(data);
    case "cancellation":
      return renderCancellationEmail(data);
    case "refund":
      return renderRefundEmail(data);
    case "payment_failed":
      return renderPaymentFailedEmail(data);
    default:
      return renderOrderConfirmationEmail(data);
  }
}
