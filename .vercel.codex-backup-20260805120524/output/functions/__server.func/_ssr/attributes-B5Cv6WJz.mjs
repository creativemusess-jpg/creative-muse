import { n as supabase } from "./supabase-Bz-JQXNc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/attributes-B5Cv6WJz.js
var db = () => supabase;
var attributesApi = {
	async listDefinitions() {
		const { data, error } = await db().from("attribute_definitions").select("*").order("sort_order", { ascending: true });
		if (error) throw error;
		return data || [];
	},
	async getDefinitionById(id) {
		const { data, error } = await db().from("attribute_definitions").select("*").eq("id", id).maybeSingle();
		if (error) return null;
		return data;
	},
	async createDefinition(data) {
		const { data: result, error } = await db().from("attribute_definitions").insert(data).select().single();
		if (error) throw error;
		return result;
	},
	async updateDefinition(id, data) {
		const { error } = await db().from("attribute_definitions").update(data).eq("id", id);
		if (error) throw error;
	},
	async deleteDefinition(id) {
		const { error } = await db().from("attribute_definitions").delete().eq("id", id);
		if (error) throw error;
	},
	async getByProduct(productId) {
		const { data, error } = await db().from("product_attributes").select("*, attribute_definition:attribute_definition_id(*)").eq("product_id", productId).order("sort_order", { ascending: true });
		if (error) throw error;
		return data || [];
	},
	async setProductAttributes(productId, attrs) {
		const { error: delErr } = await db().from("product_attributes").delete().eq("product_id", productId);
		if (delErr) throw delErr;
		if (attrs.length > 0) {
			const rows = attrs.map((a) => ({
				...a,
				product_id: productId
			}));
			const { error: insErr } = await db().from("product_attributes").insert(rows);
			if (insErr) throw insErr;
		}
	}
};
//#endregion
export { attributesApi as t };
