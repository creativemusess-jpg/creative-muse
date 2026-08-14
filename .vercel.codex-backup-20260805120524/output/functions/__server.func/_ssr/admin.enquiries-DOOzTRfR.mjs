import { o as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./supabase-Bz-JQXNc.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { _ as Trash2, k as Search } from "../_libs/lucide-react.mjs";
import { i as AdminPageHeader, n as AdminLayout, r as AdminLoading, t as AdminEmpty } from "./AdminLayout-D0HWfGfb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.enquiries-DOOzTRfR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var db = () => supabase;
var enquiriesApi = {
	async list(filters = {}) {
		let query = db().from("enquiries").select("*", { count: "exact" });
		if (filters.search) query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
		query = query.order("created_at", { ascending: false });
		const page = filters.page || 1;
		const perPage = filters.per_page || 20;
		const from = (page - 1) * perPage;
		query = query.range(from, from + perPage - 1);
		const { data, error, count } = await query;
		if (error) throw error;
		return {
			data: data || [],
			count: count || 0
		};
	},
	async getById(id) {
		const { data, error } = await db().from("enquiries").select("*").eq("id", id).maybeSingle();
		if (error) return null;
		return data;
	},
	async markRead(id) {
		await db().from("enquiries").update({ is_read: true }).eq("id", id);
	},
	async delete(id) {
		await db().from("enquiries").delete().eq("id", id);
	}
};
function AdminEnquiries() {
	const [enquiries, setEnquiries] = (0, import_react.useState)([]);
	const [count, setCount] = (0, import_react.useState)(0);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [search, setSearch] = (0, import_react.useState)("");
	const [selected, setSelected] = (0, import_react.useState)(null);
	const fetch = async () => {
		setLoading(true);
		try {
			const result = await enquiriesApi.list({ search: search || void 0 });
			setEnquiries(result.data);
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
	const handleSelect = async (enquiry) => {
		setSelected(enquiry);
		if (!enquiry.is_read) {
			await enquiriesApi.markRead(enquiry.id);
			fetch();
		}
	};
	const handleDelete = async (id) => {
		if (!window.confirm("Delete this enquiry?")) return;
		try {
			await enquiriesApi.delete(id);
			if (selected?.id === id) setSelected(null);
			fetch();
		} catch (err) {
			console.error(err);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminLayout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPageHeader, {
			title: "Enquiries",
			description: `${count} enquiries received`
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 relative flex-1 max-w-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "text",
				placeholder: "Search enquiries...",
				value: search,
				onChange: (e) => setSearch(e.target.value),
				className: "w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-sm outline-none focus:border-[#7A2533]"
			})]
		}),
		loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLoading, {}) : enquiries.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminEmpty, {
			title: "No enquiries yet",
			description: "Contact form submissions will appear here."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 lg:grid-cols-[1fr_400px]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto rounded-xl border border-gray-200 bg-white",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-left text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-gray-100 bg-gray-50",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider",
								children: "Name"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider",
								children: "Email"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider",
								children: "Subject"
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
						children: enquiries.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: `hover:bg-gray-50 cursor-pointer ${!e.is_read ? "font-semibold bg-amber-50/50" : ""}`,
							onClick: () => handleSelect(e),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-[#1a1a2e]",
									children: e.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-gray-500",
									children: e.email
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-gray-500",
									children: e.subject || "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-xs text-gray-500",
									children: new Date(e.created_at).toLocaleDateString()
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: (ev) => {
											ev.stopPropagation();
											handleDelete(e.id);
										},
										className: "rounded-lg p-1.5 text-red-300 hover:bg-red-50 hover:text-red-500",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
									})
								})
							]
						}, e.id))
					})]
				})
			}), selected && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-gray-200 bg-white p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between mb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-bold text-[#1a1a2e]",
						children: "Enquiry Details"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setSelected(null),
						className: "text-gray-400 hover:text-gray-600",
						children: "✕"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "space-y-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-xs font-semibold text-gray-500 uppercase tracking-wider",
							children: "Name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "text-[#1a1a2e]",
							children: selected.name
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-xs font-semibold text-gray-500 uppercase tracking-wider",
							children: "Email"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "text-[#1a1a2e]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: `mailto:${selected.email}`,
								className: "text-[#7A2533] hover:underline",
								children: selected.email
							})
						})] }),
						selected.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-xs font-semibold text-gray-500 uppercase tracking-wider",
							children: "Phone"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "text-[#1a1a2e]",
							children: selected.phone
						})] }),
						selected.subject && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-xs font-semibold text-gray-500 uppercase tracking-wider",
							children: "Subject"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "text-[#1a1a2e]",
							children: selected.subject
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-xs font-semibold text-gray-500 uppercase tracking-wider",
							children: "Message"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "text-[#1a1a2e] text-sm leading-relaxed whitespace-pre-wrap",
							children: selected.message
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-xs font-semibold text-gray-500 uppercase tracking-wider",
							children: "Received"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "text-xs text-gray-500",
							children: new Date(selected.created_at).toLocaleString()
						})] })
					]
				})]
			})]
		})
	] });
}
//#endregion
export { AdminEnquiries as component };
