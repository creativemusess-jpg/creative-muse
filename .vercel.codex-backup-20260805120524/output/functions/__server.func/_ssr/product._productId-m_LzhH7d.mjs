import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as getRecommendedProducts, o as useStorefrontProduct, s as useStorefrontProducts, t as formatPrice } from "./products-6Nbb9Ru-.mjs";
import { r as useStore } from "./store-CcwDJcbB.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as motion, r as AnimatePresence } from "../_libs/framer-motion.mjs";
import { At as ChevronLeft, P as Plus, at as Heart, kt as ChevronRight, r as X, t as ZoomIn, w as ShoppingBag } from "../_libs/lucide-react.mjs";
import { n as PageShell } from "./PageHeader-DZsnNyor.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { t as ProductCard } from "./ProductCard-7pMWkqop.mjs";
import { t as Route } from "./product._productId-DqaG8Nbw.mjs";
import { n as CarouselContent, r as CarouselItem, t as Carousel } from "./carousel-TvDrHJjy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/product._productId-m_LzhH7d.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProductDetailsPage() {
	const { productId } = Route.useParams();
	const { product, isLoading, error } = useStorefrontProduct(productId);
	(0, import_react.useEffect)(() => {
		window.scrollTo({
			top: 0,
			behavior: "instant"
		});
	}, [productId]);
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto grid max-w-[1180px] gap-8 px-5 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.8fr)] lg:gap-12 lg:py-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "aspect-square w-full rounded-[28px]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 flex gap-1.5 sm:gap-2",
				children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-14 w-14 rounded-[12px] sm:h-16 sm:w-16" }, i))
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0 space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-3 w-24" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-10 w-3/4" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-full" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-8 w-32" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-12 w-full rounded-full" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3 pt-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-40" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-3 w-full" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-3 w-5/6" })
					]
				})
			]
		})]
	}) });
	if (!product) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-[720px] px-6 py-24 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-4xl font-semibold text-[#1a1a2e]",
				children: "Product not found"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-[#7a6e64]",
				children: error ? "Live product data could not be loaded." : "This jewellery piece is no longer available."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/shop",
				className: "btn-primary mt-8 inline-flex",
				children: "Back to Shop"
			})
		]
	}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductContent, { product });
}
var fallbackImg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect fill='%23f5efe8' width='400' height='400'/%3E%3Ctext x='200' y='200' text-anchor='middle' fill='%23c9a96e' font-family='serif' font-size='24'%3ECreative Muse%3C/text%3E%3C/svg%3E";
var safeSrc = (src) => src && src.trim() ? src : fallbackImg;
function ProductContent({ product }) {
	const discount = product.mrp > product.price ? Math.round((product.mrp - product.price) / product.mrp * 100) : 0;
	const { addToCart, toggleWishlist, isWishlisted, openQuickView } = useStore();
	const wishlisted = isWishlisted(product.id);
	const gallery = [product.image, ...product.gallery ?? []];
	const [imgIdx, setImgIdx] = (0, import_react.useState)(0);
	const [zoom, setZoom] = (0, import_react.useState)(false);
	const [accOpen, setAccOpen] = (0, import_react.useState)({ details: true });
	const prev = () => setImgIdx((i) => (i - 1 + gallery.length) % gallery.length);
	const next = () => setImgIdx((i) => (i + 1) % gallery.length);
	const touchStartX = (0, import_react.useRef)(0);
	const thumbRef = (0, import_react.useRef)(null);
	const dragData = (0, import_react.useRef)({
		active: false,
		startX: 0,
		scrollLeft: 0,
		moved: false
	});
	(0, import_react.useEffect)(() => {
		setImgIdx(0);
		setZoom(false);
		setAccOpen({ details: true });
	}, [product.id]);
	(0, import_react.useEffect)(() => {
		if (!zoom) return;
		const handler = (e) => {
			if (e.key === "Escape") setZoom(false);
			if (e.key === "ArrowLeft") setImgIdx((i) => (i - 1 + gallery.length) % gallery.length);
			if (e.key === "ArrowRight") setImgIdx((i) => (i + 1) % gallery.length);
		};
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [zoom, gallery.length]);
	const validUrl = (u) => u && u.trim() ? u : null;
	validUrl(gallery[imgIdx]) || gallery.find((g) => validUrl(g));
	const { products } = useStorefrontProducts();
	const recommended = getRecommendedProducts(product, products, 6);
	const details = [
		["Category", product.category],
		["Collection", product.collection],
		...(product.specifications || []).map((s) => [s.name, s.value])
	];
	const toggleAcc = (key) => setAccOpen((prev) => ({
		...prev,
		[key]: !prev[key]
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PageShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-[1180px] items-center gap-1.5 px-5 pt-6 pb-2 text-[11px] font-semibold tracking-[0.1em] text-[#7A2533] uppercase sm:px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "transition-colors hover:text-[#7A2533]",
					children: "Home"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3 w-3" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/shop",
					className: "transition-colors hover:text-[#7A2533]",
					children: "Shop"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3 w-3" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[#7A2533]",
					children: product.name
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto grid max-w-[1180px] gap-8 px-5 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.8fr)] lg:gap-12 lg:py-12",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative overflow-hidden rounded-[28px] bg-[#fffdf9] border border-[rgba(66,29,34,0.18)] shadow-[0_8px_24px_rgba(66,29,34,0.06)]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: safeSrc(gallery[imgIdx]),
								alt: `${product.name} — view ${imgIdx + 1}`,
								className: "aspect-square h-full w-full object-contain p-8 sm:p-12",
								fetchPriority: "high",
								decoding: "async",
								onError: (e) => {
									const img = e.currentTarget;
									if (img.dataset.fallback) return;
									const next = gallery.find((g) => g !== gallery[imgIdx] && validUrl(g));
									if (next) {
										img.src = next;
										img.dataset.fallback = "1";
									} else {
										img.src = fallbackImg;
										img.dataset.fallback = "1";
									}
								}
							}),
							product.flags?.filter((f) => f.badge_label).slice(0, 1).map((flag) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute left-4 top-4 rounded-full px-2 py-[2px] text-[10px] font-semibold uppercase tracking-[0.14em]",
								style: {
									backgroundColor: flag.badge_bg_color || "#421D22",
									color: flag.badge_text_color || "#ffffff"
								},
								children: flag.badge_label
							}, flag.id)),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": "Zoom",
								onClick: () => setZoom(true),
								className: "absolute right-4 bottom-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-md hover:bg-white",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ZoomIn, { className: "h-4 w-4" })
							})
						]
					}),
					gallery.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						ref: thumbRef,
						className: "scrollbar-hide mt-3 flex gap-1.5 overflow-x-auto scroll-smooth pb-1 sm:gap-2",
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
								setImgIdx(i);
								if (thumbRef.current) thumbRef.current.children[i]?.scrollIntoView({
									behavior: "smooth",
									block: "nearest",
									inline: "center"
								});
							},
							"aria-label": `View image ${i + 1}`,
							className: `flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-[12px] border-2 bg-[#fffdf9] sm:h-16 sm:w-16 ${i === imgIdx ? "border-[#7A2533]" : "border-[rgba(66,29,34,0.18)]"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: safeSrc(src),
								alt: "",
								loading: "lazy",
								decoding: "async",
								className: "h-full w-full object-contain p-1.5"
							})
						}, src + i))
					}),
					gallery.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PassiveWheel, { targetRef: thumbRef })
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow text-[10px]",
						children: product.category
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display mt-3 text-3xl font-semibold leading-tight text-[#1a1a2e] sm:text-4xl",
						children: product.name
					}),
					product.shortDescription && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-5 text-[15px] leading-relaxed text-[#6b5d52]",
						children: product.shortDescription
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex flex-wrap items-baseline gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-3xl font-bold text-[#1a1a2e]",
								children: formatPrice(product.price)
							}),
							discount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-base text-[#7a6e64] line-through",
								children: formatPrice(product.mrp)
							}),
							discount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "rounded-full bg-[#7A2533] px-3 py-1 text-xs font-semibold text-white",
								children: [discount, "% off"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-[13px] font-semibold text-green-700",
						children: "In stock · ships in 3–5 days"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-7 flex flex-col gap-3 sm:flex-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => addToCart(product.id, 1),
							className: "btn-primary flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "h-4 w-4" }), "Add to Cart"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => toggleWishlist(product.id),
							className: `btn-secondary flex items-center justify-center gap-2 text-[#7A2533] ${wishlisted ? "bg-[#7A2533] text-white border-[#7A2533]" : ""}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: `h-4 w-4 ${wishlisted ? "fill-white" : ""}` }), wishlisted ? "Wishlisted" : "Wishlist"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(InfoAccordion, {
								title: "Product Details",
								open: accOpen.details,
								onToggle: () => toggleAcc("details"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-2 gap-x-4 gap-y-2 text-xs",
									children: details.map(([k, v]) => v ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col gap-0.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7A2533]",
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
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoAccordion, {
								title: "Shipping & Returns",
								open: accOpen["shipping"],
								onToggle: () => toggleAcc("shipping"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs leading-relaxed text-[#7a6e64]",
									children: "Complimentary insured shipping across India. 15-day easy returns on unworn pieces in their original packaging."
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoAccordion, {
								title: "Jewellery Care",
								open: accOpen["care"],
								onToggle: () => toggleAcc("care"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs leading-relaxed text-[#7a6e64]",
									children: product.care ?? "Store in the pouch provided. Avoid contact with perfumes, chlorine and abrasives. Wipe gently with a soft cloth after wear."
								})
							})
						]
					})
				]
			})]
		}),
		recommended.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-[1180px] px-5 pb-16 sm:px-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-center text-2xl font-semibold text-[#7A2533] sm:text-3xl",
				children: "Recommended For You"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Carousel, {
					opts: {
						align: "start",
						dragFree: true
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CarouselContent, {
						className: "-ml-3 md:-ml-4",
						children: recommended.slice(0, 6).map((rec, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CarouselItem, {
							className: "basis-[48%] pl-3 sm:basis-[45%] md:basis-1/3 md:pl-4 lg:basis-1/4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, {
								product: rec,
								index: i
							})
						}, rec.id))
					})
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: zoom && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
			initial: { opacity: 0 },
			animate: { opacity: 1 },
			exit: { opacity: 0 },
			transition: { duration: .2 },
			className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 md:p-8",
			onClick: () => setZoom(false),
			onTouchStart: (e) => {
				touchStartX.current = e.touches[0].clientX;
			},
			onTouchEnd: (e) => {
				const dx = e.changedTouches[0].clientX - touchStartX.current;
				if (Math.abs(dx) > 50) (dx < 0 ? next : prev)();
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
						imgIdx + 1,
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
					src: safeSrc(gallery[imgIdx]),
					alt: `${product.name} — view ${imgIdx + 1}`,
					className: "max-h-[90vh] max-w-[90vw] select-none object-contain",
					onClick: (e) => e.stopPropagation(),
					draggable: false,
					decoding: "async"
				}, imgIdx),
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
	] });
}
function InfoAccordion({ title, children, open, onToggle }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-[16px] border border-[#e0d8cc] bg-white",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: onToggle,
			className: "flex w-full items-center justify-between px-4 py-3.5 text-left",
			"aria-expanded": open,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[12px] font-semibold tracking-[0.14em] text-[#7A2533] uppercase",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: `h-3.5 w-3.5 text-[#7A2533] transition-transform duration-300 ${open ? "rotate-45" : ""}` })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `overflow-hidden transition-[max-height] duration-300 ease-in-out ${open ? "max-h-[600px]" : "max-h-0"}`,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-4 pb-4",
				children
			})
		})]
	});
}
function PassiveWheel({ targetRef }) {
	(0, import_react.useEffect)(() => {
		const el = targetRef.current;
		if (!el) return;
		const handler = (e) => {
			if (!e.deltaY) return;
			e.preventDefault();
			el.scrollLeft += e.deltaY;
		};
		el.addEventListener("wheel", handler, { passive: false });
		return () => el.removeEventListener("wheel", handler);
	}, [targetRef]);
	return null;
}
//#endregion
export { ProductDetailsPage as component };
