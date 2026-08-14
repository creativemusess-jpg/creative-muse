import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { a as useSearchStorefrontProducts, s as useStorefrontProducts } from "./products-6Nbb9Ru-.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { S as SlidersHorizontal } from "../_libs/lucide-react.mjs";
import { n as PageShell, t as PageHeader } from "./PageHeader-DZsnNyor.mjs";
import { t as ProductCard } from "./ProductCard-7pMWkqop.mjs";
import { t as Route } from "./search-CnLK2ELT.mjs";
import { t as useCategories } from "./hooks-CBBSJnj0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/search-BPLTd84d.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PRICE_FILTERS = [
	"All",
	"Under Rs.20K",
	"Rs.20K-50K",
	"Rs.50K-1L",
	"Above Rs.1L"
];
function SearchPage() {
	const { q } = Route.useSearch();
	const query = q.trim();
	const [category, setCategory] = (0, import_react.useState)("All");
	const [metal, setMetal] = (0, import_react.useState)("All");
	const [price, setPrice] = (0, import_react.useState)("All");
	const [sort, setSort] = (0, import_react.useState)("Relevance");
	const { data: dbCategories = [] } = useCategories();
	const liveProducts = useStorefrontProducts();
	const liveSearch = useSearchStorefrontProducts(query);
	const baseResults = query ? liveSearch.products : liveProducts.products;
	const loading = query ? liveSearch.isFetching : liveProducts.isFetching;
	const metals = (0, import_react.useMemo)(() => ["All", ...Array.from(new Set(liveProducts.products.map((product) => product.metal))).sort()], [liveProducts.products]);
	const filtered = (0, import_react.useMemo)(() => {
		return baseResults.filter((product) => category === "All" || product.category === category).filter((product) => metal === "All" || product.metal === metal || product.metalColor === metal).filter((product) => {
			if (price === "Under Rs.20K") return product.price < 2e4;
			if (price === "Rs.20K-50K") return product.price >= 2e4 && product.price <= 5e4;
			if (price === "Rs.50K-1L") return product.price > 5e4 && product.price <= 1e5;
			if (price === "Above Rs.1L") return product.price > 1e5;
			return true;
		});
	}, [
		baseResults,
		category,
		metal,
		price
	]);
	const sorted = (0, import_react.useMemo)(() => {
		return [...filtered].sort((a, b) => {
			if (sort === "Price: Low to High") return a.price - b.price;
			if (sort === "Price: High to Low") return b.price - a.price;
			return 0;
		});
	}, [filtered, sort]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PageShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		eyebrow: "Search",
		title: query ? `Search results for "${query}"` : "Search jewellery",
		subtitle: loading ? "Searching live catalogue..." : `${sorted.length} ${sorted.length === 1 ? "piece" : "pieces"} found`
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "mx-auto max-w-[1280px] px-5 py-12 sm:px-6 lg:py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-8 lg:grid-cols-[260px_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "h-fit rounded-[24px] border border-[#e0d8cc] bg-white p-5 shadow-[0_4px_16px_rgba(0,0,0,0.04)] sm:p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-5 flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "h-4 w-4 text-[#7A2533]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-base font-semibold text-[#1a1a2e]",
							children: "Filters"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FilterGroup, {
						title: "Category",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterPill, {
							active: category === "All",
							onClick: () => setCategory("All"),
							children: "All"
						}), dbCategories.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterPill, {
							active: category === item.name,
							onClick: () => setCategory(item.name),
							children: item.name
						}, item.id))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterGroup, {
						title: "Metal",
						children: metals.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterPill, {
							active: metal === item,
							onClick: () => setMetal(item),
							children: item
						}, item))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterGroup, {
						title: "Price",
						children: PRICE_FILTERS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterPill, {
							active: price === item,
							onClick: () => setPrice(item),
							children: item
						}, item))
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-[#7a6e64]",
						children: [
							"Showing ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-[#1a1a2e]",
								children: sorted.length
							}),
							" of",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-[#1a1a2e]",
								children: baseResults.length
							}),
							" matching pieces"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: sort,
						onChange: (event) => setSort(event.target.value),
						className: "w-full appearance-none rounded-full border border-[rgba(66,29,34,0.24)] bg-[#fffdf9] bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%228%22%20viewBox%3D%220%200%2012%208%22%3E%3Cpath%20d%3D%22M1%201.5l5%205%205-5%22%20stroke%3D%22%23421D22%22%20stroke-width%3D%221.5%22%20fill%3D%22none%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px_8px] bg-[right_16px_center] bg-no-repeat px-5 py-2.5 pr-12 text-sm text-[#7A2533] focus:outline-none focus:ring-2 focus:ring-[#7A2533]/30 sm:w-auto",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Relevance" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Price: Low to High" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Price: High to Low" })
						]
					})]
				}), sorted.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-3 sm:gap-7 sm:grid-cols-2 xl:grid-cols-3 items-stretch",
					children: sorted.map((product, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, {
						product,
						index
					}, product.id))
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-[24px] border border-[#e0d8cc] bg-white px-5 py-12 text-center shadow-[0_4px_16px_rgba(0,0,0,0.04)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "font-display text-2xl font-semibold text-[#1a1a2e]",
							children: [
								"No jewellery found for \"",
								query || "your search",
								"\""
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#7a6e64]",
							children: "Try a collection, product type, gemstone, metal or one of these popular options."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex flex-wrap justify-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickLink, {
									label: "Browse Rings",
									q: "Rings"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickLink, {
									label: "Browse Earrings",
									q: "Earrings"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/shop",
									className: "btn-secondary",
									children: "View All Jewellery"
								})
							]
						})
					]
				})]
			})]
		})
	})] });
}
function FilterGroup({ title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-6 first:mt-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "eyebrow mb-3 text-[10px]",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-wrap gap-2",
			children
		})]
	});
}
function FilterPill({ children, active, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: `rounded-full border px-3 py-1.5 text-[12px] font-medium transition-all ${active ? "border-[#7A2533] bg-[#7A2533] text-white" : "border-[#e0d8cc] bg-white text-[#3a3028] hover:border-[#8B1A1A] hover:text-[#8B1A1A]"}`,
		children
	});
}
function QuickLink({ label, q }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/search",
		search: { q },
		className: "btn-secondary",
		children: label
	});
}
//#endregion
export { SearchPage as component };
