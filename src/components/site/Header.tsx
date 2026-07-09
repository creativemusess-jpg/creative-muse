import { useState, useRef, useCallback, useEffect, type ComponentType } from "react";
import { Link } from "@tanstack/react-router";
import {
  Clock,
  MapPin,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  Phone,
  MessageCircle,
} from "lucide-react";
import logo from "@/assets/cm-logo-v2.png.asset.json";
import { useStore } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import { NAV_ITEMS } from "@/lib/navigation";
import { MegaMenu } from "./MegaMenu";
import { BrandLogo } from "./BrandLogo";
import { HeaderSearch } from "./HeaderSearch";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const { cartCount, wishlistCount, openCart, openWishlist } = useStore();
  const { user } = useAuth();
  const CART_COUNT = cartCount;
  const WISHLIST_COUNT = wishlistCount;

  const navRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const closeMenu = useCallback(() => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    setOpenIdx(null);
  }, []);

  const openMenu = useCallback((idx: number) => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    setOpenIdx(idx);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        closeMenu();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeMenu]);

  return (
    <>
      <header className="sticky top-0 z-50" style={{ background: "#fdf8f3" }}>
        <div>
          <div className="mx-auto flex max-w-[1440px] items-center px-5 py-2.5 lg:px-10 lg:py-3">
            <Link to="/" className="flex shrink-0 items-center" aria-label="Creative Muse — Home">
              <BrandLogo
                src={logo.url}
                className="h-[38px] w-auto object-contain md:h-[46px] lg:h-[54px]"
              />
            </Link>

            <div className="mx-6 hidden flex-1 md:block lg:mx-10">
              <div className="mx-auto max-w-[520px]">
                <HeaderSearch />
              </div>
            </div>

            <div className="ml-auto hidden items-center gap-5 lg:flex">
              <IconButton icon={Clock} label="Recently" to="/shop" />
              <IconButton icon={MapPin} label="Stores" to="/contact" />
              <IconButton
                icon={Heart}
                label="Wishlist"
                onClick={openWishlist}
                badge={WISHLIST_COUNT}
                badgeTone="gold"
              />
              <IconButton
                icon={ShoppingBag}
                label="Cart"
                onClick={openCart}
                badge={CART_COUNT}
                badgeTone="navy"
              />
              <IconButton icon={User} label={user ? "Account" : "Login"} to={user ? "/account" : "/login"} />
            </div>

            <div className="ml-auto hidden items-center gap-5 md:flex lg:hidden">
              <IconButton
                icon={Heart}
                label="Wishlist"
                onClick={openWishlist}
                badge={WISHLIST_COUNT}
                badgeTone="gold"
              />
              <IconButton
                icon={ShoppingBag}
                label="Cart"
                onClick={openCart}
                badge={CART_COUNT}
                badgeTone="navy"
              />
              <IconButton icon={User} label={user ? "Account" : "Login"} to={user ? "/account" : "/login"} />
            </div>

            <div className="ml-auto flex items-center gap-1 md:hidden">
              <button
                onClick={openCart}
                className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-[#f5efe8]"
                aria-label="Cart"
              >
                <ShoppingBag className="h-[20px] w-[20px] text-[#2a1e14]" strokeWidth={1.9} />
                {CART_COUNT > 0 && (
                  <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#1a1a2e] px-1 text-[10px] font-semibold text-white">
                    {CART_COUNT}
                  </span>
                )}
              </button>
              <button
                onClick={() => setMobileOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5efe8]"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5 text-[#2a1e14]" />
              </button>
            </div>
          </div>

          <div className="px-4 pb-2.5 md:hidden">
            <HeaderSearch />
          </div>
        </div>

        <div className="hidden px-4 pb-3 lg:block" ref={navRef}>
          <div
            className="relative mx-auto"
            style={{ width: "96%", maxWidth: 1400 }}
            onMouseLeave={() => {
              closeTimeoutRef.current = setTimeout(() => closeMenu(), 120);
            }}
          >
            <nav
              className="flex items-center justify-center gap-1 rounded-full bg-white/95 px-5 py-2 backdrop-blur-xl"
              style={{
                boxShadow: "0 4px 20px rgba(26,26,46,0.06), 0 1px 3px rgba(201,169,110,0.08)",
                border: "1px solid rgba(201,169,110,0.18)",
              }}
              aria-label="Primary"
            >
              {NAV_ITEMS.map((item, idx) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => {
                    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
                    openMenu(idx);
                  }}
                >
                  <button
                    onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                    className="flex cursor-pointer items-center whitespace-nowrap rounded-full px-3 py-1.5 text-[12.5px] font-semibold tracking-[0.01em] text-[#2a1e14] transition-colors duration-200 hover:bg-[#fdf8f3] hover:text-[#8a6a2a] xl:px-3.5 xl:text-[13px]"
                  >
                    {item.label}
                    <ChevronDown
                      className="ml-1 h-3 w-3 text-[#8a6a2a] opacity-90 transition-transform duration-200"
                      style={{
                        transform: openIdx === idx ? "rotate(180deg)" : "rotate(0)",
                      }}
                    />
                  </button>
                </div>
              ))}
            </nav>

            {openIdx !== null && (
              <MegaMenu
                item={NAV_ITEMS[openIdx]}
                idx={openIdx}
                total={NAV_ITEMS.length}
                onClose={closeMenu}
              />
            )}
          </div>
        </div>

        <div className="hidden px-4 pb-3 md:block lg:hidden">
          <nav
            className="scrollbar-hide mx-auto flex items-center gap-1 overflow-x-auto rounded-full bg-white/95 px-3 py-1.5 backdrop-blur-xl"
            style={{
              boxShadow: "0 4px 20px rgba(26,26,46,0.06)",
              border: "1px solid rgba(201,169,110,0.18)",
            }}
          >
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-[12.5px] font-semibold text-[#2a1e14] hover:bg-[#fdf8f3] hover:text-[#8a6a2a]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {mobileOpen && <MobileDrawer onClose={() => setMobileOpen(false)} />}
    </>
  );
}

