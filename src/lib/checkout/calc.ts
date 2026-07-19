import { DEFAULT_DELIVERY, DEFAULT_TAX_SETTINGS, type DeliveryMethod, type GstType, type TaxSettings, type DeliveryConfig } from "./rates";

export type CheckoutTotals = {
  itemsSubtotal: number;
  productDiscount: number;
  couponDiscount: number;
  shippingCharge: number;
  shippingMethod: DeliveryMethod;
  taxableAmount: number;
  gstType: GstType;
  cgstRate: number;
  sgstRate: number;
  igstRate: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  gstAmount: number;
  roundingAdjustment: number;
  grandTotal: number;
  deliveryLabel: string;
  deliveryDays: string;
  deliveryEstimate: string;
};

export type CalcInput = {
  subtotal: number;
  couponDiscount: number;
  deliveryMethod: DeliveryMethod;
  deliveryStateCode?: string;
  taxSettings?: TaxSettings;
  deliveryConfig?: DeliveryConfig;
};

function moneyRound(n: number, rule: TaxSettings["roundingRule"] = "round"): number {
  switch (rule) {
    case "floor": return Math.floor(n * 100) / 100;
    case "ceil": return Math.ceil(n * 100) / 100;
    default: return Math.round(n * 100) / 100;
  }
}

export function calculateTotals(input: CalcInput): CheckoutTotals {
  const tax = input.taxSettings || DEFAULT_TAX_SETTINGS;
  const delivery = input.deliveryConfig || DEFAULT_DELIVERY;

  const deliveryInfo = input.deliveryMethod === "express" ? delivery.express : delivery.standard;
  const shippingCharge = deliveryInfo.charge;
  const itemsSubtotal = input.subtotal;
  const productDiscount = 0;
  const couponDiscount = input.couponDiscount;
  const afterDiscount = itemsSubtotal - couponDiscount - productDiscount;

  const businessStateCode = tax.businessStateCode;
  const deliveryStateCode = input.deliveryStateCode || "";
  const isSameState = deliveryStateCode === businessStateCode;
  const gstType: GstType = tax.enabled ? (isSameState ? "cgst_sgst" : "igst") : "igst";

  let taxableBase = tax.mode === "inclusive" ? afterDiscount + (tax.applyGstToShipping ? shippingCharge : 0) : afterDiscount + (tax.applyGstToShipping ? shippingCharge : 0);

  let cgstAmount = 0;
  let sgstAmount = 0;
  let igstAmount = 0;
  let gstAmount = 0;

  if (tax.enabled) {
    if (tax.mode === "inclusive") {
      const inclusiveRate = tax.defaultRate / 100;
      const extractedTax = moneyRound(taxableBase - (taxableBase / (1 + inclusiveRate)), tax.roundingRule);
      gstAmount = extractedTax;
      if (gstType === "cgst_sgst") {
        cgstAmount = moneyRound(extractedTax / 2, tax.roundingRule);
        sgstAmount = extractedTax - cgstAmount;
      } else {
        igstAmount = extractedTax;
      }
    } else {
      taxableBase = afterDiscount + (tax.applyGstToShipping ? shippingCharge : 0);
      if (gstType === "cgst_sgst") {
        cgstAmount = moneyRound(taxableBase * (tax.cgstRate / 100), tax.roundingRule);
        sgstAmount = moneyRound(taxableBase * (tax.sgstRate / 100), tax.roundingRule);
        gstAmount = cgstAmount + sgstAmount;
      } else {
        igstAmount = moneyRound(taxableBase * (tax.igstRate / 100), tax.roundingRule);
        gstAmount = igstAmount;
      }
    }
  }

  const preRoundTotal = afterDiscount + shippingCharge + gstAmount;
  const roundingAdjustment = moneyRound(preRoundTotal) - preRoundTotal;
  const grandTotal = moneyRound(preRoundTotal);

  const now = new Date();
  const estDays = input.deliveryMethod === "express" ? [1, 2] : [3, 5];
  const estStart = new Date(now);
  estStart.setDate(estStart.getDate() + estDays[0]);
  const estEnd = new Date(now);
  estEnd.setDate(estEnd.getDate() + estDays[1]);
  const fmtDate = (d: Date) => d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });

  return {
    itemsSubtotal,
    productDiscount,
    couponDiscount,
    shippingCharge,
    shippingMethod: input.deliveryMethod,
    taxableAmount: taxableBase,
    gstType,
    cgstRate: tax.cgstRate,
    sgstRate: tax.sgstRate,
    igstRate: tax.igstRate,
    cgstAmount,
    sgstAmount,
    igstAmount,
    gstAmount,
    roundingAdjustment,
    grandTotal,
    deliveryLabel: deliveryInfo.label,
    deliveryDays: deliveryInfo.days,
    deliveryEstimate: `${fmtDate(estStart)}–${fmtDate(estEnd)}`,
  };
}

export function formatINR(n: number): string {
  return `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}
