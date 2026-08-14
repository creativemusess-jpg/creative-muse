import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { _ as Link, b as useParams, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { At as ChevronLeft, B as Package, Mt as Check, ot as Headphones, p as Truck, vt as Download } from "../_libs/lucide-react.mjs";
import { n as PageShell } from "./PageHeader-DZsnNyor.mjs";
import { t as storefrontSupabase } from "./supabase-storefront-B2iEpuwU.mjs";
import { n as useAuth } from "./auth-D2-u71mo.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { t as normalizeOrderItems } from "./order-items-1dSWUIeN.mjs";
import { t as generateInvoicePdf } from "./invoice-pdf-B4IYl00w.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/account.orders._orderNumber-DWLY3sBe.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var steps = [
	"confirmed",
	"processing",
	"shipped",
	"delivered"
];
function formatPrice(n) {
	return "₹" + Number(n || 0).toLocaleString("en-IN");
}
function formatDate(value) {
	return value ? new Date(value).toLocaleDateString("en-IN", {
		day: "2-digit",
		month: "long",
		year: "numeric"
	}) : "-";
}
function statusIndex(status) {
	if (status === "pending") return 0;
	if (status === "confirmed") return 0;
	if (status === "processing") return 1;
	if (status === "shipped" || status === "out_for_delivery") return 2;
	if (status === "delivered") return 3;
	return 0;
}
function addressText(addr) {
	if (!addr) return "-";
	if (typeof addr === "string") return addr;
	return [
		addr.addressLine1,
		addr.addressLine2,
		addr.landmark,
		[addr.locality, addr.city].filter(Boolean).join(", "),
		[addr.state, addr.postalCode || addr.pincode].filter(Boolean).join(" - "),
		addr.country
	].filter(Boolean).join("\n");
}
function AccountOrderDetailPage() {
	const { user, loading } = useAuth();
	const navigate = useNavigate();
	const { orderNumber } = useParams({ from: "/account/orders/$orderNumber" });
	const [order, setOrder] = (0, import_react.useState)(null);
	const [items, setItems] = (0, import_react.useState)([]);
	const [pageLoading, setPageLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		if (!loading && !user) navigate({
			to: "/login",
			search: { redirect: `/account/orders/${orderNumber}` }
		});
	}, [
		user,
		loading,
		navigate,
		orderNumber
	]);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		(async () => {
			setPageLoading(true);
			const { data: orderData } = await storefrontSupabase.from("orders").select("*").eq("order_number", orderNumber).eq("customer_id", user.id).maybeSingle();
			setOrder(orderData);
			if (orderData) {
				const { data: itemsData } = await storefrontSupabase.from("order_items").select("*").eq("order_id", orderData.id);
				setItems(normalizeOrderItems(itemsData || []));
			}
			setPageLoading(false);
		})();
	}, [user, orderNumber]);
	if (loading || !user || pageLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-[960px] px-6 py-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-6 w-48" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-72" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-40 w-full rounded-[16px]" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-32 w-full rounded-[16px]" })
			]
		})
	}) });
	if (!order) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "mx-auto max-w-[900px] px-6 py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-[18px] bg-white p-10 text-center shadow-[0_4px_24px_rgba(0,0,0,0.05)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "mx-auto h-10 w-10 text-[#7A2533]" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display mt-4 text-xl font-semibold text-[#1a1a2e]",
					children: "Order not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/account/orders",
					className: "btn-primary mt-6 inline-flex",
					children: "View All Orders"
				})
			]
		})
	}) });
	const activeStep = statusIndex(order.order_status);
	const delivery = order.delivery_address || order.shipping_address;
	const handleDownloadInvoice = async () => {
		await generateInvoicePdf({
			order,
			items
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-[1120px] px-4 py-8 sm:px-6 sm:py-14",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/account/orders",
			className: "mb-5 inline-flex items-center gap-1 text-sm font-medium text-[#7a6e64] hover:text-[#8B1A1A]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-4 w-4" }), " All Orders"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-[8px] border border-[#ead8b8] bg-[#fffdf8] p-5 shadow-[0_10px_30px_rgba(40,24,8,0.06)] sm:p-7",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-4 border-b border-[#ead8b8] pb-5 sm:flex-row sm:items-center sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#7A2533] text-[#7A2533]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-7 w-7" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "font-display text-2xl font-semibold text-[#1a1a2e]",
							children: [
								"Thank You, ",
								user.fullName?.split(" ")[0] || "Customer",
								"!"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-[#6f6252]",
							children: "Your order has been confirmed and we're preparing it with care."
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-sm text-[#6f6252]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Order:" }),
							" ",
							order.order_number
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Date:" }),
							" ",
							formatDate(order.created_at)
						] })]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid border-b border-[#ead8b8] text-sm sm:grid-cols-4",
					children: [
						["Order Number", order.order_number],
						["Order Date", formatDate(order.created_at)],
						["Payment Status", order.payment_status],
						["Order Status", order.order_status]
					].map(([label, value]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-[#ead8b8] px-2 py-4 sm:border-r sm:last:border-r-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] font-semibold uppercase tracking-wider text-[#7a6e64]",
							children: label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: `mt-1 font-semibold capitalize ${String(value).includes("paid") || String(value).includes("confirmed") ? "text-green-700" : "text-[#1a1a2e]"}`,
							children: value
						})]
					}, label))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-b border-[#ead8b8] py-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-4 text-[11px] font-semibold uppercase tracking-wider text-[#7a6e64]",
						children: "Delivery Progress"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-4 gap-2",
						children: steps.map((step, index) => {
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative text-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `mx-auto flex h-9 w-9 items-center justify-center rounded-full border ${index <= activeStep ? "border-[#7A2533] bg-[#7A2533] text-white" : "border-[#d9c9ab] bg-white text-[#9a8a74]"}`,
									children: step === "shipped" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-4 w-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-[11px] font-medium capitalize text-[#5d554d]",
									children: step
								})]
							}, step);
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-5 py-5 lg:grid-cols-[1fr_320px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-[8px] border border-[#ead8b8] bg-white",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "border-b border-[#ead8b8] px-4 py-3 text-[12px] font-bold uppercase tracking-wider text-[#7A2533]",
							children: "Order Items"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "divide-y divide-[#ead8b8]",
							children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-4 p-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-24 w-24 shrink-0 overflow-hidden rounded-[6px] bg-[#fff7e8]",
										children: item.productImage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: item.productImage,
											alt: item.productName,
											className: "h-full w-full object-contain p-1"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-semibold text-[#1a1a2e]",
												children: item.productName
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "mt-4 text-xs text-[#7a6e64]",
												children: ["Qty: ", item.quantity]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-xs text-[#7a6e64]",
												children: ["Unit Price: ", formatPrice(item.unitPrice)]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "self-center text-sm font-semibold text-[#1a1a2e]",
										children: formatPrice(item.lineTotal)
									})
								]
							}, item.id))
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-[8px] border border-[#ead8b8] bg-white p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mb-3 text-[12px] font-bold uppercase tracking-wider text-[#7A2533]",
								children: "Price Summary"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryRow, {
								label: "Subtotal",
								value: formatPrice(order.subtotal)
							}),
							order.discount_amount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryRow, {
								label: "Discount",
								value: `-${formatPrice(order.discount_amount)}`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryRow, {
								label: "Shipping",
								value: Number(order.shipping_amount || 0) === 0 ? "Free" : formatPrice(order.shipping_amount)
							}),
							order.gift_packaging_enabled && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryRow, {
								label: order.gift_packaging_name || "Gift Packaging",
								value: formatPrice(order.gift_packaging_price || 0)
							}), order.gift_message && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs italic text-[#7a6e64]",
								children: [
									"Gift message: \"",
									order.gift_message,
									"\""
								]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 border-t border-[#1a1a2e] pt-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryRow, {
									label: "Grand Total",
									value: formatPrice(order.total_amount),
									strong: true
								})
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 border-t border-[#ead8b8] pt-5 md:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoCard, {
							title: "Billing Address",
							text: `${order.customer_name || ""}\n${order.customer_email || ""}\n${order.customer_phone || ""}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoCard, {
							title: "Shipping Address",
							text: addressText(delivery)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoCard, {
							title: "Delivery",
							text: `${order.delivery_method === "express" ? "Express Delivery" : "Standard Delivery"}\nEstimated: ${formatDate(order.estimated_delivery_at)}\nTracking: ${order.tracking_number || order.tracking_id || "Pending"}`
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 grid gap-3 sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/track-order",
							className: "inline-flex items-center justify-center gap-2 rounded-[6px] bg-[#7A2533] px-4 py-3 text-sm font-semibold text-white hover:bg-[#5F1C27]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-4 w-4" }), " Track Order"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: handleDownloadInvoice,
							className: "inline-flex items-center justify-center gap-2 rounded-[6px] border border-[#7A2533] px-4 py-3 text-sm font-semibold text-[#7A2533]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4" }), " Download Invoice"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: "mailto:hello@creativemuse.in",
							className: "inline-flex items-center justify-center gap-2 rounded-[6px] border border-[#7A2533] px-4 py-3 text-sm font-semibold text-[#7A2533]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Headphones, { className: "h-4 w-4" }), " Contact Support"]
						})
					]
				})
			]
		})]
	}) });
}
function SummaryRow({ label, value, strong }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `flex justify-between py-1 text-sm ${strong ? "font-bold text-[#1a1a2e]" : "text-[#6f6252]"}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: value })]
	});
}
function InfoCard({ title, text }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-[8px] border border-[#ead8b8] bg-white p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[11px] font-bold uppercase tracking-wider text-[#7A2533]",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 whitespace-pre-line text-sm leading-6 text-[#5d554d]",
			children: text || "-"
		})]
	});
}
//#endregion
export { AccountOrderDetailPage as component };
