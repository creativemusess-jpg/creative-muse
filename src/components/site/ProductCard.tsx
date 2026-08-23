import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import { type Product, formatPrice, PRODUCT_PLACEHOLDER } from "@/lib/products";
import { useStore } from "@/lib/store";
import { productLink } from "@/lib/product-link";

export const ProductCard = memo(function ProductCard({
  product,
  index = 0,
}: {
  product: Product;
  index?: number;
}) {
  const discount =
    product.mrp > product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : 0;
  const { addToCart, toggleWishlist, isWishlisted, openQuickView } = useStore();
  const wishlisted = isWishlisted(product.id);
  const prefersReduced = useReducedMotion();
  const pl = productLink(product);

  const stop = (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <motion.div
      initial={prefersReduced ? {} : { opacity: 0, y: 24 }}
      whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.06 }}
      whileHover={prefersReduced ? {} : { y: -8 }}
      className="group relative z-0 flex h-full min-h-[286px] flex-col rounded-[16px] bg-white transition-shadow duration-400 sm:min-h-[382px] md:min-h-[410px] md:rounded-[18px] hover:z-20 hover:md:shadow-[0_12px_34px_rgba(0,0,0,0.08)]"
    >
      {pl && (
        <Link
          to={pl.to}
          params={pl.params}
          aria-label={`View ${product.name}`}
          className="absolute inset-0 z-10 rounded-[16px] outline-none md:rounded-[18px] focus-visible:ring-2 focus-visible:ring-[#C9A96E] focus-visible:ring-offset-2"
        />
      )}

      <div className="relative block shrink-0 text-left">
        <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-[16px] bg-white group-hover:overflow-visible md:rounded-[18px]">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            decoding="async"
            width={1024}
            height={1024}
            className="h-full max-h-full w-full max-w-full object-contain rounded-[16px] md:rounded-[18px] transition-transform duration-700 group-hover:scale-[1.02]"
            onError={(e) => {
              const t = e.currentTarget;
              if (t.dataset.fallback) {
                t.style.display = "none";
                return;
              }
              t.dataset.fallback = "1";
              t.src = PRODUCT_PLACEHOLDER;
            }}
          />

          <button
            type="button"
            onClick={(e) => {
              stop(e);
              toggleWishlist(product.id);
            }}
            aria-label="Wishlist"
            className={`group/wishlist absolute top-1.5 right-1.5 z-20 flex h-7 w-7 items-center justify-center rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all duration-300 md:h-8 md:w-8 ${
              wishlisted
                ? "bg-[#9C544D] text-white"
                : "bg-white text-[#9C544D] border border-[rgba(156,84,77,0.24)] hover:bg-[#9C544D] hover:text-white"
            }`}
          >
            <Heart
              className={`h-3 w-3 transition-colors md:h-4 md:w-4 ${
                wishlisted
                  ? "fill-white text-white"
                  : "text-[#9C544D] group-hover/wishlist:text-white"
              }`}
            />
          </button>

          <div className="absolute right-1.5 bottom-1.5 z-20 opacity-100 transition-all duration-400 md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
            <button
              type="button"
              onClick={(e) => {
                stop(e);
                openQuickView(product.id);
              }}
              aria-label={`Quick view ${product.name}`}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-[rgba(156,84,77,0.15)] bg-white text-[#9C544D] shadow-sm md:h-auto md:w-auto md:rounded-full md:px-3.5 md:py-2 md:text-[10px] md:font-semibold md:tracking-[0.14em] md:uppercase"
            >
              <Eye className="h-3 w-3 md:hidden" />
              <span className="hidden md:inline">Quick View</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-2 pt-2 pb-2.5 md:px-3 md:pt-3 md:pb-3.5">
        <div className="mb-1 flex min-h-[16px] flex-wrap items-center gap-1 md:mb-1.5 md:min-h-[18px]">
          {product.flags
            ?.filter((f) => f.badge_label)
            .slice(0, 2)
            .map((flag) => (
              <span
                key={flag.id}
                className="inline-flex h-[14px] max-w-full items-center rounded-full px-1.5 text-[6px] leading-none font-semibold tracking-[0.05em] whitespace-nowrap uppercase md:h-[17px] md:px-2 md:text-[8px] md:tracking-[0.08em]"
                style={{
                  backgroundColor: flag.badge_bg_color || "#1a1a2e",
                  color: flag.badge_text_color || "#ffffff",
                }}
              >
                {flag.badge_label}
              </span>
            ))}
        </div>
        {product.cardLabel ? (
          <p className="min-h-[13px] truncate text-[9px] tracking-[0.08em] text-[#7a6e64] uppercase md:min-h-[16px] md:text-[10px] md:tracking-[0.1em]">
            {product.cardLabel}
          </p>
        ) : null}
        {pl ? (
          <p className="font-display mt-1 line-clamp-2 min-h-[2.35em] text-[12px] leading-snug font-semibold text-[#1a1a2e] transition-colors group-hover:text-[#9C544D] md:mt-1.5 md:min-h-[36px] md:text-[14px]">
            {product.name}
          </p>
        ) : (
          <h3 className="font-display mt-1 line-clamp-2 min-h-[2.35em] text-[12px] leading-snug font-semibold text-[#1a1a2e] md:mt-1.5 md:min-h-[36px] md:text-[14px]">
            {product.name}
          </h3>
        )}
        <div className="mt-1.5 flex flex-wrap items-baseline gap-x-1.5 gap-y-1 md:mt-2 md:gap-x-2">
          <span className="text-[14px] font-bold text-[#1a1a2e] md:text-[17px]">
            {formatPrice(product.price)}
          </span>
          {discount > 0 && (
            <span className="text-[9px] text-[#7a6e64] line-through md:text-[12px]">
              {formatPrice(product.mrp)}
            </span>
          )}
          {discount > 0 && (
            <span className="inline-flex h-[15px] items-center rounded-full bg-[#9C544D] px-1.5 text-[7px] leading-none font-bold tracking-wide whitespace-nowrap text-white md:h-[18px] md:px-2 md:text-[9px]">
              -{discount}%
            </span>
          )}
        </div>
        <div className="min-h-[6px] md:min-h-[12px]" />
        <button
          type="button"
          onClick={(e) => {
            stop(e);
            addToCart(product.id, 1);
          }}
          className="relative z-20 mt-auto flex min-h-[34px] w-full items-center justify-center gap-1.5 rounded-[8px] bg-[#9C544D] text-[10px] font-semibold tracking-[0.07em] text-white uppercase transition-all duration-300 md:min-h-[42px] md:gap-2 md:rounded-full md:text-[12px] md:tracking-[0.12em] hover:md:shadow-[0_12px_32px_rgba(156,84,77,0.4)] hover:md:bg-[#7A3D3A]"
        >
          <ShoppingBag className="h-3 w-3 md:h-3.5 md:w-3.5" />
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
});
