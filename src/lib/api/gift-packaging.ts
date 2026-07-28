/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from "../supabase";
import { settingsApi } from "./settings";

const db = () => supabase as any;

export interface GiftPackagingConfig {
  enabled: boolean;
  name: string;
  description: string;
  price: number;
  max_quantity: number;
  allow_gift_message: boolean;
  max_message_length: number;
  default_enabled: boolean;
  display_order: number;
  status: "active" | "inactive";
}

export interface EstimatedDeliveryConfig {
  enabled: boolean;
  min_days: number;
  max_days: number;
}

const DEFAULT_GIFT_PACKAGING: GiftPackagingConfig = {
  enabled: true,
  name: "Premium Gift Packaging",
  description: "Luxury gift box with ribbon and message card.",
  price: 199,
  max_quantity: 1,
  allow_gift_message: true,
  max_message_length: 200,
  default_enabled: false,
  display_order: 1,
  status: "active",
};

const DEFAULT_ESTIMATED_DELIVERY: EstimatedDeliveryConfig = {
  enabled: true,
  min_days: 3,
  max_days: 5,
};

export const giftPackagingApi = {
  async getConfig(): Promise<GiftPackagingConfig> {
    const data = await settingsApi.get("gift_packaging_config");
    if (!data?.setting_value) return DEFAULT_GIFT_PACKAGING;
    const val =
      typeof data.setting_value === "string"
        ? JSON.parse(data.setting_value)
        : data.setting_value;
    return { ...DEFAULT_GIFT_PACKAGING, ...val };
  },

  async saveConfig(config: GiftPackagingConfig): Promise<void> {
    await settingsApi.set("gift_packaging_config", config);
  },

  async getEstimatedDelivery(): Promise<EstimatedDeliveryConfig> {
    const data = await settingsApi.get("estimated_delivery_config");
    if (!data?.setting_value) return DEFAULT_ESTIMATED_DELIVERY;
    const val =
      typeof data.setting_value === "string"
        ? JSON.parse(data.setting_value)
        : data.setting_value;
    return { ...DEFAULT_ESTIMATED_DELIVERY, ...val };
  },

  async saveEstimatedDelivery(config: EstimatedDeliveryConfig): Promise<void> {
    await settingsApi.set("estimated_delivery_config", config);
  },
};
