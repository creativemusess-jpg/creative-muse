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

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ["products", "featured"],
    queryFn: () => productsApi.getFeatured(),
    staleTime: 60_000,
  });
}

export function useBestSellers() {
  return useQuery({
    queryKey: ["products", "best-sellers"],
    queryFn: () => productsApi.getBestSellers(),
    staleTime: 60_000,
  });
}

export function useNewArrivals() {
  return useQuery({
    queryKey: ["products", "new-arrivals"],
    queryFn: () => productsApi.getNewArrivals(),
    staleTime: 60_000,
  });
}

export function useTrendingProducts() {
  return useQuery({
    queryKey: ["products", "trending"],
    queryFn: () => productsApi.getTrending(),
    staleTime: 60_000,
  });
}

export function useWeddingProducts() {
  return useQuery({
    queryKey: ["products", "wedding"],
    queryFn: () => productsApi.getWedding(),
    staleTime: 60_000,
  });
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
