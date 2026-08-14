import { o as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./supabase-Bz-JQXNc.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as formatPrice } from "./products-6Nbb9Ru-.mjs";
import { _ as Link, b as useParams, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { B as Package, Bt as ArrowRight, Tt as CircleCheckBig, Y as LoaderCircle, vt as Download } from "../_libs/lucide-react.mjs";
import { n as PageShell } from "./PageHeader-DZsnNyor.mjs";
import { t as generateInvoicePdf } from "./invoice-pdf-B4IYl00w.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/order-success._orderNumber-DV0oryge.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var db = () => supabase;
function OrderSuccessPage() {
	const { orderNumber } = useParams({ from: "/order-success/$orderNumber" });
	useNavigate();
	const [order, setOrder] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [items, setItems] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		async function load() {
			const cached = sessionStorage.getItem("cm_order_success");
			if (cached) try {
				const parsed = JSON.parse(cached);
				if (parsed.orderNumber === orderNumber) {
					setOrder({
						order_number: parsed.orderNumber,
						customer_name: parsed.customerName,
						customer_email: parsed.customerEmail,
						subtotal: parsed.subtotal,
						discount_amount: parsed.discountAmount,
						shipping_amount: parsed.shipping,
						tax_amount: parsed.tax,
						total_amount: parsed.total,
						delivery_method: parsed.deliveryMethod,
						delivery_address: parsed.deliveryAddress || {},
						gift_packaging_enabled: parsed.giftPackagingEnabled || false,
						gift_packaging_price: parsed.giftPackagingPrice || 0,
						gift_packaging_name: parsed.giftPackagingName || "",
						gift_message: parsed.giftMessage || "",
						coupon_code: parsed.couponCode,
						payment_method: parsed.paymentMethod,
						payment_status: "paid",
						order_status: "confirmed",
						created_at: parsed.created_at
					});
					if (parsed.items) setItems(parsed.items.map((i) => ({
						product_name: i.name,
						quantity: i.qty,
						unit_price: i.unitPrice,
						total_price: i.lineTotal
					})));
					sessionStorage.removeItem("cm_order_success");
					setLoading(false);
					return;
				}
			} catch {}
			const { data } = await db().from("orders").select("*").eq("order_number", orderNumber).maybeSingle();
			setOrder(data);
			if (data?.id) {
				const { data: orderItems } = await db().from("order_items").select("*").eq("order_id", data.id);
				if (orderItems) setItems(orderItems);
			}
			setLoading(false);
		}
		load();
	}, [orderNumber]);
	const handleDownloadInvoice = async () => {
		await generateInvoicePdf({
			order,
			items
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto flex min-h-[70vh] max-w-[600px] items-center justify-center px-4 py-20",
		children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-10 w-10 animate-spin text-[#7A2533]" }) : order ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#7A2533]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "h-10 w-10 text-white" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display mt-6 text-3xl font-semibold text-[#1a1a2e]",
					children: "Thank You for Your Order"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-[#7a6e64]",
					children: "Your jewellery is being prepared with care."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 rounded-[28px] border border-[#e0d8cc] bg-white p-6 text-left shadow-[0_4px_24px_rgba(0,0,0,0.05)]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoRow, {
								label: "Order",
								value: order.order_number
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoRow, {
								label: "Status",
								value: order.order_status
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoRow, {
								label: "Payment",
								value: order.payment_status === "paid" ? "Paid (Demo)" : "Pending"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoRow, {
								label: "Subtotal",
								value: formatPrice(order.subtotal)
							}),
							order.shipping_amount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoRow, {
								label: "Shipping",
								value: formatPrice(order.shipping_amount)
							}),
							order.gift_packaging_enabled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoRow, {
								label: order.gift_packaging_name || "Gift Packaging",
								value: formatPrice(order.gift_packaging_price || 0)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "border-t border-[#e0d8cc] pt-2" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoRow, {
								label: "Total Paid",
								value: formatPrice(order.total_amount),
								bold: true
							}),
							order.delivery_method && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoRow, {
								label: "Delivery",
								value: order.delivery_method === "express" ? "Express" : "Standard"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoRow, {
								label: "Email",
								value: order.customer_email
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 text-sm text-amber-700",
					children: "This order was placed using the demo payment environment. No real payment was charged."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 flex flex-wrap items-center justify-center gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: handleDownloadInvoice,
							className: "btn-primary inline-flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4" }), " Download Invoice"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/account/orders/$orderNumber",
							params: { orderNumber },
							className: "btn-primary inline-flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-4 w-4" }), " View Order"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/",
							className: "btn-secondary",
							children: ["Return to Home ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
						})
					]
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-2xl font-semibold text-[#1a1a2e]",
					children: "Order Not Found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-[#7a6e64]",
					children: "We couldn't find this order."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "btn-primary mt-6 inline-flex",
					children: "Go Home"
				})
			]
		})
	}) });
}
function InfoRow({ label, value, bold }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `flex items-center justify-between border-b border-[#f5efe8] pb-2 ${bold ? "font-semibold" : ""}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-[#7a6e64]",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: `${bold ? "font-semibold text-base" : "font-medium"} text-[#1a1a2e]`,
			children: value
		})]
	});
}
//#endregion
export { OrderSuccessPage as component };