function IconButton({
  icon: Icon,
  label,
  to,
  onClick,
  badge,
  badgeTone,
}: {
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  to?: string;
  onClick?: () => void;
  badge?: number;
  badgeTone?: "gold" | "navy";
}) {
  const inner = (
    <>
      <div className="relative flex h-8 w-8 items-center justify-center transition-transform duration-200 group-hover:scale-110">
        <Icon className="h-[20px] w-[20px]" strokeWidth={1.9} />
        {typeof badge === "number" && badge > 0 && (
          <span
            className={`absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold text-white ${
              badgeTone === "navy" ? "bg-[#1a1a2e]" : "bg-[#C9A96E]"
            }`}
          >
            {badge}
          </span>
        )}
      </div>
      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#2a1e14] group-hover:text-[#8a6a2a]">
        {label}
      </span>
    </>
  );
  const cls =
    "group flex min-w-[48px] flex-col items-center gap-0.5 text-[#2a1e14] transition-colors duration-200 hover:text-[#8a6a2a]";
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={cls} aria-label={label}>
        {inner}
      </button>
    );
  }
  return (
    <Link to={to ?? "/"} className={cls}>
      {inner}
    </Link>
  );
}

function MobileDrawer({ onClose }: { onClose: () => void }) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const { user } = useAuth();

  return (
    <div className="fixed inset-0 z-[60] lg:hidden">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div
        className="absolute right-0 top-0 flex h-full w-[85vw] max-w-[360px] flex-col rounded-l-[28px] bg-white p-6 shadow-[0_24px_64px_rgba(0,0,0,0.2)]"
        style={{ animation: "cmDrawerIn 300ms ease" }}
      >
        <style>{`@keyframes cmDrawerIn{from{transform:translateX(100%)}to{transform:translateX(0)}}`}</style>

        <div className="mb-6 flex items-center justify-between">
          <BrandLogo src={logo.url} className="h-12 w-auto" />
          <button
            onClick={onClose}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f5efe8]"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-5">
          <HeaderSearch />
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item, idx) => {
            const isExpanded = expandedIdx === idx;
            return (
              <div key={item.label}>
                <button
                  onClick={() => setExpandedIdx(isExpanded ? null : idx)}
                  className="flex min-h-[48px] w-full items-center justify-between rounded-[16px] px-5 py-3 text-sm font-medium text-[#3a3028] transition-colors hover:bg-[#f5efe8] hover:text-[#C9A96E]"
                >
                  {item.label}
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 opacity-50" />
                  ) : (
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  )}
                </button>
                {isExpanded && (
                  <div
                    className="overflow-hidden pl-4"
                    style={{ animation: "cmAccordionIn 200ms ease-out" }}
                  >
                    <style>{`@keyframes cmAccordionIn{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}`}</style>
                    <div className="ml-3 border-l-2 border-[#C9A96E]/30 pl-3">
                      {item.links.map((link) => (
                        <Link
                          key={link.label}
                          to={link.to}
                          onClick={onClose}
                          className="flex min-h-[40px] items-center rounded-[12px] px-4 py-2 text-sm text-[#6b5d52] transition-colors hover:bg-[#f5efe8] hover:text-[#C9A96E]"
                        >
                          {link.label}
                        </Link>
                      ))}
                      <div className="my-2 grid grid-cols-2 gap-2 px-2">
                        <Link
                          to={item.featured.linkTo}
                          onClick={onClose}
                          className="rounded-[12px] bg-gradient-to-br from-[#fdf8f3] to-[#f0e4cd] p-3"
                        >
                          <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#C9A96E]">
                            Featured
                          </p>
                          <p className="mt-1 font-display text-xs font-semibold leading-tight text-[#1a1a2e]">
                            {item.featured.title}
                          </p>
                          <p className="mt-1 text-[10px] text-[#C9A96E]">
                            {item.featured.linkText} →
                          </p>
                        </Link>
                        <Link
                          to={item.offer.linkTo}
                          onClick={onClose}
                          className="rounded-[12px] border border-[#C9A96E]/30 p-3"
                        >
                          <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#C9A96E]">
                            Offer
                          </p>
                          <p className="mt-1 font-display text-xs font-semibold leading-tight text-[#1a1a2e]">
                            {item.offer.title}
                          </p>
                          <p className="mt-1 text-[10px] text-[#C9A96E]">{item.offer.linkText} →</p>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          <div className="my-4 border-t border-[#e0d8cc]/60" />

          {[
            { icon: Clock, label: "Recently Viewed", to: "/shop" as const },
            { icon: MapPin, label: "Find a Store", to: "/contact" as const },
            { icon: Heart, label: "Wishlist", to: "/wishlist" as const },
            { icon: User, label: user ? "Account" : "Login", to: user ? "/account" : "/login" },
          ].map(({ icon: Icon, label, to }) => (
            <Link
              key={label}
              to={to}
              onClick={onClose}
              className="flex min-h-[48px] items-center gap-3 rounded-[16px] px-5 py-3 text-sm text-[#3a3028] hover:bg-[#f5efe8]"
            >
              <Icon className="h-5 w-5 text-[#C9A96E]" strokeWidth={1.6} />
              {label}
            </Link>
          ))}

          <div className="my-4 border-t border-[#e0d8cc]/60" />

          <a
            href="tel:+919033779867"
            className="flex min-h-[48px] items-center gap-3 rounded-[16px] px-5 py-3 text-sm text-[#3a3028]"
          >
            <Phone className="h-5 w-5 text-[#C9A96E]" strokeWidth={1.6} />
            +91 90337 79867
          </a>
          <a
            href="https://wa.me/919033779867"
            target="_blank"
            rel="noreferrer"
            className="mt-3 flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#C9A96E] to-[#B8860B] px-5 py-3 text-sm font-semibold text-white"
          >
            <MessageCircle className="h-4 w-4" />
            Chat on WhatsApp
          </a>
        </nav>
      </div>
    </div>
  );
}
