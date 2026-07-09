import { useState } from "react";
import { X } from "lucide-react";

const MESSAGE =
  "✦ Free Shipping on orders above ₹5,000  ·  BIS Hallmarked Gold  ·  IGI Certified Diamonds  ·  30-Day Returns  ·  Book a Private Appointment  ✦";

export function AnnouncementBar() {
  const [open, setOpen] = useState(true);
  if (!open) return null;
  return (
    <div className="relative h-10 overflow-hidden bg-[#1a1a2e] text-[#E8C98A]">
      <div className="flex h-full items-center">
        <div className="flex animate-cm-marquee shrink-0 gap-16 whitespace-nowrap pl-8 text-[11px] tracking-[0.18em] uppercase">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="shrink-0">{MESSAGE}</span>
          ))}
        </div>
      </div>
      <button
        aria-label="Dismiss announcement"
        onClick={() => setOpen(false)}
        className="absolute top-1/2 right-3 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-[#E8C98A] transition-colors hover:bg-white/10"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
