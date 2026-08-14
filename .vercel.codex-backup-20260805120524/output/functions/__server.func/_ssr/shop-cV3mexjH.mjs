import { o as __toESM } from "../_runtime.mjs";
import { t as productsApi } from "./products-CsgymTpp.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { i as productFromDb } from "./products-6Nbb9Ru-.mjs";
import { v as useNavigate, y as useSearch } from "../_libs/@tanstack/react-router+[...].mjs";
import { S as SlidersHorizontal, r as X } from "../_libs/lucide-react.mjs";
import { n as PageShell, t as PageHeader } from "./PageHeader-DZsnNyor.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { t as ProductCard } from "./ProductCard-7pMWkqop.mjs";
import { n as sortFromUrl, t as SORT_OPTIONS } from "./shop-DVGskW_Z.mjs";
import { t as useCategories } from "./hooks-CBBSJnj0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shop-cV3mexjH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function fmt(n) {
	return "₹" + Math.round(n).toLocaleString("en-IN");
}
function PriceRangeSlider({ min, max, valueMin, valueMax, onChange, step = 100 }) {
	const trackRef = (0, import_react.useRef)(null);
	const [localMin, setLocalMin] = (0, import_react.useState)(valueMin);
	const [localMax, setLocalMax] = (0, import_react.useState)(valueMax);
	const [dragging, setDragging] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		setLocalMin(valueMin);
		setLocalMax(valueMax);
	}, [
		valueMin,
		valueMax,
		min,
		max
	]);
	const clamp = (v, a, b) => Math.min(Math.max(v, a), b);
	const pct = (v) => (v - min) / (max - min) * 100;
	const handlePointer = (0, import_react.useCallback)((clientX) => {
		if (!trackRef.current || !dragging) return;
		const rect = trackRef.current.getBoundingClientRect();
		let ratio = (clientX - rect.left) / rect.width;
		ratio = clamp(ratio, 0, 1);
		let val = Math.round((min + ratio * (max - min)) / step) * step;
		val = clamp(val, min, max);
		if (dragging === "min") {
			const next = Math.min(val, localMax - step);
			setLocalMin(next);
			onChange(next, localMax);
		} else {
			const next = Math.max(val, localMin + step);
			setLocalMax(next);
			onChange(localMin, next);
		}
	}, [
		dragging,
		localMin,
		localMax,
		min,
		max,
		step,
		onChange
	]);
	const onPointerDown = (handle) => (e) => {
		e.preventDefault();
		e.target.setPointerCapture(e.pointerId);
		setDragging(handle);
	};
	(0, import_react.useEffect)(() => {
		if (!dragging) return;
		const onMove = (e) => handlePointer(e.clientX);
		const onUp = () => setDragging(null);
		window.addEventListener("pointermove", onMove);
		window.addEventListener("pointerup", onUp);
		return () => {
			window.removeEventListener("pointermove", onMove);
			window.removeEventListener("pointerup", onUp);
		};
	}, [dragging, handlePointer]);
	const onKeyDown = (handle) => (e) => {
		let delta = 0;
		if (e.key === "ArrowUp" || e.key === "ArrowRight") delta = step;
		else if (e.key === "ArrowDown" || e.key === "ArrowLeft") delta = -step;
		else if (e.key === "PageUp") delta = step * 5;
		else if (e.key === "PageDown") delta = -step * 5;
		else return;
		e.preventDefault();
		if (handle === "min") {
			const next = clamp(localMin + delta, min, localMax - step);
			setLocalMin(next);
			onChange(next, localMax);
		} else {
			const next = clamp(localMax + delta, localMin + step, max);
			setLocalMax(next);
			onChange(localMin, next);
		}
	};
	const pctMin = pct(localMin);
	const pctMax = pct(localMax);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			ref: trackRef,
			className: "relative h-7 w-full select-none touch-none",
			onPointerDown: (e) => {
				if (!trackRef.current || dragging) return;
				const rect = trackRef.current.getBoundingClientRect();
				const ratio = clamp((e.clientX - rect.left) / rect.width, 0, 1);
				const val = Math.round((min + ratio * (max - min)) / step) * step;
				const mid = (localMin + localMax) / 2;
				setDragging(val < mid ? "min" : "max");
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-[rgba(66,29,34,0.12)]" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-[#7A2533]",
					style: {
						left: `${pctMin}%`,
						width: `${pctMax - pctMin}%`
					}
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute top-1/2 z-10 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing items-center justify-center rounded-full bg-white border-2 border-[#7A2533] shadow-[0_2px_8px_rgba(122,37,51,0.2)]",
					style: { left: `${pctMin}%` },
					onPointerDown: onPointerDown("min"),
					tabIndex: 0,
					role: "slider",
					"aria-label": "Minimum price",
					"aria-valuemin": min,
					"aria-valuemax": max,
					"aria-valuenow": localMin,
					"aria-valuetext": fmt(localMin),
					onKeyDown: onKeyDown("min"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-2 w-2 rounded-full bg-[#7A2533]" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute top-1/2 z-10 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing items-center justify-center rounded-full bg-white border-2 border-[#7A2533] shadow-[0_2px_8px_rgba(122,37,51,0.2)]",
					style: { left: `${pctMax}%` },
					onPointerDown: onPointerDown("max"),
					tabIndex: 0,
					role: "slider",
					"aria-label": "Maximum price",
					"aria-valuemin": min,
					"aria-valuemax": max,
					"aria-valuenow": localMax,
					"aria-valuetext": fmt(localMax),
					onKeyDown: onKeyDown("max"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-2 w-2 rounded-full bg-[#7A2533]" })
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-1 items-center rounded-[10px] border border-[rgba(66,29,34,0.18)] bg-[#fffdf9] px-2.5 py-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[11px] font-semibold text-[#7A2533]",
						children: "₹"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						inputMode: "numeric",
						value: localMin,
						onChange: (e) => {
							const v = parseInt(e.target.value.replace(/\D/g, ""), 10) || min;
							const next = clamp(v, min, localMax - step);
							setLocalMin(next);
							onChange(next, localMax);
						},
						className: "w-full bg-transparent px-1 text-[12px] font-medium text-[#7A2533] outline-none",
						"aria-label": "Minimum price"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[11px] text-[rgba(66,29,34,0.4)]",
					children: "—"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-1 items-center rounded-[10px] border border-[rgba(66,29,34,0.18)] bg-[#fffdf9] px-2.5 py-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[11px] font-semibold text-[#7A2533]",
						children: "₹"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						inputMode: "numeric",
						value: localMax,
						onChange: (e) => {
							const v = parseInt(e.target.value.replace(/\D/g, ""), 10) || max;
							const next = clamp(v, localMin + step, max);
							setLocalMax(next);
							onChange(localMin, next);
						},
						className: "w-full bg-transparent px-1 text-[12px] font-medium text-[#7A2533] outline-none",
						"aria-label": "Maximum price"
					})]
				})
			]
		})]
	});
}
var CAT_SLUG_MAP = {
	All: "",
	Earrings: "earrings",
	Necklace: "necklace",
	Rings: "rings",
	Hoops: "hoops",
	Earcuffs: "earcuffs",
	Kada: "kada",
	Bracelets: "bracelets"
};
var knownCategoryNames = new Set(Object.keys(CAT_SLUG_MAP));
function stripEmpty(params) {
	const out = {};
	for (const [k, v] of Object.entries(params)) if (v !== "" && v !== void 0 && v !== null) out[k] = v;
	return out;
}
function safeNum(v) {
	if (typeof v !== "string" || v.trim() === "") return void 0;
	const n = Number(v);
	return Number.isFinite(n) && n >= 0 ? n : void 0;
}
function ShopPage() {
	const navigate = useNavigate();
	const search = useSearch({ from: "/shop" });
	const urlCat = search.category || "";
	const urlMetal = search.metal || "";
	const urlMin = search.minPrice || "";
	const urlMax = search.maxPrice || "";
	const urlSort = sortFromUrl(search.sort || "Featured");
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const [allProducts, setAllProducts] = (0, import_react.useState)([]);
	const [retryTick, setRetryTick] = (0, import_react.useState)(0);
	const selectedCat = urlCat;
	const selectedMetals = (0, import_react.useMemo)(() => urlMetal ? urlMetal.split(",").filter(Boolean) : [], [urlMetal]);
	const sort = urlSort;
	const pushFilters = (0, import_react.useCallback)((overrides) => {
		const next = {
			category: overrides.category ?? urlCat,
			metal: overrides.metal ?? urlMetal,
			minPrice: overrides.minPrice ?? urlMin,
			maxPrice: overrides.maxPrice ?? urlMax,
			sort: overrides.sort ?? urlSort
		};
		navigate({
			to: "/shop",
			search: stripEmpty(next),
			replace: true
		});
	}, [
		navigate,
		urlCat,
		urlMetal,
		urlMin,
		urlMax,
		urlSort
	]);
	const { data: catsData } = useCategories();
	const dbCategories = (0, import_react.useMemo)(() => (catsData || []).filter((c) => knownCategoryNames.has(c.name)), [catsData]);
	(0, import_react.useEffect)(() => {
		const catSlug = selectedCat ? CAT_SLUG_MAP[selectedCat] || selectedCat.toLowerCase() : void 0;
		const abort = new AbortController();
		setLoading(true);
		setError(null);
		(async () => {
			try {
				const prods = await productsApi.getPublished({
					category: catSlug,
					per_page: 100
				});
				if (abort.signal.aborted) return;
				setAllProducts(prods.map(productFromDb));
			} catch (err) {
				if (abort.signal.aborted) return;
				console.error("Shop product fetch error:", err);
				setError(err?.message || "Failed to load products");
			} finally {
				if (!abort.signal.aborted) setLoading(false);
			}
		})();
		return () => abort.abort();
	}, [selectedCat, retryTick]);
	const availableMetals = (0, import_react.useMemo)(() => {
		const set = /* @__PURE__ */ new Set();
		for (const p of allProducts) if (p.metal && p.metal !== "Fine Jewellery") set.add(p.metal);
		return [...set].sort();
	}, [allProducts]);
	const catMinPrice = (0, import_react.useMemo)(() => {
		if (allProducts.length === 0) return 0;
		let min = Infinity;
		for (const p of allProducts) if (p.price > 0 && p.price < min) min = p.price;
		return min === Infinity ? 0 : min;
	}, [allProducts]);
	const catMaxPrice = (0, import_react.useMemo)(() => {
		if (allProducts.length === 0) return 5e4;
		let max = -Infinity;
		for (const p of allProducts) if (p.price > 0 && p.price > max) max = p.price;
		return max === -Infinity ? 5e4 : max;
	}, [allProducts]);
	const filtered = (0, import_react.useMemo)(() => {
		let result = allProducts;
		if (selectedMetals.length > 0) result = result.filter((p) => selectedMetals.includes(p.metal));
		const minP = safeNum(urlMin);
		if (minP !== void 0) result = result.filter((p) => p.price >= minP);
		const maxP = safeNum(urlMax);
		if (maxP !== void 0) result = result.filter((p) => p.price <= maxP);
		return result;
	}, [
		allProducts,
		selectedMetals,
		urlMin,
		urlMax
	]);
	const sorted = (0, import_react.useMemo)(() => {
		return [...filtered].sort((a, b) => {
			if (sort === "Price: Low to High") return a.price - b.price;
			if (sort === "Price: High to Low") return b.price - a.price;
			return 0;
		});
	}, [filtered, sort]);
	const metalCounts = (0, import_react.useMemo)(() => {
		const counts = /* @__PURE__ */ new Map();
		for (const p of allProducts) counts.set(p.metal, (counts.get(p.metal) || 0) + 1);
		return counts;
	}, [allProducts]);
	const hasActiveFilters = selectedMetals.length > 0 || !!urlMin || !!urlMax;
	const clearFilters = () => {
		pushFilters({
			metal: "",
			minPrice: "",
			maxPrice: ""
		});
	};
	const toggleMetal = (m) => {
		const next = selectedMetals.includes(m) ? selectedMetals.filter((x) => x !== m) : [...selectedMetals, m];
		pushFilters({ metal: next.join(",") });
	};
	const onPriceChange = (0, import_react.useCallback)((min, max) => {
		const minStr = min !== catMinPrice ? String(min) : "";
		const maxStr = max !== catMaxPrice ? String(max) : "";
		if (!minStr && !maxStr) pushFilters({
			minPrice: "",
			maxPrice: ""
		});
		else pushFilters({
			minPrice: minStr,
			maxPrice: maxStr
		});
	}, [
		pushFilters,
		catMinPrice,
		catMaxPrice
	]);
	const priceMin = safeNum(urlMin) ?? catMinPrice;
	const priceMax = safeNum(urlMax) ?? catMaxPrice;
	const [mobileOpen, setMobileOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PageShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		eyebrow: "Collection",
		title: selectedCat || "All Jewellery",
		subtitle: "Explore handcrafted pieces, certified and made to be treasured."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "mx-auto max-w-[1280px] px-6 py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-8 lg:grid-cols-[280px_1fr]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between lg:hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setMobileOpen((o) => !o),
						className: "flex items-center gap-2 rounded-full border border-[rgba(66,29,34,0.24)] bg-[#fffdf9] px-4 py-2 text-sm font-semibold text-[#7A2533]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "h-4 w-4" }),
							"Filters",
							hasActiveFilters && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex h-5 w-5 items-center justify-center rounded-full bg-[#7A2533] text-[10px] text-white",
								children: selectedMetals.length + (urlMin || urlMax ? 1 : 0)
							})
						]
					}), hasActiveFilters && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: clearFilters,
						className: "text-[11px] font-semibold text-[#7A2533] uppercase",
						children: "Clear All"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: `rounded-[24px] border border-[#e0d8cc] bg-white p-6 shadow-[0_4px_16px_rgba(0,0,0,0.04)] h-fit ${mobileOpen ? "block" : "hidden lg:block"}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-5 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "h-4 w-4 text-[#7A2533]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-display text-base font-semibold text-[#1a1a2e]",
									children: "Filters"
								})]
							}), hasActiveFilters && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: clearFilters,
								className: "flex items-center gap-1 text-[11px] font-semibold tracking-wide text-[#7A2533] uppercase hover:text-[#7A2533]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" }), "Clear"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "eyebrow mb-3 text-[10px]",
							children: "Category"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-2",
							children: ["All", ...dbCategories.map((c) => c.name)].map((name) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterPill, {
								active: !selectedCat && name === "All" || selectedCat === name,
								onClick: () => {
									setMobileOpen(false);
									pushFilters({
										category: name === "All" ? "" : name,
										metal: "",
										minPrice: "",
										maxPrice: ""
									});
								},
								children: name
							}, name))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "eyebrow mt-6 mb-3 flex items-center justify-between text-[10px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Metal" }), selectedMetals.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => pushFilters({ metal: "" }),
								className: "text-[9px] font-semibold text-[#7a6e64] hover:text-[#7A2533]",
								children: "Clear"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2",
							children: [availableMetals.map((m) => {
								const active = selectedMetals.includes(m);
								const count = metalCounts.get(m) || 0;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => toggleMetal(m),
									className: `rounded-full border px-3 py-1.5 text-[12px] font-medium transition-all ${active ? "border-[#7A2533] bg-[#7A2533] text-white" : "border-[#e0d8cc] bg-white text-[#3a3028] hover:border-[#7A2533] hover:text-[#7A2533]"}`,
									children: [m, count > 0 ? ` (${count})` : ""]
								}, m);
							}), availableMetals.length === 0 && !loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-[#7a6e64]",
								children: "No metals available"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "eyebrow mb-3 flex items-center justify-between text-[10px]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Price Range" }), (urlMin || urlMax) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => pushFilters({
										minPrice: "",
										maxPrice: ""
									}),
									className: "text-[9px] font-semibold text-[#7a6e64] hover:text-[#7A2533]",
									children: "Reset"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriceRangeSlider, {
								min: catMinPrice,
								max: catMaxPrice,
								valueMin: priceMin,
								valueMax: priceMax,
								onChange: onPriceChange
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-6 flex items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-[#7a6e64]",
						children: loading ? "Loading jewellery..." : error ? "" : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							"Showing ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-[#1a1a2e]",
								children: sorted.length
							}),
							" ",
							sorted.length === 1 ? "piece" : "pieces"
						] })
					}), !error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						value: sort,
						onChange: (e) => pushFilters({ sort: e.target.value }),
						className: "w-full appearance-none rounded-full border border-[rgba(66,29,34,0.24)] bg-[#fffdf9] bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%228%22%20viewBox%3D%220%200%2012%208%22%3E%3Cpath%20d%3D%22M1%201.5l5%205%205-5%22%20stroke%3D%22%23421D22%22%20stroke-width%3D%221.5%22%20fill%3D%22none%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px_8px] bg-[right_16px_center] bg-no-repeat px-5 py-2.5 pr-12 text-sm text-[#7A2533] focus:outline-none focus:ring-2 focus:ring-[#7A2533]/30 sm:w-auto",
						children: SORT_OPTIONS.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: o }, o))
					})]
				}), loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-3 sm:gap-7 sm:grid-cols-2 lg:grid-cols-3 items-stretch",
					children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "aspect-square w-full rounded-[8px]" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-3 w-3/4" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-1/2" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-8 w-full rounded-full" })
						]
					}, i))
				}) : error ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-[24px] border border-[#e0d8cc] bg-white px-5 py-16 text-center shadow-[0_4px_16px_rgba(0,0,0,0.04)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl font-semibold text-[#1a1a2e]",
							children: "Unable to load products"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#7a6e64]",
							children: [error, ". Please try again."]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => {
								setError(null);
								setRetryTick((t) => t + 1);
							},
							className: "btn-primary mt-8",
							children: "Retry"
						})
					]
				}) : sorted.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-3 sm:gap-7 sm:grid-cols-2 lg:grid-cols-3 items-stretch",
					children: sorted.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, {
						product: p,
						index: i
					}, p.id))
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-[24px] border border-[#e0d8cc] bg-white px-5 py-16 text-center shadow-[0_4px_16px_rgba(0,0,0,0.04)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl font-semibold text-[#1a1a2e]",
							children: "No products found"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#7a6e64]",
							children: "Try changing the metal or price range."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: clearFilters,
							className: "btn-primary mt-8",
							children: "Clear Filters"
						})
					]
				})] })
			]
		})
	})] });
}
function FilterPill({ children, active, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		onClick,
		className: `rounded-full border px-3 py-1.5 text-[12px] font-medium transition-all ${active ? "border-[#7A2533] bg-[#7A2533] text-white" : "border-[#e0d8cc] bg-white text-[#3a3028] hover:border-[#7A2533] hover:text-[#7A2533]"}`,
		children
	});
}
//#endregion
export { ShopPage as component };
