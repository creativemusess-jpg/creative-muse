import { useState, useEffect } from "react";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { AdminLayout, AdminPageHeader, AdminLoading } from "@/components/admin/AdminLayout";
import { analyticsApi, type DashboardMetrics } from "@/lib/api/analytics";
import { StatusBadge } from "@/components/admin/AdminTable";
import {
  Package, ShoppingCart, Users, Mail, TrendingUp, DollarSign, Clock,
  AlertTriangle, ArrowUpRight, Tag, Home,
} from "lucide-react";

export const Route = createFileRoute("/admin/")({
  beforeLoad: async () => {
    const { adminApi } = await import("@/lib/api/admin");
    const session = await adminApi.getSession();
    if (!session) throw redirect({ to: "/admin/login" });
  },
  component: AdminDashboard,
});

function AdminDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsApi.getDashboardMetrics().then(setMetrics).finally(() => setLoading(false));
  }, []);

  if (loading) return <AdminLayout><AdminLoading /></AdminLayout>;

  const m = metrics;

  const statCards = [
    { title: "Total Sales", value: `₹${(m?.totalSales ?? 0).toLocaleString("en-IN")}`, subtitle: `${m?.totalOrders ?? 0} orders`, icon: <DollarSign className="h-8 w-8" /> },
    { title: "Revenue Today", value: `₹${(m?.revenueToday ?? 0).toLocaleString("en-IN")}`, subtitle: "Today", icon: <TrendingUp className="h-8 w-8" /> },
    { title: "Revenue This Month", value: `₹${(m?.revenueThisMonth ?? 0).toLocaleString("en-IN")}`, subtitle: `${m?.totalOrders ?? 0} total orders`, icon: <Clock className="h-8 w-8" /> },
    { title: "Avg. Order Value", value: `₹${Math.round(m?.averageOrderValue ?? 0).toLocaleString("en-IN")}`, icon: <ArrowUpRight className="h-8 w-8" /> },
    { title: "Active Products", value: String(m?.activeProducts ?? 0), subtitle: `${m?.draftProducts ?? 0} draft · ${m?.archivedProducts ?? 0} in recycle bin`, icon: <Package className="h-8 w-8" /> },
    { title: "Orders", value: String(m?.totalOrders ?? 0), subtitle: `${m?.pendingOrders ?? 0} pending`, icon: <ShoppingCart className="h-8 w-8" /> },
    { title: "Customers", value: String(m?.totalCustomers ?? 0), icon: <Users className="h-8 w-8" /> },
    { title: "Newsletter", value: String(m?.subscriberCount ?? 0), subtitle: "subscribers", icon: <Mail className="h-8 w-8" /> },
  ];

  const pendingFulfillment = (m?.unfulfilledOrders ?? 0) + (m?.pendingOrders ?? 0);
  const needsAttention = pendingFulfillment > 0 || (m?.outOfStockProducts ?? 0) > 0;

  return (
    <AdminLayout>
      <AdminPageHeader title="Dashboard" description="Store overview" />

      {needsAttention && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-500 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-amber-800">Items needing attention</p>
              <div className="mt-1 flex flex-wrap gap-3 text-xs text-amber-700">
                {m!.pendingOrders > 0 && <span>{m!.pendingOrders} pending orders</span>}
                {m!.unfulfilledOrders > 0 && <span>{m!.unfulfilledOrders} unfulfilled orders</span>}
                {(m!.outOfStockProducts ?? 0) > 0 && <span>{m!.outOfStockProducts} out-of-stock products</span>}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.title} className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{card.title}</p>
                <p className="mt-1 text-2xl font-bold text-[#1a1a2e]">{card.value}</p>
                {card.subtitle && <p className="mt-1 text-xs text-gray-400">{card.subtitle}</p>}
              </div>
              <div className="text-gray-300">{card.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-100 px-5 py-4">
            <h2 className="text-sm font-bold text-[#1a1a2e]">Order Status</h2>
          </div>
          <div className="grid grid-cols-3 gap-4 p-5">
            {[
              { label: "Pending", count: m?.pendingOrders ?? 0, color: "text-amber-600" },
              { label: "Paid", count: m?.paidOrders ?? 0, color: "text-blue-600" },
              { label: "Fulfilled", count: m?.fulfilledOrders ?? 0, color: "text-green-600" },
              { label: "Delivered", count: m?.deliveredOrders ?? 0, color: "text-emerald-600" },
              { label: "Cancelled", count: m?.cancelledOrders ?? 0, color: "text-red-600" },
              { label: "Refunded", count: m?.refundedOrders ?? 0, color: "text-purple-600" },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <p className={`text-2xl font-bold ${item.color}`}>{item.count}</p>
                <p className="text-xs text-gray-500">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-100 px-5 py-4">
            <h2 className="text-sm font-bold text-[#1a1a2e]">Top Products</h2>
          </div>
          <div className="p-5">
            {(m?.topProducts?.length ?? 0) > 0 ? (
              <div className="space-y-3">
                {m!.topProducts.map((p, i) => (
                  <div key={p.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-500">{i + 1}</span>
                      <span className="text-sm font-medium text-[#1a1a2e]">{p.name}</span>
                    </div>
                    <div className="text-right text-xs text-gray-500">
                      <p className="font-medium">{p.sales} sold</p>
                      <p>₹{p.revenue.toLocaleString("en-IN")}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No sales data yet</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <h2 className="text-sm font-bold text-[#1a1a2e]">Recent Orders</h2>
            <Link to="/admin/orders" className="text-xs font-medium text-[#7A2533] hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-gray-100">
            {(m?.recentOrders?.length ?? 0) > 0 ? m!.recentOrders.slice(0, 5).map((o: any) => (
              <Link key={o.id} to="/admin/orders/$id" params={{ id: o.id }} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50">
                <div>
                  <p className="text-sm font-medium text-[#1a1a2e]">{o.order_number || `#${o.id.slice(0, 8)}`}</p>
                  <p className="text-xs text-gray-400">{o.customer_name || "Guest"} · {new Date(o.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={o.status} />
                  <span className="text-sm font-medium">₹{(o.total_amount ?? 0).toLocaleString("en-IN")}</span>
                </div>
              </Link>
            )) : (
              <div className="px-5 py-8 text-center text-sm text-gray-400">No orders yet</div>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <h2 className="text-sm font-bold text-[#1a1a2e]">Recent Customers</h2>
            <Link to="/admin/customers" className="text-xs font-medium text-[#7A2533] hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-gray-100">
            {(m?.recentCustomers?.length ?? 0) > 0 ? m!.recentCustomers.slice(0, 5).map((c: any) => (
              <Link key={c.id} to="/admin/customers/$id" params={{ id: c.id }} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1a1a2e] text-xs font-bold text-white">
                    {(c.full_name || c.email || "?").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1a1a2e]">{c.full_name || "—"}</p>
                    <p className="text-xs text-gray-400">{c.email || "—"}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">{new Date(c.created_at).toLocaleDateString()}</span>
              </Link>
            )) : (
              <div className="px-5 py-8 text-center text-sm text-gray-400">No customers yet</div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="text-sm font-bold text-[#1a1a2e]">Quick Actions</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: <Package className="h-4 w-4" />, label: "Add Product", href: "/admin/products/new", desc: "Create a new product" },
            { icon: <ShoppingCart className="h-4 w-4" />, label: "View Orders", href: "/admin/orders", desc: "Manage orders" },
            { icon: <Tag className="h-4 w-4" />, label: "Add Coupon", href: "/admin/coupons", desc: "Create a discount" },
            { icon: <Home className="h-4 w-4" />, label: "Edit Homepage", href: "/admin/homepage", desc: "Update homepage" },
          ].map((a) => (
            <Link key={a.label} to={a.href as any} className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 transition-colors hover:border-[#7A2533]">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#fdf8f3] text-[#7A2533]">
                {a.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1a1a2e]">{a.label}</p>
                <p className="text-xs text-gray-400">{a.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
