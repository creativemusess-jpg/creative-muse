import { AnimatePresence, motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  Heart,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Package,
  ShieldCheck,
  RotateCcw,
  Truck,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  formatPrice,
  PRODUCT_PLACEHOLDER,
  type Product,
  useStorefrontProducts,
} from "@/lib/products";
import { useCartLines, useStore, useWishlistProducts } from "@/lib/store";
import { productLink } from "@/lib/product-link";
import {
  giftPackagingApi,
  type GiftPackagingConfig,
  type EstimatedDeliveryConfig,
} from "@/lib/api/gift-packaging";

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
  const {
    cartOpen,
    closeCart,
    setQty,
    removeFromCart,
    cartSubtotal,
    giftPackagingEnabled,
    setGiftPackagingEnabled,
    giftMessage,
    setGiftMessage,
  } = useStore();
  const lines = useCartLines();
  const [giftCfg, setGiftCfg] = useState<GiftPackagingConfig | null>(null);
  const [estDelivery, setEstDelivery] = useState<EstimatedDeliveryConfig | null>(null);

  useEffect(() => {
    giftPackagingApi.getConfig().then(setGiftCfg);
    giftPackagingApi.getEstimatedDelivery().then(setEstDelivery);
  }, []);

  const shipping = cartSubtotal > 5000 || cartSubtotal === 0 ? 0 : 250;
  const giftPrice = giftPackagingEnabled && giftCfg?.enabled ? giftCfg?.price || 0 : 0;
  const total = cartSubtotal + shipping + giftPrice;

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
                  icon={<ShoppingBag className="h-8 w-8 text-[#9C544D]" />}
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
                        <div className="flex aspect-square w-20 shrink-0 items-center justify-center overflow-hidden rounded-[14px] bg-[#fffdf9] border border-[rgba(92,61,58,0.18)] shadow-[0_8px_24px_rgba(92,61,58,0.06)]">
                          <img
                            src={p.image}
                            alt={p.name}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-contain p-2"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="eyebrow text-[9px]">{p.metal}</p>
                          {productLink(p) ? (
                            <Link
                              to={productLink(p)!.to}
                              params={productLink(p)!.params}
                              className="font-display truncate text-sm font-semibold text-[#1a1a2e] transition-colors hover:text-[#9C544D]"
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
                              <span className="min-w-5 text-center text-xs font-semibold">
                                {qty}
                              </span>
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

                  {/* Trust Features */}
                  <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                    <div className="flex items-center gap-2.5 rounded-[12px] border border-[#e0d8cc] bg-white p-3">
                      <Truck className="h-4 w-4 shrink-0 text-[#9C544D]" />
                      <div>
                        <p className="text-[11px] font-semibold text-[#1a1a2e]">Free Shipping</p>
                        <p className="text-[9px] text-[#7a6e64]">Free delivery across India.</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 rounded-[12px] border border-[#e0d8cc] bg-white p-3">
                      <RotateCcw className="h-4 w-4 shrink-0 text-[#9C544D]" />
                      <div>
                        <p className="text-[11px] font-semibold text-[#1a1a2e]">
                          7-Day Easy Returns
                        </p>
                        <p className="text-[9px] text-[#7a6e64]">Easy return & exchange policy.</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 rounded-[12px] border border-[#e0d8cc] bg-white p-3">
                      <ShieldCheck className="h-4 w-4 shrink-0 text-[#9C544D]" />
                      <div>
                        <p className="text-[11px] font-semibold text-[#1a1a2e]">Secure Checkout</p>
                        <p className="text-[9px] text-[#7a6e64]">
                          100% secure payments with Razorpay.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Gift Packaging */}
                  {giftCfg?.enabled && giftCfg?.status === "active" && (
                    <div className="mt-4 rounded-[16px] border border-[#e0d8cc] bg-white p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <Package className="mt-0.5 h-5 w-5 shrink-0 text-[#9C544D]" />
                          <div>
                            <p className="text-[13px] font-semibold text-[#1a1a2e]">
                              {giftCfg.name}
                            </p>
                            <p className="mt-0.5 text-[11px] text-[#7a6e64]">
                              {giftCfg.description}
                            </p>
                            <p className="mt-1 text-[13px] font-bold text-[#9C544D]">
                              {formatPrice(giftCfg.price)}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={giftPackagingEnabled}
                          onClick={() => setGiftPackagingEnabled(!giftPackagingEnabled)}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                            giftPackagingEnabled ? "bg-[#9C544D]" : "bg-gray-200"
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 translate-y-0 rounded-full bg-white shadow transition-transform ${
                              giftPackagingEnabled ? "translate-x-4" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>

                      {/* Gift Message */}
                      {giftPackagingEnabled && giftCfg.allow_gift_message && (
                        <div className="mt-3 border-t border-[#e0d8cc]/60 pt-3">
                          <label className="text-[11px] font-semibold text-[#1a1a2e]">
                            Gift Message
                          </label>
                          <textarea
                            value={giftMessage}
                            onChange={(e) => {
                              if (e.target.value.length <= giftCfg.max_message_length) {
                                setGiftMessage(e.target.value);
                              }
                            }}
                            placeholder="Happy Birthday!"
                            rows={2}
                            maxLength={giftCfg.max_message_length}
                            className="mt-1.5 w-full rounded-[10px] border border-[#e0d8cc] bg-[#fdf8f3] px-3 py-2 text-[12px] outline-none focus:border-[#9C544D] resize-none"
                          />
                          <p className="mt-1 text-right text-[9px] text-[#7a6e64]">
                            {giftMessage.length}/{giftCfg.max_message_length}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Estimated Delivery */}
                  {estDelivery?.enabled && (
                    <div className="mt-3 flex items-center gap-2.5 rounded-[12px] border border-[#e0d8cc] bg-white p-3">
                      <Truck className="h-4 w-4 shrink-0 text-[#9C544D]" />
                      <p className="text-[11px] text-[#1a1a2e]">
                        <span className="font-semibold">Estimated Delivery:</span> Ships in{" "}
                        {estDelivery.min_days}–{estDelivery.max_days} Business Days
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>

            {lines.length > 0 && (
              <footer className="border-t border-[#e0d8cc] bg-white px-6 py-5">
                <div className="space-y-1.5 text-sm">
                  <Row label="Subtotal" value={formatPrice(cartSubtotal)} />
                  {giftPrice > 0 && (
                    <Row label={giftCfg?.name || "Gift Packaging"} value={formatPrice(giftPrice)} />
                  )}
                  <Row label="Shipping" value={shipping === 0 ? "Free" : formatPrice(shipping)} />
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
                  icon={<Heart className="h-8 w-8 text-[#9C544D]" />}
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
                      <div className="flex aspect-square w-20 shrink-0 items-center justify-center overflow-hidden rounded-[14px] bg-[#fffdf9] border border-[rgba(92,61,58,0.18)] shadow-[0_8px_24px_rgba(92,61,58,0.06)]">
                        <img
                          src={p.image}
                          alt={p.name}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-contain p-2"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="eyebrow text-[9px]">{p.metal}</p>
                        {productLink(p) ? (
                          <Link
                            to={productLink(p)!.to}
                            params={productLink(p)!.params}
                            className="font-display truncate text-sm font-semibold text-[#1a1a2e] transition-colors hover:text-[#9C544D]"
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
                            className="rounded-full bg-[#9C544D] px-3 py-1.5 text-[10px] font-semibold tracking-[0.1em] text-white uppercase hover:bg-[#7A3D3A]"
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
  const [zoomActive, setZoomActive] = useState(false);

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
          className="fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto p-0 sm:items-center sm:p-4"
          style={{ paddingTop: "env(safe-area-inset-top)", paddingBottom: "env(safe-area-inset-bottom)" }}
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
            className="relative grid max-h-[100dvh] w-full max-w-5xl grid-cols-1 overflow-y-auto overscroll-contain rounded-[28px] bg-[#fdf8f3] shadow-[0_24px_64px_rgba(0,0,0,0.3)] sm:max-h-[88vh] md:max-h-none md:h-[90vh] md:grid-cols-2 md:grid-rows-[1fr] md:overflow-hidden"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {!zoomActive && (
              <button
                aria-label="Close"
                onClick={closeQuickView}
                className="absolute top-3 right-3 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-[#9C544D] bg-white shadow-md transition-colors hover:bg-white md:top-4 md:right-4"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            {/* Left: Sticky media column (desktop) */}
            <div className="md:sticky md:top-0 md:min-w-0 md:self-start">
              <QuickViewMedia product={product} onZoomChange={setZoomActive} />
            </div>

            {/* Right: Scrollable info column */}
            <div className="md:overflow-y-auto md:overscroll-contain md:min-w-0">
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
function QuickViewMedia({
  product,
  onZoomChange,
}: {
  product: Product;
  onZoomChange?: (v: boolean) => void;
}) {
  const gallery = [product.image, ...(product.gallery ?? [])];
  const [idx, setIdx] = useState(0);
  const [zoom, setZoom] = useState(false);

  useEffect(() => {
    onZoomChange?.(zoom);
  }, [zoom, onZoomChange]);

  // Reset on product change
  useEffect(() => {
    setIdx(0);
    setZoom(false);
  }, [product.id]);

  const prev = () => setIdx((i) => (i - 1 + gallery.length) % gallery.length);
  const next = () => setIdx((i) => (i + 1) % gallery.length);

  // Touch swipe — direction-aware: only capture horizontal swipes
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    touchStart.current = null;
    // Only handle horizontal swipes (dx must exceed dy and threshold)
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      (dx < 0 ? next : prev)();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoom(false);
      if (e.key === "ArrowLeft") setIdx((i) => (i - 1 + gallery.length) % gallery.length);
      if (e.key === "ArrowRight") setIdx((i) => (i + 1) % gallery.length);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [gallery.length]);

  return (
    <div className="flex flex-col gap-3 p-4 md:p-5">
      {/* Stage */}
      <div
        className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-[20px] bg-[#fffdf9] border border-[rgba(92,61,58,0.18)] shadow-[0_8px_24px_rgba(92,61,58,0.06)]"
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
            decoding="async"
            onError={(e) => {
              const t = e.currentTarget;
              if (t.dataset.fallback) return;
              t.dataset.fallback = "1";
              t.src = PRODUCT_PLACEHOLDER;
            }}
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
            className="absolute top-3 left-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-md hover:bg-white md:left-auto md:right-3"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
        </>
      </div>

      {/* Thumbnails */}
      <Thumbnails gallery={gallery} idx={idx} setIdx={setIdx} />

      {/* Fullscreen gallery viewer */}
      <AnimatePresence>
        {zoom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 md:p-8"
            onClick={() => setZoom(false)}
            onTouchStart={(e) => {
              touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            }}
            onTouchEnd={(e) => {
              if (touchStart.current == null) return;
              const dx = e.changedTouches[0].clientX - touchStart.current.x;
              const dy = e.changedTouches[0].clientY - touchStart.current.y;
              touchStart.current = null;
              if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
                (dx < 0 ? next : prev)();
              }
            }}
          >
            {/* Close */}
            <button
              type="button"
              aria-label="Close gallery"
              onClick={() => setZoom(false)}
              className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Counter */}
            {gallery.length > 1 && (
              <span className="absolute top-5 left-1/2 z-10 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold tracking-wider text-white backdrop-blur-sm">
                {idx + 1} / {gallery.length}
              </span>
            )}

            {/* Previous */}
            {gallery.length > 1 && (
              <button
                type="button"
                aria-label="Previous image"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                className="absolute top-1/2 left-3 z-10 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            )}

            {/* Image */}
            <img
              key={idx}
              src={gallery[idx]}
              alt={`${product.name} — view ${idx + 1}`}
              className="max-h-[90vh] max-w-[90vw] select-none object-contain"
              onClick={(e) => e.stopPropagation()}
              draggable={false}
            />

            {/* Next */}
            {gallery.length > 1 && (
              <button
                type="button"
                aria-label="Next image"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                className="absolute top-1/2 right-3 z-10 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* Thumbnail strip with passive-safe wheel handler */
function Thumbnails({
  gallery,
  idx,
  setIdx,
}: {
  gallery: string[];
  idx: number;
  setIdx: (i: number) => void;
}) {
  const thumbRef = useRef<HTMLDivElement>(null);
  const dragData = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false });

  useEffect(() => {
    const el = thumbRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      if (!e.deltaY) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, []);

  return (
    <div
      ref={thumbRef}
      className="scrollbar-hide flex gap-1.5 overflow-x-auto scroll-smooth pb-1 sm:gap-2"
      onPointerDown={(e) => {
        const dd = dragData.current;
        dd.active = true;
        dd.startX = e.clientX;
        dd.scrollLeft = e.currentTarget.scrollLeft;
        dd.moved = false;
      }}
      onPointerMove={(e) => {
        const dd = dragData.current;
        if (!dd.active) return;
        const dx = e.clientX - dd.startX;
        if (Math.abs(dx) > 4) dd.moved = true;
        e.currentTarget.scrollLeft = dd.scrollLeft - dx;
      }}
      onPointerUp={() => {
        dragData.current.active = false;
      }}
      onPointerLeave={() => {
        dragData.current.active = false;
      }}
    >
      {gallery.map((src, i) => (
        <button
          key={src + i}
          type="button"
          onClick={() => {
            if (dragData.current.moved) return;
            setIdx(i);
            if (thumbRef.current) {
              const child = thumbRef.current.children[i] as HTMLElement;
              child?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
            }
          }}
          aria-label={`View image ${i + 1}`}
          className={`flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-[12px] border-2 bg-[#fffdf9] sm:h-16 sm:w-16 ${
            i === idx ? "border-[#9C544D]" : "border-[rgba(92,61,58,0.18)]"
          }`}
        >
          <img
            src={src}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-contain p-1.5"
          />
        </button>
      ))}
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
  const discount =
    product.mrp > product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : 0;

  useEffect(() => setQty(1), [product.id]);

  const details: Array<[string, string | undefined]> = [
    ["Category", product.category],
    ...(product.specifications || []).map((s) => [s.name, s.value] as [string, string | undefined]),
  ];

  return (
    <div className="flex flex-col p-6 pr-5 md:p-8 md:pr-6">
      <div className="flex items-center gap-2">
        {product.flags
          ?.filter((f) => f.badge_label)
          .slice(0, 2)
          .map((flag) => (
            <span
              key={flag.id}
              className="rounded-full px-2 py-[2px] text-[9px] font-semibold tracking-[0.12em] uppercase"
              style={{
                backgroundColor: flag.badge_bg_color || "#1a1a2e",
                color: flag.badge_text_color || "#ffffff",
              }}
            >
              {flag.badge_label}
            </span>
          ))}
        <p className="eyebrow text-[10px]">{product.category}</p>
      </div>

      {productLink(product) ? (
        <Link
          to={productLink(product)!.to}
          params={productLink(product)!.params}
          className="font-display mt-2 text-2xl leading-tight font-semibold text-[#1a1a2e] transition-colors hover:text-[#9C544D]"
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

      {product.shortDescription && (
        <p className="mt-4 text-sm leading-relaxed text-[#7a6e64]">{product.shortDescription}</p>
      )}

      <div className="mt-4 flex items-baseline gap-3">
        <span className="text-2xl font-bold text-[#1a1a2e]">{formatPrice(product.price)}</span>
        {discount > 0 && (
          <span className="text-sm text-[#7a6e64] line-through">{formatPrice(product.mrp)}</span>
        )}
        {discount > 0 && (
          <span className="rounded-full bg-[#9C544D] px-2 py-0.5 text-[10px] font-bold text-white">
            -{discount}%
          </span>
        )}
      </div>

      <p className="mt-1.5 text-[12px] font-semibold text-green-700">
        In stock · ships in 3–5 days
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
              ? "border-[#9C544D] bg-[#9C544D] text-white"
              : "border-[#e0d8cc] text-[#7a6e64] hover:border-[#9C544D] hover:text-[#9C544D]"
          }`}
        >
          <Heart className={`h-4 w-4 ${wishlisted ? "fill-white" : ""}`} />
        </button>
      </div>

      <Link
        to={productLink(product)?.to ?? "/product/$productId"}
        params={productLink(product)?.params ?? { productId: product.id }}
        className="mt-5 flex items-center justify-center gap-1.5 text-[11px] font-semibold tracking-[0.16em] text-[#9C544D] transition-colors hover:text-[#9C544D] uppercase"
        onClick={onClose}
      >
        View Full Details
        <ChevronRight className="h-3.5 w-3.5" />
      </Link>

      {/* Details accordions */}
      <div className="mt-6 space-y-2">
        <Accordion title="Product Details" defaultOpen>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
            {details.map(([k, v]) =>
              v ? (
                <div key={k} className="flex flex-col">
                  <dt className="text-[10px] tracking-[0.12em] text-[#7a6e64] uppercase">{k}</dt>
                  <dd className="text-[#9C544D]">{v}</dd>
                </div>
              ) : null,
            )}
          </dl>
          {product.fullDescription && (
            <p className="mt-3 text-xs leading-relaxed text-[#7a6e64]">{product.fullDescription}</p>
          )}
        </Accordion>

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
        <span className="text-[11px] font-semibold tracking-[0.14em] text-[#9C544D] uppercase">
          {title}
        </span>
        <Plus
          className={`h-3.5 w-3.5 text-[#9C544D] transition-transform duration-300 ${open ? "rotate-45" : ""}`}
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
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-[0_4px_16px_rgba(156,84,77,0.15)]">
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
