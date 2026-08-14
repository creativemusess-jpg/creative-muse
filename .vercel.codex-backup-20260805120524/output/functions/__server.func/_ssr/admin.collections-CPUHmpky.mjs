import { o as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./supabase-Bz-JQXNc.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { P as Plus, Y as LoaderCircle, _ as Trash2, b as SquarePen, d as Upload, nt as ImageOff, r as X } from "../_libs/lucide-react.mjs";
import { i as AdminPageHeader, n as AdminLayout } from "./AdminLayout-D0HWfGfb.mjs";
import { t as uploadImage } from "./upload-DCG819Qu.mjs";
import { n as DataTable, t as ConfirmDialog } from "./AdminTable-9BSMWvKK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.collections-CPUHmpky.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var collectionsApi = {
	async list() {
		const { data, error, count } = await supabase.from("collections").select("*", { count: "exact" }).order("sort_order");
		if (error) throw error;
		const ids = (data ?? []).map((c) => c.id);
		let links = [];
		if (ids.length > 0) links = (await supabase.from("product_collections").select("collection_id").in("collection_id", ids)).data ?? [];
		const counts = {};
		links.forEach((l) => {
			counts[l.collection_id] = (counts[l.collection_id] || 0) + 1;
		});
		return {
			data: (data ?? []).map((c) => ({
				...c,
				product_count: counts[c.id] || 0
			})),
			count: count ?? 0
		};
	},
	async getById(id) {
		const { data } = await supabase.from("collections").select("*").eq("id", id).single();
		return data;
	},
	async create(data) {
		const { data: result, error } = await supabase.from("collections").insert({
			name: data.name,
			slug: data.slug,
			description: data.description,
			image: data.image,
			active: data.active ?? true,
			sort_order: data.sort_order || 0
		}).select().single();
		if (error) throw error;
		return result;
	},
	async update(id, data) {
		const { error } = await supabase.from("collections").update(data).eq("id", id);
		if (error) throw error;
	},
	async delete(id) {
		await supabase.from("product_collections").delete().eq("collection_id", id);
		const { error } = await supabase.from("collections").delete().eq("id", id);
		if (error) throw error;
	},
	async getProducts(collectionId) {
		const { data } = await supabase.from("product_collections").select("collection_id, product_id").eq("collection_id", collectionId);
		return (data ?? []).map((cp) => ({ ...cp }));
	},
	async addProduct(collectionId, productId) {
		const { error } = await supabase.from("product_collections").insert({
			collection_id: collectionId,
			product_id: productId
		});
		if (error && !error.message?.includes("duplicate")) throw error;
	},
	async removeProduct(collectionId, productId) {
		await supabase.from("product_collections").delete().eq("collection_id", collectionId).eq("product_id", productId);
	}
};
var emptyForm = {
	name: "",
	slug: "",
	description: "",
	image: ""
};
function CollectionsPage() {
	const [data, setData] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)("");
	const [search, setSearch] = (0, import_react.useState)("");
	const [deleteId, setDeleteId] = (0, import_react.useState)(null);
	const [showForm, setShowForm] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [uploading, setUploading] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)(emptyForm);
	const load = async () => {
		setLoading(true);
		try {
			const result = await collectionsApi.list();
			setData(result.data);
			setError("");
		} catch (e) {
			setError(e.message || "Unable to load collections.");
		} finally {
			setLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	const handleImageUpload = async (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setUploading(true);
		try {
			const url = await uploadImage(file, "categories", "collections");
			setForm((current) => ({
				...current,
				image: url
			}));
		} catch (err) {
			alert("Upload failed: " + err.message);
		} finally {
			setUploading(false);
		}
	};
	const handleSave = async () => {
		try {
			const payload = {
				name: form.name.trim(),
				slug: form.slug.trim(),
				description: form.description.trim() || null,
				image: form.image || null
			};
			if (!payload.name) throw new Error("Collection name is required.");
			if (!payload.slug) throw new Error("Collection slug is required.");
			if (editing) await collectionsApi.update(editing.id, payload);
			else await collectionsApi.create(payload);
			setShowForm(false);
			setEditing(null);
			setForm(emptyForm);
			load();
		} catch (e) {
			alert(e.message);
		}
	};
	const handleDelete = async () => {
		if (!deleteId) return;
		try {
			await collectionsApi.delete(deleteId);
			setDeleteId(null);
			load();
		} catch (e) {
			alert(e.message);
		}
	};
	const openCreate = () => {
		setEditing(null);
		setForm(emptyForm);
		setShowForm(true);
	};
	const openEdit = (item) => {
		setEditing(item);
		setForm({
			name: item.name || "",
			slug: item.slug || "",
			description: item.description || "",
			image: item.image || ""
		});
		setShowForm(true);
	};
	const filteredData = data.filter((item) => {
		const term = search.trim().toLowerCase();
		if (!term) return true;
		return String(item.name || "").toLowerCase().includes(term) || String(item.slug || "").toLowerCase().includes(term);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminLayout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
			open: !!deleteId,
			onClose: () => setDeleteId(null),
			onConfirm: handleDelete,
			title: "Delete collection?",
			message: "This will remove the collection and unlink all products. Products themselves are not deleted.",
			confirmLabel: "Delete"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPageHeader, {
			title: "Collections",
			description: `${data.length} collections total`,
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: openCreate,
				className: "flex items-center gap-2 rounded-lg bg-[#1a1a2e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2d1b4e]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), "Add Collection"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
			data: filteredData,
			loading,
			error,
			keyField: "id",
			emptyTitle: "No collections yet",
			emptyDescription: "Create your first collection to organize products.",
			searchValue: search,
			onSearchChange: setSearch,
			searchPlaceholder: "Search collections...",
			onRetry: load,
			columns: [
				{
					key: "image",
					label: "Image",
					render: (row) => row.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: row.image,
						alt: "",
						className: "h-10 w-10 rounded-lg object-cover"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-300",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageOff, { className: "h-4 w-4" })
					})
				},
				{
					key: "name",
					label: "Name",
					sortable: true,
					render: (row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/collections/$slug",
						params: { slug: row.slug || "" },
						className: "text-sm font-medium text-[#1a1a2e] hover:text-[#7A2533]",
						children: row.name
					})
				},
				{
					key: "slug",
					label: "Slug",
					sortable: true,
					render: (row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-gray-400",
						children: row.slug || "-"
					})
				},
				{
					key: "description",
					label: "Description",
					render: (row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block max-w-[240px] truncate text-xs text-gray-500",
						children: row.description || "-"
					})
				},
				{
					key: "product_count",
					label: "Products",
					sortable: true,
					render: (row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "inline-flex items-center justify-center rounded-full bg-[#1a1a2e]/10 px-2 py-0.5 text-xs font-semibold text-[#1a1a2e]",
						children: row.product_count ?? 0
					})
				},
				{
					key: "actions",
					label: "Actions",
					render: (row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-end gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => openEdit(row),
							className: "rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-[#7A2533]",
							"aria-label": "Edit collection",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquarePen, { className: "h-4 w-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setDeleteId(row.id),
							className: "rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500",
							"aria-label": "Delete collection",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
						})]
					})
				}
			]
		}),
		showForm && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40",
			onClick: () => setShowForm(false),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full max-w-lg rounded-xl bg-white p-6 shadow-lg",
				onClick: (e) => e.stopPropagation(),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "text-lg font-bold text-[#1a1a2e]",
						children: [editing ? "Edit" : "Add", " Collection"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-semibold uppercase text-gray-500",
								children: "Name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: form.name,
								onChange: (e) => setForm({
									...form,
									name: e.target.value
								}),
								className: "mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-semibold uppercase text-gray-500",
								children: "Slug"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: form.slug,
								onChange: (e) => setForm({
									...form,
									slug: e.target.value
								}),
								className: "mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-semibold uppercase text-gray-500",
								children: "Image"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 flex items-start gap-3",
								children: form.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: form.image,
										alt: "Collection preview",
										className: "h-20 w-20 rounded-lg object-cover shadow-sm"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setForm({
											...form,
											image: ""
										}),
										className: "absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600",
										type: "button",
										"aria-label": "Remove image",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" })
									})]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex h-20 w-20 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 text-gray-400 hover:border-[#7A2533] hover:text-[#7A2533]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "file",
										accept: "image/*",
										onChange: handleImageUpload,
										className: "hidden"
									}), uploading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-5 w-5" })]
								})
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-semibold uppercase text-gray-500",
								children: "Description"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: form.description,
								onChange: (e) => setForm({
									...form,
									description: e.target.value
								}),
								rows: 3,
								className: "mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
							})] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex justify-end gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setShowForm(false),
							className: "rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50",
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: handleSave,
							className: "rounded-lg bg-[#1a1a2e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2d1b4e]",
							children: editing ? "Save" : "Create"
						})]
					})
				]
			})
		})
	] });
}
//#endregion
export { CollectionsPage as component };
