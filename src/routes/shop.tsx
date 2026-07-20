import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { PageHeader, PageShell } from "@/components/site/PageHeader";
import { ProductCard } from "@/components/site/ProductCard";
import { productsApi } from "@/lib/api/products";
import { categoriesApi } from "@/lib/api/categories";
import { productFromDb, type Product } from "@/lib/products";
import { PriceRangeSlider } from "@/components/site/PriceRangeSlider";

const SORT_OPTIONS = ["Featured", "Price: Low to High", "Price: High to Low"] as const;
type SortOption = (typeof SORT_OPTIONS)[number];

const sortFromUrl = (s: unknown): string =>
  SORT_OPTIONS.includes(s as SortOption) ? (s as SortOption) : "Featured";

const CAT_SLUG_MAP: Record<string, string> = {
  "All": "",
  "Earrings": "earrings",
  "Necklace": "necklace",
  "Rings": "rings",
  "Hoops": "hoops",
  "Earcuffs": "earcuffs",
  "Kada": "kada",
  "Bracelets": "bracelets",
};

const knownCategoryNames = new Set(Object.keys(CAT_SLUG_MAP));

function stripEmpty(params: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(params)) {
    if (v !== "" && v !== undefined && v !== null) out[k] = v;
  }
  return out;
}

function safeNum(v: unknown): number | undefined {
  if (typeof v !== "string" || v.trim() === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
}

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>) => ({
    category: typeof search.category === "string" ? search.category : "",
    metal: typeof search.metal === "string" ? search.metal : "",
    minPrice: typeof search.minPrice === "string" ? search.minPrice : "",
    maxPrice: typeof search.maxPrice === "string" ? search.maxPrice : "",
    sort: sortFromUrl(search.sort),
  }),
  head: () => ({
    meta: [
      { title: "Shop Fine Jewellery — Creative Muse" },
      { name: "description", content: "Browse rings, necklaces, earrings, bracelets and bridal sets — handcrafted in Vadodara." },
    ],
  }),
  component: ShopPage,
});

function ShopPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/shop" });

  const urlCat = search.category || "";
  const urlMetal = search.metal || "";
  const urlMin = search.minPrice || "";
  const urlMax = search.maxPrice || "";
  const urlSort = sortFromUrl(search.sort || "Featured");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const [retryTick, setRetryTick] = useState(0);

  const selectedCat = urlCat;
  const selectedMetals = useMemo(() => urlMetal ? urlMetal.split(",").filter(Boolean) : [], [urlMetal]);
  const sort = urlSort;

  const pushFilters = useCallback(
    (overrides: Partial<Record<string, string>>) => {
      const next: Record<string, string> = {
        category: overrides.category ?? urlCat,
        metal: overrides.metal ?? urlMetal,
        minPrice: overrides.minPrice ?? urlMin,
        maxPrice: overrides.maxPrice ?? urlMax,
        sort: overrides.sort ?? urlSort,
      };
      navigate({ to: "/shop", search: stripEmpty(next), replace: true });
    },
    [navigate, urlCat, urlMetal, urlMin, urlMax, urlSort],
  );

  // Load categories once
  useEffect(() => {
    categoriesApi
      .list(true)
      .then((list) => setDbCategories(list.filter((c: any) => knownCategoryNames.has(c.name))))
      .catch(() => {});
  }, []);

  // Fetch products when category changes (on first load + category switch)
  useEffect(() => {
    const catSlug = selectedCat ? CAT_SLUG_MAP[selectedCat] || selectedCat.toLowerCase() : undefined;

    const abort = new AbortController();
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const prods = await productsApi.getPublished({ category: catSlug, per_page: 100 });
        if (abort.signal.aborted) return;
        setAllProducts(prods.map(productFromDb));
      } catch (err: any) {
        if (abort.signal.aborted) return;
        console.error("Shop product fetch error:", err);
        setError(err?.message || "Failed to load products");
      } finally {
        if (!abort.signal.aborted) setLoading(false);
      }
    })();

    return () => abort.abort();
  }, [selectedCat, retryTick]);

  // Compute facets from the actual loaded products
  const availableMetals = useMemo(() => {
    const set = new Set<string>();
    for (const p of allProducts) {
      if (p.metal && p.metal !== "Fine Jewellery") set.add(p.metal);
    }
    return [...set].sort();
  }, [allProducts]);

  const catMinPrice = useMemo(() => {
    if (allProducts.length === 0) return 0;
    let min = Infinity;
    for (const p of allProducts) {
      if (p.price > 0 && p.price < min) min = p.price;
    }
    return min === Infinity ? 0 : min;
  }, [allProducts]);

  const catMaxPrice = useMemo(() => {
    if (allProducts.length === 0) return 50000;
    let max = -Infinity;
    for (const p of allProducts) {
      if (p.price > 0 && p.price > max) max = p.price;
    }
    return max === -Infinity ? 50000 : max;
  }, [allProducts]);

  // Client-side metal + price filtering
  const filtered = useMemo(() => {
    let result = allProducts;

    if (selectedMetals.length > 0) {
      result = result.filter((p) => selectedMetals.includes(p.metal));
    }

    const minP = safeNum(urlMin);
    if (minP !== undefined) result = result.filter((p) => p.price >= minP);

    const maxP = safeNum(urlMax);
    if (maxP !== undefined) result = result.filter((p) => p.price <= maxP);

    return result;
  }, [allProducts, selectedMetals, urlMin, urlMax]);

  // Sorting
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (sort === "Price: Low to High") return a.price - b.price;
      if (sort === "Price: High to Low") return b.price - a.price;
      return 0;
    });
  }, [filtered, sort]);

  // Metal facet counts (always based on full category scope, not filtered)
  const metalCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of allProducts) {
      counts.set(p.metal, (counts.get(p.metal) || 0) + 1);
    }
    return counts;
  }, [allProducts]);

  const hasActiveFilters = selectedMetals.length > 0 || !!urlMin || !!urlMax;

  const clearFilters = () => {
    pushFilters({ metal: "", minPrice: "", maxPrice: "" });
  };

  const toggleMetal = (m: string) => {
    const next = selectedMetals.includes(m)
      ? selectedMetals.filter((x) => x !== m)
      : [...selectedMetals, m];
    pushFilters({ metal: next.join(",") });
  };

  const onPriceChange = useCallback(
    (min: number, max: number) => {
      const minStr = min !== catMinPrice ? String(min) : "";
      const maxStr = max !== catMaxPrice ? String(max) : "";
      if (!minStr && !maxStr) {
        pushFilters({ minPrice: "", maxPrice: "" });
      } else {
        pushFilters({ minPrice: minStr, maxPrice: maxStr });
      }
    },
    [pushFilters, catMinPrice, catMaxPrice],
  );

  const priceMin = safeNum(urlMin) ?? catMinPrice;
  const priceMax = safeNum(urlMax) ?? catMaxPrice;

  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <PageShell>
      <PageHeader
        eyebrow="Collection"
        title={selectedCat || "All Jewellery"}
        subtitle="Explore handcrafted pieces, certified and made to be treasured."
      />

      <section className="mx-auto max-w-[1280px] px-6 py-16">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Mobile filter toggle */}
          <div className="flex items-center justify-between lg:hidden">
            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="flex items-center gap-2 rounded-full border border-[rgba(66,29,34,0.24)] bg-[#fffdf9] px-4 py-2 text-sm font-semibold text-[#421D22]"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#421D22] text-[10px] text-white">
                  {selectedMetals.length + (urlMin || urlMax ? 1 : 0)}
                </span>
              )}
            </button>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="text-[11px] font-semibold text-[#421D22] uppercase">
                Clear All
              </button>
            )}
          </div>

          {/* Filter sidebar */}
          <aside
            className={`rounded-[24px] border border-[#e0d8cc] bg-white p-6 shadow-[0_4px_16px_rgba(0,0,0,0.04)] h-fit ${
              mobileOpen ? "block" : "hidden lg:block"
            }`}
          >
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-[#C9A96E]" />
                <h3 className="font-display text-base font-semibold text-[#1a1a2e]">Filters</h3>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-[11px] font-semibold tracking-wide text-[#421D22] uppercase hover:text-[#7A2533]"
                >
                  <X className="h-3 w-3" />
                  Clear
                </button>
              )}
            </div>

            {/* Category */}
            <p className="eyebrow mb-3 text-[10px]">Category</p>
            <div className="flex flex-wrap gap-2">
              {["All", ...dbCategories.map((c: any) => c.name)].map((name) => (
                <FilterPill
                  key={name}
                  active={(!selectedCat && name === "All") || selectedCat === name}
                  onClick={() => {
                    setMobileOpen(false);
                    pushFilters({
                      category: name === "All" ? "" : name,
                      metal: "",
                      minPrice: "",
                      maxPrice: "",
                    });
                  }}
                >
                  {name}
                </FilterPill>
              ))}
            </div>

            {/* Metal */}
            <p className="eyebrow mt-6 mb-3 flex items-center justify-between text-[10px]">
              <span>Metal</span>
              {selectedMetals.length > 0 && (
                <button
                  onClick={() => pushFilters({ metal: "" })}
                  className="text-[9px] font-semibold text-[#7a6e64] hover:text-[#421D22]"
                >
                  Clear
                </button>
              )}
            </p>
            <div className="flex flex-wrap gap-2">
              {availableMetals.map((m) => {
                const active = selectedMetals.includes(m);
                const count = metalCounts.get(m) || 0;
                return (
                  <button
                    key={m}
                    onClick={() => toggleMetal(m)}
                    className={`rounded-full border px-3 py-1.5 text-[12px] font-medium transition-all ${
                      active
                        ? "border-[#421D22] bg-[#421D22] text-white"
                        : "border-[#e0d8cc] bg-white text-[#3a3028] hover:border-[#421D22] hover:text-[#421D22]"
                    }`}
                  >
                    {m}{count > 0 ? ` (${count})` : ""}
                  </button>
                );
              })}
              {availableMetals.length === 0 && !loading && (
                <p className="text-[11px] text-[#7a6e64]">No metals available</p>
              )}
            </div>

            {/* Price */}
            <div className="mt-6">
              <p className="eyebrow mb-3 flex items-center justify-between text-[10px]">
                <span>Price Range</span>
                {(urlMin || urlMax) && (
                  <button
                    onClick={() => pushFilters({ minPrice: "", maxPrice: "" })}
                    className="text-[9px] font-semibold text-[#7a6e64] hover:text-[#421D22]"
                  >
                    Reset
                  </button>
                )}
              </p>
              <PriceRangeSlider
                min={catMinPrice}
                max={catMaxPrice}
                valueMin={priceMin}
                valueMax={priceMax}
                onChange={onPriceChange}
              />
            </div>
          </aside>

          {/* Product grid */}
          <div>
            <div className="mb-6 flex items-center justify-between gap-4">
              <p className="text-sm text-[#7a6e64]">
                {loading ? "Loading jewellery..." : error ? "" : (
                  <>Showing <span className="font-semibold text-[#1a1a2e]">{sorted.length}</span> {sorted.length === 1 ? "piece" : "pieces"}</>
                )}
              </p>
              {!error && (
                <select
                  value={sort}
                  onChange={(e) => pushFilters({ sort: e.target.value })}
                  className="w-full appearance-none rounded-full border border-[rgba(66,29,34,0.24)] bg-[#fffdf9] bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%228%22%20viewBox%3D%220%200%2012%208%22%3E%3Cpath%20d%3D%22M1%201.5l5%205%205-5%22%20stroke%3D%22%23421D22%22%20stroke-width%3D%221.5%22%20fill%3D%22none%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px_8px] bg-[right_16px_center] bg-no-repeat px-5 py-2.5 pr-12 text-sm text-[#421D22] focus:outline-none focus:ring-2 focus:ring-[#421D22]/30 sm:w-auto"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              )}
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#c9a96e] border-t-transparent" />
              </div>
            ) : error ? (
              <div className="rounded-[24px] border border-[#e0d8cc] bg-white px-5 py-16 text-center shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
                <h2 className="font-display text-2xl font-semibold text-[#1a1a2e]">Unable to load products</h2>
                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#7a6e64]">
                  {error}. Please try again.
                </p>
                <button
                  onClick={() => { setError(null); setRetryTick((t) => t + 1); }}
                  className="btn-primary mt-8"
                >
                  Retry
                </button>
              </div>
            ) : sorted.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:gap-7 sm:grid-cols-2 lg:grid-cols-3">
                {sorted.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            ) : (
              <div className="rounded-[24px] border border-[#e0d8cc] bg-white px-5 py-16 text-center shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
                <h2 className="font-display text-2xl font-semibold text-[#1a1a2e]">No products found</h2>
                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#7a6e64]">
                  Try changing the metal or price range.
                </p>
                <button onClick={clearFilters} className="btn-primary mt-8">
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function FilterPill({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-[12px] font-medium transition-all ${
        active
          ? "border-[#421D22] bg-[#421D22] text-white"
          : "border-[#e0d8cc] bg-white text-[#3a3028] hover:border-[#421D22] hover:text-[#421D22]"
      }`}
    >
      {children}
    </button>
  );
}
