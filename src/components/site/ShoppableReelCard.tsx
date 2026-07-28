import { useRef, useState, useEffect, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import { VolumeX, Volume2 } from "lucide-react";
import type { ShoppableReelRow } from "@/lib/db/types";

interface ReelWithProduct {
  reel: ShoppableReelRow;
  product: { id: string; name: string; image: string; slug: string } | null;
}

export function ShoppableReelCard({ reel, product }: ReelWithProduct) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [muted, setMuted] = useState(true);
  const [intersecting, setIntersecting] = useState(false);

  const toggleMute = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setMuted((m) => !m);
  };

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (intersecting) {
      const playPromise = el.play();
      if (playPromise) playPromise.catch(() => {});
    } else {
      el.pause();
    }
  }, [intersecting]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = muted;
  }, [muted]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const handleVisibility = () => {
      if (document.hidden) el.pause();
      else if (intersecting) {
        const playPromise = el.play();
        if (playPromise) playPromise.catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [intersecting]);

  useEffect(() => {
    const node = cardRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIntersecting(entry.isIntersecting);
      },
      { threshold: 0.6 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const hasProduct = product && product.id;
  const productPath = hasProduct
    ? ("/product/$productId" as const)
    : undefined;
  const productParams = hasProduct ? { productId: product.id } : undefined;

  return (
    <div ref={cardRef} className="group w-full snap-start shrink-0">
      <div className="relative overflow-hidden rounded-t-[20px] bg-[#f5efe8]">
        <video
          ref={videoRef}
          src={reel.video_url}
          poster={reel.poster_url || undefined}
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={reel.alt_text || "Shoppable reel"}
          className="aspect-[9/16] w-full object-cover"
        >
          {reel.alt_text || "Jewellery reel video"}
        </video>
        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? "Unmute reel" : "Mute reel"}
          className="absolute right-3 bottom-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
        >
          {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
      </div>
      {hasProduct ? (
        <Link
          to={productPath}
          params={productParams}
          className="flex items-center gap-3 rounded-b-[20px] border border-t-0 border-[#e0d8cc] bg-white px-4 py-[18px] transition-colors hover:bg-[#fdf8f3]"
          aria-label={`View ${product.name}`}
        >
          <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center overflow-hidden rounded-[12px] bg-[#f5efe8]">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-contain p-1.5"
              loading="lazy"
              decoding="async"
            />
          </div>
          <span className="font-display line-clamp-2 text-sm font-semibold text-[#1a1a2e]">
            {product.name}
          </span>
        </Link>
      ) : (
        <div className="rounded-b-[20px] border border-t-0 border-[#e0d8cc] bg-white px-4 py-[18px] text-sm text-[#7a6e64]">
          Product unavailable
        </div>
      )}
    </div>
  );
}
