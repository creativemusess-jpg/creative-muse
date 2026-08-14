import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as formatPrice } from "./products-6Nbb9Ru-.mjs";
import { n as useCartLines, r as useStore } from "./store-CcwDJcbB.mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { Et as CircleAlert, It as Briefcase, K as MapPin, L as Pencil, Mt as Check, P as Plus, Y as LoaderCircle, _ as Trash2, kt as ChevronRight, p as Truck, y as Star } from "../_libs/lucide-react.mjs";
import { t as giftPackagingApi } from "./gift-packaging-B57zKQ8f.mjs";
import { n as PageShell } from "./PageHeader-DZsnNyor.mjs";
import { n as useAuth } from "./auth-D2-u71mo.mjs";
import { a as getStateCodeByName, i as getCitiesByState, n as calculateTotals, o as getStateNameByCode, s as saveAbandonedCheckout, t as INDIAN_STATES } from "./checkout-CST5jHga.mjs";
import { n as useAddresses } from "./addresses-34W13RH8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/checkout-B_qwxI6I.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PINCODE_CACHE = /* @__PURE__ */ new Map();
var CACHE_TTL = 36e5;
var BRANCH_ORDER = {
	"Delivery": 0,
	"PO": 1,
	"Sub Office": 2,
	"Sub Post Office": 2,
	"Branch Office": 3,
	"Head Office": 4,
	"Head Post Office": 4
};
function parseBranchType(type) {
	const t = type?.toLowerCase() || "";
	if (t.includes("head")) return "Head Office";
	if (t.includes("sub")) return "Sub Office";
	if (t.includes("delivery")) return "Delivery";
	if (t.includes("branch")) return "Branch Office";
	return type || "PO";
}
async function lookupPincode(pincode) {
	const trimmed = pincode.trim();
	if (!/^\d{6}$/.test(trimmed)) return {
		locations: [],
		error: "Invalid PIN code format. Must be exactly 6 digits."
	};
	const cached = PINCODE_CACHE.get(trimmed);
	if (cached && Date.now() - cached.timestamp < CACHE_TTL) return {
		locations: cached.data,
		error: null
	};
	try {
		const res = await fetch(`https://api.postalpincode.in/pincode/${trimmed}`, { signal: AbortSignal.timeout(8e3) });
		if (!res.ok) return {
			locations: [],
			error: "PIN code service unavailable. Please enter your address manually."
		};
		const first = (await res.json())?.[0];
		if (!first || first.Status === "Error" || first.Status === "404" || !first.PostOffice?.length) return {
			locations: [],
			error: "PIN code not found. Please verify and try again."
		};
		const locations = first.PostOffice.map((po) => {
			const stateName = po.State?.trim() || "";
			const stateCode = getStateCodeByName(stateName) || stateName;
			return {
				pincode: po.Pincode || trimmed,
				stateCode,
				stateName,
				district: po.District?.trim() || "",
				city: po.District?.trim() || "",
				locality: po.Name?.trim() || "",
				postOfficeType: parseBranchType(po.BranchType)
			};
		});
		locations.sort((a, b) => {
			return (BRANCH_ORDER[a.postOfficeType || "PO"] ?? 99) - (BRANCH_ORDER[b.postOfficeType || "PO"] ?? 99);
		});
		PINCODE_CACHE.set(trimmed, {
			data: locations,
			timestamp: Date.now()
		});
		return {
			locations,
			error: null
		};
	} catch (err) {
		if (err.name === "TimeoutError" || err.name === "AbortError") return {
			locations: [],
			error: "PIN code lookup timed out. Please enter your address manually."
		};
		return {
			locations: [],
			error: "Could not verify PIN code. Please enter your address manually."
		};
	}
}
function validateIndianPincode(pincode) {
	const trimmed = pincode.trim();
	if (!trimmed) return {
		valid: false,
		error: "PIN code is required."
	};
	if (!/^\d{6}$/.test(trimmed)) return {
		valid: false,
		error: "PIN code must be exactly 6 digits."
	};
	if (/^0{6}$/.test(trimmed)) return {
		valid: false,
		error: "Invalid PIN code."
	};
	return { valid: true };
}
function detectStateConflict(params) {
	const pincodeCode = params.pincodeStateCode || (params.pincodeStateName ? getStateCodeByName(params.pincodeStateName) : void 0);
	const selectedCode = params.selectedStateCode || (params.selectedStateName ? getStateCodeByName(params.selectedStateName) : void 0);
	if (pincodeCode && selectedCode && pincodeCode !== selectedCode) return {
		conflict: true,
		message: `This PIN code does not appear to match the selected city or state. Please verify your address.`
	};
	return { conflict: false };
}
var STEPS = [
	"Cart",
	"Delivery",
	"Payment",
	"Confirmation"
];
function CheckoutPage() {
	const { user, loading: authLoading } = useAuth();
	const lines = useCartLines();
	const { cartSubtotal, discountAmount, couponCode, appliedCouponId, giftPackagingEnabled, giftMessage } = useStore();
	const { addresses, defaultAddress, loading: addressesLoading, addAddress, editAddress, removeAddress, markDefault, refreshAddresses } = useAddresses();
	const navigate = useNavigate();
	const [address, setAddress] = (0, import_react.useState)({
		line1: "",
		line2: "",
		city: "",
		state: "",
		stateCode: "",
		postalCode: "",
		pincode: "",
		locality: "",
		district: "",
		landmark: "",
		country: "India"
	});
	const [fullName, setFullName] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [deliveryMethod, setDeliveryMethod] = (0, import_react.useState)("standard");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [selectedStateCode, setSelectedStateCode] = (0, import_react.useState)("");
	const [cityOptions, setCityOptions] = (0, import_react.useState)([]);
	const [selectedCityId, setSelectedCityId] = (0, import_react.useState)("");
	const [pincodeInput, setPincodeInput] = (0, import_react.useState)("");
	const [pincodeStatus, setPincodeStatus] = (0, import_react.useState)("idle");
	const [pincodeMsg, setPincodeMsg] = (0, import_react.useState)("");
	const [pincodeLocations, setPincodeLocations] = (0, import_react.useState)([]);
	const [selectedLocality, setSelectedLocality] = (0, import_react.useState)("");
	const [stateConflict, setStateConflict] = (0, import_react.useState)({ conflict: false });
	const [giftCfg, setGiftCfg] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		giftPackagingApi.getConfig().then(setGiftCfg);
	}, []);
	const [selectedAddressId, setSelectedAddressId] = (0, import_react.useState)(null);
	const [editingAddressId, setEditingAddressId] = (0, import_react.useState)(null);
	const [showSavedAddresses, setShowSavedAddresses] = (0, import_react.useState)(false);
	const [billingSame, setBillingSame] = (0, import_react.useState)(true);
	const [billingAddress, setBillingAddress] = (0, import_react.useState)({
		line1: "",
		line2: "",
		city: "",
		state: "",
		postalCode: "",
		country: "India"
	});
	const [saveAddr, setSaveAddr] = (0, import_react.useState)(true);
	const pincodeTimerRef = (0, import_react.useRef)(null);
	const latestPincodeRef = (0, import_react.useRef)("");
	const initializedRef = (0, import_react.useRef)(false);
	const subtotal = cartSubtotal;
	(0, import_react.useEffect)(() => {
		if (!authLoading && !user) navigate({
			to: "/login",
			search: { redirect: "/checkout" }
		});
	}, [
		authLoading,
		user,
		navigate
	]);
	(0, import_react.useEffect)(() => {
		if (lines.length === 0 && !authLoading) navigate({ to: "/cart" });
	}, [
		lines,
		authLoading,
		navigate
	]);
	const deliveryStateCode = selectedStateCode || address.stateCode || getStateCodeByName(address.state) || "";
	const totals = (0, import_react.useMemo)(() => calculateTotals({
		subtotal,
		couponDiscount: discountAmount || 0,
		deliveryMethod,
		deliveryStateCode
	}), [
		subtotal,
		discountAmount,
		deliveryMethod,
		deliveryStateCode
	]);
	(0, import_react.useEffect)(() => {
		if (pincodeLocations.length > 0 && !selectedLocality) setSelectedLocality(pincodeLocations[0].locality);
	}, [pincodeLocations, selectedLocality]);
	const selectSavedAddress = (0, import_react.useCallback)((addr) => {
		setSelectedAddressId(addr.id);
		setEditingAddressId(null);
		setFullName(addr.fullName || "");
		setPhone(addr.phone || "");
		setAddress({
			line1: addr.addressLine1 || "",
			line2: addr.addressLine2 || "",
			city: addr.city || "",
			state: addr.state || "",
			stateCode: getStateCodeByName(addr.state) || "",
			postalCode: addr.postalCode || "",
			pincode: addr.postalCode || "",
			locality: "",
			district: "",
			landmark: addr.landmark || "",
			country: "India"
		});
		if (addr.state) {
			const code = getStateCodeByName(addr.state) || "";
			setSelectedStateCode(code);
			setCityOptions(getCitiesByState(code));
		}
		if (addr.postalCode) {
			setPincodeInput(addr.postalCode);
			if (addr.postalCode.length === 6) lookupPincode(addr.postalCode).then((result) => {
				if (result.locations.length > 0) {
					setPincodeStatus("verified");
					setPincodeMsg("PIN code verified");
					setPincodeLocations(result.locations.map((l) => ({
						locality: l.locality,
						type: l.postOfficeType
					})));
					setSelectedLocality(result.locations[0].locality);
					setAddress((prev) => ({
						...prev,
						district: result.locations[0].district || ""
					}));
				}
			});
		}
		setShowSavedAddresses(false);
	}, []);
	const clearForm = (0, import_react.useCallback)(() => {
		setFullName("");
		setPhone("");
		setAddress({
			line1: "",
			line2: "",
			city: "",
			state: "",
			stateCode: "",
			postalCode: "",
			pincode: "",
			locality: "",
			district: "",
			landmark: "",
			country: "India"
		});
		setSelectedStateCode("");
		setCityOptions([]);
		setSelectedCityId("");
		setPincodeInput("");
		setPincodeStatus("idle");
		setPincodeMsg("");
		setPincodeLocations([]);
		setSelectedLocality("");
		setStateConflict({ conflict: false });
	}, []);
	const handleDeleteAddress = (0, import_react.useCallback)(async (addrId) => {
		await removeAddress(addrId);
		if (selectedAddressId === addrId) setSelectedAddressId(null);
	}, [removeAddress, selectedAddressId]);
	const handleEditAddress = (0, import_react.useCallback)((addr) => {
		setEditingAddressId(addr.id);
		setSelectedAddressId(null);
		selectSavedAddress(addr);
		window.scrollTo({
			top: 0,
			behavior: "smooth"
		});
	}, [selectSavedAddress]);
	const handleSetDefault = (0, import_react.useCallback)(async (addrId) => {
		await markDefault(addrId);
	}, [markDefault]);
	const handleAddNew = (0, import_react.useCallback)(() => {
		setEditingAddressId(null);
		setSelectedAddressId(null);
		clearForm();
		setShowSavedAddresses(false);
		window.scrollTo({
			top: 0,
			behavior: "smooth"
		});
	}, [clearForm]);
	(0, import_react.useEffect)(() => {
		if (initializedRef.current || addressesLoading) return;
		if (defaultAddress && !selectedAddressId) selectSavedAddress(defaultAddress);
		initializedRef.current = true;
	}, [
		defaultAddress,
		addresses,
		addressesLoading,
		selectedAddressId,
		selectSavedAddress
	]);
	const handlePincodeChange = (0, import_react.useCallback)((value) => {
		const cleaned = value.replace(/\D/g, "").slice(0, 6);
		setPincodeInput(cleaned);
		if (pincodeTimerRef.current) clearTimeout(pincodeTimerRef.current);
		if (cleaned.length !== 6) {
			setPincodeStatus("idle");
			setPincodeMsg("");
			setPincodeLocations([]);
			setSelectedLocality("");
			return;
		}
		const validation = validateIndianPincode(cleaned);
		if (!validation.valid) {
			setPincodeStatus("invalid");
			setPincodeMsg(validation.error || "Invalid PIN code.");
			setPincodeLocations([]);
			setSelectedLocality("");
			return;
		}
		setPincodeStatus("checking");
		setPincodeMsg("Checking PIN code…");
		latestPincodeRef.current = cleaned;
		pincodeTimerRef.current = setTimeout(async () => {
			if (latestPincodeRef.current !== cleaned) return;
			const result = await lookupPincode(cleaned);
			if (latestPincodeRef.current !== cleaned) return;
			if (result.error || result.locations.length === 0) {
				setPincodeStatus("not_found");
				setPincodeMsg(result.error || "PIN code not found. Enter address manually.");
				return;
			}
			const first = result.locations[0];
			const stateCode = first.stateCode || getStateCodeByName(first.stateName) || "";
			const stateName = first.stateName || getStateNameByCode(stateCode);
			setPincodeStatus("verified");
			setPincodeMsg("PIN code verified");
			setPincodeLocations(result.locations.map((l) => ({
				locality: l.locality,
				type: l.postOfficeType
			})));
			setSelectedLocality(result.locations[0].locality);
			setAddress((prev) => ({
				...prev,
				postalCode: cleaned,
				pincode: cleaned,
				district: first.district || ""
			}));
			if (stateCode) {
				setSelectedStateCode(stateCode);
				setAddress((prev) => ({
					...prev,
					state: stateName,
					stateCode
				}));
				setCityOptions(getCitiesByState(stateCode));
				const cityName = first.city || first.district || "";
				const matchingCity = getCitiesByState(stateCode).find((c) => c.name.toLowerCase() === cityName.toLowerCase());
				if (matchingCity) {
					setSelectedCityId(matchingCity.id);
					setAddress((prev) => ({
						...prev,
						city: matchingCity.name
					}));
				} else if (cityName) {
					setSelectedCityId("");
					setAddress((prev) => ({
						...prev,
						city: cityName
					}));
				}
			}
		}, 500);
	}, []);
	const handleStateChange = (0, import_react.useCallback)((code) => {
		setSelectedStateCode(code);
		const stateName = getStateNameByCode(code);
		setAddress((prev) => ({
			...prev,
			state: stateName,
			stateCode: code
		}));
		setCityOptions(getCitiesByState(code));
		setSelectedCityId("");
		const currentCity = address.city;
		if (currentCity) {
			if (!getCitiesByState(code).some((c) => c.name.toLowerCase() === currentCity.toLowerCase())) setAddress((prev) => ({
				...prev,
				city: "",
				district: ""
			}));
		}
		if (pincodeStatus === "verified") setStateConflict(detectStateConflict({
			selectedStateCode: code,
			pincodeStateCode: deliveryStateCode
		}));
	}, [
		address.city,
		pincodeStatus,
		deliveryStateCode
	]);
	const handleCityChange = (0, import_react.useCallback)((cityId) => {
		setSelectedCityId(cityId);
		const city = cityOptions.find((c) => c.id === cityId);
		if (city) setAddress((prev) => ({
			...prev,
			city: city.name,
			district: city.district || city.name
		}));
	}, [cityOptions]);
	const handleLocalityChange = (0, import_react.useCallback)((locality) => {
		setSelectedLocality(locality);
		setAddress((prev) => ({
			...prev,
			locality
		}));
	}, []);
	const handleContinue = async (e) => {
		e.preventDefault();
		if (!fullName.trim()) {
			setError("Please enter a full name.");
			return;
		}
		if (!address.line1.trim() || !address.city.trim() || !address.state.trim() || !address.postalCode.trim()) {
			setError("Please fill in all required address fields.");
			return;
		}
		if (pincodeStatus === "checking") {
			setError("Please wait while we verify your PIN code.");
			return;
		}
		if (stateConflict.conflict) {
			setError(stateConflict.message || "Please verify your address.");
			return;
		}
		setSaving(true);
		setError("");
		if (editingAddressId && saveAddr) await editAddress(editingAddressId, {
			fullName: fullName.trim(),
			phone: phone || user?.email || "",
			email: user?.email || "",
			addressLine1: address.line1,
			addressLine2: address.line2,
			city: address.city,
			state: address.state,
			postalCode: address.postalCode,
			landmark: address.landmark
		});
		const checkoutData = {
			address: {
				...address,
				stateCode: deliveryStateCode
			},
			fullName: fullName.trim(),
			phone: phone || user?.email || "",
			email: user?.email || "",
			deliveryMethod,
			totals: {
				subtotal: totals.itemsSubtotal,
				discountAmount: totals.couponDiscount,
				shipping: totals.shippingCharge,
				tax: 0,
				total: totals.grandTotal
			},
			couponCode: couponCode || null,
			couponId: appliedCouponId || null,
			billingSame,
			billingAddress: billingSame ? null : billingAddress,
			saveAddress: saveAddr,
			giftPackagingEnabled,
			giftMessage,
			items: lines.map((l) => ({
				productId: l.product.id,
				name: l.product.name,
				image: l.product.image,
				qty: l.qty,
				unitPrice: l.product.price,
				lineTotal: l.product.price * l.qty
			}))
		};
		sessionStorage.setItem("cm_checkout_data", JSON.stringify(checkoutData));
		saveAbandonedCheckout({
			customerId: user?.id || "",
			customerEmail: user?.email || "",
			cartValue: totals.grandTotal,
			lastStep: "delivery",
			deliveryPincode: address.postalCode,
			deliveryState: address.state
		});
		navigate({ to: "/payment" });
	};
	if (authLoading || !user) return null;
	if (lines.length === 0) return null;
	const addressTypeIcon = (type) => {
		switch ((type || "Home").toLowerCase()) {
			case "work":
			case "office": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "h-4 w-4" });
			default: return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-4 w-4" });
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-[1200px] px-6 py-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center justify-center gap-2 sm:gap-4 mb-10 text-xs sm:text-sm",
				children: STEPS.map((step, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full text-[11px] font-bold ${i === 1 ? "bg-[#7A2533] text-white" : i < 1 ? "bg-[#7A2533] text-white" : "bg-gray-100 text-gray-400"}`,
							children: i < 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" }) : i + 1
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `hidden sm:inline font-medium ${i === 1 ? "text-[#1a1a2e]" : "text-gray-400"}`,
							children: step
						}),
						i < STEPS.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3 w-3 text-gray-300" })
					]
				}, step))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] font-semibold tracking-[0.24em] text-[#7A2533] uppercase",
				children: "Checkout"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display mt-2 text-[32px] font-semibold text-[#1a1a2e]",
				children: "Delivery Details"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleContinue,
				className: "mt-10 grid gap-10 overflow-hidden lg:grid-cols-[1fr_400px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-[28px] bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.05)]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
									className: "font-display text-lg font-semibold text-[#1a1a2e] flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-4 w-4 text-[#7A2533]" }),
										" Delivery Address",
										addresses.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setShowSavedAddresses(!showSavedAddresses),
											className: "ml-auto text-[11px] font-semibold text-[#7A2533] uppercase tracking-wider hover:underline",
											children: showSavedAddresses ? "Hide Saved" : `Saved (${addresses.length})`
										})
									]
								}),
								showSavedAddresses && addresses.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 space-y-2 max-h-80 overflow-y-auto",
									children: [addresses.map((addr) => {
										const isSelected = selectedAddressId === addr.id;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: `flex items-start gap-3 rounded-xl border p-3 text-left text-sm transition-colors ${isSelected ? "border-[#7A2533] bg-[#fdf8f3] ring-1 ring-[#7A2533]/30" : "border-[#e0d8cc] hover:border-[#7A2533]/50"}`,
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => selectSavedAddress(addr),
													className: "mt-1 shrink-0",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: `flex h-4 w-4 items-center justify-center rounded-full border-2 ${isSelected ? "border-[#7A2533] bg-[#7A2533]" : "border-gray-300"}`,
														children: isSelected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1.5 w-1.5 rounded-full bg-white" })
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													type: "button",
													onClick: () => selectSavedAddress(addr),
													className: "flex-1 text-left min-w-0",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex items-center gap-2 flex-wrap",
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "font-semibold text-[#1a1a2e]",
																	children: addr.fullName || "Saved Address"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																	className: "text-[10px] text-[#7a6e64] flex items-center gap-1",
																	children: [addressTypeIcon(addr.addressType), addr.addressType]
																}),
																addr.isDefault && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																	className: "inline-flex items-center gap-0.5 rounded-full bg-[#7A2533]/10 px-2 py-0.5 text-[10px] font-semibold text-[#7A2533] uppercase",
																	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-2.5 w-2.5" }), " Default"]
																})
															]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
															className: "mt-0.5 text-[#1a1a2e]",
															children: [addr.addressLine1, addr.addressLine2 ? `, ${addr.addressLine2}` : ""]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
															className: "text-xs text-[#7a6e64]",
															children: [
																addr.city,
																", ",
																addr.state,
																" — ",
																addr.postalCode
															]
														}),
														addr.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
															className: "text-xs text-[#7a6e64]",
															children: ["📞 ", addr.phone]
														})
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex shrink-0 flex-col gap-1",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															type: "button",
															onClick: () => handleEditAddress(addr),
															className: "rounded-full p-1.5 text-gray-400 hover:bg-[#f5efe8] hover:text-[#7A2533] transition-colors",
															title: "Edit",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-3.5 w-3.5" })
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															type: "button",
															onClick: () => handleDeleteAddress(addr.id),
															className: "rounded-full p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors",
															title: "Delete",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
														}),
														!addr.isDefault && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															type: "button",
															onClick: () => handleSetDefault(addr.id),
															className: "rounded-full p-1.5 text-gray-400 hover:bg-[#f5efe8] hover:text-[#7A2533] transition-colors text-[9px] font-semibold uppercase tracking-wider",
															title: "Set as Default",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-3 w-3" })
														})
													]
												})
											]
										}, addr.id);
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: handleAddNew,
										className: "flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#7A2533]/40 p-3 text-sm font-medium text-[#7A2533] hover:bg-[#fdf8f3] transition-colors",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Add New Address"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-5 grid gap-4 sm:grid-cols-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "sm:col-span-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1",
												children: "Full Name *"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												value: fullName,
												onChange: (e) => setFullName(e.target.value),
												placeholder: "Your full name",
												className: "w-full rounded-xl border border-[#e0d8cc] px-4 py-3 text-sm outline-none focus:border-[#7A2533]"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "sm:col-span-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1",
													children: "PIN Code *"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "relative",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														value: pincodeInput,
														onChange: (e) => handlePincodeChange(e.target.value),
														placeholder: "Enter 6-digit PIN code",
														maxLength: 6,
														className: `w-full rounded-xl border px-4 py-3 pr-10 text-sm outline-none transition-colors ${pincodeStatus === "verified" ? "border-[#7A2533] bg-[#fdf8f3]" : pincodeStatus === "checking" ? "border-amber-300 bg-amber-50" : pincodeStatus === "not_found" || pincodeStatus === "invalid" ? "border-red-300 bg-red-50" : "border-[#e0d8cc] focus:border-[#7A2533]"}`
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "absolute right-3 top-1/2 -translate-y-1/2",
														children: pincodeStatus === "checking" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin text-amber-500" }) : pincodeStatus === "verified" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4 text-[#7A2533]" }) : pincodeStatus === "not_found" || pincodeStatus === "invalid" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4 text-red-500" }) : null
													})]
												}),
												pincodeMsg && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: `mt-1 text-[11px] font-medium ${pincodeStatus === "verified" ? "text-[#7A2533]" : pincodeStatus === "checking" ? "text-amber-600" : "text-red-600"}`,
													children: pincodeMsg
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1",
											children: "State *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "relative",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												value: selectedStateCode,
												onChange: (e) => handleStateChange(e.target.value),
												className: `w-full appearance-none rounded-xl border px-4 py-3 pr-8 text-sm outline-none focus:border-[#7A2533] bg-white ${selectedStateCode ? "text-[#1a1a2e]" : "text-[#7a6e64]"}`,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "",
													children: "Select state"
												}), INDIAN_STATES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: s.code,
													children: s.name
												}, s.code))]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-[#7a6e64]" })]
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1",
											children: "City / District *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "relative",
											children: [selectedStateCode ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												value: selectedCityId,
												onChange: (e) => handleCityChange(e.target.value),
												className: "w-full appearance-none rounded-xl border border-[#e0d8cc] px-4 py-3 pr-8 text-sm outline-none focus:border-[#7A2533] bg-white",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "",
													children: "Select city"
												}), cityOptions.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: c.id,
													children: c.name
												}, c.id))]
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												value: address.city,
												onChange: (e) => setAddress({
													...address,
													city: e.target.value
												}),
												placeholder: "Select a state first",
												className: "w-full rounded-xl border border-[#e0d8cc] px-4 py-3 text-sm outline-none focus:border-[#7A2533]"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-[#7a6e64]" })]
										})] }),
										pincodeLocations.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "sm:col-span-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1",
												children: "Locality / Post Office"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "relative",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
													value: selectedLocality,
													onChange: (e) => handleLocalityChange(e.target.value),
													className: "w-full appearance-none rounded-xl border border-[#e0d8cc] px-4 py-3 pr-8 text-sm outline-none focus:border-[#7A2533] bg-white",
													children: pincodeLocations.map((loc, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
														value: loc.locality,
														children: [loc.locality, loc.type ? ` (${loc.type})` : ""]
													}, i))
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-[#7a6e64]" })]
											})]
										}),
										stateConflict.conflict && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "sm:col-span-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "mr-1 inline h-3 w-3" }), stateConflict.message]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "sm:col-span-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1",
												children: "Address Line 1 *"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												value: address.line1,
												onChange: (e) => setAddress({
													...address,
													line1: e.target.value
												}),
												placeholder: "House / Shop / Building No., Street",
												className: "w-full rounded-xl border border-[#e0d8cc] px-4 py-3 text-sm outline-none focus:border-[#7A2533]"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "sm:col-span-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1",
												children: "Address Line 2"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												value: address.line2,
												onChange: (e) => setAddress({
													...address,
													line2: e.target.value
												}),
												placeholder: "Apartment, Suite, Unit (optional)",
												className: "w-full rounded-xl border border-[#e0d8cc] px-4 py-3 text-sm outline-none focus:border-[#7A2533]"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1",
											children: "Landmark"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											value: address.landmark,
											onChange: (e) => setAddress({
												...address,
												landmark: e.target.value
											}),
											placeholder: "Near… (optional)",
											className: "w-full rounded-xl border border-[#e0d8cc] px-4 py-3 text-sm outline-none focus:border-[#7A2533]"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1",
											children: "Phone *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "tel",
											value: phone,
											onChange: (e) => setPhone(e.target.value),
											placeholder: user.email,
											className: "w-full rounded-xl border border-[#e0d8cc] px-4 py-3 text-sm outline-none focus:border-[#7A2533]"
										})] })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "mt-4 flex items-center gap-2 text-xs text-[#7a6e64]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: saveAddr,
										onChange: (e) => setSaveAddr(e.target.checked),
										className: "accent-[#7A2533]"
									}), "Save this address for future orders"]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-[28px] bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.05)]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
									className: "font-display text-lg font-semibold text-[#1a1a2e] flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-4 w-4 text-[#7A2533]" }), " Billing Address"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "mt-3 flex items-center gap-2 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: billingSame,
										onChange: (e) => setBillingSame(e.target.checked),
										className: "accent-[#7A2533]"
									}), "Billing address same as delivery address"]
								}),
								!billingSame && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 grid gap-4 sm:grid-cols-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "sm:col-span-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1",
												children: "Billing Address Line 1 *"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												value: billingAddress.line1,
												onChange: (e) => setBillingAddress({
													...billingAddress,
													line1: e.target.value
												}),
												className: "w-full rounded-xl border border-[#e0d8cc] px-4 py-3 text-sm outline-none focus:border-[#7A2533]"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "sm:col-span-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1",
												children: "Billing Address Line 2"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												value: billingAddress.line2,
												onChange: (e) => setBillingAddress({
													...billingAddress,
													line2: e.target.value
												}),
												className: "w-full rounded-xl border border-[#e0d8cc] px-4 py-3 text-sm outline-none focus:border-[#7A2533]"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1",
											children: "City *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											value: billingAddress.city,
											onChange: (e) => setBillingAddress({
												...billingAddress,
												city: e.target.value
											}),
											className: "w-full rounded-xl border border-[#e0d8cc] px-4 py-3 text-sm outline-none focus:border-[#7A2533]"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1",
											children: "State *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											value: billingAddress.state,
											onChange: (e) => setBillingAddress({
												...billingAddress,
												state: e.target.value
											}),
											className: "w-full rounded-xl border border-[#e0d8cc] px-4 py-3 text-sm outline-none focus:border-[#7A2533]"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1",
											children: "Postal Code *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											value: billingAddress.postalCode,
											onChange: (e) => setBillingAddress({
												...billingAddress,
												postalCode: e.target.value
											}),
											className: "w-full rounded-xl border border-[#e0d8cc] px-4 py-3 text-sm outline-none focus:border-[#7A2533]"
										})] })
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-[28px] bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.05)]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "font-display text-lg font-semibold text-[#1a1a2e] flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-4 w-4 text-[#7A2533]" }), " Delivery Option"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: `flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors ${deliveryMethod === "standard" ? "border-[#7A2533] bg-[#fdf8f3] ring-1 ring-[#7A2533]/30" : "border-[#e0d8cc] hover:border-[#7A2533]/50"}`,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "radio",
											name: "delivery",
											value: "standard",
											checked: deliveryMethod === "standard",
											onChange: (e) => setDeliveryMethod(e.target.value),
											className: "h-4 w-4 accent-[#7A2533]"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-medium text-[#1a1a2e]",
												children: "Standard Insured Delivery"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-[#7a6e64]",
												children: "Free · 3–5 business days"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-sm font-semibold text-[#7A2533]",
											children: "Free"
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: `flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors ${deliveryMethod === "express" ? "border-[#7A2533] bg-[#fdf8f3] ring-1 ring-[#7A2533]/30" : "border-[#e0d8cc] hover:border-[#7A2533]/50"}`,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "radio",
											name: "delivery",
											value: "express",
											checked: deliveryMethod === "express",
											onChange: (e) => setDeliveryMethod(e.target.value),
											className: "h-4 w-4 accent-[#7A2533]"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-medium text-[#1a1a2e]",
												children: "Express Delivery"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-[#7a6e64]",
												children: "₹450 · 1–2 business days"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-sm font-semibold text-[#1a1a2e]",
											children: "₹450"
										})
									]
								})]
							})]
						})
					]
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
								className: "mt-4 space-y-3",
								children: lines.map(({ product: p, qty }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: `flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br ${p.bg}`,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: p.image,
												alt: p.name,
												className: "h-full w-full object-contain p-1"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0 flex-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "truncate text-sm font-medium text-[#1a1a2e]",
												children: p.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-xs text-[#7a6e64]",
												children: [
													"Qty ",
													qty,
													" × ",
													formatPrice(p.price)
												]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm font-semibold text-[#1a1a2e]",
											children: formatPrice(p.price * qty)
										})
									]
								}, p.id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-5 space-y-2 border-t border-[#e0d8cc] pt-4 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
										label: "Subtotal",
										value: formatPrice(totals.itemsSubtotal)
									}),
									totals.couponDiscount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
										label: "Coupon Discount",
										value: `-${formatPrice(totals.couponDiscount)}`
									}),
									giftPackagingEnabled && giftCfg?.enabled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
										label: giftCfg.name || "Gift Packaging",
										value: formatPrice(giftCfg.price)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
										label: "Shipping",
										value: totals.shippingCharge === 0 ? "Free" : formatPrice(totals.shippingCharge)
									}),
									totals.shippingCharge > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-[10px] text-[#7a6e64] -mt-1",
										children: [
											totals.deliveryLabel,
											" · ",
											totals.deliveryEstimate
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "my-2 border-t border-[#e0d8cc]" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
										label: "Total",
										value: formatPrice(totals.grandTotal),
										bold: true
									})
								]
							}),
							error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm text-red-500",
								children: error
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "submit",
								disabled: saving,
								className: "btn-primary mt-5 w-full justify-center disabled:opacity-60",
								children: [
									saving ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : null,
									saving ? "Please wait…" : "Continue to Payment",
									!saving && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })
								]
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
export { CheckoutPage as component };
