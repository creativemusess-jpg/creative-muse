import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as formatPrice } from "./products-6Nbb9Ru-.mjs";
import { n as useCartLines, r as useStore } from "./store-CcwDJcbB.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { B as Package, H as Minus, P as Plus, Y as LoaderCircle, _ as Trash2, v as Tag } from "../_libs/lucide-react.mjs";
import { t as giftPackagingApi } from "./gift-packaging-B57zKQ8f.mjs";
import { n as PageShell, t as PageHeader } from "./PageHeader-DZsnNyor.mjs";
import { n as useAuth } from "./auth-D2-u71mo.mjs";
import { c as validateCoupon } from "./checkout-CST5jHga.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cart-CFlBBx6b.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CartPage() {
	const lines = useCartLines();
	const { setQty, removeFromCart, cartSubtotal, couponCode, setCouponCode, discountAmount, setDiscountAmount, setAppliedCouponId, appliedCouponId, clearCoupon, giftPackagingEnabled, setGiftPackagingEnabled, giftMessage, setGiftMessage } = useStore();
	const { user } = useAuth();
	const [couponInput, setCouponInput] = (0, import_react.useState)("");
	const [couponStatus, setCouponStatus] = (0, import_react.useState)("idle");
	const [couponMsg, setCouponMsg] = (0, import_react.useState)("");
	const [giftCfg, setGiftCfg] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		giftPackagingApi.getConfig().then(setGiftCfg);
	}, []);
	const shipping = cartSubtotal > 5e3 || cartSubtotal === 0 ? 0 : 250;
	const giftPrice = giftPackagingEnabled && giftCfg?.enabled ? giftCfg?.price || 0 : 0;
	const total = Math.max(0, cartSubtotal + shipping + giftPrice - discountAmount);
	const applyCoupon = async () => {
		if (!couponInput.trim()) return;
		setCouponStatus("loading");
		setCouponMsg("");
		try {
			const items = lines.map((l) => ({
				productId: l.product.id,
				price: l.product.price
			}));
			const result = await validateCoupon(couponInput.trim().toUpperCase(), cartSubtotal, items);
			if (result.isValid) {
				setDiscountAmount(result.discountAmount);
				setCouponCode(result.code);
				setAppliedCouponId(result.id);
				setCouponStatus("valid");
				setCouponMsg(`Coupon applied! You save ₹${Math.round(result.discountAmount).toLocaleString("en-IN")}.`);
			} else {
				setCouponStatus("invalid");
				setCouponMsg(result.message);
				setDiscountAmount(0);
				setCouponCode("");
				setAppliedCouponId(null);
			}
		} catch {
			setCouponStatus("invalid");
			setCouponMsg("Could not validate coupon. Try again.");
			setDiscountAmount(0);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PageShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		eyebrow: "Bag",
		title: "Your Cart",
		subtitle: `${lines.length} piece${lines.length === 1 ? "" : "s"} curated for you.`
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto grid max-w-[1200px] gap-8 overflow-hidden px-4 py-10 sm:px-6 sm:py-16 lg:grid-cols-[1fr_380px]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [lines.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-[28px] bg-white p-10 text-center shadow-[0_4px_24px_rgba(0,0,0,0.05)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[#7a6e64]",
					children: "Your cart is empty."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/shop",
					className: "btn-primary mt-6 inline-flex",
					children: "Continue Shopping"
				})]
			}), lines.map(({ product: it, qty }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-3 rounded-[22px] bg-white p-3 shadow-[0_4px_24px_rgba(0,0,0,0.05)] sm:gap-4 sm:rounded-[28px] sm:p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex aspect-square w-[108px] shrink-0 items-center justify-center overflow-hidden rounded-[18px] border border-[rgba(66,29,34,0.18)] bg-white shadow-[0_8px_24px_rgba(66,29,34,0.06)] sm:w-28 sm:rounded-[20px]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: it.image,
							alt: it.name,
							loading: "lazy",
							className: "h-full w-full object-contain p-2 sm:p-3"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "eyebrow text-[10px]",
								children: [
									it.metal,
									" · ",
									it.stone
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display mt-1 line-clamp-2 text-sm font-semibold text-[#1a1a2e] sm:text-base",
								children: it.name
							}),
							it.mrp > it.price && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-[12px] text-[#7a6e64] line-through sm:text-[13px]",
								children: formatPrice(it.mrp)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[16px] font-bold text-[#1a1a2e]",
								children: formatPrice(it.price)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex items-center justify-between gap-3 sm:hidden",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1 rounded-full border border-[#e0d8cc] p-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => setQty(it.id, qty - 1),
											"aria-label": "Decrease",
											className: "flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#f5efe8]",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "h-3 w-3" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "min-w-6 text-center text-sm font-semibold",
											children: qty
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => setQty(it.id, qty + 1),
											"aria-label": "Increase",
											className: "flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#f5efe8]",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3 w-3" })
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => removeFromCart(it.id),
									"aria-label": "Remove",
									className: "flex h-9 w-9 items-center justify-center rounded-full text-[#7a6e64] hover:bg-red-50 hover:text-red-500",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-4 max-sm:hidden sm:flex-col sm:items-end",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1 rounded-full border border-[#e0d8cc] p-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setQty(it.id, qty - 1),
									"aria-label": "Decrease",
									className: "flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#f5efe8]",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "h-3 w-3" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "min-w-6 text-center text-sm font-semibold",
									children: qty
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setQty(it.id, qty + 1),
									"aria-label": "Increase",
									className: "flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#f5efe8]",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3 w-3" })
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => removeFromCart(it.id),
							"aria-label": "Remove",
							className: "flex h-9 w-9 items-center justify-center rounded-full text-[#7a6e64] hover:bg-red-50 hover:text-red-500",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
						})]
					})
				]
			}, it.id))]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
			className: "h-fit space-y-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-[28px] bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.05)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-lg font-semibold text-[#1a1a2e]",
						children: "Order Summary"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 space-y-3 border-t border-[#e0d8cc] pt-5 text-sm",
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
							discountAmount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Discount",
								value: `-${formatPrice(Math.round(discountAmount))}`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "my-2 border-t border-dashed border-[#e0d8cc]" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Total",
								value: formatPrice(total),
								bold: true
							})
						]
					}),
					giftCfg?.enabled && giftCfg?.status === "active" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 rounded-[20px] border border-[#e0d8cc] bg-white p-4",
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
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `mt-5 rounded-[20px] border border-dashed p-3 ${discountAmount > 0 && couponCode ? "border-[#7A2533]/30 bg-[#fff4f5] shadow-[0_8px_24px_rgba(122,37,51,0.06)]" : "border-[#7A2533]/40 bg-[#fdf8f3]"}`,
						children: [discountAmount > 0 && couponCode ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { className: "h-4 w-4 text-[#7A2533]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-medium text-[#7A2533]",
									children: couponCode
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => {
									clearCoupon();
									setCouponStatus("idle");
									setCouponMsg("");
									setCouponInput("");
								},
								className: "text-[11px] font-semibold text-[#7A2533] hover:text-[#5F1C27] hover:underline",
								children: "Remove"
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { className: "h-4 w-4 text-[#7A2533]" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: couponInput,
									onChange: (e) => {
										setCouponInput(e.target.value);
										if (couponStatus !== "idle") {
											setCouponStatus("idle");
											setCouponMsg("");
										}
									},
									placeholder: "Promo code",
									className: "flex-1 bg-transparent text-sm focus:outline-none"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: applyCoupon,
									disabled: couponStatus === "loading",
									className: "rounded-full bg-[#7A2533] px-3 py-1.5 text-[11px] font-semibold tracking-wider text-white uppercase transition-colors hover:bg-[#5F1C27] disabled:opacity-50",
									children: couponStatus === "loading" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3 w-3 animate-spin" }) : "Apply"
								})
							]
						}), couponMsg && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: `mt-2 text-[11px] font-medium ${couponStatus === "valid" ? "text-[#7A2533]" : "text-red-600"}`,
							children: couponMsg
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: user ? "/checkout" : "/login",
						search: user ? void 0 : { redirect: "/checkout" },
						disabled: lines.length === 0,
						className: "btn-primary mt-5 flex w-full justify-center disabled:cursor-not-allowed disabled:opacity-50",
						children: "Proceed to Checkout"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/shop",
						className: "mt-3 block text-center text-[12px] font-semibold tracking-[0.14em] text-[#7a6e64] uppercase hover:text-[#8B1A1A]",
						children: "← Continue Shopping"
					})
				]
			})
		})]
	})] });
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
export { CartPage as component };
