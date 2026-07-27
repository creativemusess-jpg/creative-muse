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
  const discount =
    product.mrp > product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : 0;
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
      className="group flex h-full min-h-[286px] flex-col overflow-hidden rounded-[6px] bg-white transition-shadow duration-400 sm:min-h-[382px] md:min-h-[410px] md:rounded-[8px] hover:md:shadow-[0_12px_34px_rgba(0,0,0,0.08)]"
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
        className="relative block shrink-0 text-left"
        aria-label={`Quick view ${product.name}`}
      >
        <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden bg-white p-0.5 md:p-1">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            width={1024}
            height={1024}
            className="h-full max-h-full w-full max-w-full object-contain transition-transform duration-700 group-hover:scale-[1.02]"
            onError={(e) => {
              const t = e.currentTarget;
              if (t.dataset.fallback) {
                t.style.display = "none";
                return;
              }
              t.src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect fill='white' width='400' height='400'/%3E%3C/svg%3E";
              t.dataset.fallback = "1";
            }}
          />

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              toggleWishlist(product.id);
            }}
            aria-label="Wishlist"
            className={`absolute top-1.5 right-1.5 flex h-7 w-7 items-center justify-center rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all duration-300 md:h-8 md:w-8 ${
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

          <div className="absolute right-1.5 bottom-1.5 opacity-100 transition-all duration-400 md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[rgba(66,29,34,0.15)] bg-white text-[#421D22] shadow-sm md:h-auto md:w-auto md:rounded-full md:border md:border-[rgba(66,29,34,0.15)] md:bg-white md:px-3.5 md:py-2 md:text-[10px] md:font-semibold md:tracking-[0.14em] md:uppercase">
              <Eye className="h-3 w-3 md:hidden" />
              <span className="hidden md:inline">Quick View</span>
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-2 pt-2 pb-2.5 md:px-3 md:pt-3 md:pb-3.5">
        <div className="mb-1 flex min-h-[16px] items-center md:mb-1.5 md:min-h-[18px]">
          {product.badge && (
            <span
              className={`inline-flex h-[14px] max-w-full items-center rounded-full px-1.5 text-[6px] leading-none font-semibold tracking-[0.05em] whitespace-nowrap uppercase md:h-[17px] md:px-2 md:text-[8px] md:tracking-[0.08em] ${BADGE_STYLE[product.badge]}`}
            >
              {product.badge}
            </span>
          )}
        </div>
        <p className="min-h-[13px] truncate text-[9px] tracking-[0.08em] text-[#7a6e64] uppercase md:min-h-[16px] md:text-[10px] md:tracking-[0.1em]">
          {product.metal} · {product.stone}
        </p>
        {productLink(product) ? (
          <Link
            to={productLink(product)!.to}
            params={productLink(product)!.params}
            className="font-display mt-1 line-clamp-2 min-h-[2.35em] text-[12px] leading-snug font-semibold text-[#1a1a2e] transition-colors hover:text-[#C9A96E] md:mt-1.5 md:min-h-[36px] md:text-[14px]"
          >
            {product.name}
          </Link>
        ) : (
          <h3 className="font-display mt-1 line-clamp-2 min-h-[2.35em] text-[12px] leading-snug font-semibold text-[#1a1a2e] md:mt-1.5 md:min-h-[36px] md:text-[14px]">
            {product.name}
          </h3>
        )}
        <div className="mt-1.5 flex min-h-[24px] flex-wrap items-baseline gap-x-1.5 gap-y-1 md:mt-2 md:min-h-[28px] md:gap-x-2">
          <span className="text-[14px] font-bold text-[#1a1a2e] md:text-[17px]">
            {formatPrice(product.price)}
          </span>
          {discount > 0 && (
            <span className="text-[9px] text-[#7a6e64] line-through md:text-[12px]">
              {formatPrice(product.mrp)}
            </span>
          )}
          {discount > 0 && (
            <span className="inline-flex h-[15px] items-center rounded-full bg-[#7A2533] px-1.5 text-[7px] leading-none font-bold tracking-wide whitespace-nowrap text-white md:h-[18px] md:px-2 md:text-[9px]">
              -{discount}%
            </span>
          )}
        </div>
        <div className="min-h-[6px] md:min-h-[12px]" />
        <button
          type="button"
          onClick={() => addToCart(product.id, 1)}
          className="mt-auto flex min-h-[34px] w-full items-center justify-center gap-1.5 rounded-[8px] bg-gradient-to-r from-[#C9A96E] to-[#B8860B] text-[10px] font-semibold tracking-[0.07em] text-white uppercase transition-all duration-300 md:min-h-[42px] md:gap-2 md:rounded-full md:text-[12px] md:tracking-[0.12em] hover:md:shadow-[0_12px_32px_rgba(201,169,110,0.4)]"
        >
          <ShoppingBag className="h-3 w-3 md:h-3.5 md:w-3.5" />
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
});
