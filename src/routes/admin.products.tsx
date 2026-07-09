import { useState, useEffect } from "react";
import { createFileRoute, Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { AdminLayout, AdminPageHeader, AdminLoading, AdminEmpty } from "@/components/admin/AdminLayout";
import { productsApi, type ProductWithImages } from "@/lib/api/products";
import { Plus, Search, Eye, Edit3, Trash2, CheckCircle, XCircle, ImageOff, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/admin/products")({
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

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await productsApi.list({
        search: search || undefined,
        status: statusFilter || undefined,
        sort_by: "created_at",
        sort_order: "desc",
        per_page: 50,
      });
      setProducts(result.data);
      setCount(result.count);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Unable to load products");
      setProducts([]);
      setCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, [search, statusFilter]);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}"? This action cannot be undone.`)) return;
    try {
      await productsApi.delete(id);
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusToggle = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "archived" : "active";
    try {
      await productsApi.updateStatus(id, newStatus);
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const formatPrice = (n: number) => "₹" + n.toLocaleString("en-IN");

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      active: "bg-green-100 text-green-700",
      draft: "bg-gray-100 text-gray-600",
      out_of_stock: "bg-red-100 text-red-600",
      archived: "bg-yellow-100 text-yellow-700",
    };
    return (
      <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${colors[status] || "bg-gray-100 text-gray-600"}`}>
        {status.replace(/_/g, " ")}
      </span>
    );
  };

  if (location.pathname !== "/admin/products") {
    return <Outlet />;
  }

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Products"
        description={`${count} products total`}
        actions={
          <button
            type="button"
            onClick={() => navigate({ to: "/admin/products/new" })}
            className="flex items-center gap-2 rounded-lg bg-[#1a1a2e] px-4 py-2 text-sm font-semibold text-white outline-none hover:bg-[#2d1b4e] focus-visible:ring-2 focus-visible:ring-[#c9a96e] focus-visible:ring-offset-2"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </button>
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-sm outline-none focus:border-[#c9a96e]"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#c9a96e]"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="out_of_stock">Out of Stock</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {loading ? (
        <AdminLoading />
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="font-semibold">Products could not be loaded</p>
              <p className="mt-1 text-sm">{error}</p>
              <button
                type="button"
                onClick={fetchProducts}
                className="mt-3 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      ) : products.length === 0 ? (
        <AdminEmpty title="No products found" description="Create your first product to get started" />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Product</th>
                <th className="px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">SKU</th>
                <th className="px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Price</th>
                <th className="px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Stock</th>
                <th className="px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Updated</th>
                <th className="px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((p) => {
                const imgUrl = p.main_image?.url || p.images?.[0]?.url;
                return (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                          {imgUrl ? (
                            <img
                              src={imgUrl}
                              alt={p.name}
                              className="h-full w-full object-cover"
                              loading="lazy"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none";
                                (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
                              }}
                            />
                          ) : null}
                          <div className={`flex h-full w-full items-center justify-center text-gray-400 ${imgUrl ? "hidden" : ""}`}>
                            <ImageOff className="h-5 w-5" />
                          </div>
                        </div>
                        <div className="min-w-0">
                          <Link
                            to="/admin/products/$id"
                            params={{ id: p.id }}
                            className="font-medium text-[#1a1a2e] hover:text-[#c9a96e]"
                          >
                            {p.name}
                          </Link>
                          {p.badge && (
                            <span className="ml-2 rounded bg-[#c9a96e]/10 px-1.5 py-0.5 text-[10px] font-semibold text-[#c9a96e]">
                              {p.badge}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{p.category_name || "—"}</td>
                    <td className="px-4 py-3 text-gray-500">{p.sku || "—"}</td>
                    <td className="px-4 py-3 font-medium">{formatPrice(p.current_price)}</td>
                    <td className="px-4 py-3">
                      <span className={p.stock_quantity !== null && p.stock_quantity <= 5 ? "text-red-600 font-medium" : ""}>
                        {p.stock_quantity ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3">{statusBadge(p.status)}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {new Date(p.updated_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Link
                          to="/product/$productId"
                          params={{ productId: p.slug }}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                          title={`Preview ${p.name}`}
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleStatusToggle(p.id, p.status)}
                          className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                          title={p.status === "active" ? "Archive" : "Publish"}
                        >
                          {p.status === "active" ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                        </button>
                        <Link
                          to="/admin/products/$id"
                          params={{ id: p.id }}
                          className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                          title={`Edit ${p.name}`}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          className="rounded-lg p-1.5 text-red-300 hover:bg-red-50 hover:text-red-500"
                          title={`Delete ${p.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
