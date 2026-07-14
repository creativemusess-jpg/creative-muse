import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { analyticsApi } from "@/lib/api/analytics";
import { StatusBadge } from "@/components/admin/AdminTable";
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/admin/analytics")({
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [lowStock, setLowStock] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      analyticsApi.getDashboardMetrics(),
      analyticsApi.getLowStockProducts(10),
    ]).then(([m, l]) => {
      setMetrics(m);
      setLowStock(l);
      setLoading(false);
    }).catch((e) => { setError(e.message); setLoading(false); });
  }, []);

  if (loading) return <AdminLayout><div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-[#c9a96e] border-t-transparent" /></div></AdminLayout>;
  if (error) return <AdminLayout><div className="py-20 text-center text-red-500">{error}</div></AdminLayout>;

  const statCards = [
    { label: "Total Sales", value: `₹${(metrics?.totalSales ?? 0).toLocaleString("en-IN")}`, icon: <DollarSign className="h-6 w-6" />, color: "text-green-600" },
    { label: "Total Orders", value: String(metrics?.totalOrders ?? 0), icon: <ShoppingCart className="h-6 w-6" />, color: "text-blue-600" },
    { label: "Pending", value: String(metrics?.pendingOrders ?? 0), icon: <TrendingUp className="h-6 w-6" />, color: "text-amber-600" },
    { label: "Revenue (30d)", value: `₹${(metrics?.revenueMonth ?? 0).toLocaleString("en-IN")}`, icon: <TrendingDown className="h-6 w-6" />, color: "text-emerald-600" },
    { label: "Revenue (7d)", value: `₹${(metrics?.revenueWeek ?? 0).toLocaleString("en-IN")}`, icon: <TrendingDown className="h-6 w-6" />, color: "text-teal-600" },
    { label: "Revenue (today)", value: `₹${(metrics?.revenueToday ?? 0).toLocaleString("en-IN")}`, icon: <TrendingDown className="h-6 w-6" />, color: "text-indigo-600" },
    { label: "Avg Order Value", value: `₹${(metrics?.averageOrderValue ?? 0).toLocaleString("en-IN")}`, icon: <DollarSign className="h-6 w-6" />, color: "text-purple-600" },
    { label: "Total Customers", value: String(metrics?.totalCustomers ?? 0), icon: <Users className="h-6 w-6" />, color: "text-cyan-600" },
    { label: "Total Products", value: String(metrics?.totalProducts ?? 0), icon: <Package className="h-6 w-6" />, color: "text-orange-600" },
    { label: "Subscribers", value: String(metrics?.totalSubscribers ?? 0), icon: <Users className="h-6 w-6" />, color: "text-pink-600" },
  ];

  return (
    <AdminLayout>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {statCards.map((card) => (
          <div key={card.label} className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase text-gray-500">{card.label}</p>
                <p className={`mt-1 text-lg font-bold ${card.color}`}>{card.value}</p>
              </div>
              <div className="text-gray-300">{card.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="text-sm font-bold text-[#1a1a2e]">Top Products</h2>
          {metrics?.topProducts?.length > 0 ? (
            <div className="mt-4 divide-y divide-gray-100">
              {metrics.topProducts.map((p: any, i: number) => (
                <div key={p.id || i} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1a1a2e] text-xs font-bold text-white">{i + 1}</span>
                    <div>
                      <p className="text-sm font-medium text-[#1a1a2e]">{p.name || p.product_name || "Product"}</p>
                      <p className="text-xs text-gray-400">{p.total_sold || p.total_quantity || 0} sold</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-green-600">₹{(p.total_revenue || 0).toLocaleString("en-IN")}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-gray-400">No sales data</p>
          )}
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="flex items-center gap-2 text-sm font-bold text-[#1a1a2e]"><AlertTriangle className="h-4 w-4 text-amber-500" /> Low Stock Alerts</h2>
          {lowStock.length > 0 ? (
            <div className="mt-4 divide-y divide-gray-100">
              {lowStock.map((p: any) => (
                <div key={p.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-[#1a1a2e]">{p.name}</p>
                    <p className="text-xs text-gray-400">SKU: {p.sku || "—"}</p>
                  </div>
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${(p.stock_quantity ?? 0) <= 0 ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                    {(p.stock_quantity ?? 0) <= 0 ? "Out of stock" : `${p.stock_quantity ?? 0} left`}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-gray-400">All products well-stocked</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
