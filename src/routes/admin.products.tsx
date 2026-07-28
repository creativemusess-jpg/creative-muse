import { useState, useEffect, useCallback } from "react";
import { createFileRoute, Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { AdminLayout, AdminPageHeader, AdminLoading } from "@/components/admin/AdminLayout";
import { DataTable, StatusBadge, ConfirmDialog } from "@/components/admin/AdminTable";
import { productsApi, type ProductWithImages } from "@/lib/api/products";
import { Plus, Eye, Edit3, Trash2, ImageOff, CheckCircle, XCircle } from "lucide-react";

import { requireAdmin } from "@/lib/auth-guard";

export const Route = createFileRoute("/admin/products")({
  beforeLoad: requireAdmin,
  component: AdminProducts,
});

function AdminProducts() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [products, setProducts] = useState<ProductWithImages[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 20;

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await productsApi.list({
        search: search || undefined,
        status: statusFilter || undefined,
        sort_by: "created_at",
        sort_order: "desc",
        per_page: perPage,
        page,
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
  }, [search, statusFilter, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

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
      setSelected(new Set());
      fetchProducts();
    } catch (err) { console.error(err); }
  };

  const handleBulkStatus = async (status: string) => {
    const ids = Array.from(selected);
    try {
      await Promise.all(ids.map((id) => productsApi.updateStatus(id, status)));
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      setSelected(new Set());
      fetchProducts();
    } catch (err) { console.error(err); }
  };

  const formatPrice = (n: number) => "₹" + n.toLocaleString("en-IN");

  const columns = [
    {
      key: "name", label: "Product", sortable: true,
      render: (p: ProductWithImages) => {
        const imgUrl = p.main_image?.url || p.images?.[0]?.url;
        return (
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-gray-100">
              {imgUrl ? (
                <img src={imgUrl} alt={p.name} className="h-full w-full object-cover" loading="lazy"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-gray-400"><ImageOff className="h-4 w-4" /></div>
              )}
            </div>
            <div className="min-w-0">
              <Link to="/admin/products/$id" params={{ id: p.id }} className="font-medium text-[#1a1a2e] hover:text-[#c9a96e]">
                {p.name}
              </Link>
              {(p.flags || []).filter((f) => f.badge_label).map((flag) => (
                <span key={flag.id} className="ml-1 rounded px-1.5 py-0.5 text-[10px] font-semibold" style={{ backgroundColor: flag.badge_bg_color || "#c9a96e", color: flag.badge_text_color || "#ffffff" }}>
                  {flag.badge_label}
                </span>
              ))}
            </div>
          </div>
        );
      },
    },
    { key: "category", label: "Category", render: (p: ProductWithImages) => <span className="text-gray-500">{p.category_name || "—"}</span>, hideOnMobile: true },
    
    { key: "price", label: "Price", sortable: true, render: (p: ProductWithImages) => <span className="font-medium">{formatPrice(p.current_price)}</span> },
    { key: "stock", label: "Stock", render: (p: ProductWithImages) => (
      <span className={p.stock_quantity !== null && p.stock_quantity <= 5 ? "font-medium text-red-600" : ""}>{p.stock_quantity ?? "—"}</span>
    )},
    { key: "status", label: "Status", render: (p: ProductWithImages) => <StatusBadge status={p.status} /> },
    { key: "updated", label: "Updated", render: (p: ProductWithImages) => <span className="text-xs text-gray-500">{new Date(p.updated_at).toLocaleDateString()}</span>, hideOnMobile: true },
    {
      key: "actions", label: "", className: "text-right",
      render: (p: ProductWithImages) => (
        <div className="flex items-center justify-end gap-1">
          <Link to="/product/$productId" params={{ productId: p.slug }} target="_blank" className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600" title="Preview">
            <Eye className="h-4 w-4" />
          </Link>
          <button onClick={() => productsApi.updateStatus(p.id, p.status === "active" ? "archived" : "active").then(() => fetchProducts())}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600" title={p.status === "active" ? "Archive" : "Publish"}>
            {p.status === "active" ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
          </button>
          <Link to="/admin/products/$id" params={{ id: p.id }} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600" title="Edit">
            <Edit3 className="h-4 w-4" />
          </Link>
          <button onClick={() => setDeleteConfirm({ id: p.id, name: p.name })}
            className="rounded-lg p-1.5 text-red-300 hover:bg-red-50 hover:text-red-500" title="Delete">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  if (location.pathname !== "/admin/products") return <Outlet />;

  return (
    <AdminLayout>
      <ConfirmDialog
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Delete Product"
        message={`Delete "${deleteConfirm?.name}"? This cannot be undone.`}
        confirmLabel="Delete"
      />

      <AdminPageHeader
        title="Products"
        description={`${count} products total`}
        actions={
          <button onClick={() => navigate({ to: "/admin/products/new" })}
            className="flex items-center gap-2 rounded-lg bg-[#1a1a2e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2d1b4e]">
            <Plus className="h-4 w-4" /> Add Product
          </button>
        }
      />

      <DataTable
        columns={columns}
        data={products}
        keyField="id"
        loading={loading}
        error={error}
        onRetry={fetchProducts}
        emptyTitle="No products found"
        emptyDescription="Create your first product to get started"
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        searchPlaceholder="Search products..."
        selectedItems={selected}
        onSelectionChange={setSelected}
        page={page}
        totalPages={totalPages}
        total={count}
        onPageChange={setPage}
        filters={
          <div className="flex gap-2">
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#c9a96e]">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="out_of_stock">Out of Stock</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        }
        bulkActions={
          <div className="flex gap-2">
            <button onClick={() => handleBulkStatus("active")} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium hover:bg-gray-50">
              Publish
            </button>
            <button onClick={() => handleBulkStatus("archived")} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium hover:bg-gray-50">
              Archive
            </button>
            <button onClick={handleBulkDelete} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50">
              Delete
            </button>
          </div>
        }
      />
    </AdminLayout>
  );
}
