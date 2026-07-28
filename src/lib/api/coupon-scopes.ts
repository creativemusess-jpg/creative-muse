import { supabase } from "../supabase";

const db = () => supabase as any;

export const couponScopesApi = {
  async getScopes(couponId: string): Promise<{ scopes: any[]; restrictions: any[] }> {
    const [scopesRes, restrRes] = await Promise.all([
      db().from("coupon_scopes").select("*").eq("coupon_id", couponId),
      db().from("coupon_restrictions").select("*").eq("coupon_id", couponId),
    ]);
    return {
      scopes: (scopesRes.data as any[]) || [],
      restrictions: (restrRes.data as any[]) || [],
    };
  },

  async saveScopes(couponId: string, scopes: any[]): Promise<void> {
    const { error: delErr } = await db().from("coupon_scopes").delete().eq("coupon_id", couponId);
    if (delErr) throw delErr;
    if (scopes.length > 0) {
      const rows = scopes.map((s) => ({ coupon_id: couponId, ...s }));
      const { error: insErr } = await db().from("coupon_scopes").insert(rows);
      if (insErr) throw insErr;
    }
  },

  async saveRestrictions(couponId: string, restrictions: any[]): Promise<void> {
    const { error: delErr } = await db().from("coupon_restrictions").delete().eq("coupon_id", couponId);
    if (delErr) throw delErr;
    if (restrictions.length > 0) {
      const rows = restrictions.map((r) => ({ coupon_id: couponId, ...r }));
      const { error: insErr } = await db().from("coupon_restrictions").insert(rows);
      if (insErr) throw insErr;
    }
  },
};
