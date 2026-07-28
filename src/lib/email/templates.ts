/* eslint-disable @typescript-eslint/no-explicit-any */
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

export function normalizeStoreSettings(settings: Record<string, any> = {}): StoreEmailSettings {
  const storeInfo = settings.store_info || settings.business_info || {};
  const social = settings.social_links || {};
  const siteUrl = String(
    storeInfo.website || settings.website_url || "https://creativemuse.in",
  ).replace(/\/$/, "");
  return {
    businessName: storeInfo.name || "Creative Muse Fine Jewellery",
    logoUrl: storeInfo.logo_url || settings.logo_url || "/assets/cm-logo.png",
    supportEmail: storeInfo.email || settings.store_email || "hello@creativemuse.in",
    supportPhone: storeInfo.phone || settings.store_phone || "",
    websiteUrl: siteUrl,
    businessAddress: storeInfo.address || settings.store_address || "",
    gstin: storeInfo.gstin || settings.gstin || "",
    returnPolicyUrl: settings.return_policy_url || `${siteUrl}/refund-policy`,
    privacyPolicyUrl: settings.privacy_policy_url || `${siteUrl}/privacy-policy`,
    instagramUrl: social.instagram || "",
    facebookUrl: social.facebook || "",
    youtubeUrl: social.youtube || "",
    invoiceFooterText:
      settings.invoice_footer_text || "Thank you for choosing Creative Muse Fine Jewellery",
    copyrightText: settings.copyright_text || "© 2026 All Rights Reserved By Creative Muse",
  };
}

