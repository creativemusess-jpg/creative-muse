import { createFileRoute, Link, useParams, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { CheckCircle, Loader2, Package, ArrowRight, Download, FileText } from "lucide-react";
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
              coupon_code: parsed.couponCode,
              payment_method: parsed.paymentMethod,
              payment_status: "paid",
              order_status: "confirmed",
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

  const handleDownloadInvoice = () => {
    const win = window.open("", "_blank");
    if (!win) { alert("Please allow pop-ups to download the invoice."); return; }
    const addr = order.delivery_address || {};
    const business = { name: "Creative Muse", email: "hello@creativemuse.in" };
    const itemsHtml = items.map((item: any) =>
      `<tr><td style="padding:6px 8px;border-bottom:1px solid #eee">${item.product_name || "Item"}</td><td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:center">${item.quantity}</td><td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">${formatPrice(item.unit_price)}</td><td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">${formatPrice(item.total_price)}</td></tr>`
    ).join("");
    win.document.write(`<!DOCTYPE html><html><head><title>Invoice ${order.order_number}</title><style>body{font-family:Inter,system-ui,sans-serif;padding:40px;color:#1a1a2e}table{width:100%;border-collapse:collapse;margin:16px 0}th{background:#1a1a2e;color:#fff;padding:8px 10px;text-align:left;font-size:11px}td{font-size:12px}.right{text-align:right}.total{font-size:16px;font-weight:700;border-top:2px solid #1a1a2e;padding-top:8px}.footer{margin-top:30px;padding-top:16px;border-top:1px solid #ddd;font-size:11px;color:#888;text-align:center}h1{font-size:22px;margin:0 0 4px}.header{display:flex;justify-content:space-between;margin-bottom:24px}.badge{display:inline-block;padding:2px 8px;border-radius:4px;font-size:10px;font-weight:600}.badge-paid{background:#d1fae5;color:#065f46}.badge-pending{background:#fef3c7;color:#92400e}</style></head><body>
      <div class="header"><div><h1>${business.name}</h1><p>${business.email}</p></div><div><h2 style="color:#c9a96e;margin:0">INVOICE</h2><p><strong>Order:</strong> ${order.order_number}</p><p><strong>Date:</strong> ${new Date(order.created_at).toLocaleDateString("en-IN",{year:"numeric",month:"short",day:"numeric"})}</p></div></div>
      <hr style="border-color:#c9a96e" />
      <p><strong>Bill To:</strong> ${order.customer_name || "Guest"}<br/>${order.customer_email || ""}<br/>${addr.addressLine1 || ""}${addr.city ? ", " + addr.city : ""}${addr.state ? ", " + addr.state : ""}</p>
      <table><thead><tr><th>Item</th><th style="text-align:center">Qty</th><th style="text-align:right">Price</th><th style="text-align:right">Total</th></tr></thead><tbody>${itemsHtml}</tbody></table>
      <div style="margin-left:auto;width:300px"><table><tr><td>Subtotal</td><td class="right">${formatPrice(order.subtotal)}</td></tr>${order.shipping_amount > 0 ? `<tr><td>Shipping</td><td class="right">${formatPrice(order.shipping_amount)}</td></tr>` : ""}${order.tax_amount > 0 ? `<tr><td>GST</td><td class="right">${formatPrice(order.tax_amount)}</td></tr>` : ""}<tr class="total"><td>Total</td><td class="right">${formatPrice(order.total_amount)}</td></tr></table></div>
      <div class="footer"><p>Thank you for shopping with Creative Muse!</p><p>Payment: <span class="badge badge-${order.payment_status}">${order.payment_status}</span></p></div>
    </body></html>`);
    win.document.close();
    setTimeout(() => { win.print(); }, 500);
  };

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
                <InfoRow label="Subtotal" value={formatPrice(order.subtotal)} />
                {order.shipping_amount > 0 && <InfoRow label="Shipping" value={formatPrice(order.shipping_amount)} />}
                {order.tax_amount > 0 && <InfoRow label="GST" value={formatPrice(order.tax_amount)} />}
                <div className="border-t border-[#e0d8cc] pt-2" />
                <InfoRow label="Total Paid" value={formatPrice(order.total_amount)} bold />
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
