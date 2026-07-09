import { supabase } from "../supabase";

const BUCKETS = {
  products: "product-images",
  products360: "product-360-images",
  categories: "category-images",
} as const;

export async function uploadImage(
  file: File,
  bucket: keyof typeof BUCKETS = "products",
  folder = "general",
): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
  const { data, error } = await supabase.storage
    .from(BUCKETS[bucket])
    .upload(fileName, file, {
      cacheControl: "31536000",
      upsert: false,
    });
  if (error) throw new Error(`Upload failed: ${error.message}`);
  const { data: urlData } = supabase.storage.from(BUCKETS[bucket]).getPublicUrl(data.path);
  return urlData.publicUrl;
}

export async function deleteImage(
  url: string,
  bucket: keyof typeof BUCKETS = "products",
): Promise<void> {
  const path = url.split("/").pop();
  if (!path) return;
  await supabase.storage.from(BUCKETS[bucket]).remove([path]);
}

export async function uploadMultipleImages(
  files: File[],
  bucket: keyof typeof BUCKETS = "products",
  folder = "gallery",
): Promise<string[]> {
  return Promise.all(files.map((f) => uploadImage(f, bucket, folder)));
}
