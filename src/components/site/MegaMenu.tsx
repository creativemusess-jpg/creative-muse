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
  const edgeClass =
    idx <= 1
      ? "left-0"
      : idx >= total - 2
        ? "right-0"
        : "left-1/2 -translate-x-1/2";

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className={`absolute top-full z-50 pt-3 ${edgeClass}`}
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
            <h4 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9C544D]">
              Shop {item.label}
            </h4>
            <ul className="space-y-0.5 text-sm text-[#3a3028]">
              <li>
                <Link
                  to={item.to}
                  onClick={onClose}
                  className="block rounded-[12px] px-3 py-2 font-semibold text-[#9C544D] transition hover:bg-[#fdf8f3]"
                >
                  View All {item.label}
                </Link>
              </li>
              {item.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    onClick={onClose}
                    className="block rounded-[12px] px-3 py-2 transition hover:bg-[#fdf8f3] hover:text-[#9C544D]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[20px] bg-gradient-to-br from-[#fdf8f3] to-[#f0e4cd] p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9C544D]">
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
              className="mt-3 inline-block text-xs font-semibold uppercase tracking-widest text-[#9C544D]"
            >
              {item.featured.linkText} →
            </Link>
          </div>
          <div className="rounded-[20px] border border-[#9C544D]/30 p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9C544D]">
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
              className="mt-3 inline-block text-xs font-semibold uppercase tracking-widest text-[#9C544D]"
            >
              {item.offer.linkText} →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
