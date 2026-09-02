/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NormalizedOrderItem } from "@/lib/api/order-items";

export type EmailTemplateKey =
  | "welcome"
  | "order_confirmation"
  | "invoice"
  | "payment_confirmation"
  | "shipped"
  | "delivered"
  | "cancellation"
  | "refund"
  | "payment_failed";

export type EmailRenderResult = {
  subject: string;
  html: string;
  text: string;
};

export type StoreEmailSettings = {
  businessName: string;
  logoUrl: string;
  supportEmail: string;
  supportPhone: string;
  websiteUrl: string;
  businessAddress: string;
  gstin: string;
  returnPolicyUrl: string;
  privacyPolicyUrl: string;
  instagramUrl: string;
  facebookUrl: string;
  youtubeUrl: string;
  invoiceFooterText: string;
  copyrightText: string;
};

export type OrderEmailData = {
  order: any;
  items: NormalizedOrderItem[];
  payments?: any[];
  invoiceNumber?: string;
  store: StoreEmailSettings;
  secureOrderUrl?: string;
  secureInvoiceUrl?: string;
  secureTrackingUrl?: string;
  isTest?: boolean;
  intendedRecipient?: string | null;
};

export type CustomerEmailData = {
  customer?: any;
  store: StoreEmailSettings;
  isTest?: boolean;
  intendedRecipient?: string | null;
};
