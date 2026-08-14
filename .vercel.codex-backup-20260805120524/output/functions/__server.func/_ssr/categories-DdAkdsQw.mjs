import { n as supabase } from "./supabase-Bz-JQXNc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/categories-DdAkdsQw.js
var db = () => supabase;
function normalizeCategory(cat) {
	if (!cat) return null;
	return {
		...cat,
		imageUrl: cat.image?.trim() || null
	};
}
var categoriesApi = {
	async list(activeOnly = false) {
		let query = db().from("categories").select("*").order("sort_order");
		if (activeOnly) query = query.eq("active", true);
		const { data, error } = await query;
		if (error) throw error;
		return (data || []).map(normalizeCategory);
	},
	async listWithCounts(activeOnly = false) {
		const categories = await categoriesApi.list(activeOnly);
		if (categories.length === 0) return [];
		const ids = categories.map((c) => c.id);
		const { data: counts, error } = await db().from("product_categories").select("category_id").in("category_id", ids);
		if (error) throw error;
		const countMap = /* @__PURE__ */ new Map();
		for (const row of counts || []) countMap.set(row.category_id, (countMap.get(row.category_id) || 0) + 1);
		return categories.map((c) => ({
			...c,
			productCount: countMap.get(c.id) || 0
		}));
	},
	async getById(id) {
		const { data, error } = await db().from("categories").select("*").eq("id", id).maybeSingle();
		if (error || !data) return null;
		return normalizeCategory(data);
	},
	async getBySlug(slug) {
		const { data, error } = await db().from("categories").select("*").eq("slug", slug).maybeSingle();
		if (error || !data) return null;
		return normalizeCategory(data);
	},
	async create(data) {
		const { data: result, error } = await db().from("categories").insert(data).select().single();
		if (error) throw error;
		return normalizeCategory(result);
	},
	async update(id, data) {
		const { data: result, error } = await db().from("categories").update({
			...data,
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		}).eq("id", id).select().single();
		if (error) throw error;
		return normalizeCategory(result);
	},
	async delete(id) {
		const { error } = await db().from("categories").delete().eq("id", id);
		if (error) throw error;
	}
};
//#endregion
export { categoriesApi as t };
