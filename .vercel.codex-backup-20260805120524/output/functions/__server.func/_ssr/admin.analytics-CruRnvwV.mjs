import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { B as Package, C as ShoppingCart, c as Users, g as TrendingDown, h as TrendingUp, m as TriangleAlert, yt as DollarSign } from "../_libs/lucide-react.mjs";
import { n as AdminLayout } from "./AdminLayout-D0HWfGfb.mjs";
import { t as analyticsApi } from "./analytics-B1LIpryr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.analytics-CruRnvwV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AnalyticsPage() {
	const [metrics, setMetrics] = (0, import_react.useState)(null);
	const [lowStock, setLowStock] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		Promise.all([analyticsApi.getDashboardMetrics(), analyticsApi.getLowStockProducts(10)]).then(([m, l]) => {
			setMetrics(m);
			setLowStock(l);
			setLoading(false);
		}).catch((e) => {
			setError(e.message);
			setLoading(false);
		});
	}, []);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex items-center justify-center py-20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-8 animate-spin rounded-full border-4 border-[#7A2533] border-t-transparent" })
	}) });
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "py-20 text-center text-red-500",
		children: error
	}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminLayout, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5",
		children: [
			{
				label: "Total Sales",
				value: `₹${(metrics?.totalSales ?? 0).toLocaleString("en-IN")}`,
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "h-6 w-6" }),
				color: "text-green-600"
			},
			{
				label: "Total Orders",
				value: String(metrics?.totalOrders ?? 0),
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { className: "h-6 w-6" }),
				color: "text-blue-600"
			},
			{
				label: "Pending",
				value: String(metrics?.pendingOrders ?? 0),
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-6 w-6" }),
				color: "text-amber-600"
			},
			{
				label: "Revenue (30d)",
				value: `₹${(metrics?.revenueMonth ?? 0).toLocaleString("en-IN")}`,
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "h-6 w-6" }),
				color: "text-emerald-600"
			},
			{
				label: "Revenue (7d)",
				value: `₹${(metrics?.revenueWeek ?? 0).toLocaleString("en-IN")}`,
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "h-6 w-6" }),
				color: "text-teal-600"
			},
			{
				label: "Revenue (today)",
				value: `₹${(metrics?.revenueToday ?? 0).toLocaleString("en-IN")}`,
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "h-6 w-6" }),
				color: "text-indigo-600"
			},
			{
				label: "Avg Order Value",
				value: `₹${(metrics?.averageOrderValue ?? 0).toLocaleString("en-IN")}`,
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "h-6 w-6" }),
				color: "text-purple-600"
			},
			{
				label: "Total Customers",
				value: String(metrics?.totalCustomers ?? 0),
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-6 w-6" }),
				color: "text-cyan-600"
			},
			{
				label: "Total Products",
				value: String(metrics?.totalProducts ?? 0),
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-6 w-6" }),
				color: "text-orange-600"
			},
			{
				label: "Subscribers",
				value: String(metrics?.totalSubscribers ?? 0),
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-6 w-6" }),
				color: "text-pink-600"
			}
		].map((card) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-xl border border-gray-200 bg-white p-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[10px] font-semibold uppercase text-gray-500",
					children: card.label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: `mt-1 text-lg font-bold ${card.color}`,
					children: card.value
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-gray-300",
					children: card.icon
				})]
			})
		}, card.label))
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-6 grid gap-6 lg:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl border border-gray-200 bg-white p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm font-bold text-[#1a1a2e]",
				children: "Top Products"
			}), metrics?.topProducts?.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 divide-y divide-gray-100",
				children: metrics.topProducts.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex h-6 w-6 items-center justify-center rounded-full bg-[#1a1a2e] text-xs font-bold text-white",
							children: i + 1
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium text-[#1a1a2e]",
							children: p.name || p.product_name || "Product"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-gray-400",
							children: [p.total_sold || p.total_quantity || 0, " sold"]
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm font-semibold text-green-600",
						children: ["₹", (p.total_revenue || 0).toLocaleString("en-IN")]
					})]
				}, p.id || i))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-gray-400",
				children: "No sales data"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl border border-gray-200 bg-white p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "flex items-center gap-2 text-sm font-bold text-[#1a1a2e]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4 text-amber-500" }), " Low Stock Alerts"]
			}), lowStock.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 divide-y divide-gray-100",
				children: lowStock.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium text-[#1a1a2e]",
						children: p.name
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${(p.stock_quantity ?? 0) <= 0 ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`,
						children: (p.stock_quantity ?? 0) <= 0 ? "Out of stock" : `${p.stock_quantity ?? 0} left`
					})]
				}, p.id))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-gray-400",
				children: "All products well-stocked"
			})]
		})]
	})] });
}
//#endregion
export { AnalyticsPage as component };
