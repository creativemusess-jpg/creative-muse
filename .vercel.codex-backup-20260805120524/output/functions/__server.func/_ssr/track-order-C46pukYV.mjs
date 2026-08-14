import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { ht as ExternalLink, k as Search, p as Truck, vt as Download } from "../_libs/lucide-react.mjs";
import { n as PageShell, t as PageHeader } from "./PageHeader-DZsnNyor.mjs";
import { t as storefrontSupabase } from "./supabase-storefront-B2iEpuwU.mjs";
import { t as normalizeOrderItems } from "./order-items-1dSWUIeN.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/track-order-C46pukYV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function formatDate(value) {
	return value ? new Date(value).toLocaleDateString("en-IN", {
		day: "2-digit",
		month: "long",
		year: "numeric"
	}) : "-";
}
function TrackPage() {
	const [orderNumber, setOrderNumber] = (0, import_react.useState)("");
	const [identity, setIdentity] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [order, setOrder] = (0, import_react.useState)(null);
	const [items, setItems] = (0, import_react.useState)([]);
	const handleTrack = async (event) => {
		event.preventDefault();
		setLoading(true);
		setError("");
		setOrder(null);
		setItems([]);
		const identityClean = identity.trim().toLowerCase();
		try {
			const { data } = await storefrontSupabase.from("orders").select("*").eq("order_number", orderNumber.trim()).maybeSingle();
			const emailMatches = data?.customer_email?.toLowerCase() === identityClean;
			const phoneDigits = String(data?.customer_phone || "").replace(/\D/g, "");
			const inputDigits = identityClean.replace(/\D/g, "");
			const phoneMatches = inputDigits.length >= 6 && phoneDigits.endsWith(inputDigits.slice(-10));
			if (!data || !emailMatches && !phoneMatches) {
				setError("We could not verify that order. Please check the order number and email or phone.");
				return;
			}
			setOrder(data);
			const { data: itemRows } = await storefrontSupabase.from("order_items").select("*").eq("order_id", data.id);
			setItems(normalizeOrderItems(itemRows || []));
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PageShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		eyebrow: "Tracking",
		title: "Track Your Order",
		subtitle: "Verify with your order number and email or phone."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-[920px] px-4 py-10 sm:px-6 sm:py-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleTrack,
				className: "grid gap-3 rounded-[8px] border border-[#ead8b8] bg-white p-4 shadow-[0_4px_24px_rgba(0,0,0,0.05)] sm:grid-cols-[1fr_1fr_auto]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7A2533]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: orderNumber,
							onChange: (e) => setOrderNumber(e.target.value),
							placeholder: "Order number",
							required: true,
							className: "w-full rounded-[6px] border border-[#e0d8cc] py-3 pl-10 pr-3 text-sm focus:outline-none focus:border-[#7A2533]"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: identity,
						onChange: (e) => setIdentity(e.target.value),
						placeholder: "Email or phone",
						required: true,
						className: "w-full rounded-[6px] border border-[#e0d8cc] px-3 py-3 text-sm focus:outline-none focus:border-[#7A2533]"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						disabled: loading,
						className: "btn-primary justify-center disabled:opacity-60",
						children: loading ? "Checking..." : "Track"
					})
				]
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 rounded-[8px] border border-red-200 bg-red-50 p-4 text-sm text-red-700",
				children: error
			}),
			order && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 rounded-[8px] border border-[#ead8b8] bg-[#fffdf8] p-5 shadow-[0_10px_30px_rgba(40,24,8,0.06)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-4 border-b border-[#ead8b8] pb-5 sm:flex-row sm:items-center sm:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[11px] font-semibold uppercase tracking-wider text-[#7A2533]",
							children: ["Order ", order.order_number]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display mt-1 text-2xl font-semibold text-[#1a1a2e]",
							children: order.order_status.replace(/_/g, " ")
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-green-100 px-3 py-1 text-xs font-semibold capitalize text-green-700",
								children: order.payment_status
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold capitalize text-amber-700",
								children: order.order_status.replace(/_/g, " ")
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-5 py-5 lg:grid-cols-[1fr_320px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-3",
							children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-4 rounded-[8px] border border-[#ead8b8] bg-white p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-20 w-20 shrink-0 overflow-hidden rounded-[6px] bg-[#fff7e8]",
									children: item.productImage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: item.productImage,
										alt: item.productName,
										className: "h-full w-full object-contain p-1"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-semibold text-[#1a1a2e]",
										children: item.productName
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-2 text-xs text-[#7a6e64]",
										children: ["Qty: ", item.quantity]
									})]
								})]
							}, item.id))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-[8px] border border-[#ead8b8] bg-white p-4 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mb-3 text-[12px] font-bold uppercase tracking-wider text-[#7A2533]",
									children: "Shipment"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
									label: "Courier",
									value: order.courier_name || order.courier || "Pending"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
									label: "Shipment ID",
									value: order.shipment_id || "Pending"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
									label: "Tracking Number",
									value: order.tracking_number || order.tracking_id || "Pending"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
									label: "Shipped Date",
									value: formatDate(order.shipped_at)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
									label: "Estimated Delivery",
									value: formatDate(order.estimated_delivery_at)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
									label: "Delivered Date",
									value: formatDate(order.delivered_at || order.actual_delivery_at)
								}),
								order.tracking_url && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: order.tracking_url,
									target: "_blank",
									rel: "noreferrer",
									className: "mt-3 inline-flex w-full items-center justify-center gap-2 rounded-[6px] bg-[#7A2533] px-4 py-3 text-sm font-semibold text-white hover:bg-[#5F1C27]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-4 w-4" }), " Track Shipment"]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 border-t border-[#ead8b8] pt-5 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => window.print(),
							className: "inline-flex items-center justify-center gap-2 rounded-[6px] border border-[#7A2533] px-4 py-3 text-sm font-semibold text-[#7A2533]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4" }), " Download Invoice"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: order.tracking_url || "#",
							className: "inline-flex items-center justify-center gap-2 rounded-[6px] bg-[#7A2533] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#5F1C27]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-4 w-4" }), " Shipment Details"]
						})]
					})
				]
			})
		]
	})] });
}
function Info({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex justify-between border-b border-[#f0e4cd] py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-[#7a6e64]",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-semibold text-[#1a1a2e]",
			children: value
		})]
	});
}
//#endregion
export { TrackPage as component };
