import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { announcementsApi } from "@/lib/api/announcements";

const FALLBACK_MESSAGE =
  "✦ Free Shipping on orders above ₹5,000  ·  BIS Hallmarked Gold  ·  IGI Certified Diamonds  ·  30-Day Returns  ·  Book a Private Appointment  ✦";

const TRUST_BAR_DURATION = 42;

export function AnnouncementBar() {
  const [open, setOpen] = useState(true);
  const trackRef = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState(`${TRUST_BAR_DURATION}s`);

  const { data: announcements = [] } = useQuery({
    queryKey: ["announcements", "active"],
    queryFn: () => announcementsApi.getActive(),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const allTracks = document.querySelectorAll<HTMLElement>(".animate-cm-marquee");
    let trustWidth = 0;
    for (const el of allTracks) {
      if (el !== track) {
        trustWidth = el.scrollWidth;
        break;
      }
    }
    if (trustWidth <= 0) return;
    const ownWidth = track.scrollWidth;
    if (ownWidth <= 0) return;
    setDuration(`${TRUST_BAR_DURATION * (ownWidth / trustWidth)}s`);
  }, [announcements]);

  if (!open) return null;

  const messages =
    announcements.length > 0
      ? announcements.map((a) => a.text)
      : [FALLBACK_MESSAGE];

  const marqueeText =
    messages.length === 1
      ? `${messages[0]}  ·  ${messages[0]}  ·  ${messages[0]}  ·  ${messages[0]}`
      : messages.join("  ·  ");

  return (
    <div className="relative h-10 overflow-hidden bg-[#1a1a2e] text-white">
      <div className="flex h-full items-center">
        <div
          ref={trackRef}
          className="flex animate-cm-marquee shrink-0 gap-16 whitespace-nowrap pl-8 text-[11px] tracking-[0.18em] uppercase"
          style={{ animationDuration: duration }}
        >
          <span className="shrink-0">{marqueeText}</span>
          <span className="shrink-0">{marqueeText}</span>
          <span className="shrink-0">{marqueeText}</span>
          <span className="shrink-0">{marqueeText}</span>
        </div>
      </div>
      <button
        aria-label="Dismiss announcement"
        onClick={() => setOpen(false)}
        className="absolute top-1/2 right-3 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
