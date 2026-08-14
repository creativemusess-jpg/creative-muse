import { n as supabase } from "./supabase-Bz-JQXNc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/upload-DCG819Qu.js
var BUCKETS = {
	products: "product-images",
	products360: "product-360-images",
	categories: "category-images",
	categoryVideos: "category-videos"
};
async function uploadImage(file, bucket = "products", folder = "general") {
	const ext = file.name.split(".").pop() || "jpg";
	const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
	const { data, error } = await supabase.storage.from(BUCKETS[bucket]).upload(fileName, file, {
		cacheControl: "31536000",
		upsert: false
	});
	if (error) throw new Error(`Upload failed: ${error.message}`);
	const { data: urlData } = supabase.storage.from(BUCKETS[bucket]).getPublicUrl(data.path);
	return urlData.publicUrl;
}
//#endregion
export { uploadImage as t };
