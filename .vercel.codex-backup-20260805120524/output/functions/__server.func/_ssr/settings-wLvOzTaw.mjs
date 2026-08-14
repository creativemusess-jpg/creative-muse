import { n as supabase } from "./supabase-Bz-JQXNc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-wLvOzTaw.js
var db = () => supabase;
var settingsApi = {
	async get(key) {
		const { data, error } = await db().from("site_settings").select("*").eq("setting_key", key).maybeSingle();
		if (error) return null;
		return data;
	},
	async set(key, value) {
		if (await settingsApi.get(key)) await db().from("site_settings").update({ setting_value: value }).eq("setting_key", key);
		else await db().from("site_settings").insert({
			setting_key: key,
			setting_value: value
		});
	},
	async getAll() {
		const { data, error } = await db().from("site_settings").select("*").order("setting_key");
		if (error) throw error;
		return data || [];
	}
};
//#endregion
export { settingsApi as t };
