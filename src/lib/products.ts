// Shared product data for the storefront
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import prodAarav from "@/assets/prod-aarav-ring.jpg";
import prodCelestia from "@/assets/prod-celestia-earrings.jpg";
import prodSerene from "@/assets/prod-serene-bracelet.jpg";
import prodPriya from "@/assets/prod-priya-necklace.jpg";
import prodLuna from "@/assets/prod-luna-pendant.jpg";
import prodMangalsutra from "@/assets/prod-mangalsutra.jpg";
import prodJhumka from "@/assets/prod-jhumka.jpg";
import prodPolki from "@/assets/prod-polki-choker.jpg";
import { productsApi, type ProductWithImages } from "@/lib/api/products";

export type Product = {
  id: string;
  name: string;
  metal: string;
  stone: string;
  price: number;
  mrp: number;
  badge: "New" | "Best Seller" | "Wedding" | "Trending" | null;
  rating: number;
  reviews: number;
  emoji: string;
  image: string;
  bg: string; // gradient classes
  stock?: number;
  category: string;
  collection?: string;
  tags?: string[];
  // Optional extended fields (Quick View / PDP). Hidden gracefully when absent.
  shortDescription?: string;
  fullDescription?: string;
  sku?: string;
  purity?: string;
  metalColor?: string;
  weight?: string;
  certification?: string;
  gallery?: string[];
  view360Images?: string[];
  care?: string;
  shippingInfo?: string;
};

const fmt = (n: number) => "₹" + n.toLocaleString("en-IN");
export const formatPrice = fmt;

