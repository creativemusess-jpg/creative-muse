import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { _ as Link, l as useLocation, p as Outlet } from "../_libs/@tanstack/react-router+[...].mjs";
import { k as Search, pt as Eye } from "../_libs/lucide-react.mjs";
import { i as AdminPageHeader, n as AdminLayout, r as AdminLoading, s as ordersApi, t as AdminEmpty } from "./AdminLayout-D0HWfGfb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.orders-DqixGLrL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var statusColors = {
	pending: "bg-yellow-100 text-yellow-700",
	confirmed: "bg-blue-100 text-blue-700",
	processing: "bg-indigo-100 text-indigo-700",
	shipped: "bg-purple-100 text-purple-700",
	out_for_delivery: "bg-orange-100 text-orange-700",
	delivered: "bg-green-100 text-green-700",
	cancelled: "bg-red-100 text-red-600",
	returned: "bg-gray-100 text-gray-600",
	refunded: "bg-pink-100 text-pink-700"
};
function AdminOrders() {
	const location = useLocation();
	const [orders, setOrders] = (0, import_react.useState)([]);
	const [count, setCount] = (0, import_react.useState)(0);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [search, setSearch] = (0, import_react.useState)("");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("");
	const fetchOrders = async () => {
		setLoading(true);
		try {
			const result = await ordersApi.list({
				search: search || void 0,
				status: statusFilter || void 0
			});
			setOrders(result.data);
			setCount(result.count);
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		fetchOrders();
	}, [search, statusFilter]);
	const handleStatusUpdate = async (id, status) => {
		try {
			await ordersApi.updateStatus(id, status);
			fetchOrders();
		} catch (err) {
			console.error(err);
		}
	};
	const formatPrice = (n) => "₹" + n.toLocaleString("en-IN");
	if (location.pathname !== "/admin/orders") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminLayout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPageHeader, {
			title: "Orders",
			description: `${count} orders total`
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex flex-col gap-3 sm:flex-row",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "text",
					placeholder: "Search orders...",
					value: search,
					onChange: (e) => setSearch(e.target.value),
					className: "w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-sm outline-none focus:border-[#7A2533]"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
				value: statusFilter,
				onChange: (e) => setStatusFilter(e.target.value),
				className: "rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "",
					children: "All Status"
				}), Object.keys(statusColors).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: s,
					children: s.replace(/_/g, " ")
				}, s))]
			})]
		}),
		loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLoading, {}) : orders.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminEmpty, {
			title: "No orders yet",
			description: "Orders will appear here when customers make purchases"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto rounded-xl border border-gray-200 bg-white",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-left text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-gray-100 bg-gray-50",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider",
							children: "Order"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider",
							children: "Customer"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider",
							children: "Products"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider",
							children: "Amount"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider",
							children: "Payment"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider",
							children: "Method"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider",
							children: "Status"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider",
							children: "Date"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider",
							children: "Actions"
						})
					]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
					className: "divide-y divide-gray-100",
					children: orders.map((order) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "hover:bg-gray-50",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 font-medium text-[#1a1a2e]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/admin/orders/$id",
									params: { id: order.id },
									className: "hover:text-[#7A2533]",
									children: ["#", order.order_number]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-4 py-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium text-gray-900",
									children: order.customer_name || order.customer_email?.split("@")[0] || "—"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-gray-500",
									children: order.customer_email
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: order._items?.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex -space-x-2",
										children: order._items.slice(0, 3).map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-8 w-8 overflow-hidden rounded-full border-2 border-white bg-gray-100",
											children: item.productImage ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: item.productImage,
												alt: item.productName,
												className: "h-full w-full object-contain p-0.5"
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex h-full w-full items-center justify-center text-[10px] text-gray-400",
												children: item.productName?.[0] || "?"
											})
										}, i))
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate text-sm font-medium text-gray-900 max-w-[140px]",
											children: order._items[0].productName
										}), order._items.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-[11px] text-gray-500",
											children: [
												"+",
												order._items.length - 1,
												" more"
											]
										})]
									})]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-gray-400",
									children: "—"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 font-medium",
								children: formatPrice(order.total_amount)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${order.payment_status === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`,
										children: order.payment_status
									}), order.payment_method === "test" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "inline-block rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-semibold text-purple-700 uppercase",
										children: "Test"
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-xs capitalize text-gray-500",
								children: order.payment_method || "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: order.order_status,
									onChange: (e) => handleStatusUpdate(order.id, e.target.value),
									className: `rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase outline-none ${statusColors[order.order_status] || "bg-gray-100 text-gray-600"}`,
									children: Object.keys(statusColors).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: s,
										children: s.replace(/_/g, " ")
									}, s))
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-xs text-gray-500",
								children: new Date(order.created_at).toLocaleDateString()
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/admin/orders/$id",
									params: { id: order.id },
									className: "rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-[#7A2533]",
									"aria-label": "View order details",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
								})
							})
						]
					}, order.id))
				})]
			})
		})
	] });
}
//#endregion
export { AdminOrders as component };
