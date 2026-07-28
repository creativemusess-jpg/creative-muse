import { supabase } from "../supabase";

const db = () => supabase as any;

export const specificationsApi = {
  async listDefinitions(): Promise<any[]> {
    const { data, error } = await db()
      .from("specification_definitions")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data as any[]) || [];
  },

  async getDefinitionById(id: string): Promise<any | null> {
    const { data, error } = await db()
      .from("specification_definitions")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) return null;
    return data as any;
  },

  async createDefinition(data: any): Promise<any> {
    const { data: result, error } = await db()
      .from("specification_definitions")
      .insert(data)
      .select()
      .single();
    if (error) throw error;
    return result;
  },

  async updateDefinition(id: string, data: any): Promise<void> {
    const { error } = await db()
      .from("specification_definitions")
      .update(data)
      .eq("id", id);
    if (error) throw error;
  },

  async deleteDefinition(id: string): Promise<void> {
    const { error } = await db()
      .from("specification_definitions")
      .delete()
      .eq("id", id);
    if (error) throw error;
  },

  async getByProduct(productId: string): Promise<any[]> {
    const { data, error } = await db()
      .from("product_specifications")
      .select("*, specification_definition:specification_definition_id(*)")
      .eq("product_id", productId)
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data as any[]) || [];
  },

  async setProductSpecs(
    productId: string,
    specs: { specification_definition_id: string; value: string; sort_order: number }[]
  ): Promise<void> {
    const { error: delErr } = await db()
      .from("product_specifications")
      .delete()
      .eq("product_id", productId);
    if (delErr) throw delErr;
    if (specs.length > 0) {
      const rows = specs.map((s) => ({ ...s, product_id: productId }));
      const { error: insErr } = await db().from("product_specifications").insert(rows);
      if (insErr) throw insErr;
    }
  },
};
