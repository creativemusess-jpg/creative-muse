import { n as supabase } from "./supabase-Bz-JQXNc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/subcategories-BivcEg6G.js
var db = () => supabase;
var subcategoriesApi = {
	async list(activeOnly = false) {
		let query = db().from("subcategories").select("*, category:category_id(name, slug)").order("sort_order");
		if (activeOnly) query = query.eq("active", true);
		const { data, error } = await query;
		if (error) throw error;
		return data || [];
	},
	async listByCategory(categoryId, activeOnly = false) {
		let query = db().from("subcategories").select("*").eq("category_id", categoryId).order("sort_order");
		if (activeOnly) query = query.eq("active", true);
		const { data, error } = await query;
		if (error) throw error;
		return data || [];
	},
	async getById(id) {
		const { data, error } = await db().from("subcategories").select("*, category:category_id(*)").eq("id", id).maybeSingle();
		if (error || !data) return null;
		return data;
	},
	async getBySlug(slug) {
		const { data, error } = await db().from("subcategories").select("*, category:category_id(name, slug)").eq("slug", slug).maybeSingle();
		if (error || !data) return null;
		return data;
	},
	async getByCategoryAndSlug(categorySlug, subcategorySlug) {
		const { data: cat } = await db().from("categories").select("id").eq("slug", categorySlug).maybeSingle();
		if (!cat) return null;
		const { data, error } = await db().from("subcategories").select("*, category:category_id(name, slug)").eq("slug", subcategorySlug).eq("category_id", cat.id).maybeSingle();
		if (error || !data) return null;
		return data;
	},
	async create(data) {
		const { data: result, error } = await db().from("subcategories").insert(data).select().single();
		if (error) throw error;
		return result;
	},
	async update(id, data) {
		const { data: result, error } = await db().from("subcategories").update({
			...data,
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		}).eq("id", id).select().single();
		if (error) throw error;
		return result;
	},
	async delete(id) {
		const { count } = await db().from("products").select("*", {
			count: "exact",
			head: true
		}).eq("subcategory_id", id);
		const linked = count || 0;
		if (linked > 0) return { linkedProducts: linked };
		const { error } = await db().from("subcategories").delete().eq("id", id);
		if (error) throw error;
		return { linkedProducts: 0 };
	}
};
//#endregion
export { subcategoriesApi as t };
