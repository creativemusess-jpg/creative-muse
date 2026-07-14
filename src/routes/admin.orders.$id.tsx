import { useState, useEffect } from "react";
import { createFileRoute, Link, useParams, useNavigate } from "@tanstack/react-router";
import { AdminLayout, AdminPageHeader, AdminLoading } from "@/components/admin/AdminLayout";
import { ordersApi } from "@/lib/api/orders";
import { StatusBadge, ConfirmDialog } from "@/components/admin/AdminTable";
import { ArrowLeft, Package, Truck, CreditCard, User, Clock, MessageSquare, Send } from "lucide-react";

export const Route = createFileRoute("/admin/orders/$id")({
  component: OrderDetailPage,
});

function OrderDetailPage() {
  const { id } = useParams({ from: "/admin/orders/$id" });
  const navigate = useNavigate();
  const [data, setData] = useState<{ order: any; items: any[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusConfirm, setStatusConfirm] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [timeline, setTimeline] = useState<any[]>([]);

  useEffect(() => {
    ordersApi.getById(id).then((d) => {
      setData(d);
      if (d) buildTimeline(d.order);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  const buildTimeline = (order: any) => {
    const events: any[] = [
      { event: "Order created", description: "Order was placed", date: order.created_at, isSystem: true },
    ];
    if (order.fulfillment_status === "fulfilled") {
      events.push({ event: "Order fulfilled", description: `Fulfilled via ${order.courier || "standard"}`, date: order.updated_at, isSystem: true });
    }
    if (order.status === "delivered") {
      events.push({ event: "Order delivered", description: "Delivered to customer", date: order.updated_at, isSystem: true });
    }
    if (order.status === "cancelled") {
      events.push({ event: "Order cancelled", description: "Cancelled by admin", date: order.updated_at, isSystem: true });
    }
    setTimeline(events);
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!data) return;
    try {
      await ordersApi.updateStatus(id, newStatus);
      const updated = await ordersApi.getById(id);
      setData(updated);
      if (updated) buildTimeline(updated.order);
      setStatusConfirm(null);
    } catch (err) { console.error(err); }
  };

  const handleAddNote = () => {
    if (!note.trim()) return;
    setTimeline((prev) => [...prev, {
      event: "Admin comment",
      description: note,
      date: new Date().toISOString(),
      isSystem: false,
    }]);
    setNote("");
  };

  if (loading) return <AdminLayout><AdminLoading /></AdminLayout>;
  if (!data) return <AdminLayout><div className="text-center py-20 text-gray-500">Order not found</div></AdminLayout>;

  const { order, items } = data;
  const subtotal = items.reduce((s: number, i: any) => s + (i.total_price || 0), 0);
  const total = order.total_amount || subtotal;

  return (
    <AdminLayout>
      <ConfirmDialog
        open={!!statusConfirm}
        onClose={() => setStatusConfirm(null)}
        onConfirm={() => handleStatusUpdate(statusConfirm!)}
        title={`Change status to "${statusConfirm?.replace(/_/g, " ")}"?`}
        message="This will update the order status"
        confirmLabel="Update"
      />

      <div className="mb-4">
        <Link to="/admin/orders" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#c9a96e]">
          <ArrowLeft className="h-4 w-4" /> Orders
        </Link>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#1a1a2e]">{order.order_number || `Order #${id.slice(0, 8)}`}</h1>
            <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleString()}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={order.status || "pending"} size="md" />
            {order.payment_status && <StatusBadge status={order.payment_status} size="md" />}
            {order.fulfillment_status && <StatusBadge status={order.fulfillment_status} size="md" />}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white">
            <div className="border-b border-gray-100 px-5 py-4">
              <h2 className="flex items-center gap-2 text-sm font-bold text-[#1a1a2e]"><Package className="h-4 w-4" /> Order Items</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {items.map((item: any, i: number) => (
                <div key={i} className="flex items-center gap-4 px-5 py-4">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    {item.product_image ? (
                      <img src={item.product_image} alt={item.product_name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-400"><Package className="h-5 w-5" /></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1a1a2e]">{item.product_name || "Product"}</p>
                    <p className="text-xs text-gray-400">SKU: {item.product_sku || "—"} · Qty: {item.quantity || 1}</p>
                  </div>
                  <p className="text-sm font-medium">₹{(item.total_price || 0).toLocaleString("en-IN")}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 px-5 py-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium">₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              {order.discount_amount > 0 && (
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-500">Discount</span>
                  <span className="font-medium text-green-600">-₹{order.discount_amount.toLocaleString("en-IN")}</span>
                </div>
              )}
              {order.shipping_cost > 0 && (
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-500">Shipping</span>
                  <span className="font-medium">₹{order.shipping_cost.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold mt-2 pt-2 border-t border-gray-100">
                <span>Total</span>
                <span>₹{total.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white">
            <div className="border-b border-gray-100 px-5 py-4">
              <h2 className="flex items-center gap-2 text-sm font-bold text-[#1a1a2e]"><Clock className="h-4 w-4" /> Timeline</h2>
            </div>
            <div className="px-5 py-4">
              <div className="space-y-4">
                {timeline.map((event, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`flex h-6 w-6 items-center justify-center rounded-full ${event.isSystem ? "bg-[#1a1a2e] text-white" : "bg-amber-100 text-amber-700"}`}>
                        <div className="h-2 w-2 rounded-full bg-current" />
                      </div>
                      {i < timeline.length - 1 && <div className="mt-1 w-px flex-1 bg-gray-200" />}
                    </div>
                    <div className="pb-4">
                      <p className="text-sm font-medium text-[#1a1a2e]">{event.event}</p>
                      <p className="text-xs text-gray-500">{event.description}</p>
                      <p className="text-[10px] text-gray-400">{new Date(event.date).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex gap-2">
                <input
                  type="text" value={note} onChange={(e) => setNote(e.target.value)}
                  placeholder="Add an internal note..."
                  className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#c9a96e]"
                  onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
                />
                <button onClick={handleAddNote} className="rounded-lg bg-[#1a1a2e] px-3 py-2 text-white hover:bg-[#2d1b4e]">
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white">
            <div className="border-b border-gray-100 px-5 py-4">
              <h2 className="flex items-center gap-2 text-sm font-bold text-[#1a1a2e]"><Truck className="h-4 w-4" /> Fulfillment</h2>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Status</span>
                <StatusBadge status={order.fulfillment_status || "unfulfilled"} />
              </div>
              {order.tracking_id && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tracking</span>
                  <span className="font-medium">{order.tracking_id}</span>
                </div>
              )}
              <div className="flex flex-wrap gap-2 pt-2">
                <button onClick={() => handleStatusUpdate("fulfilled")} className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700">Mark Fulfilled</button>
                <button onClick={() => handleStatusUpdate("delivered")} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700">Mark Delivered</button>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white">
            <div className="border-b border-gray-100 px-5 py-4">
              <h2 className="flex items-center gap-2 text-sm font-bold text-[#1a1a2e]"><CreditCard className="h-4 w-4" /> Payment</h2>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Status</span>
                <StatusBadge status={order.payment_status || "pending"} />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Method</span>
                <span className="font-medium">{order.payment_method || "—"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total</span>
                <span className="font-bold">₹{total.toLocaleString("en-IN")}</span>
              </div>
              {order.payment_status !== "paid" && (
                <button onClick={() => setStatusConfirm("paid")} className="w-full rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700">Mark Paid</button>
              )}
              {order.status !== "cancelled" && (
                <button onClick={() => setStatusConfirm("cancelled")} className="w-full rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50">Cancel Order</button>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white">
            <div className="border-b border-gray-100 px-5 py-4">
              <h2 className="flex items-center gap-2 text-sm font-bold text-[#1a1a2e]"><User className="h-4 w-4" /> Customer</h2>
            </div>
            <div className="p-5 space-y-3">
              <p className="text-sm font-medium text-[#1a1a2e]">{order.customer_name || "Guest"}</p>
              <p className="text-xs text-gray-500">{order.customer_email || "—"}</p>
              {order.customer_phone && <p className="text-xs text-gray-500">{order.customer_phone}</p>}
              {order.shipping_address && (
                <div className="mt-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase">Shipping</p>
                  <p className="mt-1 text-sm text-gray-600 whitespace-pre-line">{order.shipping_address}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
