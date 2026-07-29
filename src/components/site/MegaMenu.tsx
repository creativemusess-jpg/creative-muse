import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import type { NavItem } from "@/lib/navigation";

interface MegaMenuProps {
  item: NavItem;
  idx: number;
  total: number;
  onClose: () => void;
}

export function MegaMenu({ item, idx, total, onClose }: MegaMenuProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const leftPercent = Math.min(Math.max((idx / Math.max(total - 1, 1)) * 100, 4), 60);

  return (
    <div
      ref={ref}
      className="absolute top-full z-50 pt-3"
      style={{ left: `${leftPercent}%`, transform: "translateX(-16%)" }}
      onMouseEnter={() => {}}
      onMouseLeave={(e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (rect) {
          const x = e.clientX;
          const y = e.clientY;
          if (
            x < rect.left - 10 ||
            x > rect.right + 10 ||
            y < rect.top - 10 ||
            y > rect.bottom + 10
          ) {
            onClose();
          }
        }
      }}
    >
      <div
        className="min-w-[580px] rounded-[28px] border border-[#e7ddcc] bg-white p-7 shadow-[0_24px_60px_rgba(26,26,46,0.14)]"
        style={{ animation: "cmMegaIn 220ms ease-out" }}
      >
        <style>{`@keyframes cmMegaIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}`}</style>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <h4 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7A2533]">
              Shop {item.label}
            </h4>
            <ul className="space-y-0.5 text-sm text-[#3a3028]">
              {item.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    onClick={onClose}
                    className="block rounded-[12px] px-3 py-2 transition hover:bg-[#fdf8f3] hover:text-[#7A2533]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[20px] bg-gradient-to-br from-[#fdf8f3] to-[#f0e4cd] p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7A2533]">
              Featured
            </p>
            <p className="mt-2 font-display text-lg leading-tight text-[#1a1a2e]">
              {item.featured.title}
              <br />
              {item.featured.subtitle}
            </p>
            <p className="mt-1 text-xs text-[#7a6e64]">{item.featured.description}</p>
            <Link
              to={item.featured.linkTo}
              onClick={onClose}
              className="mt-3 inline-block text-xs font-semibold uppercase tracking-widest text-[#7A2533]"
            >
              {item.featured.linkText} →
            </Link>
          </div>
          <div className="rounded-[20px] border border-[#7A2533]/30 p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7A2533]">
              Offer
            </p>
            <p className="mt-2 font-display text-base leading-tight text-[#1a1a2e]">
              {item.offer.title}
              <br />
              {item.offer.subtitle}
            </p>
            <p className="mt-1 text-xs text-[#7a6e64]">{item.offer.description}</p>
            <Link
              to={item.offer.linkTo}
              onClick={onClose}
              className="mt-3 inline-block text-xs font-semibold uppercase tracking-widest text-[#7A2533]"
            >
              {item.offer.linkText} →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
