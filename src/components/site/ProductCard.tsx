import { motion } from "framer-motion";
import { Heart, Star, ShoppingBag } from "lucide-react";
import { type Product, formatPrice } from "@/lib/products";
import { useStore } from "@/lib/store";

const BADGE_STYLE: Record<NonNullable<Product["badge"]>, string> = {
  New: "bg-[#0f4c3a] text-white",
  "Best Seller": "bg-[#a8843a] text-white",
  Wedding: "bg-[#6b1330] text-white",
  Trending: "bg-[#151a2e] text-white",
};

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  const { addToCart, toggleWishlist, isWishlisted, openQuickView } = useStore();
  const wishlisted = isWishlisted(product.id);
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.06 }}
      whileHover={{ y: -8 }}
      className="group flex h-full flex-col overflow-hidden rounded-[24px] bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-shadow duration-400 hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)]"
    >
      <div
        role="button"
        tabIndex={0}
        onClick={() => openQuickView(product.id)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openQuickView(product.id);
          }
        }}
        className="relative block text-left"
        aria-label={`Quick view ${product.name}`}
      >
        <div className={`relative aspect-square overflow-hidden bg-gradient-to-br ${product.bg}`}>
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            width={1024}
            height={1024}
            className="absolute inset-0 h-full w-full object-contain p-3 transition-transform duration-700 group-hover:scale-[1.06]"
            onError={(e) => { const t = e.currentTarget; if (t.dataset.fallback) { t.style.display = "none"; return; } t.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect fill='%23f5efe8' width='400' height='400'/%3E%3C/svg%3E"; t.dataset.fallback = "1"; }}
          />

          {/* Top-left badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.badge && (
              <span
                className={`rounded-full px-2.5 py-1 text-[9px] font-semibold tracking-[0.14em] uppercase shadow-sm ${BADGE_STYLE[product.badge]}`}
              >
                {product.badge}
              </span>
            )}
            {discount > 0 && (
              <span className="rounded-full bg-[#a83232] px-2.5 py-1 text-[9px] font-bold tracking-wide text-white shadow-sm">
                -{discount}%
              </span>
            )}
          </div>

          {/* Wishlist */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              toggleWishlist(product.id);
            }}
            aria-label="Wishlist"
            className={`absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.08)] backdrop-blur-sm transition-all duration-300 hover:shadow-[0_12px_24px_rgba(201,169,110,0.35)] ${
              wishlisted ? "bg-[#8a6a2a] text-white" : "bg-white/90 hover:bg-white"
            }`}
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                wishlisted ? "fill-white text-white" : "text-[#5a4e44] hover:text-[#8a6a2a]"
              }`}
            />
          </button>

          {/* Quick view — always visible on touch, slide-up on desktop hover */}
          <div className="absolute right-3 bottom-3 left-3 opacity-100 transition-all duration-400 md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
            <span className="block w-full rounded-full bg-white/95 py-2 text-center text-[11px] font-semibold tracking-[0.16em] text-[#1a1a2e] uppercase shadow-sm backdrop-blur-sm">
              Quick View
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="eyebrow text-[10px]">
          {product.metal} · {product.stone}
        </p>
        <h3 className="font-display mt-1.5 line-clamp-2 min-h-[38px] text-[14px] leading-snug font-semibold text-[#1a1a2e]">
          {product.name}
        </h3>
        <div className="mt-1.5 flex items-center gap-1.5">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${i < Math.round(product.rating) ? "fill-[#C9A96E] text-[#C9A96E]" : "text-[#e0d8cc]"}`}
              />
            ))}
          </div>
          <span className="text-[11px] text-[#7a6e64]">({product.reviews})</span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-[17px] font-bold text-[#1a1a2e]">{formatPrice(product.price)}</span>
          <span className="text-[12px] text-[#7a6e64] line-through">{formatPrice(product.mrp)}</span>
        </div>
        <div className="min-h-[18px]">
          {product.stock !== undefined && product.stock <= 5 && (
            <p className="mt-1 text-[11px] font-semibold text-[#c0603a]">
              Only {product.stock} left
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => addToCart(product.id, 1)}
          className="mt-auto flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#C9A96E] to-[#B8860B] py-2.5 text-[12px] font-semibold tracking-[0.12em] text-white uppercase transition-all duration-300 hover:shadow-[0_12px_32px_rgba(201,169,110,0.4)]"
        >
          <ShoppingBag className="h-3.5 w-3.5" />
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
}
