import { supabase } from "../supabase";

const db = () => supabase as any;

export const settingsApi = {
  async get(key: string): Promise<any | null> {
    const { data, error } = await db().from("site_settings").select("*").eq("setting_key", key).maybeSingle();
    if (error) return null;
    return data as any;
  },

  async set(key: string, value: any): Promise<void> {
    const existing = await settingsApi.get(key);
    if (existing) {
      await db().from("site_settings").update({ setting_value: value }).eq("setting_key", key);
    } else {
      await db().from("site_settings").insert({ setting_key: key, setting_value: value });
    }
  },

  async getAll(): Promise<any[]> {
    const { data, error } = await db().from("site_settings").select("*").order("setting_key");
    if (error) throw error;
    return (data as any[]) || [];
  },
};
