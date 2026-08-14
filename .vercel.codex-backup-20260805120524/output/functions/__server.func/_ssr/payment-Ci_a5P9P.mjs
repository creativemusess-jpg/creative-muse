import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as formatPrice } from "./products-6Nbb9Ru-.mjs";
import { n as useCartLines, r as useStore } from "./store-CcwDJcbB.mjs";
import { _ as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { E as ShieldCheck, Et as CircleAlert, Ft as Building2, M as RefreshCw, Y as LoaderCircle, i as Wallet, p as Truck, xt as CreditCard } from "../_libs/lucide-react.mjs";
import { t as giftPackagingApi } from "./gift-packaging-B57zKQ8f.mjs";
import { n as PageShell } from "./PageHeader-DZsnNyor.mjs";
import { n as useAuth } from "./auth-D2-u71mo.mjs";
import { r as createOrder } from "./checkout-CST5jHga.mjs";
import { r as saveCustomerAddress } from "./addresses-BS_C9H_D.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/payment-Ci_a5P9P.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var METHODS = [
	{
		id: "upi",
		label: "UPI",
		icon: SmartphoneIcon
	},
	{
		id: "card",
		label: "Credit / Debit Card",
		icon: CreditCard
	},
	{
		id: "netbanking",
		label: "Net Banking",
		icon: Building2
	},
	{
		id: "wallet",
		label: "Wallets",
		icon: Wallet
	},
	{
		id: "cod",
		label: "Cash on Delivery",
		icon: Truck
	}
];
var COD_MAX_AMOUNT = 5e4;
function SmartphoneIcon(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		xmlns: "http://www.w3.org/2000/svg",
		width: "24",
		height: "24",
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			width: "14",
			height: "20",
			x: "5",
			y: "2",
			rx: "2",
			ry: "2"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
			x1: "12",
			x2: "12.01",
			y1: "18",
			y2: "18"
		})]
	});
}
function PaymentPage() {
	const { user, loading: authLoading } = useAuth();
	const lines = useCartLines();
	const { cartSubtotal, clearCart, clearCoupon, cart } = useStore();
	const navigate = useNavigate();
	const checkoutAttemptRef = (0, import_react.useRef)(crypto.randomUUID());
	const [method, setMethod] = (0, import_react.useState)("upi");
	const [upiId, setUpiId] = (0, import_react.useState)("");
	const [cardNumber, setCardNumber] = (0, import_react.useState)("");
	const [cardName, setCardName] = (0, import_react.useState)("");
	const [cardExpiry, setCardExpiry] = (0, import_react.useState)("");
	const [cardCvv, setCardCvv] = (0, import_react.useState)("");
	const [selectedBank, setSelectedBank] = (0, import_react.useState)("");
	const [selectedWallet, setSelectedWallet] = (0, import_react.useState)("");
	const [paying, setPaying] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [checkoutData, setCheckoutData] = (0, import_react.useState)(null);
	const [giftCfg, setGiftCfg] = (0, import_react.useState)(null);
	const [success, setSuccess] = (0, import_react.useState)(null);
	const [retryCount, setRetryCount] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		giftPackagingApi.getConfig().then(setGiftCfg);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!authLoading && !user) {
			navigate({
				to: "/login",
				search: { redirect: "/payment" }
			});
			return;
		}
		try {
			const raw = sessionStorage.getItem("cm_checkout_data");
			if (raw) setCheckoutData(JSON.parse(raw));
		} catch {}
	}, [
		authLoading,
		user,
		navigate
	]);
	(0, import_react.useEffect)(() => {
		if (!authLoading && !checkoutData && lines.length === 0) navigate({ to: "/cart" });
	}, [
		checkoutData,
		lines,
		authLoading,
		navigate
	]);
	if (authLoading || !user || !checkoutData) return null;
	const totals = checkoutData.totals;
	const giftPackPrice = checkoutData.giftPackagingEnabled && giftCfg?.enabled ? giftCfg?.price || 0 : 0;
	const totalAmount = (totals?.total || 0) + giftPackPrice;
	const codEnabled = totalAmount <= COD_MAX_AMOUNT;
	const validateMethod = () => {
		if (method === "upi" && !upiId.trim()) return "Please enter your UPI ID.";
		if (method === "upi" && !/^[\w.-]+@[\w]+$/.test(upiId.trim())) return "Please enter a valid UPI ID (e.g., name@bank).";
		if (method === "card" && cardNumber.replace(/\s/g, "").length < 13) return "Please enter a valid card number.";
		if (method === "card" && !cardName.trim()) return "Please enter the cardholder name.";
		if (method === "card" && cardExpiry.length < 4) return "Please enter the expiry date.";
		if (method === "card" && cardCvv.length < 3) return "Please enter the CVV.";
		if (method === "netbanking" && !selectedBank) return "Please select a bank.";
		if (method === "wallet" && !selectedWallet) return "Please select a wallet.";
		if (method === "cod" && totalAmount > COD_MAX_AMOUNT) return "COD is not available for orders above ₹50,000.";
		return null;
	};
	const handlePay = async () => {
		const validationError = validateMethod();
		if (validationError) {
			setError(validationError);
			return;
		}
		if (paying) return;
		setPaying(true);
		setError("");
		try {
			const addr = checkoutData.address || {};
			const t = totals || {};
			const result = await createOrder({
				checkoutAttemptId: checkoutAttemptRef.current,
				customerId: user.id,
				customerName: user.fullName,
				customerEmail: user.email,
				customerPhone: checkoutData.phone || user.email,
				items: checkoutData.items,
				subtotal: t.subtotal || t.itemsSubtotal || 0,
				discountAmount: t.discountAmount || t.couponDiscount || 0,
				couponCode: checkoutData.couponCode || null,
				couponId: checkoutData.couponId || null,
				shipping: t.shipping || t.shippingCharge || 0,
				tax: 0,
				total: totalAmount,
				giftPackagingEnabled: checkoutData.giftPackagingEnabled || false,
				giftPackagingPrice: giftPackPrice,
				giftPackagingName: checkoutData.giftPackagingEnabled && giftCfg?.enabled ? giftCfg?.name || "Gift Packaging" : "",
				giftMessage: checkoutData.giftMessage || "",
				paymentMethod: method,
				deliveryMethod: checkoutData.deliveryMethod || "standard",
				deliveryAddress: {
					addressLine1: addr.line1 || "",
					addressLine2: addr.line2 || "",
					city: addr.city || "",
					state: addr.state || "",
					stateCode: addr.stateCode || "",
					district: addr.district || "",
					postalCode: addr.postalCode || addr.pincode || "",
					pincode: addr.pincode || addr.postalCode || "",
					locality: addr.locality || "",
					country: addr.country || "India",
					landmark: addr.landmark || "",
					addressType: "Home"
				},
				taxSnapshot: void 0
			});
			if (result.error) {
				setError(result.error);
				setPaying(false);
				setRetryCount((c) => c + 1);
				return;
			}
			if (checkoutData.saveAddress !== false && addr.line1) saveCustomerAddress({
				customerId: user.id,
				fullName: checkoutData.fullName || user?.fullName || "",
				phone: checkoutData.phone || user?.email || "",
				email: user?.email || "",
				addressLine1: addr.line1,
				addressLine2: addr.line2,
				city: addr.city || "",
				state: addr.state || "",
				postalCode: addr.postalCode || addr.pincode || "",
				landmark: addr.landmark
			});
			clearCart();
			clearCoupon();
			sessionStorage.setItem("cm_order_success", JSON.stringify({
				orderNumber: result.orderNumber,
				customerName: user?.user_metadata?.name || user?.email || "Customer",
				customerEmail: user?.email || "",
				items: checkoutData.items,
				subtotal: t.subtotal || t.itemsSubtotal,
				discountAmount: t.discountAmount || t.couponDiscount || 0,
				shipping: t.shipping || t.shippingCharge || 0,
				tax: 0,
				total: totalAmount,
				giftPackagingEnabled: checkoutData.giftPackagingEnabled || false,
				giftPackagingPrice: giftPackPrice,
				giftPackagingName: checkoutData.giftPackagingEnabled && giftCfg?.enabled ? giftCfg?.name || "Gift Packaging" : "",
				giftMessage: checkoutData.giftMessage || "",
				deliveryMethod: checkoutData.deliveryMethod,
				deliveryAddress: checkoutData.address,
				couponCode: checkoutData.couponCode || null,
				paymentMethod: checkoutData.paymentMethod || "demo",
				created_at: (/* @__PURE__ */ new Date()).toISOString()
			}));
			sessionStorage.removeItem("cm_checkout_data");
			setSuccess({ orderNumber: result.orderNumber });
			setPaying(false);
		} catch (err) {
			setError(err.message || "Something went wrong. Please try again.");
			setPaying(false);
			setRetryCount((c) => c + 1);
		}
	};
	if (success) {
		navigate({ to: `/order-success/${success.orderNumber}` });
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex min-h-[60vh] items-center justify-center px-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mx-auto h-12 w-12 animate-spin text-[#7A2533]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-lg font-medium text-[#1a1a2e]",
					children: "Processing your order…"
				})]
			})
		}) });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-[1200px] px-6 py-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] font-semibold tracking-[0.24em] text-[#7A2533] uppercase",
					children: "Payment"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display mt-2 text-[32px] font-semibold text-[#1a1a2e]",
					children: "Complete Your Order"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hidden items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-medium text-amber-700 sm:flex",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4" }), " Secure Demo Checkout — No real payment will be charged."]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-medium text-amber-700 sm:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4 shrink-0" }), " Secure Demo Checkout — No real payment will be charged."]
			}),
			retryCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4 shrink-0" }), " Payment failed. You can review your information and try again."]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 grid gap-10 lg:grid-cols-[1fr_400px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-[28px] bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.05)]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-lg font-semibold text-[#1a1a2e]",
								children: "Payment Method"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4 flex flex-wrap gap-2",
								children: METHODS.map((m) => {
									const disabled = m.id === "cod" && !codEnabled;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => {
											if (!disabled) {
												setMethod(m.id);
												setError("");
											}
										},
										disabled,
										className: `flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${method === m.id ? "border-[#7A2533] bg-[#7A2533] text-white shadow-[0_6px_16px_rgba(122,37,51,0.18)]" : disabled ? "border-gray-100 text-gray-300 cursor-not-allowed" : "border-[#e0d8cc] text-[#7a6e64] hover:border-[#7A2533]/50"}`,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(m.icon, { className: "h-4 w-4" }),
											" ",
											m.label
										]
									}, m.id);
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-6",
								children: [
									method === "upi" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1",
											children: "UPI ID"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											value: upiId,
											onChange: (e) => setUpiId(e.target.value),
											placeholder: "name@bank",
											className: "w-full rounded-xl border border-[#e0d8cc] px-4 py-3 text-sm outline-none focus:border-[#7A2533]"
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-[#7a6e64]",
											children: "Demo: Enter any valid UPI ID format (e.g., name@upi)"
										})]
									}),
									method === "card" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-4",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1",
												children: "Card Number"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												value: cardNumber,
												onChange: (e) => setCardNumber(e.target.value.replace(/\D/g, "").replace(/(\d{4})/g, "$1 ").trim().slice(0, 19)),
												placeholder: "4111 1111 1111 1111",
												className: "w-full rounded-xl border border-[#e0d8cc] px-4 py-3 text-sm outline-none focus:border-[#7A2533]",
												autoComplete: "off"
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "grid grid-cols-2 gap-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1",
													children: "Cardholder Name"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													value: cardName,
													onChange: (e) => setCardName(e.target.value),
													className: "w-full rounded-xl border border-[#e0d8cc] px-4 py-3 text-sm outline-none focus:border-[#7A2533]"
												})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1",
													children: "Expiry"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													value: cardExpiry,
													onChange: (e) => setCardExpiry(e.target.value.replace(/\D/g, "").replace(/^(\d{2})/, "$1/").slice(0, 5)),
													placeholder: "MM/YY",
													className: "w-full rounded-xl border border-[#e0d8cc] px-4 py-3 text-sm outline-none focus:border-[#7A2533]"
												})] })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "w-1/3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1",
													children: "CVV"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "password",
													value: cardCvv,
													onChange: (e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4)),
													placeholder: "***",
													className: "w-full rounded-xl border border-[#e0d8cc] px-4 py-3 text-sm outline-none focus:border-[#7A2533]",
													maxLength: 4,
													autoComplete: "off"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-[#7a6e64]",
												children: "Demo: Use 4111 1111 1111 1111 for testing."
											})
										]
									}),
									method === "netbanking" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											value: selectedBank,
											onChange: (e) => setSelectedBank(e.target.value),
											className: "w-full rounded-xl border border-[#e0d8cc] px-4 py-3 text-sm outline-none focus:border-[#7A2533]",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "",
													children: "Select your bank"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "sbi",
													children: "State Bank of India"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "hdfc",
													children: "HDFC Bank"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "icici",
													children: "ICICI Bank"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "axis",
													children: "Axis Bank"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "kotak",
													children: "Kotak Mahindra Bank"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "bob",
													children: "Bank of Baroda"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "yes",
													children: "Yes Bank"
												})
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-[#7a6e64]",
											children: "Demo: Selecting a bank simulates the payment."
										})]
									}),
									method === "wallet" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex flex-wrap gap-3",
											children: [
												"Paytm",
												"Amazon Pay",
												"Mobikwik",
												"Freecharge"
											].map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => setSelectedWallet(w),
												className: `rounded-xl border px-5 py-3 text-sm font-medium transition-colors ${selectedWallet === w ? "border-[#7A2533] bg-[#7A2533] text-white shadow-[0_6px_16px_rgba(122,37,51,0.18)]" : "border-[#e0d8cc] text-[#7a6e64] hover:border-[#7A2533]/50"}`,
												children: w
											}, w))
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-[#7a6e64]",
											children: "Demo: No real wallet authentication is performed."
										})]
									}),
									method === "cod" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "space-y-4",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: `rounded-xl border p-4 ${codEnabled ? "border-[#e0d8cc] bg-[#fdf8f3]" : "border-red-200 bg-red-50"}`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm font-medium text-[#1a1a2e]",
												children: "Cash on Delivery"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-1 text-xs text-[#7a6e64]",
												children: codEnabled ? "Pay when your jewellery arrives. Available in eligible areas." : `COD is not available for orders above ₹${COD_MAX_AMOUNT.toLocaleString("en-IN")}.`
											})]
										})
									})
								]
							})
						]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-fit space-y-4 lg:sticky lg:top-28",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-[28px] bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.05)]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-lg font-semibold text-[#1a1a2e]",
								children: "Order Summary"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4 space-y-2 border-b border-[#e0d8cc] pb-4",
								children: checkoutData.items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#f5efe8]",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: item.image,
												alt: item.name,
												className: "h-full w-full object-contain p-1"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0 flex-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "truncate text-xs font-medium text-[#1a1a2e]",
												children: item.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-[10px] text-[#7a6e64]",
												children: ["×", item.qty]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-semibold",
											children: formatPrice(item.lineTotal)
										})
									]
								}, item.productId))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 space-y-2 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
										label: "Subtotal",
										value: formatPrice(totals.subtotal)
									}),
									totals.discountAmount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
										label: "Discount",
										value: `-${formatPrice(totals.discountAmount)}`
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
										label: "Shipping",
										value: totals.shipping === 0 ? "Free" : formatPrice(totals.shipping)
									}),
									null,
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "my-2 border-t border-dashed border-[#e0d8cc]" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
										label: "Total",
										value: formatPrice(totals.total),
										bold: true
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 rounded-xl bg-[#fdf8f3] p-3 text-xs text-[#7a6e64]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Delivering to:" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									checkoutData.address.line1,
									", ",
									checkoutData.address.city,
									", ",
									checkoutData.address.state,
									" ",
									checkoutData.address.postalCode
								] }), checkoutData.deliveryMethod === "express" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-purple-600 font-medium",
									children: "Express Delivery"
								})]
							}),
							error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm text-red-500",
								children: error
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: handlePay,
								disabled: paying,
								className: "btn-primary mt-5 w-full justify-center disabled:opacity-60",
								children: [paying ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : retryCount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-4 w-4" }) : null, paying ? "Processing…" : retryCount > 0 ? "Retry Payment" : `Pay ${formatPrice(totals.total)}`]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/checkout",
								className: "mt-3 block text-center text-[11px] font-semibold tracking-[0.14em] text-[#7a6e64] uppercase hover:text-[#1a1a2e]",
								children: "← Back to Checkout"
							})
						]
					})
				})]
			})
		]
	}) });
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
export { PaymentPage as component };
