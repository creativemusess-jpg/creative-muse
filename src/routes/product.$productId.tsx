import { useState, useEffect, useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, ShoppingBag, ChevronRight, ZoomIn, Plus, X, ChevronLeft } from "lucide-react";
import { PageShell } from "@/components/site/PageHeader";
import { ProductCard } from "@/components/site/ProductCard";
import { formatPrice, getRecommendedProducts, type Product, useStorefrontProduct, useStorefrontProducts } from "@/lib/products";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/product/$productId")({
  head: ({ params }) => {
    return {
      meta: [
        { title: `${params.productId} - Creative Muse` },
        {
          name: "description",
          content: "Explore fine jewellery at Creative Muse.",
        },
      ],
    };
  },
  component: ProductDetailsPage,
});

function ProductDetailsPage() {
  const { productId } = Route.useParams();
  const { product, isLoading, error } = useStorefrontProduct(productId);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [productId]);

  if (isLoading) {
    return (
      <PageShell>
        <section className="mx-auto max-w-[720px] px-6 py-24 text-center">
          <h1 className="font-display text-4xl font-semibold text-[#1a1a2e]">Loading jewellery...</h1>
        </section>
      </PageShell>
    );
  }

  if (!product) {
    return (
      <PageShell>
        <section className="mx-auto max-w-[720px] px-6 py-24 text-center">
          <h1 className="font-display text-4xl font-semibold text-[#1a1a2e]">Product not found</h1>
          <p className="mt-3 text-[#7a6e64]">
            {error ? "Live product data could not be loaded." : "This jewellery piece is no longer available."}
          </p>
          <Link to="/shop" className="btn-primary mt-8 inline-flex">
            Back to Shop
          </Link>
        </section>
      </PageShell>
    );
  }

  return <ProductContent product={product} />;
}

const fallbackImg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect fill='%23f5efe8' width='400' height='400'/%3E%3Ctext x='200' y='200' text-anchor='middle' fill='%23c9a96e' font-family='serif' font-size='24'%3ECreative Muse%3C/text%3E%3C/svg%3E";
const safeSrc = (src: string) => (src && src.trim() ? src : fallbackImg);

