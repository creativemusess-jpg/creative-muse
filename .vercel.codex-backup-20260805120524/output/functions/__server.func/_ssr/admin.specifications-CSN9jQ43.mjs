import { o as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./supabase-Bz-JQXNc.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { P as Plus, R as PenLine, _ as Trash2, ct as GripVertical } from "../_libs/lucide-react.mjs";
import { i as AdminPageHeader, n as AdminLayout, r as AdminLoading, t as AdminEmpty } from "./AdminLayout-D0HWfGfb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.specifications-CSN9jQ43.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var db = () => supabase;
var specificationsApi = {
	async listDefinitions() {
		const { data, error } = await db().from("specification_definitions").select("*").order("sort_order", { ascending: true });
		if (error) throw error;
		return data || [];
	},
	async getDefinitionById(id) {
		const { data, error } = await db().from("specification_definitions").select("*").eq("id", id).maybeSingle();
		if (error) return null;
		return data;
	},
	async createDefinition(data) {
		const { data: result, error } = await db().from("specification_definitions").insert(data).select().single();
		if (error) throw error;
		return result;
	},
	async updateDefinition(id, data) {
		const { error } = await db().from("specification_definitions").update(data).eq("id", id);
		if (error) throw error;
	},
	async deleteDefinition(id) {
		const { error } = await db().from("specification_definitions").delete().eq("id", id);
		if (error) throw error;
	},
	async getByProduct(productId) {
		const { data, error } = await db().from("product_specifications").select("*, specification_definition:specification_definition_id(*)").eq("product_id", productId).order("sort_order", { ascending: true });
		if (error) throw error;
		return data || [];
	},
	async setProductSpecs(productId, specs) {
		const { error: delErr } = await db().from("product_specifications").delete().eq("product_id", productId);
		if (delErr) throw delErr;
		if (specs.length > 0) {
			const rows = specs.map((s) => ({
				...s,
				product_id: productId
			}));
			const { error: insErr } = await db().from("product_specifications").insert(rows);
			if (insErr) throw insErr;
		}
	}
};
function AdminSpecifications() {
	const [defs, setDefs] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [showForm, setShowForm] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)({
		name: "",
		slug: "",
		description: "",
		field_type: "text",
		options: "",
		placeholder: "",
		is_required: false,
		is_active: true,
		sort_order: 0
	});
	const [optionsList, setOptionsList] = (0, import_react.useState)([]);
	const [optionInput, setOptionInput] = (0, import_react.useState)("");
	const fetch = async () => {
		setLoading(true);
		try {
			const data = await specificationsApi.listDefinitions();
			setDefs(data);
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		fetch();
	}, []);
	const resetForm = () => {
		setForm({
			name: "",
			slug: "",
			description: "",
			field_type: "text",
			options: "",
			placeholder: "",
			is_required: false,
			is_active: true,
			sort_order: 0
		});
		setOptionsList([]);
		setOptionInput("");
		setEditing(null);
	};
	const openEdit = (def) => {
		const opts = Array.isArray(def.options) ? def.options : [];
		setForm({
			name: def.name,
			slug: def.slug,
			description: def.description || "",
			field_type: def.field_type,
			options: "",
			placeholder: def.placeholder || "",
			is_required: def.is_required,
			is_active: def.is_active,
			sort_order: def.sort_order
		});
		setOptionsList(opts);
		setEditing(def);
		setShowForm(true);
	};
	const addOption = () => {
		const val = optionInput.trim();
		if (val && !optionsList.includes(val)) setOptionsList([...optionsList, val]);
		setOptionInput("");
	};
	const removeOption = (idx) => {
		setOptionsList(optionsList.filter((_, i) => i !== idx));
	};
	const handleSave = async () => {
		if (!form.name || !form.slug) return;
		setSaving(true);
		try {
			const payload = {
				...form,
				description: form.description || null,
				placeholder: form.placeholder || null,
				options: optionsList
			};
			if (editing) await specificationsApi.updateDefinition(editing.id, payload);
			else await specificationsApi.createDefinition(payload);
			setShowForm(false);
			resetForm();
			fetch();
		} catch (err) {
			alert(err.message);
		} finally {
			setSaving(false);
		}
	};
	const handleDelete = async (id, name) => {
		if (!window.confirm(`Delete specification "${name}"?`)) return;
		try {
			await specificationsApi.deleteDefinition(id);
			fetch();
		} catch (err) {
			console.error(err);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminLayout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPageHeader, {
			title: "Product Specifications",
			description: `${defs.length} specification definitions`,
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => {
					resetForm();
					setShowForm(true);
				},
				className: "flex items-center gap-2 rounded-lg bg-[#1a1a2e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2d1b4e]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Add Specification"]
			})
		}),
		showForm && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 rounded-xl border border-gray-200 bg-white p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mb-4 text-lg font-bold text-[#1a1a2e]",
					children: editing ? "Edit Specification" : "New Specification"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-600",
							children: "Name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: form.name,
							onChange: (e) => setForm({
								...form,
								name: e.target.value,
								slug: editing ? form.slug : e.target.value.toLowerCase().replace(/\s+/g, "-")
							}),
							className: "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-600",
							children: "Slug"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: form.slug,
							onChange: (e) => setForm({
								...form,
								slug: e.target.value
							}),
							className: "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-600",
							children: "Field Type"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: form.field_type,
							onChange: (e) => setForm({
								...form,
								field_type: e.target.value
							}),
							className: "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "text",
									children: "Text"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "dropdown",
									children: "Dropdown"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "number",
									children: "Number"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "boolean",
									children: "Boolean"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "date",
									children: "Date"
								})
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "sm:col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-600",
								children: "Description"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: form.description,
								onChange: (e) => setForm({
									...form,
									description: e.target.value
								}),
								className: "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-600",
							children: "Placeholder"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: form.placeholder,
							onChange: (e) => setForm({
								...form,
								placeholder: e.target.value
							}),
							className: "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-600",
							children: "Sort Order"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							value: form.sort_order,
							onChange: (e) => setForm({
								...form,
								sort_order: Number(e.target.value)
							}),
							className: "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-600",
							children: "Required"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: form.is_required,
								onChange: (e) => setForm({
									...form,
									is_required: e.target.checked
								}),
								className: "rounded"
							}), "Required"]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-600",
							children: "Active"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: form.is_active,
								onChange: (e) => setForm({
									...form,
									is_active: e.target.checked
								}),
								className: "rounded"
							}), "Active"]
						})] })
					]
				}),
				form.field_type === "dropdown" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-600",
							children: "Dropdown Options"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 mb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: optionInput,
								onChange: (e) => setOptionInput(e.target.value),
								onKeyDown: (e) => {
									if (e.key === "Enter") {
										e.preventDefault();
										addOption();
									}
								},
								className: "flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]",
								placeholder: "Type an option and press Enter or Add"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: addOption,
								className: "rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200",
								children: "Add"
							})]
						}),
						optionsList.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-2",
							children: optionsList.map((opt, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700",
								children: [opt, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => removeOption(i),
									className: "text-gray-400 hover:text-red-500",
									children: "×"
								})]
							}, i))
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: handleSave,
						disabled: saving,
						className: "rounded-lg bg-[#1a1a2e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2d1b4e] disabled:opacity-50",
						children: saving ? "Saving..." : editing ? "Update" : "Create"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							setShowForm(false);
							resetForm();
						},
						className: "rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50",
						children: "Cancel"
					})]
				})
			]
		}),
		loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLoading, {}) : defs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminEmpty, {
			title: "No specifications yet",
			description: "Create specification definitions for your products."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto rounded-xl border border-gray-200 bg-white",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-left text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-gray-100 bg-gray-50",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-600",
							children: "Order"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-600",
							children: "Name"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-600",
							children: "Type"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-600",
							children: "Options"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-600",
							children: "Status"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-600",
							children: "Actions"
						})
					]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
					className: "divide-y divide-gray-100",
					children: defs.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "hover:bg-gray-50",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-gray-400",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GripVertical, { className: "h-4 w-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 font-medium text-[#1a1a2e]",
								children: d.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600 uppercase",
									children: d.field_type
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-gray-500",
								children: Array.isArray(d.options) && d.options.length > 0 ? d.options.slice(0, 3).join(", ") + (d.options.length > 3 ? ` +${d.options.length - 3}` : "") : "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${d.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`,
									children: d.is_active ? "Active" : "Inactive"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => openEdit(d),
										className: "rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "h-4 w-4" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => handleDelete(d.id, d.name),
										className: "rounded-lg p-1.5 text-red-300 hover:bg-red-50 hover:text-red-500",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
									})]
								})
							})
						]
					}, d.id))
				})]
			})
		})
	] });
}
//#endregion
export { AdminSpecifications as component };
