import { o as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./supabase-Bz-JQXNc.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { i as AdminPageHeader, n as AdminLayout, r as AdminLoading, t as AdminEmpty } from "./AdminLayout-D0HWfGfb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.audit-logs-BMCadOuE.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var db = () => supabase;
var auditLogsApi = { async list(filters = {}) {
	let query = db().from("audit_logs").select("*, profiles:user_id(full_name, email)", { count: "exact" });
	query = query.order("created_at", { ascending: false });
	const page = filters.page || 1;
	const perPage = filters.per_page || 50;
	const from = (page - 1) * perPage;
	query = query.range(from, from + perPage - 1);
	const { data, error, count } = await query;
	if (error) throw error;
	return {
		data: data || [],
		count: count || 0
	};
} };
function AdminAuditLogs() {
	const [logs, setLogs] = (0, import_react.useState)([]);
	const [count, setCount] = (0, import_react.useState)(0);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		auditLogsApi.list().then((result) => {
			setLogs(result.data);
			setCount(result.count);
			setLoading(false);
		}).catch(() => setLoading(false));
	}, []);
	const actionColor = (action) => {
		if (action.includes("delete")) return "text-red-600";
		if (action.includes("create")) return "text-green-600";
		if (action.includes("update")) return "text-blue-600";
		return "text-gray-600";
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminLayout, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPageHeader, {
		title: "Audit Logs",
		description: `${count} recorded actions`
	}), loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLoading, {}) : logs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminEmpty, {
		title: "No audit logs",
		description: "Actions will be recorded here as you manage the store."
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-x-auto rounded-xl border border-gray-200 bg-white",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "w-full text-left text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "border-b border-gray-100 bg-gray-50",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider",
						children: "Action"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider",
						children: "Entity"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider",
						children: "User"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider",
						children: "Date"
					})
				]
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
				className: "divide-y divide-gray-100",
				children: logs.map((log) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "hover:bg-gray-50",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `font-medium capitalize ${actionColor(log.action)}`,
								children: log.action.replace(/_/g, " ")
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-4 py-3 text-gray-500",
							children: [log.entity_type, log.entity_id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs text-gray-400 ml-1",
								children: ["· ", log.entity_id.slice(0, 8)]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 text-gray-500",
							children: log.profiles?.full_name || log.profiles?.email || "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 text-xs text-gray-500",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								title: new Date(log.created_at).toLocaleString(),
								children: new Date(log.created_at).toLocaleDateString()
							})
						})
					]
				}, log.id))
			})]
		})
	})] });
}
//#endregion
export { AdminAuditLogs as component };
