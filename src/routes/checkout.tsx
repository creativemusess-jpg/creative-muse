import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ChevronRight, Loader2, MapPin, Truck } from "lucide-react";
import { PageShell } from "@/components/site/PageHeader";
import { useAuth } from "@/lib/auth";
import { useCartLines, useStore } from "@/lib/store";
import { formatPrice } from "@/lib/products";
import { validateCoupon, calculateTotals, type ValidatedCoupon } from "@/lib/api/checkout";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
});

function CheckoutPage() {
  const { user, loading: authLoading } = useAuth();
  const lines = useCartLines();
  const { cartSubtotal, cartCount } = useStore();
  const navigate = useNavigate();

  const [address, setAddress] = useState({ line1: "", line2: "", city: "", state: "", postalCode: "", landmark: "" });
  const [phone, setPhone] = useState("");
  const [deliveryOption, setDeliveryOption] = useState("standard");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate({ to: "/login", search: { redirect: "/checkout" } });
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (lines.length === 0 && !authLoading) {
      navigate({ to: "/cart" });
    }
  }, [lines, authLoading, navigate]);

  if (authLoading || !user) return null;
  if (lines.length === 0) return null;

  const shipping = cartSubtotal > 5000 ? 0 : 250;
  const totals = calculateTotals(cartSubtotal, 0, shipping);

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.line1.trim() || !address.city.trim() || !address.state.trim() || !address.postalCode.trim()) {
      setError("Please fill in all required address fields.");
      return;
    }
    setSaving(true);
    setError("");

    const checkoutData = {
      address,
      phone: phone || user.email,
      deliveryOption,
      totals,
      items: lines.map((l) => ({ productId: l.product.id, name: l.product.name, image: l.product.image, sku: l.product.sku || "", qty: l.qty, unitPrice: l.product.price, lineTotal: l.product.price * l.qty })),
    };
    sessionStorage.setItem("cm_checkout_data", JSON.stringify(checkoutData));
    navigate({ to: "/payment" });
  };

  return (
    <PageShell>
      <div className="mx-auto max-w-[1200px] px-6 py-16">
        <p className="text-[11px] font-semibold tracking-[0.24em] text-[#c9a96e] uppercase">Checkout</p>
        <h1 className="font-display mt-2 text-[32px] font-semibold text-[#1a1a2e]">Delivery Details</h1>

        <form onSubmit={handleContinue} className="mt-10 grid gap-10 lg:grid-cols-[1fr_400px]">
          <div className="space-y-8">
            <div className="rounded-[28px] bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.05)]">
              <h2 className="font-display text-lg font-semibold text-[#1a1a2e] flex items-center gap-2"><MapPin className="h-4 w-4 text-[#c9a96e]" /> Delivery Address</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Address Line 1 *</label>
                  <input value={address.line1} onChange={(e) => setAddress({ ...address, line1: e.target.value })} className="w-full rounded-xl border border-[#e0d8cc] px-4 py-3 text-sm outline-none focus:border-[#c9a96e]" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Address Line 2</label>
                  <input value={address.line2} onChange={(e) => setAddress({ ...address, line2: e.target.value })} className="w-full rounded-xl border border-[#e0d8cc] px-4 py-3 text-sm outline-none focus:border-[#c9a96e]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">City *</label>
                  <input value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} className="w-full rounded-xl border border-[#e0d8cc] px-4 py-3 text-sm outline-none focus:border-[#c9a96e]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">State *</label>
                  <input value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} className="w-full rounded-xl border border-[#e0d8cc] px-4 py-3 text-sm outline-none focus:border-[#c9a96e]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Postal Code *</label>
                  <input value={address.postalCode} onChange={(e) => setAddress({ ...address, postalCode: e.target.value })} className="w-full rounded-xl border border-[#e0d8cc] px-4 py-3 text-sm outline-none focus:border-[#c9a96e]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Landmark</label>
                  <input value={address.landmark} onChange={(e) => setAddress({ ...address, landmark: e.target.value })} className="w-full rounded-xl border border-[#e0d8cc] px-4 py-3 text-sm outline-none focus:border-[#c9a96e]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Phone *</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={user.email} className="w-full rounded-xl border border-[#e0d8cc] px-4 py-3 text-sm outline-none focus:border-[#c9a96e]" />
                </div>
              </div>
            </div>

            <div className="rounded-[28px] bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.05)]">
              <h2 className="font-display text-lg font-semibold text-[#1a1a2e] flex items-center gap-2"><Truck className="h-4 w-4 text-[#c9a96e]" /> Delivery Option</h2>
              <div className="mt-4 space-y-3">
                <label className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors ${deliveryOption === "standard" ? "border-[#c9a96e] bg-[#fdf8f3]" : "border-[#e0d8cc] hover:border-[#c9a96e]/50"}`}>
                  <input type="radio" name="delivery" value="standard" checked={deliveryOption === "standard"} onChange={(e) => setDeliveryOption(e.target.value)} className="accent-[#c9a96e]" />
                  <div><p className="font-medium text-[#1a1a2e]">Standard Insured Delivery</p><p className="text-xs text-[#7a6e64]">{shipping === 0 ? "Free" : formatPrice(shipping)} · 3–5 business days</p></div>
                </label>
                <label className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors ${deliveryOption === "express" ? "border-[#c9a96e] bg-[#fdf8f3]" : "border-[#e0d8cc] hover:border-[#c9a96e]/50"}`}>
                  <input type="radio" name="delivery" value="express" checked={deliveryOption === "express"} onChange={(e) => setDeliveryOption(e.target.value)} className="accent-[#c9a96e]" />
                  <div><p className="font-medium text-[#1a1a2e]">Express Delivery</p><p className="text-xs text-[#7a6e64]">₹450 · 1–2 business days</p></div>
                </label>
              </div>
            </div>
          </div>

          <div className="h-fit space-y-4 lg:sticky lg:top-28">
            <div className="rounded-[28px] bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.05)]">
              <h3 className="font-display text-lg font-semibold text-[#1a1a2e]">Order Summary</h3>
              <div className="mt-4 space-y-3">
                {lines.map(({ product: p, qty }) => (
                  <div key={p.id} className="flex items-center gap-3">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br ${p.bg}`}>
                      <img src={p.image} alt={p.name} className="h-full w-full object-contain p-1" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-[#1a1a2e]">{p.name}</p>
                      <p className="text-xs text-[#7a6e64]">Qty {qty} × {formatPrice(p.price)}</p>
                    </div>
                    <p className="text-sm font-semibold text-[#1a1a2e]">{formatPrice(p.price * qty)}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 space-y-2 border-t border-[#e0d8cc] pt-4 text-sm">
                <Row label="Subtotal" value={formatPrice(cartSubtotal)} />
                <Row label="Shipping" value={shipping === 0 ? "Free" : formatPrice(shipping)} />
                <div className="my-2 border-t border-dashed border-[#e0d8cc]" />
                <Row label="Total" value={formatPrice(totals.total)} bold />
              </div>

              {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

              <button type="submit" disabled={saving} className="btn-primary mt-5 w-full justify-center disabled:opacity-60">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {saving ? "Please wait…" : "Continue to Payment"}
                {!saving && <ChevronRight className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </form>
      </div>
    </PageShell>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return <div className={`flex items-center justify-between ${bold ? "font-display text-base font-semibold text-[#1a1a2e]" : "text-[#7a6e64]"}`}><span>{label}</span><span className={bold ? "" : "text-[#1a1a2e]"}>{value}</span></div>;
}
