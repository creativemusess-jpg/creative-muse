import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { categoriesApi } from "@/lib/api/categories";
import { productsApi } from "@/lib/api/products";
import { productFromDb } from "@/lib/products";
import { ProductCard } from "@/components/site/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight, Home } from "lucide-react";
import catRings from "@/assets/cat-rings.png";
import catNecklaces from "@/assets/cat-necklaces.png";
import catEarrings from "@/assets/cat-earrings.png";
import catBracelets from "@/assets/cat-bracelets.png";
import catMangalsutra from "@/assets/cat-mangalsutra.png";
import catPendants from "@/assets/cat-pendants.png";
import catBangles from "@/assets/cat-bangles.png";
import catWedding from "@/assets/cat-wedding.png";
import { CategoryHero } from "@/components/site/CategoryHero";

const CATEGORY_IMAGES: Record<string, string> = {
  Rings: catRings,
  Necklaces: catNecklaces,
  Earrings: catEarrings,
  Bracelets: catBracelets,
  Mangalsutra: catMangalsutra,
  Pendants: catPendants,
  Bangles: catBangles,
  "Wedding Sets": catWedding,
};

export const Route = createFileRoute("/category/$slug")({
  component: CategoryPage,
});

function CategoryPage() {
  const { slug } = Route.useParams();

  const { data: category, isLoading: catLoading } = useQuery({
    queryKey: ["category", slug],
    queryFn: () => categoriesApi.getBySlug(slug),
    staleTime: 5 * 60 * 1000,
  });

  const { data: products = [], isLoading: prodsLoading } = useQuery({
    queryKey: ["products", "by-category", slug],
    queryFn: () => productsApi.getPublishedByCategorySlug(slug).then((r) => r.map(productFromDb)),
    enabled: !!category,
    staleTime: 5 * 60 * 1000,
  });

  const loading = catLoading || (!!category && prodsLoading);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdf8f3] pt-32 pb-20">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="grid grid-cols-2 gap-3 sm:gap-7 md:grid-cols-3 lg:grid-cols-4 items-stretch">
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
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-[#fdf8f3] pt-32 pb-20">
        <div className="mx-auto max-w-[1280px] px-6 text-center">
          <h1 className="text-2xl font-semibold text-[#1a1a2e]">Category not found</h1>
          <p className="mt-4 text-gray-500">The category you're looking for doesn't exist.</p>
          <Link to="/shop" className="btn-primary mt-6 inline-flex">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const catImage = category.imageUrl || CATEGORY_IMAGES[category.name] || null;

  return (
    <div className="min-h-screen bg-[#fdf8f3] pt-24 pb-20">
      <div className="mx-auto max-w-[1280px] px-6">
        <nav className="flex items-center gap-2 py-4 text-xs text-gray-400">
          <Link to="/" className="hover:text-[#9C544D]">
            <Home className="h-3.5 w-3.5" />
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/shop" className="hover:text-[#9C544D]">
            Shop
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-[#9C544D]">{category.name}</span>
        </nav>

        <CategoryHero category={{ ...category, image: category.image || catImage }} />
        <div id="products" className="mb-10 flex flex-col items-center text-center">
          <p className="mt-2 text-xs tracking-wider text-[#9C544D] uppercase">
            {products.length} {products.length === 1 ? "product" : "products"}
          </p>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-7 md:grid-cols-3 lg:grid-cols-4 items-stretch">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <svg
              className="mb-4 h-16 w-16 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            <p className="text-lg font-medium text-gray-400">
              No products have been added to {category.name} yet.
            </p>
            <Link
              to="/shop"
              className="mt-6 rounded-lg bg-[#9C544D] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#7A3D3A]"
            >
              Browse All Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
