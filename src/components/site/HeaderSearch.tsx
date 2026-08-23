import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { formatPrice, type Product, useSearchStorefrontProducts } from "@/lib/products";

const MIN_SEARCH_LENGTH = 2;
const SUGGESTION_LIMIT = 8;

export function HeaderSearch() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const trimmedQuery = query.trim();
  const canSearch = trimmedQuery.length >= MIN_SEARCH_LENGTH;
  const { products: searchMatches, isFetching } = useSearchStorefrontProducts(debouncedQuery);
  const isSearching = canSearch && (trimmedQuery !== debouncedQuery || isFetching);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(trimmedQuery);
      setActiveIndex(-1);
    }, 250);

    return () => window.clearTimeout(timer);
  }, [trimmedQuery]);

  const matches = debouncedQuery.length < MIN_SEARCH_LENGTH ? [] : searchMatches.slice(0, SUGGESTION_LIMIT);

  useEffect(() => {
    setOpen(canSearch);
  }, [canSearch]);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, []);

  const goToSearch = (term = trimmedQuery) => {
    const q = term.trim();
    if (!q) return;
    setOpen(false);
    setActiveIndex(-1);
    navigate({ to: "/search", search: { q } });
  };

  const goToProduct = (product: Product) => {
    setOpen(false);
    setActiveIndex(-1);
    navigate({ to: "/product/$productId", params: { productId: product.id } });
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
      return;
    }

    if (!open && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
      setOpen(canSearch);
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      const optionCount = matches.length + 1;
      setActiveIndex((current) => (current + 1) % optionCount);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      const optionCount = matches.length + 1;
      setActiveIndex((current) => (current <= 0 ? optionCount - 1 : current - 1));
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      if (open && activeIndex >= 0 && activeIndex < matches.length) {
        goToProduct(matches[activeIndex]);
      } else {
        goToSearch();
      }
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          goToSearch();
        }}
      >
        <Search
          className="absolute left-5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#9C544D]"
          strokeWidth={1.8}
        />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => setOpen(canSearch)}
          onKeyDown={onKeyDown}
          placeholder="Search rings, necklaces, earrings..."
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls="header-search-results"
          className="h-10 w-full rounded-full border-[1.5px] border-transparent bg-[#f5efe8] pl-13 pr-12 text-[14px] text-[#2a1e14] placeholder:text-[#6b5d52] transition-all duration-200 focus:border-[#9C544D] focus:outline-none focus:[box-shadow:0_0_0_4px_rgba(156,84,77,0.12)]"
          style={{ paddingLeft: 48 }}
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setDebouncedQuery("");
              setOpen(false);
              setActiveIndex(-1);
            }}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-[#3a3028] hover:text-[#1a1a2e]"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </form>

      {open && (
        <div
          id="header-search-results"
          className="absolute left-0 right-0 top-[calc(100%+10px)] z-[70] max-h-[min(72vh,540px)] overflow-y-auto rounded-[22px] border border-[#e0d8cc] bg-white p-2 shadow-[0_24px_70px_rgba(26,26,46,0.18)]"
          role="listbox"
        >
          {isSearching && (
            <div className="px-4 py-5 text-sm text-[#7a6e64]">Searching jewellery...</div>
          )}

          {!isSearching && matches.length > 0 && (
            <>
              {matches.map((product, index) => (
                <button
                  key={product.id}
                  type="button"
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => goToProduct(product)}
                  className={`flex w-full items-center gap-3 rounded-[16px] p-2.5 text-left transition-colors ${
                    activeIndex === index ? "bg-[#fdf8f3]" : "hover:bg-[#fdf8f3]"
                  }`}
                  role="option"
                  aria-selected={activeIndex === index}
                >
                  <span className={`relative flex h-16 w-16 shrink-0 overflow-hidden rounded-[14px] bg-gradient-to-br ${product.bg}`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-contain p-1.5"
                    />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-display text-[14px] font-semibold text-[#1a1a2e]">
                      {product.name}
                    </span>
                    <span className="mt-0.5 block truncate text-[12px] text-[#7a6e64]">
                      {product.category} · {product.metal || product.stone}
                    </span>
                    <span className="mt-1 block text-[13px] font-bold text-[#1a1a2e]">
                      {formatPrice(product.price)}
                    </span>
                  </span>
                  {product.badge && (
                    <span className="hidden shrink-0 rounded-full bg-[#9C544D] px-2 py-[2px] text-[9px] font-semibold uppercase tracking-[0.1em] text-white sm:inline-flex">
                      {product.badge}
                    </span>
                  )}
                </button>
              ))}

              <button
                type="button"
                onMouseEnter={() => setActiveIndex(matches.length)}
                onClick={() => goToSearch()}
                className={`mt-1 flex w-full items-center justify-center rounded-full px-4 py-3 text-[12px] font-semibold uppercase tracking-[0.14em] transition-colors ${
                  activeIndex === matches.length
                    ? "bg-[#9C544D] text-white"
                    : "bg-[#f5efe8] text-[#1a1a2e] hover:bg-[#9C544D] hover:text-white"
                }`}
              >
                View all results for "{trimmedQuery}"
              </button>
            </>
          )}

          {!isSearching && debouncedQuery.length >= MIN_SEARCH_LENGTH && matches.length === 0 && (
            <div className="p-4">
              <p className="font-display text-[15px] font-semibold text-[#1a1a2e]">
                No jewellery found for "{debouncedQuery}"
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <SuggestionLink label="Browse Rings" q="Rings" />
                <SuggestionLink label="Browse Earrings" q="Earrings" />
                <Link
                  to="/shop"
                  onClick={() => setOpen(false)}
                  className="rounded-full border border-[#e0d8cc] px-3 py-2 text-[12px] font-semibold text-[#3a3028] hover:border-[#9C544D] hover:text-[#9C544D]"
                >
                  View All Jewellery
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SuggestionLink({ label, q }: { label: string; q: string }) {
  return (
    <Link
      to="/search"
      search={{ q }}
      className="rounded-full border border-[#e0d8cc] px-3 py-2 text-[12px] font-semibold text-[#3a3028] hover:border-[#9C544D] hover:text-[#9C544D]"
    >
      {label}
    </Link>
  );
}