export const PRODUCTS: Product[] = [
  {
    id: "aarav-solitaire",
    name: "Aarav Solitaire Ring",
    metal: "18K Gold",
    stone: "Diamond",
    price: 48500,
    mrp: 62000,
    badge: "Best Seller",
    rating: 4.9,
    reviews: 218,
    emoji: "💍",
    image: prodAarav,
    bg: "from-[#faf3e8] to-[#f0e4d1]",
    category: "Rings",
    collection: "Solitaire Classics",
    tags: ["ring", "solitaire", "bridal", "engagement", "diamond", "aarav"],
    shortDescription: "A brilliant round solitaire set in a whisper-thin 18K gold band.",
    fullDescription:
      "The Aarav solitaire is hand-set in our Vadodara atelier with a VS-clarity brilliant round diamond, cradled in a four-prong 18K yellow gold setting engineered for everyday wear.",
    sku: "CM-RG-AARAV-018",
    purity: "18K (750)",
    metalColor: "Yellow Gold",
    weight: "3.2 g (approx.)",
    certification: "BIS Hallmark · IGI Diamond Certificate",
  },
  {
    id: "celestia-drop",
    name: "Celestia Drop Earrings",
    metal: "White Gold",
    stone: "Pearl",
    price: 22800,
    mrp: 28000,
    badge: "New",
    rating: 4.8,
    reviews: 94,
    emoji: "✨",
    image: prodCelestia,
    bg: "from-[#f7ede0] to-[#eddfc9]",
    category: "Earrings",
    collection: "Pearl Edit",
    tags: ["earrings", "pearl", "white gold", "drop earrings", "occasion"],
    shortDescription: "Freshwater pearl drops on a delicate 18K white gold hook.",
    fullDescription:
      "Luminous freshwater pearls suspended from a whisper-fine 18K white gold hook — an effortless piece that moves beautifully from day into evening.",
    sku: "CM-EA-CELESTIA-018",
    purity: "18K (750)",
    metalColor: "White Gold",
    weight: "2.6 g (pair)",
    certification: "BIS Hallmark",
  },
  {
    id: "serene-bracelet",
    name: "Serene Diamond Bracelet",
    metal: "Platinum",
    stone: "Diamond",
    price: 67500,
    mrp: 82000,
    badge: "Trending",
    rating: 5.0,
    reviews: 156,
    stock: 4,
    emoji: "💎",
    image: prodSerene,
    bg: "from-[#eef2f6] to-[#dde5ec]",
    category: "Bracelets",
    collection: "Diamond Essentials",
    tags: ["bracelet", "diamond", "platinum", "tennis", "gift"],
    shortDescription: "A tennis-inspired platinum line set with F/VS diamonds.",
    fullDescription:
      "Each stone in the Serene bracelet is prong-set in 950 platinum and matched for colour and clarity, giving a continuous river of brilliance around the wrist.",
    sku: "CM-BR-SERENE-950",
    purity: "PT 950",
    metalColor: "Platinum",
    weight: "8.4 g",
    certification: "PGI Platinum · IGI Diamond Certificate",
  },
  {
    id: "priya-kundan",
    name: "Priya Kundan Necklace",
    metal: "22K Gold",
    stone: "Kundan",
    price: 38900,
    mrp: 48000,
    badge: "Wedding",
    rating: 4.9,
    reviews: 312,
    emoji: "📿",
    image: prodPriya,
    bg: "from-[#fbf1d6] to-[#f5e4b4]",
    category: "Necklaces",
    collection: "Bridal Heritage",
    tags: ["necklace", "kundan", "bridal", "wedding", "traditional"],
    shortDescription:
      "Traditional uncut kundan set in 22K gold, finished with meenakari on the reverse.",
    fullDescription:
      "The Priya necklace pairs uncut kundan stones with hand-painted meenakari on the reverse — a heritage bridal silhouette crafted in the Jaipur tradition.",
    sku: "CM-NK-PRIYA-022",
    purity: "22K (916)",
    metalColor: "Yellow Gold",
    weight: "32.5 g",
    certification: "BIS Hallmark",
  },
  {
    id: "luna-crescent",
    name: "Luna Crescent Pendant",
    metal: "14K Gold",
    stone: "Ruby",
    price: 15600,
    mrp: 19800,
    badge: "New",
    rating: 4.7,
    reviews: 67,
    emoji: "🌙",
    image: prodLuna,
    bg: "from-[#fce8eb] to-[#f6d5dc]",
    category: "Pendants",
    collection: "Everyday Muse",
    tags: ["pendant", "ruby", "rose gold", "crescent", "gift"],
    shortDescription: "A crescent silhouette in 14K rose gold, tipped with a Burmese ruby.",
    fullDescription:
      "The Luna pendant is a modern take on the crescent motif — cast in 14K rose gold with a single Burmese ruby set at the tip. Includes a matching 45cm rose gold chain.",
    sku: "CM-PD-LUNA-014",
    purity: "14K (585)",
    metalColor: "Rose Gold",
    weight: "1.9 g",
    certification: "BIS Hallmark",
  },
  {
    id: "eternal-mangalsutra",
    name: "Eternal Mangalsutra",
    metal: "22K Gold",
    stone: "Diamond",
    price: 54200,
    mrp: 68000,
    badge: "Best Seller",
    rating: 5.0,
    reviews: 445,
    emoji: "💛",
    image: prodMangalsutra,
    bg: "from-[#fbedc9] to-[#f2dea3]",
    category: "Mangalsutra",
    collection: "Forever Vows",
    tags: ["mangalsutra", "diamond", "bridal", "black beads", "daily wear"],
    shortDescription: "Twin-vati mangalsutra with a diamond-set pendant and 22K black-bead chain.",
    fullDescription:
      "A contemporary mangalsutra with two 22K gold vatis and a central diamond cluster, strung on a traditional black-bead chain — a piece designed to be worn every day.",
    sku: "CM-MS-ETERNAL-022",
    purity: "22K (916)",
    metalColor: "Yellow Gold",
    weight: "12.4 g",
    certification: "BIS Hallmark · IGI Diamond Certificate",
  },
  {
    id: "meera-jhumka",
    name: "Meera Jhumka Earrings",
    metal: "22K Gold",
    stone: "Emerald",
    price: 18400,
    mrp: 23500,
    badge: "Trending",
    rating: 4.8,
    reviews: 189,
    emoji: "🟢",
    image: prodJhumka,
    bg: "from-[#f5eecd] to-[#ede2ad]",
    category: "Earrings",
    collection: "Temple Treasures",
    tags: ["earrings", "jhumka", "emerald", "pearl", "traditional"],
    shortDescription: "Bell-shaped jhumkas in 22K gold with emerald drops and pearl fringe.",
    fullDescription:
      "Hand-crafted 22K gold jhumkas with cabochon emeralds and a delicate freshwater pearl fringe — rooted in temple jewellery traditions of southern India.",
    sku: "CM-EA-MEERA-022",
    purity: "22K (916)",
    metalColor: "Yellow Gold",
    weight: "9.1 g (pair)",
    certification: "BIS Hallmark",
  },
  {
    id: "royal-polki",
    name: "Royal Polki Choker",
    metal: "22K Gold",
    stone: "Polki",
    price: 92000,
    mrp: 115000,
    badge: "Wedding",
    rating: 4.9,
    reviews: 78,
    emoji: "👑",
    image: prodPolki,
    bg: "from-[#f2e0e2] to-[#e4c8cb]",
    category: "Necklaces",
    collection: "Bridal Heritage",
    tags: ["choker", "polki", "kundan", "bridal", "wedding", "pearl"],
    shortDescription: "Uncut polki choker in 22K gold, finished with a South Sea pearl fringe.",
    fullDescription:
      "The Royal Polki choker is set with uncut polki diamonds in 22K gold, closed at the back with an adjustable dori and finished with a South Sea pearl fringe — a statement bridal heirloom.",
    sku: "CM-NK-ROYAL-022",
    purity: "22K (916)",
    metalColor: "Yellow Gold",
    weight: "48.6 g",
    certification: "BIS Hallmark",
  },
];

