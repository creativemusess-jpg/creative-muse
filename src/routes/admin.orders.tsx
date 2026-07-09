import { useState, useEffect, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout, AdminPageHeader, AdminTable, AdminLoading, AdminEmpty } from "@/components/admin/AdminLayout";
import { ordersApi } from "@/lib/api/orders";
import type { OrderRow } from "@/lib/db/types";
import { Search, Eye, Package, X } from "lucide-react";

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
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [orderDetail, setOrderDetail] = useState<{ order: any; items: any[] } | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

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

  const openOrderDetail = useCallback(async (id: string) => {
    setSelectedOrderId(id);
    setDetailLoading(true);
    try {
      const result = await ordersApi.getById(id);
      setOrderDetail(result);
    } catch (err) {
      console.error(err);
      setOrderDetail(null);
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const closeOrderDetail = useCallback(() => {
    setSelectedOrderId(null);
    setOrderDetail(null);
  }, []);

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
                  <td className="px-4 py-3 font-medium text-[#1a1a2e]">#{order.order_number}</td>
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
                    <button onClick={() => openOrderDetail(order.id)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100" aria-label="View order details">
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={closeOrderDetail}>
          <div className="max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-[#1a1a2e]">
                Order #{orderDetail?.order?.order_number || "..."}
              </h3>
              <button onClick={closeOrderDetail} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            {detailLoading ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#C9A96E] border-t-transparent" />
              </div>
            ) : orderDetail ? (
              <>
                <div className="mt-4 space-y-4 text-sm">
                  <div className="grid grid-cols-2 gap-3 rounded-lg bg-gray-50 p-4">
                    <div><span className="text-gray-500">Customer:</span> <span className="font-medium">{orderDetail.order.customer_name || orderDetail.order.customer_email}</span></div>
                    <div><span className="text-gray-500">Phone:</span> <span className="font-medium">{orderDetail.order.customer_phone || "—"}</span></div>
                    <div><span className="text-gray-500">Payment:</span> <span className={`font-medium capitalize ${orderDetail.order.payment_status === "paid" ? "text-green-700" : "text-yellow-700"}`}>{orderDetail.order.payment_status}</span></div>
                    <div><span className="text-gray-500">Method:</span> <span className="font-medium capitalize">{orderDetail.order.payment_method || "—"}</span></div>
                    <div><span className="text-gray-500">Status:</span> <span className="font-medium capitalize">{orderDetail.order.order_status.replace(/_/g, " ")}</span></div>
                    <div><span className="text-gray-500">Date:</span> <span className="font-medium">{new Date(orderDetail.order.created_at).toLocaleString()}</span></div>
                  </div>

                  {orderDetail.items.length > 0 && (
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Purchased Products ({orderDetail.items.length})
                      </p>
                      <div className="divide-y divide-gray-200 rounded-lg bg-gray-50">
                        {orderDetail.items.map((item: any) => (
                          <div key={item.id} className="flex gap-3 p-3 first:rounded-t-lg last:rounded-b-lg">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white">
                              {item.productImage ? (
                                <img src={item.productImage} alt={item.productName} className="h-full w-full object-contain p-1" />
                              ) : (
                                <Package className="h-6 w-6 text-gray-300" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-gray-900">{item.productName}</p>
                              <p className="text-xs text-gray-500">SKU: {item.sku || "—"}</p>
                              <div className="mt-1 flex items-center justify-between">
                                <span className="text-xs text-gray-500">Qty: {item.quantity} × {formatPrice(item.unitPrice)}</span>
                                <span className="font-semibold text-[#1a1a2e]">{formatPrice(item.lineTotal)}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-1 rounded-lg bg-gray-50 p-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Pricing Breakdown</p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs"><span>Subtotal</span><span>{formatPrice(orderDetail.order.subtotal || 0)}</span></div>
                      {orderDetail.order.discount_amount > 0 && (
                        <div className="flex justify-between text-xs text-green-700"><span>Discount ({orderDetail.order.coupon_code || ""})</span><span>-{formatPrice(orderDetail.order.discount_amount)}</span></div>
                      )}
                      <div className="flex justify-between text-xs"><span>Shipping</span><span>{orderDetail.order.shipping_amount === 0 || !orderDetail.order.shipping_amount ? "Free" : formatPrice(orderDetail.order.shipping_amount)}</span></div>
                      {orderDetail.order.tax_amount > 0 && (
                        <div className="flex justify-between text-xs"><span>Tax</span><span>{formatPrice(orderDetail.order.tax_amount)}</span></div>
                      )}
                      <div className="flex justify-between border-t border-dashed border-gray-200 pt-1 text-sm font-bold"><span>Total</span><span>{formatPrice(orderDetail.order.total_amount)}</span></div>
                    </div>
                  </div>

                  {orderDetail.order.tracking_id && (
                    <div className="rounded-lg bg-gray-50 p-3">
                      <span className="text-gray-500">Tracking:</span> <span className="font-medium">{orderDetail.order.tracking_id}</span>
                      {orderDetail.order.courier && <span className="ml-2 text-xs text-gray-500">via {orderDetail.order.courier}</span>}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="py-8 text-center text-sm text-gray-500">Failed to load order details.</div>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
