import { useQuery } from "@tanstack/react-query";
import { productsApi, type ProductWithImages } from "./products";
import { categoriesApi } from "./categories";
import { contentApi } from "./content";
import type { CategoryRow, TestimonialRow, FaqRow } from "../db/types";

export function usePublishedProducts() {
  return useQuery({
    queryKey: ["products", "published"],
    queryFn: () => productsApi.getPublished(),
    staleTime: 60_000,
  });
}

export function useProductBySlug(slug: string) {
  return useQuery({
    queryKey: ["products", slug],
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

export function useProductsByFlag(flagSlug: string) {
  return useQuery({
    queryKey: ["products", "by-flag", flagSlug],
    queryFn: async () => {
      const all = await productsApi.getPublished();
      return all.filter((p) => p.flags?.some((f) => f.slug === flagSlug));
    },
    staleTime: 60_000,
  });
}

export function useFeaturedProducts() {
  return useProductsByFlag("featured");
}

export function useBestSellers() {
  return useProductsByFlag("best-seller");
}

export function useNewArrivals() {
  return useProductsByFlag("new-arrival");
}

export function useTrendingProducts() {
  return useProductsByFlag("trending");
}

export function useWeddingProducts() {
  return useProductsByFlag("wedding");
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesApi.list(true),
    staleTime: 120_000,
  });
}

export function useTestimonials() {
  return useQuery({
    queryKey: ["testimonials"],
    queryFn: () => contentApi.getTestimonials(true),
    staleTime: 120_000,
  });
}

export function useFaqs() {
  return useQuery({
    queryKey: ["faqs"],
    queryFn: () => contentApi.getFaqs(true),
    staleTime: 120_000,
  });
}

export function useHomepageSections() {
  return useQuery({
    queryKey: ["homepage"],
    queryFn: () => contentApi.getHomepageSections(),
    staleTime: 120_000,
  });
}

export function useSearchProducts(query: string) {
  return useQuery({
    queryKey: ["products", "search", query],
    queryFn: () => productsApi.search(query),
    enabled: query.length >= 2,
    staleTime: 30_000,
  });
}
