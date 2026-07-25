import { useState, useEffect } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageHeader";
import { productsApi } from "@/lib/api/products";
import { categoriesApi } from "@/lib/api/categories";
import { subcategoriesApi } from "@/lib/api/subcategories";
import { productFromDb } from "@/lib/products";
import { ProductCard } from "@/components/site/ProductCard";

export const Route = createFileRoute("/collections/$slug")({
  head: ({ params }) => ({
    meta: [{ title: `${params.slug.replace(/-/g, " ")} — Creative Muse` }],
  }),
  component: CategoryCollectionPage,
});

function CategoryCollectionPage() {
  const { slug } = useParams({ from: "/collections/$slug" });
  const [category, setCategory] = useState<any | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        const cat = await categoriesApi.getBySlug(slug);
        setCategory(cat);
        if (cat) {
          const [prods, subs] = await Promise.all([
            productsApi.getPublished({ category: slug }),
            subcategoriesApi.listByCategory(cat.id, true),
          ]);
          setProducts(prods.map(productFromDb));
          setSubcategories(subs);
        } else {
          setProducts([]);
          setSubcategories([]);
        }
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    })();
  }, [slug]);

  if (loading) {
    return (
      <PageShell>
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#c9a96e] border-t-transparent" />
        </div>
      </PageShell>
    );
  }

  if (!category) {
    return (
      <PageShell>
        <div className="mx-auto max-w-[1280px] px-6 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-800">Category not found</h1>
          <Link to="/shop" className="mt-4 inline-block text-[#c9a96e] hover:underline">
            Browse all products
          </Link>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-[1440px] px-4 py-8 lg:px-8">
        <nav className="mb-4 text-xs text-gray-400">
          <Link to="/" className="hover:text-[#c9a96e]">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-600">{category.name}</span>
        </nav>

        <div className="mb-8">
          <h1 className="font-display text-3xl font-semibold text-[#1a1a2e] lg:text-4xl">
            {category.name}
          </h1>
          {category.description && (
            <p className="mt-2 text-sm text-gray-500">{category.description}</p>
          )}
        </div>

        {subcategories.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            <Link
              to={`.`}
              className="rounded-full bg-[#1a1a2e] px-4 py-1.5 text-xs font-semibold text-white"
            >
              All
            </Link>
            {subcategories.map((sub: any) => (
              <Link
                key={sub.id}
                to={`/collections/${slug}/${sub.slug}`}
                className="rounded-full border border-gray-200 px-4 py-1.5 text-xs font-semibold text-gray-600 hover:border-[#c9a96e] hover:text-[#c9a96e]"
              >
                {sub.name}
              </Link>
            ))}
          </div>
        )}

        {products.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-gray-400">No products found in this collection.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 items-stretch">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
