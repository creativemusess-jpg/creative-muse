import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import {
  Sparkles,
  Award,
  Diamond,
  Truck,
  RotateCcw,
  Shield,
  Phone,
  MapPin,
  Play,
  Plus,
  Leaf,
  ArrowLeft,
  ArrowRight,
  Heart,
  Gem,
  Star,
  Users,
  Droplets,
  ShieldCheck,
} from "lucide-react";
import { type Product, useStorefrontProducts } from "@/lib/products";
import { ProductCard } from "@/components/site/ProductCard";
import { ShoppableReelsSection } from "@/components/site/ShoppableReelsSection";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import type { CarouselApi } from "@/components/ui/carousel";
import { useStore } from "@/lib/store";
import {
  ProductCarouselSection,
  type AutoScrollSettings,
} from "@/components/site/ProductCarouselSection";
import { useCategories, useContentSection } from "@/lib/api/hooks";
import { heroMediaApi } from "@/lib/api/heroMedia";
import heroRing from "@/assets/hero-ring.jpg";
import catRings from "@/assets/cat-rings.png";
import catNecklaces from "@/assets/cat-necklaces.png";
import catEarrings from "@/assets/cat-earrings.png";
import catBracelets from "@/assets/cat-bracelets.png";
import catMangalsutra from "@/assets/cat-mangalsutra.png";
import catPendants from "@/assets/cat-pendants.png";
import catBangles from "@/assets/cat-bangles.png";
import catWedding from "@/assets/cat-wedding.png";
import prodAarav from "@/assets/prod-aarav-ring.jpg";
import prodPriya from "@/assets/prod-priya-necklace.jpg";
import prodPolki from "@/assets/prod-polki-choker.jpg";
import prodCelestia from "@/assets/prod-celestia-earrings.jpg";

const CATEGORY_IMAGES: Record<string, string> = {
  Rings: catRings,
  Necklaces: catNecklaces,
  Earrings: catEarrings,
  Bracelets: catBracelets,
  Mangalsutra: catMangalsutra,
  Pendants: catPendants,
  Bangles: catBangles,
  "Wedding Sets": catWedding,
  Ring: catRings,
  Necklace: catNecklaces,
  Earring: catEarrings,
  Bracelet: catBracelets,
  Pendant: catPendants,
  Bangle: catBangles,
  Hoops: catEarrings,
  Earcuffs: catEarrings,
  Kada: catBangles,
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Creative Muse Fine Jewellery — Where Every Gem Tells Your Story" },
      {
        name: "description",
        content:
          "Discover handcrafted fine jewellery from Vadodara. BIS Hallmarked gold, IGI certified diamonds, bridal collections and everyday luxury.",
      },
      {
        property: "og:title",
        content: "Creative Muse Fine Jewellery — Where Every Gem Tells Your Story",
      },
      {
        property: "og:description",
        content:
          "Discover handcrafted fine jewellery from Vadodara. BIS Hallmarked gold, IGI certified diamonds, bridal collections and everyday luxury.",
      },
    ],
    links: [
      { rel: "preload", href: heroRing, as: "image" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <ShopByCategory />
      <FeaturedBanner />
      <BestSellers />
      <ShoppableReelsSection />
      <NewArrivals />
      <PremiumArrivals />
      <WhyChoose />
      <VideoBanner />
      <StoreLocation />
      <FAQ />
      <Newsletter />
    </>
  );
}

/* =========================================================
   1. HERO
   ========================================================= */
const HERO_SLIDES = [
  {
    badge: "Vadodara's Premier Fine Jewellery",
    title: (
      <>
        Where Every Gem
        <br />
        <span className="shimmer-text italic">Tells Your Story</span>
      </>
    ),
    desc: "Handcrafted fine jewellery for life's most precious moments. From bridal masterpieces to everyday elegance — designed in Vadodara, treasured for generations.",
    image: heroRing,
    imageAlt: "Aarav Solitaire — 18K rose gold diamond ring",
    stat: "₹48,500",
    mediaType: "image" as const,
  },
  {
    badge: "Bridal Edit 2025",
    title: (
      <>
        Celebrate Life's
        <br />
        <span className="shimmer-text italic">Golden Moments</span>
      </>
    ),
    desc: "Exquisite bridal sets crafted to make your special day unforgettable. Each piece tells a story of love, tradition, and timeless beauty.",
    image: prodPolki,
    imageAlt: "Polki Choker — Traditional bridal jewellery",
    stat: "Starting ₹12,500",
    mediaType: "image" as const,
  },
];

