import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { B as Package, C as ShoppingCart, Ct as Clock, c as Users, h as TrendingUp, m as TriangleAlert, q as Mail, rt as House, v as Tag, yt as DollarSign, zt as ArrowUpRight } from "../_libs/lucide-react.mjs";
import { i as AdminPageHeader, n as AdminLayout, r as AdminLoading } from "./AdminLayout-D0HWfGfb.mjs";
import { t as analyticsApi } from "./analytics-B1LIpryr.mjs";
import { r as StatusBadge } from "./AdminTable-9BSMWvKK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.index-BPH28pNb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminDashboard() {
	const [metrics, setMetrics] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		analyticsApi.getDashboardMetrics().then(setMetrics).finally(() => setLoading(false));
	}, []);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLoading, {}) });
	const m = metrics;
	const statCards = [
		{
			title: "Total Sales",
			value: `₹${(m?.totalSales ?? 0).toLocaleString("en-IN")}`,
			subtitle: `${m?.totalOrders ?? 0} orders`,
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "h-8 w-8" })
		},
		{
			title: "Revenue Today",
			value: `₹${(m?.revenueToday ?? 0).toLocaleString("en-IN")}`,
			subtitle: "Today",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-8 w-8" })
		},
		{
			title: "Revenue This Month",
			value: `₹${(m?.revenueThisMonth ?? 0).toLocaleString("en-IN")}`,
			subtitle: `${m?.totalOrders ?? 0} total orders`,
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-8 w-8" })
		},
		{
			title: "Avg. Order Value",
			value: `₹${Math.round(m?.averageOrderValue ?? 0).toLocaleString("en-IN")}`,
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-8 w-8" })
		},
		{
			title: "Active Products",
			value: String(m?.activeProducts ?? 0),
			subtitle: `${m?.draftProducts ?? 0} draft`,
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-8 w-8" })
		},
		{
			title: "Orders",
			value: String(m?.totalOrders ?? 0),
			subtitle: `${m?.pendingOrders ?? 0} pending`,
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { className: "h-8 w-8" })
		},
		{
			title: "Customers",
			value: String(m?.totalCustomers ?? 0),
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-8 w-8" })
		},
		{
			title: "Newsletter",
			value: String(m?.subscriberCount ?? 0),
			subtitle: "subscribers",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-8 w-8" })
		}
	];
	const needsAttention = (m?.unfulfilledOrders ?? 0) + (m?.pendingOrders ?? 0) > 0 || (m?.outOfStockProducts ?? 0) > 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminLayout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPageHeader, {
			title: "Dashboard",
			description: "Store overview"
		}),
		needsAttention && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "mt-0.5 h-5 w-5 text-amber-500 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-semibold text-amber-800",
					children: "Items needing attention"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-1 flex flex-wrap gap-3 text-xs text-amber-700",
					children: [
						m.pendingOrders > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [m.pendingOrders, " pending orders"] }),
						m.unfulfilledOrders > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [m.unfulfilledOrders, " unfulfilled orders"] }),
						(m.outOfStockProducts ?? 0) > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [m.outOfStockProducts, " out-of-stock products"] })
					]
				})] })]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
			children: statCards.map((card) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-xl border border-gray-200 bg-white p-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium text-gray-500",
							children: card.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-2xl font-bold text-[#1a1a2e]",
							children: card.value
						}),
						card.subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-gray-400",
							children: card.subtitle
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-gray-300",
						children: card.icon
					})]
				})
			}, card.title))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-8 grid gap-6 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-gray-200 bg-white",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "border-b border-gray-100 px-5 py-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-bold text-[#1a1a2e]",
						children: "Order Status"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-3 gap-4 p-5",
					children: [
						{
							label: "Pending",
							count: m?.pendingOrders ?? 0,
							color: "text-amber-600"
						},
						{
							label: "Paid",
							count: m?.paidOrders ?? 0,
							color: "text-blue-600"
						},
						{
							label: "Fulfilled",
							count: m?.fulfilledOrders ?? 0,
							color: "text-green-600"
						},
						{
							label: "Delivered",
							count: m?.deliveredOrders ?? 0,
							color: "text-emerald-600"
						},
						{
							label: "Cancelled",
							count: m?.cancelledOrders ?? 0,
							color: "text-red-600"
						},
						{
							label: "Refunded",
							count: m?.refundedOrders ?? 0,
							color: "text-purple-600"
						}
					].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: `text-2xl font-bold ${item.color}`,
							children: item.count
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-gray-500",
							children: item.label
						})]
					}, item.label))
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-gray-200 bg-white",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "border-b border-gray-100 px-5 py-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-bold text-[#1a1a2e]",
						children: "Top Products"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-5",
					children: (m?.topProducts?.length ?? 0) > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-3",
						children: m.topProducts.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-500",
									children: i + 1
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-medium text-[#1a1a2e]",
									children: p.name
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-right text-xs text-gray-500",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-medium",
									children: [p.sales, " sold"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["₹", p.revenue.toLocaleString("en-IN")] })]
							})]
						}, p.name))
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-gray-400",
						children: "No sales data yet"
					})
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 grid gap-6 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-gray-200 bg-white",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-gray-100 px-5 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-bold text-[#1a1a2e]",
						children: "Recent Orders"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/admin/orders",
						className: "text-xs font-medium text-[#7A2533] hover:underline",
						children: "View all"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "divide-y divide-gray-100",
					children: (m?.recentOrders?.length ?? 0) > 0 ? m.recentOrders.slice(0, 5).map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/admin/orders/$id",
						params: { id: o.id },
						className: "flex items-center justify-between px-5 py-3 hover:bg-gray-50",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium text-[#1a1a2e]",
							children: o.order_number || `#${o.id.slice(0, 8)}`
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-gray-400",
							children: [
								o.customer_name || "Guest",
								" · ",
								new Date(o.created_at).toLocaleDateString()
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: o.status }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-sm font-medium",
								children: ["₹", (o.total_amount ?? 0).toLocaleString("en-IN")]
							})]
						})]
					}, o.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "px-5 py-8 text-center text-sm text-gray-400",
						children: "No orders yet"
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-gray-200 bg-white",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-gray-100 px-5 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-bold text-[#1a1a2e]",
						children: "Recent Customers"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/admin/customers",
						className: "text-xs font-medium text-[#7A2533] hover:underline",
						children: "View all"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "divide-y divide-gray-100",
					children: (m?.recentCustomers?.length ?? 0) > 0 ? m.recentCustomers.slice(0, 5).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/admin/customers/$id",
						params: { id: c.id },
						className: "flex items-center justify-between px-5 py-3 hover:bg-gray-50",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-8 w-8 items-center justify-center rounded-full bg-[#1a1a2e] text-xs font-bold text-white",
								children: (c.full_name || c.email || "?").charAt(0).toUpperCase()
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium text-[#1a1a2e]",
								children: c.full_name || "—"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-gray-400",
								children: c.email || "—"
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-gray-400",
							children: new Date(c.created_at).toLocaleDateString()
						})]
					}, c.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "px-5 py-8 text-center text-sm text-gray-400",
						children: "No customers yet"
					})
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 rounded-xl border border-gray-200 bg-white p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm font-bold text-[#1a1a2e]",
				children: "Quick Actions"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					{
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-4 w-4" }),
						label: "Add Product",
						href: "/admin/products/new",
						desc: "Create a new product"
					},
					{
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { className: "h-4 w-4" }),
						label: "View Orders",
						href: "/admin/orders",
						desc: "Manage orders"
					},
					{
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { className: "h-4 w-4" }),
						label: "Add Coupon",
						href: "/admin/coupons",
						desc: "Create a discount"
					},
					{
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { className: "h-4 w-4" }),
						label: "Edit Homepage",
						href: "/admin/homepage",
						desc: "Update homepage"
					}
				].map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: a.href,
					className: "flex items-center gap-3 rounded-lg border border-gray-200 p-3 transition-colors hover:border-[#7A2533]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-9 w-9 items-center justify-center rounded-lg bg-[#fdf8f3] text-[#7A2533]",
						children: a.icon
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold text-[#1a1a2e]",
						children: a.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-gray-400",
						children: a.desc
					})] })]
				}, a.label))
			})]
		})
	] });
}
//#endregion
export { AdminDashboard as component };
