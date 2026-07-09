import { memo, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Heart, Star, ShoppingBag, Eye } from "lucide-react";
import { type Product, formatPrice } from "@/lib/products";
import { useStore } from "@/lib/store";

const BADGE_STYLE: Record<NonNullable<Product["badge"]>, string> = {
  New: "bg-[#0f4c3a] text-white",
  "Best Seller": "bg-[#a8843a] text-white",
  Wedding: "bg-[#6b1330] text-white",
  Trending: "bg-[#151a2e] text-white",
};

export const ProductCard = memo(function ProductCard({
  product,
  index = 0,
  pointerStart,
}: {
  product: Product;
  index?: number;
  pointerStart?: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  const { addToCart, toggleWishlist, isWishlisted, openQuickView } = useStore();
  const wishlisted = isWishlisted(product.id);
  const internalPointer = useRef({ x: 0, y: 0 });
  const ps = pointerStart ?? internalPointer;
  const prefersReduced = useReducedMotion();
  return (
    <motion.div
      initial={prefersReduced ? {} : { opacity: 0, y: 24 }}
      whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.06 }}
      whileHover={prefersReduced ? {} : { y: -8 }}
      className="group flex h-full flex-col overflow-hidden rounded-[12px] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-shadow duration-400 md:rounded-[24px] md:shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:md:shadow-[0_20px_60px_rgba(0,0,0,0.12)]"
    >
      <div
        role="button"
        tabIndex={0}
        onClick={(e) => {
          const dx = Math.abs(e.clientX - ps.current.x);
          const dy = Math.abs(e.clientY - ps.current.y);
          if (dx > 8 || dy > 8) return;
          openQuickView(product.id);
        }}
        onPointerDown={(e) => {
          ps.current = { x: e.clientX, y: e.clientY };
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openQuickView(product.id);
          }
        }}
        className="relative block text-left"
        aria-label={`Quick view ${product.name}`}
      >
        <div className={`relative aspect-[1/1.08] overflow-hidden bg-gradient-to-br ${product.bg} md:aspect-square`}>
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            width={1024}
            height={1024}
            className="absolute inset-0 h-full w-full object-contain p-2 transition-transform duration-700 group-hover:scale-[1.06] md:p-3"
            onError={(e) => { const t = e.currentTarget; if (t.dataset.fallback) { t.style.display = "none"; return; } t.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect fill='%23f5efe8' width='400' height='400'/%3E%3C/svg%3E"; t.dataset.fallback = "1"; }}
          />

          <div className="absolute top-2 left-2 flex flex-col gap-1 md:top-3 md:left-3">
            {product.badge && (
              <span
                className={`rounded-full px-1.5 py-0.5 text-[8px] font-semibold tracking-[0.1em] uppercase shadow-sm md:px-2.5 md:py-1 md:text-[9px] md:tracking-[0.14em] ${BADGE_STYLE[product.badge]}`}
              >
                {product.badge}
              </span>
            )}
            {discount > 0 && (
              <span className="rounded-full bg-[#a83232] px-1.5 py-0.5 text-[8px] font-bold tracking-wide text-white shadow-sm md:px-2.5 md:py-1 md:text-[9px]">
                -{discount}%
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              toggleWishlist(product.id);
            }}
            aria-label="Wishlist"
            className={`absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.08)] backdrop-blur-sm transition-all duration-300 md:h-9 md:w-9 md:top-3 md:right-3 hover:md:shadow-[0_12px_24px_rgba(201,169,110,0.35)] ${
              wishlisted ? "bg-[#8a6a2a] text-white" : "bg-white/90 hover:bg-white"
            }`}
          >
            <Heart
              className={`h-3 w-3 transition-colors md:h-4 md:w-4 ${
                wishlisted ? "fill-white text-white" : "text-[#5a4e44] hover:text-[#8a6a2a]"
              }`}
            />
          </button>

          <div className="absolute right-2 bottom-2 opacity-100 transition-all duration-400 md:right-3 md:bottom-3 md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-[#1a1a2e] shadow-sm backdrop-blur-sm md:h-auto md:w-auto md:rounded-full md:bg-white/95 md:px-4 md:py-2 md:text-[11px] md:font-semibold md:tracking-[0.16em] md:uppercase">
              <Eye className="h-3 w-3 md:hidden" />
              <span className="hidden md:inline">Quick View</span>
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-2.5 md:p-4">
        <p className="text-[9px] tracking-[0.08em] text-[#7a6e64] uppercase md:text-[10px] md:tracking-[0.1em]">
          {product.metal} · {product.stone}
        </p>
        <h3 className="font-display mt-1 line-clamp-2 min-h-[2.4em] text-[13px] leading-snug font-semibold text-[#1a1a2e] md:mt-1.5 md:min-h-[38px] md:text-[14px]">
          {product.name}
        </h3>
        <div className="mt-1 flex items-center gap-1 md:mt-1.5 md:gap-1.5">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-2.5 w-2.5 md:h-3 md:w-3 ${i < Math.round(product.rating) ? "fill-[#C9A96E] text-[#C9A96E]" : "text-[#e0d8cc]"}`}
              />
            ))}
          </div>
          <span className="text-[10px] text-[#7a6e64] md:text-[11px]">({product.reviews})</span>
        </div>
        <div className="mt-1.5 flex items-baseline gap-1.5 md:mt-2 md:gap-2">
          <span className="text-[15px] font-bold text-[#1a1a2e] md:text-[17px]">{formatPrice(product.price)}</span>
          <span className="text-[10px] text-[#7a6e64] line-through md:text-[12px]">{formatPrice(product.mrp)}</span>
        </div>
        <div className="min-h-[14px] md:min-h-[18px]">
          {product.stock !== undefined && product.stock <= 5 && (
            <p className="mt-0.5 text-[10px] font-semibold text-[#c0603a] md:mt-1 md:text-[11px]">
              Only {product.stock} left
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => addToCart(product.id, 1)}
          className="mt-auto flex min-h-[36px] w-full items-center justify-center gap-1.5 rounded-[10px] bg-gradient-to-r from-[#C9A96E] to-[#B8860B] text-[11px] font-semibold tracking-[0.08em] text-white uppercase transition-all duration-300 md:min-h-[44px] md:gap-2 md:rounded-full md:text-[12px] md:tracking-[0.12em] hover:md:shadow-[0_12px_32px_rgba(201,169,110,0.4)]"
        >
          <ShoppingBag className="h-3 w-3 md:h-3.5 md:w-3.5" />
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
});
