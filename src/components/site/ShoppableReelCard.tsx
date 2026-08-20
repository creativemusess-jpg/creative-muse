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
  const [videoFailed, setVideoFailed] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  // Reset the failed flags whenever the reel/video changes
  useEffect(() => {
    setVideoFailed(false);
    setImgFailed(false);
  }, [reel.video_url, product?.image]);

  const play = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    const playPromise = el.play();
    if (playPromise) playPromise.catch(() => {});
  }, []);

  const pause = useCallback(() => {
    videoRef.current?.pause();
  }, []);

  // Play only when the card is visible on screen; pause otherwise
  useEffect(() => {
    if (intersecting) play();
    else pause();
  }, [intersecting, play, pause]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = muted;
  }, [muted]);

  // Pause when the tab is hidden, resume when it becomes visible again
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) pause();
      else if (intersecting) play();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [intersecting, play, pause]);

  // Track which cards are on screen so only visible reels play
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

  const toggleMute = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setMuted((m) => !m);
  };

  const hasProduct = product && product.slug;

  const showVideo = !!reel.video_url && !videoFailed;

  return (
    <div ref={cardRef} className="group w-full snap-start shrink-0">
      <div className="relative overflow-hidden rounded-t-[20px] bg-[#f5efe8]">
        {hasProduct && (
          <Link
            to="/product/$productId"
            params={{ productId: product.slug }}
            aria-label={`View ${product.name}`}
            className="absolute inset-0 z-[5] outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96E]"
          />
        )}
        {showVideo ? (
          <video
            ref={videoRef}
            src={reel.video_url}
            poster={reel.poster_url || undefined}
            muted
            loop
            playsInline
            preload="metadata"
            onError={() => setVideoFailed(true)}
            aria-label={reel.alt_text || "Shoppable reel video"}
            className="aspect-[9/16] w-full object-cover"
          />
        ) : (
          <div className="flex aspect-[9/16] w-full items-center justify-center bg-[#f5efe8]">
            {reel.poster_url ? (
              <img
                src={reel.poster_url}
                alt={reel.alt_text || "Jewellery reel poster"}
                loading="lazy"
                decoding="async"
                className="aspect-[9/16] h-full w-full object-cover"
              />
            ) : (
              <div className="px-4 text-center text-sm text-[#7a6e64]">Video unavailable</div>
            )}
          </div>
        )}
        {showVideo && (
          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted ? "Unmute video" : "Mute video"}
            aria-pressed={!muted}
            className="absolute right-3 bottom-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
        )}
      </div>
      {hasProduct ? (
        <Link
          to="/product/$productId"
          params={{ productId: product.slug }}
          className="flex items-center gap-3 rounded-b-[20px] border border-t-0 border-[#e0d8cc] bg-white px-4 py-[18px] transition-colors hover:bg-[#fdf8f3]"
          aria-label={`View ${product.name}`}
        >
          <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center overflow-hidden rounded-[12px] bg-[#f5efe8]">
            {product.image && !imgFailed ? (
              <img
                src={product.image}
                alt={product.name}
                loading="lazy"
                decoding="async"
                onError={() => setImgFailed(true)}
                className="h-full w-full object-contain p-1.5"
              />
            ) : (
              <span className="font-display text-xs font-semibold text-[#7a6e64]">
                {product.name.slice(0, 2).toUpperCase()}
              </span>
            )}
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
