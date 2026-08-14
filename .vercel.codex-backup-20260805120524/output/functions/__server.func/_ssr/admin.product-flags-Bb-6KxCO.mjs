import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { P as Plus, R as PenLine, _ as Trash2, ct as GripVertical } from "../_libs/lucide-react.mjs";
import { i as AdminPageHeader, n as AdminLayout, r as AdminLoading, t as AdminEmpty } from "./AdminLayout-D0HWfGfb.mjs";
import { t as productFlagsApi } from "./product-flags-CqIQcQvi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.product-flags-Bb-6KxCO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminProductFlags() {
	const [flags, setFlags] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [showForm, setShowForm] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)({
		name: "",
		slug: "",
		badge_label: "",
		badge_bg_color: "#1a1a2e",
		badge_text_color: "#ffffff",
		badge_border_color: "transparent",
		icon: "",
		priority: 0,
		status: "active",
		display_order: 0
	});
	const fetch = async () => {
		setLoading(true);
		try {
			const data = await productFlagsApi.list();
			setFlags(data);
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
			badge_label: "",
			badge_bg_color: "#1a1a2e",
			badge_text_color: "#ffffff",
			badge_border_color: "transparent",
			icon: "",
			priority: 0,
			status: "active",
			display_order: 0
		});
		setEditing(null);
	};
	const openEdit = (flag) => {
		setForm({
			name: flag.name,
			slug: flag.slug,
			badge_label: flag.badge_label || "",
			badge_bg_color: flag.badge_bg_color,
			badge_text_color: flag.badge_text_color,
			badge_border_color: flag.badge_border_color || "transparent",
			icon: flag.icon || "",
			priority: flag.priority,
			status: flag.status,
			display_order: flag.display_order
		});
		setEditing(flag);
		setShowForm(true);
	};
	const handleSave = async () => {
		if (!form.name || !form.slug) return;
		setSaving(true);
		try {
			const payload = {
				...form,
				badge_label: form.badge_label || null,
				icon: form.icon || null,
				badge_border_color: form.badge_border_color || null
			};
			if (editing) await productFlagsApi.update(editing.id, payload);
			else await productFlagsApi.create(payload);
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
		if (!window.confirm(`Delete flag "${name}"?`)) return;
		try {
			await productFlagsApi.delete(id);
			fetch();
		} catch (err) {
			console.error(err);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminLayout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPageHeader, {
			title: "Product Flags",
			description: `${flags.length} flags`,
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => {
					resetForm();
					setShowForm(true);
				},
				className: "flex items-center gap-2 rounded-lg bg-[#1a1a2e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2d1b4e]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Add Flag"]
			})
		}),
		showForm && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 rounded-xl border border-gray-200 bg-white p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mb-4 text-lg font-bold text-[#1a1a2e]",
					children: editing ? "Edit Flag" : "New Flag"
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
							children: "Badge Label"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: form.badge_label,
							onChange: (e) => setForm({
								...form,
								badge_label: e.target.value
							}),
							className: "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]",
							placeholder: "NEW"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-600",
							children: "Badge BG Color"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "color",
								value: form.badge_bg_color,
								onChange: (e) => setForm({
									...form,
									badge_bg_color: e.target.value
								}),
								className: "h-9 w-9 cursor-pointer rounded border"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: form.badge_bg_color,
								onChange: (e) => setForm({
									...form,
									badge_bg_color: e.target.value
								}),
								className: "flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
							})]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-600",
							children: "Badge Text Color"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "color",
								value: form.badge_text_color,
								onChange: (e) => setForm({
									...form,
									badge_text_color: e.target.value
								}),
								className: "h-9 w-9 cursor-pointer rounded border"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: form.badge_text_color,
								onChange: (e) => setForm({
									...form,
									badge_text_color: e.target.value
								}),
								className: "flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
							})]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-600",
							children: "Border Color"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "color",
								value: form.badge_border_color,
								onChange: (e) => setForm({
									...form,
									badge_border_color: e.target.value
								}),
								className: "h-9 w-9 cursor-pointer rounded border"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: form.badge_border_color,
								onChange: (e) => setForm({
									...form,
									badge_border_color: e.target.value
								}),
								className: "flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
							})]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-600",
							children: "Icon (optional)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: form.icon,
							onChange: (e) => setForm({
								...form,
								icon: e.target.value
							}),
							className: "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]",
							placeholder: "lucide-icon-name"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-600",
							children: "Priority"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							value: form.priority,
							onChange: (e) => setForm({
								...form,
								priority: Number(e.target.value)
							}),
							className: "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-600",
							children: "Display Order"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							value: form.display_order,
							onChange: (e) => setForm({
								...form,
								display_order: Number(e.target.value)
							}),
							className: "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-600",
							children: "Status"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: form.status,
							onChange: (e) => setForm({
								...form,
								status: e.target.value
							}),
							className: "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "active",
								children: "Active"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "inactive",
								children: "Inactive"
							})]
						})] })
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
		loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLoading, {}) : flags.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminEmpty, {
			title: "No flags yet",
			description: "Create product flags to tag and categorize your products."
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
							children: "Flag"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-600",
							children: "Badge Preview"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-600",
							children: "Priority"
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
					children: flags.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "hover:bg-gray-50",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-gray-400",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GripVertical, { className: "h-4 w-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 font-medium text-[#1a1a2e]",
								children: f.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-4 py-3",
								children: [f.badge_label && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
									style: {
										backgroundColor: f.badge_bg_color,
										color: f.badge_text_color,
										borderColor: f.badge_border_color || "transparent",
										borderWidth: f.badge_border_color && f.badge_border_color !== "transparent" ? 1 : 0
									},
									children: f.badge_label
								}), !f.badge_label && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-gray-400",
									children: "—"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-gray-500",
								children: f.priority
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${f.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`,
									children: f.status
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => openEdit(f),
										className: "rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "h-4 w-4" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => handleDelete(f.id, f.name),
										className: "rounded-lg p-1.5 text-red-300 hover:bg-red-50 hover:text-red-500",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
									})]
								})
							})
						]
					}, f.id))
				})]
			})
		})
	] });
}
//#endregion
export { AdminProductFlags as component };
