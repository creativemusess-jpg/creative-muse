import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { i as useWishlistProducts } from "./store-CcwDJcbB.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as PageShell, t as PageHeader } from "./PageHeader-DZsnNyor.mjs";
import { t as ProductCard } from "./ProductCard-7pMWkqop.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/wishlist-CljTel-2.js
var import_jsx_runtime = require_jsx_runtime();
function WishlistPage() {
	const products = useWishlistProducts();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PageShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		eyebrow: "Saved",
		title: "Your Wishlist",
		subtitle: "Pieces you've fallen in love with."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-[1280px] px-6 py-16",
		children: [products.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 gap-3 sm:gap-7 sm:grid-cols-2 lg:grid-cols-4 items-stretch",
			children: products.map((product, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, {
				product,
				index
			}, product.id))
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-[24px] border border-[#e0d8cc] bg-white px-5 py-12 text-center shadow-[0_4px_16px_rgba(0,0,0,0.04)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl font-semibold text-[#1a1a2e]",
				children: "No saved jewellery yet"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#7a6e64]",
				children: "Save pieces from the live catalogue and they will appear here."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-12 text-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/shop",
				className: "btn-secondary",
				children: "Discover More"
			})
		})]
	})] });
}
//#endregion
export { WishlistPage as component };
