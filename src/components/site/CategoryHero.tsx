import { Link } from "@tanstack/react-router";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type CategoryHeroProps = {
  category: {
    name: string;
    description?: string | null;
    image?: string | null;
    imageUrl?: string | null;
    hero_image?: string | null;
    hero_video?: string | null;
    hero_video_mobile?: string | null;
    banner_heading?: string | null;
    banner_description?: string | null;
    cta_button_text?: string | null;
    cta_link?: string | null;
    mobile_banner?: string | null;
    desktop_banner?: string | null;
  };
};

export function CategoryHero({ category }: CategoryHeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const desktopVideo = category.hero_video?.trim();
  const video = (isMobile ? category.hero_video_mobile || desktopVideo : desktopVideo) || "";
  const desktopImage =
    category.desktop_banner?.trim() ||
    category.hero_image?.trim() ||
    category.imageUrl ||
    category.image ||
    "";
  const mobileImage = category.mobile_banner?.trim() || desktopImage;
  const heading = category.banner_heading || category.name;
  const description = category.banner_description || category.description;
  const ctaText = category.cta_button_text || "View Collection";
  const ctaLink = category.cta_link || "#products";

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    const onMqlChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    setIsMobile(mql.matches);
    mql.addEventListener("change", onMqlChange);
    return () => mql.removeEventListener("change", onMqlChange);
  }, []);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !video) return;
    el.muted = muted;
    if (playing) void el.play().catch(() => setPlaying(false));
    else el.pause();
  }, [muted, playing, video]);

  if (!video && !desktopImage) {
    return (
      <section className="relative mb-8 overflow-hidden bg-[#1a1a2e] px-6 py-16 text-white">
        <HeroCopy heading={heading} description={description} ctaText={ctaText} ctaLink={ctaLink} />
      </section>
    );
  }

  return (
    <section className="relative mb-8 min-h-[420px] overflow-hidden bg-[#1a1a2e] sm:min-h-[360px] lg:min-h-[440px]">
      {video ? (
        <video
          key={video}
          ref={videoRef}
          src={video}
          className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 data-[ready=true]:opacity-100"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          data-ready="true"
        />
      ) : (
        <picture>
          {mobileImage && <source media="(max-width: 767px)" srcSet={mobileImage} />}
          <img
            src={desktopImage}
            alt={category.name}
            className="absolute inset-0 h-full w-full object-cover"
            decoding="async"
          />
        </picture>
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a2e]/85 via-[#1a1a2e]/45 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#1a1a2e]/50 to-transparent" />
      <div className="relative z-10 mx-auto flex min-h-[420px] max-w-[1440px] items-center px-6 py-14 sm:min-h-[360px] lg:min-h-[440px] lg:px-12">
        <HeroCopy heading={heading} description={description} ctaText={ctaText} ctaLink={ctaLink} />
      </div>
      {video && (
        <div className="absolute right-4 bottom-4 z-20 flex gap-2">
          <button
            type="button"
            onClick={() => setMuted((v) => !v)}
            aria-label={muted ? "Unmute hero video" : "Mute hero video"}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#1a1a2e] shadow-md backdrop-blur transition hover:bg-white"
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={() => setPlaying((v) => !v)}
            aria-label={playing ? "Pause hero video" : "Play hero video"}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#1a1a2e] shadow-md backdrop-blur transition hover:bg-white"
          >
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
        </div>
      )}
    </section>
  );
}

function HeroCopy({
  heading,
  description,
  ctaText,
  ctaLink,
}: {
  heading: string;
  description?: string | null;
  ctaText: string;
  ctaLink: string;
}) {
  return (
    <div className="max-w-xl animate-[cmHeroFade_700ms_ease-out] text-white">
      <h1 className="font-display text-4xl font-semibold leading-tight text-white sm:text-5xl">
        {heading}
      </h1>
      {description && (
        <p className="mt-4 max-w-lg text-base leading-7 text-white/90 sm:text-lg">{description}</p>
      )}
      {ctaText &&
        (ctaLink.startsWith("/") ? (
          <Link to={ctaLink} className="btn-primary mt-7 inline-flex">
            {ctaText}
          </Link>
        ) : (
          <a href={ctaLink} className="btn-primary mt-7 inline-flex">
            {ctaText}
          </a>
        ))}
      <style>{`@keyframes cmHeroFade{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}
