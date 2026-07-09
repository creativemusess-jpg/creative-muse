import { createFileRoute, Link, useParams, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { CheckCircle, Loader2, Package, ArrowRight } from "lucide-react";
import { PageShell } from "@/components/site/PageHeader";
import { formatPrice } from "@/lib/products";
import { supabase } from "@/lib/supabase";

const db = () => supabase as any;

export const Route = createFileRoute("/order-success/$orderNumber")({
  component: OrderSuccessPage,
});

function OrderSuccessPage() {
  const { orderNumber } = useParams({ from: "/order-success/$orderNumber" });
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await db()
        .from("orders")
        .select("*")
        .eq("order_number", orderNumber)
        .maybeSingle();
      setOrder(data);
      setLoading(false);
    }
    load();
  }, [orderNumber]);

  useEffect(() => {
    if (order) {
      const timer = setTimeout(() => navigate({ to: "/" }), 8000);
      return () => clearTimeout(timer);
    }
  }, [order, navigate]);

  return (
    <PageShell>
      <div className="mx-auto flex min-h-[70vh] max-w-[600px] items-center justify-center px-4 py-20">
        {loading ? (
          <Loader2 className="h-10 w-10 animate-spin text-[#c9a96e]" />
        ) : order ? (
          <div className="w-full text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="font-display mt-6 text-3xl font-semibold text-[#1a1a2e]">Thank You for Your Order</h1>
            <p className="mt-2 text-[#7a6e64]">Your jewellery is being prepared with care.</p>

            <div className="mt-8 rounded-[28px] border border-[#e0d8cc] bg-white p-6 text-left shadow-[0_4px_24px_rgba(0,0,0,0.05)]">
              <div className="space-y-3 text-sm">
                <InfoRow label="Order" value={order.order_number} />
                <InfoRow label="Status" value={order.order_status} />
                <InfoRow label="Payment" value={order.payment_status === "paid" ? "Paid (Demo)" : "Pending"} />
                <InfoRow label="Total" value={formatPrice(order.total_amount)} />
                <InfoRow label="Email" value={order.customer_email} />
              </div>
            </div>

            <p className="mt-6 text-sm text-amber-700">This order was placed using the demo payment environment. No real payment was charged.</p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link to="/account/orders/$orderNumber" params={{ orderNumber }} className="btn-primary inline-flex items-center gap-2">
                <Package className="h-4 w-4" /> View Order
              </Link>
              <Link to="/" className="btn-secondary">
                Return to Home <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <p className="mt-6 text-xs text-[#7a6e64]">You'll be redirected to the homepage shortly.</p>
          </div>
        ) : (
          <div className="text-center">
            <h1 className="font-display text-2xl font-semibold text-[#1a1a2e]">Order Not Found</h1>
            <p className="mt-2 text-[#7a6e64]">We couldn't find this order.</p>
            <Link to="/" className="btn-primary mt-6 inline-flex">Go Home</Link>
          </div>
        )}
      </div>
    </PageShell>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between border-b border-[#f5efe8] pb-2"><span className="text-[#7a6e64]">{label}</span><span className="font-medium text-[#1a1a2e]">{value}</span></div>;
}
