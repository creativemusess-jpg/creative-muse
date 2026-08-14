import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as PageShell } from "./PageHeader-DZsnNyor.mjs";
import { t as Route } from "./blog._slug-DGWoAXhK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/blog._slug-Df6_VGTq.js
var import_jsx_runtime = require_jsx_runtime();
var SplitComponent = () => {
	const { slug } = Route.useParams();
	const title = slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "mx-auto max-w-[760px] px-6 py-20",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/blog",
				className: "text-[11px] font-semibold tracking-[0.18em] text-[#7A2533] uppercase",
				children: "← Back to Journal"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display mt-4 text-[40px] leading-tight font-bold text-[#1a1a2e]",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-xs tracking-[0.18em] text-[#7a6e64] uppercase",
				children: "June 28, 2026 · 4 min read"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "my-8 flex aspect-[16/9] items-center justify-center rounded-[28px] bg-gradient-to-br from-[#fdf2e0] to-[#c9a96e] text-[100px]",
				children: "✨"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "prose prose-lg space-y-5 text-[16px] leading-[1.8] text-[#3a3028]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "This is a placeholder article body. In production, your editorial team would compose long-form essays on craftsmanship, gem origin stories, bridal styling and atelier news." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Creative Muse believes content should feel as considered as the jewellery itself — written slowly, illustrated beautifully, and worth saving." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Stay tuned for our next piece, where we sit down with our master goldsmith to talk about the lost art of granulation." })
				]
			})
		]
	}) });
};
//#endregion
export { SplitComponent as component };
