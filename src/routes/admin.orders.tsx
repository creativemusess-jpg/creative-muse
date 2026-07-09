import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout, AdminPageHeader, AdminTable, AdminLoading, AdminEmpty } from "@/components/admin/AdminLayout";
import { ordersApi } from "@/lib/api/orders";
import type { OrderRow } from "@/lib/db/types";
import { Search, Eye } from "lucide-react";

export const Route = createFileRoute("/admin/orders")({
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
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<OrderRow | null>(null);

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

  return (
    <AdminLayout>
      <AdminPageHeader title="Orders" description={`${count} orders total`} />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search orders..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-sm outline-none focus:border-[#c9a96e]" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#c9a96e]">
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
                  <td className="px-4 py-3 font-medium text-[#1a1a2e]">#{order.order_number}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{order.customer_name || "—"}</p>
                    <p className="text-xs text-gray-500">{order.customer_email}</p>
                  </td>
                  <td className="px-4 py-3 font-medium">{formatPrice(order.total_amount)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${order.payment_status === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                        {order.payment_status}
                      </span>
                      <span className="inline-block rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-semibold text-purple-700 uppercase">
                        Demo
                      </span>
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
                    <button onClick={() => setSelectedOrder(order)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100">
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedOrder(null)}>
          <div className="max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-[#1a1a2e]">Order #{selectedOrder.order_number}</h3>
              <span className="rounded-full bg-purple-100 px-2.5 py-1 text-[10px] font-semibold text-purple-700 uppercase">Demo Payment</span>
            </div>
            <div className="mt-4 space-y-3 text-sm">
              <div><span className="text-gray-500">Customer:</span> <span className="font-medium">{selectedOrder.customer_name || selectedOrder.customer_email}</span></div>
              <div><span className="text-gray-500">Phone:</span> <span className="font-medium">{selectedOrder.customer_phone || "—"}</span></div>
              <div><span className="text-gray-500">Payment Status:</span> <span className="font-medium capitalize">{selectedOrder.payment_status}</span></div>
              <div><span className="text-gray-500">Payment Method:</span> <span className="font-medium capitalize">{selectedOrder.payment_method || "—"}</span></div>
              <div><span className="text-gray-500">Order Status:</span> <span className="font-medium capitalize">{selectedOrder.order_status.replace(/_/g, " ")}</span></div>
              <div><span className="text-gray-500">Date:</span> <span className="font-medium">{new Date(selectedOrder.created_at).toLocaleString()}</span></div>
              {selectedOrder.coupon_code && (
                <div><span className="text-gray-500">Coupon:</span> <span className="font-medium text-green-700">{selectedOrder.coupon_code} (-{formatPrice(selectedOrder.discount_amount || 0)})</span></div>
              )}
              {selectedOrder.tracking_id && (
                <div><span className="text-gray-500">Tracking:</span> <span className="font-medium">{selectedOrder.tracking_id}</span></div>
              )}
              <div className="border-t border-gray-100 pt-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Pricing Breakdown</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs"><span>Subtotal</span><span>{formatPrice(selectedOrder.subtotal || 0)}</span></div>
                  {selectedOrder.discount_amount > 0 && (
                    <div className="flex justify-between text-xs text-green-700"><span>Discount</span><span>-{formatPrice(selectedOrder.discount_amount)}</span></div>
                  )}
                  <div className="flex justify-between text-xs"><span>Shipping</span><span>{selectedOrder.shipping_amount === 0 || !selectedOrder.shipping_amount ? "Free" : formatPrice(selectedOrder.shipping_amount)}</span></div>
                  {selectedOrder.tax_amount > 0 && (
                    <div className="flex justify-between text-xs"><span>Tax</span><span>{formatPrice(selectedOrder.tax_amount)}</span></div>
                  )}
                  <div className="flex justify-between border-t border-dashed border-gray-200 pt-1 text-sm font-bold"><span>Total</span><span>{formatPrice(selectedOrder.total_amount)}</span></div>
                </div>
              </div>
            </div>
            <button onClick={() => setSelectedOrder(null)} className="mt-6 w-full rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200">
              Close
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
