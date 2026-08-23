import { createFileRoute, Link, Outlet, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageShell } from "@/components/site/PageHeader";
import { categoriesApi } from "@/lib/api/categories";
import { subcategoriesApi } from "@/lib/api/subcategories";
import { Skeleton } from "@/components/ui/skeleton";
import { CategoryHero } from "@/components/site/CategoryHero";

export const Route = createFileRoute("/collections/$slug")({
  head: ({ params }) => ({
    meta: [{ title: `${params.slug.replace(/-/g, " ")} — Creative Muse` }],
  }),
  component: CollectionsSlugLayout,
});

function CollectionsSlugLayout() {
  const { slug, subslug } = useParams({ strict: false }) as { slug: string; subslug?: string };

  const { data: category, isLoading: catLoading } = useQuery({
    queryKey: ["collection", "category", slug],
    queryFn: () => categoriesApi.getBySlug(slug),
    staleTime: 5 * 60 * 1000,
  });

  const { data: subcategories = [] } = useQuery({
    queryKey: ["subcategories", "by-category", category?.id],
    queryFn: () => subcategoriesApi.listByCategory(category!.id, true),
    enabled: !!category,
    staleTime: 5 * 60 * 1000,
  });

  if (catLoading) {
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
          <Link to="/shop" className="mt-4 inline-block text-[#9C544D] hover:underline">
            Browse all products
          </Link>
        </div>
      </PageShell>
    );
  }

  const activeSub = subcategories.find((s: any) => s.slug === subslug);
  const heroCategory = activeSub
    ? {
        ...category,
        name: activeSub.name,
        description: activeSub.description || category.description,
      }
    : category;

  return (
    <PageShell>
      <CategoryHero category={heroCategory} />
      <div id="products" className="mx-auto max-w-[1440px] px-4 py-8 lg:px-8">
        <nav className="mb-4 text-xs text-gray-400">
          <Link to="/" className="hover:text-[#9C544D]">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link to={"/collections/$slug"} params={{ slug }} className="hover:text-[#9C544D]">
            {category.name}
          </Link>
          {activeSub && (
            <>
              <span className="mx-2">/</span>
              <span className="text-gray-600">{activeSub.name}</span>
            </>
          )}
        </nav>

        {subcategories.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            <Link
              to={"/collections/$slug"}
              params={{ slug }}
              aria-current={!subslug ? "page" : undefined}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold ${
                !subslug
                  ? "bg-[#9C544D] text-white"
                  : "border border-gray-200 text-gray-600 hover:border-[#9C544D] hover:text-[#9C544D]"
              }`}
            >
              All
            </Link>
            {subcategories.map((sub: any) => {
              const active = sub.slug === subslug;
              return (
                <Link
                  key={sub.id}
                  to={"/collections/$slug/$subslug"}
                  params={{ slug, subslug: sub.slug }}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold ${
                    active
                      ? "bg-[#9C544D] text-white"
                      : "border border-gray-200 text-gray-600 hover:border-[#9C544D] hover:text-[#9C544D]"
                  }`}
                >
                  {sub.name}
                </Link>
              );
            })}
          </div>
        )}

        <Outlet />
      </div>
    </PageShell>
  );
}
