import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as formatPrice } from "./products-6Nbb9Ru-.mjs";
import { r as useStore } from "./store-CcwDJcbB.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as motion, t as useReducedMotion } from "../_libs/framer-motion.mjs";
import { at as Heart, pt as Eye, w as ShoppingBag } from "../_libs/lucide-react.mjs";
import { t as productLink } from "./product-link-CZ0ghSx1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ProductCard-7pMWkqop.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ProductCard = (0, import_react.memo)(function ProductCard({ product, index = 0, pointerStart }) {
	const discount = product.mrp > product.price ? Math.round((product.mrp - product.price) / product.mrp * 100) : 0;
	const { addToCart, toggleWishlist, isWishlisted, openQuickView } = useStore();
	const wishlisted = isWishlisted(product.id);
	const internalPointer = (0, import_react.useRef)({
		x: 0,
		y: 0
	});
	const ps = pointerStart ?? internalPointer;
	const prefersReduced = useReducedMotion();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
		initial: prefersReduced ? {} : {
			opacity: 0,
			y: 24
		},
		whileInView: prefersReduced ? {} : {
			opacity: 1,
			y: 0
		},
		viewport: {
			once: true,
			margin: "-50px"
		},
		transition: {
			duration: .5,
			delay: index % 4 * .06
		},
		whileHover: prefersReduced ? {} : { y: -8 },
		className: "group relative z-0 flex h-full min-h-[286px] flex-col rounded-[16px] bg-white transition-shadow duration-400 sm:min-h-[382px] md:min-h-[410px] md:rounded-[18px] hover:z-20 hover:md:shadow-[0_12px_34px_rgba(0,0,0,0.08)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			role: "button",
			tabIndex: 0,
			onClick: (e) => {
				const dx = Math.abs(e.clientX - ps.current.x);
				const dy = Math.abs(e.clientY - ps.current.y);
				if (dx > 8 || dy > 8) return;
				openQuickView(product.id);
			},
			onPointerDown: (e) => {
				ps.current = {
					x: e.clientX,
					y: e.clientY
				};
			},
			onKeyDown: (event) => {
				if (event.key === "Enter" || event.key === " ") {
					event.preventDefault();
					openQuickView(product.id);
				}
			},
			className: "relative block shrink-0 text-left",
			"aria-label": `Quick view ${product.name}`,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-[16px] bg-white group-hover:overflow-visible md:rounded-[18px]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: product.image,
						alt: product.name,
						loading: "lazy",
						decoding: "async",
						width: 1024,
						height: 1024,
						className: "h-full max-h-full w-full max-w-full object-contain rounded-[16px] md:rounded-[18px] transition-transform duration-700 group-hover:scale-[1.02]",
						onError: (e) => {
							const t = e.currentTarget;
							if (t.dataset.fallback) {
								t.style.display = "none";
								return;
							}
							t.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect fill='white' width='400' height='400'/%3E%3C/svg%3E";
							t.dataset.fallback = "1";
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: (e) => {
							e.stopPropagation();
							e.preventDefault();
							toggleWishlist(product.id);
						},
						"aria-label": "Wishlist",
						className: `group/wishlist absolute top-1.5 right-1.5 flex h-7 w-7 items-center justify-center rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all duration-300 md:h-8 md:w-8 ${wishlisted ? "bg-[#7A2533] text-white" : "bg-white text-[#7A2533] border border-[rgba(122,37,51,0.24)] hover:bg-[#7A2533] hover:text-white"}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: `h-3 w-3 transition-colors md:h-4 md:w-4 ${wishlisted ? "fill-white text-white" : "text-[#7A2533] group-hover/wishlist:text-white"}` })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute right-1.5 bottom-1.5 opacity-100 transition-all duration-400 md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex h-7 w-7 items-center justify-center rounded-full border border-[rgba(122,37,51,0.15)] bg-white text-[#7A2533] shadow-sm md:h-auto md:w-auto md:rounded-full md:border md:border-[rgba(122,37,51,0.15)] md:bg-white md:px-3.5 md:py-2 md:text-[10px] md:font-semibold md:tracking-[0.14em] md:uppercase",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3 w-3 md:hidden" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden md:inline",
								children: "Quick View"
							})]
						})
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-1 flex-col px-2 pt-2 pb-2.5 md:px-3 md:pt-3 md:pb-3.5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-1 flex min-h-[16px] flex-wrap items-center gap-1 md:mb-1.5 md:min-h-[18px]",
					children: product.flags?.filter((f) => f.badge_label).slice(0, 2).map((flag) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "inline-flex h-[14px] max-w-full items-center rounded-full px-1.5 text-[6px] leading-none font-semibold tracking-[0.05em] whitespace-nowrap uppercase md:h-[17px] md:px-2 md:text-[8px] md:tracking-[0.08em]",
						style: {
							backgroundColor: flag.badge_bg_color || "#1a1a2e",
							color: flag.badge_text_color || "#ffffff"
						},
						children: flag.badge_label
					}, flag.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "min-h-[13px] truncate text-[9px] tracking-[0.08em] text-[#7a6e64] uppercase md:min-h-[16px] md:text-[10px] md:tracking-[0.1em]",
					children: [
						product.metal,
						" · ",
						product.stone
					]
				}),
				productLink(product) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: productLink(product).to,
					params: productLink(product).params,
					className: "font-display mt-1 line-clamp-2 min-h-[2.35em] text-[12px] leading-snug font-semibold text-[#1a1a2e] transition-colors hover:text-[#7A2533] md:mt-1.5 md:min-h-[36px] md:text-[14px]",
					children: product.name
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display mt-1 line-clamp-2 min-h-[2.35em] text-[12px] leading-snug font-semibold text-[#1a1a2e] md:mt-1.5 md:min-h-[36px] md:text-[14px]",
					children: product.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-1.5 flex flex-wrap items-baseline gap-x-1.5 gap-y-1 md:mt-2 md:gap-x-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[14px] font-bold text-[#1a1a2e] md:text-[17px]",
							children: formatPrice(product.price)
						}),
						discount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[9px] text-[#7a6e64] line-through md:text-[12px]",
							children: formatPrice(product.mrp)
						}),
						discount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex h-[15px] items-center rounded-full bg-[#7A2533] px-1.5 text-[7px] leading-none font-bold tracking-wide whitespace-nowrap text-white md:h-[18px] md:px-2 md:text-[9px]",
							children: [
								"-",
								discount,
								"%"
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "min-h-[6px] md:min-h-[12px]" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => addToCart(product.id, 1),
					className: "mt-auto flex min-h-[34px] w-full items-center justify-center gap-1.5 rounded-[8px] bg-[#7A2533] text-[10px] font-semibold tracking-[0.07em] text-white uppercase transition-all duration-300 md:min-h-[42px] md:gap-2 md:rounded-full md:text-[12px] md:tracking-[0.12em] hover:md:shadow-[0_12px_32px_rgba(122,37,51,0.4)] hover:md:bg-[#5F1C27]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "h-3 w-3 md:h-3.5 md:w-3.5" }), "Add to Cart"]
				})
			]
		})]
	});
});
//#endregion
export { ProductCard as t };
