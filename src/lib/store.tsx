import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { type Product, useStorefrontProducts } from "./products";

/* Global storefront store — cart, wishlist, quick view, drawers.
   Persists cart + wishlist to localStorage. */

type CartLine = { id: string; qty: number };

type StoreCtx = {
  cart: CartLine[];
  cartReady: boolean;
  cartCount: number;
  cartSubtotal: number;
  addToCart: (id: string, qty?: number) => void;
  removeFromCart: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clearCart: () => void;
  cartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;

  wishlist: string[];
  wishlistCount: number;
  toggleWishlist: (id: string) => void;
  isWishlisted: (id: string) => boolean;
  wishlistOpen: boolean;
  openWishlist: () => void;
  closeWishlist: () => void;

  quickViewId: string | null;
  openQuickView: (id: string) => void;
  closeQuickView: () => void;

  couponCode: string;
  setCouponCode: (code: string) => void;
  discountAmount: number;
  setDiscountAmount: (amount: number) => void;
  appliedCouponId: string | null;
  setAppliedCouponId: (id: string | null) => void;
  clearCoupon: () => void;

  giftPackagingEnabled: boolean;
  setGiftPackagingEnabled: (v: boolean) => void;
  giftMessage: string;
  setGiftMessage: (v: string) => void;
};

const Ctx = createContext<StoreCtx | null>(null);

const CART_KEY = "cm_cart_v1";
const WISH_KEY = "cm_wishlist_v1";

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [quickViewId, setQuickViewId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCouponId, setAppliedCouponId] = useState<string | null>(null);
  const [giftPackagingEnabled, setGiftPackagingEnabled] = useState(false);
  const [giftMessage, setGiftMessage] = useState("");
  const { products, isLoading: productsLoading } = useStorefrontProducts();
  const cartReady = hydrated;

  useEffect(() => {
    setCart(readJSON<CartLine[]>(CART_KEY, []));
    setWishlist(readJSON<string[]>(WISH_KEY, []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch {}
  }, [cart, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(WISH_KEY, JSON.stringify(wishlist));
    } catch {}
  }, [wishlist, hydrated]);

  useEffect(() => {
    const anyOpen = cartOpen || wishlistOpen || quickViewId !== null;
    if (typeof document === "undefined") return;
    document.body.style.overflow = anyOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [cartOpen, wishlistOpen, quickViewId]);

  // Escape closes any open overlay
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (quickViewId) setQuickViewId(null);
      else if (cartOpen) setCartOpen(false);
      else if (wishlistOpen) setWishlistOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cartOpen, wishlistOpen, quickViewId]);

  const addToCart = useCallback((id: string, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((l) => l.id === id);
      if (existing) {
        return prev.map((l) => (l.id === id ? { ...l, qty: l.qty + qty } : l));
      }
      return [...prev, { id, qty }];
    });
    setCartOpen(true);
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setCart((prev) =>
      prev
        .map((l) => (l.id === id ? { ...l, qty: Math.max(1, qty) } : l))
        .filter((l) => l.qty > 0),
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const clearCoupon = useCallback(() => {
    setCouponCode("");
    setDiscountAmount(0);
    setAppliedCouponId(null);
  }, []);

  const toggleWishlist = useCallback((id: string) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }, []);

  const isWishlisted = useCallback(
    (id: string) => wishlist.includes(id),
    [wishlist],
  );

  const { cartCount, cartSubtotal } = useMemo(() => {
    let count = 0;
    let subtotal = 0;
    for (const line of cart) {
      const p = products.find((x) => x.id === line.id);
      if (!p) continue;
      count += line.qty;
      subtotal += p.price * line.qty;
    }
    return { cartCount: count, cartSubtotal: subtotal };
  }, [cart, products]);

  const openCart = useCallback(() => setCartOpen(true), []);
  const closeCart = useCallback(() => setCartOpen(false), []);
  const openWishlist = useCallback(() => setWishlistOpen(true), []);
  const closeWishlist = useCallback(() => setWishlistOpen(false), []);
  const closeQuickView = useCallback(() => setQuickViewId(null), []);
  const wishlistCount = useMemo(() => wishlist.length, [wishlist]);

  const value = useMemo<StoreCtx>(
    () => ({
      cart,
      cartReady,
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
      setGiftMessage,
    }),
    [
      cart, cartReady, cartCount, cartSubtotal, addToCart, removeFromCart, setQty, clearCart, cartOpen,
      openCart, closeCart,
      wishlist, wishlistCount, toggleWishlist, isWishlisted, wishlistOpen,
      openWishlist, closeWishlist,
      quickViewId, closeQuickView,
      couponCode, setCouponCode, discountAmount, setDiscountAmount, appliedCouponId,
      setAppliedCouponId, clearCoupon,
      giftPackagingEnabled, setGiftPackagingEnabled, giftMessage, setGiftMessage,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore(): StoreCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}

export function useCartLines(): Array<{ product: Product; qty: number }> {
  const { cart } = useStore();
  const { products } = useStorefrontProducts();
  return useMemo(
    () =>
      cart
        .map((l) => {
          const product = products.find((p) => p.id === l.id);
          return product ? { product, qty: l.qty } : null;
        })
        .filter((x): x is { product: Product; qty: number } => !!x),
    [cart, products],
  );
}

export function useWishlistProducts(): Product[] {
  const { wishlist } = useStore();
  const { products } = useStorefrontProducts();
  return useMemo(
    () =>
      wishlist
        .map((id) => products.find((p) => p.id === id))
        .filter((p): p is Product => !!p),
    [wishlist, products],
  );
}
