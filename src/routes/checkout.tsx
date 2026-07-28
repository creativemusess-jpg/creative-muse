import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { ChevronRight, Loader2, MapPin, Truck, Check, AlertCircle, Pencil, Trash2, Star, Plus, Briefcase } from "lucide-react";
import { PageShell } from "@/components/site/PageHeader";
import { useAuth } from "@/lib/auth";
import { useCartLines, useStore } from "@/lib/store";
import { formatPrice } from "@/lib/products";
import { saveAbandonedCheckout } from "@/lib/api/checkout";
import { useAddresses } from "@/lib/addresses";
import type { CustomerAddress } from "@/lib/api/addresses";
import { calculateTotals, INDIAN_STATES, getCitiesByState, getStateCodeByName, getStateNameByCode, DEFAULT_DELIVERY, type CheckoutTotals, type DeliveryMethod, type CityOption } from "@/lib/checkout";
import { giftPackagingApi, type GiftPackagingConfig } from "@/lib/api/gift-packaging";
import { lookupPincode, validateIndianPincode, detectStateConflict } from "@/lib/checkout/pincode";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
});

const STEPS = ["Cart", "Delivery", "Payment", "Confirmation"];

function CheckoutPage() {
  const { user, loading: authLoading } = useAuth();
  const lines = useCartLines();
  const { cartSubtotal, discountAmount, couponCode, appliedCouponId, giftPackagingEnabled, giftMessage } = useStore();
  const { addresses, defaultAddress, loading: addressesLoading, addAddress, editAddress, removeAddress, markDefault, refreshAddresses } = useAddresses();
  const navigate = useNavigate();

  const [address, setAddress] = useState({ line1: "", line2: "", city: "", state: "", stateCode: "", postalCode: "", pincode: "", locality: "", district: "", landmark: "", country: "India" });
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("standard");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [selectedStateCode, setSelectedStateCode] = useState("");
  const [cityOptions, setCityOptions] = useState<CityOption[]>([]);
  const [selectedCityId, setSelectedCityId] = useState("");

  const [pincodeInput, setPincodeInput] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState<"idle" | "checking" | "verified" | "not_found" | "unavailable" | "invalid">("idle");
  const [pincodeMsg, setPincodeMsg] = useState("");
  const [pincodeLocations, setPincodeLocations] = useState<Array<{ locality: string; type?: string }>>([]);
  const [selectedLocality, setSelectedLocality] = useState("");
  const [stateConflict, setStateConflict] = useState<{ conflict: boolean; message?: string }>({ conflict: false });

  const [giftCfg, setGiftCfg] = useState<GiftPackagingConfig | null>(null);
  useEffect(() => { giftPackagingApi.getConfig().then(setGiftCfg); }, []);

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [showSavedAddresses, setShowSavedAddresses] = useState(false);
  const [billingSame, setBillingSame] = useState(true);
  const [billingAddress, setBillingAddress] = useState({ line1: "", line2: "", city: "", state: "", postalCode: "", country: "India" });

  const [saveAddr, setSaveAddr] = useState(true);

  const pincodeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestPincodeRef = useRef("");
  const initializedRef = useRef(false);

  const subtotal = cartSubtotal;

  useEffect(() => {
    if (!authLoading && !user) {
      navigate({ to: "/login", search: { redirect: "/checkout" } });
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (lines.length === 0 && !authLoading) {
      navigate({ to: "/cart" });
    }
  }, [lines, authLoading, navigate]);

  const deliveryStateCode = selectedStateCode || address.stateCode || getStateCodeByName(address.state) || "";

  const totals: CheckoutTotals = useMemo(() => calculateTotals({
    subtotal,
    couponDiscount: discountAmount || 0,
    deliveryMethod,
    deliveryStateCode,
  }), [subtotal, discountAmount, deliveryMethod, deliveryStateCode]);

  useEffect(() => {
    if (pincodeLocations.length > 0 && !selectedLocality) {
      setSelectedLocality(pincodeLocations[0].locality);
    }
  }, [pincodeLocations, selectedLocality]);

  const selectSavedAddress = useCallback((addr: CustomerAddress) => {
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
      country: "India",
    });
    if (addr.state) {
      const code = getStateCodeByName(addr.state) || "";
      setSelectedStateCode(code);
      setCityOptions(getCitiesByState(code));
    }
    if (addr.postalCode) {
      setPincodeInput(addr.postalCode);
      if (addr.postalCode.length === 6) {
        lookupPincode(addr.postalCode).then((result) => {
          if (result.locations.length > 0) {
            setPincodeStatus("verified");
            setPincodeMsg("PIN code verified");
            setPincodeLocations(result.locations.map((l) => ({ locality: l.locality, type: l.postOfficeType })));
            setSelectedLocality(result.locations[0].locality);
            setAddress((prev) => ({ ...prev, district: result.locations[0].district || "" }));
          }
        });
      }
    }
    setShowSavedAddresses(false);
  }, []);

  const clearForm = useCallback(() => {
    setFullName("");
    setPhone("");
    setAddress({ line1: "", line2: "", city: "", state: "", stateCode: "", postalCode: "", pincode: "", locality: "", district: "", landmark: "", country: "India" });
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

  const handleDeleteAddress = useCallback(async (addrId: string) => {
    await removeAddress(addrId);
    if (selectedAddressId === addrId) {
      setSelectedAddressId(null);
    }
  }, [removeAddress, selectedAddressId]);

  const handleEditAddress = useCallback((addr: CustomerAddress) => {
    setEditingAddressId(addr.id);
    setSelectedAddressId(null);
    selectSavedAddress(addr);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [selectSavedAddress]);

  const handleSetDefault = useCallback(async (addrId: string) => {
    await markDefault(addrId);
  }, [markDefault]);

  const handleAddNew = useCallback(() => {
    setEditingAddressId(null);
    setSelectedAddressId(null);
    clearForm();
    setShowSavedAddresses(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [clearForm]);

  useEffect(() => {
    if (initializedRef.current || addressesLoading) return;
    if (defaultAddress && !selectedAddressId) {
      selectSavedAddress(defaultAddress);
    }
    initializedRef.current = true;
  }, [defaultAddress, addresses, addressesLoading, selectedAddressId, selectSavedAddress]);

  const handlePincodeChange = useCallback((value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 6);
    setPincodeInput(cleaned);
    if (pincodeTimerRef.current) clearTimeout(pincodeTimerRef.current);
    if (cleaned.length !== 6) {
      setPincodeStatus("idle"); setPincodeMsg(""); setPincodeLocations([]); setSelectedLocality("");
      return;
    }
    const validation = validateIndianPincode(cleaned);
    if (!validation.valid) {
      setPincodeStatus("invalid"); setPincodeMsg(validation.error || "Invalid PIN code."); setPincodeLocations([]); setSelectedLocality("");
      return;
    }
    setPincodeStatus("checking"); setPincodeMsg("Checking PIN code…"); latestPincodeRef.current = cleaned;
    pincodeTimerRef.current = setTimeout(async () => {
      if (latestPincodeRef.current !== cleaned) return;
      const result = await lookupPincode(cleaned);
      if (latestPincodeRef.current !== cleaned) return;
      if (result.error || result.locations.length === 0) {
        setPincodeStatus("not_found"); setPincodeMsg(result.error || "PIN code not found. Enter address manually."); return;
      }
      const first = result.locations[0];
      const stateCode = first.stateCode || getStateCodeByName(first.stateName) || "";
      const stateName = first.stateName || getStateNameByCode(stateCode);
      setPincodeStatus("verified"); setPincodeMsg("PIN code verified");
      setPincodeLocations(result.locations.map((l) => ({ locality: l.locality, type: l.postOfficeType })));
      setSelectedLocality(result.locations[0].locality);
      setAddress((prev) => ({ ...prev, postalCode: cleaned, pincode: cleaned, district: first.district || "" }));
      if (stateCode) {
        setSelectedStateCode(stateCode);
        setAddress((prev) => ({ ...prev, state: stateName, stateCode }));
        setCityOptions(getCitiesByState(stateCode));
        const cityName = first.city || first.district || "";
        const matchingCity = getCitiesByState(stateCode).find((c) => c.name.toLowerCase() === cityName.toLowerCase());
        if (matchingCity) { setSelectedCityId(matchingCity.id); setAddress((prev) => ({ ...prev, city: matchingCity.name })); }
        else if (cityName) { setSelectedCityId(""); setAddress((prev) => ({ ...prev, city: cityName })); }
      }
    }, 500);
  }, []);

  const handleStateChange = useCallback((code: string) => {
    setSelectedStateCode(code);
    const stateName = getStateNameByCode(code);
    setAddress((prev) => ({ ...prev, state: stateName, stateCode: code }));
    setCityOptions(getCitiesByState(code));
    setSelectedCityId("");
    const currentCity = address.city;
    if (currentCity) {
      const cityStillValid = getCitiesByState(code).some((c) => c.name.toLowerCase() === currentCity.toLowerCase());
      if (!cityStillValid) setAddress((prev) => ({ ...prev, city: "", district: "" }));
    }
    if (pincodeStatus === "verified") {
      setStateConflict(detectStateConflict({ selectedStateCode: code, pincodeStateCode: deliveryStateCode }));
    }
  }, [address.city, pincodeStatus, deliveryStateCode]);

  const handleCityChange = useCallback((cityId: string) => {
    setSelectedCityId(cityId);
    const city = cityOptions.find((c) => c.id === cityId);
    if (city) setAddress((prev) => ({ ...prev, city: city.name, district: city.district || city.name }));
  }, [cityOptions]);

  const handleLocalityChange = useCallback((locality: string) => {
    setSelectedLocality(locality);
    setAddress((prev) => ({ ...prev, locality }));
  }, []);

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) { setError("Please enter a full name."); return; }
    if (!address.line1.trim() || !address.city.trim() || !address.state.trim() || !address.postalCode.trim()) {
      setError("Please fill in all required address fields."); return;
    }
    if (pincodeStatus === "checking") { setError("Please wait while we verify your PIN code."); return; }
    if (stateConflict.conflict) { setError(stateConflict.message || "Please verify your address."); return; }
    setSaving(true); setError("");

    if (editingAddressId && saveAddr) {
      await editAddress(editingAddressId, {
        fullName: fullName.trim(),
        phone: phone || user?.email || "",
        email: user?.email || "",
        addressLine1: address.line1,
        addressLine2: address.line2,
        city: address.city,
        state: address.state,
        postalCode: address.postalCode,
        landmark: address.landmark,
      });
    }

    const checkoutData = {
      address: { ...address, stateCode: deliveryStateCode },
      fullName: fullName.trim(),
      phone: phone || user?.email || "",
      email: user?.email || "",
      deliveryMethod,
      totals: { subtotal: totals.itemsSubtotal, discountAmount: totals.couponDiscount, shipping: totals.shippingCharge, tax: 0, total: totals.grandTotal },
      couponCode: couponCode || null,
      couponId: appliedCouponId || null,
      billingSame,
      billingAddress: billingSame ? null : billingAddress,
      saveAddress: saveAddr,
      giftPackagingEnabled,
      giftMessage,
      items: lines.map((l) => ({ productId: l.product.id, name: l.product.name, image: l.product.image, qty: l.qty, unitPrice: l.product.price, lineTotal: l.product.price * l.qty })),
    };
    sessionStorage.setItem("cm_checkout_data", JSON.stringify(checkoutData));

    saveAbandonedCheckout({
      customerId: user?.id || "",
      customerEmail: user?.email || "",
      cartValue: totals.grandTotal,
      lastStep: "delivery",
      deliveryPincode: address.postalCode,
      deliveryState: address.state,
    });

    navigate({ to: "/payment" });
  };

  if (authLoading || !user) return null;
  if (lines.length === 0) return null;

  const addressTypeIcon = (type: string) => {
    switch ((type || "Home").toLowerCase()) {
      case "work": case "office": return <Briefcase className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  return (
    <PageShell>
      <div className="mx-auto max-w-[1200px] px-6 py-16">
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-10 text-xs sm:text-sm">
          {STEPS.map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <div className={`flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full text-[11px] font-bold ${
                i === 1 ? "bg-[#c9a96e] text-white" : i < 1 ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"
              }`}>{i < 1 ? <Check className="h-3.5 w-3.5" /> : i + 1}</div>
              <span className={`hidden sm:inline font-medium ${i === 1 ? "text-[#1a1a2e]" : "text-gray-400"}`}>{step}</span>
              {i < STEPS.length - 1 && <ChevronRight className="h-3 w-3 text-gray-300" />}
            </div>
          ))}
        </div>

        <p className="text-[11px] font-semibold tracking-[0.24em] text-[#c9a96e] uppercase">Checkout</p>
        <h1 className="font-display mt-2 text-[32px] font-semibold text-[#1a1a2e]">Delivery Details</h1>

        <form onSubmit={handleContinue} className="mt-10 grid gap-10 overflow-hidden lg:grid-cols-[1fr_400px]">
          <div className="space-y-8">
            <div className="rounded-[28px] bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.05)]">
              <h2 className="font-display text-lg font-semibold text-[#1a1a2e] flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#c9a96e]" /> Delivery Address
                {addresses.length > 0 && (
                  <button type="button" onClick={() => setShowSavedAddresses(!showSavedAddresses)} className="ml-auto text-[11px] font-semibold text-[#c9a96e] uppercase tracking-wider hover:underline">
                    {showSavedAddresses ? "Hide Saved" : `Saved (${addresses.length})`}
                  </button>
                )}
              </h2>

              {showSavedAddresses && addresses.length > 0 && (
                <div className="mt-4 space-y-2 max-h-80 overflow-y-auto">
                  {addresses.map((addr) => {
                    const isSelected = selectedAddressId === addr.id;
                    return (
                      <div
                        key={addr.id}
                        className={`flex items-start gap-3 rounded-xl border p-3 text-left text-sm transition-colors ${
                          isSelected ? "border-[#c9a96e] bg-[#fdf8f3] ring-1 ring-[#c9a96e]/30" : "border-[#e0d8cc] hover:border-[#c9a96e]/50"
                        }`}
                      >
                        <button type="button" onClick={() => selectSavedAddress(addr)} className="mt-1 shrink-0">
                          <div className={`flex h-4 w-4 items-center justify-center rounded-full border-2 ${
                            isSelected ? "border-[#c9a96e] bg-[#c9a96e]" : "border-gray-300"
                          }`}>
                            {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                          </div>
                        </button>
                        <button type="button" onClick={() => selectSavedAddress(addr)} className="flex-1 text-left min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-[#1a1a2e]">{addr.fullName || "Saved Address"}</span>
                            <span className="text-[10px] text-[#7a6e64] flex items-center gap-1">{addressTypeIcon(addr.addressType)}{addr.addressType}</span>
                            {addr.isDefault && (
                              <span className="inline-flex items-center gap-0.5 rounded-full bg-[#c9a96e]/10 px-2 py-0.5 text-[10px] font-semibold text-[#c9a96e] uppercase">
                                <Star className="h-2.5 w-2.5" /> Default
                              </span>
                            )}
                          </div>
                          <p className="mt-0.5 text-[#1a1a2e]">{addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ""}</p>
                          <p className="text-xs text-[#7a6e64]">{addr.city}, {addr.state} — {addr.postalCode}</p>
                          {addr.phone && <p className="text-xs text-[#7a6e64]">📞 {addr.phone}</p>}
                        </button>
                        <div className="flex shrink-0 flex-col gap-1">
                          <button type="button" onClick={() => handleEditAddress(addr)} className="rounded-full p-1.5 text-gray-400 hover:bg-[#f5efe8] hover:text-[#c9a96e] transition-colors" title="Edit">
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button type="button" onClick={() => handleDeleteAddress(addr.id)} className="rounded-full p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors" title="Delete">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                          {!addr.isDefault && (
                            <button type="button" onClick={() => handleSetDefault(addr.id)} className="rounded-full p-1.5 text-gray-400 hover:bg-[#f5efe8] hover:text-[#c9a96e] transition-colors text-[9px] font-semibold uppercase tracking-wider" title="Set as Default">
                              <Star className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  <button type="button" onClick={handleAddNew}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#c9a96e]/40 p-3 text-sm font-medium text-[#c9a96e] hover:bg-[#fdf8f3] transition-colors">
                    <Plus className="h-4 w-4" /> Add New Address
                  </button>
                </div>
              )}

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Full Name *</label>
                  <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" className="w-full rounded-xl border border-[#e0d8cc] px-4 py-3 text-sm outline-none focus:border-[#c9a96e]" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">PIN Code *</label>
                  <div className="relative">
                    <input value={pincodeInput} onChange={(e) => handlePincodeChange(e.target.value)} placeholder="Enter 6-digit PIN code" maxLength={6}
                      className={`w-full rounded-xl border px-4 py-3 pr-10 text-sm outline-none transition-colors ${pincodeStatus === "verified" ? "border-green-400 bg-green-50" : pincodeStatus === "checking" ? "border-amber-300 bg-amber-50" : pincodeStatus === "not_found" || pincodeStatus === "invalid" ? "border-red-300 bg-red-50" : "border-[#e0d8cc] focus:border-[#c9a96e]"}`} />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2">
                      {pincodeStatus === "checking" ? <Loader2 className="h-4 w-4 animate-spin text-amber-500" /> : pincodeStatus === "verified" ? <Check className="h-4 w-4 text-green-500" /> : pincodeStatus === "not_found" || pincodeStatus === "invalid" ? <AlertCircle className="h-4 w-4 text-red-500" /> : null}
                    </span>
                  </div>
                  {pincodeMsg && <p className={`mt-1 text-[11px] font-medium ${pincodeStatus === "verified" ? "text-green-600" : pincodeStatus === "checking" ? "text-amber-600" : "text-red-600"}`}>{pincodeMsg}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">State *</label>
                  <div className="relative">
                    <select value={selectedStateCode} onChange={(e) => handleStateChange(e.target.value)}
                      className={`w-full appearance-none rounded-xl border px-4 py-3 pr-8 text-sm outline-none focus:border-[#c9a96e] bg-white ${selectedStateCode ? "text-[#1a1a2e]" : "text-[#7a6e64]"}`}>
                      <option value="">Select state</option>
                      {INDIAN_STATES.map((s) => (<option key={s.code} value={s.code}>{s.name}</option>))}
                    </select>
                    <ChevronRight className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-[#7a6e64]" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">City / District *</label>
                  <div className="relative">
                    {selectedStateCode ? (
                      <select value={selectedCityId} onChange={(e) => handleCityChange(e.target.value)} className="w-full appearance-none rounded-xl border border-[#e0d8cc] px-4 py-3 pr-8 text-sm outline-none focus:border-[#c9a96e] bg-white">
                        <option value="">Select city</option>
                        {cityOptions.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
                      </select>
                    ) : (
                      <input value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} placeholder="Select a state first" className="w-full rounded-xl border border-[#e0d8cc] px-4 py-3 text-sm outline-none focus:border-[#c9a96e]" />
                    )}
                    <ChevronRight className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-[#7a6e64]" />
                  </div>
                </div>
                {pincodeLocations.length > 0 && (
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Locality / Post Office</label>
                    <div className="relative">
                      <select value={selectedLocality} onChange={(e) => handleLocalityChange(e.target.value)} className="w-full appearance-none rounded-xl border border-[#e0d8cc] px-4 py-3 pr-8 text-sm outline-none focus:border-[#c9a96e] bg-white">
                        {pincodeLocations.map((loc, i) => (<option key={i} value={loc.locality}>{loc.locality}{loc.type ? ` (${loc.type})` : ""}</option>))}
                      </select>
                      <ChevronRight className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-[#7a6e64]" />
                    </div>
                  </div>
                )}
                {stateConflict.conflict && (
                  <div className="sm:col-span-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700"><AlertCircle className="mr-1 inline h-3 w-3" />{stateConflict.message}</div>
                )}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Address Line 1 *</label>
                  <input value={address.line1} onChange={(e) => setAddress({ ...address, line1: e.target.value })} placeholder="House / Shop / Building No., Street" className="w-full rounded-xl border border-[#e0d8cc] px-4 py-3 text-sm outline-none focus:border-[#c9a96e]" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Address Line 2</label>
                  <input value={address.line2} onChange={(e) => setAddress({ ...address, line2: e.target.value })} placeholder="Apartment, Suite, Unit (optional)" className="w-full rounded-xl border border-[#e0d8cc] px-4 py-3 text-sm outline-none focus:border-[#c9a96e]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Landmark</label>
                  <input value={address.landmark} onChange={(e) => setAddress({ ...address, landmark: e.target.value })} placeholder="Near… (optional)" className="w-full rounded-xl border border-[#e0d8cc] px-4 py-3 text-sm outline-none focus:border-[#c9a96e]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Phone *</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={user.email} className="w-full rounded-xl border border-[#e0d8cc] px-4 py-3 text-sm outline-none focus:border-[#c9a96e]" />
                </div>
              </div>

              <label className="mt-4 flex items-center gap-2 text-xs text-[#7a6e64]">
                <input type="checkbox" checked={saveAddr} onChange={(e) => setSaveAddr(e.target.checked)} className="accent-[#c9a96e]" />
                Save this address for future orders
              </label>
            </div>

            <div className="rounded-[28px] bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.05)]">
              <h2 className="font-display text-lg font-semibold text-[#1a1a2e] flex items-center gap-2"><MapPin className="h-4 w-4 text-[#c9a96e]" /> Billing Address</h2>
              <label className="mt-3 flex items-center gap-2 text-sm">
                <input type="checkbox" checked={billingSame} onChange={(e) => setBillingSame(e.target.checked)} className="accent-[#c9a96e]" />
                Billing address same as delivery address
              </label>
              {!billingSame && (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Billing Address Line 1 *</label>
                    <input value={billingAddress.line1} onChange={(e) => setBillingAddress({ ...billingAddress, line1: e.target.value })} className="w-full rounded-xl border border-[#e0d8cc] px-4 py-3 text-sm outline-none focus:border-[#c9a96e]" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Billing Address Line 2</label>
                    <input value={billingAddress.line2} onChange={(e) => setBillingAddress({ ...billingAddress, line2: e.target.value })} className="w-full rounded-xl border border-[#e0d8cc] px-4 py-3 text-sm outline-none focus:border-[#c9a96e]" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">City *</label>
                    <input value={billingAddress.city} onChange={(e) => setBillingAddress({ ...billingAddress, city: e.target.value })} className="w-full rounded-xl border border-[#e0d8cc] px-4 py-3 text-sm outline-none focus:border-[#c9a96e]" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">State *</label>
                    <input value={billingAddress.state} onChange={(e) => setBillingAddress({ ...billingAddress, state: e.target.value })} className="w-full rounded-xl border border-[#e0d8cc] px-4 py-3 text-sm outline-none focus:border-[#c9a96e]" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Postal Code *</label>
                    <input value={billingAddress.postalCode} onChange={(e) => setBillingAddress({ ...billingAddress, postalCode: e.target.value })} className="w-full rounded-xl border border-[#e0d8cc] px-4 py-3 text-sm outline-none focus:border-[#c9a96e]" />
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-[28px] bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.05)]">
              <h2 className="font-display text-lg font-semibold text-[#1a1a2e] flex items-center gap-2"><Truck className="h-4 w-4 text-[#c9a96e]" /> Delivery Option</h2>
              <div className="mt-4 space-y-3">
                <label className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors ${deliveryMethod === "standard" ? "border-[#c9a96e] bg-[#fdf8f3] ring-1 ring-[#c9a96e]/30" : "border-[#e0d8cc] hover:border-[#c9a96e]/50"}`}>
                  <input type="radio" name="delivery" value="standard" checked={deliveryMethod === "standard"} onChange={(e) => setDeliveryMethod(e.target.value as DeliveryMethod)} className="h-4 w-4 accent-[#c9a96e]" />
                  <div className="flex-1"><p className="font-medium text-[#1a1a2e]">Standard Insured Delivery</p><p className="text-xs text-[#7a6e64]">Free · 3–5 business days</p></div>
                  <span className="text-sm font-semibold text-green-600">Free</span>
                </label>
                <label className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors ${deliveryMethod === "express" ? "border-[#c9a96e] bg-[#fdf8f3] ring-1 ring-[#c9a96e]/30" : "border-[#e0d8cc] hover:border-[#c9a96e]/50"}`}>
                  <input type="radio" name="delivery" value="express" checked={deliveryMethod === "express"} onChange={(e) => setDeliveryMethod(e.target.value as DeliveryMethod)} className="h-4 w-4 accent-[#c9a96e]" />
                  <div className="flex-1"><p className="font-medium text-[#1a1a2e]">Express Delivery</p><p className="text-xs text-[#7a6e64]">₹450 · 1–2 business days</p></div>
                  <span className="text-sm font-semibold text-[#1a1a2e]">₹450</span>
                </label>
              </div>
            </div>
          </div>

          <div className="h-fit space-y-4 lg:sticky lg:top-28">
            <div className="rounded-[28px] bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.05)]">
              <h3 className="font-display text-lg font-semibold text-[#1a1a2e]">Order Summary</h3>
              <div className="mt-4 space-y-3">
                {lines.map(({ product: p, qty }) => (
                  <div key={p.id} className="flex items-center gap-3">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br ${p.bg}`}>
                      <img src={p.image} alt={p.name} className="h-full w-full object-contain p-1" />
                    </div>
                    <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-[#1a1a2e]">{p.name}</p><p className="text-xs text-[#7a6e64]">Qty {qty} × {formatPrice(p.price)}</p></div>
                    <p className="text-sm font-semibold text-[#1a1a2e]">{formatPrice(p.price * qty)}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 space-y-2 border-t border-[#e0d8cc] pt-4 text-sm">
                <Row label="Subtotal" value={formatPrice(totals.itemsSubtotal)} />
                {totals.couponDiscount > 0 && <Row label="Coupon Discount" value={`-${formatPrice(totals.couponDiscount)}`} />}
                {giftPackagingEnabled && giftCfg?.enabled && <Row label={giftCfg.name || "Gift Packaging"} value={formatPrice(giftCfg.price)} />}
                <Row label="Shipping" value={totals.shippingCharge === 0 ? "Free" : formatPrice(totals.shippingCharge)} />
                {totals.shippingCharge > 0 && <p className="text-[10px] text-[#7a6e64] -mt-1">{totals.deliveryLabel} · {totals.deliveryEstimate}</p>}
                <div className="my-2 border-t border-[#e0d8cc]" />
                <Row label="Total" value={formatPrice(totals.grandTotal)} bold />
              </div>
              {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
              <button type="submit" disabled={saving} className="btn-primary mt-5 w-full justify-center disabled:opacity-60">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {saving ? "Please wait…" : "Continue to Payment"}
                {!saving && <ChevronRight className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </form>
      </div>
    </PageShell>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return <div className={`flex items-center justify-between ${bold ? "font-display text-base font-semibold text-[#1a1a2e]" : "text-[#7a6e64]"}`}><span>{label}</span><span className={bold ? "" : "text-[#1a1a2e]"}>{value}</span></div>;
}
