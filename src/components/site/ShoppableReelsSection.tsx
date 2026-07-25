import { useState, useCallback, useEffect, useRef } from "react";
import { Instagram } from "lucide-react";
import { reelsApi } from "@/lib/api/reels";
import { productsApi } from "@/lib/api/products";
import { useStorefrontProducts } from "@/lib/products";
import { ShoppableReelCard } from "./ShoppableReelCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

const SAMPLE_VIDEO =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";

const SPEED_SECONDS = 1.8;
const INACTIVITY_RESUME_SECONDS = 1.5;

function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mx-auto mb-8 max-w-2xl text-center">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="font-display mt-2 text-[28px] leading-tight font-semibold text-[#1a1a2e] sm:text-[32px] lg:text-[36px]">
        {title}
      </h2>
      <div className="mt-3 flex justify-center">
        <span className="gold-divider" />
      </div>
      {subtitle && <p className="mt-3 text-[14px] text-[#7a6e64] sm:text-[15px]">{subtitle}</p>}
    </div>
  );
}

export function ShoppableReelsSection() {
  const [reels, setReels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { products } = useStorefrontProducts();
  const [api, setApi] = useState<CarouselApi>();

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inactivityRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const pointerStart = useRef({ x: 0, y: 0 });

  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  const canAuto = !prefersReducedMotion && reels.length > 1;

  const stopAutoScroll = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const clearInactivity = useCallback(() => {
    if (inactivityRef.current) {
      clearTimeout(inactivityRef.current);
      inactivityRef.current = null;
    }
  }, []);

  const startAutoScroll = useCallback(() => {
    if (!api || !canAuto) return;
    stopAutoScroll();
    intervalRef.current = setInterval(() => {
      api.scrollNext();
    }, SPEED_SECONDS * 1000);
  }, [api, canAuto, stopAutoScroll]);

  const pauseAutoScroll = useCallback(() => {
    stopAutoScroll();
    clearInactivity();
  }, [stopAutoScroll, clearInactivity]);

  const resumeAutoScroll = useCallback(() => {
    if (canAuto) startAutoScroll();
  }, [canAuto, startAutoScroll]);

  const handlePointerDown = useCallback(() => {
    pauseAutoScroll();
  }, [pauseAutoScroll]);

  const handlePointerUp = useCallback(() => {
    clearInactivity();
    inactivityRef.current = setTimeout(() => {
      resumeAutoScroll();
    }, INACTIVITY_RESUME_SECONDS * 1000);
  }, [clearInactivity, resumeAutoScroll]);

  // Auto-scroll: start when api is ready, restart on every settle
  useEffect(() => {
    if (!api || !canAuto) return;

    const onSettle = () => startAutoScroll();
    startAutoScroll();
    api.on("settle", onSettle);

    return () => {
      stopAutoScroll();
      api.off("settle", onSettle);
    };
  }, [api, canAuto, startAutoScroll, stopAutoScroll]);

  // Visibility change: pause when tab hidden, resume when visible
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        pauseAutoScroll();
      } else {
        resumeAutoScroll();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [pauseAutoScroll, resumeAutoScroll]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAutoScroll();
      clearInactivity();
    };
  }, [stopAutoScroll, clearInactivity]);

  // Fetch reels
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const activeReels = await reelsApi.listActive();
        const productIds = activeReels.map((r) => r.product_id).filter(Boolean);
        let dbProducts: any[] = [];
        if (productIds.length > 0) {
          const { data } = await productsApi.list({ per_page: 100 });
          dbProducts = data || [];
        }
        if (cancelled) return;
        const enriched = activeReels.map((reel) => {
          const product = dbProducts.find(
            (p: any) => p.id === reel.product_id && p.status === "active",
          );
          const mapped = product
            ? {
                id: product.id,
                name: product.name,
                image: product.main_image?.url || product.images?.[0]?.url || "",
                slug: product.slug,
              }
            : null;
          return { reel, product: mapped };
        });
        if (enriched.length > 0) {
          setReels(enriched);
          if (!cancelled) setLoading(false);
          return;
        }
      } catch (err) {
        console.warn("DB reels unavailable, using hardcoded fallback:", err);
      }
      if (cancelled) return;
      if (products.length === 0) {
        if (!cancelled) setLoading(true);
        return;
      }
      const fallbackReels = products.slice(0, 8).map((p, i) => ({
        reel: {
          id: `fallback-${p.id}`,
          video_url: SAMPLE_VIDEO,
          poster_url: p.image,
          product_id: p.id,
          sort_order: i,
          is_active: true,
          alt_text: `${p.name} — shoppable reel`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        product: { id: p.id, name: p.name, image: p.image, slug: p.id },
      }));
      setReels(fallbackReels);
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [products]);

  if (loading) {
    return (
      <section className="bg-[#fdf8f3] py-12 sm:py-16">
        <div className="mx-auto max-w-[1280px] px-6">
          <SectionHeading eyebrow="Shop the Look" title="As Seen on Instagram" />
          <div className="flex gap-5 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="min-w-0 shrink-0 basis-[84%] sm:basis-[46%] lg:basis-1/4">
                <div className="aspect-[9/16] animate-pulse rounded-t-[20px] bg-[#e0d8cc]" />
                <div className="flex animate-pulse items-center gap-3 rounded-b-[20px] border border-t-0 border-[#e0d8cc] bg-white px-4 py-[18px]">
                  <div className="h-[52px] w-[52px] rounded-[12px] bg-[#e0d8cc]" />
                  <div className="h-4 flex-1 rounded bg-[#e0d8cc]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (reels.length === 0) return null;

  return (
    <section ref={sectionRef} className="bg-[#fdf8f3] py-12 sm:py-16">
      <div className="mx-auto max-w-[1280px] px-6">
        <SectionHeading
          eyebrow="Shop the Look"
          title="As Seen on Instagram"
          subtitle="Tap any reel to discover the jewellery."
        />

        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
            dragFree: true,
            containScroll: "trimSnaps",
            duration: 12,
          }}
        >
          <CarouselContent
            className="-ml-4"
            onPointerDown={(e) => {
              pointerStart.current = { x: e.clientX, y: e.clientY };
              handlePointerDown();
            }}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            {reels.map((item) => (
              <CarouselItem
                key={item.reel.id}
                className="basis-[84%] pl-4 sm:basis-[46%] md:basis-[44%] lg:basis-1/4 xl:basis-[22%]"
              >
                <ShoppableReelCard reel={item.reel} product={item.product} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="mt-8 flex justify-center">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="btn-secondary inline-flex items-center gap-2"
          >
            <Instagram className="h-4 w-4" />
            Follow @creativemuse_ on Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