const fallbackBySku = new Map(PRODUCTS.map((product) => [product.sku, product]));
const fallbackBySlug = new Map(PRODUCTS.map((product) => [product.id, product]));

const gradientByCategory: Record<string, string> = {
  Rings: "from-[#faf3e8] to-[#f0e4d1]",
  Earrings: "from-[#f7ede0] to-[#eddfc9]",
  Bracelets: "from-[#eef2f6] to-[#dde5ec]",
  Necklaces: "from-[#fbf1d6] to-[#f5e4b4]",
  Mangalsutra: "from-[#fbedc9] to-[#f2dea3]",
  Pendants: "from-[#fce8eb] to-[#f6d5dc]",
};

const normalizeBadge = (badge: string | null): Product["badge"] => {
  if (badge === "New" || badge === "Best Seller" || badge === "Wedding" || badge === "Trending") {
    return badge;
  }
  return null;
};

const imageUrl = (image?: { url?: string; image_url?: string } | null) =>
  image?.url || image?.image_url || "";

export function productFromDb(product: ProductWithImages): Product {
  const fallback = fallbackBySku.get(product.sku ?? "") ?? fallbackBySlug.get(product.slug);
  const allImages = (product.images || []).map(imageUrl).filter(Boolean);
  const dbImage = imageUrl(product.main_image) || allImages[0] || "";
  const isKnownProduct = fallbackBySlug.has(product.slug) || fallbackBySku.has(product.sku ?? "");
  const mainImage = dbImage || (isKnownProduct && fallback?.image ? fallback.image : "");
  const otherImages = allImages.filter((url) => url !== mainImage);
  const category = product.category_name || fallback?.category || "Jewellery";
  return {
    id: product.slug,
    name: product.name,
    metal: product.material || product.gold_purity || product.metal_type || fallback?.metal || "Fine Jewellery",
    stone: product.gemstone || fallback?.stone || "Handcrafted",
    price: product.current_price,
    mrp: product.original_price || product.current_price,
    badge: normalizeBadge(product.badge) ?? fallback?.badge ?? null,
    rating: product.rating_average || fallback?.rating || 5,
    reviews: product.review_count || fallback?.reviews || 0,
    emoji: fallback?.emoji || "",
    image: mainImage,
    bg: fallback?.bg || gradientByCategory[category] || "from-[#faf3e8] to-[#f0e4d1]",
    stock: product.stock_quantity ?? fallback?.stock,
    category,
    collection: fallback?.collection,
    tags: product.tags?.length ? product.tags : fallback?.tags,
    shortDescription: product.short_description || fallback?.shortDescription,
    fullDescription: product.full_description || fallback?.fullDescription,
    sku: product.sku || fallback?.sku,
    purity: product.gold_purity || fallback?.purity,
    metalColor: product.metal_colour || fallback?.metalColor,
    weight: product.gross_weight || fallback?.weight,
    certification: [product.certification_type, product.certification_number].filter(Boolean).join(" ") || fallback?.certification,
    gallery: otherImages.length > 0 ? otherImages : fallback?.gallery,
    view360Images: product.images_360?.map(imageUrl).filter(Boolean) || fallback?.view360Images,
    care: fallback?.care,
    shippingInfo: fallback?.shippingInfo,
  };
}

export function useStorefrontProducts() {
  const query = useQuery({
    queryKey: ["products", "published", "storefront"],
    queryFn: () => productsApi.getPublished({ per_page: 100 }),
    staleTime: 15_000,
  });

  const products = useMemo(
    () => (query.data ? query.data.map(productFromDb) : []),
    [query.data],
  );

  return { ...query, products };
}

export function useStorefrontProduct(slug: string) {
  const query = useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const product = await productsApi.getWithImagesBySlug(slug);
      if (!product || product.status !== "active") return null;
      return productFromDb(product);
    },
    enabled: !!slug,
    staleTime: 15_000,
  });

  return {
    ...query,
    product: query.data ?? null,
  };
}

