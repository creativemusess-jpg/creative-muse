import { o as __toESM } from "../_runtime.mjs";
import { a as prod_priya_necklace_default, i as prod_polki_choker_default, n as prod_jhumka_default, o as prod_serene_bracelet_default, r as prod_luna_pendant_default, t as prod_aarav_ring_default } from "./prod-polki-choker-BJbhItn6.mjs";
import { t as productsApi } from "./products-CsgymTpp.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/products-6Nbb9Ru-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var prod_celestia_earrings_default = "/assets/prod-celestia-earrings-C24dda0W.jpg";
var prod_mangalsutra_default = "/assets/prod-mangalsutra-atQClfkh.jpg";
var fmt = (n) => "₹" + n.toLocaleString("en-IN");
var formatPrice = fmt;
var PRODUCTS = [
	{
		id: "aarav-solitaire",
		name: "Aarav Solitaire Ring",
		metal: "18K Gold",
		stone: "Diamond",
		price: 48500,
		mrp: 62e3,
		rating: 4.9,
		reviews: 218,
		emoji: "💍",
		image: prod_aarav_ring_default,
		bg: "from-[#faf3e8] to-[#f0e4d1]",
		category: "Rings",
		collection: "Solitaire Classics",
		tags: [
			"ring",
			"solitaire",
			"bridal",
			"engagement",
			"diamond",
			"aarav"
		],
		shortDescription: "A brilliant round solitaire set in a whisper-thin 18K gold band.",
		fullDescription: "The Aarav solitaire is hand-set in our Vadodara atelier with a VS-clarity brilliant round diamond, cradled in a four-prong 18K yellow gold setting engineered for everyday wear.",
		purity: "18K (750)",
		metalColor: "Yellow Gold",
		weight: "3.2 g (approx.)"
	},
	{
		id: "celestia-drop",
		name: "Celestia Drop Earrings",
		metal: "White Gold",
		stone: "Pearl",
		price: 22800,
		mrp: 28e3,
		rating: 4.8,
		reviews: 94,
		emoji: "✨",
		image: prod_celestia_earrings_default,
		bg: "from-[#f7ede0] to-[#eddfc9]",
		category: "Earrings",
		collection: "Pearl Edit",
		tags: [
			"earrings",
			"pearl",
			"white gold",
			"drop earrings",
			"occasion"
		],
		shortDescription: "Freshwater pearl drops on a delicate 18K white gold hook.",
		fullDescription: "Luminous freshwater pearls suspended from a whisper-fine 18K white gold hook — an effortless piece that moves beautifully from day into evening.",
		purity: "18K (750)",
		metalColor: "White Gold",
		weight: "2.6 g (pair)"
	},
	{
		id: "serene-bracelet",
		name: "Serene Diamond Bracelet",
		metal: "Platinum",
		stone: "Diamond",
		price: 67500,
		mrp: 82e3,
		rating: 5,
		reviews: 156,
		stock: 4,
		emoji: "💎",
		image: prod_serene_bracelet_default,
		bg: "from-[#eef2f6] to-[#dde5ec]",
		category: "Bracelets",
		collection: "Diamond Essentials",
		tags: [
			"bracelet",
			"diamond",
			"platinum",
			"tennis",
			"gift"
		],
		shortDescription: "A tennis-inspired platinum line set with F/VS diamonds.",
		fullDescription: "Each stone in the Serene bracelet is prong-set in 950 platinum and matched for colour and clarity, giving a continuous river of brilliance around the wrist.",
		purity: "PT 950",
		metalColor: "Platinum",
		weight: "8.4 g"
	},
	{
		id: "priya-kundan",
		name: "Priya Kundan Necklace",
		metal: "22K Gold",
		stone: "Kundan",
		price: 38900,
		mrp: 48e3,
		rating: 4.9,
		reviews: 312,
		emoji: "📿",
		image: prod_priya_necklace_default,
		bg: "from-[#fbf1d6] to-[#f5e4b4]",
		category: "Necklaces",
		collection: "Bridal Heritage",
		tags: [
			"necklace",
			"kundan",
			"bridal",
			"wedding",
			"traditional"
		],
		shortDescription: "Traditional uncut kundan set in 22K gold, finished with meenakari on the reverse.",
		fullDescription: "The Priya necklace pairs uncut kundan stones with hand-painted meenakari on the reverse — a heritage bridal silhouette crafted in the Jaipur tradition.",
		purity: "22K (916)",
		metalColor: "Yellow Gold",
		weight: "32.5 g"
	},
	{
		id: "luna-crescent",
		name: "Luna Crescent Pendant",
		metal: "14K Gold",
		stone: "Ruby",
		price: 15600,
		mrp: 19800,
		rating: 4.7,
		reviews: 67,
		emoji: "🌙",
		image: prod_luna_pendant_default,
		bg: "from-[#fce8eb] to-[#f6d5dc]",
		category: "Pendants",
		collection: "Everyday Muse",
		tags: [
			"pendant",
			"ruby",
			"rose gold",
			"crescent",
			"gift"
		],
		shortDescription: "A crescent silhouette in 14K rose gold, tipped with a Burmese ruby.",
		fullDescription: "The Luna pendant is a modern take on the crescent motif — cast in 14K rose gold with a single Burmese ruby set at the tip. Includes a matching 45cm rose gold chain.",
		purity: "14K (585)",
		metalColor: "Rose Gold",
		weight: "1.9 g"
	},
	{
		id: "eternal-mangalsutra",
		name: "Eternal Mangalsutra",
		metal: "22K Gold",
		stone: "Diamond",
		price: 54200,
		mrp: 68e3,
		rating: 5,
		reviews: 445,
		emoji: "💛",
		image: prod_mangalsutra_default,
		bg: "from-[#fbedc9] to-[#f2dea3]",
		category: "Mangalsutra",
		collection: "Forever Vows",
		tags: [
			"mangalsutra",
			"diamond",
			"bridal",
			"black beads",
			"daily wear"
		],
		shortDescription: "Twin-vati mangalsutra with a diamond-set pendant and 22K black-bead chain.",
		fullDescription: "A contemporary mangalsutra with two 22K gold vatis and a central diamond cluster, strung on a traditional black-bead chain — a piece designed to be worn every day.",
		purity: "22K (916)",
		metalColor: "Yellow Gold",
		weight: "12.4 g"
	},
	{
		id: "meera-jhumka",
		name: "Meera Jhumka Earrings",
		metal: "22K Gold",
		stone: "Emerald",
		price: 18400,
		mrp: 23500,
		rating: 4.8,
		reviews: 189,
		emoji: "🟢",
		image: prod_jhumka_default,
		bg: "from-[#f5eecd] to-[#ede2ad]",
		category: "Earrings",
		collection: "Temple Treasures",
		tags: [
			"earrings",
			"jhumka",
			"emerald",
			"pearl",
			"traditional"
		],
		shortDescription: "Bell-shaped jhumkas in 22K gold with emerald drops and pearl fringe.",
		fullDescription: "Hand-crafted 22K gold jhumkas with cabochon emeralds and a delicate freshwater pearl fringe — rooted in temple jewellery traditions of southern India.",
		purity: "22K (916)",
		metalColor: "Yellow Gold",
		weight: "9.1 g (pair)"
	},
	{
		id: "royal-polki",
		name: "Royal Polki Choker",
		metal: "22K Gold",
		stone: "Polki",
		price: 92e3,
		mrp: 115e3,
		rating: 4.9,
		reviews: 78,
		emoji: "👑",
		image: prod_polki_choker_default,
		bg: "from-[#f2e0e2] to-[#e4c8cb]",
		category: "Necklaces",
		collection: "Bridal Heritage",
		tags: [
			"choker",
			"polki",
			"kundan",
			"bridal",
			"wedding",
			"pearl"
		],
		shortDescription: "Uncut polki choker in 22K gold, finished with a South Sea pearl fringe.",
		fullDescription: "The Royal Polki choker is set with uncut polki diamonds in 22K gold, closed at the back with an adjustable dori and finished with a South Sea pearl fringe — a statement bridal heirloom.",
		purity: "22K (916)",
		metalColor: "Yellow Gold",
		weight: "48.6 g"
	}
];
var fallbackBySlug = new Map(PRODUCTS.map((product) => [product.id, product]));
var gradientByCategory = {
	Rings: "from-[#faf3e8] to-[#f0e4d1]",
	Earrings: "from-[#f7ede0] to-[#eddfc9]",
	Bracelets: "from-[#eef2f6] to-[#dde5ec]",
	Necklaces: "from-[#fbf1d6] to-[#f5e4b4]",
	Mangalsutra: "from-[#fbedc9] to-[#f2dea3]",
	Pendants: "from-[#fce8eb] to-[#f6d5dc]"
};
var imageUrl = (image) => image?.url || image?.image_url || "";
function productFromDb(product) {
	const fallback = fallbackBySlug.get(product.slug);
	const allImages = (product.images || []).map(imageUrl).filter(Boolean);
	const dbImage = imageUrl(product.main_image) || allImages[0] || "";
	const isKnownProduct = fallbackBySlug.has(product.slug);
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
		purity: product.gold_purity || fallback?.purity,
		metalColor: product.metal_colour || fallback?.metalColor,
		weight: product.gross_weight || fallback?.weight,
		gallery: otherImages.length > 0 ? otherImages : fallback?.gallery,
		view360Images: product.images_360?.map(imageUrl).filter(Boolean) || fallback?.view360Images,
		care: fallback?.care,
		shippingInfo: fallback?.shippingInfo,
		specifications: (product.specifications || []).map((s) => ({
			name: s.name || s.attribute_definition?.name || "",
			value: s.value
		})),
		flags: product.flags || void 0
	};
}
function useStorefrontProducts() {
	const query = useQuery({
		queryKey: [
			"products",
			"published",
			"storefront"
		],
		queryFn: () => productsApi.getPublished({ per_page: 100 }),
		staleTime: 300 * 1e3
	});
	const products = (0, import_react.useMemo)(() => query.data ? query.data.map(productFromDb) : [], [query.data]);
	return {
		...query,
		products
	};
}
function useStorefrontProduct(slug) {
	const query = useQuery({
		queryKey: ["product", slug],
		queryFn: async () => {
			const product = await productsApi.getWithImagesBySlug(slug);
			if (!product || product.status !== "active") return null;
			return productFromDb(product);
		},
		enabled: !!slug,
		staleTime: 300 * 1e3
	});
	return {
		...query,
		product: query.data ?? null
	};
}
function useSearchStorefrontProducts(queryText) {
	const query = useQuery({
		queryKey: [
			"products",
			"search",
			queryText
		],
		queryFn: () => productsApi.search(queryText),
		enabled: queryText.trim().length >= 2,
		staleTime: 120 * 1e3
	});
	const products = (0, import_react.useMemo)(() => query.data ? query.data.map(productFromDb) : [], [query.data, queryText]);
	return {
		...query,
		products
	};
}
function getRecommendedProducts(product, all = PRODUCTS, maxResults = 6) {
	const scored = all.filter((p) => p.id !== product.id).map((p) => {
		let score = 0;
		if (p.category === product.category) score += 50;
		if (p.collection === product.collection) score += 30;
		if (p.metal === product.metal) score += 15;
		if (p.stone === product.stone) score += 10;
		const priceDiff = Math.abs(p.price - product.price);
		if (priceDiff < 1e4) score += 8;
		else if (priceDiff < 25e3) score += 4;
		if (p.flags?.some((f) => f.slug === "best-seller" || f.slug === "trending")) score += 5;
		if (p.tags?.some((t) => product.tags?.includes(t))) score += 12;
		return {
			product: p,
			score
		};
	});
	scored.sort((a, b) => b.score - a.score);
	return scored.slice(0, maxResults).map((s) => s.product);
}
//#endregion
export { useSearchStorefrontProducts as a, productFromDb as i, getRecommendedProducts as n, useStorefrontProduct as o, prod_celestia_earrings_default as r, useStorefrontProducts as s, formatPrice as t };
