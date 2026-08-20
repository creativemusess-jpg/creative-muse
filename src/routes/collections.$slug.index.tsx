import { createFileRoute, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { productsApi } from "@/lib/api/products";
import { productFromDb } from "@/lib/products";
import { ProductCard } from "@/components/site/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/collections/$slug/")({
  component: CategoryProductsView,
});

function CategoryProductsView() {
  const { slug } = useParams({ from: "/collections/$slug/" });

  const { data: products = [], isLoading: prodsLoading } = useQuery({
    queryKey: ["products", "collection", slug],
    queryFn: () => productsApi.getPublished({ category: slug }).then((r) => r.map(productFromDb)),
    staleTime: 5 * 60 * 1000,
  });

  if (prodsLoading) {
    return (
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
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-gray-400">No products found in this collection.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 items-stretch">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
