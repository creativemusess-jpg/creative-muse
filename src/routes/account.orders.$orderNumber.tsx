import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Package, ChevronLeft } from "lucide-react";
import { PageShell } from "@/components/site/PageHeader";
import { useAuth } from "@/lib/auth";
import { storefrontSupabase } from "@/lib/supabase-storefront";
import { normalizeOrderItems } from "@/lib/api/order-items";
import type { NormalizedOrderItem } from "@/lib/api/order-items";

export const Route = createFileRoute("/account/orders/$orderNumber")({
  head: ({ params }) => ({ meta: [{ title: `Order #${params.orderNumber} — Creative Muse` }] }),
  component: AccountOrderDetailPage,
});

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  processing: "bg-indigo-100 text-indigo-700",
  shipped: "bg-purple-100 text-purple-700",
  out_for_delivery: "bg-orange-100 text-orange-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-600",
};

function AccountOrderDetailPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { orderNumber } = useParams({ from: "/account/orders/$orderNumber" });
  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<NormalizedOrderItem[]>([]);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/login", search: { redirect: `/account/orders/${orderNumber}` } });
    }
  }, [user, loading, navigate, orderNumber]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setPageLoading(true);
      const { data: orderData } = await (storefrontSupabase as any)
        .from("orders")
        .select("*")
        .eq("order_number", orderNumber)
        .eq("customer_id", user.id)
        .maybeSingle();
      setOrder(orderData);
      if (orderData) {
        const { data: itemsData } = await (storefrontSupabase as any)
          .from("order_items")
          .select("*")
          .eq("order_id", orderData.id);
        setItems(normalizeOrderItems(itemsData || []));
      }
      setPageLoading(false);
    })();
  }, [user, orderNumber]);

  if (loading || !user) {
    return (
      <PageShell>
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#C9A96E] border-t-transparent" />
        </div>
      </PageShell>
    );
  }

  const formatPrice = (n: number) => "₹" + n.toLocaleString("en-IN");

  if (pageLoading) {
    return (
      <PageShell>
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#C9A96E] border-t-transparent" />
        </div>
      </PageShell>
    );
  }

  if (!order) {
    return (
      <PageShell>
        <section className="mx-auto max-w-[900px] px-6 py-16">
          <div className="rounded-[24px] bg-white p-10 text-center shadow-[0_4px_24px_rgba(0,0,0,0.05)]">
            <Package className="mx-auto h-10 w-10 text-[#C9A96E]" />
            <h2 className="font-display mt-4 text-xl font-semibold text-[#1a1a2e]">Order not found</h2>
            <p className="mt-2 text-sm text-[#7a6e64]">We couldn't find this order. Please check the order number.</p>
            <Link to="/account/orders" className="btn-primary mt-6 inline-flex">
              View All Orders
            </Link>
          </div>
        </section>
      </PageShell>
    );
  }

  const delivery = order.delivery_address || {};

  return (
    <PageShell>
      <section className="mx-auto max-w-[900px] px-6 py-16">
        <div className="mb-8">
          <p className="eyebrow text-[10px]">Order</p>
          <h1 className="font-display text-3xl font-semibold text-[#1a1a2e]">Order #{orderNumber}</h1>
          <p className="mt-1 text-sm text-[#7a6e64]">
            <Link to="/account/orders" className="text-[#C9A96E] hover:underline">← All Orders</Link>
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-6 md:col-span-2">
            <div className="rounded-[24px] bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.05)]">
              <h2 className="font-display mb-4 text-lg font-semibold text-[#1a1a2e]">Items</h2>
              <div className="space-y-4">
                {items.map((item: any) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[12px] bg-[#fdf8f3]">
                      {item.productImage && (
                        <img src={item.productImage} alt={item.productName} className="h-full w-full object-contain p-1" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-sm font-semibold text-[#1a1a2e]">{item.productName}</p>
                      <p className="text-xs text-[#7a6e64]">SKU: {item.sku || "—"}</p>
                      <p className="mt-1 text-xs text-[#7a6e64]">Qty: {item.quantity} × {formatPrice(item.unitPrice)}</p>
                      <p className="font-semibold text-[#1a1a2e]">{formatPrice(item.lineTotal)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.05)]">
              <h2 className="font-display mb-4 text-lg font-semibold text-[#1a1a2e]">Delivery Address</h2>
              <div className="space-y-1 text-sm text-[#7a6e64]">
                <p className="font-medium text-[#1a1a2e]">{delivery.addressLine1}</p>
                {delivery.addressLine2 && <p>{delivery.addressLine2}</p>}
                <p>{delivery.city}, {delivery.state} — {delivery.postalCode}</p>
                {delivery.landmark && <p>Landmark: {delivery.landmark}</p>}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[24px] bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.05)]">
              <h2 className="font-display mb-4 text-lg font-semibold text-[#1a1a2e]">Status</h2>
              <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase ${statusColors[order.order_status] || "bg-gray-100 text-gray-600"}`}>
                {order.order_status.replace(/_/g, " ")}
              </span>
              <p className="mt-4 text-xs text-[#7a6e64]">
                Placed on {new Date(order.created_at).toLocaleDateString()}
              </p>
            </div>

            <div className="rounded-[24px] bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.05)]">
              <h2 className="font-display mb-4 text-lg font-semibold text-[#1a1a2e]">Payment</h2>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-[#7a6e64]">Method</span><span className="capitalize">{order.payment_method || "—"}</span></div>
                <div className="flex justify-between"><span className="text-[#7a6e64]">Status</span><span className={`capitalize ${order.payment_status === "paid" ? "text-green-700" : "text-yellow-700"}`}>{order.payment_status}</span></div>
              </div>
            </div>

            <div className="rounded-[24px] bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.05)]">
              <h2 className="font-display mb-4 text-lg font-semibold text-[#1a1a2e]">Order Total</h2>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-[#7a6e64]">Subtotal</span><span>{formatPrice(order.subtotal || 0)}</span></div>
                {order.discount_amount > 0 && (
                  <div className="flex justify-between text-green-700"><span>Discount</span><span>-{formatPrice(order.discount_amount)}</span></div>
                )}
                <div className="flex justify-between"><span className="text-[#7a6e64]">Shipping</span><span>{order.shipping_amount === 0 || !order.shipping_amount ? "Free" : formatPrice(order.shipping_amount)}</span></div>
                <div className="flex justify-between border-t border-dashed border-[#e0d8cc] pt-1 font-bold text-[#1a1a2e]"><span>Total</span><span>{formatPrice(order.total_amount)}</span></div>
              </div>
            </div>

            {order.tracking_id && (
              <div className="rounded-[24px] bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.05)]">
                <h2 className="font-display mb-2 text-lg font-semibold text-[#1a1a2e]">Tracking</h2>
                <p className="text-sm text-[#7a6e64]">ID: {order.tracking_id}</p>
                {order.courier && <p className="text-xs text-[#7a6e64]">Courier: {order.courier}</p>}
              </div>
            )}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
