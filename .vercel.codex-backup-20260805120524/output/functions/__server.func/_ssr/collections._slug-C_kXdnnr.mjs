import { t as categoriesApi } from "./categories-DdAkdsQw.mjs";
import { t as productsApi } from "./products-CsgymTpp.mjs";
import { i as require_jsx_runtime, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { i as productFromDb } from "./products-6Nbb9Ru-.mjs";
import { _ as Link, b as useParams } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as PageShell } from "./PageHeader-DZsnNyor.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { t as subcategoriesApi } from "./subcategories-BivcEg6G.mjs";
import { t as ProductCard } from "./ProductCard-7pMWkqop.mjs";
import { t as CategoryHero } from "./CategoryHero-YYdzww7K.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/collections._slug-C_kXdnnr.js
var import_jsx_runtime = require_jsx_runtime();
function CategoryCollectionPage() {
	const { slug } = useParams({ from: "/collections/$slug" });
	const { data: category, isLoading: catLoading } = useQuery({
		queryKey: [
			"collection",
			"category",
			slug
		],
		queryFn: () => categoriesApi.getBySlug(slug),
		staleTime: 300 * 1e3
	});
	const { data: products = [], isLoading: prodsLoading } = useQuery({
		queryKey: [
			"products",
			"collection",
			slug
		],
		queryFn: () => productsApi.getPublished({ category: slug }).then((r) => r.map(productFromDb)),
		enabled: !!category,
		staleTime: 300 * 1e3
	});
	const { data: subcategories = [] } = useQuery({
		queryKey: [
			"subcategories",
			"by-category",
			category?.id
		],
		queryFn: () => subcategoriesApi.listByCategory(category.id, true),
		enabled: !!category,
		staleTime: 300 * 1e3
	});
	if (catLoading || !!category && prodsLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-[1280px] px-6 py-20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 items-stretch",
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
	}) });
	if (!category) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-[1280px] px-6 py-20 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-bold text-gray-800",
			children: "Category not found"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/shop",
			className: "mt-4 inline-block text-[#7A2533] hover:underline",
			children: "Browse all products"
		})]
	}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PageShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryHero, { category }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		id: "products",
		className: "mx-auto max-w-[1440px] px-4 py-8 lg:px-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "mb-4 text-xs text-gray-400",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "hover:text-[#7A2533]",
						children: "Home"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mx-2",
						children: "/"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-gray-600",
						children: category.name
					})
				]
			}),
			subcategories.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-8 flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: `.`,
					className: "rounded-full bg-[#7A2533] px-4 py-1.5 text-xs font-semibold text-white",
					children: "All"
				}), subcategories.map((sub) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: `/collections/${slug}/${sub.slug}`,
					className: "rounded-full border border-gray-200 px-4 py-1.5 text-xs font-semibold text-gray-600 hover:border-[#7A2533] hover:text-[#7A2533]",
					children: sub.name
				}, sub.id))]
			}),
			products.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "py-16 text-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-gray-400",
					children: "No products found in this collection."
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 items-stretch",
				children: products.map((product) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product }, product.id))
			})
		]
	})] });
}
//#endregion
export { CategoryCollectionPage as component };
