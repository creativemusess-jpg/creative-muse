import { useQuery, useQueryClient } from "@tanstack/react-query";
import { productsApi, type ProductWithImages } from "./products";
import { categoriesApi } from "./categories";

export function useAllProducts() {
  return useQuery({
    queryKey: ["products", "all"],
    queryFn: () => productsApi.list({ per_page: 100 }),
    staleTime: 30_000,
  });
}

export function useAllCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesApi.list(),
    staleTime: 60_000,
  });
}

export function useActiveCategories() {
  return useQuery({
    queryKey: ["categories", "active"],
    queryFn: () => categoriesApi.list(true),
    staleTime: 60_000,
  });
}

export function useProductById(id: string) {
  return useQuery({
    queryKey: ["products", id],
    queryFn: () => productsApi.getById(id),
    enabled: !!id,
    staleTime: 30_000,
  });
}

export function useProductBySlug(slug: string) {
  return useQuery({
    queryKey: ["products", "slug", slug],
    queryFn: () => productsApi.getBySlug(slug),
    enabled: !!slug,
    staleTime: 30_000,
  });
}

export function useProductWithImages(id: string) {
  return useQuery({
    queryKey: ["products", id, "with-images"],
    queryFn: () => productsApi.getWithImages(id),
    enabled: !!id,
    staleTime: 30_000,
  });
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ["products", "featured"],
    queryFn: () => productsApi.getFeatured(),
    staleTime: 30_000,
  });
}

export function useBestSellers() {
  return useQuery({
    queryKey: ["products", "best-sellers"],
    queryFn: () => productsApi.getBestSellers(),
    staleTime: 30_000,
  });
}

export function useNewArrivals() {
  return useQuery({
    queryKey: ["products", "new-arrivals"],
    queryFn: () => productsApi.getNewArrivals(),
    staleTime: 30_000,
  });
}

export function useTrendingProducts() {
  return useQuery({
    queryKey: ["products", "trending"],
    queryFn: () => productsApi.getTrending(),
    staleTime: 30_000,
  });
}

export function useWeddingProducts() {
  return useQuery({
    queryKey: ["products", "wedding"],
    queryFn: () => productsApi.getWedding(),
    staleTime: 30_000,
  });
}

export function useSearchProducts(query: string) {
  return useQuery({
    queryKey: ["products", "search", query],
    queryFn: () => productsApi.search(query),
    enabled: query.length >= 2,
    staleTime: 15_000,
  });
}

export function useInvalidateProducts() {
  const qc = useQueryClient();
  return async () => {
    await qc.invalidateQueries({ queryKey: ["products"] });
    await qc.invalidateQueries({ queryKey: ["categories"] });
  };
}
