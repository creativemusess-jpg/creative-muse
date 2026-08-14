import { memo, useState, useRef, useCallback, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
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
import { useStore } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import { NAV_ITEMS, type NavItem } from "@/lib/navigation";
import { categoriesApi } from "@/lib/api/categories";
import { subcategoriesApi } from "@/lib/api/subcategories";
import { MegaMenu } from "./MegaMenu";

export const Header = memo(function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenuIdx, setActiveMenuIdx] = useState<number | null>(null);
  const closeTimer = useRef<number | null>(null);
  const { cartCount, wishlistCount, openCart, openWishlist } = useStore();
  const { user } = useAuth();
  const { data: categories = [] } = useQuery({
    queryKey: ["categories", "nav"],
    queryFn: () => categoriesApi.list(true),
    staleTime: 5 * 60 * 1000,
  });
  const { data: subcategories = [] } = useQuery({
    queryKey: ["subcategories", "nav"],
    queryFn: () => subcategoriesApi.list(true),
    staleTime: 5 * 60 * 1000,
  });
  const dynamicItems: NavItem[] = categories.map((cat: any) => {
    const links = subcategories
      .filter((sub: any) => sub.category_id === cat.id)
      .map((sub: any) => ({
        label: sub.name,
        to: `/collections/${cat.slug}/${sub.slug}`,
      }));
    return {
      label: cat.name,
      to: `/collections/${cat.slug}`,
      links,
      featured: {
        title: cat.banner_heading || cat.name,
        subtitle: "Collection",
        description: cat.banner_description || cat.description || "Explore the latest Creative Muse edit.",
        linkTo: `/collections/${cat.slug}`,
        linkText: cat.cta_button_text || "Shop now",
      },
      offer: {
        title: "Private Styling",
        subtitle: "Available",
        description: "Book a personal jewellery consultation.",
        linkTo: "/contact",
        linkText: "Enquire",
      },
    };
  });
  const navItems = dynamicItems.length > 0 ? dynamicItems : NAV_ITEMS;

  const openMenu = (idx: number) => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setActiveMenuIdx(idx);
  };

  const scheduleClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setActiveMenuIdx(null), 180);
  };

  return (
    <>
      <header className="sticky top-0 z-50" style={{ background: "#fdf8f3" }}>
        <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center py-2.5 lg:py-3">
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setMobileOpen(true)}
                className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-[#f5efe8]"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5 text-[#2a1e14]" />
              </button>
            </div>
            <div className="hidden lg:block" />

            <Link to="/" className="flex items-center justify-center" aria-label="Creative Muse — Home">
              <img
                src="/favicon.ico"
                alt="Creative Muse"
                className="h-[52px] w-[52px] object-contain md:h-[68px] md:w-[68px] lg:h-[80px] lg:w-[80px]"
              />
            </Link>

            <div className="flex items-center justify-end gap-1 md:gap-2 lg:gap-4">
              <button
                onClick={openCart}
                className="relative flex h-11 w-11 items-center justify-center rounded-full hover:bg-[#f5efe8]"
                aria-label="Cart"
              >
                <ShoppingBag className="h-[20px] w-[20px] text-[#2a1e14]" strokeWidth={1.9} />
                {cartCount > 0 && (
                  <span className="absolute right-1 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#7A2533] px-1 text-[10px] font-semibold text-white">
                    {cartCount}
                  </span>
                )}
              </button>
              <button
                onClick={openWishlist}
                className="relative hidden h-11 w-11 items-center justify-center rounded-full hover:bg-[#f5efe8] md:flex"
                aria-label="Wishlist"
              >
                <Heart className="h-[20px] w-[20px] text-[#2a1e14]" strokeWidth={1.9} />
                {wishlistCount > 0 && (
                  <span className="absolute right-1 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#7A2533] px-1 text-[10px] font-semibold text-white">
                    {wishlistCount}
                  </span>
                )}
              </button>
              <Link
                to={user ? "/account" : "/login"}
                className="hidden h-11 w-11 items-center justify-center rounded-full hover:bg-[#f5efe8] md:flex"
                aria-label={user ? "Account" : "Login"}
              >
                <User className="h-[20px] w-[20px] text-[#2a1e14]" strokeWidth={1.9} />
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-[#e0d8cc]/40">
          <nav
            className="scrollbar-hide relative mx-auto hidden max-w-[1440px] items-center justify-center gap-0.5 overflow-visible px-2 py-2 lg:flex lg:px-4"
            aria-label="Primary"
            onMouseLeave={scheduleClose}
            onMouseEnter={() => closeTimer.current && window.clearTimeout(closeTimer.current)}
          >
            {navItems.map((item, idx) => (
              <div key={item.label} className="relative">
                <Link
                  to={item.to}
                  onMouseEnter={() => openMenu(idx)}
                  onFocus={() => openMenu(idx)}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      openMenu(idx);
                    }
                    if (e.key === "Escape") setActiveMenuIdx(null);
                  }}
                  aria-haspopup="menu"
                  aria-expanded={activeMenuIdx === idx}
                  className="shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-[12.5px] font-semibold tracking-[0.01em] text-[#7A2533] transition-colors duration-200 hover:bg-[#fdf8f3] hover:text-[#7A2533] xl:px-4 xl:text-[13px]"
                >
                  {item.label}
                </Link>
                {activeMenuIdx === idx && (
                  <MegaMenu
                    item={item}
                    idx={idx}
                    total={navItems.length}
                    onClose={() => setActiveMenuIdx(null)}
                  />
                )}
              </div>
            ))}
          </nav>
          <nav className="scrollbar-hide mx-auto flex w-full max-w-[1440px] items-center justify-start gap-1 overflow-x-auto px-4 py-2 lg:hidden" aria-label="Primary mobile shortcuts">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-[12.5px] font-semibold tracking-[0.01em] text-[#7A2533] transition-colors duration-200 hover:bg-[#fdf8f3] hover:text-[#7A2533]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {mobileOpen && <MobileDrawer items={navItems} onClose={() => setMobileOpen(false)} />}
    </>
  );
});

