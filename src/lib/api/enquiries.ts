import { supabase } from "../supabase";

const db = () => supabase as any;

export type EnquiryStatus = "new" | "contacted" | "in_progress" | "resolved" | "closed";
export type EnquiryPriority = "normal" | "high" | "urgent";

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  is_read: boolean;
  status: EnquiryStatus;
  priority: EnquiryPriority;
  source: string;
  read_at: string | null;
  replied_at: string | null;
  notes: string | null;
  created_at: string;
}

export const enquiriesApi = {
  async list(filters: { search?: string; page?: number; per_page?: number } = {}) {
    let query = db().from("enquiries").select("*", { count: "exact" });
    if (filters.search) query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,subject.ilike.%${filters.search}%`);
    query = query.order("created_at", { ascending: false });
    const page = filters.page || 1;
    const perPage = filters.per_page || 20;
    const from = (page - 1) * perPage;
    query = query.range(from, from + perPage - 1);
    const { data, error, count } = await query;
    if (error) throw error;
    return { data: (data as Enquiry[]) || [], count: count || 0 };
  },

  async getById(id: string): Promise<Enquiry | null> {
    const { data, error } = await db().from("enquiries").select("*").eq("id", id).maybeSingle();
    if (error) return null;
    return data as Enquiry;
  },

  async create(enquiry: { name: string; email: string; phone: string; subject?: string; message: string }): Promise<Enquiry> {
    const { data, error } = await db()
      .from("enquiries")
      .insert({
        name: enquiry.name,
        email: enquiry.email,
        phone: enquiry.phone,
        subject: enquiry.subject || null,
        message: enquiry.message,
        status: "new",
        priority: "normal",
        source: "contact_form",
        is_read: false,
      })
      .select()
      .single();
    if (error) throw error;
    return data as Enquiry;
  },

  async markRead(id: string): Promise<void> {
    const { error } = await db().from("enquiries").update({ is_read: true, read_at: new Date().toISOString() }).eq("id", id);
    if (error) throw error;
  },

  async updateStatus(id: string, status: EnquiryStatus): Promise<void> {
    const { error } = await db().from("enquiries").update({ status }).eq("id", id);
    if (error) throw error;
  },

  async updatePriority(id: string, priority: EnquiryPriority): Promise<void> {
    const { error } = await db().from("enquiries").update({ priority }).eq("id", id);
    if (error) throw error;
  },

  async addNotes(id: string, notes: string): Promise<void> {
    const { error } = await db().from("enquiries").update({ notes }).eq("id", id);
    if (error) throw error;
  },

  async markReplied(id: string): Promise<void> {
    const { error } = await db().from("enquiries").update({ replied_at: new Date().toISOString() }).eq("id", id);
    if (error) throw error;
  },

  async delete(id: string): Promise<void> {
    await db().from("enquiries").delete().eq("id", id);
  },
};