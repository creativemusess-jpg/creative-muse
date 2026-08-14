import { o as __toESM } from "../_runtime.mjs";
import { t as categoriesApi } from "./categories-DdAkdsQw.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { L as Pencil, Ot as ChevronUp, P as Plus, Y as LoaderCircle, _ as Trash2, jt as ChevronDown, k as Search, r as X } from "../_libs/lucide-react.mjs";
import { i as AdminPageHeader, n as AdminLayout, r as AdminLoading } from "./AdminLayout-D0HWfGfb.mjs";
import { t as attributesApi } from "./attributes-B5Cv6WJz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.attributes-BohkhkFx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FIELD_TYPES = [
	{
		value: "text",
		label: "Text"
	},
	{
		value: "number",
		label: "Number"
	},
	{
		value: "dropdown",
		label: "Dropdown"
	},
	{
		value: "boolean",
		label: "Boolean"
	},
	{
		value: "date",
		label: "Date"
	},
	{
		value: "color",
		label: "Color"
	},
	{
		value: "url",
		label: "URL"
	},
	{
		value: "multi_select",
		label: "Multi Select"
	},
	{
		value: "single_select",
		label: "Single Select"
	},
	{
		value: "measurement",
		label: "Measurement"
	}
];
var initForm = () => ({
	name: "",
	slug: "",
	description: "",
	field_type: "text",
	options: [],
	placeholder: "",
	is_required: false,
	is_active: true,
	sort_order: 0,
	category_id: "",
	use_as_filter: false,
	show_in_product_list: false,
	is_searchable: false
});
function AdminAttributesPage() {
	const [defs, setDefs] = (0, import_react.useState)([]);
	const [categories, setCategories] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [form, setForm] = (0, import_react.useState)(initForm());
	const [search, setSearch] = (0, import_react.useState)("");
	const [optionInput, setOptionInput] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		Promise.all([attributesApi.listDefinitions(), categoriesApi.list()]).then(([d, c]) => {
			setDefs(d);
			setCategories(c);
			setLoading(false);
		}).catch(() => setLoading(false));
	}, []);
	const refresh = () => attributesApi.listDefinitions().then(setDefs);
	const handleEdit = (def) => {
		setEditing(def);
		setForm({
			name: def.name,
			slug: def.slug,
			description: def.description || "",
			field_type: def.field_type,
			options: (def.options || []).filter((o) => o),
			placeholder: def.placeholder || "",
			is_required: def.is_required,
			is_active: def.is_active,
			sort_order: def.sort_order,
			category_id: def.category_id || "",
			use_as_filter: def.use_as_filter,
			show_in_product_list: def.show_in_product_list,
			is_searchable: def.is_searchable
		});
		setOptionInput("");
	};
	const handleNew = () => {
		setEditing(null);
		setForm(initForm());
		setOptionInput("");
	};
	const handleSave = async () => {
		if (!form.name.trim()) return;
		setSaving(true);
		try {
			const payload = {
				...form,
				options: [
					"dropdown",
					"multi_select",
					"single_select",
					"measurement"
				].includes(form.field_type) ? form.options : [],
				category_id: form.category_id || null
			};
			if (editing) await attributesApi.updateDefinition(editing.id, payload);
			else await attributesApi.createDefinition(payload);
			await refresh();
			setEditing(null);
			setForm(initForm());
		} catch (err) {
			alert(err.message);
		} finally {
			setSaving(false);
		}
	};
	const handleDelete = async (id) => {
		if (!confirm("Delete this attribute definition? This will remove all values from products.")) return;
		try {
			await attributesApi.deleteDefinition(id);
			await refresh();
		} catch (err) {
			alert(err.message);
		}
	};
	const moveItem = (index, dir) => {
		if (index + dir < 0 || index + dir >= defs.length) return;
		const next = [...defs];
		[next[index], next[index + dir]] = [next[index + dir], next[index]];
		setDefs(next);
		next.forEach((d, i) => {
			attributesApi.updateDefinition(d.id, { sort_order: i }).catch(() => {});
		});
	};
	const addOption = () => {
		const val = optionInput.trim();
		if (val && !form.options.includes(val)) setForm({
			...form,
			options: [...form.options, val]
		});
		setOptionInput("");
	};
	const removeOption = (val) => {
		setForm({
			...form,
			options: form.options.filter((o) => o !== val)
		});
	};
	const filtered = defs.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()) || d.slug.toLowerCase().includes(search.toLowerCase()));
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLoading, {}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminLayout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPageHeader, {
			title: "Attributes",
			description: "Manage product attribute definitions",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: handleNew,
				className: "flex items-center gap-2 rounded-lg bg-[#1a1a2e] px-5 py-2 text-sm font-semibold text-white hover:bg-[#2d1b4e]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " New Attribute"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-4 w-4 text-gray-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "text",
				placeholder: "Search attributes...",
				value: search,
				onChange: (e) => setSearch(e.target.value),
				className: "w-full text-sm outline-none"
			})]
		}),
		editing !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 rounded-xl border border-gray-200 bg-white p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mb-4 text-sm font-bold uppercase tracking-wider text-gray-500",
					children: editing ? "Edit Attribute" : "New Attribute"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block text-xs font-medium text-gray-600",
							children: "Name *"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: form.name,
							onChange: (e) => setForm({
								...form,
								name: e.target.value,
								slug: editing ? form.slug : e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
							}),
							className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block text-xs font-medium text-gray-600",
							children: "Slug"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: form.slug,
							onChange: (e) => setForm({
								...form,
								slug: e.target.value
							}),
							className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block text-xs font-medium text-gray-600",
							children: "Field Type"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: form.field_type,
							onChange: (e) => setForm({
								...form,
								field_type: e.target.value
							}),
							className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#7A2533]",
							children: FIELD_TYPES.map((ft) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: ft.value,
								children: ft.label
							}, ft.value))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block text-xs font-medium text-gray-600",
							children: "Category (optional)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: form.category_id,
							onChange: (e) => setForm({
								...form,
								category_id: e.target.value
							}),
							className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#7A2533]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "All Categories"
							}), categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: c.id,
								children: c.name
							}, c.id))]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block text-xs font-medium text-gray-600",
							children: "Placeholder"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: form.placeholder,
							onChange: (e) => setForm({
								...form,
								placeholder: e.target.value
							}),
							className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block text-xs font-medium text-gray-600",
							children: "Sort Order"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							value: form.sort_order,
							onChange: (e) => setForm({
								...form,
								sort_order: parseInt(e.target.value) || 0
							}),
							className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
						})] })
					]
				}),
				[
					"dropdown",
					"multi_select",
					"single_select",
					"measurement"
				].includes(form.field_type) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block text-xs font-medium text-gray-600",
							children: form.field_type === "measurement" ? "Units" : "Options"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-1.5 mb-2",
							children: form.options.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-700",
								children: [opt, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => removeOption(opt),
									className: "text-gray-400 hover:text-red-500",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" })
								})]
							}, opt))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: optionInput,
								onChange: (e) => setOptionInput(e.target.value),
								onKeyDown: (e) => e.key === "Enter" && (e.preventDefault(), addOption()),
								placeholder: "Type and press Enter",
								className: "flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: addOption,
								className: "rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200",
								children: "Add"
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-wrap gap-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2 text-sm text-gray-700",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: form.is_required,
								onChange: (e) => setForm({
									...form,
									is_required: e.target.checked
								}),
								className: "rounded"
							}), " Required"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2 text-sm text-gray-700",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: form.is_active,
								onChange: (e) => setForm({
									...form,
									is_active: e.target.checked
								}),
								className: "rounded"
							}), " Active"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2 text-sm text-gray-700",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: form.use_as_filter,
								onChange: (e) => setForm({
									...form,
									use_as_filter: e.target.checked
								}),
								className: "rounded"
							}), " Use as Filter"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2 text-sm text-gray-700",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: form.show_in_product_list,
								onChange: (e) => setForm({
									...form,
									show_in_product_list: e.target.checked
								}),
								className: "rounded"
							}), " Show in List"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2 text-sm text-gray-700",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: form.is_searchable,
								onChange: (e) => setForm({
									...form,
									is_searchable: e.target.checked
								}),
								className: "rounded"
							}), " Searchable"]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: handleSave,
						disabled: saving,
						className: "flex items-center gap-2 rounded-lg bg-[#1a1a2e] px-5 py-2 text-sm font-semibold text-white hover:bg-[#2d1b4e] disabled:opacity-60",
						children: [saving && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), editing ? "Update" : "Create"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							setEditing(void 0);
							setForm(initForm());
						},
						className: "rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50",
						children: "Cancel"
					})]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-hidden rounded-xl border border-gray-200 bg-white",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-gray-100 bg-gray-50 text-left text-xs font-semibold uppercase tracking-wider text-gray-500",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 w-16",
							children: "Order"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "Name"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "Type"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "Category"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "Status"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "Filter"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 text-right",
							children: "Actions"
						})
					]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [filtered.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-gray-50 hover:bg-gray-50/50",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-0.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => moveItem(i, -1),
									disabled: i === 0,
									className: "rounded p-0.5 text-gray-400 hover:text-gray-600 disabled:opacity-30",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "h-3.5 w-3.5" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => moveItem(i, 1),
									disabled: i === filtered.length - 1,
									className: "rounded p-0.5 text-gray-400 hover:text-gray-600 disabled:opacity-30",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-3.5 w-3.5" })
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-4 py-3 font-medium text-gray-800",
							children: [d.name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ml-2 text-xs text-gray-400",
								children: d.slug
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 text-gray-600",
							children: FIELD_TYPES.find((ft) => ft.value === d.field_type)?.label || d.field_type
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 text-gray-600",
							children: d.category_id ? categories.find((c) => c.id === d.category_id)?.name || "—" : "All"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${d.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`,
								children: d.is_active ? "Active" : "Inactive"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 text-gray-600",
							children: d.use_as_filter ? "Yes" : "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-4 py-3 text-right",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => handleEdit(d),
								className: "rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => handleDelete(d.id),
								className: "rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
							})]
						})
					]
				}, d.id)), filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					colSpan: 7,
					className: "px-4 py-8 text-center text-sm text-gray-400",
					children: "No attributes found"
				}) })] })]
			})
		})
	] });
}
//#endregion
export { AdminAttributesPage as component };
