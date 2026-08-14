import { supabase } from "../supabase";
import type { ShoppableReelRow, ShoppableReelInsert, ShoppableReelUpdate } from "../db/types";

const MAX_VIDEO_BYTES = 50 * 1024 * 1024; // 50MB matches bucket file_size_limit

const VIDEO_MIME_TYPES = new Set(["video/mp4", "video/webm", "video/quicktime"]);

const db = () => supabase as any;

export interface UploadVideoResult {
  url: string;
  path: string;
}

function isRlsError(message: string): boolean {
  return /row.?.level security policy|row-level security|new row violates/i.test(message);
}

function isMissingBucketError(message: string): boolean {
  return /bucket not found|NoSuchBucket|not found/i.test(message);
}

function storageFixHint(): string {
  return "Run the supabase/migration-shoppable-reels-storage-hardened.sql migration in the Supabase SQL Editor, then retry.";
}

export const reelsApi = {
  async listActive(): Promise<ShoppableReelRow[]> {
    const { data, error } = await db()
      .from("shoppable_reels")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");
    if (error) throw error;
    return (data as ShoppableReelRow[]) || [];
  },

  async listAll(): Promise<ShoppableReelRow[]> {
    const { data, error } = await db().from("shoppable_reels").select("*").order("sort_order");
    if (error) throw error;
    return (data as ShoppableReelRow[]) || [];
  },

  async get(id: string): Promise<ShoppableReelRow | null> {
    const { data, error } = await db()
      .from("shoppable_reels")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data as ShoppableReelRow | null;
  },

  async create(input: ShoppableReelInsert): Promise<ShoppableReelRow> {
    const { data, error } = await db()
      .from("shoppable_reels")
      .insert({
        ...input,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();
    if (error) throw error;
    return data as ShoppableReelRow;
  },

  async update(id: string, input: ShoppableReelUpdate): Promise<void> {
    const { error } = await db()
      .from("shoppable_reels")
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) throw error;
  },

  async delete(id: string): Promise<void> {
    const { error } = await db().from("shoppable_reels").delete().eq("id", id);
    if (error) throw error;
  },

  /**
   * Uploads a video to the reel-videos bucket. Returns the public URL
   * and the storage object path so the caller can clean up later.
   *
   * On RLS failures we surface a targeted message pointing the operator
   * at the storage migration instead of a confusing generic error.
   */
  async uploadVideo(file: File): Promise<UploadVideoResult> {
    if (!VIDEO_MIME_TYPES.has(file.type)) {
      throw new Error("Unsupported file type. Please upload MP4 or WebM.");
    }
    if (file.size > MAX_VIDEO_BYTES) {
      throw new Error("Video is too large. Maximum size is 50MB.");
    }
    const ext = (file.name.split(".").pop() || "mp4").toLowerCase();
    const path = `reels/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const { data, error } = await supabase.storage
      .from("reel-videos")
      .upload(path, file, { cacheControl: "31536000", upsert: false });
    if (error) {
      if (isRlsError(error.message)) {
        throw new Error(
          "Video upload blocked by the storage permission policy. " + storageFixHint(),
        );
      }
      if (isMissingBucketError(error.message)) {
        throw new Error(
          "The 'reel-videos' storage bucket is missing on Supabase. " + storageFixHint(),
        );
      }
      throw new Error(`Video upload failed: ${error.message}`);
    }
    const { data: urlData } = supabase.storage.from("reel-videos").getPublicUrl(data.path);
    return { url: urlData.publicUrl, path: data.path };
  },

  /**
   * Best-effort: captures the first frame of an uploaded video and stores it
   * in the reel-videos bucket as the reel's poster. Returns null if the
   * capture or upload fails (poster is optional).
   */
  async capturePosterFromVideo(videoUrl: string): Promise<string | null> {
    if (typeof document === "undefined") return null;
    try {
      const video = document.createElement("video");
      video.crossOrigin = "anonymous";
      video.muted = true;
      video.playsInline = true;
      video.preload = "auto";
      video.src = videoUrl;
      await new Promise<void>((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error("timeout")), 15000);
        video.addEventListener("loadeddata", () => {
          video.currentTime = 0.05;
        });
        video.addEventListener("seeked", () => {
          clearTimeout(timer);
          resolve();
        });
        video.addEventListener("error", () => {
          clearTimeout(timer);
          reject(new Error("load failed"));
        });
      });
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", 0.8),
      );
      if (!blob) return null;
      const path = `posters/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.jpg`;
      const { data, error } = await supabase.storage.from("reel-videos").upload(path, blob, {
        cacheControl: "31536000",
        contentType: "image/jpeg",
        upsert: false,
      });
      if (error) return null;
      return supabase.storage.from("reel-videos").getPublicUrl(data.path).data.publicUrl;
    } catch {
      return null;
    }
  },

  /**
   * Best-effort removal of stored files (video + poster) for a reel.
   * Never throws, so cleanup can never block the record deletion.
   */
  async deleteReelFiles(urls: (string | null | undefined)[]): Promise<void> {
    const paths = urls
      .filter((u) => !!u)
      .map((u) => decodeURIComponent(u!.split("reel-videos/")[1]?.split(/[?#]/)[0] || ""))
      .filter(Boolean);
    if (paths.length === 0) return;
    try {
      await supabase.storage.from("reel-videos").remove(paths);
    } catch {
      /* noop */
    }
  },
};
