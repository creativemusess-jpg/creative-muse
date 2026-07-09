import { supabase } from "../supabase";

const db = () => supabase as any;

export const auditLogsApi = {
  async list(filters: { page?: number; per_page?: number } = {}) {
    let query = db().from("audit_logs").select("*, profiles:user_id(full_name, email)", { count: "exact" });
    query = query.order("created_at", { ascending: false });
    const page = filters.page || 1;
    const perPage = filters.per_page || 50;
    const from = (page - 1) * perPage;
    query = query.range(from, from + perPage - 1);
    const { data, error, count } = await query;
    if (error) throw error;
    return { data: (data as any[]) || [], count: count || 0 };
  },
};
