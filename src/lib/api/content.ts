import { supabase } from "../supabase";

const db = () => supabase as any;

export const contentApi = {
  async getHomepageSections(): Promise<any[]> {
    const { data, error } = await db().from("homepage_sections").select("*").eq("is_published", true).order("sort_order");
    if (error) throw error;
    return (data as any[]) || [];
  },

  async getAllSections(): Promise<any[]> {
    const { data, error } = await db().from("homepage_sections").select("*").order("sort_order");
    if (error) throw error;
    return (data as any[]) || [];
  },

  async getSection(key: string): Promise<any | null> {
    const { data, error } = await db().from("homepage_sections").select("*").eq("section_key", key).maybeSingle();
    if (error) return null;
    return data as any;
  },

  async upsertSection(key: string, data: any): Promise<any> {
    const { data: result, error } = await db()
      .from("homepage_sections")
      .upsert({ section_key: key, ...data, updated_at: new Date().toISOString() }, { onConflict: "section_key" })
      .select()
      .single();
    if (error) throw error;
    return result;
  },

  async updateSection(key: string, data: any): Promise<void> {
    const { error } = await db().from("homepage_sections").update({ ...data, updated_at: new Date().toISOString() }).eq("section_key", key);
    if (error) throw error;
  },

  async getCarouselSettings(key: string): Promise<any | null> {
    const { data, error } = await db()
      .from("homepage_sections")
      .select("auto_scroll_enabled, scroll_direction, scroll_speed, pause_on_hover, auto_resume_enabled, auto_resume_delay_seconds")
      .eq("section_key", key)
      .maybeSingle();
    if (error) return null;
    return data as any;
  },

  async getBanners(activeOnly = false): Promise<any[]> {
    let query = db().from("banners").select("*").order("sort_order");
    if (activeOnly) query = query.eq("active", true);
    const { data, error } = await query;
    if (error) throw error;
    return (data as any[]) || [];
  },

  async createBanner(data: any): Promise<any> {
    const { data: result, error } = await db().from("banners").insert(data).select().single();
    if (error) throw error;
    return result;
  },

  async updateBanner(id: string, data: any): Promise<void> {
    const { error } = await db().from("banners").update({ ...data, updated_at: new Date().toISOString() }).eq("id", id);
    if (error) throw error;
  },

  async deleteBanner(id: string): Promise<void> {
    const { error } = await db().from("banners").delete().eq("id", id);
    if (error) throw error;
  },

  async getTestimonials(publishedOnly = false): Promise<any[]> {
    let query = db().from("testimonials").select("*").order("sort_order");
    if (publishedOnly) query = query.eq("is_published", true);
    const { data, error } = await query;
    if (error) throw error;
    return (data as any[]) || [];
  },

  async createTestimonial(data: any): Promise<any> {
    const { data: result, error } = await db().from("testimonials").insert(data).select().single();
    if (error) throw error;
    return result;
  },

  async updateTestimonial(id: string, data: any): Promise<void> {
    const { error } = await db().from("testimonials").update(data).eq("id", id);
    if (error) throw error;
  },

  async deleteTestimonial(id: string): Promise<void> {
    const { error } = await db().from("testimonials").delete().eq("id", id);
    if (error) throw error;
  },

  async getFaqs(publishedOnly = false): Promise<any[]> {
    let query = db().from("faqs").select("*").order("sort_order");
    if (publishedOnly) query = query.eq("is_published", true);
    const { data, error } = await query;
    if (error) throw error;
    return (data as any[]) || [];
  },

  async createFaq(data: any): Promise<any> {
    const { data: result, error } = await db().from("faqs").insert(data).select().single();
    if (error) throw error;
    return result;
  },

  async updateFaq(id: string, data: any): Promise<void> {
    const { error } = await db().from("faqs").update({ ...data, updated_at: new Date().toISOString() }).eq("id", id);
    if (error) throw error;
  },

  async deleteFaq(id: string): Promise<void> {
    const { error } = await db().from("faqs").delete().eq("id", id);
    if (error) throw error;
  },
};
