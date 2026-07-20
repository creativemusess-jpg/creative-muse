/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from "../supabase";

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  is_manual: boolean;
  condition: any;
  status?: string;
  active?: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  product_count?: number;
}

export interface CollectionProduct {
  collection_id: string;
  product_id: string;
  product_name?: string;
  product_image?: string;
}

export const collectionsApi = {
  async list(): Promise<{ data: Collection[]; count: number }> {
    const { data, error, count } = await supabase
      .from("collections")
      .select("*", { count: "exact" })
      .order("sort_order");
    if (error) throw error;
    const ids = (data ?? []).map((c: any) => c.id);
    let links: any[] = [];
    if (ids.length > 0) {
      const r = await supabase
        .from("product_collections")
        .select("collection_id")
        .in("collection_id", ids);
      links = r.data ?? [];
    }
    const counts: Record<string, number> = {};
    links.forEach((l: any) => {
      counts[l.collection_id] = (counts[l.collection_id] || 0) + 1;
    });
    return {
      data: (data ?? []).map((c: any) => ({ ...c, product_count: counts[c.id] || 0 })),
      count: count ?? 0,
    };
  },

  async getById(id: string): Promise<Collection | null> {
    const { data } = await supabase.from("collections").select("*").eq("id", id).single();
    return data as any;
  },

  async create(data: Partial<Collection>): Promise<Collection> {
    const { data: result, error } = await supabase
      .from("collections")
      .insert({
        name: data.name,
        slug: data.slug,
        description: data.description,
        image: data.image,
        active: data.active ?? true,
        sort_order: data.sort_order || 0,
      })
      .select()
      .single();
    if (error) throw error;
    return result;
  },

  async update(id: string, data: Partial<Collection>): Promise<void> {
    const { error } = await supabase.from("collections").update(data).eq("id", id);
    if (error) throw error;
  },

  async delete(id: string): Promise<void> {
    await supabase.from("product_collections").delete().eq("collection_id", id);
    const { error } = await supabase.from("collections").delete().eq("id", id);
    if (error) throw error;
  },

  async getProducts(collectionId: string): Promise<CollectionProduct[]> {
    const { data } = await supabase
      .from("product_collections")
      .select("collection_id, product_id")
      .eq("collection_id", collectionId);
    return (data ?? []).map((cp: any) => ({ ...cp }));
  },

  async addProduct(collectionId: string, productId: string): Promise<void> {
    const { error } = await supabase
      .from("product_collections")
      .insert({ collection_id: collectionId, product_id: productId });
    if (error && !error.message?.includes("duplicate")) throw error;
  },

  async removeProduct(collectionId: string, productId: string): Promise<void> {
    await supabase
      .from("product_collections")
      .delete()
      .eq("collection_id", collectionId)
      .eq("product_id", productId);
  },
};
