import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
import { t as normalizeOrderItems } from "./order-items-1dSWUIeN.mjs";
import { c as createServerFn, i as TSS_SERVER_FUNCTION } from "./createServerFn-CIHAFgYl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/server-Djoj3sfu.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var NAVY = "#111b33";
var GOLD = "#b7892f";
var IVORY = "#fffaf2";
var BORDER = "#ead8b8";
var TEXT = "#2c2c2c";
var TEMPLATE_LABELS = {
	welcome: "Welcome Email",
	order_confirmation: "Order Confirmation",
	invoice: "Invoice Email",
	payment_confirmation: "Payment Confirmation",
	shipped: "Shipped Email",
	delivered: "Delivered Email",
	cancellation: "Cancellation Email",
	refund: "Refund Email",
	payment_failed: "Payment Failed Email"
};
function normalizeStoreSettings(settings = {}) {
	const storeInfo = settings.store_info || settings.business_info || {};
	const social = settings.social_links || {};
	const siteUrl = String(storeInfo.website || settings.website_url || "https://creativemuse.in").replace(/\/$/, "");
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
		invoiceFooterText: settings.invoice_footer_text || "Thank you for choosing Creative Muse Fine Jewellery",
		copyrightText: settings.copyright_text || "© 2026 All Rights Reserved By Creative Muse"
	};
}
function esc(value) {
	return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function money(value) {
	return `₹${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}
function date(value) {
	if (!value) return "—";
	return new Date(String(value)).toLocaleDateString("en-IN", {
		day: "2-digit",
		month: "long",
		year: "numeric"
	});
}
function dateTime(value) {
	if (!value) return "—";
	return new Date(String(value)).toLocaleString("en-IN", {
		dateStyle: "medium",
		timeStyle: "short"
	});
}
function addressLines(addr) {
	if (!addr) return "";
	if (typeof addr === "string") return esc(addr);
	return [
		addr.addressLine1,
		addr.addressLine2,
		addr.landmark,
		[addr.locality, addr.city].filter(Boolean).join(", "),
		[addr.state, addr.postalCode || addr.pincode].filter(Boolean).join(" - "),
		addr.country
	].filter(Boolean).map(esc).join("<br />");
}
function firstName(name, email) {
	return (name || email?.split("@")[0] || "Customer").trim().split(/\s+/)[0] || "Customer";
}
function shell(title, body, store, opts = {}) {
	const preheader = `${title} - ${store.businessName}`;
	const testBadge = opts.isTest ? `
    <tr><td style="padding:0 24px 14px 24px;text-align:center">
      <span style="display:inline-block;border:1px solid #d7a53a;background:#fff6dc;color:${NAVY};border-radius:999px;padding:6px 12px;font:700 11px Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase">Test Email</span>
      ${opts.intendedRecipient ? `<div style="font:12px Arial,sans-serif;color:#776a58;margin-top:6px">Intended recipient: ${esc(opts.intendedRecipient)}</div>` : ""}
    </td></tr>` : "";
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
	return {
		subject: title,
		html,
		text: stripHtml(html)
	};
}
function stripHtml(html) {
	return html.replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, " ").replace(/\s+\n/g, "\n").replace(/[ \t]{2,}/g, " ").trim();
}
function heroTitle(kicker, title, copy, icon = "✓") {
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
function statGrid(rows) {
	return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid ${BORDER};border-radius:10px;overflow:hidden">
    ${rows.map(([label, value]) => `<tr>
      <td style="padding:12px 16px;border-bottom:1px solid ${BORDER};font:700 11px Arial,sans-serif;color:#5c5145;text-transform:uppercase;letter-spacing:.06em">${esc(label)}</td>
      <td align="right" style="padding:12px 16px;border-bottom:1px solid ${BORDER};font:14px Arial,sans-serif;color:${NAVY}">${value}</td>
    </tr>`).join("")}
  </table>`;
}
function orderItems(data) {
	return data.items.map((item) => `
    <tr>
      <td style="padding:12px;border-bottom:1px solid ${BORDER}" width="88">
        ${item.productImage ? `<img src="${esc(item.productImage)}" alt="${esc(item.productName)}" width="72" height="72" style="display:block;object-fit:contain;border-radius:8px;background:#fff7e8;border:1px solid ${BORDER}" />` : ""}
      </td>
      <td style="padding:12px;border-bottom:1px solid ${BORDER}">
        <div style="font:700 15px Arial,sans-serif;color:${NAVY}">${esc(item.productName)}</div>
        
        <div style="font:12px Arial,sans-serif;color:#6d6258;margin-top:4px">Qty: ${item.quantity} · Unit: ${money(item.unitPrice)}</div>
      </td>
      <td align="right" style="padding:12px;border-bottom:1px solid ${BORDER};font:700 14px Arial,sans-serif;color:${NAVY};white-space:nowrap">${money(item.lineTotal)}</td>
    </tr>`).join("");
}
function totals(data) {
	const order = data.order;
	return `${statGrid([
		["Subtotal", money(order.subtotal)],
		order.discount_amount > 0 ? ["Discount", `-${money(order.discount_amount)}`] : null,
		["Shipping", Number(order.shipping_amount || 0) === 0 ? "Free" : money(order.shipping_amount)]
	].filter(Boolean))}
    <div style="border-top:2px solid ${NAVY};margin-top:10px;padding-top:12px;text-align:right;font:700 20px Georgia,serif;color:${NAVY}">
      Grand Total ${money(order.total_amount)}
    </div>`;
}
function buttons(buttons) {
	return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:20px"><tr class="cm-stack">
    ${buttons.filter(([, href]) => href).map(([label, href, primary]) => `<td style="padding:4px">
      <a class="cm-button" href="${esc(href)}" style="display:inline-block;width:100%;text-align:center;text-decoration:none;border-radius:6px;padding:13px 16px;font:700 12px Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;${primary ? `background:${GOLD};color:#fff;border:1px solid ${GOLD}` : `background:#fff;color:${GOLD};border:1px solid ${GOLD}`}">${esc(label)}</a>
    </td>`).join("")}
  </tr></table>`;
}
function renderWelcomeEmail(data) {
	const customer = data.customer || {};
	return shell("Welcome to Creative Muse Jewellery", `
    ${heroTitle("Welcome To", "Creative Muse", `Hello ${firstName(customer.full_name || customer.name, customer.email)}, we're delighted to have you with us. Every piece is crafted to celebrate life's most meaningful moments.`, "◇")}
    <tr><td class="cm-pad" style="padding:0 34px 24px 34px">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#fff7eb;border:1px solid ${BORDER};border-radius:12px">
        <tr class="cm-stack">
          ${[
		"Curated Fine Jewellery",
		"Secure Payments",
		"Insured Delivery",
		"Easy Order Tracking"
	].map((label) => `<td align="center" style="padding:18px 10px;border-right:1px solid ${BORDER};font:700 11px Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:${NAVY}"><div style="font:26px Georgia,serif;color:${GOLD};margin-bottom:6px">◇</div>${label}</td>`).join("")}
        </tr>
      </table>
      ${buttons([[
		"Explore Jewellery",
		`${data.store.websiteUrl}/shop`,
		true
	], ["View My Account", `${data.store.websiteUrl}/account`]])}
    </td></tr>`, data.store, data);
}
function renderOrderConfirmationEmail(data) {
	const order = data.order;
	const body = `
    ${heroTitle("Thank You", "For Your Order", "Your order has been successfully confirmed.")}
    <tr><td class="cm-pad" style="padding:0 34px 24px 34px">
      ${statGrid([
		["Order Number", esc(order.order_number)],
		["Invoice Number", esc(data.invoiceNumber || order.invoice_number || "—")],
		["Order Date", esc(date(order.created_at))],
		["Payment Status", `<span style="color:#12743b;font-weight:700">${esc(order.payment_status)}</span>`],
		["Order Status", `<span style="color:#12743b;font-weight:700">${esc(order.order_status)}</span>`]
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
		["Estimated", esc(date(order.estimated_delivery_at))]
	])}</td>
      </tr></table>
      ${buttons([
		[
			"View Order",
			data.secureOrderUrl,
			true
		],
		["Download Invoice", data.secureInvoiceUrl],
		["Continue Shopping", `${data.store.websiteUrl}/shop`]
	])}
      <div style="margin-top:16px;border:1px solid ${BORDER};border-radius:8px;padding:12px;text-align:center;font:13px Arial,sans-serif;color:#5d554d">Tracking details will be shared once your order is shipped.</div>
    </td></tr>`;
	return shell(`Order Confirmed — #${order.order_number}`, body, data.store, data);
}
function renderPaymentConfirmationEmail(data) {
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
		["Payment Status", `<span style="color:#12743b;font-weight:700">${esc(order.payment_status)}</span>`]
	])}
      ${buttons([[
		"Download Invoice",
		data.secureInvoiceUrl,
		true
	], ["View Order", data.secureOrderUrl]])}
    </td></tr>`;
	return shell(`Payment Received — Order #${order.order_number}`, body, data.store, data);
}
function renderShippedEmail(data) {
	const order = data.order;
	return shell("Your Creative Muse Order Has Been Shipped", `
    ${heroTitle("Your Order Is", "On Its Way", `Hello ${firstName(order.customer_name, order.customer_email)}, your order has been shipped and is on its way to you.`, "▣")}
    <tr><td class="cm-pad" style="padding:0 34px 24px 34px">
      ${statGrid([
		["Order Number", esc(order.order_number)],
		["Shipment ID", esc(order.shipment_id || "—")],
		["Courier", esc(order.courier_name || order.courier || "—")],
		["Tracking Number", esc(order.tracking_number || order.tracking_id || "—")],
		["Shipped Date", esc(date(order.shipped_at || order.updated_at))],
		["Estimated Delivery", esc(date(order.estimated_delivery_at))]
	])}
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:18px;border:1px solid ${BORDER};border-radius:10px;overflow:hidden">${orderItems(data)}</table>
      <div style="margin-top:16px">${statGrid([["Delivery Address", addressLines(order.delivery_address || order.shipping_address) || "—"]])}</div>
      ${buttons([[
		"Track Shipment",
		data.secureTrackingUrl || order.tracking_url,
		true
	], ["View Order", data.secureOrderUrl]])}
    </td></tr>`, data.store, data);
}
function renderDeliveredEmail(data) {
	const order = data.order;
	const body = `
    ${heroTitle("Your Order Has", "Been Delivered", "Your order has been delivered successfully. We hope you love your purchase.", "▣")}
    <tr><td class="cm-pad" style="padding:0 34px 24px 34px">
      ${statGrid([
		["Order Number", esc(order.order_number)],
		["Delivered On", esc(date(order.delivered_at || order.actual_delivery_at || order.updated_at))],
		["Delivery Status", `<span style="color:#12743b;font-weight:700">Delivered</span>`]
	])}
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:18px;border:1px solid ${BORDER};border-radius:10px;overflow:hidden">${orderItems(data)}</table>
      ${buttons([
		[
			"Download Invoice",
			data.secureInvoiceUrl,
			true
		],
		["Contact Support", `mailto:${data.store.supportEmail}`],
		["Continue Shopping", `${data.store.websiteUrl}/shop`]
	])}
      <div style="margin-top:16px;border:1px solid ${BORDER};border-radius:8px;padding:14px;font:13px Arial,sans-serif;line-height:1.6;color:${TEXT}">Easy returns and exchanges are available according to our return policy.</div>
    </td></tr>`;
	return shell(`Your Order Has Been Delivered — ${order.order_number}`, body, data.store, data);
}
function renderCancellationEmail(data) {
	const order = data.order;
	const body = `
    ${heroTitle("Your Order Has", "Been Cancelled", "We're sorry to hear that you've chosen to cancel your order. Here are your order details for reference.", "□")}
    <tr><td class="cm-pad" style="padding:0 34px 24px 34px">
      ${statGrid([
		["Order Number", esc(order.order_number)],
		["Cancellation Date", esc(date(order.cancelled_at || order.updated_at))],
		["Cancellation Reason", esc(order.cancellation_reason || "—")],
		["Amount Paid", money(order.total_amount)],
		["Refund Status", esc(order.payment_status === "refunded" ? "Refunded" : "Pending")]
	])}
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:18px;border:1px solid ${BORDER};border-radius:10px;overflow:hidden">${orderItems(data)}</table>
      ${buttons([[
		"View Order",
		data.secureOrderUrl,
		true
	]])}
    </td></tr>`;
	return shell(`Order Cancelled — #${order.order_number}`, body, data.store, data);
}
function renderRefundEmail(data) {
	const order = data.order;
	const refund = data.payments?.find((p) => p.status === "refunded") || {};
	const body = `
    ${heroTitle("Your Refund Has", "Been Processed", "We've processed your refund. The amount will be credited using the details below.", "□")}
    <tr><td class="cm-pad" style="padding:0 34px 24px 34px">
      ${statGrid([
		["Order Number", esc(order.order_number)],
		["Refund Amount", money(Math.abs(Number(refund.amount || order.total_amount || 0)))],
		["Refund Type", esc(Math.abs(Number(refund.amount || 0)) >= Number(order.total_amount || 0) ? "Full refund" : "Partial refund")],
		["Refund Method", esc(refund.payment_method || order.payment_method || "—")],
		["Refund Reference", esc(refund.transaction_reference || "—")],
		["Refund Date", esc(date(refund.created_at || order.updated_at))],
		["Expected Bank Processing Time", "5-7 business days"]
	])}
      ${buttons([[
		"View Order",
		data.secureOrderUrl,
		true
	]])}
    </td></tr>`;
	return shell(`Refund Processed — #${order.order_number}`, body, data.store, data);
}
function renderPaymentFailedEmail(data) {
	const order = data.order;
	const body = `
    ${heroTitle("Payment", "Could Not Be Completed", "Your payment attempt could not be completed. You can retry payment or contact support for help.", "!")}
    <tr><td class="cm-pad" style="padding:0 34px 24px 34px">
      ${statGrid([
		["Order Reference", esc(order.order_number)],
		["Amount", money(order.total_amount)],
		["Payment Status", `<span style="color:#9b1c1c;font-weight:700">Failed</span>`]
	])}
      ${buttons([[
		"View Order",
		data.secureOrderUrl,
		true
	], ["Contact Support", `mailto:${data.store.supportEmail}`]])}
    </td></tr>`;
	return shell(`Payment Failed — #${order.order_number}`, body, data.store, data);
}
function renderOrderTemplate(template, data) {
	switch (template) {
		case "order_confirmation": return renderOrderConfirmationEmail(data);
		case "invoice": return renderOrderConfirmationEmail(data);
		case "payment_confirmation": return renderPaymentConfirmationEmail(data);
		case "shipped": return renderShippedEmail(data);
		case "delivered": return renderDeliveredEmail(data);
		case "cancellation": return renderCancellationEmail(data);
		case "refund": return renderRefundEmail(data);
		case "payment_failed": return renderPaymentFailedEmail(data);
		default: return renderOrderConfirmationEmail(data);
	}
}
var ORDER_TEMPLATES = /* @__PURE__ */ new Set([
	"order_confirmation",
	"invoice",
	"payment_confirmation",
	"shipped",
	"delivered",
	"cancellation",
	"refund",
	"payment_failed"
]);
function env(name) {
	return (typeof process !== "undefined" ? process.env[name] : "") || {
		"BASE_URL": "/",
		"DEV": false,
		"MODE": "production",
		"PROD": true,
		"SSR": true,
		"TSS_DEV_SERVER": "false",
		"TSS_DEV_SSR_STYLES_BASEPATH": "/",
		"TSS_DEV_SSR_STYLES_ENABLED": "true",
		"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
		"TSS_INLINE_CSS_ENABLED": "false",
		"TSS_ROUTER_BASEPATH": "",
		"TSS_SERVER_FN_BASE": "/_serverFn/",
		"VITE_SUPABASE_ANON_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzYnl3aGZhb2FqaHNweXRnbWJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1MzA5MzEsImV4cCI6MjA5OTEwNjkzMX0.FE5ZtanPMsiCiMY3ZXN8K7JYyoNudwRMwTpjann8SAc",
		"VITE_SUPABASE_URL": "https://qsbywhfaoajhspytgmbc.supabase.co"
	}[name] || "";
}
function getSupabase(accessToken) {
	const url = env("VITE_SUPABASE_URL");
	const anon = env("VITE_SUPABASE_ANON_KEY");
	if (!url || !anon) throw new Error("Supabase environment variables are not configured.");
	return createClient(url, anon, {
		global: accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : void 0,
		auth: {
			persistSession: false,
			autoRefreshToken: false
		}
	});
}
function getServiceSupabase() {
	const url = env("VITE_SUPABASE_URL");
	const key = env("SUPABASE_SERVICE_ROLE_KEY") || env("VITE_SUPABASE_ANON_KEY");
	if (!url || !key) throw new Error("Server Supabase environment variables are not configured.");
	return createClient(url, key, { auth: {
		persistSession: false,
		autoRefreshToken: false
	} });
}
function isValidEmail(value) {
	return !!value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}