function esc(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function money(value: unknown): string {
  const n = Number(value || 0);
  return `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

function date(value: unknown): string {
  if (!value) return "—";
  return new Date(String(value)).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function dateTime(value: unknown): string {
  if (!value) return "—";
  return new Date(String(value)).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function addressLines(addr: any): string {
  if (!addr) return "";
  if (typeof addr === "string") return esc(addr);
  return [
    addr.addressLine1,
    addr.addressLine2,
    addr.landmark,
    [addr.locality, addr.city].filter(Boolean).join(", "),
    [addr.state, addr.postalCode || addr.pincode].filter(Boolean).join(" - "),
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
    <tr><td style="padding:0 24px 14px 24px;text-align:center">
      <span style="display:inline-block;border:1px solid #d7a53a;background:#fff6dc;color:${NAVY};border-radius:999px;padding:6px 12px;font:700 11px Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase">Test Email</span>
      ${opts.intendedRecipient ? `<div style="font:12px Arial,sans-serif;color:#776a58;margin-top:6px">Intended recipient: ${esc(opts.intendedRecipient)}</div>` : ""}
    </td></tr>`
    : "";

  const html = `<!doctype html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${esc(title)}</title>
    <style>
      @media only screen and (max-width: 620px) {
        .cm-container { width: 100% !important; border-radius: 0 !important; }
        .cm-pad { padding-left: 18px !important; padding-right: 18px !important; }
        .cm-stack, .cm-stack td { display: block !important; width: 100% !important; }
        .cm-title { font-size: 34px !important; line-height: 1.05 !important; }
        .cm-button { display: block !important; width: 100% !important; box-sizing: border-box !important; }
      }
    </style>
  </head>
  <body style="margin:0;background:${IVORY};color:${TEXT};font-family:Arial,Helvetica,sans-serif">
    <div style="display:none;max-height:0;overflow:hidden">${esc(preheader)}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${IVORY};padding:24px 0">
      <tr>
        <td align="center">
          <table role="presentation" class="cm-container" width="680" cellspacing="0" cellpadding="0" style="width:680px;max-width:680px;background:#fffdf8;border:1px solid ${BORDER};border-radius:14px;overflow:hidden;box-shadow:0 12px 34px rgba(33,24,12,.08)">
            <tr><td align="center" style="padding:22px 24px 12px 24px;border-bottom:1px solid ${BORDER}">
              <div style="font:700 34px Georgia,serif;letter-spacing:.05em;color:#222">CM</div>
              <div style="font:700 11px Arial,sans-serif;letter-spacing:.28em;color:#333;text-transform:uppercase">${esc(store.businessName)}</div>
            </td></tr>
            ${testBadge}
            ${body}
            <tr><td style="border-top:1px solid ${BORDER};padding:18px 24px;background:#fff9ef">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr class="cm-stack">
                  <td style="font:12px Arial,sans-serif;color:#635848">${esc(store.supportEmail)}</td>
                  <td align="right" style="font:12px Arial,sans-serif;color:#635848">${esc(store.supportPhone)}</td>
                </tr>
              </table>
              <div style="text-align:center;margin-top:16px;font:11px Arial,sans-serif;color:#6f6252;line-height:1.6">
                ${esc(store.copyrightText)}<br />
                ${esc(store.businessAddress)}
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
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+\n/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function heroTitle(kicker: string, title: string, copy: string, icon = "✓") {
  return `<tr><td class="cm-pad" style="padding:34px 34px 20px 34px">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
      <tr class="cm-stack">
        <td width="74" valign="top"><div style="width:58px;height:58px;border:2px solid ${GOLD};border-radius:50%;text-align:center;line-height:58px;color:${GOLD};font:32px Georgia,serif">${icon}</div></td>
        <td>
          <div style="font:600 20px Georgia,serif;color:${GOLD};text-transform:uppercase;letter-spacing:.03em">${esc(kicker)}</div>
          <div class="cm-title" style="font:500 40px Georgia,serif;line-height:1.08;color:${NAVY};margin-top:2px">${esc(title)}</div>
          <div style="font:14px Arial,sans-serif;line-height:1.7;color:${TEXT};margin-top:8px">${esc(copy)}</div>
        </td>
      </tr>
    </table>
  </td></tr>`;
}

function statGrid(rows: Array<[string, string]>) {
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid ${BORDER};border-radius:10px;overflow:hidden">
    ${rows
      .map(
        ([label, value]) => `<tr>
      <td style="padding:12px 16px;border-bottom:1px solid ${BORDER};font:700 11px Arial,sans-serif;color:#5c5145;text-transform:uppercase;letter-spacing:.06em">${esc(label)}</td>
      <td align="right" style="padding:12px 16px;border-bottom:1px solid ${BORDER};font:14px Arial,sans-serif;color:${NAVY}">${value}</td>
    </tr>`,
      )
      .join("")}
  </table>`;
}

function orderItems(data: OrderEmailData) {
  return data.items
    .map(
      (item) => `
    <tr>
      <td style="padding:12px;border-bottom:1px solid ${BORDER}" width="88">
        ${item.productImage ? `<img src="${esc(item.productImage)}" alt="${esc(item.productName)}" width="72" height="72" style="display:block;object-fit:contain;border-radius:8px;background:#fff7e8;border:1px solid ${BORDER}" />` : ""}
      </td>
      <td style="padding:12px;border-bottom:1px solid ${BORDER}">
        <div style="font:700 15px Arial,sans-serif;color:${NAVY}">${esc(item.productName)}</div>
        
        <div style="font:12px Arial,sans-serif;color:#6d6258;margin-top:4px">Qty: ${item.quantity} · Unit: ${money(item.unitPrice)}</div>
      </td>
      <td align="right" style="padding:12px;border-bottom:1px solid ${BORDER};font:700 14px Arial,sans-serif;color:${NAVY};white-space:nowrap">${money(item.lineTotal)}</td>
    </tr>`,
    )
    .join("");
}

function totals(data: OrderEmailData) {
  const order = data.order;
  const rows = [
    ["Subtotal", money(order.subtotal)],
    order.discount_amount > 0 ? ["Discount", `-${money(order.discount_amount)}`] : null,
    ["Shipping", Number(order.shipping_amount || 0) === 0 ? "Free" : money(order.shipping_amount)],
  ].filter(Boolean) as Array<[string, string]>;
  return `${statGrid(rows)}
    <div style="border-top:2px solid ${NAVY};margin-top:10px;padding-top:12px;text-align:right;font:700 20px Georgia,serif;color:${NAVY}">
      Grand Total ${money(order.total_amount)}
    </div>`;
}

function buttons(buttons: Array<[string, string | undefined, boolean?]>) {
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:20px"><tr class="cm-stack">
    ${buttons
      .filter(([, href]) => href)
      .map(
        ([label, href, primary]) => `<td style="padding:4px">
      <a class="cm-button" href="${esc(href)}" style="display:inline-block;width:100%;text-align:center;text-decoration:none;border-radius:6px;padding:13px 16px;font:700 12px Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;${primary ? `background:${GOLD};color:#fff;border:1px solid ${GOLD}` : `background:#fff;color:${GOLD};border:1px solid ${GOLD}`}">${esc(label)}</a>
    </td>`,
      )
      .join("")}
  </tr></table>`;
}

export function renderWelcomeEmail(data: CustomerEmailData): EmailRenderResult {
  const customer = data.customer || {};
  const name = firstName(customer.full_name || customer.name, customer.email);
  const body = `
    ${heroTitle("Welcome To", "Creative Muse", `Hello ${name}, we're delighted to have you with us. Every piece is crafted to celebrate life's most meaningful moments.`, "◇")}
    <tr><td class="cm-pad" style="padding:0 34px 24px 34px">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#fff7eb;border:1px solid ${BORDER};border-radius:12px">
        <tr class="cm-stack">
          ${["Curated Fine Jewellery", "Secure Payments", "Insured Delivery", "Easy Order Tracking"].map((label) => `<td align="center" style="padding:18px 10px;border-right:1px solid ${BORDER};font:700 11px Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:${NAVY}"><div style="font:26px Georgia,serif;color:${GOLD};margin-bottom:6px">◇</div>${label}</td>`).join("")}
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
    <tr><td class="cm-pad" style="padding:0 34px 24px 34px">
      ${statGrid([
        ["Order Number", esc(order.order_number)],
        ["Invoice Number", esc(data.invoiceNumber || order.invoice_number || "—")],
        ["Order Date", esc(date(order.created_at))],
        [
          "Payment Status",
          `<span style="color:#12743b;font-weight:700">${esc(order.payment_status)}</span>`,
        ],
        [
          "Order Status",
          `<span style="color:#12743b;font-weight:700">${esc(order.order_status)}</span>`,
        ],
      ])}
      <h3 style="font:600 15px Georgia,serif;color:${GOLD};letter-spacing:.08em;text-transform:uppercase;margin:22px 0 10px">Order Summary</h3>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid ${BORDER};border-radius:10px;overflow:hidden">${orderItems(data)}</table>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:16px"><tr class="cm-stack">
        <td valign="top" style="width:50%;padding-right:8px">${totals(data)}</td>
        <td valign="top" style="width:50%;padding-left:8px">${statGrid([
          ["Customer", esc(order.customer_name || "—")],
          ["Phone", esc(order.customer_phone || "—")],
          ["Delivery", addressLines(order.delivery_address || order.shipping_address) || "—"],
          ["Method", esc(order.delivery_method || "Standard Delivery")],
          ["Estimated", esc(date(order.estimated_delivery_at))],
        ])}</td>
      </tr></table>
      ${buttons([
        ["View Order", data.secureOrderUrl, true],
        ["Download Invoice", data.secureInvoiceUrl],
        ["Continue Shopping", `${data.store.websiteUrl}/shop`],
      ])}
      <div style="margin-top:16px;border:1px solid ${BORDER};border-radius:8px;padding:12px;text-align:center;font:13px Arial,sans-serif;color:#5d554d">Tracking details will be shared once your order is shipped.</div>
    </td></tr>`;
  return shell(`Order Confirmed — #${order.order_number}`, body, data.store, data);
}

export function renderPaymentConfirmationEmail(data: OrderEmailData): EmailRenderResult {
  const order = data.order;
  const payment = data.payments?.find((p) => p.status === "paid") || data.payments?.[0] || {};
  const body = `
    ${heroTitle("", "Payment Received", "Thank you for your purchase. Your payment has been successfully received.")}
    <tr><td class="cm-pad" style="padding:0 34px 24px 34px">
      ${statGrid([
        ["Order Number", esc(order.order_number)],
        ["Invoice Number", esc(data.invoiceNumber || order.invoice_number || "—")],
        ["Amount Paid", money(payment.amount || order.total_amount)],
        ["Payment Method", esc(payment.payment_method || order.payment_method || "—")],
        ["Payment Date & Time", esc(dateTime(payment.created_at || order.updated_at))],
        ["Safe Transaction Reference", esc(payment.transaction_reference || "—")],
        [
          "Payment Status",
          `<span style="color:#12743b;font-weight:700">${esc(order.payment_status)}</span>`,
        ],
      ])}
      ${buttons([
        ["Download Invoice", data.secureInvoiceUrl, true],
        ["View Order", data.secureOrderUrl],
      ])}
    </td></tr>`;
  return shell(`Payment Received — Order #${order.order_number}`, body, data.store, data);
}

export function renderShippedEmail(data: OrderEmailData): EmailRenderResult {
  const order = data.order;
  const body = `
    ${heroTitle("Your Order Is", "On Its Way", `Hello ${firstName(order.customer_name, order.customer_email)}, your order has been shipped and is on its way to you.`, "▣")}
    <tr><td class="cm-pad" style="padding:0 34px 24px 34px">
      ${statGrid([
        ["Order Number", esc(order.order_number)],
        ["Shipment ID", esc(order.shipment_id || "—")],
        ["Courier", esc(order.courier_name || order.courier || "—")],
        ["Tracking Number", esc(order.tracking_number || order.tracking_id || "—")],
        ["Shipped Date", esc(date(order.shipped_at || order.updated_at))],
        ["Estimated Delivery", esc(date(order.estimated_delivery_at))],
      ])}
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:18px;border:1px solid ${BORDER};border-radius:10px;overflow:hidden">${orderItems(data)}</table>
      <div style="margin-top:16px">${statGrid([["Delivery Address", addressLines(order.delivery_address || order.shipping_address) || "—"]])}</div>
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
    ${heroTitle("Your Order Has", "Been Delivered", "Your order has been delivered successfully. We hope you love your purchase.", "▣")}
    <tr><td class="cm-pad" style="padding:0 34px 24px 34px">
      ${statGrid([
        ["Order Number", esc(order.order_number)],
        [
          "Delivered On",
          esc(date(order.delivered_at || order.actual_delivery_at || order.updated_at)),
        ],
        ["Delivery Status", `<span style="color:#12743b;font-weight:700">Delivered</span>`],
      ])}
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:18px;border:1px solid ${BORDER};border-radius:10px;overflow:hidden">${orderItems(data)}</table>
      ${buttons([
        ["Download Invoice", data.secureInvoiceUrl, true],
        ["Contact Support", `mailto:${data.store.supportEmail}`],
        ["Continue Shopping", `${data.store.websiteUrl}/shop`],
      ])}
      <div style="margin-top:16px;border:1px solid ${BORDER};border-radius:8px;padding:14px;font:13px Arial,sans-serif;line-height:1.6;color:${TEXT}">Easy returns and exchanges are available according to our return policy.</div>
    </td></tr>`;
  return shell(`Your Order Has Been Delivered — ${order.order_number}`, body, data.store, data);
}

export function renderCancellationEmail(data: OrderEmailData): EmailRenderResult {
  const order = data.order;
  const body = `
    ${heroTitle("Your Order Has", "Been Cancelled", "We're sorry to hear that you've chosen to cancel your order. Here are your order details for reference.", "□")}
    <tr><td class="cm-pad" style="padding:0 34px 24px 34px">
      ${statGrid([
        ["Order Number", esc(order.order_number)],
        ["Cancellation Date", esc(date(order.cancelled_at || order.updated_at))],
        ["Cancellation Reason", esc(order.cancellation_reason || "—")],
        ["Amount Paid", money(order.total_amount)],
        ["Refund Status", esc(order.payment_status === "refunded" ? "Refunded" : "Pending")],
      ])}
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:18px;border:1px solid ${BORDER};border-radius:10px;overflow:hidden">${orderItems(data)}</table>
      ${buttons([["View Order", data.secureOrderUrl, true]])}
    </td></tr>`;
  return shell(`Order Cancelled — #${order.order_number}`, body, data.store, data);
}

export function renderRefundEmail(data: OrderEmailData): EmailRenderResult {
  const order = data.order;
  const refund = data.payments?.find((p) => p.status === "refunded") || {};
  const body = `
    ${heroTitle("Your Refund Has", "Been Processed", "We've processed your refund. The amount will be credited using the details below.", "□")}
    <tr><td class="cm-pad" style="padding:0 34px 24px 34px">
      ${statGrid([
        ["Order Number", esc(order.order_number)],
        ["Refund Amount", money(Math.abs(Number(refund.amount || order.total_amount || 0)))],
        [
          "Refund Type",
          esc(
            Math.abs(Number(refund.amount || 0)) >= Number(order.total_amount || 0)
              ? "Full refund"
              : "Partial refund",
          ),
        ],
        ["Refund Method", esc(refund.payment_method || order.payment_method || "—")],
        ["Refund Reference", esc(refund.transaction_reference || "—")],
        ["Refund Date", esc(date(refund.created_at || order.updated_at))],
        ["Expected Bank Processing Time", "5-7 business days"],
      ])}
      ${buttons([["View Order", data.secureOrderUrl, true]])}
    </td></tr>`;
  return shell(`Refund Processed — #${order.order_number}`, body, data.store, data);
}

export function renderPaymentFailedEmail(data: OrderEmailData): EmailRenderResult {
  const order = data.order;
  const body = `
    ${heroTitle("Payment", "Could Not Be Completed", "Your payment attempt could not be completed. You can retry payment or contact support for help.", "!")}
    <tr><td class="cm-pad" style="padding:0 34px 24px 34px">
      ${statGrid([
        ["Order Reference", esc(order.order_number)],
        ["Amount", money(order.total_amount)],
        ["Payment Status", `<span style="color:#9b1c1c;font-weight:700">Failed</span>`],
      ])}
      ${buttons([
        ["View Order", data.secureOrderUrl, true],
        ["Contact Support", `mailto:${data.store.supportEmail}`],
      ])}
    </td></tr>`;
  return shell(`Payment Failed — #${order.order_number}`, body, data.store, data);
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
