import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { _ as Link, l as useLocation, p as Outlet } from "../_libs/@tanstack/react-router+[...].mjs";
import { k as Search } from "../_libs/lucide-react.mjs";
import { a as AdminTable, i as AdminPageHeader, n as AdminLayout, o as customersApi, r as AdminLoading, t as AdminEmpty } from "./AdminLayout-D0HWfGfb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.customers-OR52lBfM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminCustomers() {
	const location = useLocation();
	const [customers, setCustomers] = (0, import_react.useState)([]);
	const [count, setCount] = (0, import_react.useState)(0);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [search, setSearch] = (0, import_react.useState)("");
	const fetch = async () => {
		setLoading(true);
		try {
			const result = await customersApi.list({ search: search || void 0 });
			setCustomers(result.data);
			setCount(result.count);
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		fetch();
	}, [search]);
	if (location.pathname !== "/admin/customers") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminLayout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPageHeader, {
			title: "Customers",
			description: `${count} registered customers`
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 relative flex-1 max-w-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "text",
				placeholder: "Search customers...",
				value: search,
				onChange: (e) => setSearch(e.target.value),
				className: "w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-sm outline-none focus:border-[#7A2533]"
			})]
		}),
		loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLoading, {}) : customers.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminEmpty, {
			title: "No customers found",
			description: "Customers will appear after their first order."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminTable, {
			headers: [
				"Name",
				"Email",
				"Phone",
				"Provider",
				"Orders",
				"Total Spent",
				"Last Order",
				"Joined"
			],
			children: customers.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "hover:bg-gray-50",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-4 py-3 font-medium text-[#1a1a2e]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/admin/customers/$id",
							params: { id: c.id },
							className: "hover:text-[#7A2533]",
							children: c.full_name || "—"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-4 py-3 text-gray-500",
						children: c.email
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-4 py-3 text-gray-500",
						children: c.phone || "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-4 py-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${c.provider === "google" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`,
							children: c.provider || "email"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-4 py-3 text-gray-500",
						children: c.total_orders ?? c.order_count ?? 0
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
						className: "px-4 py-3 font-medium text-[#1a1a2e]",
						children: ["₹", (c.total_spent || 0).toLocaleString("en-IN")]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-4 py-3 text-xs text-gray-500",
						children: c.last_login_at ? new Date(c.last_login_at).toLocaleDateString() : "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-4 py-3 text-xs text-gray-500",
						children: new Date(c.created_at).toLocaleDateString()
					})
				]
			}, c.id))
		})
	] });
}
//#endregion
export { AdminCustomers as component };
