import { a as prod_priya_necklace_default, i as prod_polki_choker_default, n as prod_jhumka_default, o as prod_serene_bracelet_default, r as prod_luna_pendant_default, t as prod_aarav_ring_default } from "./prod-polki-choker-BJbhItn6.mjs";
import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { _ as Link, f as useMatchRoute, p as Outlet } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as PageShell, t as PageHeader } from "./PageHeader-DZsnNyor.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/collections-De0RzZ6d.js
var import_jsx_runtime = require_jsx_runtime();
var COLLECTIONS = [
	{
		slug: "bridal",
		name: "Bridal Edit",
		image: prod_polki_choker_default
	},
	{
		slug: "solitaires",
		name: "Solitaire Story",
		image: prod_aarav_ring_default
	},
	{
		slug: "everyday",
		name: "Everyday Elegance",
		image: prod_luna_pendant_default
	},
	{
		slug: "festive",
		name: "Festive Heirlooms",
		image: prod_priya_necklace_default
	},
	{
		slug: "men",
		name: "For Him",
		image: prod_serene_bracelet_default
	},
	{
		slug: "gifting",
		name: "The Gift Edit",
		image: prod_jhumka_default
	}
];
var COLORS = [
	"from-[#8b1a4a] to-[#e8c0a0]",
	"from-[#cdd8e6] to-[#f0f4f8]",
	"from-[#e8c98a] to-[#f5e8d0]",
	"from-[#c9a96e] to-[#f0d8a8]",
	"from-[#7a7a7a] to-[#d0d0d0]",
	"from-[#a85040] to-[#f0c8b0]"
];
function CollectionsIndex() {
	if (!useMatchRoute()({
		to: "/collections",
		fuzzy: false
	})) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PageShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		eyebrow: "Edits",
		title: "Our Curated Collections",
		subtitle: "Discover handpicked jewellery stories — from everyday classics to bridal masterpieces."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "mx-auto max-w-[1280px] px-6 py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
			children: COLLECTIONS.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/shop",
				className: "group relative aspect-[4/5] overflow-hidden rounded-[28px] shadow-[0_8px_32px_rgba(0,0,0,0.12)] transition-all duration-400 hover:-translate-y-2 hover:shadow-[0_24px_64px_rgba(0,0,0,0.2)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `absolute inset-0 bg-gradient-to-br ${COLORS[i]}` }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: c.image,
						alt: `${c.name} jewellery collection`,
						className: "absolute inset-0 h-full w-full object-contain p-8 transition-transform duration-700 group-hover:scale-110",
						onError: (e) => {
							const t = e.currentTarget;
							if (!t.dataset.fallback) {
								t.style.display = "none";
								t.dataset.fallback = "1";
							}
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute right-6 bottom-6 left-6 text-white",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-2xl font-semibold",
							children: c.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 inline-flex text-[11px] font-semibold tracking-[0.18em] uppercase",
							children: "Explore →"
						})]
					})
				]
			}, c.slug))
		})
	})] });
}
//#endregion
export { CollectionsIndex as component };
