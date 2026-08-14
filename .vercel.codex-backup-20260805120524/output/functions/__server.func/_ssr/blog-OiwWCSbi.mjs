import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as PageShell, t as PageHeader } from "./PageHeader-DZsnNyor.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/blog-OiwWCSbi.js
var import_jsx_runtime = require_jsx_runtime();
var POSTS = [
	{
		slug: "how-to-care-for-gold",
		title: "How to Care for Your Gold Jewellery",
		excerpt: "Simple rituals to keep your pieces glowing for generations.",
		emoji: "✨",
		bg: "from-[#fdf2e0] to-[#c9a96e]"
	},
	{
		slug: "choosing-bridal-set",
		title: "Choosing the Perfect Bridal Set",
		excerpt: "A bride's guide to building a lifetime collection.",
		emoji: "👑",
		bg: "from-[#fdf0e0] to-[#a87038]"
	},
	{
		slug: "diamond-4cs",
		title: "The 4Cs of Diamonds, Demystified",
		excerpt: "Cut, colour, clarity, carat — what actually matters.",
		emoji: "💎",
		bg: "from-[#f0f4f8] to-[#cdd8e6]"
	},
	{
		slug: "polki-vs-kundan",
		title: "Polki vs Kundan: A Closer Look",
		excerpt: "Two royal traditions, one timeless aesthetic.",
		emoji: "📿",
		bg: "from-[#fdf2e0] to-[#8b1a4a]"
	}
];
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PageShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
	eyebrow: "Journal",
	title: "The Creative Muse Journal",
	subtitle: "Stories, guides and conversations from our atelier."
}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
	className: "mx-auto max-w-[1200px] px-6 py-16",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
		children: POSTS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/blog/$slug",
			params: { slug: p.slug },
			className: "group overflow-hidden rounded-[28px] bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-all duration-400 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `flex aspect-[5/3] items-center justify-center bg-gradient-to-br text-[80px] ${p.bg}`,
				children: p.emoji
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow text-[10px]",
						children: "Journal"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display mt-2 text-lg font-semibold text-[#1a1a2e] transition-colors group-hover:text-[#8B1A1A]",
						children: p.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-[#7a6e64]",
						children: p.excerpt
					})
				]
			})]
		}, p.slug))
	})
})] });
//#endregion
export { SplitComponent as component };
