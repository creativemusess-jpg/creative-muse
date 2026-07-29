import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { X, Check, Copy } from "lucide-react";
import { newsletterApi } from "@/lib/api/newsletter";
import { categoriesApi } from "@/lib/api/categories";
import { settingsApi } from "@/lib/api/settings";
import { useStore } from "@/lib/store";

const LS_SEEN = "creative_muse_newsletter_popup_seen";
const LS_SUBSCRIBED = "creative_muse_newsletter_subscribed";
const LS_DISMISSED_AT = "creative_muse_newsletter_dismissed_at";
const COOLDOWN_DAYS = 7;
const DEFAULT_DISCOUNT_CODE = "WELCOME10";

const FALLBACK_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='600' viewBox='0 0 400 600'%3E%3Crect width='400' height='600' fill='%23f5efe8'/%3E%3C/svg%3E";

const PREFERRED_CATEGORY_SLUGS = ["wedding-sets", "necklaces", "earrings"];

function isPopupBlocked(): boolean {
  if (typeof window === "undefined") return true;
  try {
    if (localStorage.getItem(LS_SUBSCRIBED) === "true") return true;
    const dismissedAt = localStorage.getItem(LS_DISMISSED_AT);
    if (dismissedAt) {
      const elapsed = Date.now() - Number(dismissedAt);
      if (elapsed < COOLDOWN_DAYS * 24 * 60 * 60 * 1000) return true;
    }
    const seen = sessionStorage.getItem(LS_SEEN);
    if (seen === "true") return true;
  } catch {
    return true;
  }
  return false;
}

function markSeen() {
  try {
    sessionStorage.setItem(LS_SEEN, "true");
  } catch {}
}

function markSubscribed() {
  try {
    localStorage.setItem(LS_SUBSCRIBED, "true");
  } catch {}
}

function markDismissed() {
  try {
    localStorage.setItem(LS_DISMISSED_AT, String(Date.now()));
  } catch {}
}

