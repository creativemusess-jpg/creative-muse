import { n as supabase } from "./supabase-Bz-JQXNc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reels-BV7NCtSb.js
var db = () => supabase;
var reelsApi = {
	async listActive() {
		const { data, error } = await db().from("shoppable_reels").select("*").eq("is_active", true).order("sort_order");
		if (error) throw error;
		return data || [];
	},
	async listAll() {
		const { data, error } = await db().from("shoppable_reels").select("*").order("sort_order");
		if (error) throw error;
		return data || [];
	},
	async get(id) {
		const { data, error } = await db().from("shoppable_reels").select("*").eq("id", id).maybeSingle();
		if (error) throw error;
		return data;
	},
	async create(input) {
		const { data, error } = await db().from("shoppable_reels").insert({
			...input,
			created_at: (/* @__PURE__ */ new Date()).toISOString(),
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		}).select().single();
		if (error) throw error;
		return data;
	},
	async update(id, input) {
		const { error } = await db().from("shoppable_reels").update({
			...input,
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		}).eq("id", id);
		if (error) throw error;
	},
	async delete(id) {
		const { error } = await db().from("shoppable_reels").delete().eq("id", id);
		if (error) throw error;
	},
	async uploadVideo(file) {
		const ext = file.name.split(".").pop() || "mp4";
		const fileName = `reels/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
		const { data, error } = await supabase.storage.from("reel-videos").upload(fileName, file, {
			cacheControl: "31536000",
			upsert: false
		});
		if (error) throw new Error(`Video upload failed: ${error.message}`);
		const { data: urlData } = supabase.storage.from("reel-videos").getPublicUrl(data.path);
		return urlData.publicUrl;
	}
};
//#endregion
export { reelsApi as t };