function MobileDrawer({ items, onClose }: { items: NavItem[]; onClose: () => void }) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const { user } = useAuth();

  return (
    <div className="fixed inset-0 z-[60] lg:hidden">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div
        className="absolute left-0 top-0 flex h-full w-[85vw] max-w-[360px] flex-col rounded-r-[28px] bg-white p-6 shadow-[0_24px_64px_rgba(0,0,0,0.2)]"
        style={{ animation: "cmDrawerIn 300ms ease" }}
      >
        <style>{`@keyframes cmDrawerIn{from{transform:translateX(-100%)}to{transform:translateX(0)}}`}</style>

        <div className="mb-6 flex items-center justify-between">
          <img
            src="/favicon.ico"
            alt="Creative Muse"
            className="h-[48px] w-[48px] object-contain"
          />
          <button
            onClick={onClose}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f5efe8]"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto">
          {items.map((item, idx) => {
            const isExpanded = expandedIdx === idx;
            const hasSubs = item.links.length > 0;
            return (
              <div key={item.label}>
                {hasSubs ? (
                  <>
                    <button
                      onClick={() => setExpandedIdx(isExpanded ? null : idx)}
                      className="flex min-h-[48px] w-full items-center justify-between rounded-[16px] px-5 py-3 text-sm font-medium text-[#7A2533] transition-colors hover:bg-[#f5efe8] hover:text-[#7A2533]"
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
                          <div className="ml-3 border-l-2 border-[#8B1A1A]/30 pl-3">
                            <Link
                              to={item.to}
                              onClick={onClose}
                              className="flex min-h-[40px] items-center rounded-[12px] px-4 py-2 text-sm font-semibold text-[#7A2533] transition-colors hover:bg-[#f5efe8] hover:text-[#7A2533]"
                          >
                            View All {item.label}
                          </Link>
                          {item.links.map((link) => (
                            <Link
                              key={link.label}
                              to={link.to}
                              onClick={onClose}
                              className="flex min-h-[40px] items-center rounded-[12px] px-4 py-2 text-sm text-[#7A2533] transition-colors hover:bg-[#f5efe8] hover:text-[#7A2533]"
                            >
                              {link.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.to}
                    onClick={onClose}
                    className="flex min-h-[48px] w-full items-center rounded-[16px] px-5 py-3 text-sm font-medium text-[#7A2533] transition-colors hover:bg-[#f5efe8] hover:text-[#7A2533]"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            );
          })}

          <div className="my-4 border-t border-[#e0d8cc]/60" />

          {[
            { label: "Wishlist", to: "/wishlist" as const },
            { label: "Shop All", to: "/shop" as const },
            { label: "Collections", to: "/collections" as const },
            { label: user ? "Account" : "Login", to: user ? ("/account" as const) : ("/login" as const) },
          ].map(({ label, to }) => (
            <Link
              key={label}
              to={to}
              onClick={onClose}
              className="flex min-h-[48px] w-full items-center rounded-[16px] px-5 py-3 text-sm text-[#7A2533] transition-colors hover:bg-[#f5efe8] hover:text-[#7A2533]"
            >
              {label}
            </Link>
          ))}

          <div className="my-4 border-t border-[#e0d8cc]/60" />

          <a
            href="tel:+919033779867"
            className="flex min-h-[48px] items-center gap-3 rounded-[16px] px-5 py-3 text-sm text-[#3a3028]"
          >
            <Phone className="h-5 w-5 text-[#8B1A1A]" strokeWidth={1.6} />
            +91 90337 79867
          </a>
          <a
            href="https://wa.me/919033779867"
            target="_blank"
            rel="noreferrer"
            className="mt-3 flex items-center justify-center gap-2 rounded-full bg-[#7A2533] px-5 py-3 text-sm font-semibold text-white hover:bg-[#5F1C27]"
          >
            <MessageCircle className="h-4 w-4" />
            Chat on WhatsApp
          </a>
        </nav>
      </div>
    </div>
  );
}
