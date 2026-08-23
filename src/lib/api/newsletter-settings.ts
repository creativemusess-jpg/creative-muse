import { supabase } from "../supabase";

const db = () => supabase as any;
const SETTING_KEY = "newsletter_popup_settings";

export interface NewsletterImage {
  id: string;
  url: string;
  altText: string;
  sortOrder: number;
}

export interface NewsletterSettings {
  enabled: boolean;
  label: string;
  heading: string;
  description: string;
  emailPlaceholder: string;
  buttonText: string;
  secondaryText: string;
  privacyText: string;
  privacyPolicyUrl: string;
  autoplay: boolean;
  slideDuration: number;
  transition: "slide" | "fade";
  images: NewsletterImage[];
}

const DEFAULT_SETTINGS: NewsletterSettings = {
  enabled: true,
  label: "CREATIVE MUSE",
  heading: "Get 10% Off\nYour First Order",
  description:
    "Join the Creative Muse Circle and receive early access to new collections, private offers and jewellery styling inspiration.",
  emailPlaceholder: "Enter your email address",
  buttonText: "Claim My Offer",
  secondaryText: "No thanks",
  privacyText:
    "By subscribing, you agree to receive Creative Muse updates and offers. You can unsubscribe at any time.",
  privacyPolicyUrl: "/privacy-policy",
  autoplay: true,
  slideDuration: 5,
  transition: "slide",
  images: [],
};

export const newsletterSettingsApi = {
  async get(): Promise<NewsletterSettings> {
    const { data, error } = await db()
      .from("site_settings")
      .select("setting_value")
      .eq("setting_key", SETTING_KEY)
      .maybeSingle();
    if (error || !data?.setting_value) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...data.setting_value };
  },

  async save(settings: NewsletterSettings): Promise<void> {
    const existing = await db()
      .from("site_settings")
      .select("setting_key")
      .eq("setting_key", SETTING_KEY)
      .maybeSingle();
    if (existing.data) {
      await db()
        .from("site_settings")
        .update({ setting_value: settings })
        .eq("setting_key", SETTING_KEY);
    } else {
      await db()
        .from("site_settings")
        .insert({ setting_key: SETTING_KEY, setting_value: settings });
    }
  },
};