function Hero() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const { data: heroMedia } = useQuery({
    queryKey: ["hero", "media"],
    queryFn: () => heroMediaApi.list(true),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const slides = useMemo(() => {
    if (!heroMedia || heroMedia.length === 0) return HERO_SLIDES;
    return heroMedia.map((m, i) => {
      const fallback = HERO_SLIDES[i % HERO_SLIDES.length];
      return {
        badge: m.badge || fallback.badge,
        title: fallback.title,
        desc: fallback.desc,
        image: m.media_url,
        imageAlt: m.name || fallback.imageAlt,
        stat: fallback.stat,
        mediaType: m.media_type,
      };
    });
  }, [heroMedia]);

  const onSelect = useCallback((a: CarouselApi) => {
    setCurrent(a?.selectedScrollSnap() ?? 0);
  }, []);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api, onSelect]);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#fdf8f3] via-[#f7ede0] to-[#f0dcc8]">
      <div className="pointer-events-none absolute -top-32 -left-32 h-[480px] w-[480px] rounded-full bg-[#C9A96E]/20 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 -bottom-40 h-[520px] w-[520px] rounded-full bg-[#E8B4A0]/25 blur-[140px]" />

      <Carousel setApi={setApi} opts={{ loop: true, align: "start" }} className="relative">
        <CarouselContent>
          {slides.map((slide, idx) => (
            <CarouselItem key={idx}>
              <div className="relative mx-auto grid max-w-[1280px] items-center gap-6 px-6 pt-8 pb-12 md:pt-10 md:pb-16 lg:grid-cols-[55fr_45fr] lg:gap-8 lg:pt-12 lg:pb-16">
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                  className="flex flex-col justify-center"
                >
                  <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#7A2533]/40 bg-white/60 px-4 py-1.5 text-[11px] font-semibold tracking-[0.18em] text-[#7A2533] uppercase backdrop-blur-sm">
                    <Sparkles className="h-3 w-3" />
                    {slide.badge}
                  </span>

                  <h1
                    className="font-display mt-4 font-bold leading-[1.05] text-[#1a1a2e]"
                    style={{ fontSize: "clamp(28px, 5vw, 52px)" }}
                  >
                    {slide.title}
                  </h1>

                  <p className="mt-4 max-w-lg text-[14px] leading-relaxed text-[#5a4e44] sm:text-[15px]">
                    {slide.desc}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link to="/shop" className="btn-primary">
                      Explore Collections
                    </Link>
                    <Link to="/contact" className="btn-secondary">
                      Visit Our Store
                    </Link>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-x-10 gap-y-4 border-t border-[#7A2533]/20 pt-5">
                    {[
                      ["15+", "Years of Craft"],
                      ["50K+", "Happy Customers"],
                      ["100%", "Hallmarked Gold"],
                    ].map(([n, l]) => (
                      <div key={l}>
                        <p className="font-display text-2xl font-bold text-[#1a1a2e]">{n}</p>
                        <p className="text-[11px] tracking-[0.14em] text-[#5a4e44] uppercase">
                          {l}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="relative mx-auto flex w-full max-w-[420px] items-center justify-center"
                >
                  <div className="glass-panel relative aspect-square w-full overflow-hidden rounded-[28px] p-4 shadow-[0_24px_64px_rgba(0,0,0,0.12)] sm:p-5">
                    <div className="animate-cm-float flex h-full w-full items-center justify-center">
                      {slide.mediaType === "video" ? (
                        <video
                          src={slide.image}
                          aria-label={slide.imageAlt}
                          muted
                          autoPlay
                          loop
                          playsInline
                          preload="metadata"
                          className="h-full w-full rounded-[20px] object-contain drop-shadow-[0_24px_48px_rgba(122,37,51,0.35)]"
                        />
                      ) : (
                        <img
                          src={slide.image}
                          alt={slide.imageAlt}
                          width={1024}
                          height={1280}
                          fetchPriority={idx === 0 ? "high" : undefined}
                          decoding="async"
                          className="h-full w-full rounded-[20px] object-contain drop-shadow-[0_24px_48px_rgba(122,37,51,0.35)]"
                        />
                      )}
                    </div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="absolute top-4 left-2 hidden rounded-[18px] border border-[#7A2533]/30 bg-white/90 p-3 shadow-[0_8px_32px_rgba(122,37,51,0.2)] backdrop-blur-xl md:block"
                  >
                    <p className="eyebrow text-[9px] text-[#7A2533]">Best Seller</p>
                    <p className="font-display mt-1 text-sm font-semibold text-[#1a1a2e]">
                      Aarav Solitaire
                    </p>
                    <p className="mt-0.5 text-[13px] font-bold text-[#7A2533]">{slide.stat}</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="absolute right-2 bottom-4 hidden items-center gap-2 rounded-[18px] border border-emerald-200/60 bg-white/90 p-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.1)] backdrop-blur-xl md:flex"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100">
                      <Diamond className="h-4 w-4 text-emerald-700" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-emerald-800">IGI Certified</p>
                      <p className="text-[10px] text-[#5a4e44]">Lab-graded diamonds</p>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <button
          onClick={() => api?.scrollPrev()}
          className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-[#2a1e14] shadow transition-colors hover:bg-white"
          aria-label="Previous slide"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <button
          onClick={() => api?.scrollNext()}
          className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-[#2a1e14] shadow transition-colors hover:bg-white"
          aria-label="Next slide"
        >
          <ArrowRight className="h-4 w-4" />
        </button>

        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => api?.scrollTo(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === current ? "w-7 bg-[#8B1A1A]" : "w-2 bg-[#7A2533]/50"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </Carousel>
    </section>
  );
}

/* =========================================================
   2. TRUST BAR
   ========================================================= */
function TrustBar() {
  const items = [
    [Award, "BIS Hallmarked Gold"],
    [Diamond, "IGI Certified Diamonds"],
    [Truck, "Free Insured Shipping"],
    [RotateCcw, "30-Day Returns"],
    [Shield, "Secure Payments"],
  ] as const;
  const prefersReducedMotion = useReducedMotion();
  return (
    <section className="overflow-hidden bg-[#1a1a2e] py-5">
      <div className="mx-auto flex max-w-[1280px] overflow-hidden">
        <div className={`flex shrink-0 items-center gap-8 whitespace-nowrap px-6 text-[12px] tracking-[0.1em] text-white uppercase ${prefersReducedMotion ? "flex-wrap justify-center gap-x-10 gap-y-3" : "animate-cm-marquee"}`}>
          {Array.from({ length: prefersReducedMotion ? 1 : 3 }).flatMap((_, setIdx) =>
            items.map(([Ic, label], itemIdx) => (
              <div key={`${setIdx}-${itemIdx}`} className="flex shrink-0 items-center gap-2.5">
                <Ic className="h-4 w-4 text-white" />
                <span>{label}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   Reusable section heading
   ========================================================= */
function SectionHeading({
  eyebrow,
  title,
  subtitle,
  light,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  light?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className="mx-auto mb-12 max-w-2xl text-center"
    >
      <p className="eyebrow">{eyebrow}</p>
      <h2
        className={`font-display mt-3 text-[32px] leading-tight font-semibold sm:text-[40px] lg:text-[44px] ${
          light ? "text-white" : "text-[#1a1a2e]"
        }`}
      >
        {title}
      </h2>
      <div className="mt-5 flex justify-center">
        <span className="gold-divider" />
      </div>
      {subtitle && (
        <p className={`mt-5 text-[15px] ${light ? "text-white/70" : "text-[#7a6e64]"}`}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

/* =========================================================
   3. SHOP BY CATEGORY
   ========================================================= */
const EXCLUDED_CATEGORIES = new Set(["arth", "lucky", "test", "demo"]);

const CANONICAL_NAMES = new Set([
  "Earrings",
  "Necklace",
  "Rings",
  "Hoops",
  "Earcuffs",
  "Kada",
  "Bracelets",
  "Mangalsutra",
  "Pendants",
  "Bangles",
  "Wedding Sets",
]);

function deduplicateCategories(cats: any[]): any[] {
  const seen = new Map<string, any>();
  for (const cat of cats) {
    const key = cat.name.trim().toLowerCase();
    if (EXCLUDED_CATEGORIES.has(key)) continue;
    if (!seen.has(key)) {
      seen.set(key, cat);
    } else {
      const existing = seen.get(key);
      if (CANONICAL_NAMES.has(cat.name) || !CANONICAL_NAMES.has(existing.name)) {
        seen.set(key, cat);
      }
    }
  }
  const result = Array.from(seen.values());
  const order = [
    "Earrings",
    "Necklace",
    "Rings",
    "Hoops",
    "Earcuffs",
    "Kada",
    "Bracelets",
    "Mangalsutra",
    "Pendants",
    "Bangles",
    "Wedding Sets",
  ];
  result.sort((a, b) => {
    const ia = order.indexOf(a.name);
    const ib = order.indexOf(b.name);
    if (ia !== -1 && ib !== -1) return ia - ib;
    if (ia !== -1) return -1;
    if (ib !== -1) return 1;
    return (a.sort_order ?? 0) - (b.sort_order ?? 0);
  });
  return result;
}

function ShopByCategory() {
  const { data, isLoading } = useCategories();
  const categoryScrollerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [autoPaused, setAutoPaused] = useState(false);

  const dbCategories = useMemo(() => data ? deduplicateCategories(data) : [], [data]);

  useEffect(() => {
    if (prefersReducedMotion || autoPaused) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const el = categoryScrollerRef.current;
      if (el && el.scrollWidth > el.clientWidth) {
        const dt = Math.min((now - last) / 1000, 0.5);
        last = now;
        const max = el.scrollWidth - el.clientWidth;
        const next = el.scrollLeft + 55 * dt;
        el.scrollLeft = next >= max ? 0 : next;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [prefersReducedMotion, autoPaused]);

  if (isLoading) return null;

  const d = prefersReducedMotion ? 0 : undefined;

  function scrollCategories(direction: -1 | 1) {
    const el = categoryScrollerRef.current;
    if (!el) return;
    el.scrollBy({
      left: direction * Math.max(el.clientWidth * 0.75, 260),
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }

  function renderCard(cat: any) {
    const img = cat.imageUrl || CATEGORY_IMAGES[cat.name] || null;
    return (
      <Link
        to={`/category/${cat.slug}`}
        className="group relative flex h-full flex-col items-center rounded-[24px] border border-transparent bg-white p-3 pb-4 text-center shadow-[0_4px_24px_rgba(0,0,0,0.04)] transition-all duration-500 hover:z-10 hover:-translate-y-2 hover:border-[#7A2533]/50 hover:shadow-[0_20px_60px_rgba(122,37,51,0.22)] active:scale-[0.97] md:p-4 md:pb-5"
      >
        <div className="relative aspect-square w-full rounded-[18px] bg-gradient-to-br from-[#fdf8f3] to-[#f0e4cd]">
          {img ? (
            <img
              src={img}
              alt={cat.name}
              loading="lazy"
              width={768}
              height={768}
              className="absolute inset-0 h-full w-full rounded-[18px] object-contain p-2 transition-transform duration-700 ease-out group-hover:scale-110 md:p-3"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#f5efe8] p-3">
              <svg
                className="h-8 w-8 text-[#7A2533]/20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
                />
              </svg>
            </div>
          )}
        </div>
        <p className="font-display mt-3 text-[14px] font-semibold text-[#1a1a2e] md:mt-4 md:text-[15px]">
          {cat.name}
        </p>
      </Link>
    );
  }

  return (
    <section
      id="shop-by-category"
      className="scroll-mt-40 bg-[#fdf8f3] py-16 md:py-20"
    >
      <div className="mx-auto max-w-[1280px] px-6">
        <SectionHeading eyebrow="Browse" title="Shop by Category" />

        <div className="relative mt-10">
          <button
            onClick={() => scrollCategories(-1)}
            className="absolute left-0 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#d8d0c6] bg-white text-[#1a1a2e] shadow-[0_8px_20px_rgba(0,0,0,0.08)] transition-all hover:border-[#7A2533] hover:text-[#7A2533] md:flex"
            aria-label="Scroll categories left"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          <div
            ref={categoryScrollerRef}
            onPointerDown={() => setAutoPaused(true)}
            onPointerUp={() => setAutoPaused(false)}
            onPointerCancel={() => setAutoPaused(false)}
            onPointerLeave={() => setAutoPaused(false)}
            onTouchStart={() => setAutoPaused(true)}
            onTouchEnd={() => setAutoPaused(false)}
            onTouchCancel={() => setAutoPaused(false)}
            className="scrollbar-hide -mx-6 -my-4 flex snap-x gap-3 overflow-x-auto px-6 py-4 md:mx-10 md:gap-5 md:px-0"
          >
            {dbCategories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: d ?? 0.4, delay: d ?? i * 0.05 }}
                className="w-[42vw] min-w-[150px] max-w-[180px] shrink-0 snap-start md:w-[190px] md:min-w-[190px] md:max-w-none lg:w-[210px] lg:min-w-[210px]"
              >
                {renderCard(cat)}
              </motion.div>
            ))}
          </div>

          <button
            onClick={() => scrollCategories(1)}
            className="absolute right-0 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#d8d0c6] bg-white text-[#1a1a2e] shadow-[0_8px_20px_rgba(0,0,0,0.08)] transition-all hover:border-[#7A2533] hover:text-[#7A2533] md:flex"
            aria-label="Scroll categories right"
          >
            <ArrowRight className="h-4 w-4" />
          </button>

          <div className="mt-6 flex justify-center gap-4 md:hidden">
            <button
              onClick={() => scrollCategories(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d8d0c6] bg-white text-[#1a1a2e] shadow-[0_6px_14px_rgba(0,0,0,0.07)] transition-all active:scale-95"
              aria-label="Scroll categories left"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scrollCategories(1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#7A2533] bg-white text-[#7A2533] shadow-[0_6px_14px_rgba(0,0,0,0.07)] transition-all active:scale-95"
              aria-label="Scroll categories right"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   4. FEATURED BANNER
   ========================================================= */
const CTA_FALLBACK_VIDEOS = [
  {
    src: "/category-videos/necklace-hero.mp4",
    poster: prodPolki,
    title: "Bridal necklaces",
  },
  {
    src: "/category-videos/earrings-hero.mp4",
    poster: prodCelestia,
    title: "Pearl earrings",
  },
  {
    src: "/category-videos/rings-hero.mp4",
    poster: prodAarav,
    title: "Solitaire rings",
  },
];

type BridalCard = {
  src: string;
  poster?: string;
  title: string;
  mediaType: "image" | "video";
  productId?: string | null;
};

function HeroVideoCarousel({ cards }: { cards: BridalCard[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  const slides: BridalCard[] =
    cards.length > 0
      ? cards
      : CTA_FALLBACK_VIDEOS.map((v) => ({
          src: v.src,
          poster: v.poster,
          title: v.title,
          mediaType: "video",
          productId: null,
        }));

  const onSelect = useCallback((a: CarouselApi) => {
    setCurrent(a?.selectedScrollSnap() ?? 0);
  }, []);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api, onSelect]);

  useEffect(() => {
    if (!api || prefersReducedMotion || slides.length < 2) return;
    const timer = window.setInterval(() => api.scrollNext(), 2800);
    return () => window.clearInterval(timer);
  }, [api, prefersReducedMotion, slides.length]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: 0.15 }}
      className="relative min-w-0"
    >
      <div className="pointer-events-none absolute inset-y-8 -left-6 w-16 bg-gradient-to-r from-[#1a1a2e] to-transparent" />
      <div className="pointer-events-none absolute inset-y-8 -right-6 z-10 w-16 bg-gradient-to-l from-[#1a1a2e] to-transparent" />

      <Carousel
        setApi={setApi}
        opts={{ loop: true, align: "start" }}
        className="overflow-hidden"
        aria-label="Bridal collection media carousel"
      >
        <CarouselContent className="-ml-4">
          {slides.map((card, i) => {
            const media = (
              <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] border border-white/10 bg-[#fdf8f3]/10 shadow-[0_24px_64px_rgba(0,0,0,0.35)]">
                {card.mediaType === "image" ? (
                  <img
                    src={card.src}
                    alt={card.title}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <video
                    src={card.src}
                    poster={card.poster}
                    className="h-full w-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    aria-label={card.title}
                  />
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1a1a2e]/35 via-transparent to-white/10" />
                <div className="pointer-events-none absolute bottom-4 left-4 rounded-full border border-white/30 bg-white/15 px-3 py-1 text-[10px] font-semibold tracking-[0.16em] text-white uppercase backdrop-blur-md">
                  {card.title}
                </div>
              </div>
            );
            return (
              <CarouselItem
                key={`${card.src}-${i}`}
                className="basis-[76%] pl-4 sm:basis-[54%] lg:basis-[58%] xl:basis-[48%]"
              >
                {card.productId ? (
                  <Link
                    to="/product/$productId"
                    params={{ productId: card.productId }}
                    className="block"
                  >
                    {media}
                  </Link>
                ) : (
                  media
                )}
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>

      <div className="mt-5 flex justify-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => api?.scrollTo(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === current ? "w-7 bg-[#C9A96E]" : "w-1.5 bg-white/35"
            }`}
            aria-label={`Show bridal card ${i + 1}`}
          />
        ))}
      </div>
    </motion.div>
  );
}

function FeaturedBanner() {
  const { data: section, isLoading } = useContentSection("featured_banner");

  const cards = useMemo<BridalCard[]>(() => {
    const raw = section?.content?.cards;
    if (Array.isArray(raw) && raw.length > 0) {
      return raw
        .filter((c: any) => c?.media_url && c.active !== false)
        .sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
        .map((c: any) => ({
          src: c.media_url,
          poster: c.poster,
          title: c.title || "Bridal Collection",
          mediaType: c.media_type === "image" ? "image" : "video",
          productId: c.product_id || null,
        }));
    }
    const legacy = section?.content?.cta_videos;
    if (Array.isArray(legacy) && legacy.length > 0) {
      return legacy.map((v: any) => ({
        src: v.src,
        poster: v.poster,
        title: v.title || "Bridal Collection",
        mediaType: "video" as const,
        productId: null,
      }));
    }
    return [];
  }, [section]);

  if (isLoading) return null;

  return (
    <section className="px-4 sm:px-6">
      <div className="relative mx-auto max-w-[1320px] overflow-hidden rounded-[40px] bg-[#1a1a2e] px-8 py-16 sm:px-14 sm:py-20">
        <div className="pointer-events-none absolute -top-32 -right-32 h-[420px] w-[420px] rounded-full bg-[#C9A96E]/20 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-40 -left-32 h-[420px] w-[420px] rounded-full bg-[#E8B4A0]/15 blur-[120px]" />

        <div className="relative grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="eyebrow">Bridal Edit</p>
            <h2 className="font-display mt-3 text-[34px] leading-tight font-semibold text-white sm:text-[44px] lg:text-[48px]">
              The 2025
              <br />
              <span className="shimmer-text">Bridal Collection</span>
            </h2>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/70">
              Heirloom-worthy pieces curated for the modern Indian bride. Polki, Kundan, Diamond and
              Gold — designed to be worn for a lifetime.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/shop" className="btn-primary">
                View Collection
              </Link>
              <Link to="/contact" className="btn-primary">
                Book Consultation
              </Link>
            </div>
          </motion.div>

<div className="relative min-w-0 lg:h-[420px]">
            <div className="relative z-10 mx-auto w-full max-w-[620px] lg:absolute lg:inset-y-0 lg:right-0 lg:flex lg:max-w-[560px] lg:items-center">
              <HeroVideoCarousel cards={cards} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   5. BEST SELLERS
   ========================================================= */
function BestSellers() {
  const tabs = ["Best Sellers", "New Arrivals", "Wedding", "Trending"] as const;
  const [active, setActive] = useState<(typeof tabs)[number]>("Best Sellers");
  const { products } = useStorefrontProducts();

  const filtered = (() => {
    switch (active) {
      case "New Arrivals":
        return products.filter((p) => p.flags?.some((f) => f.slug === "new-arrival"));
      case "Wedding":
        return products.filter((p) => p.flags?.some((f) => f.slug === "wedding"));
      case "Trending":
        return products.filter((p) => p.flags?.some((f) => f.slug === "trending"));
      default:
        return products
          .filter(
            (p) => p.flags?.some((f) => f.slug === "best-seller" || f.slug === "trending" || f.slug === "wedding"),
          )
          .slice(0, 8);
    }
  })();

  return (
    <section className="bg-[#f5efe8] py-20">
      <div className="mx-auto max-w-[1280px] px-6">
        <SectionHeading eyebrow="Our Jewellery" title="Handpicked Best Sellers" />

        <div className="mb-8 flex justify-center md:mb-10">
          <div className="scrollbar-hide flex w-full max-w-[calc(100vw-48px)] gap-1.5 overflow-x-auto rounded-[28px] bg-white p-2 shadow-[0_4px_16px_rgba(0,0,0,0.06)] md:inline-flex md:w-auto md:max-w-none md:flex-wrap md:justify-center md:gap-1 md:overflow-visible md:rounded-full md:p-1.5">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setActive(t)}
                className={`flex h-[52px] min-w-[148px] shrink-0 items-center justify-center rounded-[22px] px-4 text-[13px] font-semibold tracking-[0.08em] uppercase transition-all duration-300 md:h-auto md:min-w-0 md:rounded-full md:px-5 md:py-2.5 md:text-[12px] md:tracking-[0.1em] ${
                  active === t
                    ? "bg-[#7A2533] text-white shadow-[0_6px_16px_rgba(122,37,51,0.35)]"
                    : "text-[#7a6e64] hover:text-[#1a1a2e]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          {filtered.length === 0 ? (
            <p className="text-center text-[#7a6e64]">No products in this tab yet.</p>
          ) : (
            <Carousel opts={{ align: "start", dragFree: true }}>
              <CarouselContent className="-ml-3 md:-ml-4">
                {filtered.map((p, i) => (
                  <CarouselItem
                    key={`${p.id}-${i}`}
                    className="basis-[84%] pl-3 sm:basis-[45%] md:basis-1/3 md:pl-4 lg:basis-1/4"
                  >
                    <ProductCard product={p} index={i} />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          )}
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   6. SHOPPABLE INSTAGRAM REELS
   ========================================================= */
/* =========================================================
   7. NEW ARRIVALS CAROUSEL
   ========================================================= */
function NewArrivals() {
  const { products } = useStorefrontProducts();
  const { data: section } = useContentSection("new_arrivals");

  const scrollSettings = useMemo<AutoScrollSettings | undefined>(() => {
    if (!section) return undefined;
    return {
      autoScrollEnabled: section.auto_scroll_enabled ?? false,
      scrollDirection: section.scroll_direction ?? "left",
      scrollSpeed: section.scroll_speed ?? 30,
      pauseOnHover: section.pause_on_hover ?? true,
      autoResumeEnabled: section.auto_resume_enabled ?? true,
      autoResumeDelaySeconds: section.auto_resume_delay_seconds ?? 3,
    };
  }, [section]);

  const list = useMemo(
    () =>
      products
        .filter((p) => p.flags?.some((f) => f.slug === "new-arrival"))
        .concat(products)
        .slice(0, 6),
    [products],
  );
  return (
    <ProductCarouselSection
      eyebrow="Just Arrived"
      title="NEW THIS SEASON"
      products={list}
      autoScroll={scrollSettings}
    />
  );
}

/* =========================================================
   7b. PREMIUM JEWELLERY CAROUSEL
   ========================================================= */
function PremiumArrivals() {
  const { products } = useStorefrontProducts();
  const { data: section } = useContentSection("premium_arrivals");

  const scrollSettings = useMemo<AutoScrollSettings | undefined>(() => {
    if (!section) return undefined;
    return {
      autoScrollEnabled: section.auto_scroll_enabled ?? false,
      scrollDirection: section.scroll_direction ?? "left",
      scrollSpeed: section.scroll_speed ?? 30,
      pauseOnHover: section.pause_on_hover ?? true,
      autoResumeEnabled: section.auto_resume_enabled ?? true,
      autoResumeDelaySeconds: section.auto_resume_delay_seconds ?? 3,
    };
  }, [section]);

  const list = useMemo(
    () =>
      products
        .filter((p) => p.flags?.some((f) => f.slug === "new-arrival"))
        .concat(products)
        .slice(0, 6),
    [products],
  );
  return (
    <ProductCarouselSection
      eyebrow="PREMIUM JEWELLERY"
      title="YOUR EVERYDAY STATEMENT"
      products={list}
      autoScroll={scrollSettings}
    />
  );
}

/* =========================================================
   8. WHY CHOOSE US — Premium Benefits
   ========================================================= */
function WhyChoose() {
  const benefitItems = [
    { icon: Gem, title: "18K Gold Plated" },
    { icon: ShieldCheck, title: "Skin Safe" },
    { icon: Users, title: "10000+ Happy Customers" },
    { icon: Heart, title: "Guaranteed Compliments" },
  ];

  const featureItems = [
    { icon: ShieldCheck, label: "Hypoallergenic" },
    { icon: Droplets, label: "Water-Resistant" },
    { icon: Sparkles, label: "Non Tarnish" },
    { icon: Gem, label: "18K Gold Plated" },
  ];

  const renderBenefit = (item: (typeof benefitItems)[number], i: number, extra: string) => (
    <motion.div
      key={item.title}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, delay: i * 0.04 }}
      className={`flex min-h-[138px] flex-col items-center justify-center rounded-[22px] bg-[#f9f2e9] p-5 text-center md:min-h-[170px] md:p-6 lg:min-h-[128px] lg:p-4 ${extra}`}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#C9A96E] to-[#B8860B] shadow-[0_8px_24px_rgba(201,169,110,0.3)] md:h-14 md:w-14 lg:h-12 lg:w-12">
        <item.icon className="h-5 w-5 text-white md:h-6 md:w-6 lg:h-5 lg:w-5" />
      </div>
      <h4 className="font-display mt-4 text-[14px] font-semibold text-[#1a1a2e] md:text-[17px] lg:mt-3 lg:text-[15px]">
        {item.title}
      </h4>
    </motion.div>
  );

  return (
    <section className="bg-[#fdf8f3] py-14 md:py-16">
      <div className="mx-auto max-w-[1280px] px-6">
        <SectionHeading eyebrow="The Creative Muse Promise" title="Why Choose Us" />

        {/* Premium Benefit Grid — mobile: seamless auto-scrolling marquee */}
        <div className="-mx-6 overflow-hidden md:hidden">
          <div
            className="animate-cm-marquee flex w-max motion-reduce:animate-none"
            style={{ animationDuration: "26s" }}
          >
            {[0, 1].map((copy) => (
              <div key={copy} className="flex shrink-0 gap-3 pr-3">
                {benefitItems.map((item, i) => renderBenefit(item, i, "w-[248px] flex-none"))}
              </div>
            ))}
          </div>
        </div>

        {/* Premium Benefit Grid — tablet & desktop */}
        <div className="mx-auto hidden max-w-[760px] md:block lg:max-w-[1120px]">
          <div className="grid grid-cols-2 gap-5 lg:grid-cols-4 lg:gap-4">
            {benefitItems.map((item, i) => renderBenefit(item, i, ""))}
          </div>
        </div>

        {/* Horizontal Feature Strip */}
        <div className="mx-auto mt-8 max-w-[760px] md:mt-10 lg:max-w-[1120px]">
          <div className="flex flex-wrap items-center justify-center gap-4 rounded-[22px] bg-[#e8ddd0] px-5 py-4 md:flex-nowrap md:gap-0">
            {featureItems.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
                className="flex items-center gap-2 px-2 md:flex-1 md:justify-center"
              >
                <item.icon className="h-4 w-4 shrink-0 text-[#1a1a2e]" />
                <span className="text-[9px] font-semibold tracking-[0.12em] text-[#1a1a2e] uppercase md:text-[10px]">
                  {item.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   10. VIDEO BANNER
   ========================================================= */
function VideoBanner() {
  return (
    <section className="mt-20 px-4 sm:px-6">
      <div className="relative mx-auto max-w-[1320px] overflow-hidden rounded-[40px] bg-gradient-to-br from-[#0d0d1a] via-[#1a1a2e] to-[#3a1a3e] px-8 py-28 text-center shadow-[0_24px_64px_rgba(0,0,0,0.3)] sm:py-36">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(122,37,51,0.25),transparent_60%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(232,180,160,0.18),transparent_55%)]" />

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/15 backdrop-blur-md ring-1 ring-white/20"
        >
          <Play className="ml-1 h-8 w-8 fill-white text-white" />
        </motion.div>
        <h2 className="font-display relative mt-8 text-[34px] leading-tight font-semibold text-white sm:text-[48px]">
          Crafted for the <span className="shimmer-text">Extraordinary</span>
        </h2>
        <p className="relative mx-auto mt-4 max-w-md text-[15px] text-white/70">
          Watch how each Creative Muse piece is born — from sketch to setting.
        </p>
        <div className="relative mt-8 flex justify-center">
          <button className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-[13px] font-semibold tracking-[0.14em] text-[#1a1a2e] uppercase transition-transform hover:-translate-y-0.5">
            <Play className="h-3.5 w-3.5 fill-[#1a1a2e]" /> Watch Our Story
          </button>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   11. STORE LOCATION
   ========================================================= */
function StoreLocation() {
  return (
    <section className="bg-[#fdf8f3] py-20">
      <div className="mx-auto grid max-w-[1280px] items-center gap-10 px-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="eyebrow">Visit Us</p>
          <h2 className="font-display mt-3 text-[32px] leading-tight font-semibold text-[#1a1a2e] sm:text-[40px]">
            Step Inside Our
            <br />
            Vadodara Atelier
          </h2>
          <div className="mt-6 space-y-4 text-[15px] text-[#3a3028]">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#7A2533]" />
              <span>GF-3/4, Vidhi Square Complex, BPC Road, Anand Nagar, Vadodara – 390020</span>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 h-5 w-5 shrink-0 text-[#7A2533]" />
              <a href="tel:+919033779867" className="hover:text-[#7A2533]">
                +91 90337 79867
              </a>
            </div>
            <div className="flex items-start gap-3">
              <Award className="mt-0.5 h-5 w-5 shrink-0 text-[#7A2533]" />
              <span>Mon–Sat: 10AM–8PM · Sunday: 11AM–7PM</span>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="https://maps.google.com/?q=Vidhi+Square+Vadodara"
              target="_blank"
              rel="noreferrer"
              className="btn-primary"
            >
              Get Directions
            </a>
            <a href="tel:+919033779867" className="btn-secondary">
              Call Us Now
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative flex aspect-[5/4] items-center justify-center overflow-hidden rounded-[28px] bg-[#f5efe8] shadow-[0_12px_40px_rgba(0,0,0,0.08)]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(122,37,51,0.18),transparent_60%)]" />
          <svg
            className="absolute inset-0 h-full w-full opacity-20"
            viewBox="0 0 400 320"
            fill="none"
          >
            <path
              d="M0 80 L400 60 M0 160 L400 180 M0 240 L400 220"
              stroke="#7A2533"
              strokeWidth="1"
            />
            <path
              d="M80 0 L100 320 M200 0 L220 320 M320 0 L300 320"
              stroke="#7A2533"
              strokeWidth="1"
            />
          </svg>
          <div className="relative text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-[#C9A96E] to-[#B8860B] shadow-[0_12px_32px_rgba(201,169,110,0.4)]">
              <MapPin className="h-7 w-7 text-white" />
            </div>
            <p className="font-display mt-4 text-lg text-[#1a1a2e]">Creative Muse</p>
            <p className="text-xs tracking-[0.18em] text-[#7a6e64] uppercase">Vadodara, Gujarat</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* =========================================================
   12. FAQ
   ========================================================= */
const FAQS = [
  [
    "What certifications do your diamonds carry?",
    "All Creative Muse diamonds are IGI or GIA certified, with a unique grading report detailing the 4Cs. Certificates are included with every purchase.",
  ],
  [
    "Do you offer hallmarked gold jewellery?",
    "Yes — every gold piece is BIS hallmarked. The hallmark, purity stamp and HUID number are visible on each item.",
  ],
  [
    "What is your return and exchange policy?",
    "We offer 30-day returns on unworn pieces in original packaging. Custom and engraved orders are non-returnable but exchangeable for store credit.",
  ],
  [
    "Can I customise a piece for my wedding?",
    "Absolutely. Book a private appointment at our Vadodara atelier or via video call — our designers will work with you from sketch to delivery.",
  ],
  [
    "Do you offer EMI options?",
    "Yes — no-cost EMI is available across major credit cards and via Razorpay. Choose your tenure at checkout.",
  ],
  [
    "How long does shipping take across India?",
    "2–5 business days, fully insured and tracked. Free shipping on orders above ₹5,000.",
  ],
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="bg-[#fdf8f3] py-20">
      <div className="mx-auto max-w-[760px] px-6">
        <SectionHeading eyebrow="Good to Know" title="Frequently Asked" />

        <div className="space-y-3">
          {FAQS.map(([q, a], i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={q}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                className="overflow-hidden rounded-[20px] border border-[#e0d8cc] bg-white"
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="font-display text-[15px] font-semibold text-[#1a1a2e]">{q}</span>
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#fdf8f3] text-[#7A2533] transition-transform duration-300 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    <Plus className="h-4 w-4" />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="px-6 pb-5 text-[14px] leading-relaxed text-[#7a6e64]">{a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

import { newsletterApi } from "@/lib/api/newsletter";

/* =========================================================
   13. NEWSLETTER
   ========================================================= */
function Newsletter() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [msg, setMsg] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!valid) {
      setState("error");
      setMsg("Please enter a valid email address.");
      return;
    }
    setState("loading");
    setMsg(null);
    try {
      const result = await newsletterApi.subscribeToNewsletter({
        email: email.trim().toLowerCase(),
        source: "homepage_newsletter",
        consent: true,
      });
      if (result.success || result.status === "already_active") {
        setState("success");
        setMsg(result.message || "Welcome to the Circle!");
        if (result.status === "created") setEmail("");
      } else {
        setState("error");
        setMsg(result.message || "Something went wrong. Please try again.");
      }
    } catch (err: any) {
      setState("error");
      setMsg(err.message || "Something went wrong. Please try again.");
    }
  }

  return (
    <section className="mt-10 px-4 sm:px-6">
      <div className="relative mx-auto max-w-[1320px] overflow-hidden rounded-[40px] bg-gradient-to-br from-[#C9A96E] via-[#c9a96e] to-[#B8860B] px-6 py-16 text-center shadow-[0_24px_64px_rgba(201,169,110,0.3)] sm:py-20">
        <div className="pointer-events-none absolute -top-20 -right-20 h-[300px] w-[300px] rounded-full bg-white/15 blur-[100px]" />
        <Leaf className="absolute top-8 left-10 hidden h-5 w-5 text-white/40 sm:block" />
        <Leaf className="absolute right-12 bottom-10 hidden h-6 w-6 text-white/40 sm:block" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-[11px] font-semibold tracking-[0.24em] text-white/80 uppercase">
            Join the Circle
          </p>
          <h2 className="font-display mt-3 text-[32px] leading-tight font-semibold text-white sm:text-[42px]">
            Join the Creative Muse Circle
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[15px] text-white/85">
            Early access to new collections, exclusive offers, and styling tips from our master
            craftsmen.
          </p>

          <form
            onSubmit={submit}
            className="mx-auto mt-8 flex w-full max-w-lg items-center gap-2 rounded-full border border-white/40 bg-white/20 p-2 backdrop-blur-md"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (state !== "idle") setState("idle");
              }}
              placeholder="Enter your email"
              aria-label="Email address"
              className="min-w-0 flex-1 bg-transparent px-4 text-sm text-white placeholder:text-white/70 focus:outline-none"
            />
            <button
              type="submit"
              disabled={state === "loading"}
              className="btn-dark whitespace-nowrap disabled:opacity-60"
            >
              {state === "loading"
                ? "Sending…"
                : state === "success"
                  ? "Subscribed ✓"
                  : "Subscribe"}
            </button>
          </form>
          {msg && (
            <p
              className={`mt-4 text-[13px] ${state === "error" ? "text-red-100" : "text-white"}`}
              role="status"
            >
              {msg}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
