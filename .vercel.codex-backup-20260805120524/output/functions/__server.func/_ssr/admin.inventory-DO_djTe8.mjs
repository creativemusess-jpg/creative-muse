import { o as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./supabase-Bz-JQXNc.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { H as Minus, it as History } from "../_libs/lucide-react.mjs";
import { n as AdminLayout } from "./AdminLayout-D0HWfGfb.mjs";
import { n as DataTable, t as ConfirmDialog } from "./AdminTable-9BSMWvKK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.inventory-DO_djTe8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var inventoryApi = {
	async list(threshold = 10) {
		const { data: products } = await supabase.from("products").select("id, name, stock_quantity, low_stock_threshold, status, current_price, slug, category_id").order("name");
		return (products ?? []).map((p) => ({
			id: p.id,
			name: p.name,
			stock_quantity: p.stock_quantity ?? 0,
			committed: 0,
			low_stock_threshold: p.low_stock_threshold ?? threshold,
			status: p.status,
			current_price: p.current_price ?? 0,
			slug: p.slug
		}));
	},
	async adjust(productId, newQuantity, reason, createdBy) {
		const { data: product } = await supabase.from("products").select("stock_quantity").eq("id", productId).single();
		const prev = product?.stock_quantity ?? 0;
		const diff = newQuantity - prev;
		await supabase.from("products").update({ stock_quantity: newQuantity }).eq("id", productId);
		await supabase.from("inventory_adjustments").insert({
			product_id: productId,
			previous_quantity: prev,
			new_quantity: newQuantity,
			difference: diff,
			reason,
			created_by: createdBy
		});
	},
	async getHistory(productId) {
		const { data } = await supabase.from("inventory_adjustments").select("*").eq("product_id", productId).order("created_at", { ascending: false }).limit(50);
		return (data ?? []).map((a) => ({
			...a,
			product_name: void 0
		}));
	},
	async getAllAdjustments(limit = 100) {
		const { data } = await supabase.from("inventory_adjustments").select("*, products!inner(name)").order("created_at", { ascending: false }).limit(limit);
		return (data ?? []).map((a) => ({
			id: a.id,
			product_id: a.product_id,
			previous_quantity: a.previous_quantity,
			new_quantity: a.new_quantity,
			difference: a.difference,
			reason: a.reason,
			created_by: a.created_by,
			created_at: a.created_at,
			product_name: a.products?.name || "Unknown"
		}));
	}
};
function InventoryPage() {
	const [data, setData] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)("");
	const [adjustProduct, setAdjustProduct] = (0, import_react.useState)(null);
	const [adjustQty, setAdjustQty] = (0, import_react.useState)(0);
	const [adjustReason, setAdjustReason] = (0, import_react.useState)("");
	const [history, setHistory] = (0, import_react.useState)([]);
	const [showHistory, setShowHistory] = (0, import_react.useState)(false);
	const load = async () => {
		setLoading(true);
		try {
			const d = await inventoryApi.list();
			setData(d.map((p) => ({
				id: p.id,
				product_name: p.name,
				quantity: p.stock_quantity ?? 0,
				threshold: p.low_stock_threshold ?? 5,
				status: p.status,
				price: p.current_price
			})));
		} catch (e) {
			setError(e.message);
		}
		setLoading(false);
	};
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	const handleAdjust = async () => {
		if (!adjustProduct) return;
		try {
			await inventoryApi.adjust(adjustProduct.id, adjustQty, adjustReason, "admin");
			setAdjustProduct(null);
			setAdjustQty(0);
			setAdjustReason("");
			load();
		} catch (e) {
			alert(e.message);
		}
	};
	const loadHistory = async (productId) => {
		try {
			const h = await inventoryApi.getHistory(productId);
			setHistory(h || []);
			setShowHistory(true);
		} catch (e) {
			alert(e.message);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminLayout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
			open: !!adjustProduct,
			onClose: () => setAdjustProduct(null),
			onConfirm: handleAdjust,
			title: `Adjust stock: ${adjustProduct?.product_name || ""}`,
			message: `Current: ${adjustProduct?.quantity ?? 0}. Set to?`,
			confirmLabel: "Adjust"
		}),
		showHistory && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40",
			onClick: () => setShowHistory(false),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-h-[70vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-lg",
				onClick: (e) => e.stopPropagation(),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-bold text-[#1a1a2e]",
						children: "Adjustment History"
					}),
					history.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 space-y-3",
						children: history.map((h, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between rounded-lg border border-gray-100 p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm font-medium",
								children: ["Qty: ", h.quantity]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-gray-400",
								children: h.reason || "—"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-gray-400",
								children: new Date(h.created_at).toLocaleString()
							})]
						}, i))
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm text-gray-400",
						children: "No adjustment history"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setShowHistory(false),
						className: "mt-4 w-full rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50",
						children: "Close"
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 lg:grid-cols-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "lg:col-span-2 rounded-xl border border-gray-200 bg-white p-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
					title: "Inventory",
					data,
					loading,
					error,
					primaryKey: "id",
					emptyMessage: "No inventory data",
					searchPlaceholder: "Search products...",
					filterFn: (item, term) => item.product_name?.toLowerCase().includes(term),
					columns: [
						{
							key: "product_name",
							label: "Product",
							sortable: true
						},
						{
							key: "quantity",
							label: "Stock",
							sortable: true,
							render: (val, row) => {
								const threshold = row.threshold ?? 5;
								if (val <= 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-red-600",
									children: val
								});
								if (val <= threshold) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-amber-600",
									children: val
								});
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-green-600",
									children: val
								});
							}
						},
						{
							key: "threshold",
							label: "Min",
							render: (val) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-gray-400",
								children: val ?? 5
							})
						}
					],
					actions: (row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => {
								setAdjustProduct(row);
								setAdjustQty(row.quantity ?? 0);
								setAdjustReason("");
							},
							className: "rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-amber-600",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "h-4 w-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => loadHistory(row.id),
							className: "rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-blue-500",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "h-4 w-4" })
						})]
					})
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "lg:col-span-1",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-gray-200 bg-white p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-bold text-[#1a1a2e]",
						children: "Stock Alerts"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 space-y-3",
						children: [data.filter((p) => (p.quantity ?? 0) <= (p.threshold ?? 5)).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center justify-between rounded-lg border border-red-100 bg-red-50 p-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium text-red-700 truncate",
									children: p.product_name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-red-500",
									children: ["Stock: ", p.quantity ?? 0]
								})]
							})
						}, p.id)), data.filter((p) => (p.quantity ?? 0) <= (p.threshold ?? 5)).length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-gray-400",
							children: "All products are well-stocked"
						})]
					})]
				})
			})]
		}),
		adjustProduct && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40",
			onClick: () => setAdjustProduct(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full max-w-md rounded-xl bg-white p-6 shadow-lg",
				onClick: (e) => e.stopPropagation(),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-bold text-[#1a1a2e]",
						children: "Adjust Stock"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-gray-500",
						children: adjustProduct.product_name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-xs text-gray-400",
						children: ["Current stock: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: adjustProduct.quantity ?? 0 })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-semibold text-gray-500 uppercase",
							children: "New Quantity"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							value: adjustQty,
							onChange: (e) => setAdjustQty(Number(e.target.value)),
							className: "mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-semibold text-gray-500 uppercase",
							children: "Reason"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: adjustReason,
							onChange: (e) => setAdjustReason(e.target.value),
							placeholder: "e.g. stock count, return, damage...",
							className: "mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex justify-end gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setAdjustProduct(null),
							className: "rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50",
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: handleAdjust,
							className: "rounded-lg bg-[#1a1a2e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2d1b4e]",
							children: "Save"
						})]
					})
				]
			})
		})
	] });
}
//#endregion
export { InventoryPage as component };
