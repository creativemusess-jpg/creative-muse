import { supabase } from "../supabase";

const SETTING_KEY = "announcements";
const db = () => supabase as any;

export interface Announcement {
  id: string;
  text: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export const announcementsApi = {
  async list(): Promise<Announcement[]> {
    const { data, error } = await db()
      .from("site_settings")
      .select("setting_value")
      .eq("setting_key", SETTING_KEY)
      .maybeSingle();
    if (error || !data?.setting_value) return [];
    return (data.setting_value as Announcement[]) || [];
  },

  async getActive(): Promise<Announcement[]> {
    const all = await announcementsApi.list();
    return all
      .filter((a) => a.is_active)
      .sort((a, b) => a.sort_order - b.sort_order);
  },

  async save(items: Announcement[]): Promise<void> {
    const { data: existing } = await db()
      .from("site_settings")
      .select("setting_key")
      .eq("setting_key", SETTING_KEY)
      .maybeSingle();

    if (existing) {
      await db()
        .from("site_settings")
        .update({ setting_value: items })
        .eq("setting_key", SETTING_KEY);
    } else {
      await db()
        .from("site_settings")
        .insert({ setting_key: SETTING_KEY, setting_value: items });
    }
  },

  async add(text: string, sortOrder: number): Promise<Announcement[]> {
    const items = await announcementsApi.list();
    const newItem: Announcement = {
      id: crypto.randomUUID(),
      text,
      is_active: true,
      sort_order: sortOrder,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    items.push(newItem);
    await announcementsApi.save(items);
    return items;
  },

  async update(id: string, updates: Partial<Pick<Announcement, "text" | "is_active" | "sort_order">>): Promise<Announcement[]> {
    const items = await announcementsApi.list();
    const idx = items.findIndex((a) => a.id === id);
    if (idx === -1) return items;
    items[idx] = { ...items[idx], ...updates, updated_at: new Date().toISOString() };
    await announcementsApi.save(items);
    return items;
  },

  async remove(id: string): Promise<Announcement[]> {
    const items = await announcementsApi.list();
    const filtered = items.filter((a) => a.id !== id);
    await announcementsApi.save(filtered);
    return filtered;
  },

  async reorder(orderedIds: string[]): Promise<Announcement[]> {
    const items = await announcementsApi.list();
    const orderMap = new Map(orderedIds.map((id, i) => [id, i]));
    items.forEach((a) => {
      if (orderMap.has(a.id)) a.sort_order = orderMap.get(a.id)!;
    });
    await announcementsApi.save(items);
    return items;
  },
};
