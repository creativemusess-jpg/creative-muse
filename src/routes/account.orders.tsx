import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Package, ChevronRight } from "lucide-react";
import { PageShell } from "@/components/site/PageHeader";
import { useAuth } from "@/lib/auth";
import { storefrontSupabase } from "@/lib/supabase-storefront";

export const Route = createFileRoute("/account/orders")({
  head: () => ({ meta: [{ title: "My Orders — Creative Muse" }] }),
  component: AccountOrdersPage,
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

function AccountOrdersPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/login", search: { redirect: "/account/orders" } });
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setOrdersLoading(true);
      const { data } = await (storefrontSupabase as any)
        .from("orders")
        .select("*")
        .eq("customer_id", user.id)
        .order("created_at", { ascending: false });
      setOrders(data || []);
      setOrdersLoading(false);
    })();
  }, [user]);

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

  return (
    <PageShell>
      <section className="mx-auto max-w-[900px] px-6 py-16">
        <div className="mb-8">
          <p className="eyebrow text-[10px]">Orders</p>
          <h1 className="font-display text-3xl font-semibold text-[#1a1a2e]">My Orders</h1>
          <p className="mt-1 text-sm text-[#7a6e64]">
            <Link to="/account" className="text-[#C9A96E] hover:underline">← Back to Account</Link>
          </p>
        </div>

        {ordersLoading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#C9A96E] border-t-transparent" />
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-[24px] bg-white p-10 text-center shadow-[0_4px_24px_rgba(0,0,0,0.05)]">
            <Package className="mx-auto h-10 w-10 text-[#C9A96E]" />
            <h2 className="font-display mt-4 text-xl font-semibold text-[#1a1a2e]">No orders yet</h2>
            <p className="mt-2 text-sm text-[#7a6e64]">Place your first order and it will appear here.</p>
            <Link to="/shop" className="btn-primary mt-6 inline-flex">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                to="/account/orders/$orderNumber"
                params={{ orderNumber: order.order_number }}
                className="flex items-center gap-4 rounded-[24px] bg-white p-5 shadow-[0_4px_24px_rgba(0,0,0,0.05)] transition-colors hover:bg-[#f5efe8]"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#fdf8f3]">
                  <Package className="h-6 w-6 text-[#C9A96E]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-display font-semibold text-[#1a1a2e]">#{order.order_number}</p>
                  <p className="text-xs text-[#7a6e64]">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[#1a1a2e]">{formatPrice(order.total_amount)}</p>
                  <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${statusColors[order.order_status] || "bg-gray-100 text-gray-600"}`}>
                    {order.order_status.replace(/_/g, " ")}
                  </span>
                </div>
                <ChevronRight className="h-5 w-5 text-[#7a6e64]" />
              </Link>
            ))}
          </div>
        )}
      </section>
    </PageShell>
  );
}