function ProductContent({ product }: { product: Product }) {
  const discount =
    product.mrp > product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : 0;
  const { addToCart, toggleWishlist, isWishlisted, openQuickView } = useStore();
  const wishlisted = isWishlisted(product.id);
  const gallery = [product.image, ...(product.gallery ?? [])];
  const [imgIdx, setImgIdx] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [accOpen, setAccOpen] = useState<Record<string, boolean>>({
    details: true,
  });
  const prev = () => setImgIdx((i) => (i - 1 + gallery.length) % gallery.length);
  const next = () => setImgIdx((i) => (i + 1) % gallery.length);
  const touchStartX = useRef(0);
  const thumbRef = useRef<HTMLDivElement>(null);
  const dragData = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false });

  useEffect(() => {
    setImgIdx(0);
    setZoom(false);
    setAccOpen({ details: true });
  }, [product.id]);

  useEffect(() => {
    if (!zoom) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoom(false);
      if (e.key === "ArrowLeft") setImgIdx((i) => (i - 1 + gallery.length) % gallery.length);
      if (e.key === "ArrowRight") setImgIdx((i) => (i + 1) % gallery.length);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [zoom, gallery.length]);

  const validUrl = (u: string | undefined | null) => (u && u.trim() ? u : null);
  const displayImage = validUrl(gallery[imgIdx]) || gallery.find((g) => validUrl(g)) || null;

  const { products } = useStorefrontProducts();
  const recommended = getRecommendedProducts(product, products, 6);

  const details: Array<[string, string | undefined]> = [
    ["Category", product.category],
    ["Collection", product.collection],
    ...(product.specifications || []).map((s) => [s.name, s.value] as [string, string | undefined]),
  ];

  const toggleAcc = (key: string) => setAccOpen((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <PageShell>
      {/* Breadcrumbs */}
      <div className="mx-auto flex max-w-[1180px] items-center gap-1.5 px-5 pt-6 pb-2 text-[11px] font-semibold tracking-[0.1em] text-[#5C1A1A] uppercase sm:px-6">
        <Link to="/" className="transition-colors hover:text-[#C9A96E]">
          Home
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/shop" className="transition-colors hover:text-[#C9A96E]">
          Shop
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-[#5C1A1A]">{product.name}</span>
      </div>

      <section className="mx-auto grid max-w-[1180px] gap-8 px-5 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.8fr)] lg:gap-12 lg:py-12">
        {/* Left — Gallery */}
        <div className="min-w-0">
          {/* Main image */}
          <div className="relative overflow-hidden rounded-[28px] bg-[#fffdf9] border border-[rgba(66,29,34,0.18)] shadow-[0_8px_24px_rgba(66,29,34,0.06)]">
            <img
              src={safeSrc(gallery[imgIdx])}
              alt={`${product.name} — view ${imgIdx + 1}`}
              className="aspect-square h-full w-full object-contain p-8 sm:p-12"
              onError={(e) => {
                const img = e.currentTarget;
                if (img.dataset.fallback) return;
                const next = gallery.find((g) => g !== gallery[imgIdx] && validUrl(g));
                if (next) { img.src = next; img.dataset.fallback = "1"; }
                else { img.src = fallbackImg; img.dataset.fallback = "1"; }
              }}
            />
            {product.flags?.filter((f) => f.badge_label).slice(0, 1).map((flag) => (
              <span
                key={flag.id}
                className="absolute left-4 top-4 rounded-full px-2 py-[2px] text-[10px] font-semibold uppercase tracking-[0.14em]"
                style={{ backgroundColor: flag.badge_bg_color || "#421D22", color: flag.badge_text_color || "#ffffff" }}
              >
                {flag.badge_label}
              </span>
            ))}
            <button
              type="button"
              aria-label="Zoom"
              onClick={() => setZoom(true)}
              className="absolute right-4 bottom-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-md hover:bg-white"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
          </div>

          {/* Thumbnails */}
          {gallery.length > 1 && (
            <div
              ref={thumbRef}
              className="scrollbar-hide mt-3 flex gap-1.5 overflow-x-auto scroll-smooth pb-1 sm:gap-2"
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
              onPointerUp={() => { dragData.current.active = false; }}
              onPointerLeave={() => { dragData.current.active = false; }}
            >
              {gallery.map((src, i) => (
                <button
                  key={src + i}
                  type="button"
                  onClick={() => {
                    if (dragData.current.moved) return;
                    setImgIdx(i);
                    if (thumbRef.current) {
                      const child = thumbRef.current.children[i] as HTMLElement;
                      child?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
                    }
                  }}
                  aria-label={`View image ${i + 1}`}
                  className={`flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-[12px] border-2 bg-[#fffdf9] sm:h-16 sm:w-16 ${
                    i === imgIdx ? "border-[#C9A96E]" : "border-[rgba(66,29,34,0.18)]"
                  }`}
                >
                  <img src={safeSrc(src)} alt="" className="h-full w-full object-contain p-1.5" />
                </button>
              ))}
            </div>
          )}

          {/* Wheel handler (passive: false to prevent console warning) */}
          {gallery.length > 1 && <PassiveWheel targetRef={thumbRef} />}
        </div>

        {/* Right — Product Info */}
        <div className="min-w-0">
          <p className="eyebrow text-[10px]">{product.category}</p>
          <h1 className="font-display mt-3 text-3xl font-semibold leading-tight text-[#1a1a2e] sm:text-4xl">
            {product.name}
          </h1>

          {product.shortDescription && (
            <p className="mt-5 text-[15px] leading-relaxed text-[#6b5d52]">
              {product.shortDescription}
            </p>
          )}

          <div className="mt-6 flex flex-wrap items-baseline gap-3">
            <span className="text-3xl font-bold text-[#1a1a2e]">{formatPrice(product.price)}</span>
            {discount > 0 && (
              <span className="text-base text-[#7a6e64] line-through">
                {formatPrice(product.mrp)}
              </span>
            )}
            {discount > 0 && (
              <span className="rounded-full bg-[#7A2533] px-3 py-1 text-xs font-semibold text-white">
                {discount}% off
              </span>
            )}
          </div>

          <p className="mt-2 text-[13px] font-semibold text-green-700">
            In stock · ships in 3–5 days
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => addToCart(product.id, 1)}
              className="btn-primary flex-1"
            >
              <ShoppingBag className="h-4 w-4" />
              Add to Cart
            </button>
            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              className={`btn-secondary flex items-center justify-center gap-2 ${
                wishlisted ? "bg-[#C9A96E] text-white border-[#C9A96E]" : ""
              }`}
            >
              <Heart className={`h-4 w-4 ${wishlisted ? "fill-white" : ""}`} />
              {wishlisted ? "Wishlisted" : "Wishlist"}
            </button>
          </div>

          {/* Accordion sections */}
          <div className="mt-8 space-y-2">
            <InfoAccordion
              title="Product Details"
              open={accOpen.details}
              onToggle={() => toggleAcc("details")}
            >
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                {details.map(([k, v]) =>
                  v ? (
                    <div key={k} className="flex flex-col gap-0.5">
                      <dt className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#C9A96E]">
                        {k}
                      </dt>
                      <dd className="text-[#3a3028]">{v}</dd>
                    </div>
                  ) : null,
                )}
              </div>
              {product.fullDescription && (
                <p className="mt-3 text-xs leading-relaxed text-[#7a6e64]">
                  {product.fullDescription}
                </p>
              )}
            </InfoAccordion>

            <InfoAccordion
              title="Shipping & Returns"
              open={accOpen["shipping"]}
              onToggle={() => toggleAcc("shipping")}
            >
              <p className="text-xs leading-relaxed text-[#7a6e64]">
                Complimentary insured shipping across India. 15-day easy returns on unworn pieces in
                their original packaging.
              </p>
            </InfoAccordion>

            <InfoAccordion
              title="Jewellery Care"
              open={accOpen["care"]}
              onToggle={() => toggleAcc("care")}
            >
              <p className="text-xs leading-relaxed text-[#7a6e64]">
                {product.care ??
                  "Store in the pouch provided. Avoid contact with perfumes, chlorine and abrasives. Wipe gently with a soft cloth after wear."}
              </p>
            </InfoAccordion>
          </div>
        </div>
      </section>

      {/* Recommended Products */}
      {recommended.length > 0 && (
        <section className="mx-auto max-w-[1180px] px-5 pb-16 sm:px-6">
          <h2 className="font-display text-center text-2xl font-semibold text-[#1a1a2e] sm:text-3xl">
            Recommended For You
          </h2>
          <div className="mt-8">
            <Carousel opts={{ align: "start", dragFree: true }}>
              <CarouselContent className="-ml-3 md:-ml-4">
                {recommended.slice(0, 6).map((rec, i) => (
                  <CarouselItem key={rec.id} className="basis-[48%] pl-3 sm:basis-[45%] md:basis-1/3 md:pl-4 lg:basis-1/4">
                    <ProductCard product={rec} index={i} />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </section>
      )}

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
            onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
            onTouchEnd={(e) => {
              const dx = e.changedTouches[0].clientX - touchStartX.current;
              if (Math.abs(dx) > 50) (dx < 0 ? next : prev)();
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
                {imgIdx + 1} / {gallery.length}
              </span>
            )}

            {/* Previous */}
            {gallery.length > 1 && (
              <button
                type="button"
                aria-label="Previous image"
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute top-1/2 left-3 z-10 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            )}

            {/* Image */}
            <img
              key={imgIdx}
              src={safeSrc(gallery[imgIdx])}
              alt={`${product.name} — view ${imgIdx + 1}`}
              className="max-h-[90vh] max-w-[90vw] select-none object-contain"
              onClick={(e) => e.stopPropagation()}
              draggable={false}
            />

            {/* Next */}
            {gallery.length > 1 && (
              <button
                type="button"
                aria-label="Next image"
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute top-1/2 right-3 z-10 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </PageShell>
  );
}

function InfoAccordion({
  title,
  children,
  open,
  onToggle,
}: {
  title: string;
  children: React.ReactNode;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-[16px] border border-[#e0d8cc] bg-white">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-4 py-3.5 text-left"
        aria-expanded={open}
      >
        <span className="text-[12px] font-semibold tracking-[0.14em] text-[#1a1a2e] uppercase">
          {title}
        </span>
        <Plus
          className={`h-3.5 w-3.5 text-[#C9A96E] transition-transform duration-300 ${
            open ? "rotate-45" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${
          open ? "max-h-[600px]" : "max-h-0"
        }`}
      >
        <div className="px-4 pb-4">{children}</div>
      </div>
    </div>
  );
}

/* Registers a wheel listener with passive:false to avoid console warning */
function PassiveWheel({ targetRef }: { targetRef: React.RefObject<HTMLDivElement | null> }) {
  useEffect(() => {
    const el = targetRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      if (!e.deltaY) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, [targetRef]);
  return null;
}
