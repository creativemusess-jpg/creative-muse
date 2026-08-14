import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { s as useStorefrontProducts, t as formatPrice } from "./products-6Nbb9Ru-.mjs";
import { i as useWishlistProducts, n as useCartLines, r as useStore } from "./store-CcwDJcbB.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as motion, r as AnimatePresence } from "../_libs/framer-motion.mjs";
import { At as ChevronLeft, B as Package, E as ShieldCheck, H as Minus, P as Plus, _ as Trash2, at as Heart, j as RotateCcw, kt as ChevronRight, p as Truck, r as X, t as ZoomIn, w as ShoppingBag } from "../_libs/lucide-react.mjs";
import { t as productLink } from "./product-link-CZ0ghSx1.mjs";
import { t as giftPackagingApi } from "./gift-packaging-B57zKQ8f.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Overlays-BQJl1dzv.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Overlays() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartDrawer, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WishlistDrawer, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickViewModal, {})
	] });
}
function CartDrawer() {
	const { cartOpen, closeCart, setQty, removeFromCart, cartSubtotal, giftPackagingEnabled, setGiftPackagingEnabled, giftMessage, setGiftMessage } = useStore();
	const lines = useCartLines();
	const [giftCfg, setGiftCfg] = (0, import_react.useState)(null);
	const [estDelivery, setEstDelivery] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		giftPackagingApi.getConfig().then(setGiftCfg);
		giftPackagingApi.getEstimatedDelivery().then(setEstDelivery);
	}, []);
	const shipping = cartSubtotal > 5e3 || cartSubtotal === 0 ? 0 : 250;
	const giftPrice = giftPackagingEnabled && giftCfg?.enabled ? giftCfg?.price || 0 : 0;
	const total = cartSubtotal + shipping + giftPrice;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: cartOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
		className: "fixed inset-0 z-[80]",
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		exit: { opacity: 0 },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-0 bg-black/50 backdrop-blur-sm",
			onClick: closeCart
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.aside, {
			initial: { x: "100%" },
			animate: { x: 0 },
			exit: { x: "100%" },
			transition: {
				type: "tween",
				duration: .35,
				ease: [
					.32,
					.72,
					0,
					1
				]
			},
			className: "absolute top-0 right-0 flex h-full w-full max-w-[440px] flex-col bg-[#fdf8f3] shadow-[-24px_0_60px_rgba(0,0,0,0.2)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex items-center justify-between border-b border-[#e0d8cc] px-6 py-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow text-[10px]",
						children: "Bag"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "font-display text-xl font-semibold text-[#1a1a2e]",
						children: [
							"Your Cart (",
							lines.length,
							")"
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: closeCart,
						"aria-label": "Close cart",
						className: "flex h-10 w-10 items-center justify-center rounded-full hover:bg-[#f5efe8]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex-1 overflow-y-auto px-6 py-5",
					children: lines.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "h-8 w-8 text-[#7A2533]" }),
						title: "Your cart is empty",
						copy: "Start adding pieces to see them here.",
						cta: "Browse Collections",
						onCta: closeCart
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-4",
							children: lines.map(({ product: p, qty }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex gap-4 rounded-[20px] bg-white p-3 shadow-[0_2px_12px_rgba(0,0,0,0.04)]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex aspect-square w-20 shrink-0 items-center justify-center overflow-hidden rounded-[14px] bg-[#fffdf9] border border-[rgba(66,29,34,0.18)] shadow-[0_8px_24px_rgba(66,29,34,0.06)]",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: p.image,
										alt: p.name,
										loading: "lazy",
										decoding: "async",
										className: "h-full w-full object-contain p-2"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "eyebrow text-[9px]",
											children: p.metal
										}),
										productLink(p) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: productLink(p).to,
											params: productLink(p).params,
											className: "font-display truncate text-sm font-semibold text-[#1a1a2e] transition-colors hover:text-[#7A2533]",
											children: p.name
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-display truncate text-sm font-semibold text-[#1a1a2e]",
											children: p.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-0.5 text-sm font-bold text-[#1a1a2e]",
											children: formatPrice(p.price)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-2 flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-1 rounded-full border border-[#e0d8cc] p-0.5",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														onClick: () => setQty(p.id, qty - 1),
														"aria-label": "Decrease",
														className: "flex h-7 w-7 items-center justify-center rounded-full hover:bg-[#f5efe8]",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "h-3 w-3" })
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "min-w-5 text-center text-xs font-semibold",
														children: qty
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														onClick: () => setQty(p.id, qty + 1),
														"aria-label": "Increase",
														className: "flex h-7 w-7 items-center justify-center rounded-full hover:bg-[#f5efe8]",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3 w-3" })
													})
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => removeFromCart(p.id),
												"aria-label": "Remove",
												className: "ml-auto flex h-8 w-8 items-center justify-center rounded-full text-[#7a6e64] hover:bg-red-50 hover:text-red-500",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
											})]
										})
									]
								})]
							}, p.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5 rounded-[12px] border border-[#e0d8cc] bg-white p-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-4 w-4 shrink-0 text-[#7A2533]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] font-semibold text-[#1a1a2e]",
										children: "Free Shipping"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[9px] text-[#7a6e64]",
										children: "Free delivery across India."
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5 rounded-[12px] border border-[#e0d8cc] bg-white p-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-4 w-4 shrink-0 text-[#7A2533]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] font-semibold text-[#1a1a2e]",
										children: "7-Day Easy Returns"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[9px] text-[#7a6e64]",
										children: "Easy return & exchange policy."
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5 rounded-[12px] border border-[#e0d8cc] bg-white p-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4 shrink-0 text-[#7A2533]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] font-semibold text-[#1a1a2e]",
										children: "Secure Checkout"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[9px] text-[#7a6e64]",
										children: "100% secure payments with Razorpay."
									})] })]
								})
							]
						}),
						giftCfg?.enabled && giftCfg?.status === "active" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 rounded-[16px] border border-[#e0d8cc] bg-white p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "mt-0.5 h-5 w-5 shrink-0 text-[#7A2533]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[13px] font-semibold text-[#1a1a2e]",
											children: giftCfg.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-0.5 text-[11px] text-[#7a6e64]",
											children: giftCfg.description
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-[13px] font-bold text-[#7A2533]",
											children: formatPrice(giftCfg.price)
										})
									] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									role: "switch",
									"aria-checked": giftPackagingEnabled,
									onClick: () => setGiftPackagingEnabled(!giftPackagingEnabled),
									className: `relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${giftPackagingEnabled ? "bg-[#7A2533]" : "bg-gray-200"}`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `pointer-events-none inline-block h-4 w-4 translate-y-0 rounded-full bg-white shadow transition-transform ${giftPackagingEnabled ? "translate-x-4" : "translate-x-0"}` })
								})]
							}), giftPackagingEnabled && giftCfg.allow_gift_message && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 border-t border-[#e0d8cc]/60 pt-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-[11px] font-semibold text-[#1a1a2e]",
										children: "Gift Message"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										value: giftMessage,
										onChange: (e) => {
											if (e.target.value.length <= giftCfg.max_message_length) setGiftMessage(e.target.value);
										},
										placeholder: "Happy Birthday!",
										rows: 2,
										maxLength: giftCfg.max_message_length,
										className: "mt-1.5 w-full rounded-[10px] border border-[#e0d8cc] bg-[#fdf8f3] px-3 py-2 text-[12px] outline-none focus:border-[#7A2533] resize-none"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1 text-right text-[9px] text-[#7a6e64]",
										children: [
											giftMessage.length,
											"/",
											giftCfg.max_message_length
										]
									})
								]
							})]
						}),
						estDelivery?.enabled && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex items-center gap-2.5 rounded-[12px] border border-[#e0d8cc] bg-white p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-4 w-4 shrink-0 text-[#7A2533]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[11px] text-[#1a1a2e]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold",
										children: "Estimated Delivery:"
									}),
									" Ships in ",
									estDelivery.min_days,
									"–",
									estDelivery.max_days,
									" Business Days"
								]
							})]
						})
					] })
				}),
				lines.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
					className: "border-t border-[#e0d8cc] bg-white px-6 py-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "Subtotal",
									value: formatPrice(cartSubtotal)
								}),
								giftPrice > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: giftCfg?.name || "Gift Packaging",
									value: formatPrice(giftPrice)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "Shipping",
									value: shipping === 0 ? "Free" : formatPrice(shipping)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "my-2 border-t border-dashed border-[#e0d8cc]" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "Total",
									value: formatPrice(total),
									bold: true
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/cart",
							onClick: closeCart,
							className: "btn-primary mt-5 flex w-full justify-center",
							children: "Checkout"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: closeCart,
							className: "mt-2 w-full text-center text-[11px] font-semibold tracking-[0.14em] text-[#7a6e64] uppercase hover:text-[#1a1a2e]",
							children: "← Continue Shopping"
						})
					]
				})
			]
		})]
	}) });
}
function WishlistDrawer() {
	const { wishlistOpen, closeWishlist, toggleWishlist, addToCart } = useStore();
	const items = useWishlistProducts();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: wishlistOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
		className: "fixed inset-0 z-[80]",
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		exit: { opacity: 0 },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-0 bg-black/50 backdrop-blur-sm",
			onClick: closeWishlist
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.aside, {
			initial: { x: "100%" },
			animate: { x: 0 },
			exit: { x: "100%" },
			transition: {
				type: "tween",
				duration: .35,
				ease: [
					.32,
					.72,
					0,
					1
				]
			},
			className: "absolute top-0 right-0 flex h-full w-full max-w-[440px] flex-col bg-[#fdf8f3] shadow-[-24px_0_60px_rgba(0,0,0,0.2)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center justify-between border-b border-[#e0d8cc] px-6 py-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "eyebrow text-[10px]",
					children: "Saved"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
					className: "font-display text-xl font-semibold text-[#1a1a2e]",
					children: [
						"Your Wishlist (",
						items.length,
						")"
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: closeWishlist,
					"aria-label": "Close wishlist",
					className: "flex h-10 w-10 items-center justify-center rounded-full hover:bg-[#f5efe8]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1 overflow-y-auto px-6 py-5",
				children: items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "h-8 w-8 text-[#7A2533]" }),
					title: "No favourites yet",
					copy: "Tap the heart on any piece to save it here.",
					cta: "Browse Collections",
					onCta: closeWishlist
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-4",
					children: items.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex gap-4 rounded-[20px] bg-white p-3 shadow-[0_2px_12px_rgba(0,0,0,0.04)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex aspect-square w-20 shrink-0 items-center justify-center overflow-hidden rounded-[14px] bg-[#fffdf9] border border-[rgba(66,29,34,0.18)] shadow-[0_8px_24px_rgba(66,29,34,0.06)]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: p.image,
								alt: p.name,
								loading: "lazy",
								decoding: "async",
								className: "h-full w-full object-contain p-2"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "eyebrow text-[9px]",
									children: p.metal
								}),
								productLink(p) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: productLink(p).to,
									params: productLink(p).params,
									className: "font-display truncate text-sm font-semibold text-[#1a1a2e] transition-colors hover:text-[#7A2533]",
									children: p.name
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display truncate text-sm font-semibold text-[#1a1a2e]",
									children: p.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-0.5 text-sm font-bold text-[#1a1a2e]",
									children: formatPrice(p.price)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => {
											addToCart(p.id, 1);
											toggleWishlist(p.id);
											closeWishlist();
										},
										className: "rounded-full bg-[#7A2533] px-3 py-1.5 text-[10px] font-semibold tracking-[0.1em] text-white uppercase hover:bg-[#5F1C27]",
										children: "Move to Cart"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => toggleWishlist(p.id),
										"aria-label": "Remove",
										className: "ml-auto flex h-8 w-8 items-center justify-center rounded-full text-[#7a6e64] hover:bg-red-50 hover:text-red-500",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
									})]
								})
							]
						})]
					}, p.id))
				})
			})]
		})]
	}) });
}
function QuickViewModal() {
	const { quickViewId, closeQuickView, addToCart, toggleWishlist, isWishlisted } = useStore();
	const { products } = useStorefrontProducts();
	const product = products.find((p) => p.id === quickViewId) ?? null;
	const containerRef = (0, import_react.useRef)(null);
	const triggerRef = (0, import_react.useRef)(null);
	const [zoomActive, setZoomActive] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (product) triggerRef.current = document.activeElement;
	}, [product]);
	(0, import_react.useEffect)(() => {
		if (!product) return;
		const onKey = (e) => {
			if (e.key === "Escape") {
				closeQuickView();
				return;
			}
			if (e.key === "Tab" && containerRef.current) {
				const focusable = containerRef.current.querySelectorAll("button, [href], input, select, textarea, [tabindex]:not([tabindex=\"-1\"])");
				if (focusable.length === 0) return;
				const first = focusable[0];
				const last = focusable[focusable.length - 1];
				if (e.shiftKey && document.activeElement === first) {
					e.preventDefault();
					last.focus();
				} else if (!e.shiftKey && document.activeElement === last) {
					e.preventDefault();
					first.focus();
				}
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [product, closeQuickView]);
	(0, import_react.useEffect)(() => {
		if (product && containerRef.current) containerRef.current.querySelector("button, [href], input, select, textarea, [tabindex]:not([tabindex=\"-1\"])")?.focus();
	}, [product]);
	(0, import_react.useEffect)(() => {
		if (!product && triggerRef.current) {
			triggerRef.current.focus();
			triggerRef.current = null;
		}
	}, [product]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: product && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		exit: { opacity: 0 },
		className: "fixed inset-0 z-[90] flex items-center justify-center p-2 sm:p-4",
		role: "dialog",
		"aria-modal": "true",
		"aria-labelledby": "qv-title",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-0 bg-black/60 backdrop-blur-md",
			onClick: closeQuickView
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
			ref: containerRef,
			initial: {
				scale: .96,
				opacity: 0,
				y: 16
			},
			animate: {
				scale: 1,
				opacity: 1,
				y: 0
			},
			exit: {
				scale: .96,
				opacity: 0,
				y: 16
			},
			transition: {
				duration: .3,
				ease: [
					.25,
					.1,
					.25,
					1
				]
			},
			className: "relative grid max-h-[88vh] w-full max-w-5xl grid-cols-1 overflow-y-auto scrollbar-thin rounded-[28px] bg-[#fdf8f3] shadow-[0_24px_64px_rgba(0,0,0,0.3)] md:max-h-none md:h-[90vh] md:grid-cols-2 md:grid-rows-[1fr] md:overflow-hidden",
			children: [
				!zoomActive && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					"aria-label": "Close",
					onClick: closeQuickView,
					className: "absolute top-3 right-3 z-30 flex h-9 w-9 items-center justify-center rounded-full border border-[#7A2533] bg-white shadow-md transition-colors hover:bg-white md:top-4 md:right-4 md:h-10 md:w-10",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "md:sticky md:top-0 md:min-w-0 md:self-start",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickViewMedia, {
						product,
						onZoomChange: setZoomActive
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "scrollbar-thin overflow-y-auto overscroll-contain md:min-w-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickViewInfo, {
						product,
						onAdd: (qty) => {
							addToCart(product.id, qty);
							closeQuickView();
						},
						onWishlist: () => toggleWishlist(product.id),
						wishlisted: isWishlisted(product.id),
						onClose: closeQuickView
					})
				})
			]
		}, product.id)]
	}) });
}
function QuickViewMedia({ product, onZoomChange }) {
	const gallery = [product.image, ...product.gallery ?? []];
	const [idx, setIdx] = (0, import_react.useState)(0);
	const [zoom, setZoom] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		onZoomChange?.(zoom);
	}, [zoom, onZoomChange]);
	(0, import_react.useEffect)(() => {
		setIdx(0);
		setZoom(false);
	}, [product.id]);
	const prev = () => setIdx((i) => (i - 1 + gallery.length) % gallery.length);
	const next = () => setIdx((i) => (i + 1) % gallery.length);
	const touchX = (0, import_react.useRef)(null);
	const onTouchStart = (e) => {
		touchX.current = e.touches[0].clientX;
	};
	const onTouchEnd = (e) => {
		if (touchX.current == null) return;
		const dx = e.changedTouches[0].clientX - touchX.current;
		if (Math.abs(dx) > 40) (dx < 0 ? next : prev)();
		touchX.current = null;
	};
	(0, import_react.useEffect)(() => {
		const handler = (e) => {
			if (e.key === "Escape") setZoom(false);
			if (e.key === "ArrowLeft") setIdx((i) => (i - 1 + gallery.length) % gallery.length);
			if (e.key === "ArrowRight") setIdx((i) => (i + 1) % gallery.length);
		};
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [gallery.length]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-3 p-4 md:p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-[20px] bg-[#fffdf9] border border-[rgba(66,29,34,0.18)] shadow-[0_8px_24px_rgba(66,29,34,0.06)]",
				onTouchStart,
				onTouchEnd,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: gallery[idx],
						alt: `${product.name} — view ${idx + 1}`,
						onClick: () => setZoom(true),
						className: "h-full w-full cursor-zoom-in object-contain p-6 transition-opacity duration-300",
						loading: "eager",
						decoding: "async"
					}, gallery[idx]),
					gallery.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-label": "Previous image",
							onClick: prev,
							className: "absolute top-1/2 left-3 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-md hover:bg-white",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-label": "Next image",
							onClick: next,
							className: "absolute top-1/2 right-3 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-md hover:bg-white",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-semibold tracking-wider text-white",
							children: [
								idx + 1,
								" / ",
								gallery.length
							]
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": "Zoom",
						onClick: () => setZoom(true),
						className: "absolute top-3 left-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-md hover:bg-white md:left-auto md:right-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ZoomIn, { className: "h-4 w-4" })
					})
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Thumbnails, {
				gallery,
				idx,
				setIdx
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: zoom && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
				initial: { opacity: 0 },
				animate: { opacity: 1 },
				exit: { opacity: 0 },
				transition: { duration: .2 },
				className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 md:p-8",
				onClick: () => setZoom(false),
				onTouchStart: (e) => {
					touchX.current = e.touches[0].clientX;
				},
				onTouchEnd: (e) => {
					if (touchX.current == null) return;
					const dx = e.changedTouches[0].clientX - touchX.current;
					if (Math.abs(dx) > 50) (dx < 0 ? next : prev)();
					touchX.current = null;
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": "Close gallery",
						onClick: () => setZoom(false),
						className: "absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/20",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
					}),
					gallery.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "absolute top-5 left-1/2 z-10 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold tracking-wider text-white backdrop-blur-sm",
						children: [
							idx + 1,
							" / ",
							gallery.length
						]
					}),
					gallery.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": "Previous image",
						onClick: (e) => {
							e.stopPropagation();
							prev();
						},
						className: "absolute top-1/2 left-3 z-10 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/20",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-6 w-6" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: gallery[idx],
						alt: `${product.name} — view ${idx + 1}`,
						className: "max-h-[90vh] max-w-[90vw] select-none object-contain",
						onClick: (e) => e.stopPropagation(),
						draggable: false
					}, idx),
					gallery.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": "Next image",
						onClick: (e) => {
							e.stopPropagation();
							next();
						},
						className: "absolute top-1/2 right-3 z-10 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/20",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-6 w-6" })
					})
				]
			}) })
		]
	});
}
function Thumbnails({ gallery, idx, setIdx }) {
	const thumbRef = (0, import_react.useRef)(null);
	const dragData = (0, import_react.useRef)({
		active: false,
		startX: 0,
		scrollLeft: 0,
		moved: false
	});
	(0, import_react.useEffect)(() => {
		const el = thumbRef.current;
		if (!el) return;
		const handler = (e) => {
			if (!e.deltaY) return;
			e.preventDefault();
			el.scrollLeft += e.deltaY;
		};
		el.addEventListener("wheel", handler, { passive: false });
		return () => el.removeEventListener("wheel", handler);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: thumbRef,
		className: "scrollbar-hide flex gap-1.5 overflow-x-auto scroll-smooth pb-1 sm:gap-2",
		onPointerDown: (e) => {
			const dd = dragData.current;
			dd.active = true;
			dd.startX = e.clientX;
			dd.scrollLeft = e.currentTarget.scrollLeft;
			dd.moved = false;
		},
		onPointerMove: (e) => {
			const dd = dragData.current;
			if (!dd.active) return;
			const dx = e.clientX - dd.startX;
			if (Math.abs(dx) > 4) dd.moved = true;
			e.currentTarget.scrollLeft = dd.scrollLeft - dx;
		},
		onPointerUp: () => {
			dragData.current.active = false;
		},
		onPointerLeave: () => {
			dragData.current.active = false;
		},
		children: gallery.map((src, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => {
				if (dragData.current.moved) return;
				setIdx(i);
				if (thumbRef.current) thumbRef.current.children[i]?.scrollIntoView({
					behavior: "smooth",
					block: "nearest",
					inline: "center"
				});
			},
			"aria-label": `View image ${i + 1}`,
			className: `flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-[12px] border-2 bg-[#fffdf9] sm:h-16 sm:w-16 ${i === idx ? "border-[#7A2533]" : "border-[rgba(66,29,34,0.18)]"}`,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src,
				alt: "",
				loading: "lazy",
				decoding: "async",
				className: "h-full w-full object-contain p-1.5"
			})
		}, src + i))
	});
}
function QuickViewInfo({ product, onAdd, onWishlist, wishlisted, onClose }) {
	const [qty, setQty] = (0, import_react.useState)(1);
	const discount = product.mrp > product.price ? Math.round((product.mrp - product.price) / product.mrp * 100) : 0;
	(0, import_react.useEffect)(() => setQty(1), [product.id]);
	const details = [["Category", product.category], ...(product.specifications || []).map((s) => [s.name, s.value])];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col p-6 pr-5 md:p-8 md:pr-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [product.flags?.filter((f) => f.badge_label).slice(0, 2).map((flag) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rounded-full px-2 py-[2px] text-[9px] font-semibold tracking-[0.12em] uppercase",
					style: {
						backgroundColor: flag.badge_bg_color || "#1a1a2e",
						color: flag.badge_text_color || "#ffffff"
					},
					children: flag.badge_label
				}, flag.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "eyebrow text-[10px]",
					children: product.category
				})]
			}),
			productLink(product) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: productLink(product).to,
				params: productLink(product).params,
				className: "font-display mt-2 text-2xl leading-tight font-semibold text-[#1a1a2e] transition-colors hover:text-[#7A2533]",
				children: product.name
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				id: "qv-title",
				className: "font-display mt-2 text-2xl leading-tight font-semibold text-[#1a1a2e]",
				children: product.name
			}),
			product.shortDescription && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm leading-relaxed text-[#7a6e64]",
				children: product.shortDescription
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex items-baseline gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-2xl font-bold text-[#1a1a2e]",
						children: formatPrice(product.price)
					}),
					discount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm text-[#7a6e64] line-through",
						children: formatPrice(product.mrp)
					}),
					discount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "rounded-full bg-[#7A2533] px-2 py-0.5 text-[10px] font-bold text-white",
						children: [
							"-",
							discount,
							"%"
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1.5 text-[12px] font-semibold text-green-700",
				children: "In stock · ships in 3–5 days"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 flex items-center gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1 rounded-full border border-[#e0d8cc] p-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setQty(Math.max(1, qty - 1)),
								"aria-label": "Decrease",
								className: "flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#f5efe8]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "h-3.5 w-3.5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "min-w-6 text-center text-sm font-semibold",
								children: qty
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setQty(qty + 1),
								"aria-label": "Increase",
								className: "flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#f5efe8]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => onAdd(qty),
						className: "btn-primary flex-1",
						children: "Add to Cart"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onWishlist,
						"aria-label": "Toggle wishlist",
						className: `flex h-11 w-11 items-center justify-center rounded-full border transition-colors ${wishlisted ? "border-[#7A2533] bg-[#7A2533] text-white" : "border-[#e0d8cc] text-[#7a6e64] hover:border-[#7A2533] hover:text-[#7A2533]"}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: `h-4 w-4 ${wishlisted ? "fill-white" : ""}` })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: productLink(product)?.to ?? "/product/$productId",
				params: productLink(product)?.params ?? { productId: product.id },
				className: "mt-5 flex items-center justify-center gap-1.5 text-[11px] font-semibold tracking-[0.16em] text-[#7A2533] transition-colors hover:text-[#7A2533] uppercase",
				onClick: onClose,
				children: ["View Full Details", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3.5 w-3.5" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Accordion, {
						title: "Product Details",
						defaultOpen: true,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
							className: "grid grid-cols-2 gap-x-4 gap-y-2 text-xs",
							children: details.map(([k, v]) => v ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-[10px] tracking-[0.12em] text-[#7a6e64] uppercase",
									children: k
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "text-[#7A2533]",
									children: v
								})]
							}, k) : null)
						}), product.fullDescription && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-xs leading-relaxed text-[#7a6e64]",
							children: product.fullDescription
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Accordion, {
						title: "Shipping & Returns",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs leading-relaxed text-[#7a6e64]",
							children: product.shippingInfo ?? "Complimentary insured shipping across India. 15-day easy returns on unworn pieces in their original packaging."
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Accordion, {
						title: "Jewellery Care",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs leading-relaxed text-[#7a6e64]",
							children: product.care ?? "Store in the pouch provided. Avoid contact with perfumes, chlorine and abrasives. Wipe gently with a soft cloth after wear."
						})
					})
				]
			})
		]
	});
}
function Accordion({ title, children, defaultOpen = false }) {
	const [open, setOpen] = (0, import_react.useState)(defaultOpen);
	const contentRef = (0, import_react.useRef)(null);
	const [height, setHeight] = (0, import_react.useState)(defaultOpen ? "auto" : "0px");
	(0, import_react.useEffect)(() => {
		if (contentRef.current) setHeight(open ? `${contentRef.current.scrollHeight}px` : "0px");
	}, [open]);
	const handleTransitionEnd = () => {
		if (open && contentRef.current) setHeight("auto");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-[14px] border border-[#e0d8cc] bg-white",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => setOpen((o) => !o),
			className: "flex w-full items-center justify-between px-4 py-3 text-left",
			"aria-expanded": open,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[11px] font-semibold tracking-[0.14em] text-[#7A2533] uppercase",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: `h-3.5 w-3.5 text-[#7A2533] transition-transform duration-300 ${open ? "rotate-45" : ""}` })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref: contentRef,
			style: { maxHeight: height },
			onTransitionEnd: handleTransitionEnd,
			className: "overflow-hidden transition-[max-height] duration-300 ease-in-out",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-4 pb-4",
				children
			})
		})]
	});
}
function EmptyState({ icon, title, copy, cta, onCta }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center py-14 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-[0_4px_16px_rgba(122,37,51,0.15)]",
				children: icon
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display mt-4 text-lg font-semibold text-[#1a1a2e]",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 max-w-xs text-sm text-[#7a6e64]",
				children: copy
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/shop",
				onClick: onCta,
				className: "btn-primary mt-6",
				children: cta
			})
		]
	});
}
function Row({ label, value, bold }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `flex items-center justify-between ${bold ? "font-display text-base font-semibold text-[#1a1a2e]" : "text-[#7a6e64]"}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: bold ? "" : "text-[#1a1a2e]",
			children: value
		})]
	});
}
//#endregion
export { Overlays };
