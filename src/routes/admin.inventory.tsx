import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { inventoryApi } from "@/lib/api/inventory";
import { DataTable, StatusBadge, ConfirmDialog } from "@/components/admin/AdminTable";
import { Minus, History } from "lucide-react";

import { requireAdmin } from "@/lib/auth-guard";

export const Route = createFileRoute("/admin/inventory")({
  beforeLoad: requireAdmin,
  component: InventoryPage,
});

type InventoryRow = {
  id: string;
  product_name: string;
  quantity: number;
  threshold: number;
  status: string;
  price: number;
};

function InventoryPage() {
  const [data, setData] = useState<InventoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adjustProduct, setAdjustProduct] = useState<any | null>(null);
  const [adjustQty, setAdjustQty] = useState(0);
  const [adjustReason, setAdjustReason] = useState("");
  const [history, setHistory] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const d = await inventoryApi.list();
      setData(
        d.map((p: any) => ({
          id: p.id,
          product_name: p.name,
          quantity: p.stock_quantity ?? 0,
          threshold: p.low_stock_threshold ?? 5,
          status: p.status,
          price: p.current_price,
        })),
      );
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  };

  useEffect(() => {
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
    } catch (e: any) {
      alert(e.message);
    }
  };

  const loadHistory = async (productId: string) => {
    try {
      const h = await inventoryApi.getHistory(productId);
      setHistory(h || []);
      setShowHistory(true);
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <AdminLayout>
      <ConfirmDialog
        open={!!adjustProduct}
        onClose={() => setAdjustProduct(null)}
        onConfirm={handleAdjust}
        title={`Adjust stock: ${adjustProduct?.product_name || ""}`}
        message={`Current: ${adjustProduct?.quantity ?? 0}. Set to?`}
        confirmLabel="Adjust"
      />

      {showHistory && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setShowHistory(false)}
        >
          <div
            className="max-h-[70vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold text-[#1a1a2e]">Adjustment History</h2>
            {history.length > 0 ? (
              <div className="mt-4 space-y-3">
                {history.map((h, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg border border-gray-100 p-3"
                  >
                    <div>
                      <p className="text-sm font-medium">Qty: {h.quantity}</p>
                      <p className="text-xs text-gray-400">{h.reason || "—"}</p>
                    </div>
                    <p className="text-xs text-gray-400">
                      {new Date(h.created_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-gray-400">No adjustment history</p>
            )}
            <button
              onClick={() => setShowHistory(false)}
              className="mt-4 w-full rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-5">
          <DataTable
            data={data}
            loading={loading}
            error={error}
            keyField="id"
            emptyTitle="No inventory data"
            searchPlaceholder="Search products..."
            columns={[
              {
                key: "product_name",
                label: "Product",
                sortable: true,
                render: (row) => row.product_name,
              },
              {
                key: "quantity",
                label: "Stock",
                sortable: true,
                render: (row) => {
                  const value = row.quantity ?? 0;
                  const threshold = row.threshold ?? 5;
                  if (value <= 0)
                    return <span className="font-semibold text-red-600">{value}</span>;
                  if (value <= threshold) {
                    return <span className="font-semibold text-amber-600">{value}</span>;
                  }
                  return <span className="font-semibold text-green-600">{value}</span>;
                },
              },
              {
                key: "threshold",
                label: "Min",
                render: (row) => (
                  <span className="text-xs text-gray-400">{row.threshold ?? 5}</span>
                ),
              },
              {
                key: "actions",
                label: "",
                render: (row) => (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setAdjustProduct(row);
                        setAdjustQty(row.quantity ?? 0);
                        setAdjustReason("");
                      }}
                      className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-amber-600"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => loadHistory(row.id)}
                      className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-blue-500"
                    >
                      <History className="h-4 w-4" />
                    </button>
                  </div>
                ),
              },
            ]}
          />
        </div>

        <div className="lg:col-span-1">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="text-sm font-bold text-[#1a1a2e]">Stock Alerts</h2>
            <div className="mt-4 space-y-3">
              {data
                .filter((p) => (p.quantity ?? 0) <= (p.threshold ?? 5))
                .map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between rounded-lg border border-red-100 bg-red-50 p-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-red-700 truncate">{p.product_name}</p>
                      <p className="text-xs text-red-500">Stock: {p.quantity ?? 0}</p>
                    </div>
                  </div>
                ))}
              {data.filter((p) => (p.quantity ?? 0) <= (p.threshold ?? 5)).length === 0 && (
                <p className="text-sm text-gray-400">All products are well-stocked</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {adjustProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setAdjustProduct(null)}
        >
          <div
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold text-[#1a1a2e]">Adjust Stock</h2>
            <p className="mt-1 text-sm text-gray-500">{adjustProduct.product_name}</p>
            <p className="mt-2 text-xs text-gray-400">
              Current stock: <strong>{adjustProduct.quantity ?? 0}</strong>
            </p>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase">
                  New Quantity
                </label>
                <input
                  type="number"
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#9C544D]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase">
                  Reason
                </label>
                <input
                  type="text"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="e.g. stock count, return, damage..."
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#9C544D]"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setAdjustProduct(null)}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAdjust}
                className="rounded-lg bg-[#1a1a2e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2d1b4e]"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
