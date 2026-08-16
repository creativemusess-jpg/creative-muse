import { supabase } from "../supabase";

export interface AdminNotification {
  id: string;
  type: string;
  title: string;
  message: string | null;
  entity_type: string | null;
  entity_id: string | null;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}

export const notificationsApi = {
  async list(opts: { limit?: number; unreadOnly?: boolean } = {}): Promise<AdminNotification[]> {
    let query = supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(opts.limit || 50);
    if (opts.unreadOnly) query = query.eq("is_read", false);
    const { data, error } = await query;
    if (error) throw error;
    return ((data as any[]) || []).map(normalize);
  },

  async unreadCount(): Promise<number> {
    const { count, error } = await supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("is_read", false);
    if (error) throw error;
    return count ?? 0;
  },

  async markRead(id: string): Promise<void> {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq("id", id);
    if (error) throw error;
  },

  async markAllRead(): Promise<void> {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq("is_read", false);
    if (error) throw error;
  },
};

function normalize(row: any): AdminNotification {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    message: row.message,
    entity_type: row.entity_type || null,
    entity_id: row.entity_id || null,
    is_read: !!row.is_read,
    read_at: row.read_at || null,
    created_at: row.created_at,
  };
}