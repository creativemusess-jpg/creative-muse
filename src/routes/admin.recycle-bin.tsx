import { useState, useEffect, useCallback } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { AdminLayout, AdminPageHeader, AdminLoading } from "@/components/admin/AdminLayout";
import { productsApi, type ProductWithImages } from "@/lib/api/products";
import { ImageOff, Trash2, RotateCcw, ExternalLink } from "lucide-react";

import { requireAdmin } from "@/lib/auth-guard";

export const Route = createFileRoute("/admin/recycle-bin")({
  beforeLoad: requireAdmin,
  component: RecycleBinPage,
});

function RecycleBinPage() {
  const [products, setProducts] = useState<ProductWithImages[]>([]);
  const [orderCounts, setOrderCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [restoringId, setRestoringId] = useState<string | null>(null);
  const [restoredName, setRestoredName] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const fetchBin = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await productsApi.list({ status: "archived", sort_by: "updated_at", sort_order: "desc", per_page: 100 });
      setProducts(result.data);
      const counts = await productsApi.previousOrderCounts(result.data.map((p) => p.id));
      setOrderCounts(counts);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load recycle bin");
      setProducts([]);
      setOrderCounts({});
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBin(); }, [fetchBin]);

  const handleRestore = async (p: ProductWithImages) => {
    if (restoringId) return;
    setRestoringId(p.id);
    setError(null);
    try {
      await productsApi.restoreProduct(p.id);
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      await queryClient.invalidateQueries({ queryKey: ["products", "published", "storefront"] });
      await queryClient.invalidateQueries({ queryKey: ["analytics"] });
      setProducts((prev) => prev.filter((x) => x.id !== p.id));
      setRestoredName(p.name);
      window.setTimeout(() => setRestoredName(null), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not restore product");
    } finally {
      setRestoringId(null);
    }
  };

  const formatDate = (iso: string | null) =>
    iso ? new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Recycle Bin"
        description={`${products.length} product${products.length === 1 ? "" : "s"} in the recycle bin`}
      />

      {restoredName && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          <RotateCcw className="h-4 w-4" />
          &ldquo;{restoredName}&rdquo; has been restored and is now active on the storefront.
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <p className="mb-4 text-xs text-gray-500">
        Recycled products are hidden from the storefront but stay safely stored in the database. Historical orders and
        order items are never deleted.
      </p>

      {loading ? (
        <AdminLoading />
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border border-gray-200 bg-white py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <Trash2 className="h-8 w-8 text-gray-400" />
          </div>
          <p className="mt-4 text-lg font-semibold text-gray-600">Recycle bin is empty</p>
          <p className="mt-1 text-sm text-gray-400">
            Products moved to the recycle bin from <Link to="/admin/products" className="text-[#9C544D] hover:underline">Products</Link> will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-600">Product</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-600">Category</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-600">Previous Orders</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-600">Removed Date</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((p) => {
                const imgUrl = p.main_image?.url || p.images?.[0]?.url;
                return (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                          {imgUrl ? (
                            <img src={imgUrl} alt={p.name} className="h-full w-full object-cover" loading="lazy"
                              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-gray-400"><ImageOff className="h-4 w-4" /></div>
                          )}
                        </div>
                        <span className="font-medium text-[#1a1a2e]">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{p.category_name || "—"}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[11px] font-semibold text-orange-700">
                        {(orderCounts[p.id] ?? 0)} order{(orderCounts[p.id] ?? 0) === 1 ? "" : "s"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">{formatDate(p.archived_at)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to="/admin/products/$id"
                          params={{ id: p.id }}
                          className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                          title="Edit"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleRestore(p)}
                          disabled={restoringId === p.id}
                          className="flex items-center gap-1.5 rounded-lg bg-[#1a1a2e] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#2d1b4e] disabled:opacity-50"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          {restoringId === p.id ? "Restoring..." : "Restore"}
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