import { createFileRoute, Link, useParams, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { CheckCircle, Loader2, Package, ArrowRight, Download, FileText } from "lucide-react";
import { PageShell } from "@/components/site/PageHeader";
import { formatPrice } from "@/lib/products";
import { supabase } from "@/lib/supabase";
import { generateInvoicePdf } from "@/lib/invoice-pdf";

const db = () => supabase as any;

export const Route = createFileRoute("/order-success/$orderNumber")({
  component: OrderSuccessPage,
});

function OrderSuccessPage() {
  const { orderNumber } = useParams({ from: "/order-success/$orderNumber" });
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const cached = sessionStorage.getItem("cm_order_success");
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed.orderNumber === orderNumber) {
            setOrder({
              order_number: parsed.orderNumber,
              customer_name: parsed.customerName,
              customer_email: parsed.customerEmail,
              subtotal: parsed.subtotal,
              discount_amount: parsed.discountAmount,
              shipping_amount: parsed.shipping,
              tax_amount: parsed.tax,
              total_amount: parsed.total,
              delivery_method: parsed.deliveryMethod,
              delivery_address: parsed.deliveryAddress || {},
              gift_packaging_enabled: parsed.giftPackagingEnabled || false,
              gift_packaging_price: parsed.giftPackagingPrice || 0,
              gift_packaging_name: parsed.giftPackagingName || "",
              gift_message: parsed.giftMessage || "",
              coupon_code: parsed.couponCode,
              payment_method: parsed.paymentMethod,
              payment_status: "pending",
              order_status: parsed.paymentMethod === "cod" ? "confirmed" : "pending",
              created_at: parsed.created_at,
            });
            if (parsed.items) setItems(parsed.items.map((i: any) => ({
              product_name: i.name,
              quantity: i.qty,
              unit_price: i.unitPrice,
              total_price: i.lineTotal,
            })));
            sessionStorage.removeItem("cm_order_success");
            setLoading(false);
            return;
          }
        } catch { /* fall through to DB */ }
      }
      const { data } = await db()
        .from("orders")
        .select("*")
        .eq("order_number", orderNumber)
        .maybeSingle();
      setOrder(data);
      if (data?.id) {
        const { data: orderItems } = await db()
          .from("order_items")
          .select("*")
          .eq("order_id", data.id);
        if (orderItems) setItems(orderItems);
      }
      setLoading(false);
    }
    load();
  }, [orderNumber]);

  const handleDownloadInvoice = async () => {
    await generateInvoicePdf({ order, items });
  };

  return (
    <PageShell>
      <div className="mx-auto flex min-h-[70vh] max-w-[600px] items-center justify-center px-4 py-20">
        {loading ? (
          <Loader2 className="h-10 w-10 animate-spin text-[#9C544D]" />
        ) : order ? (
          <div className="w-full text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#9C544D]">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <h1 className="font-display mt-6 text-3xl font-semibold text-[#1a1a2e]">Thank You for Your Order</h1>
            <p className="mt-2 text-[#7a6e64]">Your jewellery is being prepared with care.</p>

            <div className="mt-8 rounded-[28px] border border-[#e0d8cc] bg-white p-6 text-left shadow-[0_4px_24px_rgba(0,0,0,0.05)]">
              <div className="space-y-3 text-sm">
                <InfoRow label="Order" value={order.order_number} />
                <InfoRow label="Status" value={order.order_status} />
                <InfoRow label="Payment" value={order.payment_status === "paid" ? "Paid" : "Pending"} />
                <InfoRow label="Subtotal" value={formatPrice(order.subtotal)} />
                {order.shipping_amount > 0 && <InfoRow label="Shipping" value={formatPrice(order.shipping_amount)} />}
                {order.gift_packaging_enabled && <InfoRow label={order.gift_packaging_name || "Gift Packaging"} value={formatPrice(order.gift_packaging_price || 0)} />}
                <div className="border-t border-[#e0d8cc] pt-2" />
                <InfoRow label={order.payment_status === "paid" ? "Total Paid" : "Order Total"} value={formatPrice(order.total_amount)} bold />
                {order.delivery_method && <InfoRow label="Delivery" value={order.delivery_method === "express" ? "Express" : "Standard"} />}
                <InfoRow label="Email" value={order.customer_email} />
              </div>
            </div>

            <p className="mt-6 text-sm text-amber-700">This order was placed using the demo payment environment. No real payment was charged.</p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <button onClick={handleDownloadInvoice} className="btn-primary inline-flex items-center gap-2">
                <Download className="h-4 w-4" /> Download Invoice
              </button>
              <Link to="/account/orders/$orderNumber" params={{ orderNumber }} className="btn-primary inline-flex items-center gap-2">
                <Package className="h-4 w-4" /> View Order
              </Link>
              <Link to="/" className="btn-secondary">
                Return to Home <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
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

function InfoRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return <div className={`flex items-center justify-between border-b border-[#f5efe8] pb-2 ${bold ? "font-semibold" : ""}`}><span className="text-[#7a6e64]">{label}</span><span className={`${bold ? "font-semibold text-base" : "font-medium"} text-[#1a1a2e]`}>{value}</span></div>;
}
