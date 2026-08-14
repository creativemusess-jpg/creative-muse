import { n as supabase } from "./supabase-Bz-JQXNc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/product-flags-CqIQcQvi.js
var db = () => supabase;
var productFlagsApi = {
	async list() {
		const { data, error } = await db().from("product_flags").select("*").order("display_order", { ascending: true });
		if (error) throw error;
		return data || [];
	},
	async getById(id) {
		const { data, error } = await db().from("product_flags").select("*").eq("id", id).maybeSingle();
		if (error) return null;
		return data;
	},
	async create(data) {
		const { data: result, error } = await db().from("product_flags").insert(data).select().single();
		if (error) throw error;
		return result;
	},
	async update(id, data) {
		const { error } = await db().from("product_flags").update(data).eq("id", id);
		if (error) throw error;
	},
	async delete(id) {
		const { error } = await db().from("product_flags").delete().eq("id", id);
		if (error) throw error;
	},
	async getByProduct(productId) {
		const { data, error } = await db().from("product_product_flags").select("flag_id, product_flags!inner(*)").eq("product_id", productId);
		if (error) throw error;
		return (data || []).map((r) => r.product_flags);
	},
	async setProductFlags(productId, flagIds) {
		const { error: delErr } = await db().from("product_product_flags").delete().eq("product_id", productId);
		if (delErr) throw delErr;
		if (flagIds.length > 0) {
			const rows = flagIds.map((flag_id) => ({
				product_id: productId,
				flag_id
			}));
			const { error: insErr } = await db().from("product_product_flags").insert(rows);
			if (insErr) throw insErr;
		}
	}
};
//#endregion
export { productFlagsApi as t };
