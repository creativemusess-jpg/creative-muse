import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Trash2, Plus, Minus, Tag, Loader2 } from "lucide-react";
import { PageHeader, PageShell } from "@/components/site/PageHeader";
import { formatPrice } from "@/lib/products";
import { useCartLines, useStore } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import { validateCoupon } from "@/lib/api/checkout";

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
  const { setQty, removeFromCart, cartSubtotal, couponCode, setCouponCode, discountAmount, setDiscountAmount, setAppliedCouponId, appliedCouponId, clearCoupon } = useStore();
  const { user } = useAuth();
  const [couponInput, setCouponInput] = useState("");
  const [couponStatus, setCouponStatus] = useState<"idle" | "loading" | "valid" | "invalid">("idle");
  const [couponMsg, setCouponMsg] = useState("");
  const shipping = cartSubtotal > 5000 || cartSubtotal === 0 ? 0 : 250;
  const total = Math.max(0, cartSubtotal + shipping - discountAmount);

  const applyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponStatus("loading");
    setCouponMsg("");
    try {
      const items = lines.map((l) => ({ productId: l.product.id, price: l.product.price }));
      const result = await validateCoupon(couponInput.trim().toUpperCase(), cartSubtotal, items);
      if (result.isValid) {
        setDiscountAmount(result.discountAmount);
        setCouponCode(result.code);
        setAppliedCouponId(result.id);
        setCouponStatus("valid");
        setCouponMsg(`Coupon applied! You save ₹${Math.round(result.discountAmount).toLocaleString("en-IN")}.`);
      } else {
        setCouponStatus("invalid");
        setCouponMsg(result.message);
        setDiscountAmount(0);
        setCouponCode("");
        setAppliedCouponId(null);
      }
    } catch {
      setCouponStatus("invalid");
      setCouponMsg("Could not validate coupon. Try again.");
      setDiscountAmount(0);
    }
  };

  return (
    <PageShell>
      <PageHeader
        eyebrow="Bag"
        title="Your Cart"
        subtitle={`${lines.length} piece${lines.length === 1 ? "" : "s"} curated for you.`}
      />

      <section className="mx-auto grid max-w-[1200px] gap-8 overflow-hidden px-4 py-10 sm:px-6 sm:py-16 lg:grid-cols-[1fr_380px]">
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
              className="flex gap-3 rounded-[22px] bg-white p-3 shadow-[0_4px_24px_rgba(0,0,0,0.05)] sm:gap-4 sm:rounded-[28px] sm:p-5"
            >
              <div className="flex aspect-square w-[108px] shrink-0 items-center justify-center overflow-hidden rounded-[18px] border border-[rgba(66,29,34,0.18)] bg-white shadow-[0_8px_24px_rgba(66,29,34,0.06)] sm:w-28 sm:rounded-[20px]">
                <img
                  src={it.image}
                  alt={it.name}
                  loading="lazy"
                  className="h-full w-full object-contain p-2 sm:p-3"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="eyebrow text-[10px]">
                  {it.metal} · {it.stone}
                </p>
                <h3 className="font-display mt-1 line-clamp-2 text-sm font-semibold text-[#1a1a2e] sm:text-base">
                  {it.name}
                </h3>
                {it.mrp > it.price && (
                  <p className="mt-1 text-[12px] text-[#7a6e64] line-through sm:text-[13px]">
                    {formatPrice(it.mrp)}
                  </p>
                )}
                <p className="text-[16px] font-bold text-[#1a1a2e]">
                  {formatPrice(it.price)}
                </p>
                <div className="mt-3 flex items-center justify-between gap-3 sm:hidden">
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
              <div className="flex items-center justify-between gap-4 max-sm:hidden sm:flex-col sm:items-end">
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
              {discountAmount > 0 && <Row label="Discount" value={`-${formatPrice(Math.round(discountAmount))}`} />}
              <div className="my-2 border-t border-dashed border-[#e0d8cc]" />
              <Row label="Total" value={formatPrice(total)} bold />
            </div>

            <div className="mt-5 rounded-[20px] border border-dashed border-[#C9A96E]/40 bg-[#fdf8f3] p-3">
              {discountAmount > 0 && couponCode ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700">{couponCode}</span>
                  </div>
                  <button
                    onClick={() => { clearCoupon(); setCouponStatus("idle"); setCouponMsg(""); setCouponInput(""); }}
                    className="text-[11px] font-semibold text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-[#C9A96E]" />
                  <input
                    value={couponInput}
                    onChange={(e) => { setCouponInput(e.target.value); if (couponStatus !== "idle") { setCouponStatus("idle"); setCouponMsg(""); } }}
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
              )}
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
