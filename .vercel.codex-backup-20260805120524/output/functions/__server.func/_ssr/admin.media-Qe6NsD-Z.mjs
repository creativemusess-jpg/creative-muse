import { o as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./supabase-Bz-JQXNc.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { _ as Trash2, k as Search, nt as ImageOff } from "../_libs/lucide-react.mjs";
import { i as AdminPageHeader, n as AdminLayout, r as AdminLoading, t as AdminEmpty } from "./AdminLayout-D0HWfGfb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.media-Qe6NsD-Z.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var db = () => supabase;
var mediaApi = {
	async list(filters = {}) {
		let query = db().from("media").select("*", { count: "exact" });
		if (filters.search) query = query.or(`filename.ilike.%${filters.search}%,alt_text.ilike.%${filters.search}%`);
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
	async delete(id) {
		await db().from("media").delete().eq("id", id);
	}
};
function AdminMedia() {
	const [items, setItems] = (0, import_react.useState)([]);
	const [count, setCount] = (0, import_react.useState)(0);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [search, setSearch] = (0, import_react.useState)("");
	const fetch = async () => {
		setLoading(true);
		try {
			const result = await mediaApi.list({ search: search || void 0 });
			setItems(result.data);
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
	const handleDelete = async (id, filename) => {
		if (!window.confirm(`Delete "${filename}"?`)) return;
		try {
			await mediaApi.delete(id);
			fetch();
		} catch (err) {
			console.error(err);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminLayout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPageHeader, {
			title: "Media Library",
			description: `${count} files`
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 relative flex-1 max-w-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "text",
				placeholder: "Search media...",
				value: search,
				onChange: (e) => setSearch(e.target.value),
				className: "w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-sm outline-none focus:border-[#7A2533]"
			})]
		}),
		loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLoading, {}) : items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminEmpty, {
			title: "No media files",
			description: "Uploaded images and files will appear here."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6",
			children: items.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "group relative rounded-xl border border-gray-200 bg-white overflow-hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex aspect-square items-center justify-center bg-gray-50 p-2",
						children: m.mime_type?.startsWith("image/") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: m.url,
							alt: m.alt_text || m.filename,
							className: "h-full w-full object-contain",
							loading: "lazy",
							onError: (e) => {
								e.target.style.display = "none";
							}
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageOff, { className: "h-8 w-8 text-gray-300" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-xs font-medium text-[#1a1a2e]",
							title: m.filename,
							children: m.filename
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] text-gray-400",
							children: new Date(m.created_at).toLocaleDateString()
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => handleDelete(m.id, m.filename),
						className: "absolute top-2 right-2 rounded-lg bg-white/90 p-1.5 text-red-400 opacity-0 shadow-sm transition-opacity group-hover:opacity-100 hover:bg-red-50 hover:text-red-500",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
					})
				]
			}, m.id))
		})
	] });
}
//#endregion
export { AdminMedia as component };
