import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, type ReactNode } from "react";
import { SlidersHorizontal } from "lucide-react";
import { PageHeader, PageShell } from "@/components/site/PageHeader";
import { ProductCard } from "@/components/site/ProductCard";
import { useSearchStorefrontProducts, useStorefrontProducts } from "@/lib/products";
import { useCategories } from "@/lib/api/hooks";

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search.q === "string" ? search.q : "",
  }),
  head: () => ({
    meta: [
      { title: "Search Jewellery - Creative Muse" },
      {
        name: "description",
        content:
          "Search rings, earrings, necklaces, pendants, mangalsutra and bridal jewellery at Creative Muse.",
      },
    ],
  }),
  component: SearchPage,
});

const PRICE_FILTERS = ["All", "Under Rs.20K", "Rs.20K-50K", "Rs.50K-1L", "Above Rs.1L"];

function SearchPage() {
  const { q } = Route.useSearch();
  const query = q.trim();
  const [category, setCategory] = useState("All");
  const [metal, setMetal] = useState("All");
  const [price, setPrice] = useState("All");
  const [sort, setSort] = useState("Relevance");

  const { data: dbCategories = [] } = useCategories();
  const liveProducts = useStorefrontProducts();
  const liveSearch = useSearchStorefrontProducts(query);
  const baseResults = query ? liveSearch.products : liveProducts.products;
  const loading = query ? liveSearch.isFetching : liveProducts.isFetching;

  const metals = useMemo(
    () => [
      "All",
      ...Array.from(new Set(liveProducts.products.map((product) => product.metal))).sort(),
    ],
    [liveProducts.products],
  );

  const filtered = useMemo(() => {
    return baseResults
      .filter((product) => category === "All" || product.category === category)
      .filter(
        (product) => metal === "All" || product.metal === metal || product.metalColor === metal,
      )
      .filter((product) => {
        if (price === "Under Rs.20K") return product.price < 20000;
        if (price === "Rs.20K-50K") return product.price >= 20000 && product.price <= 50000;
        if (price === "Rs.50K-1L") return product.price > 50000 && product.price <= 100000;
        if (price === "Above Rs.1L") return product.price > 100000;
        return true;
      });
  }, [baseResults, category, metal, price]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (sort === "Price: Low to High") return a.price - b.price;
      if (sort === "Price: High to Low") return b.price - a.price;
      return 0;
    });
  }, [filtered, sort]);

  const heading = query ? `Search results for "${query}"` : "Search jewellery";

  return (
    <PageShell>
      <PageHeader
        eyebrow="Search"
        title={heading}
        subtitle={
          loading
            ? "Searching live catalogue..."
            : `${sorted.length} ${sorted.length === 1 ? "piece" : "pieces"} found`
        }
      />

      <section className="mx-auto max-w-[1280px] px-5 py-12 sm:px-6 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="h-fit rounded-[24px] border border-[#e0d8cc] bg-white p-5 shadow-[0_4px_16px_rgba(0,0,0,0.04)] sm:p-6">
            <div className="mb-5 flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-[#7A2533]" />
              <h3 className="font-display text-base font-semibold text-[#1a1a2e]">Filters</h3>
            </div>

            <FilterGroup title="Category">
              <FilterPill active={category === "All"} onClick={() => setCategory("All")}>
                All
              </FilterPill>
              {dbCategories.map((item) => (
                <FilterPill
                  key={item.id}
                  active={category === item.name}
                  onClick={() => setCategory(item.name)}
                >
                  {item.name}
                </FilterPill>
              ))}
            </FilterGroup>

            <FilterGroup title="Metal">
              {metals.map((item) => (
                <FilterPill key={item} active={metal === item} onClick={() => setMetal(item)}>
                  {item}
                </FilterPill>
              ))}
            </FilterGroup>

            <FilterGroup title="Price">
              {PRICE_FILTERS.map((item) => (
                <FilterPill key={item} active={price === item} onClick={() => setPrice(item)}>
                  {item}
                </FilterPill>
              ))}
            </FilterGroup>
          </aside>

          <div className="min-w-0">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-[#7a6e64]">
                Showing <span className="font-semibold text-[#1a1a2e]">{sorted.length}</span> of{" "}
                <span className="font-semibold text-[#1a1a2e]">{baseResults.length}</span> matching
                pieces
              </p>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="w-full appearance-none rounded-full border border-[rgba(66,29,34,0.24)] bg-[#fffdf9] bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%228%22%20viewBox%3D%220%200%2012%208%22%3E%3Cpath%20d%3D%22M1%201.5l5%205%205-5%22%20stroke%3D%22%23421D22%22%20stroke-width%3D%221.5%22%20fill%3D%22none%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px_8px] bg-[right_16px_center] bg-no-repeat px-5 py-2.5 pr-12 text-sm text-[#7A2533] focus:outline-none focus:ring-2 focus:ring-[#7A2533]/30 sm:w-auto"
              >
                <option>Relevance</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>

            {sorted.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-7 sm:grid-cols-2 xl:grid-cols-3 items-stretch">
                {sorted.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            ) : (
              <div className="rounded-[24px] border border-[#e0d8cc] bg-white px-5 py-12 text-center shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
                <h2 className="font-display text-2xl font-semibold text-[#1a1a2e]">
                  No jewellery found for "{query || "your search"}"
                </h2>
                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#7a6e64]">
                  Try a collection, product type, gemstone, metal or one of these popular
                  options.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  <QuickLink label="Browse Rings" q="Rings" />
                  <QuickLink label="Browse Earrings" q="Earrings" />
                  <Link to="/shop" className="btn-secondary">
                    View All Jewellery
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mt-6 first:mt-0">
      <p className="eyebrow mb-3 text-[10px]">{title}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function FilterPill({
  children,
  active,
  onClick,
}: {
  children: ReactNode;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-[12px] font-medium transition-all ${
        active
          ? "border-[#7A2533] bg-[#7A2533] text-white"
          : "border-[#e0d8cc] bg-white text-[#3a3028] hover:border-[#8B1A1A] hover:text-[#8B1A1A]"
      }`}
    >
      {children}
    </button>
  );
}

function QuickLink({ label, q }: { label: string; q: string }) {
  return (
    <Link to="/search" search={{ q }} className="btn-secondary">
      {label}
    </Link>
  );
}
