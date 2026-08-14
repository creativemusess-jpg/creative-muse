import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { _ as Link, f as useMatchRoute, p as Outlet, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { B as Package, kt as ChevronRight } from "../_libs/lucide-react.mjs";
import { n as PageShell } from "./PageHeader-DZsnNyor.mjs";
import { t as storefrontSupabase } from "./supabase-storefront-B2iEpuwU.mjs";
import { n as useAuth } from "./auth-D2-u71mo.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/account.orders--otUyQ4V.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var statusColors = {
	pending: "bg-yellow-100 text-yellow-700",
	confirmed: "bg-blue-100 text-blue-700",
	processing: "bg-indigo-100 text-indigo-700",
	shipped: "bg-purple-100 text-purple-700",
	out_for_delivery: "bg-orange-100 text-orange-700",
	delivered: "bg-green-100 text-green-700",
	cancelled: "bg-red-100 text-red-600"
};
function OrderList() {
	const { user } = useAuth();
	const [orders, setOrders] = (0, import_react.useState)([]);
	const [ordersLoading, setOrdersLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		(async () => {
			setOrdersLoading(true);
			const { data } = await storefrontSupabase.from("orders").select("*").eq("customer_id", user.id).order("created_at", { ascending: false });
			setOrders(data || []);
			setOrdersLoading(false);
		})();
	}, [user]);
	const formatPrice = (n) => "₹" + n.toLocaleString("en-IN");
	if (ordersLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-4 py-10",
		children: Array.from({ length: 3 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-28 w-full rounded-[16px]" }, i))
	});
	if (orders.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-[24px] bg-white p-10 text-center shadow-[0_4px_24px_rgba(0,0,0,0.05)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "mx-auto h-10 w-10 text-[#7A2533]" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display mt-4 text-xl font-semibold text-[#1a1a2e]",
				children: "No orders yet"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-[#7a6e64]",
				children: "Place your first order and it will appear here."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/shop",
				className: "btn-primary mt-6 inline-flex",
				children: "Start Shopping"
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-4",
		children: orders.map((order) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/account/orders/$orderNumber",
			params: { orderNumber: order.order_number },
			className: "flex items-center gap-4 rounded-[24px] bg-white p-5 shadow-[0_4px_24px_rgba(0,0,0,0.05)] transition-colors hover:bg-[#f5efe8]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#fdf8f3]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-6 w-6 text-[#7A2533]" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-display font-semibold text-[#1a1a2e]",
						children: ["#", order.order_number]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-[#7a6e64]",
						children: new Date(order.created_at).toLocaleDateString()
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-right",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-semibold text-[#1a1a2e]",
						children: formatPrice(order.total_amount)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${statusColors[order.order_status] || "bg-gray-100 text-gray-600"}`,
						children: order.order_status.replace(/_/g, " ")
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-5 w-5 text-[#7a6e64]" })
			]
		}, order.id))
	});
}
function AccountOrdersPage() {
	const { user, loading } = useAuth();
	const navigate = useNavigate();
	const isRootOrders = useMatchRoute()({
		to: "/account/orders",
		fuzzy: false
	});
	(0, import_react.useEffect)(() => {
		if (!loading && !user) navigate({
			to: "/login",
			search: { redirect: "/account/orders" }
		});
	}, [
		user,
		loading,
		navigate
	]);
	if (loading || !user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-[50vh] items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-8 animate-spin rounded-full border-2 border-[#7A2533] border-t-transparent" })
	}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-[900px] px-6 py-16",
		children: [isRootOrders && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "eyebrow text-[10px]",
					children: "Orders"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl font-semibold text-[#1a1a2e]",
					children: "My Orders"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-[#7a6e64]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/account",
						className: "text-[#7A2533] hover:underline",
						children: "← Back to Account"
					})
				})
			]
		}), isRootOrders ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderList, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})]
	}) });
}
//#endregion
export { AccountOrdersPage as component };
