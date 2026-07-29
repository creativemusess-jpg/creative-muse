import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { AdminLayout, AdminPageHeader, AdminTable, AdminLoading, AdminEmpty } from "@/components/admin/AdminLayout";
import { categoriesApi } from "@/lib/api/categories";
import { uploadImage, deleteImage } from "@/lib/api/upload";
import type { CategoryRow } from "@/lib/db/types";
import { Plus, Edit3, Trash2, Upload, X, ImageOff, Loader2, Star } from "lucide-react";

import { requireAdmin } from "@/lib/auth-guard";

export const Route = createFileRoute("/admin/categories")({
  beforeLoad: requireAdmin,
  component: AdminCategories,
});

const emptyCategoryForm = {
  name: "",
  slug: "",
  description: "",
  sort_order: 0,
  featured: false,
  active: true,
  seo_title: "",
  seo_description: "",
  image: null as string | null,
  hero_image: null as string | null,
  hero_video: null as string | null,
  banner_heading: "",
  banner_description: "",
  cta_button_text: "",
  cta_link: "",
  mobile_banner: null as string | null,
  desktop_banner: null as string | null,
};

function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyCategoryForm);
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();

  const invalidateCaches = async () => {
    await queryClient.invalidateQueries({ queryKey: ["categories"] });
    await queryClient.invalidateQueries({ queryKey: ["products"] });
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await categoriesApi.list();
      setCategories(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file, "categories", "category-images");
      setForm((f) => ({ ...f, image: url }));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleMediaUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "hero_image" | "hero_video" | "mobile_banner" | "desktop_banner",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const isVideo = field === "hero_video";
      const url = await uploadImage(file, isVideo ? "categoryVideos" : "categories", isVideo ? "hero-videos" : "hero-banners");
      setForm((f) => ({
        ...f,
        [field]: url,
        ...(isVideo ? { hero_image: null } : field === "hero_image" ? { hero_video: null } : {}),
      }));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSave = async () => {
    if (!form.name || !form.slug) return;
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        slug: form.slug,
        description: form.description || null,
        sort_order: form.sort_order,
        featured: form.featured,
        active: form.active,
        seo_title: form.seo_title || null,
        seo_description: form.seo_description || null,
        image: form.image,
        hero_image: form.hero_image,
        hero_video: form.hero_video,
        banner_heading: form.banner_heading || null,
        banner_description: form.banner_description || null,
        cta_button_text: form.cta_button_text || null,
        cta_link: form.cta_link || null,
        mobile_banner: form.mobile_banner,
        desktop_banner: form.desktop_banner,
      };
      if (editing) {
        await categoriesApi.update(editing.id, payload);
      } else {
        await categoriesApi.create(payload);
      }
      setShowForm(false);
      setEditing(null);
      setForm(emptyCategoryForm);
      await invalidateCaches();
      fetchCategories();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete category "${name}"?\nProducts in this category will lose their category reference.`)) return;
    try {
      await categoriesApi.delete(id);
      await invalidateCaches();
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (cat: any) => {
    setEditing(cat);
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
      sort_order: cat.sort_order,
      featured: cat.featured,
      active: cat.active,
      seo_title: cat.seo_title || "",
      seo_description: cat.seo_description || "",
      image: cat.image || null,
      hero_image: cat.hero_image || null,
      hero_video: cat.hero_video || null,
      banner_heading: cat.banner_heading || "",
      banner_description: cat.banner_description || "",
      cta_button_text: cat.cta_button_text || "",
      cta_link: cat.cta_link || "",
      mobile_banner: cat.mobile_banner || null,
      desktop_banner: cat.desktop_banner || null,
    });
    setShowForm(true);
  };

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Categories"
        description={`${categories.length} categories`}
        actions={
          <button
            onClick={() => { setEditing(null); setForm(emptyCategoryForm); setShowForm(true); }}
            className="flex items-center gap-2 rounded-lg bg-[#1a1a2e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2d1b4e]"
          >
            <Plus className="h-4 w-4" />
            Add Category
          </button>
        }
      />

      {showForm && (
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-500">
            {editing ? "Edit Category" : "New Category"}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => {
                  setForm((f) => ({ ...f, name: e.target.value }));
                  if (!editing) setForm((f) => ({ ...f, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") }));
                }}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Slug *</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Sort Order</label>
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm((f) => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-gray-600">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={2}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Image</label>
              <div className="flex items-center gap-3">
                {form.image ? (
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    <img src={form.image} alt="Category preview" className="h-full w-full object-cover" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                    <button
                      onClick={() => setForm((f) => ({ ...f, image: null }))}
                      className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <label className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100">
                    {uploading ? <Loader2 className="h-4 w-4 animate-spin text-gray-400" /> : <Upload className="h-4 w-4 text-gray-400" />}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                )}
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Hero Image</label>
              <MediaPicker
                value={form.hero_image}
                accept="image/*"
                uploading={uploading}
                onUpload={(e) => handleMediaUpload(e, "hero_image")}
                onClear={() => setForm((f) => ({ ...f, hero_image: null }))}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Hero Video</label>
              <MediaPicker
                value={form.hero_video}
                accept="video/*"
                uploading={uploading}
                onUpload={(e) => handleMediaUpload(e, "hero_video")}
                onClear={() => setForm((f) => ({ ...f, hero_video: null }))}
                video
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Mobile Banner</label>
              <MediaPicker
                value={form.mobile_banner}
                accept="image/*"
                uploading={uploading}
                onUpload={(e) => handleMediaUpload(e, "mobile_banner")}
                onClear={() => setForm((f) => ({ ...f, mobile_banner: null }))}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Desktop Banner</label>
              <MediaPicker
                value={form.desktop_banner}
                accept="image/*"
                uploading={uploading}
                onUpload={(e) => handleMediaUpload(e, "desktop_banner")}
                onClear={() => setForm((f) => ({ ...f, desktop_banner: null }))}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Banner Heading</label>
              <input
                type="text"
                value={form.banner_heading}
                onChange={(e) => setForm((f) => ({ ...f, banner_heading: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-gray-600">Banner Description</label>
              <textarea
                value={form.banner_description}
                onChange={(e) => setForm((f) => ({ ...f, banner_description: e.target.value }))}
                rows={2}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">CTA Button Text</label>
              <input
                type="text"
                value={form.cta_button_text}
                onChange={(e) => setForm((f) => ({ ...f, cta_button_text: e.target.value }))}
                placeholder="View Collection"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">CTA Link</label>
              <input
                type="text"
                value={form.cta_link}
                onChange={(e) => setForm((f) => ({ ...f, cta_link: e.target.value }))}
                placeholder="#products"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
              />
            </div>
            <div className="flex items-end gap-6 pb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700 flex items-center gap-1"><Star className="h-3 w-3" /> Featured</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">Active</span>
              </label>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">SEO Title</label>
              <input
                type="text"
                value={form.seo_title}
                onChange={(e) => setForm((f) => ({ ...f, seo_title: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">SEO Description</label>
              <input
                type="text"
                value={form.seo_description}
                onChange={(e) => setForm((f) => ({ ...f, seo_description: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-lg bg-[#1a1a2e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2d1b4e] disabled:opacity-60"
            >
              {saving ? "Saving..." : (editing ? "Update" : "Create")}
            </button>
            <button
              onClick={() => { setShowForm(false); setEditing(null); }}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <AdminLoading />
      ) : categories.length === 0 ? (
        <AdminEmpty title="No categories" description="Create your first category to organize products" />
      ) : (
        <AdminTable headers={["Image", "Name", "Slug", "Order", "Featured", "Status", "Actions"]}>
          {categories.map((cat) => (
            <tr key={cat.id} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                <div className="h-10 w-10 overflow-hidden rounded-lg bg-gray-100">
                  {cat.image ? (
                    <img src={cat.image} alt={`${cat.name} category`} className="h-full w-full object-cover" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center"><ImageOff className="h-4 w-4 text-gray-400" /></div>
                  )}
                </div>
              </td>
              <td className="px-4 py-3 font-medium text-[#1a1a2e]">{cat.name}</td>
              <td className="px-4 py-3 text-gray-500">{cat.slug}</td>
              <td className="px-4 py-3 text-gray-500">{cat.sort_order}</td>
              <td className="px-4 py-3">
                {cat.featured ? <Star className="h-4 w-4 text-[#7A2533]" /> : "—"}
              </td>
              <td className="px-4 py-3">
                <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${cat.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {cat.active ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <button onClick={() => startEdit(cat)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100">
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(cat.id, cat.name)} className="rounded-lg p-1.5 text-red-300 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </AdminTable>
      )}
    </AdminLayout>
  );
}

function MediaPicker({
  value,
  accept,
  uploading,
  onUpload,
  onClear,
  video = false,
}: {
  value: string | null;
  accept: string;
  uploading: boolean;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  video?: boolean;
}) {
  if (value) {
    return (
      <div className="relative h-16 w-24 overflow-hidden rounded-lg bg-gray-100">
        {video ? (
          <video src={value} className="h-full w-full object-cover" muted playsInline />
        ) : (
          <img src={value} alt="Banner preview" className="h-full w-full object-cover" onError={(e) => { e.currentTarget.style.display = "none"; }} />
        )}
        <button
          type="button"
          onClick={onClear}
          className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    );
  }
  return (
    <label className="flex h-16 w-24 cursor-pointer items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100">
      {uploading ? <Loader2 className="h-4 w-4 animate-spin text-gray-400" /> : <Upload className="h-4 w-4 text-gray-400" />}
      <input type="file" accept={accept} onChange={onUpload} className="hidden" />
    </label>
  );
}
