import { useState, useEffect, useCallback } from "react";
import { createFileRoute, Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { AdminLayout, AdminPageHeader, AdminLoading } from "@/components/admin/AdminLayout";
import { DataTable, StatusBadge, ConfirmDialog } from "@/components/admin/AdminTable";
import { productsApi, type ProductWithImages } from "@/lib/api/products";
import { Plus, Eye, Edit3, ImageOff, Archive } from "lucide-react";

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
  const [recycleConfirm, setRecycleConfirm] = useState<{ id: string; name: string } | null>(null);
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
      }, { excludeArchived: !statusFilter });
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

  const handleMoveToRecycle = async () => {
    if (!recycleConfirm) return;
    try {
      await productsApi.archiveProduct(recycleConfirm.id);
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      setRecycleConfirm(null);
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleBulkStatus = async (status: string) => {
    const ids = Array.from(selected);
    try {
      await productsApi.bulkUpdateStatus(ids, status);
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      setSelected(new Set());
      fetchProducts();
    } catch (err) { console.error(err); }
  };

  const isScheduled = (p: ProductWithImages) =>
    !!p.publish_at && new Date(p.publish_at).getTime() > Date.now();

  const formatPrice = (n: number) => "₹" + n.toLocaleString("en-IN");

  const renderMobileCard = (p: ProductWithImages) => {
    const imgUrl = p.main_image?.url || p.images?.[0]?.url;
    return (
      <div className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-3">
        <div className="flex gap-3">
          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-100">
            {imgUrl ? (
              <img src={imgUrl} alt={p.name} className="h-full w-full object-cover" loading="lazy"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-gray-400"><ImageOff className="h-4 w-4" /></div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <Link to="/admin/products/$id" params={{ id: p.id }} className="font-medium text-[#1a1a2e] hover:text-[#9C544D] line-clamp-1">
              {p.name}
            </Link>
            {(p.flags || []).filter((f) => f.badge_label).map((flag) => (
              <span key={flag.id} className="ml-1 rounded px-1.5 py-0.5 text-[10px] font-semibold" style={{ backgroundColor: flag.badge_bg_color || "#9C544D", color: flag.badge_text_color || "#ffffff" }}>
                {flag.badge_label}
              </span>
            ))}
            <div className="mt-1 text-xs text-gray-500">{p.category_name || "—"}</div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">{formatPrice(p.current_price)}</span>
            <span className={p.stock_quantity !== null && p.stock_quantity <= 5 ? "text-xs font-medium text-red-600" : "text-xs text-gray-500"}>
              Stock: {p.stock_quantity ?? "—"}
            </span>
          </div>
          <StatusBadge status={p.status} />
        </div>
        {isScheduled(p) && (
          <div className="text-[11px] font-medium text-[#9C544D]">
            Scheduled: {new Date(p.publish_at!).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" })}
          </div>
        )}
        <div className="flex items-center gap-1 border-t border-gray-100 pt-2">
          <Link to="/product/$productId" params={{ productId: p.slug }} target="_blank"
            className="flex h-9 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50">
            <Eye className="h-3.5 w-3.5" /> Preview
          </Link>
          <Link to="/admin/products/$id" params={{ id: p.id }}
            className="flex h-9 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50">
            <Edit3 className="h-3.5 w-3.5" /> Edit
          </Link>
          <button onClick={() => setRecycleConfirm({ id: p.id, name: p.name })}
            className="flex h-9 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50">
            <Archive className="h-3.5 w-3.5" /> Archive
          </button>
        </div>
      </div>
    );
  };

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
              <Link to="/admin/products/$id" params={{ id: p.id }} className="font-medium text-[#1a1a2e] hover:text-[#9C544D]">
                {p.name}
              </Link>
              {(p.flags || []).filter((f) => f.badge_label).map((flag) => (
                <span key={flag.id} className="ml-1 rounded px-1.5 py-0.5 text-[10px] font-semibold" style={{ backgroundColor: flag.badge_bg_color || "#9C544D", color: flag.badge_text_color || "#ffffff" }}>
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
    { key: "status", label: "Status", render: (p: ProductWithImages) => (
      <div className="space-y-1">
        <StatusBadge status={p.status} />
        {isScheduled(p) && (
          <div className="text-[11px] font-medium text-[#9C544D]">
            Scheduled —{" "}
            {new Date(p.publish_at!).toLocaleString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </div>
        )}
      </div>
    ) },
    { key: "updated", label: "Updated", render: (p: ProductWithImages) => <span className="text-xs text-gray-500">{new Date(p.updated_at).toLocaleDateString()}</span>, hideOnMobile: true },
    {
      key: "actions", label: "", className: "text-right",
      render: (p: ProductWithImages) => (
        <div className="flex items-center justify-end gap-1">
          <Link to="/product/$productId" params={{ productId: p.slug }} target="_blank" className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600" title="Preview">
            <Eye className="h-4 w-4" />
          </Link>
          <button onClick={() => setRecycleConfirm({ id: p.id, name: p.name })}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600" title="Move to Recycle Bin">
            <Archive className="h-4 w-4" />
          </button>
          <Link to="/admin/products/$id" params={{ id: p.id }} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600" title="Edit">
            <Edit3 className="h-4 w-4" />
          </Link>
        </div>
      ),
    },
  ];

  if (location.pathname !== "/admin/products") return <Outlet />;

  return (
    <AdminLayout>
      <ConfirmDialog
        open={!!recycleConfirm}
        onClose={() => setRecycleConfirm(null)}
        onConfirm={handleMoveToRecycle}
        title="Move to Recycle Bin"
        message={`Move "${recycleConfirm?.name}" to the recycle bin? It will be hidden from the storefront, but all of its data and historical orders are preserved. It can be restored anytime.`}
        confirmLabel="Move to Recycle Bin"
        variant="primary"
      />

      <AdminPageHeader
        title="Products"
        description={`${count} products total`}
        actions={
          <button onClick={() => navigate({ to: "/admin/products/new" })}
            className="flex items-center gap-2 rounded-lg bg-[#1a1a2e] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#2d1b4e] min-h-[44px]">
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
        mobileCardRender={renderMobileCard}
        mobileCardGrid="grid-cols-1 sm:grid-cols-2"
        filters={
          <div className="flex gap-2">
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#9C544D] min-h-[40px]">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>
        }
        bulkActions={
          <div className="flex gap-2">
            <button onClick={() => handleBulkStatus("active")} className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium hover:bg-gray-50 min-h-[40px]">
              Publish
            </button>
            <button onClick={() => handleBulkStatus("archived")} className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium hover:bg-gray-50 min-h-[40px]">
              Move to Recycle Bin
            </button>
          </div>
        }
      />
    </AdminLayout>
  );
}
