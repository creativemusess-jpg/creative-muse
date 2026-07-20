import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState, useCallback } from "react";
import {
  Sparkles,
  Award,
  Diamond,
  Truck,
  RotateCcw,
  Shield,
  ChevronRight,
  ChevronLeft,
  Phone,
  MapPin,
  Play,
  Plus,
  Hand,
  Leaf,
  Package,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { type Product, useStorefrontProducts } from "@/lib/products";
import { categoriesApi } from "@/lib/api/categories";
import { contentApi } from "@/lib/api/content";
import { ProductCard } from "@/components/site/ProductCard";
import { ShoppableReelsSection } from "@/components/site/ShoppableReelsSection";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import type { CarouselApi } from "@/components/ui/carousel";
import { useStore } from "@/lib/store";
import { ProductCarouselSection, type AutoScrollSettings } from "@/components/site/ProductCarouselSection";
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
import prodJhumka from "@/assets/prod-jhumka.jpg";

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
      { property: "og:title", content: "Creative Muse Fine Jewellery — Where Every Gem Tells Your Story" },
      {
        property: "og:description",
        content: "Discover handcrafted fine jewellery from Vadodara. BIS Hallmarked gold, IGI certified diamonds, bridal collections and everyday luxury.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <AnnouncementBanner />
      <Hero />
      <TrustBar />
      <ShopByCategory />
      <FeaturedBanner />
      <BestSellers />
      <ShoppableReelsSection />
      <NewArrivals />
      <PremiumArrivals />
      <Offers />
      <WhyChoose />
      <VideoBanner />
      <StoreLocation />
      <FAQ />
      <Newsletter />
    </>
  );
}

/* =========================================================
   0. ANNOUNCEMENT BANNER
   ========================================================= */
function AnnouncementBanner() {
  return (
    <div className="bg-[#8B1A1A] py-2 text-center text-[11px] font-semibold tracking-[0.15em] text-white uppercase">
      <span className="animate-pulse mx-1">✦</span> Free insured shipping on all orders above ₹5,000{" "}
      <span className="animate-pulse mx-1">✦</span>
    </div>
  );
}

/* =========================================================
   1. HERO
   ========================================================= */
const HERO_SLIDES = [
  {
    badge: "Vadodara's Premier Fine Jewellery",
    title: <>Where Every Gem<br /><span className="shimmer-text italic">Tells Your Story</span></>,
    desc: "Handcrafted fine jewellery for life's most precious moments. From bridal masterpieces to everyday elegance — designed in Vadodara, treasured for generations.",
    image: heroRing,
    imageAlt: "Aarav Solitaire — 18K rose gold diamond ring",
    stat: "₹48,500",
  },
  {
    badge: "Bridal Edit 2025",
    title: <>Celebrate Life's<br /><span className="shimmer-text italic">Golden Moments</span></>,
    desc: "Exquisite bridal sets crafted to make your special day unforgettable. Each piece tells a story of love, tradition, and timeless beauty.",
    image: prodPolki,
    imageAlt: "Polki Choker — Traditional bridal jewellery",
    stat: "Starting ₹12,500",
  },
];

