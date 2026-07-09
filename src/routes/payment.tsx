import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { CreditCard, DollarSign, Building2, Wallet, Truck, Loader2, ShieldCheck, CheckCircle } from "lucide-react";
import { PageShell } from "@/components/site/PageHeader";
import { useAuth } from "@/lib/auth";
import { useCartLines, useStore } from "@/lib/store";
import { formatPrice } from "@/lib/products";
import { createOrder } from "@/lib/api/checkout";

type PaymentMethod = "upi" | "card" | "netbanking" | "wallet" | "cod";

const METHODS: { id: PaymentMethod; label: string; icon: any }[] = [
  { id: "upi", label: "UPI", icon: SmartphoneIcon },
  { id: "card", label: "Credit / Debit Card", icon: CreditCard },
  { id: "netbanking", label: "Net Banking", icon: Building2 },
  { id: "wallet", label: "Wallets", icon: Wallet },
  { id: "cod", label: "Cash on Delivery", icon: Truck },
];

function SmartphoneIcon(props: any) { return (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="14" height="20" x="5" y="2" rx="2" ry="2" /><line x1="12" x2="12.01" y1="18" y2="18" /></svg>); }

export const Route = createFileRoute("/payment")({
  component: PaymentPage,
});

function PaymentPage() {
  const { user, loading: authLoading } = useAuth();
  const lines = useCartLines();
  const { cartSubtotal, clearCart, cart } = useStore();
  const navigate = useNavigate();

  const checkoutAttemptRef = useRef<string>(crypto.randomUUID());
  const [method, setMethod] = useState<PaymentMethod>("upi");
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [selectedWallet, setSelectedWallet] = useState("");
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
  const [checkoutData, setCheckoutData] = useState<any>(null);
  const [success, setSuccess] = useState<{ orderNumber: string } | null>(null);

  useEffect(() => {
    if (!authLoading && !user) { navigate({ to: "/login", search: { redirect: "/payment" } }); return; }
    try {
      const raw = sessionStorage.getItem("cm_checkout_data");
      if (raw) setCheckoutData(JSON.parse(raw));
    } catch {}
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!authLoading && !checkoutData && lines.length === 0) { navigate({ to: "/cart" }); }
  }, [checkoutData, lines, authLoading, navigate]);

  if (authLoading || !user || !checkoutData) return null;

  const totals = checkoutData.totals;
  const codEnabled = true;

  const validateMethod = (): string | null => {
    if (method === "upi" && !upiId.trim()) return "Please enter your UPI ID.";
    if (method === "upi" && !/^[\w.-]+@[\w]+$/.test(upiId.trim())) return "Please enter a valid UPI ID (e.g., name@bank).";
    if (method === "card" && cardNumber.replace(/\s/g, "").length < 13) return "Please enter a valid card number.";
    if (method === "card" && !cardName.trim()) return "Please enter the cardholder name.";
    if (method === "card" && cardExpiry.length < 4) return "Please enter the expiry date.";
    if (method === "card" && cardCvv.length < 3) return "Please enter the CVV.";
    if (method === "netbanking" && !selectedBank) return "Please select a bank.";
    if (method === "wallet" && !selectedWallet) return "Please select a wallet.";
    return null;
  };

  const handlePay = async () => {
    const validationError = validateMethod();
    if (validationError) { setError(validationError); return; }
    if (paying) return;

    setPaying(true);
    setError("");

    try {
    const result = await createOrder({
      checkoutAttemptId: checkoutAttemptRef.current,
      customerId: user.id,
      customerName: user.fullName,
      customerEmail: user.email,
      customerPhone: checkoutData.phone || user.email,
      items: checkoutData.items,
      subtotal: totals.subtotal,
      discountAmount: totals.discountAmount,
      couponCode: null,
      couponId: null,
      shipping: totals.shipping,
      tax: totals.tax,
      total: totals.total,
      paymentMethod: method,
      deliveryAddress: {
        addressLine1: checkoutData.address.line1,
        addressLine2: checkoutData.address.line2,
        city: checkoutData.address.city,
        state: checkoutData.address.state,
        postalCode: checkoutData.address.postalCode,
        country: "India",
        landmark: checkoutData.address.landmark,
        addressType: "Home",
      },
    });

      if (result.error) { setError(result.error); setPaying(false); return; }

      clearCart();
      sessionStorage.removeItem("cm_checkout_data");
      setSuccess({ orderNumber: result.orderNumber });
      setPaying(false);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
      setPaying(false);
    }
  };

  if (success) {
    setTimeout(() => navigate({ to: `/order-success/${success.orderNumber}` }), 500);
    return (
      <PageShell>
        <div className="flex min-h-[60vh] items-center justify-center px-4">
          <div className="text-center">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-[#c9a96e]" />
            <p className="mt-4 text-lg font-medium text-[#1a1a2e]">Processing your order…</p>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-[1200px] px-6 py-16">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.24em] text-[#c9a96e] uppercase">Payment</p>
            <h1 className="font-display mt-2 text-[32px] font-semibold text-[#1a1a2e]">Complete Your Order</h1>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-medium text-amber-700 sm:flex">
            <ShieldCheck className="h-4 w-4" />
            Secure Demo Checkout — No real payment will be charged.
          </div>
        </div>

        <div className="mt-2 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-medium text-amber-700 sm:hidden">
          <ShieldCheck className="h-4 w-4 shrink-0" />
          Secure Demo Checkout — No real payment will be charged.
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_400px]">
          <div className="space-y-6">
            <div className="rounded-[28px] bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.05)]">
              <h2 className="font-display text-lg font-semibold text-[#1a1a2e]">Payment Method</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {METHODS.map((m) => (
                  <button key={m.id} onClick={() => { setMethod(m.id); setError(""); }} className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${method === m.id ? "border-[#c9a96e] bg-[#fdf8f3] text-[#1a1a2e]" : "border-[#e0d8cc] text-[#7a6e64] hover:border-[#c9a96e]/50"}`}>
                    <m.icon className="h-4 w-4" /> {m.label}
                  </button>
                ))}
              </div>

              <div className="mt-6">
                {method === "upi" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">UPI ID</label>
                      <input value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="name@bank" className="w-full rounded-xl border border-[#e0d8cc] px-4 py-3 text-sm outline-none focus:border-[#c9a96e]" />
                    </div>
                    <p className="text-xs text-[#7a6e64]">Demo: Enter any valid UPI ID format (e.g., name@upi)</p>
                  </div>
                )}

                {method === "card" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Card Number</label>
                      <input value={cardNumber} onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, "").replace(/(\d{4})/g, "$1 ").trim().slice(0, 19))} placeholder="4111 1111 1111 1111" className="w-full rounded-xl border border-[#e0d8cc] px-4 py-3 text-sm outline-none focus:border-[#c9a96e]" autoComplete="off" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Cardholder Name</label>
                        <input value={cardName} onChange={(e) => setCardName(e.target.value)} className="w-full rounded-xl border border-[#e0d8cc] px-4 py-3 text-sm outline-none focus:border-[#c9a96e]" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Expiry</label>
                        <input value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value.replace(/\D/g, "").replace(/^(\d{2})/, "$1/").slice(0, 5))} placeholder="MM/YY" className="w-full rounded-xl border border-[#e0d8cc] px-4 py-3 text-sm outline-none focus:border-[#c9a96e]" />
                      </div>
                    </div>
                    <div className="w-1/3">
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">CVV</label>
                      <input type="password" value={cardCvv} onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="***" className="w-full rounded-xl border border-[#e0d8cc] px-4 py-3 text-sm outline-none focus:border-[#c9a96e]" maxLength={4} autoComplete="off" />
                    </div>
                    <p className="text-xs text-[#7a6e64]">Demo: Use 4111 1111 1111 1111 for testing. No real card data is stored.</p>
                  </div>
                )}

                {method === "netbanking" && (
                  <div className="space-y-4">
                    <select value={selectedBank} onChange={(e) => setSelectedBank(e.target.value)} className="w-full rounded-xl border border-[#e0d8cc] px-4 py-3 text-sm outline-none focus:border-[#c9a96e]">
                      <option value="">Select your bank</option>
                      <option value="sbi">State Bank of India</option>
                      <option value="hdfc">HDFC Bank</option>
                      <option value="icici">ICICI Bank</option>
                      <option value="axis">Axis Bank</option>
                      <option value="kotak">Kotak Mahindra Bank</option>
                      <option value="bob">Bank of Baroda</option>
                      <option value="yes">Yes Bank</option>
                    </select>
                    <p className="text-xs text-[#7a6e64]">Demo: Selecting a bank simulates the payment. No real banking credentials are collected.</p>
                  </div>
                )}

                {method === "wallet" && (
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-3">
                      {["Paytm", "Amazon Pay", "Mobikwik", "Freecharge"].map((w) => (
                        <button key={w} onClick={() => setSelectedWallet(w)} className={`rounded-xl border px-5 py-3 text-sm font-medium transition-colors ${selectedWallet === w ? "border-[#c9a96e] bg-[#fdf8f3] text-[#1a1a2e]" : "border-[#e0d8cc] text-[#7a6e64] hover:border-[#c9a96e]/50"}`}>{w}</button>
                      ))}
                    </div>
                    <p className="text-xs text-[#7a6e64]">Demo: No real wallet authentication is performed.</p>
                  </div>
                )}

                {method === "cod" && (
                  <div className="space-y-4">
                    <div className="rounded-xl border border-[#e0d8cc] bg-[#fdf8f3] p-4">
                      <p className="text-sm font-medium text-[#1a1a2e]">Cash on Delivery</p>
                      <p className="mt-1 text-xs text-[#7a6e64]">Pay when your jewellery arrives. Available in eligible areas. No additional charge.</p>
                    </div>
                    {!codEnabled && <p className="text-xs text-amber-600">COD is currently disabled for your location.</p>}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="h-fit space-y-4 lg:sticky lg:top-28">
            <div className="rounded-[28px] bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.05)]">
              <h3 className="font-display text-lg font-semibold text-[#1a1a2e]">Order Summary</h3>
              <div className="mt-4 space-y-2 border-b border-[#e0d8cc] pb-4">
                {checkoutData.items.map((item: any) => (
                  <div key={item.productId} className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#f5efe8]">
                      <img src={item.image} alt={item.name} className="h-full w-full object-contain p-1" />
                    </div>
                    <div className="min-w-0 flex-1"><p className="truncate text-xs font-medium text-[#1a1a2e]">{item.name}</p><p className="text-[10px] text-[#7a6e64]">×{item.qty}</p></div>
                    <p className="text-xs font-semibold">{formatPrice(item.lineTotal)}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <Row label="Subtotal" value={formatPrice(totals.subtotal)} />
                <Row label="Shipping" value={totals.shipping === 0 ? "Free" : formatPrice(totals.shipping)} />
                {totals.discountAmount > 0 && <Row label="Discount" value={`-${formatPrice(totals.discountAmount)}`} />}
                <div className="my-2 border-t border-dashed border-[#e0d8cc]" />
                <Row label="Total" value={formatPrice(totals.total)} bold />
              </div>

              <div className="mt-4 rounded-xl bg-[#fdf8f3] p-3 text-xs text-[#7a6e64]">
                <p><strong>Delivering to:</strong><br />{checkoutData.address.line1}, {checkoutData.address.city}, {checkoutData.address.state} {checkoutData.address.postalCode}</p>
              </div>

              {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

              <button onClick={handlePay} disabled={paying} className="btn-primary mt-5 w-full justify-center disabled:opacity-60">
                {paying ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {paying ? "Processing…" : `Pay ${formatPrice(totals.total)}`}
              </button>

              <Link to="/checkout" className="mt-3 block text-center text-[11px] font-semibold tracking-[0.14em] text-[#7a6e64] uppercase hover:text-[#1a1a2e]">
                ← Back to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return <div className={`flex items-center justify-between ${bold ? "font-display text-base font-semibold text-[#1a1a2e]" : "text-[#7a6e64]"}`}><span>{label}</span><span className={bold ? "" : "text-[#1a1a2e]"}>{value}</span></div>;
}
