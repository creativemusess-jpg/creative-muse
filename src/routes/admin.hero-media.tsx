import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Check, Loader2, UploadCloud, X } from "lucide-react";
import { AdminLayout, AdminPageHeader, AdminLoading } from "@/components/admin/AdminLayout";
import { requireAdmin } from "@/lib/auth-guard";
import { heroMediaApi, HERO_DEFAULT_CONTENT } from "@/lib/api/heroMedia";
import type { HeroMediaItem, HeroContentDefaults } from "@/lib/api/heroMedia";
import { uploadImage, deleteImage, validateHeroMediaFile } from "@/lib/api/upload";
import { productsApi } from "@/lib/api/products";
import { productFromDb } from "@/lib/products";

export const Route = createFileRoute("/admin/hero-media")({
  beforeLoad: requireAdmin,
  component: AdminHeroMedia,
});

type MediaType = "image" | "video";

interface MediaInfo {
  width: number;
  height: number;
  duration: number | null;
}

function inspectFile(file: File, kind: MediaType): Promise<MediaInfo> {
  return new Promise((resolve, reject) => {
    if (kind === "image") {
      const img = new Image();
      img.onload = () =>
        resolve({ width: img.naturalWidth, height: img.naturalHeight, duration: null });
      img.onerror = () => reject(new Error("Could not read the image file."));
      img.src = URL.createObjectURL(file);
    } else {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () =>
        resolve({
          width: video.videoWidth,
          height: video.videoHeight,
          duration: Number.isFinite(video.duration) ? video.duration : null,
        });
      video.onerror = () => reject(new Error("Could not read the video file."));
      video.src = URL.createObjectURL(file);
    }
  });
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function ratioLabel(w: number, h: number): string {
  if (!w || !h) return "";
  return w >= h ? `${(w / h).toFixed(2)}:1` : `1:${(h / w).toFixed(2)}`;
}

function AdminHeroMedia() {
  const [items, setItems] = useState<HeroMediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<HeroMediaItem | null>(null);
  const [products, setProducts] = useState<{ slug: string; name: string }[]>([]);

  const load = useCallback(async () => {
    try {
      const data = await heroMediaApi.list();
      setItems(data);
      setLoadError(null);
    } catch (err: any) {
      setLoadError(err?.message || "Could not load hero media from the database.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    productsApi
      .list({ status: "active", per_page: 200 })
      .then((res) => {
        setProducts(
          (res.data || []).map((p) => {
            const mapped = productFromDb(p);
            return { slug: mapped.id, name: mapped.name };
          }),
        );
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!saveMessage) return;
    const t = setTimeout(() => setSaveMessage(null), 4000);
    return () => clearTimeout(t);
  }, [saveMessage]);

  const handleDelete = async (m: HeroMediaItem) => {
    if (!confirm(`Delete "${m.name}"? The uploaded file will also be removed.`)) return;
    try {
      await heroMediaApi.remove(m.id);
      await deleteImage(m.media_url, "heroMedia").catch(() => {});
      await load();
      setSaveMessage("Hero media deleted.");
    } catch (err: any) {
      alert(err?.message || "Failed to delete hero media.");
    }
  };

  const handleToggleActive = async (m: HeroMediaItem) => {
    try {
      await heroMediaApi.update(m.id, { is_active: !m.is_active });
      await load();
    } catch (err: any) {
      alert(err?.message || "Failed to update hero media.");
    }
  };

  const handleMove = async (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= items.length) return;
    const a = items[idx];
    const b = items[target];
    try {
      await Promise.all([
        heroMediaApi.update(a.id, { sort_order: b.sort_order }),
        heroMediaApi.update(b.id, { sort_order: a.sort_order }),
      ]);
      await load();
    } catch (err: any) {
      alert(err?.message || "Failed to reorder hero media.");
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
        title="Hero Media"
        description="Manage the homepage hero carousel images and videos"
      />

      {loadError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {loadError}
          <p className="mt-1 text-xs text-red-500">
            If the table is missing, run the migration supabase/migration-hero-media.sql in the
            Supabase SQL Editor.
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
            setFormOpen(true);
          }}
          className="rounded-lg bg-[#7A2533] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#5F1C27]"
        >
          + Add Hero Media
        </button>
      </div>

      {formOpen && (
        <HeroMediaForm
          item={editing}
          fallback={
            HERO_DEFAULT_CONTENT[
              ((editing ? items.findIndex((x) => x.id === editing.id) : items.length) +
                HERO_DEFAULT_CONTENT.length) %
                HERO_DEFAULT_CONTENT.length
            ]
          }
          products={products}
          onSave={async () => {
            setFormOpen(false);
            setEditing(null);
            await load();
            setSaveMessage("Hero media saved.");
          }}
          onCancel={() => {
            setFormOpen(false);
            setEditing(null);
          }}
        />
      )}

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
              <th className="px-4 py-3">Preview</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Badge</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && !loadError ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                  No hero media yet. Add an image or video to publish to the homepage hero.
                </td>
              </tr>
            ) : (
              items.map((m, idx) => (
                <tr key={m.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    {m.media_type === "video" ? (
                      <video
                        src={m.media_url}
                        className="h-16 w-28 rounded-lg object-cover"
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
                    ) : (
                      <img
                        src={m.media_url}
                        alt={m.name}
                        className="h-16 w-28 rounded-lg object-cover"
                      />
                    )}
                  </td>
                  <td className="max-w-[200px] truncate px-4 py-3 font-medium text-gray-800">
                    {m.name}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {m.badge ? (
                      <span className="rounded-full bg-[#7A2533]/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#7A2533]">
                        {m.badge}
                      </span>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase ${m.media_type === "video" ? "bg-blue-50 text-blue-700" : "bg-emerald-50 text-emerald-700"}`}
                    >
                      {m.media_type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleMove(idx, -1)}
                        disabled={idx === 0}
                        aria-label="Move up"
                        className="rounded border border-gray-200 px-1.5 py-0.5 text-gray-500 hover:border-[#7A2533] hover:text-[#7A2533] disabled:opacity-30"
                      >
                        ↑
                      </button>
                      <span className="w-4 text-center text-xs text-gray-600">{m.sort_order}</span>
                      <button
                        onClick={() => handleMove(idx, 1)}
                        disabled={idx === items.length - 1}
                        aria-label="Move down"
                        className="rounded border border-gray-200 px-1.5 py-0.5 text-gray-500 hover:border-[#7A2533] hover:text-[#7A2533] disabled:opacity-30"
                      >
                        ↓
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase ${m.is_active ? "border border-[#7A2533]/20 bg-[#fff4f5] text-[#7A2533]" : "bg-gray-100 text-gray-500"}`}
                    >
                      {m.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditing(m);
                          setFormOpen(true);
                        }}
                        className="text-xs text-[#7A2533] hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleActive(m)}
                        className="text-xs text-gray-500 hover:underline"
                      >
                        {m.is_active ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        onClick={() => handleDelete(m)}
                        className="text-xs text-red-500 hover:underline"
                      >
                        Delete
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

function HeroMediaForm({
  item,
  fallback,
  products,
  onSave,
  onCancel,
}: {
  item: HeroMediaItem | null;
  fallback: HeroContentDefaults;
  products: { slug: string; name: string }[];
  onSave: () => Promise<void>;
  onCancel: () => void;
}) {
  const [name, setName] = useState(item?.name || "");
  const [type, setType] = useState<MediaType>(item?.media_type || "image");
  const [badge, setBadge] = useState(item?.badge || "");
  const [sortOrder, setSortOrder] = useState(item?.sort_order ?? 0);
  const [isActive, setIsActive] = useState(item?.is_active ?? true);
  const [file, setFile] = useState<File | null>(null);
  const [mediaInfo, setMediaInfo] = useState<MediaInfo | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState(item?.title || "");
  const [highlight, setHighlight] = useState(item?.highlight || "");
  const [description, setDescription] = useState(item?.description || "");
  const [price, setPrice] = useState(item?.price || "");
  const [bestSellerLabel, setBestSellerLabel] = useState(item?.best_seller_label || "");
  const [primaryCtaText, setPrimaryCtaText] = useState(item?.primary_cta_text || "");
  const [primaryCtaLink, setPrimaryCtaLink] = useState(item?.primary_cta_link || "");
  const [secondaryCtaText, setSecondaryCtaText] = useState(item?.secondary_cta_text || "");
  const [secondaryCtaLink, setSecondaryCtaLink] = useState(item?.secondary_cta_link || "");
  const [productId, setProductId] = useState(item?.product_id || "");
  const [stats, setStats] = useState<{ number: string; label: string }[]>(
    item?.stats && item.stats.length
      ? item.stats.map((s) => ({ number: s.number, label: s.label }))
      : [
          { number: "", label: "" },
          { number: "", label: "" },
          { number: "", label: "" },
        ],
  );

  const previewUrl = file ? URL.createObjectURL(file) : item?.media_url || null;

  const switchType = (t: MediaType) => {
    setType(t);
    setFile(null);
    setMediaInfo(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFile = async (f: File | null) => {
    setError(null);
    if (!f) {
      setFile(null);
      setMediaInfo(null);
      return;
    }
    const validationError = validateHeroMediaFile(f, type);
    if (validationError) {
      setError(validationError);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    setFile(f);
    try {
      setMediaInfo(await inspectFile(f, type));
    } catch (err: any) {
      setMediaInfo(null);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    if (!previewUrl) {
      setError("Upload an image or video first.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      let mediaUrl = item?.media_url || "";
      let uploadedPath: string | null = null;
      if (file) {
        uploadedPath = await uploadImage(file, "heroMedia", "hero-media");
        mediaUrl = uploadedPath;
      }
      const payload = {
        name: name.trim(),
        media_type: type,
        media_url: mediaUrl,
        badge: badge.trim() || null,
        sort_order: sortOrder,
        is_active: isActive,
        title: title.trim() || null,
        highlight: highlight.trim() || null,
        description: description.trim() || null,
        price: price.trim() || null,
        best_seller_label: bestSellerLabel.trim() || null,
        primary_cta_text: primaryCtaText.trim() || null,
        primary_cta_link: primaryCtaLink.trim() || null,
        secondary_cta_text: secondaryCtaText.trim() || null,
        secondary_cta_link: secondaryCtaLink.trim() || null,
        product_id: productId.trim() || null,
        stats:
          stats.filter((s) => s.number.trim() || s.label.trim()).length > 0
            ? stats.map((s) => ({ number: s.number.trim(), label: s.label.trim() }))
            : null,
      };
      if (item) {
        await heroMediaApi.update(item.id, payload);
        if (uploadedPath && item.media_url && item.media_url !== uploadedPath) {
          await deleteImage(item.media_url, "heroMedia").catch(() => {});
        }
      } else {
        await heroMediaApi.create(payload);
      }
      await onSave();
    } catch (err: any) {
      setError(err?.message || "Failed to save hero media.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#7A2533]";

  return (
    <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900">
          {item ? `Edit: ${item.name}` : "Add Hero Media"}
        </h3>
        <button
          onClick={onCancel}
          aria-label="Close form"
          className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Diwali Collection 2026"
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
            Media Type
          </label>
          <div className="flex gap-2">
            {(["image", "video"] as MediaType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => switchType(t)}
                className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium capitalize transition-colors ${
                  type === t
                    ? "border-[#7A2533] bg-[#7A2533]/5 text-[#7A2533]"
                    : "border-gray-300 text-gray-500 hover:border-gray-400"
                }`}
              >
                {t === "image" ? "Image" : "Video"}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
            Badge (optional)
          </label>
          <input
            type="text"
            value={badge}
            onChange={(e) => setBadge(e.target.value)}
            placeholder="e.g. Bridal Edit 2026"
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
              Order
            </label>
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
              Active
            </label>
            <div className="flex h-9 items-center gap-2">
              <button
                type="button"
                onClick={() => setIsActive((v) => !v)}
                className={`flex h-6 w-11 items-center rounded-full p-0.5 transition-colors ${isActive ? "bg-[#7A2533]" : "bg-gray-300"}`}
                aria-label="Toggle active"
              >
                <span
                  className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${isActive ? "translate-x-5" : "translate-x-0"}`}
                />
              </button>
              <span className="text-xs text-gray-500">{isActive ? "Visible" : "Hidden"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-lg border border-gray-100 bg-gray-50/60 p-4">
        <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">
          Headline &amp; Copy
        </h4>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
              Title (line 1)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={fallback.title || "e.g. Where Every Gem"}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
              Highlight (line 2, shimmer)
            </label>
            <input
              type="text"
              value={highlight}
              onChange={(e) => setHighlight(e.target.value)}
              placeholder={fallback.highlight || "e.g. Tells Your Story"}
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder={fallback.description || undefined}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
              Price Chip
            </label>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder={fallback.price || "e.g. ₹48,500"}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
              Best Seller Card Label
            </label>
            <input
              type="text"
              value={bestSellerLabel}
              onChange={(e) => setBestSellerLabel(e.target.value)}
              placeholder={fallback.best_seller_label || "e.g. Aarav Solitaire"}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-gray-100 bg-gray-50/60 p-4">
        <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">
          Call-to-Action Buttons
        </h4>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
              Primary Button Text
            </label>
            <input
              type="text"
              value={primaryCtaText}
              onChange={(e) => setPrimaryCtaText(e.target.value)}
              placeholder={fallback.primary_cta_text || "Explore Collections"}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
              Primary Button Link
            </label>
            <input
              type="text"
              value={primaryCtaLink}
              onChange={(e) => setPrimaryCtaLink(e.target.value)}
              placeholder={fallback.primary_cta_link || "/shop"}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
              Secondary Button Text
            </label>
            <input
              type="text"
              value={secondaryCtaText}
              onChange={(e) => setSecondaryCtaText(e.target.value)}
              placeholder={fallback.secondary_cta_text || "Visit Our Store"}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
              Secondary Button Link
            </label>
            <input
              type="text"
              value={secondaryCtaLink}
              onChange={(e) => setSecondaryCtaLink(e.target.value)}
              placeholder={fallback.secondary_cta_link || "/contact"}
              className={inputClass}
            />
          </div>
        </div>
        <p className="mt-2 text-[11px] text-gray-400">
          Internal links start with "/" (e.g. /shop). External links open in a new tab (e.g.
          https://…).
        </p>
      </div>

      <div className="mt-4 rounded-lg border border-gray-100 bg-gray-50/60 p-4">
        <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">
          Linked Product
        </h4>
        <select
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          className={inputClass}
        >
          <option value="">No linked product (image not clickable)</option>
          {products.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.name}
            </option>
          ))}
        </select>
        <p className="mt-2 text-[11px] text-gray-400">
          When set, the hero image/video opens this product's page.
        </p>
      </div>

      <div className="mt-4 rounded-lg border border-gray-100 bg-gray-50/60 p-4">
        <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">
          Stats Row
        </h4>
        <div className="space-y-3">
          {stats.map((s, i) => (
            <div key={i} className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                  Number {i + 1}
                </label>
                <input
                  type="text"
                  value={s.number}
                  onChange={(e) =>
                    setStats((prev) => prev.map((x, j) => (j === i ? { ...x, number: e.target.value } : x)))
                  }
                  placeholder={fallback.stats?.[i]?.number || "e.g. 15+"}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                  Label {i + 1}
                </label>
                <input
                  type="text"
                  value={s.label}
                  onChange={(e) =>
                    setStats((prev) => prev.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))
                  }
                  placeholder={fallback.stats?.[i]?.label || "e.g. Years of Craft"}
                  className={inputClass}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
          {type === "image" ? "Hero Image" : "Hero Video"}
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex h-36 w-full shrink-0 items-center justify-center overflow-hidden rounded-lg border border-dashed border-gray-300 bg-gray-50 sm:w-64">
            {previewUrl ? (
              type === "video" ? (
                <video
                  src={previewUrl}
                  className="h-full w-full object-contain"
                  muted
                  loop
                  autoPlay
                  playsInline
                />
              ) : (
                <img src={previewUrl} alt="Preview" className="h-full w-full object-contain" />
              )
            ) : (
              <div className="flex flex-col items-center gap-1 text-gray-400">
                <UploadCloud className="h-6 w-6" />
                <span className="text-xs">No {type} selected</span>
              </div>
            )}
          </div>
          <div className="flex flex-1 flex-col justify-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept={
                type === "image"
                  ? "image/jpeg,image/png,image/webp"
                  : "video/mp4,video/webm"
              }
              onChange={(e) => handleFile(e.target.files?.[0] || null)}
              className="text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-[#7A2533] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white file:hover:bg-[#5F1C27]"
            />
            <p className="text-xs text-gray-400">
              {type === "image"
                ? "JPG, PNG or WEBP, up to 5 MB."
                : "MP4 or WebM, up to 50 MB."}{" "}
              Dimensions and duration are detected automatically.
            </p>
            {mediaInfo && (
              <div className="rounded-lg bg-gray-50 p-2.5 text-xs text-gray-600">
                {mediaInfo.width > 0 && mediaInfo.height > 0 && (
                  <p>
                    Dimensions: {mediaInfo.width} × {mediaInfo.height} px · Ratio{" "}
                    {ratioLabel(mediaInfo.width, mediaInfo.height)}
                  </p>
                )}
                {type === "video" && mediaInfo.duration !== null && (
                  <p>Duration: {formatDuration(mediaInfo.duration)}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-5 flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={saving || uploading}
          className="flex items-center gap-2 rounded-lg bg-[#7A2533] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#5F1C27] disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
          {saving ? "Saving…" : item ? "Save Changes" : "Add Media"}
        </button>
      </div>
    </div>
  );
}