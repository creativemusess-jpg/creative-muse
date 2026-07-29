/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Download, ExternalLink, Package, Search, Truck } from "lucide-react";
import { PageHeader, PageShell } from "@/components/site/PageHeader";
import { storefrontSupabase } from "@/lib/supabase-storefront";
import { normalizeOrderItems } from "@/lib/api/order-items";

export const Route = createFileRoute("/track-order")({
  head: () => ({ meta: [{ title: "Track Order - Creative Muse" }] }),
  component: TrackPage,
});

function formatDate(value?: string) {
  return value
    ? new Date(value).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "-";
}

function TrackPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [identity, setIdentity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);

  const handleTrack = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setOrder(null);
    setItems([]);
    const identityClean = identity.trim().toLowerCase();
    try {
      const { data } = await (storefrontSupabase as any)
        .from("orders")
        .select("*")
        .eq("order_number", orderNumber.trim())
        .maybeSingle();
      const emailMatches = data?.customer_email?.toLowerCase() === identityClean;
      const phoneDigits = String(data?.customer_phone || "").replace(/\D/g, "");
      const inputDigits = identityClean.replace(/\D/g, "");
      const phoneMatches = inputDigits.length >= 6 && phoneDigits.endsWith(inputDigits.slice(-10));
      if (!data || (!emailMatches && !phoneMatches)) {
        setError(
          "We could not verify that order. Please check the order number and email or phone.",
        );
        return;
      }
      setOrder(data);
      const { data: itemRows } = await (storefrontSupabase as any)
        .from("order_items")
        .select("*")
        .eq("order_id", data.id);
      setItems(normalizeOrderItems(itemRows || []));
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell>
      <PageHeader
        eyebrow="Tracking"
        title="Track Your Order"
        subtitle="Verify with your order number and email or phone."
      />
      <section className="mx-auto max-w-[920px] px-4 py-10 sm:px-6 sm:py-16">
        <form
          onSubmit={handleTrack}
          className="grid gap-3 rounded-[8px] border border-[#ead8b8] bg-white p-4 shadow-[0_4px_24px_rgba(0,0,0,0.05)] sm:grid-cols-[1fr_1fr_auto]"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7A2533]" />
            <input
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="Order number"
              required
              className="w-full rounded-[6px] border border-[#e0d8cc] py-3 pl-10 pr-3 text-sm focus:outline-none focus:border-[#7A2533]"
            />
          </div>
          <input
            value={identity}
            onChange={(e) => setIdentity(e.target.value)}
            placeholder="Email or phone"
            required
            className="w-full rounded-[6px] border border-[#e0d8cc] px-3 py-3 text-sm focus:outline-none focus:border-[#7A2533]"
          />
          <button disabled={loading} className="btn-primary justify-center disabled:opacity-60">
            {loading ? "Checking..." : "Track"}
          </button>
        </form>

        {error && (
          <div className="mt-5 rounded-[8px] border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {order && (
          <div className="mt-8 rounded-[8px] border border-[#ead8b8] bg-[#fffdf8] p-5 shadow-[0_10px_30px_rgba(40,24,8,0.06)]">
            <div className="flex flex-col gap-4 border-b border-[#ead8b8] pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#7A2533]">
                  Order {order.order_number}
                </p>
                <h2 className="font-display mt-1 text-2xl font-semibold text-[#1a1a2e]">
                  {order.order_status.replace(/_/g, " ")}
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold capitalize text-green-700">
                  {order.payment_status}
                </span>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold capitalize text-amber-700">
                  {order.order_status.replace(/_/g, " ")}
                </span>
              </div>
            </div>

            <div className="grid gap-5 py-5 lg:grid-cols-[1fr_320px]">
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 rounded-[8px] border border-[#ead8b8] bg-white p-4"
                  >
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-[6px] bg-[#fff7e8]">
                      {item.productImage && (
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="h-full w-full object-contain p-1"
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-[#1a1a2e]">{item.productName}</p>
                      <p className="mt-2 text-xs text-[#7a6e64]">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-[8px] border border-[#ead8b8] bg-white p-4 text-sm">
                <h3 className="mb-3 text-[12px] font-bold uppercase tracking-wider text-[#7A2533]">
                  Shipment
                </h3>
                <Info label="Courier" value={order.courier_name || order.courier || "Pending"} />
                <Info label="Shipment ID" value={order.shipment_id || "Pending"} />
                <Info
                  label="Tracking Number"
                  value={order.tracking_number || order.tracking_id || "Pending"}
                />
                <Info label="Shipped Date" value={formatDate(order.shipped_at)} />
                <Info label="Estimated Delivery" value={formatDate(order.estimated_delivery_at)} />
                <Info
                  label="Delivered Date"
                  value={formatDate(order.delivered_at || order.actual_delivery_at)}
                />
                {order.tracking_url && (
                  <a
                    href={order.tracking_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-[6px] bg-[#7A2533] px-4 py-3 text-sm font-semibold text-white hover:bg-[#5F1C27]"
                  >
                    <ExternalLink className="h-4 w-4" /> Track Shipment
                  </a>
                )}
              </div>
            </div>

            <div className="grid gap-3 border-t border-[#ead8b8] pt-5 sm:grid-cols-2">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center justify-center gap-2 rounded-[6px] border border-[#7A2533] px-4 py-3 text-sm font-semibold text-[#7A2533]"
              >
                <Download className="h-4 w-4" /> Download Invoice
              </button>
              <a
                href={order.tracking_url || "#"}
                className="inline-flex items-center justify-center gap-2 rounded-[6px] bg-[#7A2533] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#5F1C27]"
              >
                <Truck className="h-4 w-4" /> Shipment Details
              </a>
            </div>
          </div>
        )}
      </section>
    </PageShell>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-[#f0e4cd] py-2">
      <span className="text-[#7a6e64]">{label}</span>
      <span className="font-semibold text-[#1a1a2e]">{value}</span>
    </div>
  );
}
