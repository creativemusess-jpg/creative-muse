import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { Dt as ChevronsUpDown, Mt as Check, Ot as ChevronUp, jt as ChevronDown, k as Search, r as X } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AdminTable-9BSMWvKK.js
var import_jsx_runtime = require_jsx_runtime();
function DataTable({ columns, data, keyField, loading, error, emptyTitle = "No items found", emptyDescription, onRetry, selectedItems, onSelectionChange, sortField, sortOrder, onSort, page, totalPages, total, onPageChange, searchValue, onSearchChange, searchPlaceholder = "Search...", filters, bulkActions }) {
	const allSelected = data.length > 0 && selectedItems?.size === data.length;
	const someSelected = (selectedItems?.size ?? 0) > 0;
	const toggleAll = () => {
		if (!onSelectionChange) return;
		if (allSelected) onSelectionChange(/* @__PURE__ */ new Set());
		else onSelectionChange(new Set(data.map((d) => String(d[keyField]))));
	};
	const toggleItem = (id) => {
		if (!onSelectionChange) return;
		const next = new Set(selectedItems);
		if (next.has(id)) next.delete(id);
		else next.add(id);
		onSelectionChange(next);
	};
	const SortIcon = ({ field }) => {
		if (sortField !== field) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronsUpDown, { className: "h-3 w-3 text-gray-300" });
		return sortOrder === "asc" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "h-3 w-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-3 w-3" });
	};
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-xl border border-gray-200 bg-white",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-3 p-6",
			children: [
				1,
				2,
				3,
				4,
				5
			].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-5 flex-1 animate-pulse rounded bg-gray-100" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-5 w-20 animate-pulse rounded bg-gray-100" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-5 w-20 animate-pulse rounded bg-gray-100" })
				]
			}, i))
		})
	});
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-xl border border-red-200 bg-red-50 p-5 text-red-700",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "mt-0.5 h-5 w-5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-semibold",
					children: "Could not load data"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm",
					children: error
				}),
				onRetry && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onRetry,
					className: "mt-3 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700",
					children: "Retry"
				})
			] })]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		(searchValue !== void 0 || filters || bulkActions) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-1 flex-col gap-3 sm:flex-row sm:items-center",
				children: [searchValue !== void 0 && onSearchChange && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						placeholder: searchPlaceholder,
						value: searchValue,
						onChange: (e) => onSearchChange(e.target.value),
						className: "w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-sm outline-none focus:border-[#7A2533]"
					})]
				}), filters]
			}), someSelected && bulkActions && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-xs text-gray-500",
					children: [selectedItems?.size, " selected"]
				}), bulkActions]
			})]
		}),
		data.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center rounded-xl border border-gray-200 bg-white py-20 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex h-16 w-16 items-center justify-center rounded-full bg-gray-100",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-8 w-8 text-gray-400" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-lg font-semibold text-gray-600",
					children: emptyTitle
				}),
				emptyDescription && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-gray-400",
					children: emptyDescription
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto rounded-xl border border-gray-200 bg-white",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-left text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-gray-100 bg-gray-50",
					children: [onSelectionChange && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "w-10 px-3 py-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: allSelected,
							onChange: toggleAll,
							className: "h-4 w-4 rounded border-gray-300 text-[#7A2533] focus:ring-[#7A2533]"
						})
					}), columns.map((col) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: `px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-600 ${col.className || ""} ${col.hideOnMobile ? "hidden md:table-cell" : ""}`,
						children: col.sortable ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => onSort?.(col.key),
							className: "flex items-center gap-1 hover:text-gray-900",
							children: [col.label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortIcon, { field: col.key })]
						}) : col.label
					}, col.key))]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
					className: "divide-y divide-gray-100",
					children: data.map((item) => {
						const id = String(item[keyField]);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: `hover:bg-gray-50 ${selectedItems?.has(id) ? "bg-amber-50/50" : ""}`,
							children: [onSelectionChange && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: selectedItems?.has(id) ?? false,
									onChange: () => toggleItem(id),
									className: "h-4 w-4 rounded border-gray-300 text-[#7A2533] focus:ring-[#7A2533]"
								})
							}), columns.map((col) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: `px-4 py-3 ${col.className || ""} ${col.hideOnMobile ? "hidden md:table-cell" : ""}`,
								children: col.render(item)
							}, col.key))]
						}, id);
					})
				})]
			})
		}),
		totalPages && totalPages > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-gray-500",
				children: [total ?? 0, " total"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => onPageChange?.((page ?? 1) - 1),
						disabled: !page || page <= 1,
						className: "rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium disabled:opacity-30",
						children: "Previous"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "px-3 text-xs text-gray-500",
						children: [
							page ?? 1,
							" of ",
							totalPages
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => onPageChange?.((page ?? 1) + 1),
						disabled: !page || !totalPages || page >= totalPages,
						className: "rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium disabled:opacity-30",
						children: "Next"
					})
				]
			})]
		})
	] });
}
function StatusBadge({ status, size = "sm" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: `inline-block rounded-full font-semibold uppercase tracking-wider ${size === "md" ? "px-2.5 py-1 text-xs" : "px-2 py-0.5 text-[10px]"} ${{
			active: "bg-green-100 text-green-700",
			draft: "bg-gray-100 text-gray-600",
			archived: "bg-yellow-100 text-yellow-700",
			out_of_stock: "bg-red-100 text-red-600",
			pending: "bg-amber-100 text-amber-700",
			paid: "bg-blue-100 text-blue-700",
			fulfilled: "bg-green-100 text-green-700",
			delivered: "bg-emerald-100 text-emerald-700",
			cancelled: "bg-red-100 text-red-600",
			refunded: "bg-purple-100 text-purple-600",
			published: "bg-green-100 text-green-700",
			new: "bg-blue-100 text-blue-700",
			contacted: "bg-amber-100 text-amber-700",
			in_progress: "bg-indigo-100 text-indigo-700",
			resolved: "bg-green-100 text-green-700",
			closed: "bg-gray-100 text-gray-500",
			spam: "bg-red-100 text-red-600",
			subscribed: "bg-green-100 text-green-700",
			unsubscribed: "bg-gray-100 text-gray-500"
		}[status] || "bg-gray-100 text-gray-600"}`,
		children: status.replace(/_/g, " ")
	});
}
function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = "Confirm", variant = "danger" }) {
	if (!open) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-4 w-full max-w-sm rounded-xl bg-white p-6 shadow-xl",
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-lg font-bold text-[#1a1a2e]",
					children: title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-gray-600",
					children: message
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex justify-end gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50",
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							onConfirm();
							onClose();
						},
						className: `rounded-lg px-4 py-2 text-sm font-semibold text-white ${variant === "danger" ? "bg-red-600 hover:bg-red-700" : "bg-[#1a1a2e] hover:bg-[#2d1b4e]"}`,
						children: confirmLabel
					})]
				})
			]
		})
	});
}
function Toast({ message, type = "success", visible, onClose }) {
	if (!visible) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed bottom-6 right-6 z-50 animate-in slide-in-from-right-2",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `flex items-center gap-3 rounded-xl px-5 py-3 text-sm font-medium text-white shadow-lg ${type === "success" ? "bg-green-600" : type === "error" ? "bg-red-600" : "bg-blue-600"}`,
			children: [
				type === "success" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) : type === "error" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }) : null,
				message,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onClose,
					className: "ml-2 opacity-70 hover:opacity-100",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" })
				})
			]
		})
	});
}
//#endregion
export { Toast as i, DataTable as n, StatusBadge as r, ConfirmDialog as t };
