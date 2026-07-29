import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageShell } from "@/components/site/PageHeader";
import { productsApi } from "@/lib/api/products";
import { categoriesApi } from "@/lib/api/categories";
import { subcategoriesApi } from "@/lib/api/subcategories";
import { productFromDb } from "@/lib/products";
import { ProductCard } from "@/components/site/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/collections/$slug")({
  head: ({ params }) => ({
    meta: [{ title: `${params.slug.replace(/-/g, " ")} — Creative Muse` }],
  }),
  component: CategoryCollectionPage,
});

function CategoryCollectionPage() {
  const { slug } = useParams({ from: "/collections/$slug" });

  const { data: category, isLoading: catLoading } = useQuery({
    queryKey: ["collection", "category", slug],
    queryFn: () => categoriesApi.getBySlug(slug),
    staleTime: 5 * 60 * 1000,
  });

  const { data: products = [], isLoading: prodsLoading } = useQuery({
    queryKey: ["products", "collection", slug],
    queryFn: () => productsApi.getPublished({ category: slug }).then((r) => r.map(productFromDb)),
    enabled: !!category,
    staleTime: 5 * 60 * 1000,
  });

  const { data: subcategories = [] } = useQuery({
    queryKey: ["subcategories", "by-category", category?.id],
    queryFn: () => subcategoriesApi.listByCategory(category!.id, true),
    enabled: !!category,
    staleTime: 5 * 60 * 1000,
  });

  const loading = catLoading || (!!category && prodsLoading);

  if (loading) {
    return (
      <PageShell>
        <div className="mx-auto max-w-[1280px] px-6 py-20">
          <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 items-stretch">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <Skeleton className="aspect-square w-full rounded-[8px]" />
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-full rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </PageShell>
    );
  }

  if (!category) {
    return (
      <PageShell>
        <div className="mx-auto max-w-[1280px] px-6 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-800">Category not found</h1>
          <Link to="/shop" className="mt-4 inline-block text-[#7A2533] hover:underline">
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
          <Link to="/" className="hover:text-[#7A2533]">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-600">{category.name}</span>
        </nav>

        <div className="mb-8">
          <h1 className="font-display text-3xl font-semibold text-[#7A2533] lg:text-4xl">
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
                className="rounded-full border border-gray-200 px-4 py-1.5 text-xs font-semibold text-gray-600 hover:border-[#7A2533] hover:text-[#7A2533]"
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
