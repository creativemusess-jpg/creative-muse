import { useState, useEffect } from "react";
import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { AdminLayout, AdminPageHeader, AdminLoading, AdminEmpty } from "@/components/admin/AdminLayout";
import { ordersApi } from "@/lib/api/orders";
import type { OrderRow } from "@/lib/db/types";
import { Search, Eye } from "lucide-react";

import { requireAdmin } from "@/lib/auth-guard";

export const Route = createFileRoute("/admin/orders")({
  beforeLoad: requireAdmin,
  component: AdminOrders,
});

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  processing: "bg-indigo-100 text-indigo-700",
  shipped: "bg-purple-100 text-purple-700",
  out_for_delivery: "bg-orange-100 text-orange-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-600",
  returned: "bg-gray-100 text-gray-600",
  refunded: "bg-pink-100 text-pink-700",
};

function AdminOrders() {
  const location = useLocation();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const result = await ordersApi.list({ search: search || undefined, status: statusFilter || undefined });
      setOrders(result.data);
      setCount(result.count);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, [search, statusFilter]);

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await ordersApi.updateStatus(id, status);
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const formatPrice = (n: number) => "₹" + n.toLocaleString("en-IN");

  if (location.pathname !== "/admin/orders") return <Outlet />;

  return (
    <AdminLayout>
      <AdminPageHeader title="Orders" description={`${count} orders total`} />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search orders..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-sm outline-none focus:border-[#7A2533]" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]">
          <option value="">All Status</option>
          {Object.keys(statusColors).map((s) => (
            <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <AdminLoading />
      ) : orders.length === 0 ? (
        <AdminEmpty title="No orders yet" description="Orders will appear here when customers make purchases" />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
              <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Order</th>
                <th className="px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Customer</th>
                <th className="px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Products</th>
                <th className="px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Payment</th>
                <th className="px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Method</th>
                <th className="px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-[#1a1a2e]">
  <Link to="/admin/orders/$id" params={{ id: order.id }} className="hover:text-[#7A2533]">#{order.order_number}</Link>
</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{order.customer_name || order.customer_email?.split("@")[0] || "—"}</p>
                      <p className="text-xs text-gray-500">{order.customer_email}</p>
                    </td>
                    <td className="px-4 py-3">
                      {(order as any)._items?.length > 0 ? (
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-2">
                            {(order as any)._items.slice(0, 3).map((item: any, i: number) => (
                              <div key={i} className="h-8 w-8 overflow-hidden rounded-full border-2 border-white bg-gray-100">
                                {item.productImage ? (
                                  <img src={item.productImage} alt={item.productName} className="h-full w-full object-contain p-0.5" />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center text-[10px] text-gray-400">{item.productName?.[0] || "?"}</div>
                                )}
                              </div>
                            ))}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-gray-900 max-w-[140px]">{(order as any)._items[0].productName}</p>
                            {(order as any)._items.length > 1 && (
                              <p className="text-[11px] text-gray-500">+{(order as any)._items.length - 1} more</p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium">{formatPrice(order.total_amount)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${order.payment_status === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                        {order.payment_status}
                      </span>
                      {order.payment_method === "test" && (
                        <span className="inline-block rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-semibold text-purple-700 uppercase">Test</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs capitalize text-gray-500">{order.payment_method || "—"}</td>
                  <td className="px-4 py-3">
                    <select
                      value={order.order_status}
                      onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase outline-none ${statusColors[order.order_status] || "bg-gray-100 text-gray-600"}`}
                    >
                      {Object.keys(statusColors).map((s) => (
                        <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <Link to="/admin/orders/$id" params={{ id: order.id }} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-[#7A2533]" aria-label="View order details">
                      <Eye className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
