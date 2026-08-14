import { o as __toESM } from "../_runtime.mjs";
import { t as categoriesApi } from "./categories-DdAkdsQw.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { P as Plus, R as PenLine, _ as Trash2 } from "../_libs/lucide-react.mjs";
import { a as AdminTable, i as AdminPageHeader, n as AdminLayout, r as AdminLoading, t as AdminEmpty } from "./AdminLayout-D0HWfGfb.mjs";
import { t as subcategoriesApi } from "./subcategories-BivcEg6G.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.subcategories-DnbNlNhE.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminSubcategories() {
	const [groups, setGroups] = (0, import_react.useState)({});
	const [categories, setCategories] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [showForm, setShowForm] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [deleting, setDeleting] = (0, import_react.useState)(null);
	const [form, setForm] = (0, import_react.useState)({
		category_id: "",
		name: "",
		slug: "",
		sort_order: 0,
		active: true
	});
	const [confirmDelete, setConfirmDelete] = (0, import_react.useState)(null);
	const [linkedCount, setLinkedCount] = (0, import_react.useState)(0);
	const fetchData = async () => {
		setLoading(true);
		try {
			const cats = await categoriesApi.list();
			setCategories(cats);
			const subs = await subcategoriesApi.list();
			const grouped = {};
			for (const s of subs) {
				const catId = s.category_id;
				if (!grouped[catId]) grouped[catId] = [];
				grouped[catId].push(s);
			}
			setGroups(grouped);
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		fetchData();
	}, []);
	const handleSave = async () => {
		if (!form.category_id || !form.name || !form.slug) return;
		setSaving(true);
		try {
			if (editing) await subcategoriesApi.update(editing.id, form);
			else await subcategoriesApi.create(form);
			setShowForm(false);
			setEditing(null);
			setForm({
				category_id: "",
				name: "",
				slug: "",
				sort_order: 0,
				active: true
			});
			fetchData();
		} catch (err) {
			alert(err.message);
		} finally {
			setSaving(false);
		}
	};
	const handleDelete = async (id) => {
		setDeleting(id);
		try {
			const result = await subcategoriesApi.delete(id);
			if (result.linkedProducts > 0) {
				setLinkedCount(result.linkedProducts);
				setConfirmDelete(id);
				return;
			}
			fetchData();
		} catch (err) {
			alert(err.message);
		} finally {
			setDeleting(null);
		}
	};
	const forceDelete = async (id) => {
		setDeleting(id);
		try {
			const { error } = await (await import("./supabase-Bz-JQXNc.mjs").then((n) => n.r).then((n) => n.n)).supabase.from("products").update({ subcategory_id: null }).eq("subcategory_id", id);
			if (error) throw error;
			await subcategoriesApi.delete(id);
			setConfirmDelete(null);
			setLinkedCount(0);
			fetchData();
		} catch (err) {
			alert(err.message);
		} finally {
			setDeleting(null);
		}
	};
	const startEdit = (sub) => {
		setEditing(sub);
		setForm({
			category_id: sub.category_id,
			name: sub.name,
			slug: sub.slug,
			sort_order: sub.sort_order,
			active: sub.active
		});
		setShowForm(true);
	};
	new Map(categories.map((c) => [c.id, c]));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminLayout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPageHeader, {
			title: "Subcategories",
			description: "Manage product subcategories",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => {
					setEditing(null);
					setForm({
						category_id: "",
						name: "",
						slug: "",
						sort_order: 0,
						active: true
					});
					setShowForm(true);
				},
				className: "flex items-center gap-2 rounded-lg bg-[#1a1a2e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2d1b4e]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Add Subcategory"]
			})
		}),
		showForm && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 rounded-xl border border-gray-200 bg-white p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mb-4 text-sm font-bold uppercase tracking-wider text-gray-500",
					children: editing ? "Edit Subcategory" : "New Subcategory"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block text-xs font-medium text-gray-600",
							children: "Parent Category *"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: form.category_id,
							onChange: (e) => setForm((f) => ({
								...f,
								category_id: e.target.value
							})),
							className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#7A2533]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "Select category"
							}), categories.filter((c) => c.active).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: c.id,
								children: c.name
							}, c.id))]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block text-xs font-medium text-gray-600",
							children: "Name *"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: form.name,
							onChange: (e) => {
								setForm((f) => ({
									...f,
									name: e.target.value
								}));
								if (!editing) setForm((f) => ({
									...f,
									slug: e.target.value.toLowerCase().replace(/\s+/g, "-")
								}));
							},
							className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block text-xs font-medium text-gray-600",
							children: "Slug *"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: form.slug,
							onChange: (e) => setForm((f) => ({
								...f,
								slug: e.target.value
							})),
							className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block text-xs font-medium text-gray-600",
							children: "Sort Order"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							value: form.sort_order,
							onChange: (e) => setForm((f) => ({
								...f,
								sort_order: parseInt(e.target.value) || 0
							})),
							className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-end pb-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-2 cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: form.active,
									onChange: (e) => setForm((f) => ({
										...f,
										active: e.target.checked
									})),
									className: "rounded border-gray-300"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm text-gray-700",
									children: "Active"
								})]
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: handleSave,
						disabled: saving,
						className: "rounded-lg bg-[#1a1a2e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2d1b4e] disabled:opacity-60",
						children: saving ? "Saving..." : editing ? "Update" : "Create"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							setShowForm(false);
							setEditing(null);
						},
						className: "rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50",
						children: "Cancel"
					})]
				})
			]
		}),
		confirmDelete && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-semibold",
					children: [
						"Cannot delete: ",
						linkedCount,
						" product(s) are linked to this subcategory."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs",
					children: "You can deactivate it instead, or remove the subcategory from all linked products first."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => forceDelete(confirmDelete),
						disabled: deleting === confirmDelete,
						className: "rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-60",
						children: deleting ? "Removing..." : "Remove from products & delete"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setConfirmDelete(null),
						className: "rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50",
						children: "Cancel"
					})]
				})
			]
		}),
		loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLoading, {}) : categories.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminEmpty, {
			title: "No categories",
			description: "Create categories first, then add subcategories"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-4",
			children: categories.filter((c) => c.active).map((cat) => {
				const subs = groups[cat.id] || [];
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-gray-200 bg-white",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center justify-between border-b border-gray-100 px-5 py-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-semibold text-[#1a1a2e]",
								children: cat.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[10px] text-gray-400",
								children: [
									"(",
									subs.length,
									" subcategories)"
								]
							})]
						})
					}), subs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "px-5 py-4 text-xs text-gray-400 italic",
						children: "No subcategories"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminTable, {
						headers: [
							"Name",
							"Slug",
							"Order",
							"Status",
							"Actions"
						],
						children: subs.map((sub) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "hover:bg-gray-50",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 font-medium text-[#1a1a2e]",
									children: sub.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-gray-500",
									children: sub.slug
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-gray-500",
									children: sub.sort_order
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${sub.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`,
										children: sub.active ? "Active" : "Inactive"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => startEdit(sub),
											className: "rounded-lg p-1.5 text-gray-400 hover:bg-gray-100",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "h-4 w-4" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => handleDelete(sub.id),
											disabled: deleting === sub.id,
											className: "rounded-lg p-1.5 text-red-300 hover:bg-red-50",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
										})]
									})
								})
							]
						}, sub.id))
					})]
				}, cat.id);
			})
		})
	] });
}
//#endregion
export { AdminSubcategories as component };
