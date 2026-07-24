import { memo, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import { type Product, formatPrice } from "@/lib/products";
import { useStore } from "@/lib/store";
import { productLink } from "@/lib/product-link";

const BADGE_STYLE: Record<NonNullable<Product["badge"]>, string> = {
  New: "bg-[#421D22] text-white",
  "Best Seller": "bg-gradient-to-r from-[#421D22] to-[#633039] text-white",
  Wedding: "bg-[#7A2533] text-white",
  Trending: "bg-[#421D22] text-white",
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
        <div className="relative aspect-[1/1.08] overflow-hidden md:aspect-square rounded-[14px] md:rounded-[18px] bg-[#fffdf9] border border-[rgba(66,29,34,0.18)] shadow-[0_8px_24px_rgba(66,29,34,0.06)]">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            width={1024}
            height={1024}
            className="absolute inset-0 h-full w-full object-contain p-2 transition-transform duration-700 group-hover:scale-[1.06] md:p-3"
            onError={(e) => { const t = e.currentTarget; if (t.dataset.fallback) { t.style.display = "none"; return; } t.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect fill='%23fffdf9' width='400' height='400'/%3E%3C/svg%3E"; t.dataset.fallback = "1"; }}
          />

          <div className="absolute top-2 left-2 flex flex-col gap-0.5 md:top-2.5 md:left-2.5">
            {product.badge && (
              <span
                className={`rounded-full px-1.5 py-[2px] text-[9px] font-semibold tracking-[0.08em] uppercase shadow-sm md:px-2 md:py-[2px] md:text-[10px] md:tracking-[0.1em] ${BADGE_STYLE[product.badge]}`}
              >
                {product.badge}
              </span>
            )}
            {discount > 0 && (
              <span className="rounded-full bg-[#7A2533] px-1.5 py-[2px] text-[9px] font-bold tracking-wide text-white shadow-sm md:px-2 md:py-[2px] md:text-[10px]">
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
            className={`absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all duration-300 md:h-9 md:w-9 md:top-3 md:right-3 ${
              wishlisted
                ? "bg-[#421D22] text-white"
                : "bg-white text-[#421D22] border border-[rgba(66,29,34,0.24)] hover:bg-[#421D22] hover:text-white"
            }`}
          >
            <Heart
              className={`h-3 w-3 transition-colors md:h-4 md:w-4 ${
                wishlisted ? "fill-white text-white" : "text-[#421D22]"
              }`}
            />
          </button>

          <div className="absolute right-2 bottom-2 opacity-100 transition-all duration-400 md:right-3 md:bottom-3 md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-[#421D22] shadow-sm backdrop-blur-sm border border-[rgba(66,29,34,0.15)] md:h-auto md:w-auto md:rounded-full md:bg-white/95 md:px-4 md:py-2 md:text-[11px] md:font-semibold md:tracking-[0.16em] md:uppercase md:border md:border-[rgba(66,29,34,0.15)]">
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
        {(productLink(product) ? (
          <Link
            to={productLink(product)!.to}
            params={productLink(product)!.params}
            className="font-display mt-1 line-clamp-2 min-h-[2.4em] text-[13px] leading-snug font-semibold text-[#1a1a2e] transition-colors hover:text-[#C9A96E] md:mt-1.5 md:min-h-[38px] md:text-[14px]"
          >
            {product.name}
          </Link>
        ) : (
          <h3 className="font-display mt-1 line-clamp-2 min-h-[2.4em] text-[13px] leading-snug font-semibold text-[#1a1a2e] md:mt-1.5 md:min-h-[38px] md:text-[14px]">
            {product.name}
          </h3>
        ))}
        <div className="mt-1.5 flex items-baseline gap-1.5 md:mt-2 md:gap-2">
          <span className="text-[15px] font-bold text-[#1a1a2e] md:text-[17px]">{formatPrice(product.price)}</span>
          <span className="text-[10px] text-[#7a6e64] line-through md:text-[12px]">{formatPrice(product.mrp)}</span>
        </div>
        <div className="min-h-[14px] md:min-h-[18px]" />
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
