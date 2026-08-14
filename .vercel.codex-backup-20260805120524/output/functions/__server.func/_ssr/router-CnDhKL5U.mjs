import { o as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./supabase-Bz-JQXNc.mjs";
import { t as categoriesApi } from "./categories-DdAkdsQw.mjs";
import { t as productsApi } from "./products-CsgymTpp.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { i as require_jsx_runtime, n as QueryClientProvider, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { r as useStore, t as StoreProvider } from "./store-CcwDJcbB.mjs";
import { P as redirect, _ as Link, c as HeadContent, d as createRouter, g as createRootRouteWithContext, h as createFileRoute, l as useLocation, m as lazyRouteComponent, p as Outlet, s as Scripts, x as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { G as Menu, I as Phone, K as MapPin, Mt as Check, Ot as ChevronUp, P as Plus, R as PenLine, W as MessageCircle, _ as Trash2, at as Heart, et as Instagram, ft as Facebook, jt as ChevronDown, k as Search, l as User, n as Youtube, q as Mail, r as X, w as ShoppingBag } from "../_libs/lucide-react.mjs";
import { n as useAuth, t as AuthProvider } from "./auth-D2-u71mo.mjs";
import { n as requireAdmin } from "./auth-guard-CPGwskRa.mjs";
import { i as AdminPageHeader, n as AdminLayout, r as AdminLoading, t as AdminEmpty } from "./AdminLayout-D0HWfGfb.mjs";
import { t as Route$54 } from "./admin.orders._id-CzT4VorT.mjs";
import { t as subcategoriesApi } from "./subcategories-BivcEg6G.mjs";
import { t as Route$55 } from "./blog._slug-DGWoAXhK.mjs";
import { t as Route$56 } from "./category._slug-Cw-meDFL.mjs";
import { t as AddressProvider } from "./addresses-34W13RH8.mjs";
import { t as Route$57 } from "./product._productId-DqaG8Nbw.mjs";
import { n as sortFromUrl } from "./shop-DVGskW_Z.mjs";
import { t as Route$58 } from "./search-CnLK2ELT.mjs";
import { t as hero_ring_default } from "./hero-ring-FP2R-HfP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-CnDhKL5U.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-qyBJtVpg.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
var MESSAGE = "✦ Free Shipping on orders above ₹5,000  ·  BIS Hallmarked Gold  ·  IGI Certified Diamonds  ·  30-Day Returns  ·  Book a Private Appointment  ✦";
function AnnouncementBar() {
	const [open, setOpen] = (0, import_react.useState)(true);
	if (!open) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative h-10 overflow-hidden bg-[#1a1a2e] text-white",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex h-full items-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex animate-cm-marquee shrink-0 gap-16 whitespace-nowrap pl-8 text-[11px] tracking-[0.18em] uppercase",
				children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "shrink-0",
					children: MESSAGE
				}, i))
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			"aria-label": "Dismiss announcement",
			onClick: () => setOpen(false),
			className: "absolute top-1/2 right-3 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" })
		})]
	});
}
var NAV_ITEMS = [
	{
		label: "Earrings",
		to: "/collections/earrings",
		links: [],
		featured: {
			title: "The Lotus",
			subtitle: "Stud Collection",
			description: "Elegant everyday studs",
			linkTo: "/collections/earrings",
			linkText: "Shop now"
		},
		offer: {
			title: "Buy 1 Get 1",
			subtitle: "on Select Studs",
			description: "Mix & match pairs",
			linkTo: "/collections/earrings",
			linkText: "View offers"
		}
	},
	{
		label: "Necklace",
		to: "/collections/necklace",
		links: [
			{
				label: "Statement Necklace",
				to: "/collections/necklace/statement-necklace"
			},
			{
				label: "Charm Necklace",
				to: "/collections/necklace/charm-necklace"
			},
			{
				label: "Everyday Necklace",
				to: "/collections/necklace/everyday-necklace"
			}
		],
		featured: {
			title: "The Maharani",
			subtitle: "Statement Necklace",
			description: "Traditional heirloom piece",
			linkTo: "/collections/necklace/statement-necklace",
			linkText: "Shop now"
		},
		offer: {
			title: "Free Adjustments",
			subtitle: "on All Necklaces",
			description: "Lifetime resizing",
			linkTo: "/collections/necklace",
			linkText: "View offers"
		}
	},
	{
		label: "Rings",
		to: "/collections/rings",
		links: [],
		featured: {
			title: "The Celestial",
			subtitle: "Ring Collection",
			description: "0.5 ct certified diamond",
			linkTo: "/collections/rings",
			linkText: "Shop now"
		},
		offer: {
			title: "Free Engraving",
			subtitle: "on Rings",
			description: "Personalise your ring",
			linkTo: "/collections/rings",
			linkText: "View offers"
		}
	},
	{
		label: "Hoops",
		to: "/collections/hoops",
		links: [],
		featured: {
			title: "The Classic",
			subtitle: "Hoop Earrings",
			description: "Timeless hoop designs",
			linkTo: "/collections/hoops",
			linkText: "Shop now"
		},
		offer: {
			title: "Mini Hoops",
			subtitle: "Combo Deal",
			description: "Buy 2 get 5% off",
			linkTo: "/collections/hoops",
			linkText: "View offers"
		}
	},
	{
		label: "Earcuffs",
		to: "/collections/earcuffs",
		links: [],
		featured: {
			title: "The Edge",
			subtitle: "Earcuff Set",
			description: "Modern asymmetric cuffs",
			linkTo: "/collections/earcuffs",
			linkText: "Shop now"
		},
		offer: {
			title: "New Launch",
			subtitle: "Earcuff Edit",
			description: "Up to 20% off",
			linkTo: "/collections/earcuffs",
			linkText: "View offers"
		}
	},
	{
		label: "Kada",
		to: "/collections/kada",
		links: [
			{
				label: "Statement Kada",
				to: "/collections/kada/statement-kada"
			},
			{
				label: "Resin Kada",
				to: "/collections/kada/resin-kada"
			},
			{
				label: "Wooden Kada",
				to: "/collections/kada/wooden-kada"
			},
			{
				label: "Colorful Kada",
				to: "/collections/kada/colorful-kada"
			},
			{
				label: "Everyday Kada",
				to: "/collections/kada/everyday-kada"
			}
		],
		featured: {
			title: "The Artisan",
			subtitle: "Resin Kada",
			description: "Handcrafted resin designs",
			linkTo: "/collections/kada/resin-kada",
			linkText: "Shop now"
		},
		offer: {
			title: "Flat 15% Off",
			subtitle: "on Kadas",
			description: "Limited time offer",
			linkTo: "/collections/kada",
			linkText: "View offers"
		}
	},
	{
		label: "Bracelets",
		to: "/collections/bracelets",
		links: [
			{
				label: "Gold Bracelet",
				to: "/collections/bracelets/gold-bracelet"
			},
			{
				label: "Charm Bracelet",
				to: "/collections/bracelets/charm-bracelet"
			},
			{
				label: "Tennis Bracelet",
				to: "/collections/bracelets/tennis-bracelet"
			},
			{
				label: "Everyday Bracelet",
				to: "/collections/bracelets/everyday-bracelet"
			}
		],
		featured: {
			title: "The Eternity",
			subtitle: "Tennis Bracelet",
			description: "Certified diamond channel set",
			linkTo: "/collections/bracelets/tennis-bracelet",
			linkText: "Shop now"
		},
		offer: {
			title: "Gold Bracelet",
			subtitle: "Special Price",
			description: "Flat 10% off",
			linkTo: "/collections/bracelets/gold-bracelet",
			linkText: "View offers"
		}
	}
];
function MegaMenu({ item, idx, total, onClose }) {
	const ref = (0, import_react.useRef)(null);
	const edgeClass = idx <= 1 ? "left-0" : idx >= total - 2 ? "right-0" : "left-1/2 -translate-x-1/2";
	(0, import_react.useEffect)(() => {
		const handleKeyDown = (e) => {
			if (e.key === "Escape") onClose();
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [onClose]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref,
		className: `absolute top-full z-50 pt-3 ${edgeClass}`,
		onMouseEnter: () => {},
		onMouseLeave: (e) => {
			const rect = ref.current?.getBoundingClientRect();
			if (rect) {
				const x = e.clientX;
				const y = e.clientY;
				if (x < rect.left - 10 || x > rect.right + 10 || y < rect.top - 10 || y > rect.bottom + 10) onClose();
			}
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-[580px] rounded-[28px] border border-[#e7ddcc] bg-white p-7 shadow-[0_24px_60px_rgba(26,26,46,0.14)]",
			style: { animation: "cmMegaIn 220ms ease-out" },
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `@keyframes cmMegaIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-3 gap-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
						className: "mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7A2533]",
						children: ["Shop ", item.label]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "space-y-0.5 text-sm text-[#3a3028]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: item.to,
							onClick: onClose,
							className: "block rounded-[12px] px-3 py-2 font-semibold text-[#7A2533] transition hover:bg-[#fdf8f3]",
							children: ["View All ", item.label]
						}) }), item.links.map((link) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: link.to,
							onClick: onClose,
							className: "block rounded-[12px] px-3 py-2 transition hover:bg-[#fdf8f3] hover:text-[#7A2533]",
							children: link.label
						}) }, link.label))]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-[20px] bg-gradient-to-br from-[#fdf8f3] to-[#f0e4cd] p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7A2533]",
								children: "Featured"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 font-display text-lg leading-tight text-[#1a1a2e]",
								children: [
									item.featured.title,
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									item.featured.subtitle
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-[#7a6e64]",
								children: item.featured.description
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: item.featured.linkTo,
								onClick: onClose,
								className: "mt-3 inline-block text-xs font-semibold uppercase tracking-widest text-[#7A2533]",
								children: [item.featured.linkText, " →"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-[20px] border border-[#7A2533]/30 p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7A2533]",
								children: "Offer"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 font-display text-base leading-tight text-[#1a1a2e]",
								children: [
									item.offer.title,
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									item.offer.subtitle
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-[#7a6e64]",
								children: item.offer.description
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: item.offer.linkTo,
								onClick: onClose,
								className: "mt-3 inline-block text-xs font-semibold uppercase tracking-widest text-[#7A2533]",
								children: [item.offer.linkText, " →"]
							})
						]
					})
				]
			})]
		})
	});
}
var Header = (0, import_react.memo)(function Header() {
	const [mobileOpen, setMobileOpen] = (0, import_react.useState)(false);
	const [activeMenuIdx, setActiveMenuIdx] = (0, import_react.useState)(null);
	const closeTimer = (0, import_react.useRef)(null);
	const { cartCount, wishlistCount, openCart, openWishlist } = useStore();
	const { user } = useAuth();
	const { data: categories = [] } = useQuery({
		queryKey: ["categories", "nav"],
		queryFn: () => categoriesApi.list(true),
		staleTime: 300 * 1e3
	});
	const { data: subcategories = [] } = useQuery({
		queryKey: ["subcategories", "nav"],
		queryFn: () => subcategoriesApi.list(true),
		staleTime: 300 * 1e3
	});
	const dynamicItems = categories.map((cat) => {
		const links = subcategories.filter((sub) => sub.category_id === cat.id).map((sub) => ({
			label: sub.name,
			to: `/collections/${cat.slug}/${sub.slug}`
		}));
		return {
			label: cat.name,
			to: `/collections/${cat.slug}`,
			links,
			featured: {
				title: cat.banner_heading || cat.name,
				subtitle: "Collection",
				description: cat.banner_description || cat.description || "Explore the latest Creative Muse edit.",
				linkTo: `/collections/${cat.slug}`,
				linkText: cat.cta_button_text || "Shop now"
			},
			offer: {
				title: "Private Styling",
				subtitle: "Available",
				description: "Book a personal jewellery consultation.",
				linkTo: "/contact",
				linkText: "Enquire"
			}
		};
	});
	const navItems = dynamicItems.length > 0 ? dynamicItems : NAV_ITEMS;
	const openMenu = (idx) => {
		if (closeTimer.current) window.clearTimeout(closeTimer.current);
		setActiveMenuIdx(idx);
	};
	const scheduleClose = () => {
		if (closeTimer.current) window.clearTimeout(closeTimer.current);
		closeTimer.current = window.setTimeout(() => setActiveMenuIdx(null), 180);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "sticky top-0 z-50",
		style: { background: "#fdf8f3" },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto max-w-[1440px] px-4 lg:px-8",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-[1fr_auto_1fr] items-center py-2.5 lg:py-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center lg:hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setMobileOpen(true),
							className: "flex h-11 w-11 items-center justify-center rounded-full hover:bg-[#f5efe8]",
							"aria-label": "Open menu",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-5 w-5 text-[#2a1e14]" })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "hidden lg:block" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "flex items-center justify-center",
						"aria-label": "Creative Muse — Home",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "/favicon.ico",
							alt: "Creative Muse",
							className: "h-[52px] w-[52px] object-contain md:h-[68px] md:w-[68px] lg:h-[80px] lg:w-[80px]"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-end gap-1 md:gap-2 lg:gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: openCart,
								className: "relative flex h-11 w-11 items-center justify-center rounded-full hover:bg-[#f5efe8]",
								"aria-label": "Cart",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, {
									className: "h-[20px] w-[20px] text-[#2a1e14]",
									strokeWidth: 1.9
								}), cartCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "absolute right-1 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#7A2533] px-1 text-[10px] font-semibold text-white",
									children: cartCount
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: openWishlist,
								className: "relative hidden h-11 w-11 items-center justify-center rounded-full hover:bg-[#f5efe8] md:flex",
								"aria-label": "Wishlist",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, {
									className: "h-[20px] w-[20px] text-[#2a1e14]",
									strokeWidth: 1.9
								}), wishlistCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "absolute right-1 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#7A2533] px-1 text-[10px] font-semibold text-white",
									children: wishlistCount
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: user ? "/account" : "/login",
								className: "hidden h-11 w-11 items-center justify-center rounded-full hover:bg-[#f5efe8] md:flex",
								"aria-label": user ? "Account" : "Login",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, {
									className: "h-[20px] w-[20px] text-[#2a1e14]",
									strokeWidth: 1.9
								})
							})
						]
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "border-t border-[#e0d8cc]/40",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "scrollbar-hide relative mx-auto hidden max-w-[1440px] items-center justify-center gap-0.5 overflow-visible px-2 py-2 lg:flex lg:px-4",
				"aria-label": "Primary",
				onMouseLeave: scheduleClose,
				onMouseEnter: () => closeTimer.current && window.clearTimeout(closeTimer.current),
				children: navItems.map((item, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: item.to,
						onMouseEnter: () => openMenu(idx),
						onFocus: () => openMenu(idx),
						onKeyDown: (e) => {
							if (e.key === "ArrowDown") {
								e.preventDefault();
								openMenu(idx);
							}
							if (e.key === "Escape") setActiveMenuIdx(null);
						},
						"aria-haspopup": "menu",
						"aria-expanded": activeMenuIdx === idx,
						className: "shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-[12.5px] font-semibold tracking-[0.01em] text-[#7A2533] transition-colors duration-200 hover:bg-[#fdf8f3] hover:text-[#7A2533] xl:px-4 xl:text-[13px]",
						children: item.label
					}), activeMenuIdx === idx && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MegaMenu, {
						item,
						idx,
						total: navItems.length,
						onClose: () => setActiveMenuIdx(null)
					})]
				}, item.label))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "scrollbar-hide mx-auto flex max-w-[1440px] items-center justify-center gap-0.5 overflow-x-auto px-2 py-2 lg:hidden",
				"aria-label": "Primary mobile shortcuts",
				children: navItems.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: item.to,
					className: "shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-[12.5px] font-semibold tracking-[0.01em] text-[#7A2533] transition-colors duration-200 hover:bg-[#fdf8f3] hover:text-[#7A2533]",
					children: item.label
				}, item.label))
			})]
		})]
	}), mobileOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileDrawer, {
		items: navItems,
		onClose: () => setMobileOpen(false)
	})] });
});
function MobileDrawer({ items, onClose }) {
	const [expandedIdx, setExpandedIdx] = (0, import_react.useState)(null);
	const { user } = useAuth();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-[60] lg:hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-0 bg-black/40 backdrop-blur-sm",
			onClick: onClose
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute left-0 top-0 flex h-full w-[85vw] max-w-[360px] flex-col rounded-r-[28px] bg-white p-6 shadow-[0_24px_64px_rgba(0,0,0,0.2)]",
			style: { animation: "cmDrawerIn 300ms ease" },
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `@keyframes cmDrawerIn{from{transform:translateX(-100%)}to{transform:translateX(0)}}` }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-6 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/favicon.ico",
						alt: "Creative Muse",
						className: "h-[48px] w-[48px] object-contain"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "flex h-12 w-12 items-center justify-center rounded-full bg-[#f5efe8]",
						"aria-label": "Close menu",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "flex-1 space-y-1 overflow-y-auto",
					children: [
						items.map((item, idx) => {
							const isExpanded = expandedIdx === idx;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: item.links.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setExpandedIdx(isExpanded ? null : idx),
								className: "flex min-h-[48px] w-full items-center justify-between rounded-[16px] px-5 py-3 text-sm font-medium text-[#7A2533] transition-colors hover:bg-[#f5efe8] hover:text-[#7A2533]",
								children: [item.label, isExpanded ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "h-4 w-4 opacity-50" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4 opacity-50" })]
							}), isExpanded && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "overflow-hidden pl-4",
								style: { animation: "cmAccordionIn 200ms ease-out" },
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `@keyframes cmAccordionIn{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "ml-3 border-l-2 border-[#8B1A1A]/30 pl-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: item.to,
										onClick: onClose,
										className: "flex min-h-[40px] items-center rounded-[12px] px-4 py-2 text-sm font-semibold text-[#7A2533] transition-colors hover:bg-[#f5efe8] hover:text-[#7A2533]",
										children: ["View All ", item.label]
									}), item.links.map((link) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: link.to,
										onClick: onClose,
										className: "flex min-h-[40px] items-center rounded-[12px] px-4 py-2 text-sm text-[#7A2533] transition-colors hover:bg-[#f5efe8] hover:text-[#7A2533]",
										children: link.label
									}, link.label))]
								})]
							})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: item.to,
								onClick: onClose,
								className: "flex min-h-[48px] w-full items-center rounded-[16px] px-5 py-3 text-sm font-medium text-[#7A2533] transition-colors hover:bg-[#f5efe8] hover:text-[#7A2533]",
								children: item.label
							}) }, item.label);
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "my-4 border-t border-[#e0d8cc]/60" }),
						[
							{
								label: "Wishlist",
								to: "/wishlist"
							},
							{
								label: "Shop All",
								to: "/shop"
							},
							{
								label: "Collections",
								to: "/collections"
							},
							{
								label: user ? "Account" : "Login",
								to: user ? "/account" : "/login"
							}
						].map(({ label, to }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to,
							onClick: onClose,
							className: "flex min-h-[48px] w-full items-center rounded-[16px] px-5 py-3 text-sm text-[#7A2533] transition-colors hover:bg-[#f5efe8] hover:text-[#7A2533]",
							children: label
						}, label)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "my-4 border-t border-[#e0d8cc]/60" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: "tel:+919033779867",
							className: "flex min-h-[48px] items-center gap-3 rounded-[16px] px-5 py-3 text-sm text-[#3a3028]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, {
								className: "h-5 w-5 text-[#8B1A1A]",
								strokeWidth: 1.6
							}), "+91 90337 79867"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: "https://wa.me/919033779867",
							target: "_blank",
							rel: "noreferrer",
							className: "mt-3 flex items-center justify-center gap-2 rounded-full bg-[#7A2533] px-5 py-3 text-sm font-semibold text-white hover:bg-[#5F1C27]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-4 w-4" }), "Chat on WhatsApp"]
						})
					]
				})
			]
		})]
	});
}
function Footer() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: "mt-20 rounded-t-[40px] bg-[#1A1715] px-6 pt-20 pb-8 text-white/80 sm:px-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-[1280px] gap-12 lg:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "/favicon.ico",
							alt: "Creative Muse",
							className: "h-[64px] w-[64px] object-contain brightness-0 invert md:h-[80px] md:w-[80px]"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-5 max-w-xs text-sm leading-relaxed text-white/60",
							children: "Where every gem tells your story. Handcrafted fine jewellery from Vadodara."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-6 space-y-2.5 text-[13px] text-white/80",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-start gap-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "mt-0.5 h-4 w-4 shrink-0 text-[#7A2533]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "GF-3/4, Vidhi Square, BPC Road, Vadodara 390020" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-center gap-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-4 w-4 text-[#7A2533]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: "tel:+919033779867",
										children: "+91 90337 79867"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-center gap-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-4 w-4 text-[#7A2533]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: "mailto:hello@creativemuse.in",
										children: "hello@creativemuse.in"
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6 flex gap-2.5",
							children: [
								Instagram,
								Facebook,
								Youtube
							].map((Ic, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "#",
								"aria-label": "social",
								className: "flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-[#cfc6b6] transition-colors hover:bg-[#7A2533]/20 hover:text-[#7A2533]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ic, { className: "h-4 w-4" })
							}, i))
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FooterCol, {
					title: "Shop",
					links: [
						["Rings", "/shop"],
						["Necklaces", "/shop"],
						["Earrings", "/shop"],
						["Bracelets", "/shop"],
						["Bangles", "/shop"],
						["Wedding Sets", "/shop"]
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FooterCol, {
					title: "Company",
					links: [["About", "/about"], ["Blog", "/blog"]]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FooterCol, {
					title: "Support",
					links: [
						["FAQ", "/faq"],
						["Track Order", "/track-order"],
						["Returns", "/refund-policy"],
						["Shipping", "/shipping-policy"],
						["Privacy", "/privacy-policy"],
						["Contact", "/contact"]
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto mt-16 flex max-w-[1280px] flex-col items-center justify-between gap-6 border-t border-white/10 pt-6 sm:flex-row sm:gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-xs text-white/60",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "© 2026 All Rights Reserved By Creative Muse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1",
					children: [
						"Designed & Developed By",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "https://apfpuniversal.com",
							target: "_blank",
							rel: "noopener noreferrer",
							className: "text-white hover:underline",
							children: "APFP UNIVERSAL"
						})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 place-items-center gap-x-8 gap-y-4 sm:flex sm:items-center sm:justify-end sm:gap-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/payment-methods/razorpay.svg",
						alt: "Razorpay",
						className: "h-7 w-auto opacity-90 transition-opacity hover:opacity-100"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/payment-methods/upi.svg",
						alt: "UPI",
						className: "h-7 w-auto opacity-90 transition-opacity hover:opacity-100"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/payment-methods/visa.svg",
						alt: "Visa",
						className: "h-7 w-auto opacity-90 transition-opacity hover:opacity-100"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/payment-methods/mastercard.svg",
						alt: "Mastercard",
						className: "h-7 w-auto opacity-90 transition-opacity hover:opacity-100"
					})
				]
			})]
		})]
	});
}
function FooterCol({ title, links }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
			className: "font-display text-base text-white",
			children: title
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "gold-divider mt-3" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-5 space-y-2.5 text-[13px] text-white/80",
			children: links.map(([label, to]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to,
				className: "transition-colors hover:text-[#7A2533]",
				children: label
			}) }, label))
		})
	] });
}
var Overlays = (0, import_react.lazy)(() => import("./Overlays-BQJl1dzv.mjs").then((m) => ({ default: m.Overlays })));
function SiteChrome({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoreProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen flex-col bg-[#fdf8f3]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnnouncementBar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "flex-1",
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
				fallback: null,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overlays, {})
			})
		]
	}) });
}
var NewsletterPopup = (0, import_react.lazy)(() => import("./NewsletterPopup-CQWUOPIq.mjs").then((m) => ({ default: m.NewsletterPopup })));
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteChrome, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-[60vh] items-center justify-center px-4 py-24",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-7xl text-[#1a1a2e]",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-[#7a6e64]",
					children: "We couldn't find that piece. Let's get you back to the showroom."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "btn-primary mt-8 inline-flex",
					children: "Back to Home"
				})
			]
		})
	}) });
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-[#fdf8f3] px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-2xl text-[#1a1a2e]",
					children: "Something went wrong"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-[#7a6e64]",
					children: "Please try again in a moment."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex justify-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "btn-primary",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "btn-secondary",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$53 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Creative Muse Fine Jewellery — Where Every Gem Tells Your Story" },
			{
				name: "description",
				content: "Discover handcrafted fine jewellery from Vadodara. BIS Hallmarked gold, IGI certified diamonds, bridal collections and everyday luxury."
			},
			{
				name: "author",
				content: "Creative Muse Fine Jewellery"
			},
			{
				property: "og:title",
				content: "Creative Muse Fine Jewellery — Where Every Gem Tells Your Story"
			},
			{
				property: "og:description",
				content: "Discover handcrafted fine jewellery from Vadodara. BIS Hallmarked gold, IGI certified diamonds, bridal collections and everyday luxury."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:title",
				content: "Creative Muse Fine Jewellery — Where Every Gem Tells Your Story"
			},
			{
				name: "description",
				content: "Discover handcrafted fine jewellery from Vadodara. BIS Hallmarked gold, IGI certified diamonds, bridal collections and everyday luxury."
			},
			{
				property: "og:description",
				content: "Discover handcrafted fine jewellery from Vadodara. BIS Hallmarked gold, IGI certified diamonds, bridal collections and everyday luxury."
			},
			{
				name: "twitter:description",
				content: "Discover handcrafted fine jewellery from Vadodara. BIS Hallmarked gold, IGI certified diamonds, bridal collections and everyday luxury."
			},
			{
				property: "og:image",
				content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/1869e11e-6ff3-4375-826e-0f139a12213c/id-preview-0ff5cf96--81d62c91-1c7a-403d-bf94-b2e6932241d2.lovable.app-1782737695056.png"
			},
			{
				name: "twitter:image",
				content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/1869e11e-6ff3-4375-826e-0f139a12213c/id-preview-0ff5cf96--81d62c91-1c7a-403d-bf94-b2e6932241d2.lovable.app-1782737695056.png"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Montserrat:wght@300;400;500;600;700&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$53.useRouteContext();
	const location = useLocation();
	const isAdminRoute = location.pathname.startsWith("/admin");
	const isStandaloneAuthRoute = location.pathname === "/forgot-password" || location.pathname === "/reset-password";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: isAdminRoute ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) : isStandaloneAuthRoute ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddressProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddressProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteChrome, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
			fallback: null,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewsletterPopup, {})
		})] }) }) })
	});
}
var $$splitComponentImporter$51 = () => import("./wishlist-CljTel-2.mjs");
var Route$52 = createFileRoute("/wishlist")({
	head: () => ({ meta: [{ title: "Wishlist - Creative Muse" }] }),
	component: lazyRouteComponent($$splitComponentImporter$51, "component")
});
var $$splitComponentImporter$50 = () => import("./track-order-C46pukYV.mjs");
var Route$51 = createFileRoute("/track-order")({
	head: () => ({ meta: [{ title: "Track Order - Creative Muse" }] }),
	component: lazyRouteComponent($$splitComponentImporter$50, "component")
});
var $$splitComponentImporter$49 = () => import("./terms-and-conditions-CmSe_2BD.mjs");
var Route$50 = createFileRoute("/terms-and-conditions")({
	head: () => ({ meta: [
		{ title: "Terms & Conditions | Creative Muse" },
		{
			name: "description",
			content: "Read the terms governing use of the Creative Muse website, customer accounts, orders, payments and purchases."
		},
		{
			property: "og:title",
			content: "Terms & Conditions | Creative Muse"
		},
		{
			property: "og:description",
			content: "Read the terms governing use of the Creative Muse website, customer accounts, orders, payments and purchases."
		},
		{
			property: "og:url",
			content: "https://creativemusee.com/terms-and-conditions"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$49, "component")
});
var $$splitComponentImporter$48 = () => import("./terms-BxLGSRG6.mjs");
var Route$49 = createFileRoute("/terms")({
	head: () => ({ meta: [{ title: "Terms of Service — Creative Muse" }] }),
	component: lazyRouteComponent($$splitComponentImporter$48, "component")
});
var $$splitComponentImporter$47 = () => import("./signup-zxpLbV7y.mjs");
var Route$48 = createFileRoute("/signup")({ component: lazyRouteComponent($$splitComponentImporter$47, "component") });
var $$splitComponentImporter$46 = () => import("./shop-cV3mexjH.mjs");
var Route$47 = createFileRoute("/shop")({
	validateSearch: (search) => ({
		category: typeof search.category === "string" ? search.category : "",
		metal: typeof search.metal === "string" ? search.metal : "",
		minPrice: typeof search.minPrice === "string" ? search.minPrice : "",
		maxPrice: typeof search.maxPrice === "string" ? search.maxPrice : "",
		sort: sortFromUrl(search.sort)
	}),
	head: () => ({ meta: [{ title: "Shop Fine Jewellery — Creative Muse" }, {
		name: "description",
		content: "Browse rings, necklaces, earrings, bracelets and bridal sets — handcrafted in Vadodara."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$46, "component")
});
var $$splitComponentImporter$45 = () => import("./shipping-policy-DGwfbZvJ.mjs");
var Route$46 = createFileRoute("/shipping-policy")({
	head: () => ({ meta: [
		{ title: "Shipping Policy | Creative Muse" },
		{
			name: "description",
			content: "Learn about Creative Muse order processing, shipping charges, delivery timelines, tracking and shipping conditions."
		},
		{
			property: "og:title",
			content: "Shipping Policy | Creative Muse"
		},
		{
			property: "og:description",
			content: "Learn about Creative Muse order processing, shipping charges, delivery timelines, tracking and shipping conditions."
		},
		{
			property: "og:url",
			content: "https://creativemusee.com/shipping-policy"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$45, "component")
});
var $$splitComponentImporter$44 = () => import("./reset-password-n2qlo53u.mjs");
var Route$45 = createFileRoute("/reset-password")({ component: lazyRouteComponent($$splitComponentImporter$44, "component") });
var $$splitComponentImporter$43 = () => import("./refund-return-policy-CQZo3HAV.mjs");
var Route$44 = createFileRoute("/refund-return-policy")({
	head: () => ({ meta: [
		{ title: "Refund & Return Policy | Creative Muse" },
		{
			name: "description",
			content: "Review Creative Muse return eligibility, exchanges, refunds, cancellations and store-credit conditions."
		},
		{
			property: "og:title",
			content: "Refund & Return Policy | Creative Muse"
		},
		{
			property: "og:description",
			content: "Review Creative Muse return eligibility, exchanges, refunds, cancellations and store-credit conditions."
		},
		{
			property: "og:url",
			content: "https://creativemusee.com/refund-return-policy"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$43, "component")
});
var $$splitComponentImporter$42 = () => import("./refund-policy-BtwFiSuz.mjs");
var Route$43 = createFileRoute("/refund-policy")({
	head: () => ({ meta: [{ title: "Refund Policy — Creative Muse" }] }),
	component: lazyRouteComponent($$splitComponentImporter$42, "component")
});
var $$splitComponentImporter$41 = () => import("./privacy-policy-CrSItaqy.mjs");
var Route$42 = createFileRoute("/privacy-policy")({
	head: () => ({ meta: [
		{ title: "Privacy Policy | Creative Muse" },
		{
			name: "description",
			content: "Read the Creative Muse Privacy Policy and learn how personal information is collected, used, stored and protected."
		},
		{
			property: "og:title",
			content: "Privacy Policy | Creative Muse"
		},
		{
			property: "og:description",
			content: "Read the Creative Muse Privacy Policy and learn how personal information is collected, used, stored and protected."
		},
		{
			property: "og:url",
			content: "https://creativemusee.com/privacy-policy"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$41, "component")
});
var $$splitComponentImporter$40 = () => import("./payment-Ci_a5P9P.mjs");
var Route$41 = createFileRoute("/payment")({ component: lazyRouteComponent($$splitComponentImporter$40, "component") });
var $$splitComponentImporter$39 = () => import("./login-DvGd7J8F.mjs");
var Route$40 = createFileRoute("/login")({ component: lazyRouteComponent($$splitComponentImporter$39, "component") });
var $$splitComponentImporter$38 = () => import("./forgot-password-2L2FEgbK.mjs");
var Route$39 = createFileRoute("/forgot-password")({ component: lazyRouteComponent($$splitComponentImporter$38, "component") });
var $$splitComponentImporter$37 = () => import("./faq-CTxofRnV.mjs");
var Route$38 = createFileRoute("/faq")({
	head: () => ({ meta: [{ title: "FAQ — Creative Muse" }] }),
	component: lazyRouteComponent($$splitComponentImporter$37, "component")
});
var $$splitComponentImporter$36 = () => import("./contact-D5IFtWet.mjs");
var Route$37 = createFileRoute("/contact")({
	head: () => ({ meta: [{ title: "Contact — Creative Muse" }, {
		name: "description",
		content: "Visit our Vadodara atelier or write to us."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$36, "component")
});
var $$splitComponentImporter$35 = () => import("./collections-De0RzZ6d.mjs");
var Route$36 = createFileRoute("/collections")({
	head: () => ({ meta: [{ title: "Collections — Creative Muse" }] }),
	component: lazyRouteComponent($$splitComponentImporter$35, "component")
});
var $$splitComponentImporter$34 = () => import("./checkout-B_qwxI6I.mjs");
var Route$35 = createFileRoute("/checkout")({ component: lazyRouteComponent($$splitComponentImporter$34, "component") });
var $$splitComponentImporter$33 = () => import("./cart-CFlBBx6b.mjs");
var Route$34 = createFileRoute("/cart")({
	head: () => ({ meta: [{ title: "Your Cart — Creative Muse" }, {
		name: "description",
		content: "Review the pieces in your cart."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$33, "component")
});
var $$splitComponentImporter$32 = () => import("./blog-OiwWCSbi.mjs");
var Route$33 = createFileRoute("/blog")({
	head: () => ({ meta: [{ title: "Blog — Creative Muse Journal" }] }),
	component: lazyRouteComponent($$splitComponentImporter$32, "component")
});
var $$splitComponentImporter$31 = () => import("./account-DgF1RBsx.mjs");
var Route$32 = createFileRoute("/account")({
	head: () => ({ meta: [{ title: "My Account — Creative Muse" }] }),
	component: lazyRouteComponent($$splitComponentImporter$31, "component")
});
var $$splitComponentImporter$30 = () => import("./about-C0-Z60oL.mjs");
var Route$31 = createFileRoute("/about")({
	head: () => ({ meta: [{ title: "About — Creative Muse Fine Jewellery" }, {
		name: "description",
		content: "Our story, our craft, our promise — from Vadodara to your forever."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$30, "component")
});
var $$splitComponentImporter$29 = () => import("./routes-aJ219ZnF.mjs");
var Route$30 = createFileRoute("/")({
	head: () => ({
		meta: [
			{ title: "Creative Muse Fine Jewellery — Where Every Gem Tells Your Story" },
			{
				name: "description",
				content: "Discover handcrafted fine jewellery from Vadodara. BIS Hallmarked gold, IGI certified diamonds, bridal collections and everyday luxury."
			},
			{
				property: "og:title",
				content: "Creative Muse Fine Jewellery — Where Every Gem Tells Your Story"
			},
			{
				property: "og:description",
				content: "Discover handcrafted fine jewellery from Vadodara. BIS Hallmarked gold, IGI certified diamonds, bridal collections and everyday luxury."
			}
		],
		links: [{
			rel: "preload",
			href: hero_ring_default,
			as: "image"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$29, "component")
});
var $$splitComponentImporter$28 = () => import("./admin.index-BPH28pNb.mjs");
var Route$29 = createFileRoute("/admin/")({
	beforeLoad: async () => {
		const { adminApi } = await import("./admin-Cd48uf7H.mjs").then((n) => n.n).then((n) => n.n);
		if (!await adminApi.getSession()) throw redirect({ to: "/admin/login" });
	},
	component: lazyRouteComponent($$splitComponentImporter$28, "component")
});
var $$splitComponentImporter$27 = () => import("./order-success._orderNumber-DV0oryge.mjs");
var Route$28 = createFileRoute("/order-success/$orderNumber")({ component: lazyRouteComponent($$splitComponentImporter$27, "component") });
var $$splitComponentImporter$26 = () => import("./collections._slug-C_kXdnnr.mjs");
var Route$27 = createFileRoute("/collections/$slug")({
	head: ({ params }) => ({ meta: [{ title: `${params.slug.replace(/-/g, " ")} — Creative Muse` }] }),
	component: lazyRouteComponent($$splitComponentImporter$26, "component")
});
var $$splitComponentImporter$25 = () => import("./auth.callback-RAQt6QQL.mjs");
var Route$26 = createFileRoute("/auth/callback")({
	head: () => ({ meta: [{ title: "Signing you in — Creative Muse" }] }),
	component: lazyRouteComponent($$splitComponentImporter$25, "component")
});
var $$splitComponentImporter$24 = () => import("./admin.subcategories-DnbNlNhE.mjs");
var Route$25 = createFileRoute("/admin/subcategories")({
	beforeLoad: requireAdmin,
	component: lazyRouteComponent($$splitComponentImporter$24, "component")
});
var $$splitComponentImporter$23 = () => import("./admin.specifications-CSN9jQ43.mjs");
var Route$24 = createFileRoute("/admin/specifications")({
	beforeLoad: requireAdmin,
	component: lazyRouteComponent($$splitComponentImporter$23, "component")
});
var $$splitComponentImporter$22 = () => import("./admin.settings-BnHP6Ho8.mjs");
var Route$23 = createFileRoute("/admin/settings")({
	beforeLoad: requireAdmin,
	component: lazyRouteComponent($$splitComponentImporter$22, "component")
});
var $$splitComponentImporter$21 = () => import("./admin.reels-CeXL3GJI.mjs");
var Route$22 = createFileRoute("/admin/reels")({
	beforeLoad: requireAdmin,
	component: lazyRouteComponent($$splitComponentImporter$21, "component")
});
var $$splitComponentImporter$20 = () => import("./admin.products-BYuev-rM.mjs");
var Route$21 = createFileRoute("/admin/products")({
	beforeLoad: requireAdmin,
	component: lazyRouteComponent($$splitComponentImporter$20, "component")
});
var $$splitComponentImporter$19 = () => import("./admin.product-flags-Bb-6KxCO.mjs");
var Route$20 = createFileRoute("/admin/product-flags")({
	beforeLoad: requireAdmin,
	component: lazyRouteComponent($$splitComponentImporter$19, "component")
});
var $$splitComponentImporter$18 = () => import("./admin.orders-DqixGLrL.mjs");
var Route$19 = createFileRoute("/admin/orders")({
	beforeLoad: requireAdmin,
	component: lazyRouteComponent($$splitComponentImporter$18, "component")
});
var $$splitComponentImporter$17 = () => import("./admin.newsletter-C7bJrvJZ.mjs");
var Route$18 = createFileRoute("/admin/newsletter")({
	beforeLoad: requireAdmin,
	component: lazyRouteComponent($$splitComponentImporter$17, "component")
});
var $$splitComponentImporter$16 = () => import("./admin.media-Qe6NsD-Z.mjs");
var Route$17 = createFileRoute("/admin/media")({
	beforeLoad: requireAdmin,
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
var $$splitComponentImporter$15 = () => import("./admin.login-DoISlcLl.mjs");
var Route$16 = createFileRoute("/admin/login")({ component: lazyRouteComponent($$splitComponentImporter$15, "component") });
var $$splitComponentImporter$14 = () => import("./admin.inventory-DO_djTe8.mjs");
var Route$15 = createFileRoute("/admin/inventory")({
	beforeLoad: requireAdmin,
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
var $$splitComponentImporter$13 = () => import("./admin.homepage-GsUN3L--.mjs");
var Route$14 = createFileRoute("/admin/homepage")({
	beforeLoad: requireAdmin,
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./admin.enquiries-DOOzTRfR.mjs");
var Route$13 = createFileRoute("/admin/enquiries")({
	beforeLoad: requireAdmin,
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./admin.customers-OR52lBfM.mjs");
var Route$12 = createFileRoute("/admin/customers")({
	beforeLoad: requireAdmin,
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var db = () => supabase;
var couponsApi = {
	async list() {
		const { data, error } = await db().from("coupons").select("*").order("created_at", { ascending: false });
		if (error) throw error;
		const coupons = data || [];
		const result = [];
		for (const c of coupons) {
			const { data: scopes } = await db().from("coupon_scopes").select("scope_type, scope_id").eq("coupon_id", c.id);
			const scopeCount = (scopes || []).length;
			const productCount = (scopes || []).filter((s) => s.scope_type === "product").length;
			const categoryCount = (scopes || []).filter((s) => s.scope_type === "category").length;
			result.push({
				...c,
				scope_count: c.coupon_scope === "selected_products" ? productCount : c.coupon_scope === "selected_categories" ? categoryCount : scopeCount
			});
		}
		return result;
	},
	async getById(id) {
		const { data, error } = await db().from("coupons").select("*").eq("id", id).maybeSingle();
		if (error) return null;
		return data;
	},
	async create(data) {
		const { data: result, error } = await db().from("coupons").insert(data).select().single();
		if (error) throw error;
		return result;
	},
	async update(id, data) {
		const { error } = await db().from("coupons").update(data).eq("id", id);
		if (error) throw error;
	},
	async delete(id) {
		const { error } = await db().from("coupons").delete().eq("id", id);
		if (error) throw error;
	},
	async getScopes(couponId) {
		const { data, error } = await db().from("coupon_scopes").select("*").eq("coupon_id", couponId).order("created_at");
		if (error) throw error;
		return data || [];
	},
	async setScopes(couponId, scopes) {
		const { error: delError } = await db().from("coupon_scopes").delete().eq("coupon_id", couponId);
		if (delError) throw delError;
		if (scopes.length === 0) return;
		const { error } = await db().from("coupon_scopes").insert(scopes.map((s) => ({
			coupon_id: couponId,
			...s
		})));
		if (error) throw error;
	},
	async getRestrictions(couponId) {
		const { data, error } = await db().from("coupon_restrictions").select("*").eq("coupon_id", couponId).order("created_at");
		if (error) throw error;
		return data || [];
	},
	async setRestrictions(couponId, restrictions) {
		const { error: delError } = await db().from("coupon_restrictions").delete().eq("coupon_id", couponId);
		if (delError) throw delError;
		if (restrictions.length === 0) return;
		const { error } = await db().from("coupon_restrictions").insert(restrictions.map((r) => ({
			coupon_id: couponId,
			...r
		})));
		if (error) throw error;
	}
};
var Route$11 = createFileRoute("/admin/coupons")({
	beforeLoad: requireAdmin,
	component: AdminCoupons
});
function AdminCoupons() {
	const [coupons, setCoupons] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [showForm, setShowForm] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)({
		code: "",
		coupon_scope: "entire_store",
		discount_type: "percentage",
		discount_value: 0,
		min_order_value: 0,
		max_discount: 0,
		usage_limit: 0,
		per_user_usage_limit: 1,
		first_order_only: false,
		is_active: true,
		start_date: "",
		customer_group: "",
		guest_allowed: true,
		logged_in_only: false,
		min_items: 0,
		max_items: 0
	});
	const [selectedProductIds, setSelectedProductIds] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const [selectedCategoryIds, setSelectedCategoryIds] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const [allProducts, setAllProducts] = (0, import_react.useState)([]);
	const [allCategories, setAllCategories] = (0, import_react.useState)([]);
	const [productsLoading, setProductsLoading] = (0, import_react.useState)(false);
	const [categoriesLoading, setCategoriesLoading] = (0, import_react.useState)(false);
	const fetch = async () => {
		setLoading(true);
		try {
			const data = await couponsApi.list();
			setCoupons(data);
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		fetch();
	}, []);
	const loadProducts = async () => {
		if (allProducts.length > 0) return;
		setProductsLoading(true);
		try {
			const { data } = await productsApi.list({}, 1, 1e3);
			setAllProducts(data || []);
		} catch (err) {
			console.error(err);
		} finally {
			setProductsLoading(false);
		}
	};
	const loadCategories = async () => {
		if (allCategories.length > 0) return;
		setCategoriesLoading(true);
		try {
			const data = await categoriesApi.list();
			setAllCategories(data || []);
		} catch (err) {
			console.error(err);
		} finally {
			setCategoriesLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		if (form.coupon_scope === "selected_products") loadProducts();
		if (form.coupon_scope === "selected_categories") loadCategories();
	}, [form.coupon_scope]);
	const resetForm = () => {
		setForm({
			code: "",
			coupon_scope: "entire_store",
			discount_type: "percentage",
			discount_value: 0,
			min_order_value: 0,
			max_discount: 0,
			usage_limit: 0,
			per_user_usage_limit: 1,
			first_order_only: false,
			is_active: true,
			start_date: "",
			customer_group: "",
			guest_allowed: true,
			logged_in_only: false,
			min_items: 0,
			max_items: 0
		});
		setSelectedProductIds(/* @__PURE__ */ new Set());
		setSelectedCategoryIds(/* @__PURE__ */ new Set());
		setEditing(null);
	};
	const openEdit = async (coupon) => {
		setForm({
			code: coupon.code,
			coupon_scope: coupon.coupon_scope || "entire_store",
			discount_type: coupon.discount_type,
			discount_value: coupon.discount_value,
			min_order_value: coupon.min_cart_value || 0,
			max_discount: coupon.max_discount || 0,
			usage_limit: coupon.total_usage_limit || 0,
			per_user_usage_limit: coupon.per_user_usage_limit || 1,
			first_order_only: coupon.first_order_only || false,
			is_active: coupon.is_active,
			start_date: coupon.start_date ? coupon.start_date.slice(0, 16) : "",
			customer_group: coupon.customer_group || "",
			guest_allowed: coupon.guest_allowed ?? true,
			logged_in_only: coupon.logged_in_only || false,
			min_items: coupon.min_items || 0,
			max_items: coupon.max_items || 0
		});
		setEditing(coupon);
		setShowForm(true);
		try {
			const scopes = await couponsApi.getScopes(coupon.id);
			const productIds = /* @__PURE__ */ new Set();
			const categoryIds = /* @__PURE__ */ new Set();
			for (const s of scopes) {
				if (s.scope_type === "product" && s.scope_id) productIds.add(s.scope_id);
				if (s.scope_type === "category" && s.scope_id) categoryIds.add(s.scope_id);
			}
			setSelectedProductIds(productIds);
			setSelectedCategoryIds(categoryIds);
			if (productIds.size > 0) loadProducts();
			if (categoryIds.size > 0) loadCategories();
		} catch {}
	};
	const handleSave = async () => {
		if (!form.code || form.discount_value <= 0) return;
		if (form.coupon_scope === "selected_products" && selectedProductIds.size === 0) {
			alert("Please select at least one product.");
			return;
		}
		if (form.coupon_scope === "selected_categories" && selectedCategoryIds.size === 0) {
			alert("Please select at least one category.");
			return;
		}
		setSaving(true);
		try {
			const payload = {
				code: form.code,
				coupon_scope: form.coupon_scope,
				discount_type: form.discount_type,
				discount_value: form.discount_value,
				min_cart_value: form.min_order_value,
				max_discount: form.max_discount,
				total_usage_limit: form.usage_limit,
				per_user_usage_limit: form.per_user_usage_limit,
				first_order_only: form.first_order_only,
				is_active: form.is_active,
				start_date: form.start_date ? new Date(form.start_date).toISOString() : null,
				customer_group: form.customer_group || null,
				guest_allowed: form.guest_allowed,
				logged_in_only: form.logged_in_only,
				min_items: form.min_items || null,
				max_items: form.max_items || null
			};
			let couponId;
			if (editing) {
				await couponsApi.update(editing.id, payload);
				couponId = editing.id;
			} else couponId = (await couponsApi.create(payload)).id;
			const scopes = [];
			if (form.coupon_scope === "selected_products") for (const pid of selectedProductIds) {
				const p = allProducts.find((x) => x.id === pid);
				scopes.push({
					scope_type: "product",
					scope_id: pid,
					scope_label: p?.name || pid,
					rule_type: "include"
				});
			}
			else if (form.coupon_scope === "selected_categories") for (const cid of selectedCategoryIds) {
				const c = allCategories.find((x) => x.id === cid);
				scopes.push({
					scope_type: "category",
					scope_id: cid,
					scope_label: c?.name || cid,
					rule_type: "include"
				});
			}
			await couponsApi.setScopes(couponId, scopes);
			setShowForm(false);
			resetForm();
			fetch();
		} catch (err) {
			alert(err.message);
		} finally {
			setSaving(false);
		}
	};
	const handleDelete = async (id, code) => {
		if (!window.confirm(`Delete coupon "${code}"?`)) return;
		try {
			await couponsApi.delete(id);
			fetch();
		} catch (err) {
			console.error(err);
		}
	};
	const formatValue = (c) => {
		if (c.discount_type === "percentage") return `${c.discount_value}%`;
		return "₹" + Number(c.discount_value).toLocaleString("en-IN");
	};
	const formatScope = (c) => {
		if (c.coupon_scope === "entire_store" || !c.coupon_scope) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-xs font-medium text-gray-600",
			children: "Entire Store"
		});
		if (c.coupon_scope === "selected_products") {
			const count = c.scope_count ?? 0;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-xs font-medium text-gray-600",
				children: [
					count,
					" Product",
					count !== 1 ? "s" : ""
				]
			});
		}
		if (c.coupon_scope === "selected_categories") {
			const count = c.scope_count ?? 0;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-xs font-medium text-gray-600",
				children: [
					count,
					" Categor",
					count !== 1 ? "ies" : "y"
				]
			});
		}
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-xs text-gray-400",
			children: "—"
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminLayout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPageHeader, {
			title: "Coupons",
			description: `${coupons.length} coupons`,
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => {
					resetForm();
					setShowForm(true);
				},
				className: "flex items-center gap-2 rounded-lg bg-[#1a1a2e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2d1b4e]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Add Coupon"]
			})
		}),
		showForm && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 rounded-xl border border-gray-200 bg-white p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-lg font-bold text-[#1a1a2e] mb-4",
					children: editing ? "Edit Coupon" : "New Coupon"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1",
							children: "Code"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: form.code,
							onChange: (e) => setForm({
								...form,
								code: e.target.value.toUpperCase()
							}),
							className: "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]",
							placeholder: "SUMMER25"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1",
							children: "Discount Type"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: form.discount_type,
							onChange: (e) => setForm({
								...form,
								discount_type: e.target.value
							}),
							className: "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "percentage",
								children: "Percentage"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "fixed",
								children: "Fixed Amount"
							})]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1",
							children: "Value"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							value: form.discount_value,
							onChange: (e) => setForm({
								...form,
								discount_value: Number(e.target.value)
							}),
							className: "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1",
							children: "Coupon Scope"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: form.coupon_scope,
							onChange: (e) => setForm({
								...form,
								coupon_scope: e.target.value
							}),
							className: "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "entire_store",
									children: "Entire Store"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "selected_categories",
									children: "Selected Categories"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "selected_products",
									children: "Selected Products"
								})
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1",
							children: "Min Order Value"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							value: form.min_order_value,
							onChange: (e) => setForm({
								...form,
								min_order_value: Number(e.target.value)
							}),
							className: "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1",
							children: "Max Discount"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							value: form.max_discount,
							onChange: (e) => setForm({
								...form,
								max_discount: Number(e.target.value)
							}),
							className: "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1",
							children: "Usage Limit"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							value: form.usage_limit,
							onChange: (e) => setForm({
								...form,
								usage_limit: Number(e.target.value)
							}),
							className: "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1",
							children: "Per User Limit"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							value: form.per_user_usage_limit,
							onChange: (e) => setForm({
								...form,
								per_user_usage_limit: Number(e.target.value)
							}),
							className: "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
						})] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex items-center gap-4 flex-wrap",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: form.is_active,
								onChange: (e) => setForm({
									...form,
									is_active: e.target.checked
								}),
								className: "rounded"
							}), "Active"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: form.first_order_only,
								onChange: (e) => setForm({
									...form,
									first_order_only: e.target.checked
								}),
								className: "rounded"
							}), "First Order Only"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: form.logged_in_only,
								onChange: (e) => setForm({
									...form,
									logged_in_only: e.target.checked
								}),
								className: "rounded"
							}), "Logged In Only"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: !form.guest_allowed,
								onChange: (e) => setForm({
									...form,
									guest_allowed: !e.target.checked
								}),
								className: "rounded"
							}), "Block Guests"]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1",
							children: "Start Date"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "datetime-local",
							value: form.start_date,
							onChange: (e) => setForm({
								...form,
								start_date: e.target.value
							}),
							className: "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1",
							children: "Customer Group"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: form.customer_group,
							onChange: (e) => setForm({
								...form,
								customer_group: e.target.value
							}),
							className: "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]",
							placeholder: "VIP, Wholesale, etc."
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1",
							children: "Min Items"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							value: form.min_items,
							onChange: (e) => setForm({
								...form,
								min_items: Number(e.target.value)
							}),
							className: "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1",
							children: "Max Items"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							value: form.max_items,
							onChange: (e) => setForm({
								...form,
								max_items: Number(e.target.value)
							}),
							className: "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
						})] })
					]
				}),
				form.coupon_scope === "selected_products" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1",
						children: [
							"Select Products (",
							selectedProductIds.size,
							" selected)"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchableMultiSelect, {
						items: allProducts.map((p) => ({
							id: p.id,
							label: p.name
						})),
						selected: selectedProductIds,
						onChange: setSelectedProductIds,
						placeholder: "Search products...",
						loading: productsLoading
					})]
				}),
				form.coupon_scope === "selected_categories" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1",
						children: [
							"Select Categories (",
							selectedCategoryIds.size,
							" selected)"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchableMultiSelect, {
						items: allCategories.map((c) => ({
							id: c.id,
							label: c.name
						})),
						selected: selectedCategoryIds,
						onChange: setSelectedCategoryIds,
						placeholder: "Search categories...",
						loading: categoriesLoading
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: handleSave,
						disabled: saving,
						className: "rounded-lg bg-[#1a1a2e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2d1b4e] disabled:opacity-50",
						children: saving ? "Saving..." : editing ? "Update" : "Create"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							setShowForm(false);
							resetForm();
						},
						className: "rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50",
						children: "Cancel"
					})]
				})
			]
		}),
		loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLoading, {}) : coupons.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminEmpty, {
			title: "No coupons yet",
			description: "Create discount coupons to promote your products."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto rounded-xl border border-gray-200 bg-white",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-left text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-gray-100 bg-gray-50",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider",
							children: "Code"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider",
							children: "Value"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider",
							children: "Scope"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider",
							children: "Min Order"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider",
							children: "Usage"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider",
							children: "Status"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider",
							children: "Actions"
						})
					]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
					className: "divide-y divide-gray-100",
					children: coupons.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "hover:bg-gray-50",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono font-bold text-[#1a1a2e]",
									children: c.code
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 font-medium",
								children: formatValue(c)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: formatScope(c)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-gray-500",
								children: c.min_cart_value ? "₹" + Number(c.min_cart_value).toLocaleString("en-IN") : "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-4 py-3 text-gray-500",
								children: [c.usage_count ?? 0, c.total_usage_limit ? ` / ${c.total_usage_limit}` : ""]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${c.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`,
									children: c.is_active ? "Active" : "Inactive"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => openEdit(c),
										className: "rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "h-4 w-4" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => handleDelete(c.id, c.code),
										className: "rounded-lg p-1.5 text-red-300 hover:bg-red-50 hover:text-red-500",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
									})]
								})
							})
						]
					}, c.id))
				})]
			})
		})
	] });
}
function SearchableMultiSelect({ items, selected, onChange, placeholder, loading }) {
	const [query, setQuery] = (0, import_react.useState)("");
	const [open, setOpen] = (0, import_react.useState)(false);
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const handler = (e) => {
			if (ref.current && !ref.current.contains(e.target)) setOpen(false);
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, []);
	const filtered = (0, import_react.useMemo)(() => {
		if (!query.trim()) return items;
		const q = query.toLowerCase();
		return items.filter((item) => item.label.toLowerCase().includes(q));
	}, [items, query]);
	const toggle = (id) => {
		const next = new Set(selected);
		if (next.has(id)) next.delete(id);
		else next.add(id);
		onChange(next);
	};
	const selectedLabels = items.filter((i) => selected.has(i.id)).map((i) => i.label);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref,
		className: "relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-h-[42px] cursor-pointer flex-wrap items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm",
			onClick: () => setOpen(!open),
			children: [
				selectedLabels.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-gray-400",
					children: loading ? "Loading..." : placeholder
				}) : selectedLabels.slice(0, 3).map((label) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-1 rounded-md bg-[#1a1a2e]/10 px-2 py-0.5 text-xs font-medium text-[#1a1a2e]",
					children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: (e) => {
							e.stopPropagation();
							const item = items.find((i) => i.label === label);
							if (item) toggle(item.id);
						},
						className: "hover:text-red-500",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" })
					})]
				}, label)),
				selectedLabels.length > 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-xs text-gray-500",
					children: [
						"+",
						selectedLabels.length - 3,
						" more"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: `ml-auto h-4 w-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}` })
			]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 border-b border-gray-100 px-3 py-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-4 w-4 text-gray-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: query,
					onChange: (e) => setQuery(e.target.value),
					placeholder: "Search...",
					className: "flex-1 bg-transparent text-sm outline-none",
					autoFocus: true
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "max-h-48 overflow-y-auto",
				children: filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "px-3 py-4 text-center text-xs text-gray-400",
					children: "No results"
				}) : filtered.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => toggle(item.id),
					className: `flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50 ${selected.has(item.id) ? "bg-[#7A2533]/5 font-medium" : ""}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `flex h-4 w-4 items-center justify-center rounded border ${selected.has(item.id) ? "border-[#7A2533] bg-[#7A2533]" : "border-gray-300"}`,
						children: selected.has(item.id) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3 text-white" })
					}), item.label]
				}, item.id))
			})]
		})]
	});
}
var $$splitComponentImporter$10 = () => import("./admin.collections-CPUHmpky.mjs");
var Route$10 = createFileRoute("/admin/collections")({
	beforeLoad: requireAdmin,
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./admin.categories-YQCVAOZU.mjs");
var Route$9 = createFileRoute("/admin/categories")({
	beforeLoad: requireAdmin,
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./admin.audit-logs-BMCadOuE.mjs");
var Route$8 = createFileRoute("/admin/audit-logs")({
	beforeLoad: async () => {
		const { adminApi } = await import("./admin-Cd48uf7H.mjs").then((n) => n.n).then((n) => n.n);
		if (!await adminApi.getSession()) throw redirect({ to: "/admin/login" });
	},
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./admin.attributes-BohkhkFx.mjs");
var Route$7 = createFileRoute("/admin/attributes")({
	beforeLoad: requireAdmin,
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./admin.analytics-CruRnvwV.mjs");
var Route$6 = createFileRoute("/admin/analytics")({
	beforeLoad: requireAdmin,
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./account.orders--otUyQ4V.mjs");
var Route$5 = createFileRoute("/account/orders")({
	head: () => ({ meta: [{ title: "My Orders — Creative Muse" }] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./collections._slug._subslug-BO7V-vr5.mjs");
var Route$4 = createFileRoute("/collections/$slug/$subslug")({
	head: ({ params }) => ({ meta: [{ title: `${params.subslug.replace(/-/g, " ")} — Creative Muse` }] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./admin.products.new-CT2HHe3Z.mjs");
var Route$3 = createFileRoute("/admin/products/new")({
	beforeLoad: requireAdmin,
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./admin.products._id-_hGADh3b.mjs");
var Route$2 = createFileRoute("/admin/products/$id")({
	beforeLoad: requireAdmin,
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./admin.customers._id-e--0sl3R.mjs");
var Route$1 = createFileRoute("/admin/customers/$id")({
	beforeLoad: requireAdmin,
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./account.orders._orderNumber-DWLY3sBe.mjs");
var Route = createFileRoute("/account/orders/$orderNumber")({
	head: ({ params }) => ({ meta: [{ title: `Order #${params.orderNumber} - Creative Muse` }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var WishlistRoute = Route$52.update({
	id: "/wishlist",
	path: "/wishlist",
	getParentRoute: () => Route$53
});
var TrackOrderRoute = Route$51.update({
	id: "/track-order",
	path: "/track-order",
	getParentRoute: () => Route$53
});
var TermsAndConditionsRoute = Route$50.update({
	id: "/terms-and-conditions",
	path: "/terms-and-conditions",
	getParentRoute: () => Route$53
});
var TermsRoute = Route$49.update({
	id: "/terms",
	path: "/terms",
	getParentRoute: () => Route$53
});
var SignupRoute = Route$48.update({
	id: "/signup",
	path: "/signup",
	getParentRoute: () => Route$53
});
var ShopRoute = Route$47.update({
	id: "/shop",
	path: "/shop",
	getParentRoute: () => Route$53
});
var ShippingPolicyRoute = Route$46.update({
	id: "/shipping-policy",
	path: "/shipping-policy",
	getParentRoute: () => Route$53
});
var SearchRoute = Route$58.update({
	id: "/search",
	path: "/search",
	getParentRoute: () => Route$53
});
var ResetPasswordRoute = Route$45.update({
	id: "/reset-password",
	path: "/reset-password",
	getParentRoute: () => Route$53
});
var RefundReturnPolicyRoute = Route$44.update({
	id: "/refund-return-policy",
	path: "/refund-return-policy",
	getParentRoute: () => Route$53
});
var RefundPolicyRoute = Route$43.update({
	id: "/refund-policy",
	path: "/refund-policy",
	getParentRoute: () => Route$53
});
var PrivacyPolicyRoute = Route$42.update({
	id: "/privacy-policy",
	path: "/privacy-policy",
	getParentRoute: () => Route$53
});
var PaymentRoute = Route$41.update({
	id: "/payment",
	path: "/payment",
	getParentRoute: () => Route$53
});
var LoginRoute = Route$40.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$53
});
var ForgotPasswordRoute = Route$39.update({
	id: "/forgot-password",
	path: "/forgot-password",
	getParentRoute: () => Route$53
});
var FaqRoute = Route$38.update({
	id: "/faq",
	path: "/faq",
	getParentRoute: () => Route$53
});
var ContactRoute = Route$37.update({
	id: "/contact",
	path: "/contact",
	getParentRoute: () => Route$53
});
var CollectionsRoute = Route$36.update({
	id: "/collections",
	path: "/collections",
	getParentRoute: () => Route$53
});
var CheckoutRoute = Route$35.update({
	id: "/checkout",
	path: "/checkout",
	getParentRoute: () => Route$53
});
var CartRoute = Route$34.update({
	id: "/cart",
	path: "/cart",
	getParentRoute: () => Route$53
});
var BlogRoute = Route$33.update({
	id: "/blog",
	path: "/blog",
	getParentRoute: () => Route$53
});
var AccountRoute = Route$32.update({
	id: "/account",
	path: "/account",
	getParentRoute: () => Route$53
});
var AboutRoute = Route$31.update({
	id: "/about",
	path: "/about",
	getParentRoute: () => Route$53
});
var IndexRoute = Route$30.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$53
});
var AdminIndexRoute = Route$29.update({
	id: "/admin/",
	path: "/admin/",
	getParentRoute: () => Route$53
});
var ProductProductIdRoute = Route$57.update({
	id: "/product/$productId",
	path: "/product/$productId",
	getParentRoute: () => Route$53
});
var OrderSuccessOrderNumberRoute = Route$28.update({
	id: "/order-success/$orderNumber",
	path: "/order-success/$orderNumber",
	getParentRoute: () => Route$53
});
var CollectionsSlugRoute = Route$27.update({
	id: "/$slug",
	path: "/$slug",
	getParentRoute: () => CollectionsRoute
});
var CategorySlugRoute = Route$56.update({
	id: "/category/$slug",
	path: "/category/$slug",
	getParentRoute: () => Route$53
});
var BlogSlugRoute = Route$55.update({
	id: "/$slug",
	path: "/$slug",
	getParentRoute: () => BlogRoute
});
var AuthCallbackRoute = Route$26.update({
	id: "/auth/callback",
	path: "/auth/callback",
	getParentRoute: () => Route$53
});
var AdminSubcategoriesRoute = Route$25.update({
	id: "/admin/subcategories",
	path: "/admin/subcategories",
	getParentRoute: () => Route$53
});
var AdminSpecificationsRoute = Route$24.update({
	id: "/admin/specifications",
	path: "/admin/specifications",
	getParentRoute: () => Route$53
});
var AdminSettingsRoute = Route$23.update({
	id: "/admin/settings",
	path: "/admin/settings",
	getParentRoute: () => Route$53
});
var AdminReelsRoute = Route$22.update({
	id: "/admin/reels",
	path: "/admin/reels",
	getParentRoute: () => Route$53
});
var AdminProductsRoute = Route$21.update({
	id: "/admin/products",
	path: "/admin/products",
	getParentRoute: () => Route$53
});
var AdminProductFlagsRoute = Route$20.update({
	id: "/admin/product-flags",
	path: "/admin/product-flags",
	getParentRoute: () => Route$53
});
var AdminOrdersRoute = Route$19.update({
	id: "/admin/orders",
	path: "/admin/orders",
	getParentRoute: () => Route$53
});
var AdminNewsletterRoute = Route$18.update({
	id: "/admin/newsletter",
	path: "/admin/newsletter",
	getParentRoute: () => Route$53
});
var AdminMediaRoute = Route$17.update({
	id: "/admin/media",
	path: "/admin/media",
	getParentRoute: () => Route$53
});
var AdminLoginRoute = Route$16.update({
	id: "/admin/login",
	path: "/admin/login",
	getParentRoute: () => Route$53
});
var AdminInventoryRoute = Route$15.update({
	id: "/admin/inventory",
	path: "/admin/inventory",
	getParentRoute: () => Route$53
});
var AdminHomepageRoute = Route$14.update({
	id: "/admin/homepage",
	path: "/admin/homepage",
	getParentRoute: () => Route$53
});
var AdminEnquiriesRoute = Route$13.update({
	id: "/admin/enquiries",
	path: "/admin/enquiries",
	getParentRoute: () => Route$53
});
var AdminCustomersRoute = Route$12.update({
	id: "/admin/customers",
	path: "/admin/customers",
	getParentRoute: () => Route$53
});
var AdminCouponsRoute = Route$11.update({
	id: "/admin/coupons",
	path: "/admin/coupons",
	getParentRoute: () => Route$53
});
var AdminCollectionsRoute = Route$10.update({
	id: "/admin/collections",
	path: "/admin/collections",
	getParentRoute: () => Route$53
});
var AdminCategoriesRoute = Route$9.update({
	id: "/admin/categories",
	path: "/admin/categories",
	getParentRoute: () => Route$53
});
var AdminAuditLogsRoute = Route$8.update({
	id: "/admin/audit-logs",
	path: "/admin/audit-logs",
	getParentRoute: () => Route$53
});
var AdminAttributesRoute = Route$7.update({
	id: "/admin/attributes",
	path: "/admin/attributes",
	getParentRoute: () => Route$53
});
var AdminAnalyticsRoute = Route$6.update({
	id: "/admin/analytics",
	path: "/admin/analytics",
	getParentRoute: () => Route$53
});
var AccountOrdersRoute = Route$5.update({
	id: "/orders",
	path: "/orders",
	getParentRoute: () => AccountRoute
});
var CollectionsSlugSubslugRoute = Route$4.update({
	id: "/$subslug",
	path: "/$subslug",
	getParentRoute: () => CollectionsSlugRoute
});
var AdminProductsNewRoute = Route$3.update({
	id: "/new",
	path: "/new",
	getParentRoute: () => AdminProductsRoute
});
var AdminProductsIdRoute = Route$2.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => AdminProductsRoute
});
var AdminOrdersIdRoute = Route$54.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => AdminOrdersRoute
});
var AdminCustomersIdRoute = Route$1.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => AdminCustomersRoute
});
var AccountOrdersRouteChildren = { AccountOrdersOrderNumberRoute: Route.update({
	id: "/$orderNumber",
	path: "/$orderNumber",
	getParentRoute: () => AccountOrdersRoute
}) };
var AccountRouteChildren = { AccountOrdersRoute: AccountOrdersRoute._addFileChildren(AccountOrdersRouteChildren) };
var AccountRouteWithChildren = AccountRoute._addFileChildren(AccountRouteChildren);
var BlogRouteChildren = { BlogSlugRoute };
var BlogRouteWithChildren = BlogRoute._addFileChildren(BlogRouteChildren);
var CollectionsSlugRouteChildren = { CollectionsSlugSubslugRoute };
var CollectionsRouteChildren = { CollectionsSlugRoute: CollectionsSlugRoute._addFileChildren(CollectionsSlugRouteChildren) };
var CollectionsRouteWithChildren = CollectionsRoute._addFileChildren(CollectionsRouteChildren);
var AdminCustomersRouteChildren = { AdminCustomersIdRoute };
var AdminCustomersRouteWithChildren = AdminCustomersRoute._addFileChildren(AdminCustomersRouteChildren);
var AdminOrdersRouteChildren = { AdminOrdersIdRoute };
var AdminOrdersRouteWithChildren = AdminOrdersRoute._addFileChildren(AdminOrdersRouteChildren);
var AdminProductsRouteChildren = {
	AdminProductsIdRoute,
	AdminProductsNewRoute
};
var rootRouteChildren = {
	IndexRoute,
	AboutRoute,
	AccountRoute: AccountRouteWithChildren,
	BlogRoute: BlogRouteWithChildren,
	CartRoute,
	CheckoutRoute,
	CollectionsRoute: CollectionsRouteWithChildren,
	ContactRoute,
	FaqRoute,
	ForgotPasswordRoute,
	LoginRoute,
	PaymentRoute,
	PrivacyPolicyRoute,
	RefundPolicyRoute,
	RefundReturnPolicyRoute,
	ResetPasswordRoute,
	SearchRoute,
	ShippingPolicyRoute,
	ShopRoute,
	SignupRoute,
	TermsRoute,
	TermsAndConditionsRoute,
	TrackOrderRoute,
	WishlistRoute,
	AdminAnalyticsRoute,
	AdminAttributesRoute,
	AdminAuditLogsRoute,
	AdminCategoriesRoute,
	AdminCollectionsRoute,
	AdminCouponsRoute,
	AdminCustomersRoute: AdminCustomersRouteWithChildren,
	AdminEnquiriesRoute,
	AdminHomepageRoute,
	AdminInventoryRoute,
	AdminLoginRoute,
	AdminMediaRoute,
	AdminNewsletterRoute,
	AdminOrdersRoute: AdminOrdersRouteWithChildren,
	AdminProductFlagsRoute,
	AdminProductsRoute: AdminProductsRoute._addFileChildren(AdminProductsRouteChildren),
	AdminReelsRoute,
	AdminSettingsRoute,
	AdminSpecificationsRoute,
	AdminSubcategoriesRoute,
	AuthCallbackRoute,
	CategorySlugRoute,
	OrderSuccessOrderNumberRoute,
	ProductProductIdRoute,
	AdminIndexRoute
};
var routeTree = Route$53._addFileChildren(rootRouteChildren)._addFileTypes();
var queryClient = new QueryClient({ defaultOptions: { queries: {
	staleTime: 300 * 1e3,
	gcTime: 600 * 1e3,
	refetchOnWindowFocus: false,
	refetchOnReconnect: false,
	retry: 1
} } });
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 300 * 1e3
	});
};
//#endregion
export { getRouter, queryClient };
