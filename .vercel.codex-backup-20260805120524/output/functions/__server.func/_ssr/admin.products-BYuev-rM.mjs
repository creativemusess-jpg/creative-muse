import { o as __toESM } from "../_runtime.mjs";
import { t as productsApi } from "./products-CsgymTpp.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime, r as useQueryClient } from "../_libs/react+tanstack__react-query.mjs";
import { _ as Link, l as useLocation, p as Outlet, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { P as Plus, R as PenLine, Tt as CircleCheckBig, _ as Trash2, nt as ImageOff, pt as Eye, wt as CircleX } from "../_libs/lucide-react.mjs";
import { i as AdminPageHeader, n as AdminLayout } from "./AdminLayout-D0HWfGfb.mjs";
import { n as DataTable, r as StatusBadge, t as ConfirmDialog } from "./AdminTable-9BSMWvKK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.products-BYuev-rM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminProducts() {
	const location = useLocation();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [products, setProducts] = (0, import_react.useState)([]);
	const [count, setCount] = (0, import_react.useState)(0);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const [search, setSearch] = (0, import_react.useState)("");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("");
	const [categoryFilter, setCategoryFilter] = (0, import_react.useState)("");
	const [selected, setSelected] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const [deleteConfirm, setDeleteConfirm] = (0, import_react.useState)(null);
	const [page, setPage] = (0, import_react.useState)(1);
	const perPage = 20;
	const fetchProducts = (0, import_react.useCallback)(async () => {
		setLoading(true);
		setError(null);
		try {
			const result = await productsApi.list({
				search: search || void 0,
				status: statusFilter || void 0,
				sort_by: "created_at",
				sort_order: "desc",
				per_page: perPage,
				page
			});
			setProducts(result.data);
			setCount(result.count);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Unable to load products");
			setProducts([]);
			setCount(0);
		} finally {
			setLoading(false);
		}
	}, [
		search,
		statusFilter,
		page
	]);
	(0, import_react.useEffect)(() => {
		fetchProducts();
	}, [fetchProducts]);
	const totalPages = Math.ceil(count / perPage);
	const handleDelete = async () => {
		if (!deleteConfirm) return;
		try {
			await productsApi.delete(deleteConfirm.id);
			await queryClient.invalidateQueries({ queryKey: ["products"] });
			setDeleteConfirm(null);
			fetchProducts();
		} catch (err) {
			console.error(err);
		}
	};
	const handleBulkDelete = async () => {
		const ids = Array.from(selected);
		if (!window.confirm(`Delete ${ids.size ?? ids.length} products?`)) return;
		try {
			await Promise.all(ids.map((id) => productsApi.delete(id)));
			await queryClient.invalidateQueries({ queryKey: ["products"] });
			setSelected(/* @__PURE__ */ new Set());
			fetchProducts();
		} catch (err) {
			console.error(err);
		}
	};
	const handleBulkStatus = async (status) => {
		const ids = Array.from(selected);
		try {
			await Promise.all(ids.map((id) => productsApi.updateStatus(id, status)));
			await queryClient.invalidateQueries({ queryKey: ["products"] });
			setSelected(/* @__PURE__ */ new Set());
			fetchProducts();
		} catch (err) {
			console.error(err);
		}
	};
	const formatPrice = (n) => "₹" + n.toLocaleString("en-IN");
	const columns = [
		{
			key: "name",
			label: "Product",
			sortable: true,
			render: (p) => {
				const imgUrl = p.main_image?.url || p.images?.[0]?.url;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-gray-100",
						children: imgUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: imgUrl,
							alt: p.name,
							className: "h-full w-full object-cover",
							loading: "lazy",
							onError: (e) => {
								e.target.style.display = "none";
							}
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-full w-full items-center justify-center text-gray-400",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageOff, { className: "h-4 w-4" })
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/admin/products/$id",
							params: { id: p.id },
							className: "font-medium text-[#1a1a2e] hover:text-[#7A2533]",
							children: p.name
						}), (p.flags || []).filter((f) => f.badge_label).map((flag) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "ml-1 rounded px-1.5 py-0.5 text-[10px] font-semibold",
							style: {
								backgroundColor: flag.badge_bg_color || "#7A2533",
								color: flag.badge_text_color || "#ffffff"
							},
							children: flag.badge_label
						}, flag.id))]
					})]
				});
			}
		},
		{
			key: "category",
			label: "Category",
			render: (p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-gray-500",
				children: p.category_name || "—"
			}),
			hideOnMobile: true
		},
		{
			key: "price",
			label: "Price",
			sortable: true,
			render: (p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-medium",
				children: formatPrice(p.current_price)
			})
		},
		{
			key: "stock",
			label: "Stock",
			render: (p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: p.stock_quantity !== null && p.stock_quantity <= 5 ? "font-medium text-red-600" : "",
				children: p.stock_quantity ?? "—"
			})
		},
		{
			key: "status",
			label: "Status",
			render: (p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: p.status })
		},
		{
			key: "updated",
			label: "Updated",
			render: (p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs text-gray-500",
				children: new Date(p.updated_at).toLocaleDateString()
			}),
			hideOnMobile: true
		},
		{
			key: "actions",
			label: "",
			className: "text-right",
			render: (p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-end gap-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/product/$productId",
						params: { productId: p.slug },
						target: "_blank",
						className: "rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600",
						title: "Preview",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => productsApi.updateStatus(p.id, p.status === "active" ? "archived" : "active").then(() => fetchProducts()),
						className: "rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600",
						title: p.status === "active" ? "Archive" : "Publish",
						children: p.status === "active" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/admin/products/$id",
						params: { id: p.id },
						className: "rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600",
						title: "Edit",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setDeleteConfirm({
							id: p.id,
							name: p.name
						}),
						className: "rounded-lg p-1.5 text-red-300 hover:bg-red-50 hover:text-red-500",
						title: "Delete",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
					})
				]
			})
		}
	];
	if (location.pathname !== "/admin/products") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminLayout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
			open: !!deleteConfirm,
			onClose: () => setDeleteConfirm(null),
			onConfirm: handleDelete,
			title: "Delete Product",
			message: `Delete "${deleteConfirm?.name}"? This cannot be undone.`,
			confirmLabel: "Delete"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPageHeader, {
			title: "Products",
			description: `${count} products total`,
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => navigate({ to: "/admin/products/new" }),
				className: "flex items-center gap-2 rounded-lg bg-[#1a1a2e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2d1b4e]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Add Product"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
			columns,
			data: products,
			keyField: "id",
			loading,
			error,
			onRetry: fetchProducts,
			emptyTitle: "No products found",
			emptyDescription: "Create your first product to get started",
			searchValue: search,
			onSearchChange: (v) => {
				setSearch(v);
				setPage(1);
			},
			searchPlaceholder: "Search products...",
			selectedItems: selected,
			onSelectionChange: setSelected,
			page,
			totalPages,
			total: count,
			onPageChange: setPage,
			filters: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: statusFilter,
					onChange: (e) => {
						setStatusFilter(e.target.value);
						setPage(1);
					},
					className: "rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "All Status"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "active",
							children: "Active"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "draft",
							children: "Draft"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "out_of_stock",
							children: "Out of Stock"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "archived",
							children: "Archived"
						})
					]
				})
			}),
			bulkActions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => handleBulkStatus("active"),
						className: "rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium hover:bg-gray-50",
						children: "Publish"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => handleBulkStatus("archived"),
						className: "rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium hover:bg-gray-50",
						children: "Archive"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: handleBulkDelete,
						className: "rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50",
						children: "Delete"
					})
				]
			})
		})
	] });
}
//#endregion
export { AdminProducts as component };
