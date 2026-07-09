import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, PageShell } from "@/components/site/PageHeader";
import { ProductCard } from "@/components/site/ProductCard";
import { useWishlistProducts } from "@/lib/store";

export const Route = createFileRoute("/wishlist")({
  head: () => ({ meta: [{ title: "Wishlist - Creative Muse" }] }),
  component: WishlistPage,
});

function WishlistPage() {
  const products = useWishlistProducts();

  return (
    <PageShell>
      <PageHeader eyebrow="Saved" title="Your Wishlist" subtitle="Pieces you've fallen in love with." />
      <section className="mx-auto max-w-[1280px] px-6 py-16">
        {products.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="rounded-[24px] border border-[#e0d8cc] bg-white px-5 py-12 text-center shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
            <h2 className="font-display text-2xl font-semibold text-[#1a1a2e]">No saved jewellery yet</h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#7a6e64]">
              Save pieces from the live catalogue and they will appear here.
            </p>
          </div>
        )}
        <div className="mt-12 text-center">
          <Link to="/shop" className="btn-secondary">
            Discover More
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
