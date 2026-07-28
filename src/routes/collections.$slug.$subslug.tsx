import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageShell } from "@/components/site/PageHeader";
import { productsApi } from "@/lib/api/products";
import { subcategoriesApi } from "@/lib/api/subcategories";
import { productFromDb } from "@/lib/products";
import { ProductCard } from "@/components/site/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/collections/$slug/$subslug")({
  head: ({ params }) => ({
    meta: [{ title: `${params.subslug.replace(/-/g, " ")} — Creative Muse` }],
  }),
  component: SubcategoryCollectionPage,
});

function SubcategoryCollectionPage() {
  const { slug, subslug } = useParams({ from: "/collections/$slug/$subslug" });

  const { data: subcategory, isLoading: subLoading } = useQuery({
    queryKey: ["subcategory", slug, subslug],
    queryFn: () => subcategoriesApi.getByCategoryAndSlug(slug, subslug),
    staleTime: 5 * 60 * 1000,
  });

  const { data: products = [], isLoading: prodsLoading } = useQuery({
    queryKey: ["products", "by-subcategory", slug, subslug],
    queryFn: () =>
      productsApi.getPublished({ category: slug, subcategory: subslug }).then((r) => r.map(productFromDb)),
    enabled: !!subcategory,
    staleTime: 5 * 60 * 1000,
  });

  const loading = subLoading || (!!subcategory && prodsLoading);

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

  if (!subcategory) {
    return (
      <PageShell>
        <div className="mx-auto max-w-[1280px] px-6 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-800">Collection not found</h1>
          <Link to="/shop" className="mt-4 inline-block text-[#c9a96e] hover:underline">
            Browse all products
          </Link>
        </div>
      </PageShell>
    );
  }

  const categoryName = subcategory.category?.name || slug.replace(/-/g, " ");

  return (
    <PageShell>
      <div className="mx-auto max-w-[1440px] px-4 py-8 lg:px-8">
        <nav className="mb-4 text-xs text-gray-400">
          <Link to="/" className="hover:text-[#c9a96e]">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link to={`/collections/${slug}`} className="hover:text-[#c9a96e]">
            {categoryName}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-600">{subcategory.name}</span>
        </nav>

        <div className="mb-8">
          <h1 className="font-display text-3xl font-semibold text-[#7A2533] lg:text-4xl">
            {subcategory.name}
          </h1>
        </div>

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
