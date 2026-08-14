import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { s as useStorefrontProducts } from "./products-6Nbb9Ru-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/store-CcwDJcbB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Ctx = (0, import_react.createContext)(null);
var CART_KEY = "cm_cart_v1";
var WISH_KEY = "cm_wishlist_v1";
function readJSON(key, fallback) {
	if (typeof window === "undefined") return fallback;
	try {
		const raw = window.localStorage.getItem(key);
		return raw ? JSON.parse(raw) : fallback;
	} catch {
		return fallback;
	}
}
function StoreProvider({ children }) {
	const [cart, setCart] = (0, import_react.useState)([]);
	const [wishlist, setWishlist] = (0, import_react.useState)([]);
	const [cartOpen, setCartOpen] = (0, import_react.useState)(false);
	const [wishlistOpen, setWishlistOpen] = (0, import_react.useState)(false);
	const [quickViewId, setQuickViewId] = (0, import_react.useState)(null);
	const [hydrated, setHydrated] = (0, import_react.useState)(false);
	const [couponCode, setCouponCode] = (0, import_react.useState)("");
	const [discountAmount, setDiscountAmount] = (0, import_react.useState)(0);
	const [appliedCouponId, setAppliedCouponId] = (0, import_react.useState)(null);
	const [giftPackagingEnabled, setGiftPackagingEnabled] = (0, import_react.useState)(false);
	const [giftMessage, setGiftMessage] = (0, import_react.useState)("");
	const { products } = useStorefrontProducts();
	(0, import_react.useEffect)(() => {
		setCart(readJSON(CART_KEY, []));
		setWishlist(readJSON(WISH_KEY, []));
		setHydrated(true);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!hydrated) return;
		try {
			window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
		} catch {}
	}, [cart, hydrated]);
	(0, import_react.useEffect)(() => {
		if (!hydrated) return;
		try {
			window.localStorage.setItem(WISH_KEY, JSON.stringify(wishlist));
		} catch {}
	}, [wishlist, hydrated]);
	(0, import_react.useEffect)(() => {
		const anyOpen = cartOpen || wishlistOpen || quickViewId !== null;
		if (typeof document === "undefined") return;
		document.body.style.overflow = anyOpen ? "hidden" : "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [
		cartOpen,
		wishlistOpen,
		quickViewId
	]);
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			if (e.key !== "Escape") return;
			if (quickViewId) setQuickViewId(null);
			else if (cartOpen) setCartOpen(false);
			else if (wishlistOpen) setWishlistOpen(false);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [
		cartOpen,
		wishlistOpen,
		quickViewId
	]);
	const addToCart = (0, import_react.useCallback)((id, qty = 1) => {
		setCart((prev) => {
			if (prev.find((l) => l.id === id)) return prev.map((l) => l.id === id ? {
				...l,
				qty: l.qty + qty
			} : l);
			return [...prev, {
				id,
				qty
			}];
		});
		setCartOpen(true);
	}, []);
	const removeFromCart = (0, import_react.useCallback)((id) => {
		setCart((prev) => prev.filter((l) => l.id !== id));
	}, []);
	const setQty = (0, import_react.useCallback)((id, qty) => {
		setCart((prev) => prev.map((l) => l.id === id ? {
			...l,
			qty: Math.max(1, qty)
		} : l).filter((l) => l.qty > 0));
	}, []);
	const clearCart = (0, import_react.useCallback)(() => setCart([]), []);
	const clearCoupon = (0, import_react.useCallback)(() => {
		setCouponCode("");
		setDiscountAmount(0);
		setAppliedCouponId(null);
	}, []);
	const toggleWishlist = (0, import_react.useCallback)((id) => {
		setWishlist((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
	}, []);
	const isWishlisted = (0, import_react.useCallback)((id) => wishlist.includes(id), [wishlist]);
	const { cartCount, cartSubtotal } = (0, import_react.useMemo)(() => {
		let count = 0;
		let subtotal = 0;
		for (const line of cart) {
			const p = products.find((x) => x.id === line.id);
			if (!p) continue;
			count += line.qty;
			subtotal += p.price * line.qty;
		}
		return {
			cartCount: count,
			cartSubtotal: subtotal
		};
	}, [cart, products]);
	const openCart = (0, import_react.useCallback)(() => setCartOpen(true), []);
	const closeCart = (0, import_react.useCallback)(() => setCartOpen(false), []);
	const openWishlist = (0, import_react.useCallback)(() => setWishlistOpen(true), []);
	const closeWishlist = (0, import_react.useCallback)(() => setWishlistOpen(false), []);
	const closeQuickView = (0, import_react.useCallback)(() => setQuickViewId(null), []);
	const wishlistCount = (0, import_react.useMemo)(() => wishlist.length, [wishlist]);
	const value = (0, import_react.useMemo)(() => ({
		cart,
		cartCount,
		cartSubtotal,
		addToCart,
		removeFromCart,
		setQty,
		clearCart,
		cartOpen,
		openCart,
		closeCart,
		wishlist,
		wishlistCount,
		toggleWishlist,
		isWishlisted,
		wishlistOpen,
		openWishlist,
		closeWishlist,
		quickViewId,
		openQuickView: setQuickViewId,
		closeQuickView,
		couponCode,
		setCouponCode,
		discountAmount,
		setDiscountAmount,
		appliedCouponId,
		setAppliedCouponId,
		clearCoupon,
		giftPackagingEnabled,
		setGiftPackagingEnabled,
		giftMessage,
		setGiftMessage
	}), [
		cart,
		cartCount,
		cartSubtotal,
		addToCart,
		removeFromCart,
		setQty,
		clearCart,
		cartOpen,
		openCart,
		closeCart,
		wishlist,
		wishlistCount,
		toggleWishlist,
		isWishlisted,
		wishlistOpen,
		openWishlist,
		closeWishlist,
		quickViewId,
		closeQuickView,
		couponCode,
		setCouponCode,
		discountAmount,
		setDiscountAmount,
		appliedCouponId,
		setAppliedCouponId,
		clearCoupon,
		giftPackagingEnabled,
		setGiftPackagingEnabled,
		giftMessage,
		setGiftMessage
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ctx.Provider, {
		value,
		children
	});
}
function useStore() {
	const ctx = (0, import_react.useContext)(Ctx);
	if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
	return ctx;
}
function useCartLines() {
	const { cart } = useStore();
	const { products } = useStorefrontProducts();
	return (0, import_react.useMemo)(() => cart.map((l) => {
		const product = products.find((p) => p.id === l.id);
		return product ? {
			product,
			qty: l.qty
		} : null;
	}).filter((x) => !!x), [cart, products]);
}
function useWishlistProducts() {
	const { wishlist } = useStore();
	const { products } = useStorefrontProducts();
	return (0, import_react.useMemo)(() => wishlist.map((id) => products.find((p) => p.id === id)).filter((p) => !!p), [wishlist, products]);
}
//#endregion
export { useWishlistProducts as i, useCartLines as n, useStore as r, StoreProvider as t };