export function useSearchStorefrontProducts(queryText: string) {
  const query = useQuery({
    queryKey: ["products", "search", queryText],
    queryFn: () => productsApi.search(queryText),
    enabled: queryText.trim().length >= 2,
    staleTime: 10_000,
  });

  const products = useMemo(
    () => (query.data ? query.data.map(productFromDb) : []),
    [query.data, queryText],
  );

  return { ...query, products };
}

const normalizeSearchText = (value: unknown) =>
  String(value ?? "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

const tokenizeSearchText = (value: unknown) =>
  normalizeSearchText(value)
    .split(/[^a-z0-9]+/i)
    .filter(Boolean);

const tokenMatches = (candidate: string, token: string) =>
  candidate === token || (token.length >= 3 && candidate.startsWith(token));

const hasSearchTerm = (value: unknown, term: string) => {
  const normalized = normalizeSearchText(value);
  if (!term) return true;
  if (term.includes(" ")) return normalized.includes(term);
  return tokenizeSearchText(normalized).some((candidate) => tokenMatches(candidate, term));
};

const searchableTextForProduct = (product: Product) =>
  normalizeSearchText(
    [
      product.name,
      product.category,
      product.collection,
      product.metal,
      product.purity,
      product.metalColor,
      product.stone,
      product.sku,
      product.badge,
      product.tags?.join(" "),
      product.shortDescription,
      product.fullDescription,
      product.certification,
    ].join(" "),
  );

export function getSearchableProductText(product: Product) {
  return searchableTextForProduct(product);
}

export function searchProducts(query: string, products: Product[] = PRODUCTS): Product[] {
  const term = normalizeSearchText(query);
  if (!term) return products;

  const tokens = term.split(" ").filter(Boolean);

  return products
    .map((product) => {
      const text = searchableTextForProduct(product);
      const textTokens = tokenizeSearchText(text);
      const matchesAllTokens = tokens.every((token) =>
        textTokens.some((candidate) => tokenMatches(candidate, token)),
      );
      if (!hasSearchTerm(text, term) && !matchesAllTokens) {
        return null;
      }

      const name = normalizeSearchText(product.name);
      const category = normalizeSearchText(product.category);
      const collection = normalizeSearchText(product.collection);
      const material = normalizeSearchText(
        `${product.metal} ${product.purity} ${product.metalColor} ${product.stone}`,
      );
      const sku = normalizeSearchText(product.sku);
      const tags = normalizeSearchText(product.tags?.join(" "));

      let score = 0;
      if (name === term) score += 100;
      if (hasSearchTerm(name, term)) score += 60;
      if (hasSearchTerm(category, term)) score += 45;
      if (hasSearchTerm(collection, term)) score += 40;
      if (hasSearchTerm(tags, term)) score += 35;
      if (hasSearchTerm(material, term)) score += 30;
      if (hasSearchTerm(sku, term)) score += 25;
      score += tokens.filter((token) => hasSearchTerm(name, token)).length * 8;
      score += tokens.filter((token) => hasSearchTerm(text, token)).length * 3;

      return { product, score };
    })
    .filter((match): match is { product: Product; score: number } => Boolean(match))
    .sort((a, b) => b.score - a.score || a.product.name.localeCompare(b.product.name))
    .map((match) => match.product);
}

export function getRecommendedProducts(
  product: Product,
  all: Product[] = PRODUCTS,
  maxResults = 6,
): Product[] {
  const others = all.filter((p) => p.id !== product.id);
  const scored = others.map((p) => {
    let score = 0;
    if (p.category === product.category) score += 50;
    if (p.collection === product.collection) score += 30;
    if (p.metal === product.metal) score += 15;
    if (p.stone === product.stone) score += 10;
    const priceDiff = Math.abs(p.price - product.price);
    if (priceDiff < 10000) score += 8;
    else if (priceDiff < 25000) score += 4;
    if (p.badge === "Best Seller" || p.badge === "Trending") score += 5;
    if (p.tags?.some((t) => product.tags?.includes(t))) score += 12;
    return { product: p, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, maxResults).map((s) => s.product);
}

export const CATEGORIES = [
  { name: "Rings", count: "240+", emoji: "💍" },
  { name: "Necklaces", count: "180+", emoji: "📿" },
  { name: "Earrings", count: "320+", emoji: "✨" },
  { name: "Bracelets", count: "140+", emoji: "💎" },
  { name: "Mangalsutra", count: "90+", emoji: "💛" },
  { name: "Pendants", count: "210+", emoji: "🌙" },
  { name: "Bangles", count: "160+", emoji: "🔮" },
  { name: "Wedding Sets", count: "75+", emoji: "👑" },
];
