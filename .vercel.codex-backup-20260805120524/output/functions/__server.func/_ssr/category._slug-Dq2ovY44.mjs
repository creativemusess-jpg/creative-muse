import { t as categoriesApi } from "./categories-DdAkdsQw.mjs";
import { t as productsApi } from "./products-CsgymTpp.mjs";
import { i as require_jsx_runtime, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { i as productFromDb } from "./products-6Nbb9Ru-.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { kt as ChevronRight, rt as House } from "../_libs/lucide-react.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { t as Route } from "./category._slug-Cw-meDFL.mjs";
import { t as ProductCard } from "./ProductCard-7pMWkqop.mjs";
import { a as cat_necklaces_default, c as cat_wedding_default, i as cat_mangalsutra_default, n as cat_bracelets_default, o as cat_pendants_default, r as cat_earrings_default, s as cat_rings_default, t as cat_bangles_default } from "./cat-wedding-CI_GswDG.mjs";
import { t as CategoryHero } from "./CategoryHero-YYdzww7K.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/category._slug-Dq2ovY44.js
var import_jsx_runtime = require_jsx_runtime();
var CATEGORY_IMAGES = {
	Rings: cat_rings_default,
	Necklaces: cat_necklaces_default,
	Earrings: cat_earrings_default,
	Bracelets: cat_bracelets_default,
	Mangalsutra: cat_mangalsutra_default,
	Pendants: cat_pendants_default,
	Bangles: cat_bangles_default,
	"Wedding Sets": cat_wedding_default
};
function CategoryPage() {
	const { slug } = Route.useParams();
	const { data: category, isLoading: catLoading } = useQuery({
		queryKey: ["category", slug],
		queryFn: () => categoriesApi.getBySlug(slug),
		staleTime: 300 * 1e3
	});
	const { data: products = [], isLoading: prodsLoading } = useQuery({
		queryKey: [
			"products",
			"by-category",
			slug
		],
		queryFn: () => productsApi.getPublishedByCategorySlug(slug).then((r) => r.map(productFromDb)),
		enabled: !!category,
		staleTime: 300 * 1e3
	});
	if (catLoading || !!category && prodsLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-[#fdf8f3] pt-32 pb-20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto max-w-[1280px] px-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-3 sm:gap-7 md:grid-cols-3 lg:grid-cols-4 items-stretch",
				children: Array.from({ length: 8 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "aspect-square w-full rounded-[8px]" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-3 w-3/4" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-1/2" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-8 w-full rounded-full" })
					]
				}, i))
			})
		})
	});
	if (!category) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-[#fdf8f3] pt-32 pb-20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-[1280px] px-6 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-semibold text-[#1a1a2e]",
					children: "Category not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-gray-500",
					children: "The category you're looking for doesn't exist."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/shop",
					className: "btn-primary mt-6 inline-flex",
					children: "Browse Products"
				})
			]
		})
	});
	const catImage = category.imageUrl || CATEGORY_IMAGES[category.name] || null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-[#fdf8f3] pt-24 pb-20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-[1280px] px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "flex items-center gap-2 py-4 text-xs text-gray-400",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							className: "hover:text-[#7A2533]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { className: "h-3.5 w-3.5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3 w-3" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/shop",
							className: "hover:text-[#7A2533]",
							children: "Shop"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3 w-3" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[#7A2533]",
							children: category.name
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryHero, { category: {
					...category,
					image: category.image || catImage
				} }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					id: "products",
					className: "mb-10 flex flex-col items-center text-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-xs tracking-wider text-[#7A2533] uppercase",
						children: [
							products.length,
							" ",
							products.length === 1 ? "product" : "products"
						]
					})
				}),
				products.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-3 sm:gap-7 md:grid-cols-3 lg:grid-cols-4 items-stretch",
					children: products.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.id))
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center justify-center py-20 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
							className: "mb-4 h-16 w-16 text-gray-300",
							fill: "none",
							viewBox: "0 0 24 24",
							stroke: "currentColor",
							strokeWidth: 1,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								strokeLinecap: "round",
								strokeLinejoin: "round",
								d: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-lg font-medium text-gray-400",
							children: [
								"No products have been added to ",
								category.name,
								" yet."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/shop",
							className: "mt-6 rounded-lg bg-[#7A2533] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#5F1C27]",
							children: "Browse All Products"
						})
					]
				})
			]
		})
	});
}
//#endregion
export { CategoryPage as component };