function safeError(error) {
	return (error instanceof Error ? error.message : String(error || "Unknown error")).replace(/key\s*[:=]\s*[\w.-]+/gi, "key=[redacted]").slice(0, 500);
}
function siteUrl() {
	const trimmed = (env("SITE_URL") || env("VERCEL_PROJECT_PRODUCTION_URL") || env("VERCEL_URL") || "https://creativemuse.in").trim().replace(/\/$/, "");
	return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}
function publicAssetUrl(value) {
	if (!value) return null;
	const trimmed = value.trim();
	if (!trimmed) return null;
	if (/^https?:\/\//i.test(trimmed)) return trimmed;
	if (trimmed.startsWith("//")) return `https:${trimmed}`;
	const path = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
	return `${siteUrl()}${path}`;
}
async function requireActor(accessToken) {
	if (!accessToken) return null;
	const { data } = await getSupabase(accessToken).auth.getUser(accessToken);
	return data?.user || null;
}
async function requireEmailTestingPermission(accessToken) {
	const user = await requireActor(accessToken);
	if (!user) throw new Error("Admin authentication is required.");
	const { data: assignments, error } = await getSupabase(accessToken).from("admin_role_assignments").select("admin_roles(name, permissions)").eq("user_id", user.id);
	if (error) throw new Error("Unable to verify admin permissions.");
	if (!(assignments || []).map((a) => a.admin_roles).filter(Boolean).some((role) => {
		const permissions = role.permissions || [];
		return permissions.includes("*") || permissions.includes("manage_email_testing") || ["super_admin", "admin"].includes(role.name);
	})) throw new Error("You do not have permission to send test emails.");
	return user;
}
async function loadStoreSettings(db) {
	const { data } = await db.from("site_settings").select("*");
	const map = {};
	for (const row of data || []) map[row.setting_key] = row.setting_value;
	return normalizeStoreSettings(map);
}
async function ensureInvoiceNumber(db, order) {
	if (order.invoice_number) return order.invoice_number;
	const year = (/* @__PURE__ */ new Date()).getFullYear();
	const { data: lastInv } = await db.from("orders").select("invoice_number").not("invoice_number", "is", null).order("created_at", { ascending: false }).limit(1).maybeSingle();
	const last = Number(String(lastInv?.invoice_number || "").split("-").pop()) || 0;
	const invoiceNumber = `CM-INV-${year}-${String(last + 1).padStart(6, "0")}`;
	await db.from("orders").update({ invoice_number: invoiceNumber }).eq("id", order.id);
	return invoiceNumber;
}
async function loadOrderEmailData(orderId, accessToken) {
	const readableDb = accessToken ? getSupabase(accessToken) : getServiceSupabase();
	const serviceDb = getServiceSupabase();
	const { data: order, error: orderError } = await readableDb.from("orders").select("*").eq("id", orderId).maybeSingle();
	if (orderError || !order) throw new Error("Order not found or not accessible.");
	const [{ data: itemRows }, { data: payments }, store] = await Promise.all([
		serviceDb.from("order_items").select("*").eq("order_id", orderId),
		serviceDb.from("payments").select("*").eq("order_id", orderId).order("created_at", { ascending: false }),
		loadStoreSettings(serviceDb)
	]);
	const invoiceNumber = await ensureInvoiceNumber(serviceDb, order);
	const base = siteUrl().replace(/\/$/, "");
	const normalizedItems = normalizeOrderItems(itemRows || []).map((item) => ({
		...item,
		productImage: publicAssetUrl(item.productImage)
	}));
	return {
		order: {
			...order,
			invoice_number: invoiceNumber
		},
		items: normalizedItems,
		payments: payments || [],
		invoiceNumber,
		store,
		secureOrderUrl: `${base}/account/orders/${encodeURIComponent(order.order_number)}`,
		secureInvoiceUrl: `${base}/account/orders/${encodeURIComponent(order.order_number)}?download=invoice`,
		secureTrackingUrl: `${base}/track-order?order=${encodeURIComponent(order.order_number)}`
	};
}
async function loadCustomerEmailData(customerId, accessToken) {
	const db = accessToken ? getSupabase(accessToken) : getServiceSupabase();
	const store = await loadStoreSettings(getServiceSupabase());
	if (!customerId) return {
		customer: null,
		store
	};
	const { data: customer } = await db.from("customers").select("*").eq("id", customerId).maybeSingle();
	return {
		customer,
		store
	};
}
function validateTemplateData(template, data) {
	if (!ORDER_TEMPLATES.has(template)) return [];
	if (!data) throw new Error("Order data is required for this template.");
	const warnings = [];
	const order = data.order;
	if (template === "shipped" && (!(order.courier_name || order.courier) || !(order.tracking_number || order.tracking_id))) throw new Error("Shipped Email requires saved courier and tracking number.");
	if (template === "delivered" && order.order_status !== "delivered") warnings.push("This order is not marked delivered. The test email will be clearly logged as a test.");
	if (template === "cancellation" && order.order_status !== "cancelled") throw new Error("Cancellation Email requires a cancelled order.");
	if (template === "refund" && !data.payments?.some((p) => p.status === "refunded")) throw new Error("Refund Email requires an existing refund record.");
	return warnings;
}
function renderTemplate(template, request, orderData, customerData) {
	if (template === "welcome") return renderWelcomeEmail({
		customer: customerData?.customer,
		store: customerData.store,
		isTest: request.isTest,
		intendedRecipient: customerData?.customer?.email || null
	});
	if (!orderData) throw new Error("Order data is required.");
	return renderOrderTemplate(template, {
		...orderData,
		isTest: request.isTest,
		intendedRecipient: orderData.order.customer_email || null
	});
}
async function sendProviderEmail(payload) {
	const provider = env("TRANSACTIONAL_EMAIL_PROVIDER") || (env("RESEND_API_KEY") ? "resend" : "development_log");
	if (provider === "resend") {
		const key = env("RESEND_API_KEY");
		if (!key) throw new Error("RESEND_API_KEY is not configured.");
		const from = normalizeEmailFrom(env("EMAIL_FROM"));
		const response = await fetch("https://api.resend.com/emails", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${key}`,
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				from,
				to: payload.to,
				subject: payload.subject,
				html: payload.html,
				text: payload.text
			})
		});
		const json = await response.json().catch(() => ({}));
		if (!response.ok) throw new Error(json?.message || "Email provider rejected the message.");
		return {
			provider,
			providerMessageId: json?.id || null
		};
	}
	console.info("[development_log email]", {
		to: payload.to,
		subject: payload.subject
	});
	return {
		provider: "development_log",
		providerMessageId: `dev_${Date.now().toString(36)}`
	};
}
function normalizeEmailFrom(value) {
	const cleaned = (value || "Creative Muse Fine Jewellery <onboarding@resend.dev>").trim().replace(/^['"]+|['"]+$/g, "").trim();
	if (/^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/.test(cleaned) || /^.{1,120}\s<([^\s<>@]+@[^\s<>@]+\.[^\s<>@]+)>$/.test(cleaned)) return cleaned;
	throw new Error("EMAIL_FROM is invalid. Use email@example.com or Name <email@example.com>. In Vercel, enter the value without surrounding quotes.");
}
async function insertNotification(db, row) {
	const { data, error } = await db.from("order_notifications").insert(row).select("*").single();
	if (error?.code === "23505" && row.idempotency_key) return {
		data: (await db.from("order_notifications").select("*").eq("idempotency_key", row.idempotency_key).maybeSingle()).data,
		duplicate: true
	};
	if (error) throw error;
	return {
		data,
		duplicate: false
	};
}
async function updateNotification(db, id, row) {
	await db.from("order_notifications").update({
		...row,
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	}).eq("id", id);
}
function idempotencyFor(template, orderData, customerId) {
	if (template === "welcome" && customerId) return `welcome:${customerId}`;
	if (!orderData) return void 0;
	if (template === "order_confirmation" || template === "invoice") return `${template}:${orderData.order.id}:v1`;
	if (template === "payment_confirmation") return `payment-paid:${(orderData.payments?.find((p) => p.status === "paid"))?.id || orderData.order.id}`;
	if (template === "shipped") return `shipment:${orderData.order.shipment_id || orderData.order.id}`;
	if (template === "delivered") return `delivered:${orderData.order.id}`;
	if (template === "cancellation") return `cancelled:${orderData.order.id}`;
	if (template === "refund") return `refund:${(orderData.payments?.find((p) => p.status === "refunded"))?.id || orderData.order.id}`;
	return `${template}:${orderData.order.id}`;
}
var getEmailTestingConfig_createServerFn_handler = createServerRpc({
	id: "7e0644bcc6d0c61725ba0bc8b4cafd2eee084a80c1a68a71845501112970a76b",
	name: "getEmailTestingConfig",
	filename: "src/lib/email/server.ts"
}, (opts) => getEmailTestingConfig.__executeServer(opts));
var getEmailTestingConfig = createServerFn({ method: "GET" }).handler(getEmailTestingConfig_createServerFn_handler, async () => ({
	testMode: env("EMAIL_TEST_MODE") === "true",
	defaultRecipient: env("EMAIL_TEST_RECIPIENT"),
	provider: env("TRANSACTIONAL_EMAIL_PROVIDER") || (env("RESEND_API_KEY") ? "resend" : "development_log")
}));
var previewTransactionalEmail_createServerFn_handler = createServerRpc({
	id: "07405c69bbcb79a26f864ea775fb157a74deaa850851f655d944b5805a1213d6",
	name: "previewTransactionalEmail",
	filename: "src/lib/email/server.ts"
}, (opts) => previewTransactionalEmail.__executeServer(opts));
var previewTransactionalEmail = createServerFn({ method: "POST" }).validator((data) => data).handler(previewTransactionalEmail_createServerFn_handler, async ({ data }) => {
	const orderData = ORDER_TEMPLATES.has(data.template) ? await loadOrderEmailData(data.orderId || "", data.accessToken) : void 0;
	const customerData = data.template === "welcome" ? await loadCustomerEmailData(data.customerId, data.accessToken) : void 0;
	const warnings = validateTemplateData(data.template, orderData);
	return {
		...renderTemplate(data.template, {
			...data,
			isTest: true
		}, orderData, customerData),
		templateLabel: TEMPLATE_LABELS[data.template],
		warnings
	};
});
var sendTransactionalEmail_createServerFn_handler = createServerRpc({
	id: "52f38a3bd794cfc2e50e966b15d6b3d19de6c410bbcd2063c27bfc0b72dc3b2e",
	name: "sendTransactionalEmail",
	filename: "src/lib/email/server.ts"
}, (opts) => sendTransactionalEmail.__executeServer(opts));
var sendTransactionalEmail = createServerFn({ method: "POST" }).validator((data) => data).handler(sendTransactionalEmail_createServerFn_handler, async ({ data }) => {
	const db = getServiceSupabase();
	const actor = data.source === "admin_settings" || data.isTest ? await requireEmailTestingPermission(data.accessToken) : await requireActor(data.accessToken);
	const orderData = ORDER_TEMPLATES.has(data.template) ? await loadOrderEmailData(data.orderId || "", data.accessToken) : void 0;
	const customerData = data.template === "welcome" ? await loadCustomerEmailData(data.customerId, data.accessToken) : void 0;
	const warnings = validateTemplateData(data.template, orderData);
	const intendedRecipient = orderData?.order.customer_email || customerData?.customer?.email || data.recipient || "";
	const testMode = env("EMAIL_TEST_MODE") === "true" || data.isTest === true;
	const testRecipient = data.recipient || env("EMAIL_TEST_RECIPIENT");
	const actualRecipient = testMode ? testRecipient : intendedRecipient;
	if (!isValidEmail(actualRecipient)) throw new Error("A valid recipient email is required.");
	const rendered = renderTemplate(data.template, {
		...data,
		isTest: testMode
	}, orderData, customerData);
	const subject = testMode && !rendered.subject.startsWith("[TEST]") ? `[TEST] ${rendered.subject}` : rendered.subject;
	const idempotency = testMode || data.resendNotificationId ? void 0 : idempotencyFor(data.template, orderData, data.customerId);
	const inserted = await insertNotification(db, {
		order_id: orderData?.order.id || null,
		customer_id: orderData?.order.customer_id || customerData?.customer?.id || data.customerId || null,
		notification_type: data.template,
		idempotency_key: idempotency,
		intended_recipient: intendedRecipient || null,
		actual_recipient: actualRecipient,
		subject,
		provider: env("TRANSACTIONAL_EMAIL_PROVIDER") || (env("RESEND_API_KEY") ? "resend" : "development_log"),
		status: "sending",
		initiated_by: actor?.id || data.initiatedBy || null,
		is_test: testMode,
		test_template: testMode ? data.template : null,
		test_recipient: testMode ? actualRecipient : null,
		source: data.source || (testMode ? "admin_settings" : "system"),
		metadata: {
			template_label: TEMPLATE_LABELS[data.template],
			resend_notification_id: data.resendNotificationId || null,
			warnings
		}
	});
	if (inserted.duplicate) return {
		status: "duplicate",
		notification: inserted.data,
		warnings
	};
	try {
		const providerResult = await sendProviderEmail({
			to: actualRecipient,
			subject,
			html: rendered.html,
			text: rendered.text
		});
		const now = (/* @__PURE__ */ new Date()).toISOString();
		await updateNotification(db, inserted.data.id, {
			status: "sent",
			provider: providerResult.provider,
			provider_message_id: providerResult.providerMessageId,
			sent_at: now
		});
		if (data.template === "welcome" && !testMode && customerData?.customer?.id) await db.from("customers").update({ welcome_email_sent_at: now }).eq("id", customerData.customer.id);
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
					is_test: testMode
				}
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
			warnings
		};
	} catch (error) {
		const now = (/* @__PURE__ */ new Date()).toISOString();
		await updateNotification(db, inserted.data.id, {
			status: "failed",
			failed_at: now,
			error_summary: safeError(error)
		});
		if (orderData?.order.id) await db.from("audit_logs").insert({
			user_id: actor?.id || null,
			action: `${data.template}_email_failed${testMode ? "_test" : ""}`,
			entity_type: "order",
			entity_id: orderData.order.id,
			new_values: {
				is_test: testMode,
				error_summary: safeError(error)
			}
		});
		throw new Error(safeError(error));
	}
});
var listOrderNotifications_createServerFn_handler = createServerRpc({
	id: "a4e8a2bff99be592783d09c561ddad54456e037f34dad45807685a4f47a77d63",
	name: "listOrderNotifications",
	filename: "src/lib/email/server.ts"
}, (opts) => listOrderNotifications.__executeServer(opts));
var listOrderNotifications = createServerFn({ method: "POST" }).validator((data) => data).handler(listOrderNotifications_createServerFn_handler, async ({ data }) => {
	await requireEmailTestingPermission(data.accessToken);
	let query = getServiceSupabase().from("order_notifications").select("*").order("created_at", { ascending: false }).limit(data.limit || 25);
	if (data.orderId) query = query.eq("order_id", data.orderId);
	if (typeof data.isTest === "boolean") query = query.eq("is_test", data.isTest);
	const { data: rows, error } = await query;
	if (error) throw error;
	return rows || [];
});
//#endregion
export { getEmailTestingConfig_createServerFn_handler, listOrderNotifications_createServerFn_handler, previewTransactionalEmail_createServerFn_handler, sendTransactionalEmail_createServerFn_handler };
