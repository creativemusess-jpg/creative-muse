import { supabase } from "../supabase";

const BUCKETS = {
  products: "product-images",
  products360: "product-360-images",
  categories: "category-images",
  categoryVideos: "category-videos",
  heroMedia: "hero-media",
  homepageBanners: "homepage-banners",
  newsletter: "newsletter-images",
} as const;

export async function uploadImage(
  file: File,
  bucket: keyof typeof BUCKETS = "products",
  folder = "general",
): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
  const { data, error } = await supabase.storage.from(BUCKETS[bucket]).upload(fileName, file, {
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
  const marker = `/object/public/${BUCKETS[bucket]}/`;
  const idx = url.indexOf(marker);
  const path = idx === -1 ? url.split("/").pop() : url.slice(idx + marker.length);
  if (!path) return;
  await supabase.storage.from(BUCKETS[bucket]).remove([path]);
}

const HERO_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const HERO_VIDEO_TYPES = ["video/mp4", "video/webm"];
const BANNER_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function validateBannerFile(file: File): string | null {
  if (!BANNER_IMAGE_TYPES.includes(file.type)) {
    return "Unsupported image format. Use JPG, PNG or WEBP.";
  }
  if (file.size > 5 * 1024 * 1024) {
    return "Image is too large. Maximum size is 5 MB (recommended under 1 MB).";
  }
  return null;
}

export function validateHeroMediaFile(file: File, kind: "image" | "video"): string | null {
  if (kind === "image") {
    if (!HERO_IMAGE_TYPES.includes(file.type)) {
      return "Unsupported image format. Use JPG, PNG or WEBP.";
    }
    if (file.size > 5 * 1024 * 1024) {
      return "Image is too large. Maximum size is 5 MB.";
    }
  } else {
    if (!HERO_VIDEO_TYPES.includes(file.type)) {
      return "Unsupported video format. Use MP4 or WebM.";
    }
    if (file.size > 50 * 1024 * 1024) {
      return "Video is too large. Maximum size is 50 MB.";
    }
  }
  return null;
}

export async function uploadMultipleImages(
  files: File[],
  bucket: keyof typeof BUCKETS = "products",
  folder = "gallery",
): Promise<string[]> {
  return Promise.all(files.map((f) => uploadImage(f, bucket, folder)));
}
