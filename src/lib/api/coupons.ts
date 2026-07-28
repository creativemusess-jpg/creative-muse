import { supabase } from "../supabase";

const db = () => supabase as any;

export const couponsApi = {
  async list(): Promise<any[]> {
    const { data, error } = await db().from("coupons").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    const coupons = (data as any[]) || [];
    const result = [];
    for (const c of coupons) {
      const { data: scopes } = await db()
        .from("coupon_scopes")
        .select("scope_type, scope_id")
        .eq("coupon_id", c.id);
      const scopeCount = (scopes || []).length;
      const productCount = (scopes || []).filter((s: any) => s.scope_type === "product").length;
      const categoryCount = (scopes || []).filter((s: any) => s.scope_type === "category").length;
      result.push({
        ...c,
        scope_count: c.coupon_scope === "selected_products" ? productCount : c.coupon_scope === "selected_categories" ? categoryCount : scopeCount,
      });
    }
    return result;
  },

  async getById(id: string): Promise<any | null> {
    const { data, error } = await db().from("coupons").select("*").eq("id", id).maybeSingle();
    if (error) return null;
    return data as any;
  },

  async create(data: any): Promise<any> {
    const { data: result, error } = await db().from("coupons").insert(data).select().single();
    if (error) throw error;
    return result;
  },

  async update(id: string, data: any): Promise<void> {
    const { error } = await db().from("coupons").update(data).eq("id", id);
    if (error) throw error;
  },

  async delete(id: string): Promise<void> {
    const { error } = await db().from("coupons").delete().eq("id", id);
    if (error) throw error;
  },

  // Scopes
  async getScopes(couponId: string): Promise<any[]> {
    const { data, error } = await db().from("coupon_scopes").select("*").eq("coupon_id", couponId).order("created_at");
    if (error) throw error;
    return (data as any[]) || [];
  },

  async setScopes(couponId: string, scopes: any[]): Promise<void> {
    const { error: delError } = await db().from("coupon_scopes").delete().eq("coupon_id", couponId);
    if (delError) throw delError;
    if (scopes.length === 0) return;
    const { error } = await db().from("coupon_scopes").insert(
      scopes.map((s) => ({ coupon_id: couponId, ...s }))
    );
    if (error) throw error;
  },

  // Restrictions
  async getRestrictions(couponId: string): Promise<any[]> {
    const { data, error } = await db().from("coupon_restrictions").select("*").eq("coupon_id", couponId).order("created_at");
    if (error) throw error;
    return (data as any[]) || [];
  },

  async setRestrictions(couponId: string, restrictions: any[]): Promise<void> {
    const { error: delError } = await db().from("coupon_restrictions").delete().eq("coupon_id", couponId);
    if (delError) throw delError;
    if (restrictions.length === 0) return;
    const { error } = await db().from("coupon_restrictions").insert(
      restrictions.map((r) => ({ coupon_id: couponId, ...r }))
    );
    if (error) throw error;
  },
};
