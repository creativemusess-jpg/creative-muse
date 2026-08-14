import { n as supabase } from "./supabase-Bz-JQXNc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/content-Dzgi8PKn.js
var db = () => supabase;
var contentApi = {
	async getHomepageSections() {
		const { data, error } = await db().from("homepage_sections").select("*").eq("is_published", true).order("sort_order");
		if (error) throw error;
		return data || [];
	},
	async getAllSections() {
		const { data, error } = await db().from("homepage_sections").select("*").order("sort_order");
		if (error) throw error;
		return data || [];
	},
	async getSection(key) {
		const { data, error } = await db().from("homepage_sections").select("*").eq("section_key", key).maybeSingle();
		if (error) return null;
		return data;
	},
	async upsertSection(key, data) {
		const { data: result, error } = await db().from("homepage_sections").upsert({
			section_key: key,
			...data,
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		}).select().single();
		if (error) throw error;
		return result;
	},
	async updateSection(key, data) {
		const { error } = await db().from("homepage_sections").update({
			...data,
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		}).eq("section_key", key);
		if (error) throw error;
	},
	async getCarouselSettings(key) {
		const { data, error } = await db().from("homepage_sections").select("auto_scroll_enabled, scroll_direction, scroll_speed, pause_on_hover, auto_resume_enabled, auto_resume_delay_seconds").eq("section_key", key).maybeSingle();
		if (error) return null;
		return data;
	},
	async getBanners(activeOnly = false) {
		let query = db().from("banners").select("*").order("sort_order");
		if (activeOnly) query = query.eq("active", true);
		const { data, error } = await query;
		if (error) throw error;
		return data || [];
	},
	async createBanner(data) {
		const { data: result, error } = await db().from("banners").insert(data).select().single();
		if (error) throw error;
		return result;
	},
	async updateBanner(id, data) {
		const { error } = await db().from("banners").update({
			...data,
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		}).eq("id", id);
		if (error) throw error;
	},
	async deleteBanner(id) {
		const { error } = await db().from("banners").delete().eq("id", id);
		if (error) throw error;
	},
	async getTestimonials(publishedOnly = false) {
		let query = db().from("testimonials").select("*").order("sort_order");
		if (publishedOnly) query = query.eq("is_published", true);
		const { data, error } = await query;
		if (error) throw error;
		return data || [];
	},
	async createTestimonial(data) {
		const { data: result, error } = await db().from("testimonials").insert(data).select().single();
		if (error) throw error;
		return result;
	},
	async updateTestimonial(id, data) {
		const { error } = await db().from("testimonials").update(data).eq("id", id);
		if (error) throw error;
	},
	async deleteTestimonial(id) {
		const { error } = await db().from("testimonials").delete().eq("id", id);
		if (error) throw error;
	},
	async getFaqs(publishedOnly = false) {
		let query = db().from("faqs").select("*").order("sort_order");
		if (publishedOnly) query = query.eq("is_published", true);
		const { data, error } = await query;
		if (error) throw error;
		return data || [];
	},
	async createFaq(data) {
		const { data: result, error } = await db().from("faqs").insert(data).select().single();
		if (error) throw error;
		return result;
	},
	async updateFaq(id, data) {
		const { error } = await db().from("faqs").update({
			...data,
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		}).eq("id", id);
		if (error) throw error;
	},
	async deleteFaq(id) {
		const { error } = await db().from("faqs").delete().eq("id", id);
		if (error) throw error;
	}
};
//#endregion
export { contentApi as t };
