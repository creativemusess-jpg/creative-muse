import { useState, useEffect, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { Instagram } from "lucide-react";
import { reelsApi } from "@/lib/api/reels";
import { productsApi } from "@/lib/api/products";
import { ShoppableReelCard } from "./ShoppableReelCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

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
      {subtitle && (
        <p className="mt-3 text-[14px] text-[#7a6e64] sm:text-[15px]">{subtitle}</p>
      )}
    </div>
  );
}

export function ShoppableReelsSection() {
  const [reels, setReels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const activeReels = await reelsApi.listActive();
        const productIds = activeReels.map((r) => r.product_id).filter(Boolean);
        let products: any[] = [];
        if (productIds.length > 0) {
          const { data } = await productsApi.list({ per_page: 100 });
          products = data || [];
        }
        if (cancelled) return;
        const enriched = activeReels.map((reel) => {
          const product = products.find(
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
        setReels(enriched);
      } catch (err) {
        console.error("Failed to load shoppable reels:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const hasReels = reels.length > 0;

  if (loading) {
    return (
      <section className="bg-[#fdf8f3] py-12 sm:py-16">
        <div className="mx-auto max-w-[1280px] px-6">
          <SectionHeading
            eyebrow="Shop the Look"
            title="As Seen on Instagram"
          />
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

  if (!hasReels) return null;

  return (
    <section className="bg-[#fdf8f3] py-12 sm:py-16">
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
            loop: false,
            dragFree: true,
            containScroll: "trimSnaps",
          }}
        >
          <CarouselContent className="-ml-4">
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
