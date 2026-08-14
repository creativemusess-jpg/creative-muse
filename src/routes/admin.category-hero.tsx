import { useState, useEffect, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  AdminLayout,
  AdminPageHeader,
  AdminLoading,
  AdminEmpty,
} from "@/components/admin/AdminLayout";
import { categoriesApi } from "@/lib/api/categories";
import { uploadImage, deleteImage, validateHeroMediaFile } from "@/lib/api/upload";
import { requireAdmin } from "@/lib/auth-guard";
import {
  Check,
  ChevronDown,
  Film,
  Image as ImageIcon,
  Loader2,
  Search,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";

export const Route = createFileRoute("/admin/category-hero")({
  beforeLoad: requireAdmin,
  component: AdminCategoryHero,
});

type MediaType = "image" | "video";
type SlotKey = "desktop" | "mobile";
type FileInfo = {
  name: string;
  sizeLabel: string;
  width?: number;
  height?: number;
  duration?: number;
  ratio?: number;
};

const RECOMMENDED = {
  desktop: { width: 1920, height: 440, ratio: 1920 / 440 },
  mobile: { width: 750, height: 420, ratio: 750 / 420 },
} as const;

const SLOT_HINTS: Record<SlotKey, string> = {
  desktop: "Shown on desktop and tablet (hero is full-width, min-height 440px)",
  mobile: "Shown on phones; falls back to desktop media when not set",
};

function AdminCategoryHero() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [categoryQuery, setCategoryQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [mediaType, setMediaType] = useState<MediaType>("image");
  const [files, setFiles] = useState<Record<SlotKey, File | null>>({ desktop: null, mobile: null });
  const [fileInfo, setFileInfo] = useState<Partial<Record<SlotKey, FileInfo>>>({});
  const [previewSrc, setPreviewSrc] = useState<Partial<Record<SlotKey, string>>>({});
  const [removed, setRemoved] = useState<Record<SlotKey, boolean>>({
    desktop: false,
    mobile: false,
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const queryClient = useQueryClient();

  const selected = categories.find((c) => c.id === selectedId) || null;

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await categoriesApi.list();
      setCategories(data);
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err?.message || "Could not load categories from the database.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(null), 6000);
    return () => clearTimeout(t);
  }, [message]);

  const currentMedia = (cat: any, slot: SlotKey): string | null => {
    if (mediaType === "video") {
      return (slot === "desktop" ? cat.hero_video : cat.hero_video_mobile) || null;
    }
    return (slot === "desktop" ? cat.hero_image : cat.mobile_banner) || null;
  };

  const resetPending = () => {
    setFiles({ desktop: null, mobile: null });
    setFileInfo({});
    setRemoved({ desktop: false, mobile: false });
    setPreviewSrc((prev) => {
      Object.values(prev).forEach((u) => u && URL.revokeObjectURL(u));
      return {};
    });
  };

  const selectCategory = (cat: any) => {
    setSelectedId(cat.id);
    setMediaType(cat.hero_video || cat.hero_video_mobile ? "video" : "image");
    resetPending();
    setMessage(null);
    setDropdownOpen(false);
    setCategoryQuery("");
  };

  const switchType = (next: MediaType) => {
    if (next === mediaType) return;
    setMediaType(next);
    resetPending();
    setMessage(null);
  };

  const formatBytes = (bytes: number) => {
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${bytes} B`;
  };

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.round(seconds % 60);
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  const inspectFile = async (file: File): Promise<FileInfo> => {
    const info: FileInfo = { name: file.name, sizeLabel: formatBytes(file.size) };
    if (mediaType === "image") {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const i = new Image();
        i.onload = () => resolve(i);
        i.onerror = () => reject(new Error("Could not read image dimensions."));
        i.src = URL.createObjectURL(file);
      });
      info.width = img.naturalWidth;
      info.height = img.naturalHeight;
      info.ratio = img.naturalWidth / img.naturalHeight;
    } else {
      const vid = await new Promise<HTMLVideoElement>((resolve, reject) => {
        const el = document.createElement("video");
        el.preload = "metadata";
        el.onloadedmetadata = () => resolve(el);
        el.onerror = () => reject(new Error("Could not read video metadata."));
        el.src = URL.createObjectURL(file);
      });
      if (vid.videoWidth) {
        info.width = vid.videoWidth;
        info.height = vid.videoHeight;
        info.ratio = vid.videoWidth / vid.videoHeight;
      }
      if (Number.isFinite(vid.duration)) info.duration = vid.duration;
    }
    return info;
  };

  const handleFile = async (slot: SlotKey, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const errorText = validateHeroMediaFile(file, mediaType);
    if (errorText) {
      setMessage({ type: "error", text: errorText });
      return;
    }
    setMessage(null);
    try {
      const info = await inspectFile(file);
      setFileInfo((prev) => ({ ...prev, [slot]: info }));
    } catch {
      setFileInfo((prev) => ({ ...prev, [slot]: undefined }));
    }
    setFiles((prev) => ({ ...prev, [slot]: file }));
    setRemoved((prev) => ({ ...prev, [slot]: false }));
    setPreviewSrc((prev) => {
      if (prev[slot]) URL.revokeObjectURL(prev[slot]);
      return { ...prev, [slot]: URL.createObjectURL(file) };
    });
  };

  const clearFile = (slot: SlotKey) => {
    setFiles((prev) => ({ ...prev, [slot]: null }));
    setFileInfo((prev) => ({ ...prev, [slot]: undefined }));
    setPreviewSrc((prev) => {
      if (prev[slot]) URL.revokeObjectURL(prev[slot]);
      const next = { ...prev };
      delete next[slot];
      return next;
    });
  };

  const markRemoved = (slot: SlotKey) => {
    clearFile(slot);
    setRemoved((prev) => ({ ...prev, [slot]: true }));
    setMessage(null);
  };

  const storageBucketOf = (url: string): "categories" | "categoryVideos" | null => {
    if (url.includes("/object/public/category-videos/")) return "categoryVideos";
    if (url.includes("/object/public/category-images/")) return "categories";
    return null;
  };

  const friendlyError = (err: any) => {
    const msg = err?.message ?? "Something went wrong.";
    if (/hero_video_mobile/i.test(msg)) {
      return "The hero_video_mobile column is missing. Run supabase/migration-category-hero-mobile-video.sql in the Supabase SQL Editor.";
    }
    if (/row-level security|security policy|insufficient|permission denied/i.test(msg)) {
      return "Permission denied: your admin account cannot write to the hero media storage bucket. Check the storage policies with the site administrator.";
    }
    if (msg.startsWith("Upload failed:")) {
      return "Upload failed. Check the category-videos bucket exists — run supabase/migration-category-hero-mobile-video.sql in the Supabase SQL Editor and try again.";
    }
    return msg;
  };

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);
    setMessage(null);
    try {
      const uploaded: Partial<Record<SlotKey, string>> = {};
      const bucket = mediaType === "video" ? "categoryVideos" : "categories";
      const folder = mediaType === "video" ? "hero-videos" : "hero-banners";
      setUploading(true);
      if (files.desktop) uploaded.desktop = await uploadImage(files.desktop, bucket, folder);
      if (files.mobile) uploaded.mobile = await uploadImage(files.mobile, bucket, folder);
      setUploading(false);
      const finalDesktop =
        uploaded.desktop ?? (removed.desktop ? null : currentMedia(selected, "desktop"));
      const finalMobile =
        uploaded.mobile ?? (removed.mobile ? null : currentMedia(selected, "mobile"));
      const payload =
        mediaType === "video"
          ? {
              hero_video: finalDesktop,
              hero_video_mobile: finalMobile,
              hero_image: null,
              mobile_banner: null,
            }
          : {
              hero_image: finalDesktop,
              mobile_banner: finalMobile,
              hero_video: null,
              hero_video_mobile: null,
            };
      await categoriesApi.update(selected.id, payload);
      for (const slot of ["desktop", "mobile"] as SlotKey[]) {
        if (!uploaded[slot]) continue;
        const oldUrl = currentMedia(selected, slot);
        const oldBucket = oldUrl ? storageBucketOf(oldUrl) : null;
        if (oldBucket && oldUrl) {
          try {
            await deleteImage(oldUrl, oldBucket);
          } catch {
            // best-effort cleanup of replaced files
          }
        }
      }
      await queryClient.invalidateQueries({ queryKey: ["category"] });
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      await fetchCategories();
      resetPending();
      setMessage({ type: "success", text: "Category hero media saved." });
    } catch (err: any) {
      setMessage({ type: "error", text: friendlyError(err) });
    } finally {
      setUploading(false);
      setSaving(false);
    }
  };

  const filteredCategories = categories.filter((c) =>
    `${c.name} ${c.slug}`.toLowerCase().includes(categoryQuery.toLowerCase()),
  );

  if (loading)
    return (
      <AdminLayout>
        <AdminLoading />
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Category Hero Media"
        description="Manage the hero image/video shown at the top of each category page"
      />

      {message && (
        <div
          className={`mb-4 rounded-lg border px-4 py-3 text-sm ${
            message.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <div ref={dropdownRef} className="relative mb-6 max-w-md">
        <p className="mb-1 text-xs font-medium text-gray-600">Category</p>
        <button
          type="button"
          onClick={() => setDropdownOpen((v) => !v)}
          className="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-2 text-left text-sm outline-none focus:border-[#7A2533]"
        >
          {selected ? (
            <span className="truncate">
              <span className="font-medium text-[#1a1a2e]">{selected.name}</span>
              <span className="ml-2 text-gray-400">{selected.slug}</span>
            </span>
          ) : (
            <span className="text-gray-400">Select a category…</span>
          )}
          <ChevronDown
            className={`h-4 w-4 text-gray-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
          />
        </button>
        {dropdownOpen && (
          <div className="absolute z-20 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
            <div className="flex items-center gap-2 border-b border-gray-100 px-3 py-2">
              <Search className="h-4 w-4 text-gray-400" />
              <input
                autoFocus
                value={categoryQuery}
                onChange={(e) => setCategoryQuery(e.target.value)}
                placeholder="Search categories…"
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
            <div className="max-h-48 overflow-y-auto py-1">
              {filteredCategories.length === 0 ? (
                <p className="px-3 py-3 text-sm text-gray-400">No categories found</p>
              ) : (
                filteredCategories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => selectCategory(cat)}
                    className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-gray-50"
                  >
                    <span>
                      <span className="font-medium text-[#1a1a2e]">{cat.name}</span>
                      <span className="ml-2 text-xs text-gray-400">{cat.slug}</span>
                    </span>
                    {cat.id === selectedId && <Check className="h-4 w-4 text-[#7A2533]" />}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {!selected ? (
        <AdminEmpty
          title="No category selected"
          description="Select a category to manage its hero media"
        />
      ) : (
        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <p className="mb-1 text-sm font-semibold text-[#1a1a2e]">Current hero media</p>
            <p className="mb-4 text-xs text-gray-400">
              What visitors see today on the {selected.name} category page
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <HeroPreview
                title="Desktop"
                src={currentMedia(selected, "desktop")}
                isVideo={mediaType === "video"}
                ratioClass="aspect-[4.36/1]"
                emptyHint="No desktop media set"
              />
              <HeroPreview
                title="Mobile"
                src={currentMedia(selected, "mobile")}
                isVideo={mediaType === "video"}
                ratioClass="aspect-[1.79/1] max-w-[240px]"
                emptyHint="Falls back to desktop media"
              />
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-6">
              <div className="rounded-xl border border-gray-200 bg-white p-5">
                <p className="mb-1 text-sm font-semibold text-[#1a1a2e]">Media type</p>
                <p className="mb-4 text-xs text-gray-400">
                  Hero shows either an image or a video. Selecting one clears the other.
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => switchType("image")}
                    className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                      mediaType === "image"
                        ? "bg-[#7A2533] text-white"
                        : "border border-gray-300 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <ImageIcon className="h-4 w-4" /> Image
                  </button>
                  <button
                    type="button"
                    onClick={() => switchType("video")}
                    className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                      mediaType === "video"
                        ? "bg-[#7A2533] text-white"
                        : "border border-gray-300 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Film className="h-4 w-4" /> Video
                  </button>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {(["desktop", "mobile"] as SlotKey[]).map((slot) => {
                  const current = currentMedia(selected, slot);
                  const info = fileInfo[slot];
                  const warn =
                    info?.ratio !== undefined &&
                    Math.abs(info.ratio - RECOMMENDED[slot].ratio) / RECOMMENDED[slot].ratio > 0.2;
                  return (
                    <div key={slot} className="rounded-xl border border-gray-200 bg-white p-5">
                      <p className="text-sm font-semibold text-[#1a1a2e] capitalize">
                        {slot} media
                      </p>
                      <p className="mt-0.5 text-xs text-gray-400">{SLOT_HINTS[slot]}</p>
                      <label className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-sm text-gray-500 transition-colors hover:border-[#7A2533] hover:text-[#7A2533]">
                        {uploading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <UploadCloud className="h-4 w-4" />
                        )}
                        {fileInfo[slot]?.name
                          ? "Replace media"
                          : current
                            ? "Replace current media"
                            : "Choose file"}
                        <input
                          type="file"
                          accept={
                            mediaType === "video"
                              ? "video/mp4,video/webm"
                              : "image/jpeg,image/png,image/webp"
                          }
                          onChange={(e) => handleFile(slot, e)}
                          className="hidden"
                        />
                      </label>
                      {fileInfo[slot]?.name && (
                        <div className="mt-3 flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                          <div className="min-w-0">
                            <p className="truncate text-xs font-medium text-gray-700">
                              {fileInfo[slot]!.name}
                            </p>
                            <p className="text-xs text-gray-400">
                              {info?.width && info?.height
                                ? `${info.width} × ${info.height} px · ${info.sizeLabel}`
                                : info?.duration !== undefined
                                  ? `Duration ${formatDuration(info.duration)} · ${info.sizeLabel}`
                                  : (info?.sizeLabel ?? "Reading media info…")}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => clearFile(slot)}
                            className="shrink-0 rounded-full p-1 text-gray-400 hover:text-red-500"
                            aria-label={`Clear ${slot} selection`}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                      {warn && (
                        <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
                          ⚠ Different aspect ratio — the media will be cropped to fit (object-fit:
                          cover). See the preview below.
                        </p>
                      )}
                      {!fileInfo[slot]?.name && current && !removed[slot] && (
                        <div className="mt-3 flex items-center gap-3">
                          <div className="h-12 w-24 shrink-0 overflow-hidden rounded-md bg-gray-100">
                            {mediaType === "video" ? (
                              <video
                                src={current}
                                muted
                                playsInline
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <img
                                src={current}
                                alt={`Current ${slot} media`}
                                className="h-full w-full object-cover"
                              />
                            )}
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Current {mediaType}</p>
                            <button
                              type="button"
                              onClick={() => markRemoved(slot)}
                              className="mt-1 inline-flex items-center gap-1 text-xs text-red-600 hover:underline"
                            >
                              <Trash2 className="h-3 w-3" /> Remove
                            </button>
                          </div>
                        </div>
                      )}
                      {removed[slot] && !fileInfo[slot]?.name && (
                        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
                          Will be removed on save
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-5">
                <p className="mb-4 text-sm font-semibold text-[#1a1a2e]">
                  Preview (matches the category page)
                </p>
                <div className="grid gap-6 lg:grid-cols-2">
                  {(["desktop", "mobile"] as SlotKey[]).map((slot) => (
                    <HeroPreview
                      key={slot}
                      title={slot === "desktop" ? "Desktop preview" : "Mobile preview"}
                      src={
                        previewSrc[slot] || (removed[slot] ? null : currentMedia(selected, slot))
                      }
                      isVideo={mediaType === "video"}
                      ratioClass={
                        slot === "desktop" ? "aspect-[4.36/1]" : "aspect-[1.79/1] max-w-[240px]"
                      }
                      emptyHint={slot === "mobile" ? "Falls back to desktop media" : "No media"}
                    />
                  ))}
                </div>
                {mediaType === "video" && (
                  <p className="mt-3 text-xs text-gray-400">
                    Videos play muted, loop, and autoplay on the category page with a sound toggle.
                  </p>
                )}
              </div>
            </div>

            <div className="h-fit rounded-xl border border-gray-200 bg-white p-5">
              <p className="mb-3 text-sm font-semibold text-[#1a1a2e]">Recommended sizes</p>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-xs font-medium text-gray-500">Desktop</dt>
                  <dd className="mt-0.5 text-gray-700">
                    {RECOMMENDED.desktop.width} × {RECOMMENDED.desktop.height} px
                    <span className="text-gray-400">
                      {" "}
                      (aspect ≈ {RECOMMENDED.desktop.ratio.toFixed(1)}:1)
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-gray-500">Mobile</dt>
                  <dd className="mt-0.5 text-gray-700">
                    {RECOMMENDED.mobile.width} × {RECOMMENDED.mobile.height} px
                    <span className="text-gray-400">
                      {" "}
                      (aspect ≈ {RECOMMENDED.mobile.ratio.toFixed(1)}:1)
                    </span>
                  </dd>
                </div>
              </dl>
              <p className="mt-4 rounded-lg bg-gray-50 px-3 py-2 text-xs leading-5 text-gray-500">
                The hero is full-width with object-fit: cover, so larger files with a similar ratio
                work fine. Images: JPG, PNG or WEBP up to 5 MB. Videos: MP4 or WebM up to 50 MB.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={
                saving || (!files.desktop && !files.mobile && !removed.desktop && !removed.mobile)
              }
              className="rounded-lg bg-[#7A2533] px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#5F1C27] disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
            <button
              onClick={() => {
                resetPending();
                setMessage(null);
              }}
              disabled={saving}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

function HeroPreview({
  title,
  src,
  isVideo,
  ratioClass,
  emptyHint,
}: {
  title: string;
  src: string | null;
  isVideo: boolean;
  ratioClass: string;
  emptyHint: string;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-medium text-gray-500">{title}</p>
      <div className={`${ratioClass} overflow-hidden rounded-lg bg-gray-100`}>
        {src ? (
          isVideo ? (
            <video
              src={src}
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover"
            />
          ) : (
            <img src={src} alt={`${title} preview`} className="h-full w-full object-cover" />
          )
        ) : (
          <div className="flex h-full min-h-[72px] w-full items-center justify-center text-center text-xs text-gray-400">
            {emptyHint}
          </div>
        )}
      </div>
    </div>
  );
}