function Hero() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const onSelect = useCallback((a: CarouselApi) => {
    setCurrent(a?.selectedScrollSnap() ?? 0);
  }, []);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
    return () => { api.off("select", onSelect); };
  }, [api, onSelect]);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#fdf8f3] via-[#f7ede0] to-[#f0dcc8]">
      <div className="pointer-events-none absolute -top-32 -left-32 h-[480px] w-[480px] rounded-full bg-[#C9A96E]/20 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 -bottom-40 h-[520px] w-[520px] rounded-full bg-[#E8B4A0]/25 blur-[140px]" />

      <Carousel setApi={setApi} opts={{ loop: true, align: "start" }} className="relative">
        <CarouselContent>
          {HERO_SLIDES.map((slide, idx) => (
            <CarouselItem key={idx}>
              <div className="relative mx-auto grid max-w-[1280px] items-center gap-6 px-6 pt-8 pb-12 md:pt-10 md:pb-16 lg:grid-cols-[55fr_45fr] lg:gap-8 lg:pt-12 lg:pb-16">
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                  className="flex flex-col justify-center"
                >
                  <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#C9A96E]/40 bg-white/60 px-4 py-1.5 text-[11px] font-semibold tracking-[0.18em] text-[#8a6a2a] uppercase backdrop-blur-sm">
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

                  <div className="mt-6 flex flex-wrap items-center gap-x-10 gap-y-4 border-t border-[#C9A96E]/20 pt-5">
                    {[
                      ["15+", "Years of Craft"],
                      ["50K+", "Happy Customers"],
                      ["100%", "Hallmarked Gold"],
                    ].map(([n, l]) => (
                      <div key={l}>
                        <p className="font-display text-2xl font-bold text-[#1a1a2e]">{n}</p>
                        <p className="text-[11px] tracking-[0.14em] text-[#5a4e44] uppercase">{l}</p>
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
                      <img
                        src={slide.image}
                        alt={slide.imageAlt}
                        width={1024}
                        height={1280}
                        className="h-full w-full rounded-[20px] object-contain drop-shadow-[0_24px_48px_rgba(201,169,110,0.35)]"
                      />
                    </div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="absolute top-4 left-2 hidden rounded-[18px] border border-[#C9A96E]/30 bg-white/90 p-3 shadow-[0_8px_32px_rgba(201,169,110,0.2)] backdrop-blur-xl md:block"
                  >
                    <p className="eyebrow text-[9px] text-[#8a6a2a]">Best Seller</p>
                    <p className="font-display mt-1 text-sm font-semibold text-[#1a1a2e]">Aarav Solitaire</p>
                    <p className="mt-0.5 text-[13px] font-bold text-[#8a6a2a]">{slide.stat}</p>
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
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => api?.scrollTo(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === current ? "w-7 bg-[#8B1A1A]" : "w-2 bg-[#C9A96E]/50"
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
  return (
    <section className="bg-[#1a1a2e] py-5">
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-center gap-x-10 gap-y-3 px-6 text-[12px] tracking-[0.1em] text-[#E8C98A] uppercase">
        {items.map(([Ic, label]) => (
          <div key={label} className="flex items-center gap-2.5">
            <Ic className="h-4 w-4 text-[#C9A96E]" />
            <span>{label}</span>
          </div>
        ))}
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
        <p className={`mt-5 text-[15px] ${light ? "text-white/70" : "text-[#7a6e64]"}`}>{subtitle}</p>
      )}
    </motion.div>
  );
}

/* =========================================================
   3. SHOP BY CATEGORY
   ========================================================= */
function ShopByCategory() {
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const [catLoaded, setCatLoaded] = useState(false);

  useEffect(() => {
    categoriesApi.list(true).then((data) => {
      setDbCategories(data);
      setCatLoaded(true);
    }).catch(() => setCatLoaded(true));
  }, []);

  if (!catLoaded) return null;

  return (
    <section id="shop-by-category" className="scroll-mt-40 bg-[#fdf8f3] py-16 md:py-20">
      <div className="mx-auto max-w-[1280px] px-6">
        <SectionHeading eyebrow="Browse" title="Shop by Category" />

        <div className="mt-10">
          <Carousel opts={{ align: "start", dragFree: true }}>
            <CarouselContent className="-ml-3 md:-ml-4">
              {dbCategories.map((cat, i) => {
                const categoryImg = cat.imageUrl || CATEGORY_IMAGES[cat.name] || null;
                return (
                <CarouselItem key={cat.id} className="basis-[44%] pl-3 sm:basis-[30%] md:basis-1/4 md:pl-4 lg:basis-[20%]">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="h-full"
                  >
                     <Link
                      to={`/category/${cat.slug}`}
                      className="group flex h-full flex-col items-center rounded-[24px] border border-transparent bg-white p-3 pb-4 text-center shadow-[0_4px_24px_rgba(0,0,0,0.04)] transition-all duration-500 hover:-translate-y-2 hover:border-[#C9A96E]/50 hover:shadow-[0_20px_60px_rgba(201,169,110,0.22)] active:scale-[0.97] md:p-4 md:pb-5"
                    >
                      <div className="relative aspect-square w-full overflow-hidden rounded-[18px] bg-gradient-to-br from-[#fdf8f3] to-[#f0e4cd]">
                        {categoryImg ? (
                          <img
                            src={categoryImg}
                            alt={cat.name}
                            loading="lazy"
                            width={768}
                            height={768}
                            className="absolute inset-0 h-full w-full object-contain p-2 transition-transform duration-700 ease-out group-hover:scale-110 md:p-3"
                            onError={(e) => { e.currentTarget.style.display = "none"; }}
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-[#f5efe8] p-3">
                            <svg className="h-8 w-8 text-[#c9a96e]/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" /></svg>
                          </div>
                        )}
                      </div>
                      <p className="font-display mt-3 text-[14px] font-semibold text-[#1a1a2e] md:mt-4 md:text-[15px]">
                        {cat.name}
                      </p>
                    </Link>
                  </motion.div>
                </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   4. FEATURED BANNER
   ========================================================= */
const CTA_FALLBACK_IMAGES = [
  { src: prodPolki, alt: "Royal Polki Bridal Choker" },
  { src: prodCelestia, alt: "Celestia Drop Bridal Earrings" },
  { src: prodAarav, alt: "Aarav Solitaire Bridal Ring" },
];

const CTA_CARD_STYLES = [
  { top: "0%", left: "10%", rot: -6, delay: 0 },
  { top: "20%", left: "40%", rot: 4, delay: 0.4 },
  { top: "45%", left: "5%", rot: -3, delay: 0.8 },
];

function FeaturedBanner() {
  const [ctaImages, setCtaImages] = useState<{ src: string; alt: string }[] | null>(null);
  const [ctaLoaded, setCtaLoaded] = useState(false);

  useEffect(() => {
    contentApi.getSection("featured_banner").then((section) => {
      if (section?.content?.cta_images) {
        setCtaImages(section.content.cta_images);
      }
      setCtaLoaded(true);
    }).catch(() => setCtaLoaded(true));
  }, []);

  const images = ctaImages && ctaImages.length === 3 ? ctaImages : CTA_FALLBACK_IMAGES;

  if (!ctaLoaded) return null;

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
            <p className="eyebrow text-[#E8C98A]">Bridal Edit</p>
            <h2 className="font-display mt-3 text-[34px] leading-tight font-semibold text-white sm:text-[44px] lg:text-[48px]">
              The 2025<br />
              <span className="shimmer-text">Bridal Collection</span>
            </h2>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/70">
              Heirloom-worthy pieces curated for the modern Indian bride. Polki, Kundan, Diamond and
              Gold — designed to be worn for a lifetime.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/shop" className="btn-primary">View Collection</Link>
              <Link to="/contact" className="btn-secondary border-[#E8C98A] text-[#E8C98A] hover:bg-[#E8C98A] hover:text-[#1a1a2e]">
                Book Consultation
              </Link>
            </div>
          </motion.div>

          <div className="relative hidden h-[420px] lg:block">
            {CTA_CARD_STYLES.map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30, rotate: c.rot - 6 }}
                whileInView={{ opacity: 1, y: 0, rotate: c.rot }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: c.delay }}
                className="absolute h-56 w-44 overflow-hidden rounded-[28px] bg-[#fdf8f3] shadow-[0_24px_64px_rgba(0,0,0,0.3)]"
                style={{ top: c.top, left: c.left }}
              >
                <img
                  src={images[i].src}
                  alt={images[i].alt}
                  className="h-full w-full object-cover"
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
              </motion.div>
            ))}
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
        return products.filter((p) => p.badge === "New");
      case "Wedding":
        return products.filter((p) => p.badge === "Wedding");
      case "Trending":
        return products.filter((p) => p.badge === "Trending");
      default:
        return products.filter((p) => p.badge === "Best Seller" || p.badge === "Trending" || p.badge === "Wedding").slice(0, 8);
    }
  })();

  return (
    <section className="bg-[#f5efe8] py-20">
      <div className="mx-auto max-w-[1280px] px-6">
        <SectionHeading eyebrow="Our Jewellery" title="Handpicked Best Sellers" />

        <div className="mb-8 flex justify-center md:mb-10">
          <div className="w-[calc(100%-32px)] max-w-[430px] grid-cols-2 gap-1.5 rounded-[28px] bg-white p-2 shadow-[0_4px_16px_rgba(0,0,0,0.06)] md:inline-flex md:w-auto md:max-w-none md:flex-wrap md:justify-center md:gap-1 md:rounded-full md:p-1.5">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setActive(t)}
                className={`flex h-[52px] w-full items-center justify-center rounded-[22px] text-[clamp(11px,3.3vw,15px)] font-semibold tracking-[0.08em] uppercase transition-all duration-300 md:h-auto md:w-auto md:rounded-full md:px-5 md:py-2.5 md:text-[12px] md:tracking-[0.1em] ${
                  active === t
                    ? "bg-gradient-to-r from-[#C9A96E] to-[#B8860B] text-white shadow-[0_6px_16px_rgba(201,169,110,0.35)]"
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
                  <CarouselItem key={p.id} className="basis-[48%] pl-3 sm:basis-[45%] md:basis-1/3 md:pl-4 lg:basis-1/4">
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
  const [scrollSettings, setScrollSettings] = useState<AutoScrollSettings | undefined>();

  useEffect(() => {
    contentApi.getSection('new_arrivals').then((section) => {
      if (section) {
        setScrollSettings({
          autoScrollEnabled: section.auto_scroll_enabled ?? false,
          scrollDirection: section.scroll_direction ?? 'left',
          scrollSpeed: section.scroll_speed ?? 30,
          pauseOnHover: section.pause_on_hover ?? true,
          autoResumeEnabled: section.auto_resume_enabled ?? true,
          autoResumeDelaySeconds: section.auto_resume_delay_seconds ?? 3,
        });
      }
    });
  }, []);

  const list = useMemo(
    () => products.filter((p) => p.badge === "New").concat(products).slice(0, 6),
    [products],
  );
  return (
    <ProductCarouselSection
      eyebrow="Just Arrived"
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
  const [scrollSettings, setScrollSettings] = useState<AutoScrollSettings | undefined>();

  useEffect(() => {
    contentApi.getSection('premium_arrivals').then((section) => {
      if (section) {
        setScrollSettings({
          autoScrollEnabled: section.auto_scroll_enabled ?? false,
          scrollDirection: section.scroll_direction ?? 'left',
          scrollSpeed: section.scroll_speed ?? 30,
          pauseOnHover: section.pause_on_hover ?? true,
          autoResumeEnabled: section.auto_resume_enabled ?? true,
          autoResumeDelaySeconds: section.auto_resume_delay_seconds ?? 3,
        });
      }
    });
  }, []);

  const list = useMemo(
    () => products.filter((p) => p.badge === "New").concat(products).slice(0, 6),
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
   8. OFFERS
   ========================================================= */
function Offers() {
  const cards = [
    {
      bg: "from-[#1a1a2e] via-[#2d1b4e] to-[#1a1a2e]",
      image: prodAarav,
      title: "Diamond Sale",
      copy: "Up to 30% off this weekend",
      cta: "Shop Diamonds",
    },
    {
      bg: "from-[#8B1A4A] via-[#a8326b] to-[#5e0e33]",
      image: prodPolki,
      title: "Bridal Bundle",
      copy: "Complete sets + free gift wrap",
      cta: "View Sets",
    },
    {
      bg: "from-[#3a3028] via-[#5a4a3c] to-[#1a1a1a]",
      image: prodJhumka,
      title: "Gift Collection",
      copy: "Free luxury packaging above ₹10,000",
      cta: "Shop Gifts",
    },
  ];
  return (
    <section className="bg-[#f5efe8] py-20">
      <div className="mx-auto max-w-[1280px] px-6">
        <Carousel opts={{ align: "start" }}>
          <CarouselContent className="-ml-4 md:-ml-6">
            {cards.map((c, i) => (
              <CarouselItem key={c.title} className="basis-[85%] pl-4 sm:basis-[55%] md:basis-1/3 md:pl-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`relative overflow-hidden rounded-[28px] bg-gradient-to-br p-8 text-white shadow-[0_12px_40px_rgba(0,0,0,0.15)] ${c.bg}`}
                >
                  <div className="absolute inset-0 opacity-10">
                    <img src={c.image} alt="" className="h-full w-full object-contain p-4" />
                  </div>
                  <div className="relative">
                    <h3 className="font-display mt-4 text-2xl font-semibold text-white">{c.title}</h3>
                    <p className="mt-2 text-sm text-white/75">{c.copy}</p>
                    <Link
                      to="/shop"
                      className="mt-6 inline-flex items-center gap-2 text-[12px] font-semibold tracking-[0.16em] text-[#E8C98A] uppercase"
                    >
                      {c.cta} <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}

/* =========================================================
   9. WHY CHOOSE
   ========================================================= */
function WhyChoose() {
  const items = [
    [Award, "Certified Purity", "BIS hallmarked & IGI graded"],
    [Hand, "Master Craftsmen", "Five generations of artistry"],
    [Diamond, "Ethically Sourced", "Conflict-free gemstones"],
    [RotateCcw, "Lifetime Exchange", "Buyback at honest value"],
    [Package, "Luxury Packaging", "Heirloom-worthy presentation"],
    [Phone, "Personal Stylist", "Private appointments"],
    [Shield, "Secure Payments", "Razorpay & UPI protected"],
    [Truck, "Insured Delivery", "Free above ₹5,000"],
  ] as const;
  return (
    <section className="bg-[#fdf8f3] py-20">
      <div className="mx-auto max-w-[1280px] px-6">
        <SectionHeading eyebrow="The Creative Muse Promise" title="Why Choose Us" />

        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {items.map(([Ic, title, desc], i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className="rounded-[24px] border border-[#e0d8cc]/70 bg-white p-6 text-center shadow-[0_4px_16px_rgba(0,0,0,0.04)] transition-all duration-400 hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(201,169,110,0.18)]"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#fdf8f3] to-[#f0e4cd]">
                <Ic className="h-6 w-6 text-[#C9A96E]" />
              </div>
              <h4 className="font-display mt-4 text-[15px] font-semibold text-[#1a1a2e]">{title}</h4>
              <p className="mt-1.5 text-[12px] leading-relaxed text-[#7a6e64]">{desc}</p>
            </motion.div>
          ))}
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
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(201,169,110,0.25),transparent_60%)]" />
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
            Step Inside Our<br />Vadodara Atelier
          </h2>
          <div className="mt-6 space-y-4 text-[15px] text-[#3a3028]">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#C9A96E]" />
              <span>GF-3/4, Vidhi Square Complex, BPC Road, Anand Nagar, Vadodara – 390020</span>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 h-5 w-5 shrink-0 text-[#C9A96E]" />
              <a href="tel:+919033779867" className="hover:text-[#C9A96E]">+91 90337 79867</a>
            </div>
            <div className="flex items-start gap-3">
              <Award className="mt-0.5 h-5 w-5 shrink-0 text-[#C9A96E]" />
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
            <a href="tel:+919033779867" className="btn-secondary">Call Us Now</a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative flex aspect-[5/4] items-center justify-center overflow-hidden rounded-[28px] bg-[#f5efe8] shadow-[0_12px_40px_rgba(0,0,0,0.08)]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(201,169,110,0.18),transparent_60%)]" />
          <svg className="absolute inset-0 h-full w-full opacity-20" viewBox="0 0 400 320" fill="none">
            <path d="M0 80 L400 60 M0 160 L400 180 M0 240 L400 220" stroke="#C9A96E" strokeWidth="1" />
            <path d="M80 0 L100 320 M200 0 L220 320 M320 0 L300 320" stroke="#C9A96E" strokeWidth="1" />
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
  ["What certifications do your diamonds carry?", "All Creative Muse diamonds are IGI or GIA certified, with a unique grading report detailing the 4Cs. Certificates are included with every purchase."],
  ["Do you offer hallmarked gold jewellery?", "Yes — every gold piece is BIS hallmarked. The hallmark, purity stamp and HUID number are visible on each item."],
  ["What is your return and exchange policy?", "We offer 30-day returns on unworn pieces in original packaging. Custom and engraved orders are non-returnable but exchangeable for store credit."],
  ["Can I customise a piece for my wedding?", "Absolutely. Book a private appointment at our Vadodara atelier or via video call — our designers will work with you from sketch to delivery."],
  ["Do you offer EMI options?", "Yes — no-cost EMI is available across major credit cards and via Razorpay. Choose your tenure at checkout."],
  ["How long does shipping take across India?", "2–5 business days, fully insured and tracked. Free shipping on orders above ₹5,000."],
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
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#fdf8f3] text-[#C9A96E] transition-transform duration-300 ${
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
      <div className="relative mx-auto max-w-[1320px] overflow-hidden rounded-[40px] bg-gradient-to-br from-[#C9A96E] via-[#d4b27a] to-[#B8860B] px-6 py-16 text-center shadow-[0_24px_64px_rgba(201,169,110,0.3)] sm:py-20">
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
              {state === "loading" ? "Sending…" : state === "success" ? "Subscribed ✓" : "Subscribe"}
            </button>
          </form>
          {msg && (
            <p
              className={`mt-4 text-[13px] ${
                state === "error" ? "text-red-100" : "text-white"
              }`}
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
