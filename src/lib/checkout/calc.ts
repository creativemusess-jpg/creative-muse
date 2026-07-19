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

function toPaise(n: number): number {
  return Math.round(n * 100);
}

function fromPaise(p: number): number {
  return p / 100;
}

function moneyRoundPaise(n: number, rule: TaxSettings["roundingRule"] = "round"): number {
  const paise = toPaise(n);
  switch (rule) {
    case "floor": return Math.floor(paise / 100);
    case "ceil": return Math.ceil(paise / 100);
    default: return Math.round(paise / 100);
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

  const shippingInBase = tax.applyGstToShipping ? shippingCharge : 0;
  let taxableBase = afterDiscount + shippingInBase;

  let cgstAmount = 0;
  let sgstAmount = 0;
  let igstAmount = 0;
  let gstAmount = 0;

  if (tax.enabled) {
    if (tax.mode === "inclusive") {
      const inclusiveRate = tax.defaultRate / 100;
      const taxablePaise = toPaise(taxableBase);
      const extractedPaise = taxablePaise - Math.round(taxablePaise / (1 + inclusiveRate));
      gstAmount = fromPaise(extractedPaise);
      if (gstType === "cgst_sgst") {
        cgstAmount = fromPaise(Math.round(extractedPaise / 2));
        sgstAmount = gstAmount - cgstAmount;
      } else {
        igstAmount = gstAmount;
      }
    } else {
      const taxablePaise = toPaise(taxableBase);
      if (gstType === "cgst_sgst") {
        cgstAmount = fromPaise(Math.round(taxablePaise * tax.cgstRate / 100));
        sgstAmount = fromPaise(Math.round(taxablePaise * tax.sgstRate / 100));
        gstAmount = cgstAmount + sgstAmount;
      } else {
        igstAmount = fromPaise(Math.round(taxablePaise * tax.igstRate / 100));
        gstAmount = igstAmount;
      }
    }
  }

  const totalPaise = toPaise(afterDiscount) + toPaise(shippingCharge) + toPaise(gstAmount);
  const roundingAdjustment = fromPaise(Math.round(totalPaise)) - afterDiscount - shippingCharge - gstAmount;
  const grandTotal = fromPaise(Math.round(totalPaise));

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
    cgstAmount: Math.round(cgstAmount * 100) / 100,
    sgstAmount: Math.round(sgstAmount * 100) / 100,
    igstAmount: Math.round(igstAmount * 100) / 100,
    gstAmount: Math.round(gstAmount * 100) / 100,
    roundingAdjustment: Math.round(roundingAdjustment * 100) / 100,
    grandTotal: Math.round(grandTotal * 100) / 100,
    deliveryLabel: deliveryInfo.label,
    deliveryDays: deliveryInfo.days,
    deliveryEstimate: `${fmtDate(estStart)}–${fmtDate(estEnd)}`,
  };
}

export function formatINR(n: number): string {
  return `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}
