/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, ChevronLeft, Download, Headphones, Package, Truck } from "lucide-react";
import { PageShell } from "@/components/site/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth";
import { storefrontSupabase } from "@/lib/supabase-storefront";
import { normalizeOrderItems } from "@/lib/api/order-items";
import type { NormalizedOrderItem } from "@/lib/api/order-items";
import { generateInvoicePdf } from "@/lib/invoice-pdf";

export const Route = createFileRoute("/account/orders/$orderNumber")({
  head: ({ params }) => ({ meta: [{ title: `Order #${params.orderNumber} - Creative Muse` }] }),
  component: AccountOrderDetailPage,
});

const steps = ["confirmed", "processing", "shipped", "delivered"];

function formatPrice(n: number) {
  return "₹" + Number(n || 0).toLocaleString("en-IN");
}

function formatDate(value?: string) {
  return value
    ? new Date(value).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "-";
}

function statusIndex(status: string) {
  if (status === "pending") return 0;
  if (status === "confirmed") return 0;
  if (status === "processing") return 1;
  if (status === "shipped" || status === "out_for_delivery") return 2;
  if (status === "delivered") return 3;
  return 0;
}

function addressText(addr: any) {
  if (!addr) return "-";
  if (typeof addr === "string") return addr;
  return [
    addr.addressLine1,
    addr.addressLine2,
    addr.landmark,
    [addr.locality, addr.city].filter(Boolean).join(", "),
    [addr.state, addr.postalCode || addr.pincode].filter(Boolean).join(" - "),
    addr.country,
  ]
    .filter(Boolean)
    .join("\n");
}

function AccountOrderDetailPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { orderNumber } = useParams({ from: "/account/orders/$orderNumber" });
  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<NormalizedOrderItem[]>([]);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user)
      navigate({ to: "/login", search: { redirect: `/account/orders/${orderNumber}` } });
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

  if (loading || !user || pageLoading) {
    return (
      <PageShell>
        <div className="mx-auto max-w-[960px] px-6 py-10">
          <div className="space-y-4">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-72" />
            <Skeleton className="h-40 w-full rounded-[16px]" />
            <Skeleton className="h-32 w-full rounded-[16px]" />
          </div>
        </div>
      </PageShell>
    );
  }

  if (!order) {
    return (
      <PageShell>
        <section className="mx-auto max-w-[900px] px-6 py-16">
          <div className="rounded-[18px] bg-white p-10 text-center shadow-[0_4px_24px_rgba(0,0,0,0.05)]">
            <Package className="mx-auto h-10 w-10 text-[#9C544D]" />
            <h2 className="font-display mt-4 text-xl font-semibold text-[#1a1a2e]">
              Order not found
            </h2>
            <Link to="/account/orders" className="btn-primary mt-6 inline-flex">
              View All Orders
            </Link>
          </div>
        </section>
      </PageShell>
    );
  }

  const activeStep = statusIndex(order.order_status);
  const delivery = order.delivery_address || order.shipping_address;
  const handleDownloadInvoice = async () => {
    await generateInvoicePdf({ order, items });
  };

  return (
    <PageShell>
      <section className="mx-auto max-w-[1120px] px-4 py-8 sm:px-6 sm:py-14">
        <Link
          to="/account/orders"
          className="mb-5 inline-flex items-center gap-1 text-sm font-medium text-[#7a6e64] hover:text-[#8C4340]"
        >
          <ChevronLeft className="h-4 w-4" /> All Orders
        </Link>

        <div className="rounded-[8px] border border-[#ead8b8] bg-[#fffdf8] p-5 shadow-[0_10px_30px_rgba(40,24,8,0.06)] sm:p-7">
          <div className="flex flex-col gap-4 border-b border-[#ead8b8] pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#9C544D] text-[#9C544D]">
                <Check className="h-7 w-7" />
              </div>
              <div>
                <h1 className="font-display text-2xl font-semibold text-[#1a1a2e]">
                  Thank You, {user.fullName?.split(" ")[0] || "Customer"}!
                </h1>
                <p className="mt-1 text-sm text-[#6f6252]">
                  Your order has been confirmed and we're preparing it with care.
                </p>
              </div>
            </div>
            <div className="text-sm text-[#6f6252]">
              <p>
                <strong>Order:</strong> {order.order_number}
              </p>
              <p>
                <strong>Date:</strong> {formatDate(order.created_at)}
              </p>
            </div>
          </div>

          <div className="grid min-w-0 border-b border-[#ead8b8] text-sm sm:grid-cols-4">
            {[
              ["Order Number", order.order_number],
              ["Order Date", formatDate(order.created_at)],
              ["Payment Status", order.payment_status],
              ["Order Status", order.order_status],
            ].map(([label, value]) => (
              <div
                key={label}
                className="min-w-0 border-[#ead8b8] px-2 py-4 sm:border-r sm:last:border-r-0"
              >
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#7a6e64]">
                  {label}
                </p>
                <p
                  className={`mt-1 font-semibold break-words capitalize ${String(value).includes("paid") || String(value).includes("confirmed") ? "text-green-700" : "text-[#1a1a2e]"}`}
                >
                  {value}
                </p>
              </div>
            ))}
          </div>

          <div className="border-b border-[#ead8b8] py-6">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-wider text-[#7a6e64]">
              Delivery Progress
            </p>
            <div className="grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-4 sm:gap-2">
              {steps.map((step, index) => {
                const active = index <= activeStep;
                return (
                  <div key={step} className="relative flex flex-col items-center justify-center text-center">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full border ${active ? "border-[#9C544D] bg-[#9C544D] text-white" : "border-[#d9c9ab] bg-white text-[#9a8a74]"}`}
                    >
                      {step === "shipped" ? (
                        <Truck className="h-4 w-4" />
                      ) : (
                        <Package className="h-4 w-4" />
                      )}
                    </div>
                    <p className="mt-2 text-[11px] font-medium leading-tight break-words capitalize text-[#5d554d]">
                      {step}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid gap-5 py-5 lg:grid-cols-[1fr_320px]">
            <div className="rounded-[8px] border border-[#ead8b8] bg-white">
              <h2 className="border-b border-[#ead8b8] px-4 py-3 text-[12px] font-bold uppercase tracking-wider text-[#9C544D]">
                Order Items
              </h2>
              <div className="divide-y divide-[#ead8b8]">
                {items.map((item) => (
                  <div key={item.id} className="flex flex-wrap gap-3 p-4 sm:flex-nowrap sm:gap-4">
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-[6px] bg-[#fff7e8] sm:h-24 sm:w-24">
                      {item.productImage && (
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="h-full w-full object-contain p-1"
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1 basis-[calc(100%-92px)] sm:basis-auto">
                      <p className="font-semibold break-words text-[#1a1a2e]">{item.productName}</p>
                      <p className="mt-2 text-xs text-[#7a6e64] sm:mt-4">Qty: {item.quantity}</p>
                      <p className="text-xs text-[#7a6e64]">
                        Unit Price: {formatPrice(item.unitPrice)}
                      </p>
                    </div>
                    <p className="ml-auto text-sm font-semibold text-[#1a1a2e] sm:ml-0 sm:self-center">
                      {formatPrice(item.lineTotal)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[8px] border border-[#ead8b8] bg-white p-4">
              <h2 className="mb-3 text-[12px] font-bold uppercase tracking-wider text-[#9C544D]">
                Price Summary
              </h2>
              <SummaryRow label="Subtotal" value={formatPrice(order.subtotal)} />
              {order.discount_amount > 0 && (
                <SummaryRow label="Discount" value={`-${formatPrice(order.discount_amount)}`} />
              )}
              <SummaryRow
                label="Shipping"
                value={
                  Number(order.shipping_amount || 0) === 0
                    ? "Free"
                    : formatPrice(order.shipping_amount)
                }
              />
              {order.gift_packaging_enabled && (
                <>
                  <SummaryRow label={order.gift_packaging_name || "Gift Packaging"} value={formatPrice(order.gift_packaging_price || 0)} />
                  {order.gift_message && (
                    <p className="mt-1 text-xs italic text-[#7a6e64]">Gift message: "{order.gift_message}"</p>
                  )}
                </>
              )}
              <div className="mt-2 border-t border-[#1a1a2e] pt-2">
                <SummaryRow label="Grand Total" value={formatPrice(order.total_amount)} strong />
              </div>
            </div>
          </div>

          <div className="grid gap-4 border-t border-[#ead8b8] pt-5 md:grid-cols-3">
            <InfoCard
              title="Billing Address"
              text={`${order.customer_name || ""}\n${order.customer_email || ""}\n${order.customer_phone || ""}`}
            />
            <InfoCard title="Shipping Address" text={addressText(delivery)} />
            <InfoCard
              title="Delivery"
              text={`${order.delivery_method === "express" ? "Express Delivery" : "Standard Delivery"}\nEstimated: ${formatDate(order.estimated_delivery_at)}\nTracking: ${order.tracking_number || order.tracking_id || "Pending"}`}
            />
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <Link
              to="/track-order"
              className="inline-flex items-center justify-center gap-2 rounded-[6px] bg-[#9C544D] px-4 py-3 text-sm font-semibold text-white hover:bg-[#7A3D3A]"
            >
              <Truck className="h-4 w-4" /> Track Order
            </Link>
            <button
              onClick={handleDownloadInvoice}
              className="inline-flex items-center justify-center gap-2 rounded-[6px] border border-[#9C544D] px-4 py-3 text-sm font-semibold text-[#9C544D]"
            >
              <Download className="h-4 w-4" /> Download Invoice
            </button>
            <a
              href="mailto:hello@creativemuse.in"
              className="inline-flex items-center justify-center gap-2 rounded-[6px] border border-[#9C544D] px-4 py-3 text-sm font-semibold text-[#9C544D]"
            >
              <Headphones className="h-4 w-4" /> Contact Support
            </a>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function SummaryRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div
      className={`flex justify-between py-1 text-sm ${strong ? "font-bold text-[#1a1a2e]" : "text-[#6f6252]"}`}
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-[8px] border border-[#ead8b8] bg-white p-4">
      <p className="text-[11px] font-bold uppercase tracking-wider text-[#9C544D]">{title}</p>
      <p className="mt-2 whitespace-pre-line text-sm leading-6 text-[#5d554d]">{text || "-"}</p>
    </div>
  );
}
