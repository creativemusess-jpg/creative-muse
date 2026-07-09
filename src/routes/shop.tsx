import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { PageHeader, PageShell } from "@/components/site/PageHeader";
import { ProductCard } from "@/components/site/ProductCard";
import { useStorefrontProducts } from "@/lib/products";
import { categoriesApi } from "@/lib/api/categories";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop Fine Jewellery — Creative Muse" },
      { name: "description", content: "Browse rings, necklaces, earrings, bracelets and bridal sets — handcrafted in Vadodara." },
    ],
  }),
  component: ShopPage,
});

function ShopPage() {
  const [cat, setCat] = useState<string>("All");
  const [sort, setSort] = useState<string>("Featured");
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const { products, isLoading, error } = useStorefrontProducts();

  useEffect(() => {
    categoriesApi.list(true).then(setDbCategories).catch(() => {});
  }, []);

  const filtered = cat === "All" ? products : products.filter((p) => p.category === cat);
  const sorted = [...filtered].sort((a, b) => {
    if (sort === "Price: Low to High") return a.price - b.price;
    if (sort === "Price: High to Low") return b.price - a.price;
    if (sort === "Top Rated") return b.rating - a.rating;
    return 0;
  });

  return (
    <PageShell>
      <PageHeader
        eyebrow="Collection"
        title="All Jewellery"
        subtitle="Explore handcrafted pieces, certified and made to be treasured."
      />

      <section className="mx-auto max-w-[1280px] px-6 py-16">
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          {/* Filters */}
          <aside className="rounded-[24px] border border-[#e0d8cc] bg-white p-6 shadow-[0_4px_16px_rgba(0,0,0,0.04)] h-fit">
            <div className="mb-5 flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-[#C9A96E]" />
              <h3 className="font-display text-base font-semibold text-[#1a1a2e]">Filters</h3>
            </div>
            <p className="eyebrow mb-3 text-[10px]">Category</p>
            <div className="flex flex-wrap gap-2">
              <FilterPill active={cat === "All"} onClick={() => setCat("All")}>
                All
              </FilterPill>
              {dbCategories.map((c) => (
                <FilterPill key={c.id} active={cat === c.name} onClick={() => setCat(c.name)}>
                  {c.name}
                </FilterPill>
              ))}
            </div>

            <p className="eyebrow mt-6 mb-3 text-[10px]">Metal</p>
            <div className="flex flex-wrap gap-2">
              {["22K Gold", "18K Gold", "White Gold", "Platinum"].map((m) => (
                <FilterPill key={m}>{m}</FilterPill>
              ))}
            </div>

            <p className="eyebrow mt-6 mb-3 text-[10px]">Price</p>
            <div className="flex flex-wrap gap-2">
              {["Under ₹20K", "₹20K-50K", "₹50K-1L", "Above ₹1L"].map((m) => (
                <FilterPill key={m}>{m}</FilterPill>
              ))}
            </div>
          </aside>

          <div>
            <div className="mb-6 flex items-center justify-between gap-4">
              <p className="text-sm text-[#7a6e64]">
                {isLoading ? "Loading jewellery..." : (
                  <>Showing <span className="font-semibold text-[#1a1a2e]">{sorted.length}</span> pieces</>
                )}
              </p>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-full border border-[#e0d8cc] bg-white px-4 py-2 text-sm text-[#3a3028] focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/40"
              >
                <option>Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Top Rated</option>
              </select>
            </div>
            {error && (
              <div className="mb-6 rounded-[16px] border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                Live products could not be loaded. Showing the preserved seed catalogue.
              </div>
            )}
            <div className="grid grid-cols-2 gap-3 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sorted.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-12 flex justify-center gap-2">
              {[1, 2, 3, 4].map((n) => (
                <button
                  key={n}
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-all ${
                    n === 1
                      ? "bg-gradient-to-r from-[#C9A96E] to-[#B8860B] text-white shadow-[0_8px_20px_rgba(201,169,110,0.35)]"
                      : "border border-[#e0d8cc] bg-white text-[#3a3028] hover:border-[#C9A96E] hover:text-[#C9A96E]"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
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
          ? "border-[#C9A96E] bg-[#C9A96E] text-white"
          : "border-[#e0d8cc] bg-white text-[#3a3028] hover:border-[#C9A96E] hover:text-[#C9A96E]"
      }`}
    >
      {children}
    </button>
  );
}
