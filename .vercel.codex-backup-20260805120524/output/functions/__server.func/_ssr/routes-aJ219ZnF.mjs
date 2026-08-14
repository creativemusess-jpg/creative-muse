import { o as __toESM } from "../_runtime.mjs";
import { n as newsletterApi } from "./newsletter-ChNp_czQ.mjs";
import { i as prod_polki_choker_default, t as prod_aarav_ring_default } from "./prod-polki-choker-BJbhItn6.mjs";
import { t as productsApi } from "./products-CsgymTpp.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { r as prod_celestia_earrings_default, s as useStorefrontProducts } from "./products-6Nbb9Ru-.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as motion, r as AnimatePresence, t as useReducedMotion } from "../_libs/framer-motion.mjs";
import { Bt as ArrowRight, E as ShieldCheck, F as Play, I as Phone, K as MapPin, P as Plus, Rt as Award, T as Shield, Vt as ArrowLeft, Z as Leaf, _t as Droplets, a as VolumeX, at as Heart, bt as Diamond, c as Users, et as Instagram, j as RotateCcw, lt as Gem, o as Volume2, p as Truck, x as Sparkles } from "../_libs/lucide-react.mjs";
import { t as reelsApi } from "./reels-BV7NCtSb.mjs";
import { t as ProductCard } from "./ProductCard-7pMWkqop.mjs";
import { a as cat_necklaces_default, c as cat_wedding_default, i as cat_mangalsutra_default, n as cat_bracelets_default, o as cat_pendants_default, r as cat_earrings_default, s as cat_rings_default, t as cat_bangles_default } from "./cat-wedding-CI_GswDG.mjs";
import { n as CarouselContent, r as CarouselItem, t as Carousel } from "./carousel-TvDrHJjy.mjs";
import { t as hero_ring_default } from "./hero-ring-FP2R-HfP.mjs";
import { n as useContentSection, t as useCategories } from "./hooks-CBBSJnj0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-aJ219ZnF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ShoppableReelCard({ reel, product }) {
	const videoRef = (0, import_react.useRef)(null);
	const cardRef = (0, import_react.useRef)(null);
	const [muted, setMuted] = (0, import_react.useState)(true);
	const [intersecting, setIntersecting] = (0, import_react.useState)(false);
	const toggleMute = (e) => {
		e.stopPropagation();
		e.preventDefault();
		setMuted((m) => !m);
	};
	(0, import_react.useEffect)(() => {
		const el = videoRef.current;
		if (!el) return;
		if (intersecting) {
			const playPromise = el.play();
			if (playPromise) playPromise.catch(() => {});
		} else el.pause();
	}, [intersecting]);
	(0, import_react.useEffect)(() => {
		const el = videoRef.current;
		if (!el) return;
		el.muted = muted;
	}, [muted]);
	(0, import_react.useEffect)(() => {
		const el = videoRef.current;
		if (!el) return;
		const handleVisibility = () => {
			if (document.hidden) el.pause();
			else if (intersecting) {
				const playPromise = el.play();
				if (playPromise) playPromise.catch(() => {});
			}
		};
		document.addEventListener("visibilitychange", handleVisibility);
		return () => document.removeEventListener("visibilitychange", handleVisibility);
	}, [intersecting]);
	(0, import_react.useEffect)(() => {
		const node = cardRef.current;
		if (!node) return;
		const observer = new IntersectionObserver(([entry]) => {
			setIntersecting(entry.isIntersecting);
		}, { threshold: .6 });
		observer.observe(node);
		return () => observer.disconnect();
	}, []);
	const hasProduct = product && product.id;
	const productPath = hasProduct ? "/product/$productId" : void 0;
	const productParams = hasProduct ? { productId: product.id } : void 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: cardRef,
		className: "group w-full snap-start shrink-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative overflow-hidden rounded-t-[20px] bg-[#f5efe8]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
				ref: videoRef,
				src: reel.video_url,
				poster: reel.poster_url || void 0,
				muted: true,
				loop: true,
				playsInline: true,
				preload: "metadata",
				"aria-label": reel.alt_text || "Shoppable reel",
				className: "aspect-[9/16] w-full object-cover",
				children: reel.alt_text || "Jewellery reel video"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: toggleMute,
				"aria-label": muted ? "Unmute reel" : "Mute reel",
				className: "absolute right-3 bottom-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60",
				children: muted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "h-4 w-4" })
			})]
		}), hasProduct ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: productPath,
			params: productParams,
			className: "flex items-center gap-3 rounded-b-[20px] border border-t-0 border-[#e0d8cc] bg-white px-4 py-[18px] transition-colors hover:bg-[#fdf8f3]",
			"aria-label": `View ${product.name}`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex h-[52px] w-[52px] shrink-0 items-center justify-center overflow-hidden rounded-[12px] bg-[#f5efe8]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: product.image,
					alt: product.name,
					className: "h-full w-full object-contain p-1.5",
					loading: "lazy",
					decoding: "async"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-display line-clamp-2 text-sm font-semibold text-[#1a1a2e]",
				children: product.name
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-b-[20px] border border-t-0 border-[#e0d8cc] bg-white px-4 py-[18px] text-sm text-[#7a6e64]",
			children: "Product unavailable"
		})]
	});
}
var SAMPLE_VIDEO = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";
var SPEED_SECONDS = 1.8;
var INACTIVITY_RESUME_SECONDS = 1.5;
function SectionHeading$1({ eyebrow, title, subtitle }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto mb-8 max-w-2xl text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "eyebrow",
				children: eyebrow
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display mt-2 text-[clamp(22px,6vw,36px)] leading-tight font-semibold whitespace-nowrap text-[#1a1a2e]",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 flex justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "gold-divider" })
			}),
			subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-[14px] text-[#7a6e64] sm:text-[15px]",
				children: subtitle
			})
		]
	});
}
function ShoppableReelsSection() {
	const { products } = useStorefrontProducts();
	const [api, setApi] = (0, import_react.useState)();
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [reels, setReels] = (0, import_react.useState)([]);
	const intervalRef = (0, import_react.useRef)(null);
	const inactivityRef = (0, import_react.useRef)(null);
	const sectionRef = (0, import_react.useRef)(null);
	const pointerStart = (0, import_react.useRef)({
		x: 0,
		y: 0
	});
	const canAuto = !(typeof window !== "undefined" ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false) && reels.length > 1;
	const stopAutoScroll = (0, import_react.useCallback)(() => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
	}, []);
	const clearInactivity = (0, import_react.useCallback)(() => {
		if (inactivityRef.current) {
			clearTimeout(inactivityRef.current);
			inactivityRef.current = null;
		}
	}, []);
	const startAutoScroll = (0, import_react.useCallback)(() => {
		if (!api || !canAuto) return;
		stopAutoScroll();
		intervalRef.current = setInterval(() => {
			api.scrollNext();
		}, SPEED_SECONDS * 1e3);
	}, [
		api,
		canAuto,
		stopAutoScroll
	]);
	const pauseAutoScroll = (0, import_react.useCallback)(() => {
		stopAutoScroll();
		clearInactivity();
	}, [stopAutoScroll, clearInactivity]);
	const resumeAutoScroll = (0, import_react.useCallback)(() => {
		if (canAuto) startAutoScroll();
	}, [canAuto, startAutoScroll]);
	const handlePointerDown = (0, import_react.useCallback)(() => {
		pauseAutoScroll();
	}, [pauseAutoScroll]);
	const handlePointerUp = (0, import_react.useCallback)(() => {
		clearInactivity();
		inactivityRef.current = setTimeout(() => {
			resumeAutoScroll();
		}, INACTIVITY_RESUME_SECONDS * 1e3);
	}, [clearInactivity, resumeAutoScroll]);
	(0, import_react.useEffect)(() => {
		if (!api || !canAuto) return;
		const onSettle = () => startAutoScroll();
		startAutoScroll();
		api.on("settle", onSettle);
		return () => {
			stopAutoScroll();
			api.off("settle", onSettle);
		};
	}, [
		api,
		canAuto,
		startAutoScroll,
		stopAutoScroll
	]);
	(0, import_react.useEffect)(() => {
		const handleVisibility = () => {
			if (document.hidden) pauseAutoScroll();
			else resumeAutoScroll();
		};
		document.addEventListener("visibilitychange", handleVisibility);
		return () => document.removeEventListener("visibilitychange", handleVisibility);
	}, [pauseAutoScroll, resumeAutoScroll]);
	(0, import_react.useEffect)(() => {
		return () => {
			stopAutoScroll();
			clearInactivity();
		};
	}, [stopAutoScroll, clearInactivity]);
	const { data: activeReels } = useQuery({
		queryKey: ["reels", "active"],
		queryFn: () => reelsApi.listActive(),
		staleTime: 300 * 1e3
	});
	(0, import_react.useEffect)(() => {
		if (!activeReels) return;
		let cancelled = false;
		(async () => {
			try {
				const productIds = activeReels.map((r) => r.product_id).filter(Boolean);
				let dbProducts = [];
				if (productIds.length > 0) {
					const { data } = await productsApi.list({ per_page: 100 });
					dbProducts = data || [];
				}
				if (cancelled) return;
				const enriched = activeReels.map((reel) => {
					const product = dbProducts.find((p) => p.id === reel.product_id && p.status === "active");
					const mapped = product ? {
						id: product.id,
						name: product.name,
						image: product.main_image?.url || product.images?.[0]?.url || "",
						slug: product.slug
					} : null;
					return mapped ? {
						reel,
						product: mapped
					} : null;
				}).filter(Boolean);
				if (enriched.length > 0) {
					if (!cancelled) {
						setReels(enriched);
						setLoading(false);
					}
					return;
				}
			} catch (err) {
				console.warn("DB reels unavailable, using fallback:", err);
			}
			if (cancelled) return;
			const fallbackReels = products.slice(0, 8).map((p, i) => ({
				reel: {
					id: `fallback-${p.id}`,
					video_url: SAMPLE_VIDEO,
					poster_url: p.image,
					product_id: p.id,
					sort_order: i,
					is_active: true,
					alt_text: `${p.name} — shoppable reel`,
					created_at: (/* @__PURE__ */ new Date()).toISOString(),
					updated_at: (/* @__PURE__ */ new Date()).toISOString()
				},
				product: {
					id: p.id,
					name: p.name,
					image: p.image,
					slug: p.id
				}
			}));
			if (!cancelled) {
				setReels(fallbackReels);
				setLoading(fallbackReels.length === 0);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [activeReels, products]);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "bg-[#fdf8f3] py-12 sm:py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-[1280px] px-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading$1, {
				eyebrow: "Shop the Look",
				title: "As Seen on Instagram"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-5 overflow-hidden",
				children: [
					1,
					2,
					3,
					4
				].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 shrink-0 basis-[84%] sm:basis-[46%] lg:basis-1/4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "aspect-[9/16] animate-pulse rounded-t-[20px] bg-[#e0d8cc]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex animate-pulse items-center gap-3 rounded-b-[20px] border border-t-0 border-[#e0d8cc] bg-white px-4 py-[18px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-[52px] w-[52px] rounded-[12px] bg-[#e0d8cc]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 flex-1 rounded bg-[#e0d8cc]" })]
					})]
				}, i))
			})]
		})
	});
	if (reels.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		ref: sectionRef,
		className: "bg-[#fdf8f3] py-12 sm:py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-[1280px] px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading$1, {
					eyebrow: "Shop the Look",
					title: "As Seen on Instagram",
					subtitle: "Tap any reel to discover the jewellery."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Carousel, {
					setApi,
					opts: {
						align: "start",
						loop: true,
						dragFree: true,
						containScroll: "trimSnaps",
						duration: 12
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CarouselContent, {
						className: "-ml-4",
						onPointerDown: (e) => {
							pointerStart.current = {
								x: e.clientX,
								y: e.clientY
							};
							handlePointerDown();
						},
						onPointerUp: handlePointerUp,
						onPointerLeave: handlePointerUp,
						children: reels.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CarouselItem, {
							className: "basis-[84%] pl-4 sm:basis-[46%] md:basis-[44%] lg:basis-1/4 xl:basis-[22%]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppableReelCard, {
								reel: item.reel,
								product: item.product
							})
						}, item.reel.id))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 flex justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: "https://instagram.com",
						target: "_blank",
						rel: "noreferrer",
						className: "btn-secondary inline-flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Instagram, { className: "h-4 w-4" }), "Follow @creativemuse_ on Instagram"]
					})
				})
			]
		})
	});
}
var DEFAULT_AUTO_SCROLL = {
	autoScrollEnabled: false,
	scrollDirection: "left",
	scrollSpeed: 30,
	pauseOnHover: true,
	autoResumeEnabled: true,
	autoResumeDelaySeconds: 3
};
function ProductCarouselSection({ eyebrow, title, products, autoScroll }) {
	const config = {
		...DEFAULT_AUTO_SCROLL,
		...autoScroll
	};
	const [api, setApi] = (0, import_react.useState)();
	const [selectedIndex, setSelectedIndex] = (0, import_react.useState)(0);
	const [scrollSnaps, setScrollSnaps] = (0, import_react.useState)([]);
	const pointerStart = (0, import_react.useRef)({
		x: 0,
		y: 0
	});
	const intervalRef = (0, import_react.useRef)(null);
	const inactivityRef = (0, import_react.useRef)(null);
	const initialTimerRef = (0, import_react.useRef)(null);
	const sectionRef = (0, import_react.useRef)(null);
	const prefersReducedMotion = (0, import_react.useMemo)(() => {
		if (typeof window === "undefined") return false;
		return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	}, []);
	const effectiveAutoScrollEnabled = config.autoScrollEnabled && !prefersReducedMotion;
	const startAutoScroll = (0, import_react.useCallback)(() => {
		if (!api || !effectiveAutoScrollEnabled) return;
		const slides = api.scrollSnapList().length;
		if (slides <= 1 || products.length <= 1) return;
		stopAutoScroll();
		const intervalMs = Math.max(config.scrollSpeed, 3) * 1e3 / Math.max(slides, 1);
		intervalRef.current = setInterval(() => {
			if (!api) return;
			if (config.scrollDirection === "right") api.scrollPrev();
			else api.scrollNext();
		}, intervalMs);
	}, [
		api,
		effectiveAutoScrollEnabled,
		products.length,
		config.scrollSpeed,
		config.scrollDirection
	]);
	const stopAutoScroll = (0, import_react.useCallback)(() => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
	}, []);
	const clearInactivityTimer = (0, import_react.useCallback)(() => {
		if (inactivityRef.current) {
			clearTimeout(inactivityRef.current);
			inactivityRef.current = null;
		}
	}, []);
	const pauseAutoScroll = (0, import_react.useCallback)(() => {
		stopAutoScroll();
		clearInactivityTimer();
	}, [stopAutoScroll, clearInactivityTimer]);
	const resumeAutoScroll = (0, import_react.useCallback)(() => {
		if (effectiveAutoScrollEnabled) startAutoScroll();
	}, [effectiveAutoScrollEnabled, startAutoScroll]);
	(0, import_react.useEffect)(() => {
		if (!api) return;
		if (effectiveAutoScrollEnabled) {
			const onSettle = () => startAutoScroll();
			api.on("settle", onSettle);
			initialTimerRef.current = setTimeout(() => startAutoScroll(), 800);
			return () => {
				api.off("settle", onSettle);
				stopAutoScroll();
				if (initialTimerRef.current) {
					clearTimeout(initialTimerRef.current);
					initialTimerRef.current = null;
				}
			};
		} else stopAutoScroll();
	}, [
		api,
		effectiveAutoScrollEnabled,
		startAutoScroll,
		stopAutoScroll
	]);
	const handleMouseEnter = (0, import_react.useCallback)(() => {
		if (config.pauseOnHover) pauseAutoScroll();
	}, [config.pauseOnHover, pauseAutoScroll]);
	const handleMouseLeave = (0, import_react.useCallback)(() => {
		if (config.pauseOnHover) resumeAutoScroll();
	}, [config.pauseOnHover, resumeAutoScroll]);
	const handlePointerDown = (0, import_react.useCallback)(() => {
		pauseAutoScroll();
	}, [pauseAutoScroll]);
	const handlePointerUp = (0, import_react.useCallback)(() => {
		clearInactivityTimer();
		if (config.autoResumeEnabled) inactivityRef.current = setTimeout(() => {
			resumeAutoScroll();
		}, config.autoResumeDelaySeconds * 1e3);
	}, [
		config.autoResumeEnabled,
		config.autoResumeDelaySeconds,
		clearInactivityTimer,
		resumeAutoScroll
	]);
	(0, import_react.useEffect)(() => {
		const handleVisibility = () => {
			if (document.hidden) pauseAutoScroll();
			else resumeAutoScroll();
		};
		document.addEventListener("visibilitychange", handleVisibility);
		return () => document.removeEventListener("visibilitychange", handleVisibility);
	}, [pauseAutoScroll, resumeAutoScroll]);
	(0, import_react.useEffect)(() => {
		return () => {
			stopAutoScroll();
			clearInactivityTimer();
			if (initialTimerRef.current) {
				clearTimeout(initialTimerRef.current);
				initialTimerRef.current = null;
			}
		};
	}, [stopAutoScroll, clearInactivityTimer]);
	const onSelect = (0, import_react.useCallback)((carouselApi) => {
		if (!carouselApi) return;
		setSelectedIndex(carouselApi.selectedScrollSnap());
		setScrollSnaps(carouselApi.scrollSnapList());
	}, []);
	(0, import_react.useEffect)(() => {
		if (!api) return;
		onSelect(api);
		api.on("select", onSelect);
		api.on("reInit", onSelect);
		return () => {
			api.off("select", onSelect);
			api.off("reInit", onSelect);
		};
	}, [api, onSelect]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		ref: sectionRef,
		className: "bg-[#fdf8f3] py-20",
		onMouseEnter: handleMouseEnter,
		onMouseLeave: handleMouseLeave,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-[1280px] px-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-end justify-between gap-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow",
						children: eyebrow
					}),
					title && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display mt-3 text-[32px] leading-tight font-semibold text-[#1a1a2e] sm:text-[40px]",
						children: title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "gold-divider mt-4 inline-block" })
				] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Carousel, {
						setApi,
						opts: {
							align: "start",
							loop: effectiveAutoScrollEnabled,
							dragFree: false,
							duration: 25
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CarouselContent, {
							onPointerDown: (e) => {
								pointerStart.current = {
									x: e.clientX,
									y: e.clientY
								};
								handlePointerDown();
							},
							onPointerUp: handlePointerUp,
							onPointerLeave: handlePointerUp,
							children: products.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CarouselItem, {
								className: "basis-[84%] sm:basis-[46%] md:basis-[44%] lg:basis-1/3 xl:basis-1/4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-full transition-transform duration-400",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, {
										product: p,
										index: i,
										pointerStart
									})
								})
							}, `${p.id}-${i}`))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex items-center justify-center gap-3 sm:mt-5 sm:gap-4",
						"aria-label": `${eyebrow} carousel controls`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => {
									pauseAutoScroll();
									api?.scrollPrev();
								},
								disabled: !api?.canScrollPrev(),
								className: "flex h-10 w-10 items-center justify-center rounded-full border border-[#d8d0c6] bg-[#fdf8f3] text-[#1a1a2e] shadow-[0_6px_14px_rgba(0,0,0,0.07)] transition-all hover:border-[#7A2533] hover:text-[#7A2533] disabled:opacity-40 sm:h-12 sm:w-12",
								"aria-label": "Previous products",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4 sm:h-5 sm:w-5" })
							}),
							scrollSnaps.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center gap-2 sm:gap-2.5",
								children: scrollSnaps.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => {
										pauseAutoScroll();
										api?.scrollTo(i);
									},
									className: `h-2 rounded-full border border-[#7A2533] transition-all duration-300 sm:h-2.5 ${i === selectedIndex ? "w-7 bg-[#7A2533] sm:w-9" : "w-2 bg-transparent sm:w-2.5"}`,
									"aria-label": `Go to product ${i + 1} of ${scrollSnaps.length}`
								}, i))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => {
									pauseAutoScroll();
									api?.scrollNext();
								},
								disabled: !api?.canScrollNext(),
								className: "flex h-10 w-10 items-center justify-center rounded-full border border-[#d8d0c6] bg-[#fdf8f3] text-[#1a1a2e] shadow-[0_6px_14px_rgba(0,0,0,0.07)] transition-all hover:border-[#7A2533] hover:text-[#7A2533] disabled:opacity-40 sm:h-12 sm:w-12",
								"aria-label": "Next products",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4 sm:h-5 sm:w-5" })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 border-b border-[#e0d8cc]",
						"aria-hidden": "true"
					})
				]
			})]
		})
	});
}
var CATEGORY_IMAGES = {
	Rings: cat_rings_default,
	Necklaces: cat_necklaces_default,
	Earrings: cat_earrings_default,
	Bracelets: cat_bracelets_default,
	Mangalsutra: cat_mangalsutra_default,
	Pendants: cat_pendants_default,
	Bangles: cat_bangles_default,
	"Wedding Sets": cat_wedding_default,
	Ring: cat_rings_default,
	Necklace: cat_necklaces_default,
	Earring: cat_earrings_default,
	Bracelet: cat_bracelets_default,
	Pendant: cat_pendants_default,
	Bangle: cat_bangles_default,
	Hoops: cat_earrings_default,
	Earcuffs: cat_earrings_default,
	Kada: cat_bangles_default
};
function HomePage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrustBar, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShopByCategory, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeaturedBanner, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BestSellers, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppableReelsSection, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewArrivals, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PremiumArrivals, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WhyChoose, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VideoBanner, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoreLocation, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FAQ, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Newsletter, {})
	] });
}
var HERO_SLIDES = [{
	badge: "Vadodara's Premier Fine Jewellery",
	title: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		"Where Every Gem",
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "shimmer-text italic",
			children: "Tells Your Story"
		})
	] }),
	desc: "Handcrafted fine jewellery for life's most precious moments. From bridal masterpieces to everyday elegance — designed in Vadodara, treasured for generations.",
	image: hero_ring_default,
	imageAlt: "Aarav Solitaire — 18K rose gold diamond ring",
	stat: "₹48,500"
}, {
	badge: "Bridal Edit 2025",
	title: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		"Celebrate Life's",
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "shimmer-text italic",
			children: "Golden Moments"
		})
	] }),
	desc: "Exquisite bridal sets crafted to make your special day unforgettable. Each piece tells a story of love, tradition, and timeless beauty.",
	image: prod_polki_choker_default,
	imageAlt: "Polki Choker — Traditional bridal jewellery",
	stat: "Starting ₹12,500"
}];
function Hero() {
	const [api, setApi] = (0, import_react.useState)();
	const [current, setCurrent] = (0, import_react.useState)(0);
	const onSelect = (0, import_react.useCallback)((a) => {
		setCurrent(a?.selectedScrollSnap() ?? 0);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!api) return;
		setCurrent(api.selectedScrollSnap());
		api.on("select", onSelect);
		return () => {
			api.off("select", onSelect);
		};
	}, [api, onSelect]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative overflow-hidden bg-gradient-to-br from-[#fdf8f3] via-[#f7ede0] to-[#f0dcc8]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -top-32 -left-32 h-[480px] w-[480px] rounded-full bg-[#C9A96E]/20 blur-[120px]" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -right-40 -bottom-40 h-[520px] w-[520px] rounded-full bg-[#E8B4A0]/25 blur-[140px]" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Carousel, {
				setApi,
				opts: {
					loop: true,
					align: "start"
				},
				className: "relative",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CarouselContent, { children: HERO_SLIDES.map((slide, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CarouselItem, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative mx-auto grid max-w-[1280px] items-center gap-6 px-6 pt-8 pb-12 md:pt-10 md:pb-16 lg:grid-cols-[55fr_45fr] lg:gap-8 lg:pt-12 lg:pb-16",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
							initial: {
								opacity: 0,
								y: 24
							},
							animate: {
								opacity: 1,
								y: 0
							},
							transition: { duration: .7 },
							className: "flex flex-col justify-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex w-fit items-center gap-2 rounded-full border border-[#7A2533]/40 bg-white/60 px-4 py-1.5 text-[11px] font-semibold tracking-[0.18em] text-[#7A2533] uppercase backdrop-blur-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3 w-3" }), slide.badge]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "font-display mt-4 font-bold leading-[1.05] text-[#1a1a2e]",
									style: { fontSize: "clamp(28px, 5vw, 52px)" },
									children: slide.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-4 max-w-lg text-[14px] leading-relaxed text-[#5a4e44] sm:text-[15px]",
									children: slide.desc
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-5 flex flex-wrap gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/shop",
										className: "btn-primary",
										children: "Explore Collections"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/contact",
										className: "btn-secondary",
										children: "Visit Our Store"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-6 flex flex-wrap items-center gap-x-10 gap-y-4 border-t border-[#7A2533]/20 pt-5",
									children: [
										["15+", "Years of Craft"],
										["50K+", "Happy Customers"],
										["100%", "Hallmarked Gold"]
									].map(([n, l]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-display text-2xl font-bold text-[#1a1a2e]",
										children: n
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] tracking-[0.14em] text-[#5a4e44] uppercase",
										children: l
									})] }, l))
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
							initial: {
								opacity: 0,
								scale: .95
							},
							animate: {
								opacity: 1,
								scale: 1
							},
							transition: {
								duration: .8,
								delay: .2
							},
							className: "relative mx-auto flex w-full max-w-[420px] items-center justify-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "glass-panel relative aspect-square w-full overflow-hidden rounded-[28px] p-4 shadow-[0_24px_64px_rgba(0,0,0,0.12)] sm:p-5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "animate-cm-float flex h-full w-full items-center justify-center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: slide.image,
											alt: slide.imageAlt,
											width: 1024,
											height: 1280,
											fetchPriority: idx === 0 ? "high" : void 0,
											decoding: "async",
											className: "h-full w-full rounded-[20px] object-contain drop-shadow-[0_24px_48px_rgba(122,37,51,0.35)]"
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
									initial: {
										opacity: 0,
										x: -30
									},
									animate: {
										opacity: 1,
										x: 0
									},
									transition: {
										delay: .6,
										duration: .6
									},
									className: "absolute top-4 left-2 hidden rounded-[18px] border border-[#7A2533]/30 bg-white/90 p-3 shadow-[0_8px_32px_rgba(122,37,51,0.2)] backdrop-blur-xl md:block",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "eyebrow text-[9px] text-[#7A2533]",
											children: "Best Seller"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-display mt-1 text-sm font-semibold text-[#1a1a2e]",
											children: "Aarav Solitaire"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-0.5 text-[13px] font-bold text-[#7A2533]",
											children: slide.stat
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
									initial: {
										opacity: 0,
										x: 30
									},
									animate: {
										opacity: 1,
										x: 0
									},
									transition: {
										delay: .8,
										duration: .6
									},
									className: "absolute right-2 bottom-4 hidden items-center gap-2 rounded-[18px] border border-emerald-200/60 bg-white/90 p-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.1)] backdrop-blur-xl md:flex",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Diamond, { className: "h-4 w-4 text-emerald-700" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] font-semibold text-emerald-800",
										children: "IGI Certified"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] text-[#5a4e44]",
										children: "Lab-graded diamonds"
									})] })]
								})
							]
						})]
					}) }, idx)) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => api?.scrollPrev(),
						className: "absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-[#2a1e14] shadow transition-colors hover:bg-white",
						"aria-label": "Previous slide",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => api?.scrollNext(),
						className: "absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-[#2a1e14] shadow transition-colors hover:bg-white",
						"aria-label": "Next slide",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2",
						children: HERO_SLIDES.map((_, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => api?.scrollTo(idx),
							className: `h-2 rounded-full transition-all ${idx === current ? "w-7 bg-[#8B1A1A]" : "w-2 bg-[#7A2533]/50"}`,
							"aria-label": `Go to slide ${idx + 1}`
						}, idx))
					})
				]
			})
		]
	});
}
function TrustBar() {
	const items = [
		[Award, "BIS Hallmarked Gold"],
		[Diamond, "IGI Certified Diamonds"],
		[Truck, "Free Insured Shipping"],
		[RotateCcw, "30-Day Returns"],
		[Shield, "Secure Payments"]
	];
	const prefersReducedMotion = useReducedMotion();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "overflow-hidden bg-[#1a1a2e] py-5",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto flex max-w-[1280px] overflow-hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `flex shrink-0 items-center gap-8 whitespace-nowrap px-6 text-[12px] tracking-[0.1em] text-white uppercase ${prefersReducedMotion ? "flex-wrap justify-center gap-x-10 gap-y-3" : "animate-cm-marquee"}`,
				children: Array.from({ length: prefersReducedMotion ? 1 : 3 }).flatMap((_, setIdx) => items.map(([Ic, label], itemIdx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex shrink-0 items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ic, { className: "h-4 w-4 text-white" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label })]
				}, `${setIdx}-${itemIdx}`)))
			})
		})
	});
}
function SectionHeading({ eyebrow, title, subtitle, light }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
		initial: {
			opacity: 0,
			y: 16
		},
		whileInView: {
			opacity: 1,
			y: 0
		},
		viewport: {
			once: true,
			margin: "-80px"
		},
		transition: { duration: .5 },
		className: "mx-auto mb-12 max-w-2xl text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "eyebrow",
				children: eyebrow
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: `font-display mt-3 text-[32px] leading-tight font-semibold sm:text-[40px] lg:text-[44px] ${light ? "text-white" : "text-[#1a1a2e]"}`,
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 flex justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "gold-divider" })
			}),
			subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: `mt-5 text-[15px] ${light ? "text-white/70" : "text-[#7a6e64]"}`,
				children: subtitle
			})
		]
	});
}
var EXCLUDED_CATEGORIES = /* @__PURE__ */ new Set([
	"arth",
	"lucky",
	"test",
	"demo"
]);
var CANONICAL_NAMES = /* @__PURE__ */ new Set([
	"Earrings",
	"Necklace",
	"Rings",
	"Hoops",
	"Earcuffs",
	"Kada",
	"Bracelets",
	"Mangalsutra",
	"Pendants",
	"Bangles",
	"Wedding Sets"
]);
function deduplicateCategories(cats) {
	const seen = /* @__PURE__ */ new Map();
	for (const cat of cats) {
		const key = cat.name.trim().toLowerCase();
		if (EXCLUDED_CATEGORIES.has(key)) continue;
		if (!seen.has(key)) seen.set(key, cat);
		else {
			const existing = seen.get(key);
			if (CANONICAL_NAMES.has(cat.name) || !CANONICAL_NAMES.has(existing.name)) seen.set(key, cat);
		}
	}
	const result = Array.from(seen.values());
	const order = [
		"Earrings",
		"Necklace",
		"Rings",
		"Hoops",
		"Earcuffs",
		"Kada",
		"Bracelets",
		"Mangalsutra",
		"Pendants",
		"Bangles",
		"Wedding Sets"
	];
	result.sort((a, b) => {
		const ia = order.indexOf(a.name);
		const ib = order.indexOf(b.name);
		if (ia !== -1 && ib !== -1) return ia - ib;
		if (ia !== -1) return -1;
		if (ib !== -1) return 1;
		return (a.sort_order ?? 0) - (b.sort_order ?? 0);
	});
	return result;
}
function ShopByCategory() {
	const { data, isLoading } = useCategories();
	const categoryScrollerRef = (0, import_react.useRef)(null);
	const prefersReducedMotion = useReducedMotion();
	const autoScrollRef = (0, import_react.useRef)(void 0);
	const [autoPaused, setAutoPaused] = (0, import_react.useState)(false);
	const dbCategories = (0, import_react.useMemo)(() => data ? deduplicateCategories(data) : [], [data]);
	const startAutoScroll = (0, import_react.useCallback)(() => {
		if (autoScrollRef.current) clearInterval(autoScrollRef.current);
		if (prefersReducedMotion) return;
		autoScrollRef.current = setInterval(() => {
			const el = categoryScrollerRef.current;
			if (!el || el.scrollWidth <= el.clientWidth) return;
			const maxScroll = el.scrollWidth - el.clientWidth;
			if (el.scrollLeft >= maxScroll - 2) el.scrollTo({
				left: 0,
				behavior: "smooth"
			});
			else el.scrollBy({
				left: el.clientWidth * .75,
				behavior: "smooth"
			});
		}, 1800);
	}, [prefersReducedMotion]);
	const stopAutoScroll = (0, import_react.useCallback)(() => {
		if (autoScrollRef.current) clearInterval(autoScrollRef.current);
		autoScrollRef.current = void 0;
	}, []);
	(0, import_react.useEffect)(() => {
		if (!autoPaused) startAutoScroll();
		else stopAutoScroll();
		return stopAutoScroll;
	}, [
		autoPaused,
		startAutoScroll,
		stopAutoScroll
	]);
	if (isLoading) return null;
	const d = prefersReducedMotion ? 0 : void 0;
	function scrollCategories(direction) {
		const el = categoryScrollerRef.current;
		if (!el) return;
		el.scrollBy({
			left: direction * Math.max(el.clientWidth * .75, 260),
			behavior: prefersReducedMotion ? "auto" : "smooth"
		});
	}
	function renderCard(cat) {
		const img = cat.imageUrl || CATEGORY_IMAGES[cat.name] || null;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: `/category/${cat.slug}`,
			className: "group flex h-full flex-col items-center rounded-[24px] border border-transparent bg-white p-3 pb-4 text-center shadow-[0_4px_24px_rgba(0,0,0,0.04)] transition-all duration-500 hover:-translate-y-2 hover:border-[#7A2533]/50 hover:shadow-[0_20px_60px_rgba(122,37,51,0.22)] active:scale-[0.97] md:p-4 md:pb-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative aspect-square w-full overflow-hidden rounded-[18px] bg-gradient-to-br from-[#fdf8f3] to-[#f0e4cd]",
				children: img ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: img,
					alt: cat.name,
					loading: "lazy",
					width: 768,
					height: 768,
					className: "absolute inset-0 h-full w-full object-contain p-2 transition-transform duration-700 ease-out group-hover:scale-110 md:p-3",
					onError: (e) => {
						e.currentTarget.style.display = "none";
					}
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex h-full w-full items-center justify-center bg-[#f5efe8] p-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
						className: "h-8 w-8 text-[#7A2533]/20",
						fill: "none",
						viewBox: "0 0 24 24",
						stroke: "currentColor",
						strokeWidth: 1,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
							strokeLinecap: "round",
							strokeLinejoin: "round",
							d: "M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
						})
					})
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display mt-3 text-[14px] font-semibold text-[#1a1a2e] md:mt-4 md:text-[15px]",
				children: cat.name
			})]
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "shop-by-category",
		className: "scroll-mt-40 bg-[#fdf8f3] py-16 md:py-20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-[1280px] px-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
				eyebrow: "Browse",
				title: "Shop by Category"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mt-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => scrollCategories(-1),
						className: "absolute left-0 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#d8d0c6] bg-white text-[#1a1a2e] shadow-[0_8px_20px_rgba(0,0,0,0.08)] transition-all hover:border-[#7A2533] hover:text-[#7A2533] md:flex",
						"aria-label": "Scroll categories left",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						ref: categoryScrollerRef,
						onMouseEnter: () => setAutoPaused(true),
						onMouseLeave: () => setAutoPaused(false),
						onTouchStart: () => setAutoPaused(true),
						onTouchEnd: () => setAutoPaused(false),
						className: "scrollbar-hide -mx-6 flex snap-x gap-3 overflow-x-auto px-6 pb-2 md:mx-10 md:gap-5 md:px-0",
						children: dbCategories.map((cat, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
							initial: {
								opacity: 0,
								y: 20
							},
							animate: {
								opacity: 1,
								y: 0
							},
							viewport: {
								once: true,
								margin: "-50px"
							},
							transition: {
								duration: d ?? .4,
								delay: d ?? i * .05
							},
							className: "w-[42vw] min-w-[150px] max-w-[180px] shrink-0 snap-start md:w-[190px] md:min-w-[190px] md:max-w-none lg:w-[210px] lg:min-w-[210px]",
							children: renderCard(cat)
						}, cat.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => scrollCategories(1),
						className: "absolute right-0 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#d8d0c6] bg-white text-[#1a1a2e] shadow-[0_8px_20px_rgba(0,0,0,0.08)] transition-all hover:border-[#7A2533] hover:text-[#7A2533] md:flex",
						"aria-label": "Scroll categories right",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex justify-center gap-4 md:hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => scrollCategories(-1),
							className: "flex h-10 w-10 items-center justify-center rounded-full border border-[#d8d0c6] bg-white text-[#1a1a2e] shadow-[0_6px_14px_rgba(0,0,0,0.07)] transition-all active:scale-95",
							"aria-label": "Scroll categories left",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => scrollCategories(1),
							className: "flex h-10 w-10 items-center justify-center rounded-full border border-[#7A2533] bg-white text-[#7A2533] shadow-[0_6px_14px_rgba(0,0,0,0.07)] transition-all active:scale-95",
							"aria-label": "Scroll categories right",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })
						})]
					})
				]
			})]
		})
	});
}
var CTA_FALLBACK_VIDEOS = [
	{
		src: "/category-videos/necklace-hero.mp4",
		poster: prod_polki_choker_default,
		title: "Bridal necklaces"
	},
	{
		src: "/category-videos/earrings-hero.mp4",
		poster: prod_celestia_earrings_default,
		title: "Pearl earrings"
	},
	{
		src: "/category-videos/rings-hero.mp4",
		poster: prod_aarav_ring_default,
		title: "Solitaire rings"
	}
];
function HeroVideoCarousel({ videos }) {
	const [api, setApi] = (0, import_react.useState)();
	const [current, setCurrent] = (0, import_react.useState)(0);
	const prefersReducedMotion = useReducedMotion();
	const slides = videos.length > 0 ? videos : CTA_FALLBACK_VIDEOS;
	const onSelect = (0, import_react.useCallback)((a) => {
		setCurrent(a?.selectedScrollSnap() ?? 0);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!api) return;
		setCurrent(api.selectedScrollSnap());
		api.on("select", onSelect);
		return () => {
			api.off("select", onSelect);
		};
	}, [api, onSelect]);
	(0, import_react.useEffect)(() => {
		if (!api || prefersReducedMotion || slides.length < 2) return;
		const timer = window.setInterval(() => api.scrollNext(), 2800);
		return () => window.clearInterval(timer);
	}, [
		api,
		prefersReducedMotion,
		slides.length
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
		initial: {
			opacity: 0,
			x: 24
		},
		whileInView: {
			opacity: 1,
			x: 0
		},
		viewport: { once: true },
		transition: {
			duration: .7,
			delay: .15
		},
		className: "relative min-w-0",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-y-8 -left-6 w-16 bg-gradient-to-r from-[#1a1a2e] to-transparent" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-y-8 -right-6 z-10 w-16 bg-gradient-to-l from-[#1a1a2e] to-transparent" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Carousel, {
				setApi,
				opts: {
					loop: true,
					align: "start"
				},
				className: "overflow-hidden",
				"aria-label": "Bridal collection video carousel",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CarouselContent, {
					className: "-ml-4",
					children: slides.map((video, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CarouselItem, {
						className: "basis-[76%] pl-4 sm:basis-[54%] lg:basis-[58%] xl:basis-[48%]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative aspect-[4/5] overflow-hidden rounded-[28px] border border-white/10 bg-[#fdf8f3]/10 shadow-[0_24px_64px_rgba(0,0,0,0.35)]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
									src: video.src,
									poster: video.poster,
									className: "h-full w-full object-cover",
									autoPlay: true,
									muted: true,
									loop: true,
									playsInline: true,
									preload: "metadata",
									"aria-label": video.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1a1a2e]/35 via-transparent to-white/10" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "pointer-events-none absolute bottom-4 left-4 rounded-full border border-white/30 bg-white/15 px-3 py-1 text-[10px] font-semibold tracking-[0.16em] text-white uppercase backdrop-blur-md",
									children: video.title
								})
							]
						})
					}, `${video.src}-${i}`))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 flex justify-center gap-2",
				children: slides.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => api?.scrollTo(i),
					className: `h-1.5 rounded-full transition-all ${i === current ? "w-7 bg-[#C9A96E]" : "w-1.5 bg-white/35"}`,
					"aria-label": `Show bridal video ${i + 1}`
				}, i))
			})
		]
	});
}
function FeaturedBanner() {
	const { data: section, isLoading } = useContentSection("featured_banner");
	const ctaVideos = (0, import_react.useMemo)(() => {
		if (!section?.content?.cta_videos) return null;
		return section.content.cta_videos;
	}, [section]);
	const videos = ctaVideos && ctaVideos.length > 0 ? ctaVideos : CTA_FALLBACK_VIDEOS;
	if (isLoading) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "px-4 sm:px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative mx-auto max-w-[1320px] overflow-hidden rounded-[40px] bg-[#1a1a2e] px-8 py-16 sm:px-14 sm:py-20",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -top-32 -right-32 h-[420px] w-[420px] rounded-full bg-[#C9A96E]/20 blur-[120px]" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -bottom-40 -left-32 h-[420px] w-[420px] rounded-full bg-[#E8B4A0]/15 blur-[120px]" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative grid items-center gap-12 lg:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
						initial: {
							opacity: 0,
							x: -24
						},
						whileInView: {
							opacity: 1,
							x: 0
						},
						viewport: { once: true },
						transition: { duration: .6 },
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "eyebrow",
								children: "Bridal Edit"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "font-display mt-3 text-[34px] leading-tight font-semibold text-white sm:text-[44px] lg:text-[48px]",
								children: [
									"The 2025",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "shimmer-text",
										children: "Bridal Collection"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-5 max-w-md text-[15px] leading-relaxed text-white/70",
								children: "Heirloom-worthy pieces curated for the modern Indian bride. Polki, Kundan, Diamond and Gold — designed to be worn for a lifetime."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-8 flex flex-wrap gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/shop",
									className: "btn-primary",
									children: "View Collection"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/contact",
									className: "btn-primary",
									children: "Book Consultation"
								})]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative min-w-0 lg:h-[420px]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "relative z-10 mx-auto w-full max-w-[620px] lg:absolute lg:inset-y-0 lg:right-0 lg:flex lg:max-w-[560px] lg:items-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeroVideoCarousel, { videos })
						})
					})]
				})
			]
		})
	});
}
function BestSellers() {
	const tabs = [
		"Best Sellers",
		"New Arrivals",
		"Wedding",
		"Trending"
	];
	const [active, setActive] = (0, import_react.useState)("Best Sellers");
	const { products } = useStorefrontProducts();
	const filtered = (() => {
		switch (active) {
			case "New Arrivals": return products.filter((p) => p.flags?.some((f) => f.slug === "new-arrival"));
			case "Wedding": return products.filter((p) => p.flags?.some((f) => f.slug === "wedding"));
			case "Trending": return products.filter((p) => p.flags?.some((f) => f.slug === "trending"));
			default: return products.filter((p) => p.flags?.some((f) => f.slug === "best-seller" || f.slug === "trending" || f.slug === "wedding")).slice(0, 8);
		}
	})();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "bg-[#f5efe8] py-20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-[1280px] px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
					eyebrow: "Our Jewellery",
					title: "Handpicked Best Sellers"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-8 flex justify-center md:mb-10",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "scrollbar-hide flex w-full max-w-[calc(100vw-48px)] gap-1.5 overflow-x-auto rounded-[28px] bg-white p-2 shadow-[0_4px_16px_rgba(0,0,0,0.06)] md:inline-flex md:w-auto md:max-w-none md:flex-wrap md:justify-center md:gap-1 md:overflow-visible md:rounded-full md:p-1.5",
						children: tabs.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setActive(t),
							className: `flex h-[52px] min-w-[148px] shrink-0 items-center justify-center rounded-[22px] px-4 text-[13px] font-semibold tracking-[0.08em] uppercase transition-all duration-300 md:h-auto md:min-w-0 md:rounded-full md:px-5 md:py-2.5 md:text-[12px] md:tracking-[0.1em] ${active === t ? "bg-[#7A2533] text-white shadow-[0_6px_16px_rgba(122,37,51,0.35)]" : "text-[#7a6e64] hover:text-[#1a1a2e]"}`,
							children: t
						}, t))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-center text-[#7a6e64]",
					children: "No products in this tab yet."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Carousel, {
					opts: {
						align: "start",
						dragFree: true
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CarouselContent, {
						className: "-ml-3 md:-ml-4",
						children: filtered.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CarouselItem, {
							className: "basis-[84%] pl-3 sm:basis-[45%] md:basis-1/3 md:pl-4 lg:basis-1/4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, {
								product: p,
								index: i
							})
						}, `${p.id}-${i}`))
					})
				}) })
			]
		})
	});
}
function NewArrivals() {
	const { products } = useStorefrontProducts();
	const { data: section } = useContentSection("new_arrivals");
	const scrollSettings = (0, import_react.useMemo)(() => {
		if (!section) return void 0;
		return {
			autoScrollEnabled: section.auto_scroll_enabled ?? false,
			scrollDirection: section.scroll_direction ?? "left",
			scrollSpeed: section.scroll_speed ?? 30,
			pauseOnHover: section.pause_on_hover ?? true,
			autoResumeEnabled: section.auto_resume_enabled ?? true,
			autoResumeDelaySeconds: section.auto_resume_delay_seconds ?? 3
		};
	}, [section]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCarouselSection, {
		eyebrow: "Just Arrived",
		title: "NEW THIS SEASON",
		products: (0, import_react.useMemo)(() => products.filter((p) => p.flags?.some((f) => f.slug === "new-arrival")).concat(products).slice(0, 6), [products]),
		autoScroll: scrollSettings
	});
}
function PremiumArrivals() {
	const { products } = useStorefrontProducts();
	const { data: section } = useContentSection("premium_arrivals");
	const scrollSettings = (0, import_react.useMemo)(() => {
		if (!section) return void 0;
		return {
			autoScrollEnabled: section.auto_scroll_enabled ?? false,
			scrollDirection: section.scroll_direction ?? "left",
			scrollSpeed: section.scroll_speed ?? 30,
			pauseOnHover: section.pause_on_hover ?? true,
			autoResumeEnabled: section.auto_resume_enabled ?? true,
			autoResumeDelaySeconds: section.auto_resume_delay_seconds ?? 3
		};
	}, [section]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCarouselSection, {
		eyebrow: "PREMIUM JEWELLERY",
		title: "YOUR EVERYDAY STATEMENT",
		products: (0, import_react.useMemo)(() => products.filter((p) => p.flags?.some((f) => f.slug === "new-arrival")).concat(products).slice(0, 6), [products]),
		autoScroll: scrollSettings
	});
}
function WhyChoose() {
	const benefitItems = [
		{
			icon: Gem,
			title: "18K Gold Plated"
		},
		{
			icon: ShieldCheck,
			title: "Skin Safe"
		},
		{
			icon: Users,
			title: "10000+ Happy Customers"
		},
		{
			icon: Heart,
			title: "Guaranteed Compliments"
		}
	];
	const featureItems = [
		{
			icon: ShieldCheck,
			label: "Hypoallergenic"
		},
		{
			icon: Droplets,
			label: "Water-Resistant"
		},
		{
			icon: Sparkles,
			label: "Non Tarnish"
		},
		{
			icon: Gem,
			label: "18K Gold Plated"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "bg-[#fdf8f3] py-14 md:py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-[1280px] px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
					eyebrow: "The Creative Muse Promise",
					title: "Why Choose Us"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto max-w-[760px] lg:max-w-[1120px]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-4 lg:gap-4",
						children: benefitItems.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
							initial: {
								opacity: 0,
								y: 16
							},
							whileInView: {
								opacity: 1,
								y: 0
							},
							viewport: {
								once: true,
								margin: "-30px"
							},
							transition: {
								duration: .4,
								delay: i * .04
							},
							className: "flex min-h-[138px] flex-col items-center justify-center rounded-[22px] bg-[#f9f2e9] p-5 text-center md:min-h-[170px] md:p-6 lg:min-h-[128px] lg:p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#C9A96E] to-[#B8860B] shadow-[0_8px_24px_rgba(201,169,110,0.3)] md:h-14 md:w-14 lg:h-12 lg:w-12",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "h-5 w-5 text-white md:h-6 md:w-6 lg:h-5 lg:w-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "font-display mt-4 text-[14px] font-semibold text-[#1a1a2e] md:text-[17px] lg:mt-3 lg:text-[15px]",
								children: item.title
							})]
						}, item.title))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto mt-8 max-w-[760px] md:mt-10 lg:max-w-[1120px]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap items-center justify-center gap-4 rounded-[22px] bg-[#e8ddd0] px-5 py-4 md:flex-nowrap md:gap-0",
						children: featureItems.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
							initial: {
								opacity: 0,
								y: 10
							},
							whileInView: {
								opacity: 1,
								y: 0
							},
							viewport: {
								once: true,
								margin: "-30px"
							},
							transition: {
								duration: .3,
								delay: i * .06
							},
							className: "flex items-center gap-2 px-2 md:flex-1 md:justify-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "h-4 w-4 shrink-0 text-[#1a1a2e]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[9px] font-semibold tracking-[0.12em] text-[#1a1a2e] uppercase md:text-[10px]",
								children: item.label
							})]
						}, item.label))
					})
				})
			]
		})
	});
}
function VideoBanner() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "mt-20 px-4 sm:px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative mx-auto max-w-[1320px] overflow-hidden rounded-[40px] bg-gradient-to-br from-[#0d0d1a] via-[#1a1a2e] to-[#3a1a3e] px-8 py-28 text-center shadow-[0_24px_64px_rgba(0,0,0,0.3)] sm:py-36",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(122,37,51,0.25),transparent_60%)]" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(232,180,160,0.18),transparent_55%)]" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
					initial: {
						scale: .8,
						opacity: 0
					},
					whileInView: {
						scale: 1,
						opacity: 1
					},
					viewport: { once: true },
					transition: { duration: .6 },
					className: "relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/15 backdrop-blur-md ring-1 ring-white/20",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "ml-1 h-8 w-8 fill-white text-white" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "font-display relative mt-8 text-[34px] leading-tight font-semibold text-white sm:text-[48px]",
					children: ["Crafted for the ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "shimmer-text",
						children: "Extraordinary"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "relative mx-auto mt-4 max-w-md text-[15px] text-white/70",
					children: "Watch how each Creative Muse piece is born — from sketch to setting."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative mt-8 flex justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-[13px] font-semibold tracking-[0.14em] text-[#1a1a2e] uppercase transition-transform hover:-translate-y-0.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-3.5 w-3.5 fill-[#1a1a2e]" }), " Watch Our Story"]
					})
				})
			]
		})
	});
}
function StoreLocation() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "bg-[#fdf8f3] py-20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-[1280px] items-center gap-10 px-6 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
				initial: {
					opacity: 0,
					x: -20
				},
				whileInView: {
					opacity: 1,
					x: 0
				},
				viewport: { once: true },
				transition: { duration: .5 },
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow",
						children: "Visit Us"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "font-display mt-3 text-[32px] leading-tight font-semibold text-[#1a1a2e] sm:text-[40px]",
						children: [
							"Step Inside Our",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							"Vadodara Atelier"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 space-y-4 text-[15px] text-[#3a3028]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "mt-0.5 h-5 w-5 shrink-0 text-[#7A2533]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "GF-3/4, Vidhi Square Complex, BPC Road, Anand Nagar, Vadodara – 390020" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "mt-0.5 h-5 w-5 shrink-0 text-[#7A2533]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "tel:+919033779867",
									className: "hover:text-[#7A2533]",
									children: "+91 90337 79867"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "mt-0.5 h-5 w-5 shrink-0 text-[#7A2533]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Mon–Sat: 10AM–8PM · Sunday: 11AM–7PM" })]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex flex-wrap gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "https://maps.google.com/?q=Vidhi+Square+Vadodara",
							target: "_blank",
							rel: "noreferrer",
							className: "btn-primary",
							children: "Get Directions"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "tel:+919033779867",
							className: "btn-secondary",
							children: "Call Us Now"
						})]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
				initial: {
					opacity: 0,
					scale: .95
				},
				whileInView: {
					opacity: 1,
					scale: 1
				},
				viewport: { once: true },
				transition: { duration: .6 },
				className: "relative flex aspect-[5/4] items-center justify-center overflow-hidden rounded-[28px] bg-[#f5efe8] shadow-[0_12px_40px_rgba(0,0,0,0.08)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(122,37,51,0.18),transparent_60%)]" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
						className: "absolute inset-0 h-full w-full opacity-20",
						viewBox: "0 0 400 320",
						fill: "none",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
							d: "M0 80 L400 60 M0 160 L400 180 M0 240 L400 220",
							stroke: "#7A2533",
							strokeWidth: "1"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
							d: "M80 0 L100 320 M200 0 L220 320 M320 0 L300 320",
							stroke: "#7A2533",
							strokeWidth: "1"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-[#C9A96E] to-[#B8860B] shadow-[0_12px_32px_rgba(201,169,110,0.4)]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-7 w-7 text-white" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display mt-4 text-lg text-[#1a1a2e]",
								children: "Creative Muse"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs tracking-[0.18em] text-[#7a6e64] uppercase",
								children: "Vadodara, Gujarat"
							})
						]
					})
				]
			})]
		})
	});
}
var FAQS = [
	["What certifications do your diamonds carry?", "All Creative Muse diamonds are IGI or GIA certified, with a unique grading report detailing the 4Cs. Certificates are included with every purchase."],
	["Do you offer hallmarked gold jewellery?", "Yes — every gold piece is BIS hallmarked. The hallmark, purity stamp and HUID number are visible on each item."],
	["What is your return and exchange policy?", "We offer 30-day returns on unworn pieces in original packaging. Custom and engraved orders are non-returnable but exchangeable for store credit."],
	["Can I customise a piece for my wedding?", "Absolutely. Book a private appointment at our Vadodara atelier or via video call — our designers will work with you from sketch to delivery."],
	["Do you offer EMI options?", "Yes — no-cost EMI is available across major credit cards and via Razorpay. Choose your tenure at checkout."],
	["How long does shipping take across India?", "2–5 business days, fully insured and tracked. Free shipping on orders above ₹5,000."]
];
function FAQ() {
	const [open, setOpen] = (0, import_react.useState)(0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "bg-[#fdf8f3] py-20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-[760px] px-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
				eyebrow: "Good to Know",
				title: "Frequently Asked"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-3",
				children: FAQS.map(([q, a], i) => {
					const isOpen = open === i;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
						initial: {
							opacity: 0,
							y: 10
						},
						whileInView: {
							opacity: 1,
							y: 0
						},
						viewport: {
							once: true,
							margin: "-20px"
						},
						transition: {
							duration: .3,
							delay: i * .04
						},
						className: "overflow-hidden rounded-[20px] border border-[#e0d8cc] bg-white",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setOpen(isOpen ? null : i),
							className: "flex w-full items-center justify-between gap-4 px-6 py-5 text-left",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-[15px] font-semibold text-[#1a1a2e]",
								children: q
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#fdf8f3] text-[#7A2533] transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" })
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
							initial: false,
							children: isOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
								initial: {
									height: 0,
									opacity: 0
								},
								animate: {
									height: "auto",
									opacity: 1
								},
								exit: {
									height: 0,
									opacity: 0
								},
								transition: { duration: .3 },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "px-6 pb-5 text-[14px] leading-relaxed text-[#7a6e64]",
									children: a
								})
							})
						})]
					}, q);
				})
			})]
		})
	});
}
function Newsletter() {
	const [email, setEmail] = (0, import_react.useState)("");
	const [state, setState] = (0, import_react.useState)("idle");
	const [msg, setMsg] = (0, import_react.useState)(null);
	async function submit(e) {
		e.preventDefault();
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
			setState("error");
			setMsg("Please enter a valid email address.");
			return;
		}
		setState("loading");
		setMsg(null);
		try {
			const result = await newsletterApi.subscribeToNewsletter({
				email: email.trim().toLowerCase(),
				source: "homepage_newsletter",
				consent: true
			});
			if (result.success || result.status === "already_active") {
				setState("success");
				setMsg(result.message || "Welcome to the Circle!");
				if (result.status === "created") setEmail("");
			} else {
				setState("error");
				setMsg(result.message || "Something went wrong. Please try again.");
			}
		} catch (err) {
			setState("error");
			setMsg(err.message || "Something went wrong. Please try again.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "mt-10 px-4 sm:px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative mx-auto max-w-[1320px] overflow-hidden rounded-[40px] bg-gradient-to-br from-[#C9A96E] via-[#c9a96e] to-[#B8860B] px-6 py-16 text-center shadow-[0_24px_64px_rgba(201,169,110,0.3)] sm:py-20",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -top-20 -right-20 h-[300px] w-[300px] rounded-full bg-white/15 blur-[100px]" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Leaf, { className: "absolute top-8 left-10 hidden h-5 w-5 text-white/40 sm:block" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Leaf, { className: "absolute right-12 bottom-10 hidden h-6 w-6 text-white/40 sm:block" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					initial: {
						opacity: 0,
						y: 20
					},
					whileInView: {
						opacity: 1,
						y: 0
					},
					viewport: { once: true },
					transition: { duration: .5 },
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] font-semibold tracking-[0.24em] text-white/80 uppercase",
							children: "Join the Circle"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display mt-3 text-[32px] leading-tight font-semibold text-white sm:text-[42px]",
							children: "Join the Creative Muse Circle"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mx-auto mt-4 max-w-md text-[15px] text-white/85",
							children: "Early access to new collections, exclusive offers, and styling tips from our master craftsmen."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: submit,
							className: "mx-auto mt-8 flex w-full max-w-lg items-center gap-2 rounded-full border border-white/40 bg-white/20 p-2 backdrop-blur-md",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "email",
								value: email,
								onChange: (e) => {
									setEmail(e.target.value);
									if (state !== "idle") setState("idle");
								},
								placeholder: "Enter your email",
								"aria-label": "Email address",
								className: "min-w-0 flex-1 bg-transparent px-4 text-sm text-white placeholder:text-white/70 focus:outline-none"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								disabled: state === "loading",
								className: "btn-dark whitespace-nowrap disabled:opacity-60",
								children: state === "loading" ? "Sending…" : state === "success" ? "Subscribed ✓" : "Subscribe"
							})]
						}),
						msg && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: `mt-4 text-[13px] ${state === "error" ? "text-red-100" : "text-white"}`,
							role: "status",
							children: msg
						})
					]
				})
			]
		})
	});
}
//#endregion
export { HomePage as component };
