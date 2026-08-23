import { useState, useEffect, useRef, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Check, ChevronDown, Loader2, Search, Volume2, VolumeX, UploadCloud } from "lucide-react";
import { AdminLayout, AdminPageHeader, AdminLoading } from "@/components/admin/AdminLayout";
import { reelsApi } from "@/lib/api/reels";
import { productsApi } from "@/lib/api/products";
import { productFromDb } from "@/lib/products";
import type { ShoppableReelRow, ShoppableReelInsert } from "@/lib/db/types";

import { requireAdmin } from "@/lib/auth-guard";

export const Route = createFileRoute("/admin/reels")({
  beforeLoad: requireAdmin,
  component: AdminReels,
});

function AdminReels() {
  const [reels, setReels] = useState<ShoppableReelRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<ShoppableReelRow | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const initialized = useRef(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await reelsApi.listAll();
      setReels(data);
      setError(null);
    } catch (err: any) {
      setError(err?.message || "Could not load reels from the database.");
      setReels([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    load();
  }, []);

  useEffect(() => {
    if (!saveMessage) return;
    const t = setTimeout(() => setSaveMessage(null), 4000);
    return () => clearTimeout(t);
  }, [saveMessage]);

  const handleDelete = async (r: ShoppableReelRow) => {
    if (!confirm("Delete this reel?")) return;
    try {
      await reelsApi.deleteReelFiles([r.video_url, r.poster_url]);
      await reelsApi.delete(r.id);
      await load();
      setSaveMessage("Reel deleted.");
    } catch (err: any) {
      alert(err?.message || "Failed to delete reel.");
    }
  };

  const handleToggleActive = async (r: ShoppableReelRow) => {
    try {
      await reelsApi.update(r.id, { is_active: !r.is_active });
      await load();
    } catch (err: any) {
      alert(err?.message || "Failed to update reel.");
    }
  };

  if (loading)
    return (
      <AdminLayout>
        <AdminLoading />
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Shoppable Reels"
        description="Manage Instagram-style shoppable reel videos"
      />

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
          <p className="mt-1 text-xs text-red-500">
            If the table is missing, run the supabase migration
            supabase/migration-shoppable-reels-storage-hardened.sql in the Supabase SQL Editor.
          </p>
        </div>
      )}

      {saveMessage && (
        <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {saveMessage}
        </div>
      )}

      <div className="mb-6">
        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="rounded-lg bg-[#9C544D] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#7A3D3A]"
        >
          + Add Reel
        </button>
      </div>

      {showForm && (
        <ReelForm
          reel={editing}
          onSave={async () => {
            setShowForm(false);
            setEditing(null);
            await load();
            setSaveMessage("Reel saved.");
          }}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
        />
      )}

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
              <th className="px-4 py-3">Preview</th>
              <th className="px-4 py-3">Linked Product</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reels.length === 0 && !error ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                  No reels yet. Add one to publish to the homepage.
                </td>
              </tr>
            ) : (
              reels.map((r) => (
                <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    <video
                      src={r.video_url}
                      poster={r.poster_url || undefined}
                      className="h-16 w-9 rounded-lg object-cover"
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      onMouseEnter={(e) => (e.currentTarget as HTMLVideoElement).play()}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLVideoElement).pause();
                        (e.currentTarget as HTMLVideoElement).currentTime = 0;
                      }}
                    />
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">{r.product_id}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase ${r.is_active ? "border border-[#9C544D]/20 bg-[#fff4f5] text-[#9C544D]" : "bg-gray-100 text-gray-500"}`}
                    >
                      {r.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditing(r);
                          setShowForm(true);
                        }}
                        className="text-xs text-[#9C544D] hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(r)}
                        className="text-xs text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => handleToggleActive(r)}
                        className="text-xs text-gray-500 hover:underline"
                      >
                        {r.is_active ? "Deactivate" : "Activate"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

function ReelForm({
  reel,
  onSave,
  onCancel,
}: {
  reel: ShoppableReelRow | null;
  onSave: () => Promise<void>;
  onCancel: () => void;
}) {
  const [video, setVideo] = useState<{
    url: string;
    name: string;
    posterUrl: string | null;
  } | null>(
    reel
      ? {
          url: reel.video_url,
          name: reel.video_url.split("/").pop() || "video",
          posterUrl: reel.poster_url,
        }
      : null,
  );
  const [videoPreviewMuted, setVideoPreviewMuted] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [posterizing, setPosterizing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  // Products for the Linked Product dropdown, resolved with the same
  // storefront helper the homepage product cards use (id = product slug).
  const [products, setProducts] = useState<
    { id: string; dbId: string; name: string; image: string }[]
  >([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [productQuery, setProductQuery] = useState("");
  const [product, setProduct] = useState<{ slug: string; name: string; image: string } | null>(
    null,
  );
  const [publishImmediately, setPublishImmediately] = useState(true);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const productDropdownRef = useRef<HTMLDivElement>(null);

  // Load the full active product list once so the dropdown can open with
  // all products and filter client-side while typing.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await productsApi.list({ status: "active", per_page: 200 });
        if (cancelled) return;
        const items = (res.data || []).map((p) => {
          const mapped = productFromDb(p);
          return { id: mapped.id, dbId: p.id, name: mapped.name, image: mapped.image };
        });
        setProducts(items);
        setProductsError(false);
        // When editing, preselect the reel's linked product (slug or legacy UUID).
        if (reel?.product_id) {
          const found = items.find((p) => p.id === reel.product_id || p.dbId === reel.product_id);
          if (found) {
            setProduct({ slug: found.id, name: found.name, image: found.image });
            setProductQuery(found.name);
          }
        }
      } catch {
        if (!cancelled) setProductsError(true);
      } finally {
        if (!cancelled) setProductsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [reel]);

  // Close the dropdown when clicking outside of it.
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (productDropdownRef.current && !productDropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filteredProducts = useMemo(() => {
    const q = productQuery.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => p.name.toLowerCase().includes(q));
  }, [products, productQuery]);

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    setPosterizing(false);
    try {
      const { url } = await reelsApi.uploadVideo(file);
      setVideo({ url, name: file.name, posterUrl: null });
      if (fileInputRef.current) fileInputRef.current.value = "";
      // Best-effort: auto-capture the first frame as the poster.
      setPosterizing(true);
      const posterUrl = await reelsApi.capturePosterFromVideo(url);
      setVideo((v) => (v && v.url === url ? { ...v, posterUrl } : v));
      setPosterizing(false);
    } catch (err: any) {
      setUploadError(err?.message || "Upload failed.");
      setPosterizing(false);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!video || !product) {
      alert("Choose a video and a product first.");
      return;
    }
    setSaving(true);
    try {
      const data: ShoppableReelInsert = {
        video_url: video.url,
        poster_url: video.posterUrl || null,
        product_id: product.slug,
        // Newest reel first (negative timestamp sorts first in ascending order).
        sort_order: -Math.floor(Date.now() / 1000),
        is_active: publishImmediately,
        alt_text: `${product.name} — shoppable reel`,
      };
      if (reel) {
        await reelsApi.update(reel.id, data);
      } else {
        await reelsApi.create(data);
      }
      await onSave();
    } catch (err: any) {
      const message = err?.message || "Failed to save reel.";
      if (/security policy|row-level/i.test(message)) {
        alert(
          "The database rejected this change (RLS policy). Ensure the storage + table migration " +
            "supabase/migration-shoppable-reels-storage-hardened.sql has been applied in Supabase.",
        );
      } else {
        alert(message);
      }
    } finally {
      setSaving(false);
    }
  };

  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (videoPreviewRef.current) {
      videoPreviewRef.current.muted = videoPreviewMuted;
    }
  }, [videoPreviewMuted]);

  return (
    <form onSubmit={handleSubmit} className="mb-8 rounded-xl border border-gray-200 bg-white p-6">
      <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-gray-500">
        {reel ? "Edit Reel" : "Add New Reel"}
      </h3>

      {/* 1. Reel Video */}
      <div className="mb-6">
        <label className="mb-1 block text-xs font-medium text-gray-600">
          1. Reel Video <span className="text-red-500">*</span>
        </label>
        {video ? (
          <div className="flex flex-wrap items-center gap-4 rounded-lg border border-gray-200 bg-[#fdf8f3] p-4">
            <div className="relative shrink-0">
              <video
                ref={videoPreviewRef}
                src={video.url}
                poster={video.posterUrl || undefined}
                className="h-32 w-[72px] rounded-lg object-cover"
                muted
                loop
                playsInline
                autoPlay
              />
              <button
                type="button"
                onClick={() => setVideoPreviewMuted((m) => !m)}
                aria-label={videoPreviewMuted ? "Unmute video" : "Mute video"}
                className="absolute right-1.5 bottom-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60"
              >
                {videoPreviewMuted ? (
                  <VolumeX className="h-3.5 w-3.5" />
                ) : (
                  <Volume2 className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-[#1a1a2e]">{video.name}</p>
              <p className="mt-0.5 text-xs text-gray-400">
                {posterizing
                  ? "Generating poster…"
                  : video.posterUrl
                    ? "Poster auto-generated"
                    : "Poster not available"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setVideo(null)}
              className="text-xs font-medium text-red-500 hover:underline"
            >
              Remove
            </button>
          </div>
        ) : (
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/webm,video/quicktime"
              onChange={handleVideoUpload}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
            {uploading && (
              <p className="mt-1 flex items-center gap-1.5 text-xs text-[#9C544D]">
                <Loader2 className="h-3 w-3 animate-spin" />
                Uploading video…
              </p>
            )}
            {uploadError && <p className="mt-1 text-xs text-red-600">{uploadError}</p>}
            <p className="mt-1 text-xs text-gray-400">MP4 or WebM · max 50MB</p>
          </div>
        )}
      </div>

      {/* 2. Linked Product */}
      <div className="relative mb-6">
        <label className="mb-1 block text-xs font-medium text-gray-600">
          2. Linked Product <span className="text-red-500">*</span>
        </label>
        {product ? (
          <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-[#fdf8f3] p-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-contain p-1"
                />
              ) : (
                <span className="font-display text-xs font-semibold text-[#7a6e64]">
                  {product.name.slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-[#1a1a2e]">{product.name}</p>
              <p className="truncate text-[11px] text-gray-400">/product/{product.slug}</p>
            </div>
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <Check className="h-4 w-4" />
            </span>
            <button
              type="button"
              onClick={() => {
                setProduct(null);
                setProductQuery("");
              }}
              className="text-xs font-medium text-[#9C544D] hover:underline"
            >
              Change
            </button>
          </div>
        ) : (
          <div ref={productDropdownRef} className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen((v) => !v)}
              aria-haspopup="listbox"
              aria-expanded={dropdownOpen}
              className="flex w-full items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#9C544D]"
            >
              <span className={productsLoading ? "text-gray-400" : "text-gray-600"}>
                {productsLoading ? "Loading products…" : "Select a product"}
              </span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute z-20 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
                <div className="flex items-center gap-2 border-b border-gray-100 px-3 py-2">
                  <Search className="h-4 w-4 shrink-0 text-gray-400" />
                  <input
                    type="text"
                    value={productQuery}
                    onChange={(e) => setProductQuery(e.target.value)}
                    onFocus={() => setDropdownOpen(true)}
                    placeholder="Search products..."
                    className="w-full min-w-0 flex-1 bg-transparent text-sm outline-none"
                    autoFocus
                  />
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {productsLoading ? (
                    <div className="flex items-center justify-center gap-2 px-3 py-5 text-xs text-gray-400">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Loading products…
                    </div>
                  ) : productsError ? (
                    <p className="px-3 py-5 text-center text-xs text-gray-400">
                      Unable to load products.
                    </p>
                  ) : filteredProducts.length === 0 ? (
                    <p className="px-3 py-5 text-center text-xs text-gray-400">No products found</p>
                  ) : (
                    <ul role="listbox">
                      {filteredProducts.map((p) => (
                        <li
                          key={p.id}
                          role="option"
                          aria-selected={false}
                          onClick={() => {
                            setProduct({ slug: p.id, name: p.name, image: p.image });
                            setProductQuery("");
                            setDropdownOpen(false);
                          }}
                          className="flex cursor-pointer items-center gap-2.5 px-3 py-2 text-sm hover:bg-[#f5efe8]"
                        >
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-md bg-[#f5efe8]">
                            {p.image ? (
                              <img
                                src={p.image}
                                alt=""
                                loading="lazy"
                                decoding="async"
                                className="h-full w-full object-contain p-0.5"
                              />
                            ) : (
                              <span className="font-display text-[10px] font-semibold text-[#7a6e64]">
                                {p.name.slice(0, 2).toUpperCase()}
                              </span>
                            )}
                          </span>
                          <span className="min-w-0 flex-1 truncate font-medium text-[#1a1a2e]">
                            {p.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. Publish Reel Immediately */}
      <div className="mb-6">
        <label className="mb-1 block text-xs font-medium text-gray-600">
          3. Publish Reel Immediately
        </label>
        <button
          type="button"
          role="switch"
          aria-checked={publishImmediately}
          onClick={() => setPublishImmediately((v) => !v)}
          className={`flex h-6 w-11 items-center rounded-full transition-colors ${publishImmediately ? "bg-[#9C544D]" : "bg-gray-300"}`}
        >
          <span
            className={`block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${publishImmediately ? "translate-x-6" : "translate-x-1"}`}
          />
        </button>
        <p className="mt-1 text-xs text-gray-400">
          {publishImmediately
            ? "Will appear on the homepage right away."
            : "Saved as inactive — activate it later from the list."}
        </p>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving || uploading || !video || !product}
          className="inline-flex items-center gap-2 rounded-lg bg-[#9C544D] px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#7A3D3A] disabled:opacity-50"
        >
          <UploadCloud className="h-4 w-4" />
          {saving ? "Saving…" : "Upload Reel"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
