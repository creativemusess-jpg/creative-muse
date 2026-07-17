import { AnimatePresence, motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  Heart,
  Star,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Tag,
  Loader2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { formatPrice, type Product, useStorefrontProducts } from "@/lib/products";
import { useCartLines, useStore, useWishlistProducts } from "@/lib/store";
import { productLink } from "@/lib/product-link";
import { validateCoupon } from "@/lib/api/checkout";

/* Cart drawer + Wishlist drawer + Quick View modal — global overlays */
export function Overlays() {
  return (
    <>
      <CartDrawer />
      <WishlistDrawer />
      <QuickViewModal />
    </>
  );
}

/* ---------------- Cart Drawer ---------------- */
function CartDrawer() {
  const { cartOpen, closeCart, setQty, removeFromCart, cartSubtotal, couponCode, setCouponCode, discountAmount, setDiscountAmount, appliedCouponId, setAppliedCouponId, clearCoupon } = useStore();
  const lines = useCartLines();
  const [couponInput, setCouponInput] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");

  const shipping = cartSubtotal > 5000 || cartSubtotal === 0 ? 0 : 250;
  const total = Math.max(0, cartSubtotal + shipping - discountAmount);

  const handleApplyCoupon = async () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    setCouponLoading(true);
    setCouponError("");
    try {
      const result = await validateCoupon(code, cartSubtotal);
      if (result.isValid) {
        setCouponCode(code);
        setDiscountAmount(result.discountAmount);
        setAppliedCouponId(result.id);
      } else {
        setCouponError(result.message);
      }
    } catch {
      setCouponError("Could not validate coupon. Try again.");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    clearCoupon();
    setCouponInput("");
    setCouponError("");
  };

  return (
    <AnimatePresence>
      {cartOpen && (
        <motion.div
          className="fixed inset-0 z-[80]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeCart} />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            className="absolute top-0 right-0 flex h-full w-full max-w-[440px] flex-col bg-[#fdf8f3] shadow-[-24px_0_60px_rgba(0,0,0,0.2)]"
          >
            <header className="flex items-center justify-between border-b border-[#e0d8cc] px-6 py-5">
              <div>
                <p className="eyebrow text-[10px]">Bag</p>
                <h3 className="font-display text-xl font-semibold text-[#1a1a2e]">
                  Your Cart ({lines.length})
                </h3>
              </div>
              <button
                onClick={closeCart}
                aria-label="Close cart"
                className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-[#f5efe8]"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {lines.length === 0 ? (
                <EmptyState
                  icon={<ShoppingBag className="h-8 w-8 text-[#C9A96E]" />}
                  title="Your cart is empty"
                  copy="Start adding pieces to see them here."
                  cta="Browse Collections"
                  onCta={closeCart}
                />
              ) : (
                <>
                  <ul className="space-y-4">
                    {lines.map(({ product: p, qty }) => (
                      <li
                        key={p.id}
                        className="flex gap-4 rounded-[20px] bg-white p-3 shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
                      >
                        <div
                          className={`flex aspect-square w-20 shrink-0 items-center justify-center overflow-hidden rounded-[14px] bg-gradient-to-br ${p.bg}`}
                        >
                          <img
                            src={p.image}
                            alt={p.name}
                            loading="lazy"
                            className="h-full w-full object-contain p-2"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="eyebrow text-[9px]">{p.metal}</p>
                          {productLink(p) ? (
                            <Link
                              to={productLink(p)!.to}
                              params={productLink(p)!.params}
                              className="font-display truncate text-sm font-semibold text-[#1a1a2e] transition-colors hover:text-[#C9A96E]"
                            >
                              {p.name}
                            </Link>
                          ) : (
                            <p className="font-display truncate text-sm font-semibold text-[#1a1a2e]">
                              {p.name}
                            </p>
                          )}
                          <p className="mt-0.5 text-sm font-bold text-[#1a1a2e]">
                            {formatPrice(p.price)}
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <div className="flex items-center gap-1 rounded-full border border-[#e0d8cc] p-0.5">
                              <button
                                onClick={() => setQty(p.id, qty - 1)}
                                aria-label="Decrease"
                                className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-[#f5efe8]"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="min-w-5 text-center text-xs font-semibold">{qty}</span>
                              <button
                                onClick={() => setQty(p.id, qty + 1)}
                                aria-label="Increase"
                                className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-[#f5efe8]"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            <button
                              onClick={() => removeFromCart(p.id)}
                              aria-label="Remove"
                              className="ml-auto flex h-8 w-8 items-center justify-center rounded-full text-[#7a6e64] hover:bg-red-50 hover:text-red-500"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  {/* Coupon section */}
                  <div className="mt-5 rounded-[20px] border border-dashed border-[#C9A96E]/40 bg-white p-4">
                    {appliedCouponId ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-semibold text-green-700">{couponCode}</span>
                          <span className="text-xs text-[#7a6e64]">· -{formatPrice(discountAmount)}</span>
                        </div>
                        <button onClick={handleRemoveCoupon} className="text-xs font-semibold text-red-500 hover:text-red-700">
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-[#C9A96E]" />
                          <input
                            value={couponInput}
                            onChange={(e) => setCouponInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                            placeholder="Promo code"
                            className="flex-1 bg-transparent text-sm focus:outline-none"
                          />
                          <button
                            onClick={handleApplyCoupon}
                            disabled={couponLoading || !couponInput.trim()}
                            className="rounded-full bg-[#1a1a2e] px-3 py-1.5 text-[11px] font-semibold tracking-wider text-white uppercase disabled:opacity-50"
                          >
                            {couponLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Apply"}
                          </button>
                        </div>
                        {couponError && (
                          <p className="mt-2 text-[11px] font-medium text-red-600">{couponError}</p>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {lines.length > 0 && (
              <footer className="border-t border-[#e0d8cc] bg-white px-6 py-5">
                <div className="space-y-1.5 text-sm">
                  <Row label="Subtotal" value={formatPrice(cartSubtotal)} />
                  <Row label="Shipping" value={shipping === 0 ? "Free" : formatPrice(shipping)} />
                  {discountAmount > 0 && (
                    <Row label={`Discount (${couponCode})`} value={`-${formatPrice(discountAmount)}`} />
                  )}
                  <div className="my-2 border-t border-dashed border-[#e0d8cc]" />
                  <Row label="Total" value={formatPrice(total)} bold />
                </div>
                <Link
                  to="/cart"
                  onClick={closeCart}
                  className="btn-primary mt-5 flex w-full justify-center"
                >
                  Checkout
                </Link>
                <button
                  onClick={closeCart}
                  className="mt-2 w-full text-center text-[11px] font-semibold tracking-[0.14em] text-[#7a6e64] uppercase hover:text-[#1a1a2e]"
                >
                  ← Continue Shopping
                </button>
              </footer>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------------- Wishlist Drawer ---------------- */
function WishlistDrawer() {
  const { wishlistOpen, closeWishlist, toggleWishlist, addToCart } = useStore();
  const items = useWishlistProducts();

  return (
    <AnimatePresence>
      {wishlistOpen && (
        <motion.div
          className="fixed inset-0 z-[80]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeWishlist} />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            className="absolute top-0 right-0 flex h-full w-full max-w-[440px] flex-col bg-[#fdf8f3] shadow-[-24px_0_60px_rgba(0,0,0,0.2)]"
          >
            <header className="flex items-center justify-between border-b border-[#e0d8cc] px-6 py-5">
              <div>
                <p className="eyebrow text-[10px]">Saved</p>
                <h3 className="font-display text-xl font-semibold text-[#1a1a2e]">
                  Your Wishlist ({items.length})
                </h3>
              </div>
              <button
                onClick={closeWishlist}
                aria-label="Close wishlist"
                className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-[#f5efe8]"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {items.length === 0 ? (
                <EmptyState
                  icon={<Heart className="h-8 w-8 text-[#C9A96E]" />}
                  title="No favourites yet"
                  copy="Tap the heart on any piece to save it here."
                  cta="Browse Collections"
                  onCta={closeWishlist}
                />
              ) : (
                <ul className="space-y-4">
                  {items.map((p) => (
                    <li
                      key={p.id}
                      className="flex gap-4 rounded-[20px] bg-white p-3 shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
                    >
                      <div
                        className={`flex aspect-square w-20 shrink-0 items-center justify-center overflow-hidden rounded-[14px] bg-gradient-to-br ${p.bg}`}
                      >
                        <img
                          src={p.image}
                          alt={p.name}
                          loading="lazy"
                          className="h-full w-full object-contain p-2"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="eyebrow text-[9px]">{p.metal}</p>
                        {productLink(p) ? (
                          <Link
                            to={productLink(p)!.to}
                            params={productLink(p)!.params}
                            className="font-display truncate text-sm font-semibold text-[#1a1a2e] transition-colors hover:text-[#C9A96E]"
                          >
                            {p.name}
                          </Link>
                        ) : (
                          <p className="font-display truncate text-sm font-semibold text-[#1a1a2e]">
                            {p.name}
                          </p>
                        )}
                        <p className="mt-0.5 text-sm font-bold text-[#1a1a2e]">
                          {formatPrice(p.price)}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <button
                            onClick={() => {
                              addToCart(p.id, 1);
                              toggleWishlist(p.id);
                              closeWishlist();
                            }}
                            className="rounded-full bg-gradient-to-r from-[#C9A96E] to-[#B8860B] px-3 py-1.5 text-[10px] font-semibold tracking-[0.1em] text-white uppercase"
                          >
                            Move to Cart
                          </button>
                          <button
                            onClick={() => toggleWishlist(p.id)}
                            aria-label="Remove"
                            className="ml-auto flex h-8 w-8 items-center justify-center rounded-full text-[#7a6e64] hover:bg-red-50 hover:text-red-500"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------------- Quick View Modal ---------------- */
function QuickViewModal() {
  const { quickViewId, closeQuickView, addToCart, toggleWishlist, isWishlisted } = useStore();
  const { products } = useStorefrontProducts();
  const product = products.find((p) => p.id === quickViewId) ?? null;
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (product) {
      triggerRef.current = document.activeElement as HTMLElement;
    }
  }, [product]);

  useEffect(() => {
    if (!product) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeQuickView();
        return;
      }
      if (e.key === "Tab" && containerRef.current) {
        const focusable = containerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [product, closeQuickView]);

  useEffect(() => {
    if (product && containerRef.current) {
      const focusable = containerRef.current.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      focusable?.focus();
    }
  }, [product]);

  useEffect(() => {
    if (!product && triggerRef.current) {
      triggerRef.current.focus();
      triggerRef.current = null;
    }
  }, [product]);

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-center justify-center p-2 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="qv-title"
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={closeQuickView} />
            <motion.div
              ref={containerRef}
              key={product.id}
              initial={{ scale: 0.96, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 16 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative grid max-h-[88vh] w-full max-w-5xl grid-cols-1 overflow-y-auto scrollbar-thin rounded-[28px] bg-[#fdf8f3] shadow-[0_24px_64px_rgba(0,0,0,0.3)] md:max-h-none md:h-[90vh] md:grid-cols-2 md:grid-rows-[1fr] md:overflow-hidden"
          >
            <button
              aria-label="Close"
              onClick={closeQuickView}
              className="absolute top-3 right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-md backdrop-blur-sm transition-colors hover:bg-white md:top-4 md:right-4 md:h-10 md:w-10"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Left: Sticky media column (desktop) */}
            <div className="md:sticky md:top-0 md:min-w-0 md:self-start">
              <QuickViewMedia product={product} />
            </div>

            {/* Right: Scrollable info column */}
            <div className="scrollbar-thin overflow-y-auto overscroll-contain md:min-w-0">
              <QuickViewInfo
                product={product}
                onAdd={(qty) => {
                  addToCart(product.id, qty);
                  closeQuickView();
                }}
                onWishlist={() => toggleWishlist(product.id)}
                wishlisted={isWishlisted(product.id)}
                onClose={closeQuickView}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------------- Quick View: Media (gallery only) ---------------- */
function QuickViewMedia({ product }: { product: Product }) {
  const gallery = [product.image, ...(product.gallery ?? [])];
  const [idx, setIdx] = useState(0);
  const [zoom, setZoom] = useState(false);

  // Reset on product change
  useEffect(() => {
    setIdx(0);
    setZoom(false);
  }, [product.id]);

  const prev = () => setIdx((i) => (i - 1 + gallery.length) % gallery.length);
  const next = () => setIdx((i) => (i + 1) % gallery.length);

  // Touch swipe
  const touchX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 40) (dx < 0 ? next : prev)();
    touchX.current = null;
  };

  return (
    <div className="flex flex-col gap-3 p-4 md:p-5">
      {/* Stage */}
      <div
        className={`relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-[20px] bg-gradient-to-br ${product.bg}`}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <>
          <img
            key={gallery[idx]}
            src={gallery[idx]}
            alt={`${product.name} — view ${idx + 1}`}
            onClick={() => setZoom(true)}
            className="h-full w-full cursor-zoom-in object-contain p-6 transition-opacity duration-300"
            loading="eager"
          />
          {gallery.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous image"
                onClick={prev}
                className="absolute top-1/2 left-3 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-md hover:bg-white"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Next image"
                onClick={next}
                className="absolute top-1/2 right-3 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-md hover:bg-white"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-semibold tracking-wider text-white">
                {idx + 1} / {gallery.length}
              </span>
            </>
          )}
          <button
            type="button"
            aria-label="Zoom"
            onClick={() => setZoom(true)}
            className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-md hover:bg-white"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
        </>
      </div>

      {/* Thumbnails */}
      {gallery.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {gallery.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setIdx(i)}
              aria-label={`View image ${i + 1}`}
              className={`flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[12px] border-2 bg-gradient-to-br ${product.bg} ${
                i === idx ? "border-[#C9A96E]" : "border-transparent"
              }`}
            >
              <img src={src} alt="" className="h-full w-full object-contain p-1.5" />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen zoom overlay */}
      <AnimatePresence>
        {zoom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-6"
            onClick={() => setZoom(false)}
          >
            <img
              src={gallery[idx]}
              alt={product.name}
              className="max-h-full max-w-full object-contain"
            />
            <button
              type="button"
              aria-label="Close zoom"
              onClick={() => setZoom(false)}
              className="absolute top-6 right-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/95"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------- Quick View: Info + Actions ---------------- */
function QuickViewInfo({
  product,
  onAdd,
  onWishlist,
  wishlisted,
  onClose,
}: {
  product: Product;
  onAdd: (qty: number) => void;
  onWishlist: () => void;
  wishlisted: boolean;
  onClose: () => void;
}) {
  const [qty, setQty] = useState(1);
  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  useEffect(() => setQty(1), [product.id]);

  const details: Array<[string, string | undefined]> = [
    ["SKU", product.sku],
    ["Category", product.category],
    ["Metal", product.metal],
    ["Purity", product.purity],
    ["Metal colour", product.metalColor],
    ["Gemstone", product.stone],
    ["Weight", product.weight],
    ["Certification", product.certification],
  ];

  return (
    <div className="flex flex-col p-6 pr-5 md:p-8 md:pr-6">
      <div className="flex items-center gap-2">
        {product.badge && (
          <span className="rounded-full bg-[#1a1a2e] px-2.5 py-1 text-[9px] font-semibold tracking-[0.14em] text-white uppercase">
            {product.badge}
          </span>
        )}
        <p className="eyebrow text-[10px]">{product.category}</p>
      </div>

      {productLink(product) ? (
        <Link
          to={productLink(product)!.to}
          params={productLink(product)!.params}
          className="font-display mt-2 text-2xl leading-tight font-semibold text-[#1a1a2e] transition-colors hover:text-[#C9A96E]"
        >
          {product.name}
        </Link>
      ) : (
        <h3
          id="qv-title"
          className="font-display mt-2 text-2xl leading-tight font-semibold text-[#1a1a2e]"
        >
          {product.name}
        </h3>
      )}

      <div className="mt-2 flex items-center gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-3.5 w-3.5 ${
              i < Math.round(product.rating) ? "fill-[#C9A96E] text-[#C9A96E]" : "text-[#e0d8cc]"
            }`}
          />
        ))}
        <span className="text-xs text-[#7a6e64]">
          {product.rating.toFixed(1)} · {product.reviews} reviews
        </span>
      </div>

      {product.shortDescription && (
        <p className="mt-4 text-sm leading-relaxed text-[#7a6e64]">{product.shortDescription}</p>
      )}

      <div className="mt-4 flex items-baseline gap-3">
        <span className="text-2xl font-bold text-[#1a1a2e]">{formatPrice(product.price)}</span>
        <span className="text-sm text-[#7a6e64] line-through">{formatPrice(product.mrp)}</span>
        {discount > 0 && (
          <span className="rounded-full bg-[#6b1330] px-2 py-0.5 text-[10px] font-bold text-white">
            -{discount}%
          </span>
        )}
      </div>

      <p
        className={`mt-1.5 text-[12px] font-semibold ${
          product.stock !== undefined && product.stock <= 5 ? "text-orange-600" : "text-green-700"
        }`}
      >
        {product.stock !== undefined && product.stock <= 5
          ? `Only ${product.stock} left in stock`
          : "In stock · ships in 3–5 days"}
      </p>

      {/* Actions */}
      <div className="mt-5 flex items-center gap-3">
        <div className="flex items-center gap-1 rounded-full border border-[#e0d8cc] p-1">
          <button
            onClick={() => setQty(Math.max(1, qty - 1))}
            aria-label="Decrease"
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#f5efe8]"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="min-w-6 text-center text-sm font-semibold">{qty}</span>
          <button
            onClick={() => setQty(qty + 1)}
            aria-label="Increase"
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#f5efe8]"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
        <button onClick={() => onAdd(qty)} className="btn-primary flex-1">
          Add to Cart
        </button>
        <button
          onClick={onWishlist}
          aria-label="Toggle wishlist"
          className={`flex h-11 w-11 items-center justify-center rounded-full border transition-colors ${
            wishlisted
              ? "border-[#C9A96E] bg-[#C9A96E] text-white"
              : "border-[#e0d8cc] text-[#7a6e64] hover:border-[#C9A96E] hover:text-[#C9A96E]"
          }`}
        >
          <Heart className={`h-4 w-4 ${wishlisted ? "fill-white" : ""}`} />
        </button>
      </div>

      <Link
        to={productLink(product)?.to ?? "/product/$productId"}
        params={productLink(product)?.params ?? { productId: product.id }}
        className="font-display text-xs font-semibold tracking-[0.14em] text-[#C9A96E] transition-colors hover:text-[#8a6a2a] uppercase"
        onClick={onClose}
      >
        View Full Details
      </Link>

      {/* Details accordions */}
      <div className="mt-6 space-y-2">
        <Accordion title="Product Details" defaultOpen>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
            {details.map(([k, v]) =>
              v ? (
                <div key={k} className="flex flex-col">
                  <dt className="text-[10px] tracking-[0.12em] text-[#7a6e64] uppercase">{k}</dt>
                  <dd className="text-[#1a1a2e]">{v}</dd>
                </div>
              ) : null,
            )}
          </dl>
          {product.fullDescription && (
            <p className="mt-3 text-xs leading-relaxed text-[#7a6e64]">{product.fullDescription}</p>
          )}
        </Accordion>

        {product.certification && (
          <Accordion title="Materials & Certification">
            <p className="text-xs leading-relaxed text-[#7a6e64]">
              {product.certification}. Every piece is quality-checked and hallmarked before it
              leaves our atelier.
            </p>
          </Accordion>
        )}

        <Accordion title="Shipping & Returns">
          <p className="text-xs leading-relaxed text-[#7a6e64]">
            {product.shippingInfo ??
              "Complimentary insured shipping across India. 15-day easy returns on unworn pieces in their original packaging."}
          </p>
        </Accordion>

        <Accordion title="Jewellery Care">
          <p className="text-xs leading-relaxed text-[#7a6e64]">
            {product.care ??
              "Store in the pouch provided. Avoid contact with perfumes, chlorine and abrasives. Wipe gently with a soft cloth after wear."}
          </p>
        </Accordion>
      </div>
    </div>
  );
}

function Accordion({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<string>(defaultOpen ? "auto" : "0px");

  useEffect(() => {
    if (contentRef.current) {
      setHeight(open ? `${contentRef.current.scrollHeight}px` : "0px");
    }
  }, [open]);

  const handleTransitionEnd = () => {
    if (open && contentRef.current) {
      setHeight("auto");
    }
  };

  return (
    <div className="rounded-[14px] border border-[#e0d8cc] bg-white">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
        aria-expanded={open}
      >
        <span className="text-[11px] font-semibold tracking-[0.14em] text-[#1a1a2e] uppercase">
          {title}
        </span>
        <Plus
          className={`h-3.5 w-3.5 transition-transform duration-300 ${open ? "rotate-45" : ""}`}
        />
      </button>
      <div
        ref={contentRef}
        style={{ maxHeight: height }}
        onTransitionEnd={handleTransitionEnd}
        className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
      >
        <div className="px-4 pb-4">{children}</div>
      </div>
    </div>
  );
}

/* ---------------- Shared bits ---------------- */
function EmptyState({
  icon,
  title,
  copy,
  cta,
  onCta,
}: {
  icon: React.ReactNode;
  title: string;
  copy: string;
  cta: string;
  onCta: () => void;
}) {
  return (
    <div className="flex flex-col items-center py-14 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-[0_4px_16px_rgba(201,169,110,0.15)]">
        {icon}
      </div>
      <p className="font-display mt-4 text-lg font-semibold text-[#1a1a2e]">{title}</p>
      <p className="mt-1 max-w-xs text-sm text-[#7a6e64]">{copy}</p>
      <Link to="/shop" onClick={onCta} className="btn-primary mt-6">
        {cta}
      </Link>
    </div>
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
