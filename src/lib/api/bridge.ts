// Bridge between existing frontend and Supabase API
// Keeps static data as fallback until Supabase schema is set up
import { productsApi, type ProductWithImages } from "./products";
import { categoriesApi } from "./categories";
import { contentApi } from "./content";
import { supabase } from "../supabase";
import type { Product } from "../products";

let useSupabase = false;

export async function checkSupabaseConnection(): Promise<boolean> {
  try {
    const { error } = await supabase.from("products").select("id", { count: "exact", head: true });
    if (error) {
      console.warn("[Supabase] Connection failed, using static data:", error.message);
      useSupabase = false;
      return false;
    }
    useSupabase = true;
    return true;
  } catch {
    useSupabase = false;
    return false;
  }
}

export function isUsingSupabase(): boolean {
  return useSupabase;
}

// Convert Supabase product to legacy Product format for compatibility
export function toLegacyProduct(p: ProductWithImages): Product {
  return {
    id: p.slug || p.id,
    name: p.name,
    metal: p.metal_type || p.material || "",
    stone: p.gemstone || "",
    price: Number(p.current_price),
    mrp: Number(p.original_price || p.current_price),
    badge: (p.badge as Product["badge"]) || null,
    rating: Number(p.rating_average),
    reviews: p.review_count,
    emoji: "",
    image: p.images?.find((i) => i.is_main)?.url || p.images?.[0]?.url || "",
    bg: "from-[#faf3e8] to-[#f0e4d1]",
    stock: p.stock_quantity ?? undefined,
    category: "",
    shortDescription: p.short_description || undefined,
    fullDescription: p.full_description || undefined,
    purity: p.gold_purity || undefined,
    metalColor: p.metal_colour || undefined,
    weight: p.gross_weight || undefined,
    tags: p.tags || undefined,
  };
}

export { productsApi, categoriesApi, contentApi };
