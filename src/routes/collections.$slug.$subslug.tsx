import { useState, useEffect } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageHeader";
import { productsApi, type ProductWithImages } from "@/lib/api/products";
import { subcategoriesApi } from "@/lib/api/subcategories";
import { ProductCard } from "@/components/site/ProductCard";

export const Route = createFileRoute("/collections/$slug/$subslug")({
  head: ({ params }) => ({ meta: [{ title: `${params.subslug.replace(/-/g, " ")} — Creative Muse` }] }),
  component: SubcategoryCollectionPage,
});

function SubcategoryCollectionPage() {
  const { slug, subslug } = useParams({ from: "/collections/$slug/$subslug" });
  const [subcategory, setSubcategory] = useState<any | null>(null);
  const [products, setProducts] = useState<ProductWithImages[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      subcategoriesApi.getByCategoryAndSlug(slug, subslug),
      productsApi.getPublished({ category: slug, subcategory: subslug }),
    ]).then(([sub, prods]) => {
      setSubcategory(sub);
      setProducts(prods);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [slug, subslug]);

  if (loading) {
    return (
      <PageShell>
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#c9a96e] border-t-transparent" />
        </div>
      </PageShell>
    );
  }

  if (!subcategory) {
    return (
      <PageShell>
        <div className="mx-auto max-w-[1280px] px-6 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-800">Collection not found</h1>
          <Link to="/shop" className="mt-4 inline-block text-[#c9a96e] hover:underline">Browse all products</Link>
        </div>
      </PageShell>
    );
  }

  const categoryName = subcategory.category?.name || slug.replace(/-/g, " ");

  return (
    <PageShell>
      <div className="mx-auto max-w-[1440px] px-4 py-8 lg:px-8">
        <nav className="mb-4 text-xs text-gray-400">
          <Link to="/" className="hover:text-[#c9a96e]">Home</Link>
          <span className="mx-2">/</span>
          <Link to={`/collections/${slug}`} className="hover:text-[#c9a96e]">{categoryName}</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-600">{subcategory.name}</span>
        </nav>

        <div className="mb-8">
          <h1 className="font-display text-3xl font-semibold text-[#1a1a2e] lg:text-4xl">{subcategory.name}</h1>
        </div>

        {products.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-gray-400">No products found in this collection.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
