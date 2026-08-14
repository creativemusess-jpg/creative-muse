import { o as __toESM } from "../_runtime.mjs";
import { n as newsletterApi, t as getSourceLabel } from "./newsletter-ChNp_czQ.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { _ as Trash2, k as Search, vt as Download } from "../_libs/lucide-react.mjs";
import { i as AdminPageHeader, n as AdminLayout, r as AdminLoading, t as AdminEmpty } from "./AdminLayout-D0HWfGfb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.newsletter-C7bJrvJZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminNewsletter() {
	const [subscribers, setSubscribers] = (0, import_react.useState)([]);
	const [count, setCount] = (0, import_react.useState)(0);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [search, setSearch] = (0, import_react.useState)("");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("");
	const [sourceFilter, setSourceFilter] = (0, import_react.useState)("");
	const fetch = async () => {
		setLoading(true);
		try {
			const result = await newsletterApi.list({
				search: search || void 0,
				status: statusFilter || void 0,
				source: sourceFilter || void 0
			});
			setSubscribers(result.data);
			setCount(result.count);
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		fetch();
	}, [
		search,
		statusFilter,
		sourceFilter
	]);
	const handleDelete = async (id, email) => {
		if (!window.confirm(`Delete subscriber "${email}"?`)) return;
		try {
			await newsletterApi.delete(id);
			fetch();
		} catch (err) {
			console.error(err);
		}
	};
	const handleStatusToggle = async (id, current) => {
		const newStatus = current === "active" ? "unsubscribed" : "active";
		try {
			await newsletterApi.updateStatus(id, newStatus);
			fetch();
		} catch (err) {
			console.error(err);
		}
	};
	const handleExportCSV = () => {
		const headers = [
			"Email",
			"Source",
			"Status",
			"Discount Code",
			"Consent",
			"Subscribed"
		];
		const rows = subscribers.map((s) => [
			s.email,
			getSourceLabel(s.source),
			s.status,
			s.discount_code || "",
			s.consent ? "Yes" : "No",
			new Date(s.created_at).toLocaleDateString()
		]);
		const csv = [headers.join(","), ...rows.map((r) => r.map((c) => `"${c}"`).join(","))].join("\n");
		const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `newsletter-subscribers-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.csv`;
		a.click();
		URL.revokeObjectURL(url);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminLayout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPageHeader, {
			title: "Newsletter",
			description: `${count} subscribers`,
			actions: count > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: handleExportCSV,
				className: "flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4" }), " Export CSV"]
			}) : void 0
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex flex-wrap items-center gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex-1 max-w-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						placeholder: "Search by email or source...",
						value: search,
						onChange: (e) => setSearch(e.target.value),
						className: "w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-sm outline-none focus:border-[#7A2533]"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: statusFilter,
					onChange: (e) => setStatusFilter(e.target.value),
					className: "rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "All statuses"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "active",
							children: "Active"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "unsubscribed",
							children: "Unsubscribed"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: sourceFilter,
					onChange: (e) => setSourceFilter(e.target.value),
					className: "rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "All sources"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "newsletter_popup",
							children: "Popup"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "homepage_newsletter",
							children: "Homepage"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "footer_newsletter",
							children: "Footer"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "admin_manual",
							children: "Admin"
						})
					]
				})
			]
		}),
		loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLoading, {}) : subscribers.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminEmpty, {
			title: "No subscribers yet",
			description: "Newsletter signups will appear here."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto rounded-xl border border-gray-200 bg-white",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-left text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-gray-100 bg-gray-50",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider",
							children: "Email"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider",
							children: "Source"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider",
							children: "Status"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider",
							children: "Discount Code"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider",
							children: "Consent"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider",
							children: "Subscribed"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider",
							children: "Actions"
						})
					]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
					className: "divide-y divide-gray-100",
					children: subscribers.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "hover:bg-gray-50",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 font-medium text-[#1a1a2e]",
								children: s.email
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-gray-500",
								children: getSourceLabel(s.source)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => handleStatusToggle(s.id, s.status),
									className: `inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${s.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`,
									children: s.status
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: s.discount_code ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
									className: "rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[11px] text-[#1a1a2e]",
									children: s.discount_code
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-gray-400",
									children: "—"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-xs text-gray-500",
								children: s.consent ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-green-600",
									children: "Yes"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-gray-400",
									children: "No"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-xs text-gray-500",
								children: new Date(s.created_at).toLocaleDateString()
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => handleDelete(s.id, s.email),
									className: "rounded-lg p-1.5 text-red-300 hover:bg-red-50 hover:text-red-500",
									title: "Delete",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
								})
							})
						]
					}, s.id))
				})]
			})
		})
	] });
}
//#endregion
export { AdminNewsletter as component };
