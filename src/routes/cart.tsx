import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Trash2, Plus, Minus, Tag, Loader2 } from "lucide-react";
import { PageHeader, PageShell } from "@/components/site/PageHeader";
import { formatPrice } from "@/lib/products";
import { useCartLines, useStore } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import { couponsApi } from "@/lib/api/coupons";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — Creative Muse" },
      { name: "description", content: "Review the pieces in your cart." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const lines = useCartLines();
  const { setQty, removeFromCart, cartSubtotal } = useStore();
  const { user } = useAuth();
  const [coupon, setCoupon] = useState("");
  const [couponStatus, setCouponStatus] = useState<"idle" | "loading" | "valid" | "invalid">("idle");
  const [couponMsg, setCouponMsg] = useState("");
  const [discount, setDiscount] = useState(0);
  const shipping = cartSubtotal > 5000 || cartSubtotal === 0 ? 0 : 250;
  const total = Math.max(0, cartSubtotal + shipping - discount);

  const applyCoupon = async () => {
    if (!coupon.trim()) return;
    setCouponStatus("loading");
    setCouponMsg("");
    try {
      const list = await couponsApi.list();
      const found = list.find((c: any) => c.code === coupon.trim().toUpperCase() && c.is_active);
      if (!found) {
        setCouponStatus("invalid");
        setCouponMsg("Invalid or expired coupon code.");
        setDiscount(0);
        return;
      }
      if (found.min_cart_value && cartSubtotal < found.min_cart_value) {
        setCouponStatus("invalid");
        setCouponMsg(`Minimum order value is ₹${Number(found.min_cart_value).toLocaleString("en-IN")}.`);
        setDiscount(0);
        return;
      }
      let d = found.discount_type === "percentage"
        ? (cartSubtotal * found.discount_value) / 100
        : found.discount_value;
      if (found.max_discount) d = Math.min(d, found.max_discount);
      setDiscount(d);
      setCouponStatus("valid");
      setCouponMsg(`Coupon applied! You save ₹${Math.round(d).toLocaleString("en-IN")}.`);
    } catch {
      setCouponStatus("invalid");
      setCouponMsg("Could not validate coupon. Try again.");
      setDiscount(0);
    }
  };

  return (
    <PageShell>
      <PageHeader
        eyebrow="Bag"
        title="Your Cart"
        subtitle={`${lines.length} piece${lines.length === 1 ? "" : "s"} curated for you.`}
      />

      <section className="mx-auto grid max-w-[1200px] gap-8 overflow-hidden px-6 py-16 lg:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          {lines.length === 0 && (
            <div className="rounded-[28px] bg-white p-10 text-center shadow-[0_4px_24px_rgba(0,0,0,0.05)]">
              <p className="text-[#7a6e64]">Your cart is empty.</p>
              <Link to="/shop" className="btn-primary mt-6 inline-flex">
                Continue Shopping
              </Link>
            </div>
          )}
          {lines.map(({ product: it, qty }) => (
            <div
              key={it.id}
              className="flex flex-col gap-4 rounded-[28px] bg-white p-5 shadow-[0_4px_24px_rgba(0,0,0,0.05)] sm:flex-row sm:items-center"
            >
              <div className="flex aspect-square w-full shrink-0 items-center justify-center overflow-hidden rounded-[20px] bg-[#fffdf9] border border-[rgba(66,29,34,0.18)] shadow-[0_8px_24px_rgba(66,29,34,0.06)] sm:w-28">
                <img
                  src={it.image}
                  alt={it.name}
                  loading="lazy"
                  className="h-full w-full object-contain p-3"
                />
              </div>
              <div className="flex-1">
                <p className="eyebrow text-[10px]">
                  {it.metal} · {it.stone}
                </p>
                <h3 className="font-display mt-1 text-base font-semibold text-[#1a1a2e]">
                  {it.name}
                </h3>
                <p className="mt-1 text-[13px] text-[#7a6e64] line-through">
                  {formatPrice(it.mrp)}
                </p>
                <p className="text-[16px] font-bold text-[#1a1a2e]">
                  {formatPrice(it.price)}
                </p>
              </div>
              <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                <div className="flex items-center gap-1 rounded-full border border-[#e0d8cc] p-1">
                  <button
                    onClick={() => setQty(it.id, qty - 1)}
                    aria-label="Decrease"
                    className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#f5efe8]"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="min-w-6 text-center text-sm font-semibold">{qty}</span>
                  <button
                    onClick={() => setQty(it.id, qty + 1)}
                    aria-label="Increase"
                    className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#f5efe8]"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(it.id)}
                  aria-label="Remove"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-[#7a6e64] hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <aside className="h-fit space-y-4">
          <div className="rounded-[28px] bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.05)]">
            <h3 className="font-display text-lg font-semibold text-[#1a1a2e]">Order Summary</h3>
            <div className="mt-5 space-y-3 border-t border-[#e0d8cc] pt-5 text-sm">
              <Row label="Subtotal" value={formatPrice(cartSubtotal)} />
              <Row label="Shipping" value={shipping === 0 ? "Free" : formatPrice(shipping)} />
              {discount > 0 && <Row label="Discount" value={`-${formatPrice(Math.round(discount))}`} />}
              <div className="my-2 border-t border-dashed border-[#e0d8cc]" />
              <Row label="Total" value={formatPrice(total)} bold />
              <p className="text-[10px] text-[#7a6e64]">GST will be calculated at checkout based on delivery address.</p>
            </div>

            <div className="mt-5 rounded-[20px] border border-dashed border-[#C9A96E]/40 bg-[#fdf8f3] p-3">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-[#C9A96E]" />
                <input
                  value={coupon}
                  onChange={(e) => { setCoupon(e.target.value); if (couponStatus !== "idle") { setCouponStatus("idle"); setCouponMsg(""); setDiscount(0); } }}
                  placeholder="Promo code"
                  className="flex-1 bg-transparent text-sm focus:outline-none"
                />
                <button
                  onClick={applyCoupon}
                  disabled={couponStatus === "loading"}
                  className="rounded-full bg-[#1a1a2e] px-3 py-1.5 text-[11px] font-semibold tracking-wider text-white uppercase disabled:opacity-50"
                >
                  {couponStatus === "loading" ? <Loader2 className="h-3 w-3 animate-spin" /> : "Apply"}
                </button>
              </div>
              {couponMsg && (
                <p className={`mt-2 text-[11px] font-medium ${couponStatus === "valid" ? "text-green-700" : "text-red-600"}`}>
                  {couponMsg}
                </p>
              )}
            </div>

            <Link
              to={user ? "/checkout" : "/login"}
              search={user ? undefined : { redirect: "/checkout" }}
              disabled={lines.length === 0}
              className="btn-primary mt-5 flex w-full justify-center disabled:cursor-not-allowed disabled:opacity-50"
            >
              Proceed to Checkout
            </Link>
            <Link
              to="/shop"
              className="mt-3 block text-center text-[12px] font-semibold tracking-[0.14em] text-[#7a6e64] uppercase hover:text-[#8B1A1A]"
            >
              ← Continue Shopping
            </Link>
          </div>
        </aside>
      </section>
    </PageShell>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div
      className={`flex items-center justify-between ${
        bold ? "font-display text-base font-semibold text-[#1a1a2e]" : "text-[#7a6e64]"
      }`}
    >
      <span>{label}</span>
      <span className={bold ? "" : "text-[#1a1a2e]"}>{value}</span>
    </div>
  );
}