export function NewsletterPopup() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [state, setState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [msg, setMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [popupImage, setPopupImage] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageFailed, setImageFailed] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const triggerRef = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const subscribedRef = useRef(false);
  const fetchAttempted = useRef(false);

  const { cartOpen, wishlistOpen, quickViewId } = useStore();

  useEffect(() => {
    if (fetchAttempted.current) return;
    fetchAttempted.current = true;
    let cancelled = false;
    async function loadPopupImage() {
      try {
        const setting = await settingsApi.get("newsletter_popup_image");
        if (!cancelled && setting?.setting_value?.url) {
          setPopupImage(setting.setting_value.url);
          return;
        }
        const cats = await categoriesApi.list(true);
        let found: any = null;
        for (const slug of PREFERRED_CATEGORY_SLUGS) {
          found = cats.find((c: any) => c.slug === slug && c.imageUrl);
          if (found) break;
        }
        if (!found) found = cats.find((c: any) => c.imageUrl);
        if (!cancelled) {
          setPopupImage(found?.imageUrl || null);
          setCategoryName(found?.name || "");
          setImageLoading(!found?.imageUrl);
        }
      } catch {
        if (!cancelled) setImageLoading(false);
      }
    }
    loadPopupImage();
    return () => { cancelled = true; };
  }, []);

  const anyModalOpen = cartOpen || wishlistOpen || quickViewId !== null;

  const openPopup = useCallback(() => {
    if (subscribedRef.current) return;
    if (anyModalOpen) return;
    if (isPopupBlocked()) return;
    setOpen(true);
    triggerRef.current = document.activeElement as HTMLElement;
    markSeen();
  }, [anyModalOpen]);

  useEffect(() => {
    if (anyModalOpen && open) {
      setOpen(false);
    }
  }, [anyModalOpen, open]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  useEffect(() => {
    if (open && containerRef.current) {
      const focusable = containerRef.current.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      focusable?.focus();
    }
    if (!open && triggerRef.current) {
      triggerRef.current.focus();
      triggerRef.current = null;
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
        return;
      }
      if (e.key === "Tab" && containerRef.current) {
        const focusable =
          containerRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
          );
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
  }, [open]);

  useEffect(() => {
    if (open) return;
    if (subscribedRef.current) return;
    if (isPopupBlocked()) return;

    const delay = setTimeout(() => {
      if (!anyModalOpen) openPopup();
    }, 8000);

    const handleScroll = () => {
      const scrollPct =
        window.scrollY /
        (document.documentElement.scrollHeight - window.innerHeight);
      if (scrollPct > 0.35) {
        clearTimeout(delay);
        openPopup();
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY > 10) return;
      clearTimeout(delay);
      openPopup();
    };
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      clearTimeout(delay);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [open, anyModalOpen, openPopup]);

  const handleClose = useCallback(() => {
    setOpen(false);
    markDismissed();
    setEmail("");
    setState("idle");
    setMsg(null);
  }, []);

  const handleNoThanks = useCallback(() => {
    handleClose();
  }, [handleClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) {
      setState("error");
      setMsg("Please enter your email address.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setState("error");
      setMsg("Please enter a valid email address.");
      return;
    }
    setState("loading");
    setMsg(null);

    try {
      const result = await newsletterApi.subscribeToNewsletter({
        email: trimmed,
        source: "newsletter_popup",
        consent: true,
        discountCode: DEFAULT_DISCOUNT_CODE,
      });
      if (!result.success) {
        setState(result.status === "already_active" ? "success" : "error");
        setMsg(result.message);
        if (result.status === "already_active") {
          subscribedRef.current = true;
          markSubscribed();
        }
        return;
      }
      subscribedRef.current = true;
      markSubscribed();
      setState("success");
      setMsg("");
    } catch {
      setState("error");
      setMsg("Something went wrong. Please try again.");
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(DEFAULT_DISCOUNT_CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[70] flex items-center justify-center p-2 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="newsletter-popup-title"
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />

          <motion.div
            ref={containerRef}
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            className="relative mx-auto flex w-full max-w-[840px] flex-col overflow-hidden rounded-[28px] bg-[#fdf8f3] shadow-[0_32px_80px_rgba(0,0,0,0.3)] sm:flex-row sm:max-h-[90vh]"
          >
            <button
              aria-label="Close newsletter popup"
              onClick={handleClose}
              className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-md backdrop-blur-sm transition-colors hover:bg-white sm:top-4 sm:right-4"
            >
              <X className="h-4 w-4 text-[#1a1a2e]" />
            </button>

            <div className="relative h-[200px] w-full shrink-0 overflow-hidden sm:hidden">
              {imageLoading && (
                <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-[#f0e4cd] via-[#f5efe8] to-[#f0e4cd] bg-[length:200%_100%]" />
              )}
              {(popupImage || !imageLoading) && (
                <img
                  src={popupImage || FALLBACK_SVG}
                  alt={categoryName ? `${categoryName} jewellery collection` : "Creative Muse luxury jewellery collection"}
                  className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${imageLoading ? "opacity-0" : "opacity-100"}`}
                  style={{ objectFit: "cover", objectPosition: "center" }}
                  onLoad={() => setImageLoading(false)}
                  onError={() => {
                    if (popupImage && popupImage !== FALLBACK_SVG) {
                      setPopupImage(FALLBACK_SVG);
                    }
                    setImageFailed(true);
                    setImageLoading(false);
                  }}
                />
              )}
              {!popupImage && !imageLoading && (
                <div className="absolute inset-0 bg-gradient-to-br from-[#fdf8f3] to-[#f0e4cd]" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent pointer-events-none" />
            </div>

            <div className="relative hidden h-[320px] w-full shrink-0 overflow-hidden sm:block sm:h-auto sm:w-[45%] sm:min-h-[500px]">
              {imageLoading && (
                <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-[#f0e4cd] via-[#f5efe8] to-[#f0e4cd] bg-[length:200%_100%]" />
              )}
              {(popupImage || !imageLoading) && (
                <img
                  src={popupImage || FALLBACK_SVG}
                  alt={categoryName ? `${categoryName} jewellery collection` : "Creative Muse luxury jewellery collection"}
                  className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${imageLoading ? "opacity-0" : "opacity-100"}`}
                  style={{ objectFit: imageFailed ? "contain" : "cover", objectPosition: "center" }}
                  onLoad={() => setImageLoading(false)}
                  onError={() => {
                    if (popupImage && popupImage !== FALLBACK_SVG) {
                      setPopupImage(FALLBACK_SVG);
                    }
                    setImageFailed(true);
                    setImageLoading(false);
                  }}
                />
              )}
              {!popupImage && !imageLoading && (
                <div className="absolute inset-0 bg-gradient-to-br from-[#fdf8f3] to-[#f0e4cd]" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent pointer-events-none" />
            </div>

            <div className="flex w-full flex-col justify-center px-6 py-10 sm:w-[55%] sm:px-10 sm:py-12">
              {state === "success" ? (
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                    <Check className="h-7 w-7 text-green-600" />
                  </div>
                  <h2
                    id="newsletter-popup-title"
                    className="font-display mt-4 text-2xl font-semibold text-[#1a1a2e]"
                  >
                    Your 10% Welcome Offer Is Ready
                  </h2>
                  <p className="mt-2 text-sm text-[#7a6e64]">
                    Use <span className="font-mono font-bold text-[#1a1a2e]">{DEFAULT_DISCOUNT_CODE}</span>{" "}
                    on eligible products at checkout.
                  </p>

                  <div className="mt-6 flex items-center gap-3">
                    <code className="rounded-lg border border-[#e0d8cc] bg-white px-4 py-2.5 font-mono text-lg font-bold tracking-wider text-[#1a1a2e]">
                      {DEFAULT_DISCOUNT_CODE}
                    </code>
                    <button
                      onClick={handleCopy}
                      aria-label={copied ? "Copied" : "Copy discount code"}
                      className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#e0d8cc] bg-white text-[#7a6e64] transition-colors hover:border-[#7A2533] hover:text-[#7A2533]"
                    >
                      {copied ? (
                        <Check className="h-5 w-5 text-green-600" />
                      ) : (
                        <Copy className="h-5 w-5" />
                      )}
                    </button>
                  </div>

                  {copied && (
                    <p className="mt-2 text-xs font-medium text-green-600">
                      Copied to clipboard
                    </p>
                  )}

                  <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                    <Link
                      to="/shop"
                      onClick={handleClose}
                      className="btn-primary"
                    >
                      Continue Shopping
                    </Link>
                  </div>

                  <p className="mt-4 text-[11px] text-[#7a6e64]">
                    Use {DEFAULT_DISCOUNT_CODE} on eligible products at checkout.
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-[10px] font-semibold tracking-[0.24em] text-[#7A2533] uppercase">
                    Creative Muse
                  </p>

                  <h2
                    id="newsletter-popup-title"
                    className="font-display mt-3 text-[28px] leading-tight font-semibold text-[#1a1a2e] sm:text-[32px]"
                  >
                    Get 10% Off
                    <br />
                    Your First Order
                  </h2>

                  <p className="mt-3 text-[14px] leading-relaxed text-[#7a6e64]">
                    Join the Creative Muse Circle and receive early access to
                    new collections, private offers and jewellery styling
                    inspiration.
                  </p>

                  <form onSubmit={handleSubmit} className="mt-6 space-y-3">
                    <div>
                      <label htmlFor="nl-popup-email" className="sr-only">
                        Email address
                      </label>
                      <input
                        id="nl-popup-email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (state !== "idle" && state !== "loading") {
                            setState("idle");
                            setMsg(null);
                          }
                        }}
                        placeholder="Enter your email address"
                        aria-label="Email address"
                        autoComplete="email"
                        className="w-full rounded-xl border border-[#e0d8cc] bg-white px-4 py-3 text-sm text-[#1a1a2e] outline-none transition-colors focus:border-[#7A2533] focus:ring-1 focus:ring-[#7A2533]/30 placeholder:text-[#a09890]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={state === "loading"}
                      className="btn-dark w-full justify-center disabled:opacity-60"
                    >
                      {state === "loading" ? (
                        <span className="flex items-center gap-2">
                          <svg
                            className="h-4 w-4 animate-spin"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
                          </svg>
                          Submitting…
                        </span>
                      ) : (
                        "Claim My Offer"
                      )}
                    </button>
                  </form>

                  {msg && (
                    <p
                      className={`mt-3 text-[13px] ${
                        state === "error" ? "text-red-500" : "text-green-600"
                      }`}
                      role="status"
                    >
                      {msg}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={handleNoThanks}
                    className="mt-4 text-center text-[12px] font-medium text-[#a09890] underline underline-offset-2 transition-colors hover:text-[#7a6e64]"
                  >
                    No thanks
                  </button>

                  <p className="mt-6 text-[10px] leading-relaxed text-[#a09890]">
                    By subscribing, you agree to receive Creative Muse updates
                    and offers. You can unsubscribe at any time.{" "}
                    <Link
                      to="/privacy-policy"
                      onClick={handleClose}
                      className="text-[#7A2533] underline underline-offset-2 hover:text-[#7A2533]"
                    >
                      Privacy Policy
                    </Link>
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
