import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { ProductCard } from "./ProductCard";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Product } from "@/lib/products";

export interface AutoScrollSettings {
  autoScrollEnabled?: boolean;
  scrollDirection?: "left" | "right";
  scrollSpeed?: number;
  pauseOnHover?: boolean;
  autoResumeEnabled?: boolean;
  autoResumeDelaySeconds?: number;
}

interface ProductCarouselSectionProps {
  eyebrow: string;
  title?: string;
  products: Product[];
  autoScroll?: AutoScrollSettings;
}

const DEFAULT_AUTO_SCROLL: AutoScrollSettings = {
  autoScrollEnabled: false,
  scrollDirection: "left",
  scrollSpeed: 30,
  pauseOnHover: true,
  autoResumeEnabled: true,
  autoResumeDelaySeconds: 3,
};

export function ProductCarouselSection({
  eyebrow,
  title,
  products,
  autoScroll,
}: ProductCarouselSectionProps) {
  const config = { ...DEFAULT_AUTO_SCROLL, ...autoScroll } as Required<AutoScrollSettings>;

  const [api, setApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const pointerStart = useRef({ x: 0, y: 0 });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inactivityRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initialTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const effectiveAutoScrollEnabled = config.autoScrollEnabled && !prefersReducedMotion;

  const startAutoScroll = useCallback(() => {
    if (!api || !effectiveAutoScrollEnabled) return;
    const slides = api.scrollSnapList().length;
    if (slides <= 1 || products.length <= 1) return;

    stopAutoScroll();

    const speedMs = Math.max(config.scrollSpeed, 3) * 1000;
    const intervalMs = speedMs / Math.max(slides, 1);

    intervalRef.current = setInterval(() => {
      if (!api) return;
      if (config.scrollDirection === "right") {
        api.scrollPrev();
      } else {
        api.scrollNext();
      }
    }, intervalMs);
  }, [
    api,
    effectiveAutoScrollEnabled,
    products.length,
    config.scrollSpeed,
    config.scrollDirection,
  ]);

  const stopAutoScroll = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const clearInactivityTimer = useCallback(() => {
    if (inactivityRef.current) {
      clearTimeout(inactivityRef.current);
      inactivityRef.current = null;
    }
  }, []);

  const pauseAutoScroll = useCallback(() => {
    stopAutoScroll();
    clearInactivityTimer();
  }, [stopAutoScroll, clearInactivityTimer]);

  const resumeAutoScroll = useCallback(() => {
    if (effectiveAutoScrollEnabled) {
      startAutoScroll();
    }
  }, [effectiveAutoScrollEnabled, startAutoScroll]);

  useEffect(() => {
    if (!api) return;
    if (effectiveAutoScrollEnabled) {
      const onSettle = () => startAutoScroll();
      api.on("settle", onSettle);
      initialTimerRef.current = setTimeout(() => startAutoScroll(), 800);
      return () => {
        api.off("settle", onSettle);
        stopAutoScroll();
        if (initialTimerRef.current) {
          clearTimeout(initialTimerRef.current);
          initialTimerRef.current = null;
        }
      };
    } else {
      stopAutoScroll();
    }
  }, [api, effectiveAutoScrollEnabled, startAutoScroll, stopAutoScroll]);

  const handleMouseEnter = useCallback(() => {
    if (config.pauseOnHover) {
      pauseAutoScroll();
    }
  }, [config.pauseOnHover, pauseAutoScroll]);

  const handleMouseLeave = useCallback(() => {
    if (config.pauseOnHover) {
      resumeAutoScroll();
    }
  }, [config.pauseOnHover, resumeAutoScroll]);

  const handlePointerDown = useCallback(() => {
    pauseAutoScroll();
  }, [pauseAutoScroll]);

  const handlePointerUp = useCallback(() => {
    clearInactivityTimer();
    if (config.autoResumeEnabled) {
      inactivityRef.current = setTimeout(() => {
        resumeAutoScroll();
      }, config.autoResumeDelaySeconds * 1000);
    }
  }, [
    config.autoResumeEnabled,
    config.autoResumeDelaySeconds,
    clearInactivityTimer,
    resumeAutoScroll,
  ]);

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

  useEffect(() => {
    return () => {
      stopAutoScroll();
      clearInactivityTimer();
      if (initialTimerRef.current) {
        clearTimeout(initialTimerRef.current);
        initialTimerRef.current = null;
      }
    };
  }, [stopAutoScroll, clearInactivityTimer]);

  const onSelect = useCallback((carouselApi: CarouselApi) => {
    if (!carouselApi) return;
    setSelectedIndex(carouselApi.selectedScrollSnap());
    setScrollSnaps(carouselApi.scrollSnapList());
  }, []);

  useEffect(() => {
    if (!api) return;
    onSelect(api);
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api, onSelect]);

  return (
    <section
      ref={sectionRef}
      className="bg-[#fdf8f3] py-20"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            {title && (
              <h2 className="font-display mt-3 text-[32px] leading-tight font-semibold text-[#1a1a2e] sm:text-[40px]">
                {title}
              </h2>
            )}
            <span className="gold-divider mt-4 inline-block" />
          </div>
        </div>

        <div className="mt-10">
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop: effectiveAutoScrollEnabled,
              dragFree: false,
              duration: 25,
            }}
          >
            <CarouselContent
              onPointerDown={(e) => {
                pointerStart.current = { x: e.clientX, y: e.clientY };
                handlePointerDown();
              }}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
            >
              {products.map((p, i) => (
                <CarouselItem
                  key={p.id}
                  className="basis-[84%] sm:basis-[46%] md:basis-[44%] lg:basis-1/3 xl:basis-1/4"
                >
                  <div className="h-full transition-transform duration-400">
                    <ProductCard product={p} index={i} pointerStart={pointerStart} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          <div
            className="mt-4 flex items-center justify-center gap-3 sm:mt-5 sm:gap-4"
            aria-label={`${eyebrow} carousel controls`}
          >
            <button
              onClick={() => {
                pauseAutoScroll();
                api?.scrollPrev();
              }}
              disabled={!api?.canScrollPrev()}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d8d0c6] bg-[#fdf8f3] text-[#1a1a2e] shadow-[0_6px_14px_rgba(0,0,0,0.07)] transition-all hover:border-[#7A2533] hover:text-[#7A2533] disabled:opacity-40 sm:h-12 sm:w-12"
              aria-label="Previous products"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>

            {scrollSnaps.length > 1 && (
              <div className="flex items-center gap-2 sm:gap-2.5">
                {scrollSnaps.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      pauseAutoScroll();
                      api?.scrollTo(i);
                    }}
                    className={`h-2 rounded-full border border-[#7A2533] transition-all duration-300 sm:h-2.5 ${
                      i === selectedIndex
                        ? "w-7 bg-[#7A2533] sm:w-9"
                        : "w-2 bg-transparent sm:w-2.5"
                    }`}
                    aria-label={`Go to product ${i + 1} of ${scrollSnaps.length}`}
                  />
                ))}
              </div>
            )}

            <button
              onClick={() => {
                pauseAutoScroll();
                api?.scrollNext();
              }}
              disabled={!api?.canScrollNext()}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d8d0c6] bg-[#fdf8f3] text-[#1a1a2e] shadow-[0_6px_14px_rgba(0,0,0,0.07)] transition-all hover:border-[#7A2533] hover:text-[#7A2533] disabled:opacity-40 sm:h-12 sm:w-12"
              aria-label="Next products"
            >
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
          <div className="mt-6 border-b border-[#e0d8cc]" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
