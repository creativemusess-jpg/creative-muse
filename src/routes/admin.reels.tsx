import { useState, useEffect, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout, AdminPageHeader, AdminLoading } from "@/components/admin/AdminLayout";
import { reelsApi } from "@/lib/api/reels";
import { productsApi } from "@/lib/api/products";
import { useStorefrontProducts } from "@/lib/products";
import type { ShoppableReelRow, ShoppableReelInsert } from "@/lib/db/types";

export const Route = createFileRoute("/admin/reels")({
  component: AdminReels,
});

const STORAGE_KEY = "muse-reels-fallback";

function getLocalReels(): ShoppableReelRow[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveLocalReels(reels: ShoppableReelRow[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reels));
}

function AdminReels() {
  const [reels, setReels] = useState<ShoppableReelRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ShoppableReelRow | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [useLocal, setUseLocal] = useState(false);
  const { products } = useStorefrontProducts();
  const initialized = useRef(false);

  const seedLocalReels = () => {
    const existing = getLocalReels();
    if (existing.length > 0) return existing;
    const fallback: ShoppableReelRow[] = products.slice(0, 5).map((p, i) => ({
      id: `reel-${p.id}`,
      video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      poster_url: p.image,
      product_id: p.id,
      sort_order: (i + 1) * 10,
      is_active: true,
      alt_text: `${p.name} — shoppable reel`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));
    saveLocalReels(fallback);
    return fallback;
  };

  const load = async () => {
    setLoading(true);
    try {
      const data = await reelsApi.listAll();
      setReels(data);
      setUseLocal(false);
    } catch {
      setReels(seedLocalReels());
      setUseLocal(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    load();
  }, [products]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this reel?")) return;
    if (useLocal) {
      const updated = getLocalReels().filter((r) => r.id !== id);
      saveLocalReels(updated);
      setReels(updated);
    } else {
      await reelsApi.delete(id);
      await load();
    }
  };

  const handleToggleActive = async (r: ShoppableReelRow) => {
    if (useLocal) {
      const updated = getLocalReels().map((reel) =>
        reel.id === r.id ? { ...reel, is_active: !reel.is_active } : reel,
      );
      saveLocalReels(updated);
      setReels(updated);
    } else {
      await reelsApi.update(r.id, { is_active: !r.is_active });
      await load();
    }
  };

  if (loading) return <AdminLayout><AdminLoading /></AdminLayout>;

  return (
    <AdminLayout>
      <AdminPageHeader title="Shoppable Reels" description="Manage Instagram-style shoppable reel videos" />

      {useLocal && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Using local storage — database table not available. Edit, add, and delete reels below; they'll be saved locally.
        </div>
      )}

      <div className="mb-6">
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="rounded-lg bg-[#1a1a2e] px-5 py-2 text-sm font-semibold text-white hover:bg-[#2d1b4e]"
        >
          + Add Reel
        </button>
      </div>

      {showForm && (
        <ReelForm
          reel={editing}
          onSave={async () => { setShowForm(false); setEditing(null); await load(); }}
          onCancel={() => { setShowForm(false); setEditing(null); }}
          useLocal={useLocal}
        />
      )}

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Preview</th>
              <th className="px-4 py-3">Product ID</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reels.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No reels yet.</td></tr>
            ) : (
              reels.map((r) => (
                <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3 text-gray-500">{r.sort_order}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <video
                        src={r.video_url}
                        className="h-16 w-9 rounded-lg object-cover"
                        muted
                        loop
                        playsInline
                        onMouseEnter={(e) => (e.currentTarget as HTMLVideoElement).play()}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLVideoElement).pause(); (e.currentTarget as HTMLVideoElement).currentTime = 0; }}
                      />
                      {r.poster_url && (
                        <img src={r.poster_url} alt="" className="h-10 w-10 rounded object-cover" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">{r.product_id}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase ${r.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {r.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setEditing(r); setShowForm(true); }}
                        className="text-xs text-[#c9a96e] hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(r.id)}
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
  useLocal,
}: {
  reel: ShoppableReelRow | null;
  onSave: () => Promise<void>;
  onCancel: () => void;
  useLocal: boolean;
}) {
  const [videoUrl, setVideoUrl] = useState(reel?.video_url || "");
  const [posterUrl, setPosterUrl] = useState(reel?.poster_url || "");
  const [productId, setProductId] = useState(reel?.product_id || "");
  const [sortOrder, setSortOrder] = useState(reel?.sort_order ?? 0);
  const [isActive, setIsActive] = useState(reel?.is_active ?? true);
  const [altText, setAltText] = useState(reel?.alt_text || "");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState(reel ? "" : "");
  const [products, setProducts] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (search.length >= 2) {
      productsApi.list({ search, status: "active", per_page: 20 }).then((res) => {
        setProducts(res.data);
        setShowDropdown(true);
      }).catch(() => {});
    } else {
      setProducts([]);
      setShowDropdown(false);
    }
  }, [search]);

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      alert("Please select a video file.");
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      alert("Video must be under 50MB.");
      return;
    }
    setUploading(true);
    try {
      const url = await reelsApi.uploadVideo(file);
      setVideoUrl(url);
    } catch (err: any) {
      alert(err.message + (useLocal ? " Since DB is unavailable, paste a direct video URL instead." : ""));
    } finally {
      setUploading(false);
    }
  };

  const nextLocalId = () => `reel-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl.trim() || !productId.trim()) {
      alert("Video and Product are required.");
      return;
    }
    setSaving(true);
    try {
      if (useLocal) {
        let local = getLocalReels();
        if (reel) {
          local = local.map((r) =>
            r.id === reel.id
              ? { ...r, video_url: videoUrl.trim(), poster_url: posterUrl.trim() || null, product_id: productId.trim(), sort_order: sortOrder, is_active: isActive, alt_text: altText.trim() || null, updated_at: new Date().toISOString() }
              : r,
          );
        } else {
          local.push({
            id: nextLocalId(),
            video_url: videoUrl.trim(),
            poster_url: posterUrl.trim() || null,
            product_id: productId.trim(),
            sort_order: sortOrder,
            is_active: isActive,
            alt_text: altText.trim() || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        }
        saveLocalReels(local);
        await onSave();
      } else {
        const data: ShoppableReelInsert = {
          video_url: videoUrl.trim(),
          poster_url: posterUrl.trim() || null,
          product_id: productId.trim(),
          sort_order: sortOrder,
          is_active: isActive,
          alt_text: altText.trim() || null,
        };
        if (reel) {
          await reelsApi.update(reel.id, data);
        } else {
          await reelsApi.create(data);
        }
        await onSave();
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 rounded-xl border border-gray-200 bg-white p-6">
      <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-gray-500">
        {reel ? "Edit Reel" : "Add New Reel"}
      </h3>

      {useLocal && (
        <p className="mb-4 text-xs text-amber-600">Saving locally — changes will persist in browser storage.</p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-medium text-gray-600">Reel Video *</label>
          {videoUrl ? (
            <div className="mb-2 flex items-center gap-3">
              <video src={videoUrl} className="h-20 w-12 rounded-lg object-cover" controls />
              <button type="button" onClick={() => setVideoUrl("")} className="text-xs text-red-500 hover:underline">Remove</button>
            </div>
          ) : null}
          {!useLocal && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4,video/webm"
                onChange={handleVideoUpload}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
              {uploading && <p className="mt-1 text-xs text-[#c9a96e]">Uploading video...</p>}
            </>
          )}
          {videoUrl ? null : (
            <>
              <p className="mt-1 text-xs text-gray-400">
                {useLocal ? "Enter a direct video URL (MP4/WebM):" : "MP4 or WebM · max 50MB — or enter URL directly:"}
              </p>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://example.com/reel.mp4"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#c9a96e]"
              />
            </>
          )}
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Poster Image URL</label>
          <input
            type="url"
            value={posterUrl}
            onChange={(e) => setPosterUrl(e.target.value)}
            placeholder="https://example.com/poster.jpg"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#c9a96e]"
          />
          {posterUrl && <img src={posterUrl} alt="" className="mt-1 h-16 w-16 rounded object-cover" />}
        </div>

        <div className="relative">
          <label className="mb-1 block text-xs font-medium text-gray-600">Linked Product *</label>
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setProductId(""); }}
            onFocus={() => { if (products.length > 0) setShowDropdown(true); }}
            placeholder="Search product by name..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#c9a96e]"
          />
          {productId && !search && (
            <p className="mt-1 text-xs text-green-600">Selected: {productId}</p>
          )}
          {showDropdown && products.length > 0 && (
            <ul className="absolute z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
              {products.map((p: any) => (
                <li
                  key={p.id}
                  onClick={() => {
                    setProductId(p.id);
                    setSearch(p.name);
                    setShowDropdown(false);
                  }}
                  className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm hover:bg-[#f5efe8]"
                >
                  {p.main_image?.url && (
                    <img src={p.main_image.url} alt="" className="h-8 w-8 rounded object-cover" />
                  )}
                  <div>
                    <p className="font-medium text-[#1a1a2e]">{p.name}</p>
                    <p className="text-[10px] text-gray-400">ID: {p.id}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Sort Order</label>
          <input
            type="number"
            min={0}
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#c9a96e]"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Alt Text</label>
          <input
            type="text"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            placeholder="Describe the video content"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#c9a96e]"
          />
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-[#c9a96e] focus:ring-[#c9a96e]"
            />
            <span className="text-sm text-gray-700">Active</span>
          </label>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="submit"
          disabled={saving || uploading}
          className="rounded-lg bg-[#1a1a2e] px-6 py-2 text-sm font-semibold text-white hover:bg-[#2d1b4e] disabled:opacity-50"
        >
          {saving ? "Saving..." : reel ? "Update Reel" : "Create Reel"}
        </button>
        <button type="button" onClick={onCancel} className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50">
          Cancel
        </button>
      </div>
    </form>
  );
}
