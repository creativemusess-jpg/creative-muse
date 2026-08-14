import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { Ot as ChevronUp } from "../_libs/lucide-react.mjs";
import { n as PageShell } from "./PageHeader-DZsnNyor.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/PolicyPage-B2jlhypK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PolicyPage({ eyebrow, title, lastUpdated, children }) {
	const [showTop, setShowTop] = (0, import_react.useState)(false);
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const el = ref.current;
		if (!el) return;
		const observer = new IntersectionObserver(([entry]) => setShowTop(!entry.isIntersecting), {
			threshold: 0,
			rootMargin: "-200px 0px 0px 0px"
		});
		observer.observe(el);
		return () => observer.disconnect();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PageShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto flex max-w-[1100px] items-start gap-10 px-6 py-12 sm:py-16 lg:py-20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0 flex-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow text-[10px] tracking-[0.18em] uppercase",
						children: eyebrow
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display mt-2 text-3xl font-bold text-[#1a1a2e] sm:text-4xl",
						children: title
					}),
					lastUpdated && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-[#7a6e64]",
						children: ["Last Updated: ", lastUpdated]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref,
				className: "space-y-6 rounded-[28px] bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.05)] sm:p-10",
				children
			})]
		})
	}), showTop && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		onClick: () => window.scrollTo({
			top: 0,
			behavior: "smooth"
		}),
		className: "fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-[#7A2533] text-white shadow-lg transition-colors hover:bg-[#5F1C27]",
		"aria-label": "Back to top",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "h-5 w-5" })
	})] });
}
function PolicySection({ id, title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id,
		className: "scroll-mt-24",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display mb-4 text-xl font-bold text-[#1a1a2e]",
			children: title
		}), children]
	});
}
function PolicySubsection({ id, title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id,
		className: "scroll-mt-24",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "font-display mb-3 text-lg font-semibold text-[#1a1a2e]",
			children: title
		}), children]
	});
}
function PolicyList({ items }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "ml-5 list-disc space-y-1.5 text-[15px] leading-[1.8] text-[#3a3028] marker:text-[#7A2533]",
		children: items.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: item }, i))
	});
}
function PolicyPara({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-[15px] leading-[1.8] text-[#3a3028]",
		children
	});
}
function PolicyContact() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("address", {
		className: "not-italic text-[15px] leading-[1.8] text-[#3a3028]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
				className: "text-[#1a1a2e]",
				children: "Creative Muse"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
			"GF-3/4, Vidhi Square Complex,",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
			"BPC Road, Next to Govardhan Nathji Haveli,",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
			"Laxmi Colony, Anand Nagar, Haripura,",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
			"Vadodara, Gujarat – 390020, India",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Phone:" }),
			" +91 90337 79867",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Email:" }),
			" ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "mailto:support@creativemusee.com",
				className: "text-[#8B1A1A] hover:underline",
				children: "support@creativemusee.com"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Website:" }),
			" ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "https://creativemusee.com",
				target: "_blank",
				rel: "noopener noreferrer",
				className: "text-[#8B1A1A] hover:underline",
				children: "https://creativemusee.com"
			})
		]
	});
}
//#endregion
export { PolicySection as a, PolicyPara as i, PolicyList as n, PolicySubsection as o, PolicyPage as r, PolicyContact as t };
