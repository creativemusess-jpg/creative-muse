import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { _ as Link, b as useParams } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as ShoppingCart, I as Phone, K as MapPin, Pt as Calendar, Vt as ArrowLeft, q as Mail, yt as DollarSign } from "../_libs/lucide-react.mjs";
import { n as AdminLayout, o as customersApi, r as AdminLoading, s as ordersApi } from "./AdminLayout-D0HWfGfb.mjs";
import { r as StatusBadge } from "./AdminTable-9BSMWvKK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.customers._id-e--0sl3R.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CustomerDetailPage() {
	const { id } = useParams({ from: "/admin/customers/$id" });
	const [customer, setCustomer] = (0, import_react.useState)(null);
	const [orders, setOrders] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		Promise.all([customersApi.getById(id), ordersApi.list({ per_page: 50 })]).then(([c, o]) => {
			setCustomer(c);
			setOrders((o.data ?? []).filter((ord) => ord.customer_email === c?.email || ord.customer_id === id));
			setLoading(false);
		});
	}, [id]);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLoading, {}) });
	if (!customer) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "py-20 text-center text-gray-500",
		children: "Customer not found"
	}) });
	const totalSpent = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
	const avgOrderValue = orders.length > 0 ? totalSpent / orders.length : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminLayout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/admin/customers",
				className: "inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#7A2533]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), " Customers"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-xl border border-gray-200 bg-white p-5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex h-16 w-16 items-center justify-center rounded-full bg-[#1a1a2e] text-2xl font-bold text-white",
					children: (customer.full_name || customer.email || "?").charAt(0).toUpperCase()
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-xl font-bold text-[#1a1a2e]",
						children: customer.full_name || "Unnamed"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-gray-500",
						children: customer.email || "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-gray-400",
						children: ["Customer since ", new Date(customer.created_at).toLocaleDateString()]
					})
				] })]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
			children: [
				{
					title: "Total Spent",
					value: `₹${totalSpent.toLocaleString("en-IN")}`,
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "h-6 w-6" })
				},
				{
					title: "Orders",
					value: String(orders.length),
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { className: "h-6 w-6" })
				},
				{
					title: "Avg. Order Value",
					value: `₹${Math.round(avgOrderValue).toLocaleString("en-IN")}`,
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "h-6 w-6" })
				},
				{
					title: "Member Since",
					value: new Date(customer.created_at).toLocaleDateString(),
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-6 w-6" })
				}
			].map((card) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-xl border border-gray-200 bg-white p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium text-gray-500",
						children: card.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-lg font-bold text-[#1a1a2e]",
						children: card.value
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-gray-300",
						children: card.icon
					})]
				})
			}, card.title))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 grid gap-6 lg:grid-cols-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "lg:col-span-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-gray-200 bg-white",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "border-b border-gray-100 px-5 py-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-bold text-[#1a1a2e]",
							children: "Order History"
						})
					}), orders.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "divide-y divide-gray-100",
						children: orders.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/admin/orders/$id",
							params: { id: o.id },
							className: "flex items-center justify-between px-5 py-3 hover:bg-gray-50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium text-[#1a1a2e]",
								children: o.order_number || `#${o.id.slice(0, 8)}`
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-gray-400",
								children: new Date(o.created_at).toLocaleDateString()
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: o.status || "pending" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-sm font-medium",
									children: ["₹", (o.total_amount ?? 0).toLocaleString("en-IN")]
								})]
							})]
						}, o.id))
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "px-5 py-8 text-center text-sm text-gray-400",
						children: "No orders yet"
					})]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-gray-200 bg-white p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-bold text-[#1a1a2e]",
						children: "Contact"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-4 w-4 text-gray-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-gray-600",
								children: customer.email || "—"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-4 w-4 text-gray-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-gray-600",
								children: customer.phone || "—"
							})]
						})]
					})]
				}), customer.shipping_address && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-gray-200 bg-white p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-bold text-[#1a1a2e]",
						children: "Default Address"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex items-start gap-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "mt-0.5 h-4 w-4 text-gray-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-gray-600 whitespace-pre-line",
							children: customer.shipping_address
						})]
					})]
				})]
			})]
		})
	] });
}
//#endregion
export { CustomerDetailPage as component };
