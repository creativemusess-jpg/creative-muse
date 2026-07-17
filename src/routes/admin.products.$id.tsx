import { useState, useEffect } from "react";
import { createFileRoute, useParams, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { AdminLayout, AdminPageHeader, AdminLoading } from "@/components/admin/AdminLayout";
import { productsApi, type ProductWithImages, type ProductFormData } from "@/lib/api/products";
import { categoriesApi } from "@/lib/api/categories";
import { subcategoriesApi } from "@/lib/api/subcategories";
import { uploadImage } from "@/lib/api/upload";
import { Upload, X, Loader2, ImageOff } from "lucide-react";

import { requireAdmin } from "@/lib/auth-guard";

export const Route = createFileRoute("/admin/products/$id")({
  beforeLoad: requireAdmin,
  component: EditProductPage,
});

function EditProductPage() {
  const { id } = useParams({ from: "/admin/products/$id" });
  const [product, setProduct] = useState<ProductWithImages | null>(null);
  const [form, setForm] = useState<ProductFormData | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    Promise.all([
      productsApi.getWithImages(id),
      categoriesApi.list(true),
    ]).then(([p, cats]) => {
      if (p) {
        setProduct(p);
        setForm({
          name: p.name,
          slug: p.slug,
          sku: p.sku || "",
          short_description: p.short_description || "",
          full_description: p.full_description || "",
          current_price: p.current_price,
          original_price: p.original_price || undefined,
          cost_price: p.cost_price || undefined,
          badge: p.badge,
          status: p.status,
          stock_quantity: p.stock_quantity || 0,
          low_stock_threshold: p.low_stock_threshold || 5,
          material: p.material || "",
          metal_type: p.metal_type || "",
          metal_colour: p.metal_colour || "",
          gold_purity: p.gold_purity || "",
          gross_weight: p.gross_weight || "",
          gemstone: p.gemstone || "",
          certification_type: p.certification_type || "",
          certification_number: (p as any).certification_number || "",
          featured: p.featured,
          best_seller: p.best_seller,
          new_arrival: p.new_arrival,
          trending: p.trending,
          wedding: p.wedding,
          seo_title: p.seo_title || "",
          seo_description: p.seo_description || "",
          focus_keyword: p.focus_keyword || "",
          canonical_url: p.canonical_url || "",
          social_image: p.social_image || "",
          image_alt_text: p.image_alt_text || "",
          tags: p.tags || [],
          category_ids: p.category_ids || [],
          subcategory_id: p.subcategory_id || null,
          main_image_url: p.main_image?.url || "",
          gallery_images: (p.images || []).filter((img) => !img.is_main).map((img) => img.url),
        });
      }
      setCategories(cats);
      setLoading(false);
    });
  }, [id]);

  useEffect(() => {
    const catId = form?.category_ids?.[0];
    if (catId) {
      subcategoriesApi.listByCategory(catId, true).then(setSubcategories).catch(() => {});
    } else {
      setSubcategories([]);
    }
  }, [form?.category_ids]);

  const handleChange = (field: keyof ProductFormData, value: any) => {
    setForm((prev) => prev ? { ...prev, [field]: value } : prev);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !form) return;
    setUploading(true);
    try {
      const url = await uploadImage(file, "products", "main");
      handleChange("main_image_url", url);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0 || !form) return;
    setUploading(true);
    try {
      const urls = await Promise.all(files.map((f) => uploadImage(f, "products", "gallery")));
      handleChange("gallery_images", [...(form.gallery_images || []), ...urls]);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form || !form.name || !form.slug) return;
    setSaving(true);
    try {
      await productsApi.update(id, form);
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      await queryClient.invalidateQueries({ queryKey: ["product"] });
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
      navigate({ to: "/admin/products" });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <AdminLayout><AdminLoading /></AdminLayout>;
  if (!product || !form) return <AdminLayout><p>Product not found</p></AdminLayout>;

  return (
    <AdminLayout>
      <AdminPageHeader
        title={`Edit: ${product.name}`}
        description={`ID: ${product.id} · SKU: ${product.sku || "—"}`}
        actions={
          <button
            type="submit"
            form="edit-product-form"
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-[#1a1a2e] px-6 py-2 text-sm font-semibold text-white hover:bg-[#2d1b4e] disabled:opacity-60"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        }
      />

      <form id="edit-product-form" onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Section title="General">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Product Name" required>
                <input type="text" value={form.name} onChange={(e) => handleChange("name", e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#c9a96e]" required />
              </Field>
              <Field label="SKU">
                <input type="text" value={form.sku || ""} onChange={(e) => handleChange("sku", e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#c9a96e]" />
              </Field>
            </div>
            <Field label="Slug" required>
              <input type="text" value={form.slug} onChange={(e) => handleChange("slug", e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#c9a96e]" required />
            </Field>
            <Field label="Category">
              <select
                value={form.category_ids?.[0] || ""}
                onChange={(e) => {
                  handleChange("category_ids", e.target.value ? [e.target.value] : []);
                  handleChange("subcategory_id", null);
                }}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#c9a96e]"
              >
                <option value="">Select category</option>
                {categories.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Subcategory">
              <select
                value={form.subcategory_id || ""}
                onChange={(e) => handleChange("subcategory_id", e.target.value || null)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#c9a96e]"
                disabled={!form.category_ids?.[0]}
              >
                <option value="">{form.category_ids?.[0] ? "Select subcategory" : "Select a category first"}</option>
                {subcategories.map((s: any) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Short Description">
              <textarea value={form.short_description || ""} onChange={(e) => handleChange("short_description", e.target.value)} rows={3} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#c9a96e]" />
            </Field>
            <Field label="Full Description">
              <textarea value={form.full_description || ""} onChange={(e) => handleChange("full_description", e.target.value)} rows={6} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#c9a96e]" />
            </Field>
          </Section>

          <Section title="Pricing">
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Current Price (₹)" required>
                <input type="number" value={form.current_price || ""} onChange={(e) => handleChange("current_price", Number(e.target.value))} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#c9a96e]" required min="0" />
              </Field>
              <Field label="Original Price (₹)">
                <input type="number" value={form.original_price || ""} onChange={(e) => handleChange("original_price", Number(e.target.value))} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#c9a96e]" min="0" />
              </Field>
              <Field label="Badge">
                <select value={form.badge || ""} onChange={(e) => handleChange("badge", e.target.value || null)} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#c9a96e]">
                  <option value="">None</option>
                  <option value="New">New</option>
                  <option value="Best Seller">Best Seller</option>
                  <option value="Trending">Trending</option>
                  <option value="Wedding">Wedding</option>
                </select>
              </Field>
            </div>
          </Section>

          <Section title="Material">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Metal Type">
                <select value={form.metal_type || ""} onChange={(e) => handleChange("metal_type", e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#c9a96e]">
                  <option value="">Select</option>
                  <option value="Gold">Gold</option>
                  <option value="Platinum">Platinum</option>
                  <option value="Silver">Silver</option>
                </select>
              </Field>
              <Field label="Metal Colour">
                <select value={form.metal_colour || ""} onChange={(e) => handleChange("metal_colour", e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#c9a96e]">
                  <option value="">Select</option>
                  <option value="Yellow Gold">Yellow Gold</option>
                  <option value="White Gold">White Gold</option>
                  <option value="Rose Gold">Rose Gold</option>
                  <option value="Platinum">Platinum</option>
                </select>
              </Field>
              <Field label="Gold Purity">
                <input type="text" value={form.gold_purity || ""} onChange={(e) => handleChange("gold_purity", e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#c9a96e]" />
              </Field>
              <Field label="Gemstone">
                <input type="text" value={form.gemstone || ""} onChange={(e) => handleChange("gemstone", e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#c9a96e]" />
              </Field>
              <Field label="Gross Weight">
                <input type="text" value={form.gross_weight || ""} onChange={(e) => handleChange("gross_weight", e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#c9a96e]" />
              </Field>
              <Field label="Certification">
                <input type="text" value={form.certification_type || ""} onChange={(e) => handleChange("certification_type", e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#c9a96e]" />
              </Field>
              <Field label="Certification Number">
                <input type="text" value={(form as any).certification_number || ""} onChange={(e) => handleChange("certification_number", e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#c9a96e]" />
              </Field>
              <Field label="Material">
                <input type="text" value={form.material || ""} onChange={(e) => handleChange("material", e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#c9a96e]" />
              </Field>
            </div>
          </Section>

          <Section title="Media">
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Main Image</label>
                <div className="flex items-start gap-4">
                  {form.main_image_url ? (
                    <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                      <img src={form.main_image_url} alt="Main" className="h-full w-full object-cover" />
                      <button type="button" onClick={() => handleChange("main_image_url", "")} className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex h-32 w-32 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100">
                      {uploading ? <Loader2 className="h-6 w-6 animate-spin text-gray-400" /> : <><Upload className="h-6 w-6 text-gray-400" /><span className="mt-1 text-[10px] text-gray-500">Upload</span></>}
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Gallery Images</label>
                <div className="flex flex-wrap gap-3">
                  {(form.gallery_images || []).map((url, i) => (
                    <div key={i} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                      <img src={url} alt={`Gallery ${i + 1}`} className="h-full w-full object-cover" />
                      <button type="button" onClick={() => handleChange("gallery_images", (form.gallery_images || []).filter((_, j) => j !== i))} className="absolute top-0.5 right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  <label className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100">
                    {uploading ? <Loader2 className="h-5 w-5 animate-spin text-gray-400" /> : <Upload className="h-5 w-5 text-gray-400" />}
                    <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} className="hidden" />
                  </label>
                </div>
              </div>
            </div>
          </Section>
        </div>

        <div className="space-y-6">
          <Section title="Status">
            <select value={form.status} onChange={(e) => handleChange("status", e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#c9a96e]">
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="out_of_stock">Out of Stock</option>
              <option value="archived">Archived</option>
            </select>
          </Section>

          <Section title="Inventory">
            <Field label="Stock Quantity">
              <input type="number" value={form.stock_quantity ?? ""} onChange={(e) => handleChange("stock_quantity", parseInt(e.target.value) || 0)} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#c9a96e]" min="0" />
            </Field>
            <Field label="Low Stock Threshold">
              <input type="number" value={form.low_stock_threshold ?? 5} onChange={(e) => handleChange("low_stock_threshold", parseInt(e.target.value) || 5)} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#c9a96e]" min="0" />
            </Field>
          </Section>

          <Section title="Flags">
            {(["featured", "best_seller", "new_arrival", "trending", "wedding"] as const).map((flag) => (
              <label key={flag} className="flex items-center gap-3 py-1.5">
                <input type="checkbox" checked={form[flag] || false} onChange={(e) => handleChange(flag, e.target.checked)} className="rounded border-gray-300" />
                <span className="text-sm text-gray-700 capitalize">{flag.replace(/_/g, " ")}</span>
              </label>
            ))}
          </Section>

          <Section title="Tags">
            <input type="text" placeholder="Separate tags with commas" value={(form.tags || []).join(", ")} onChange={(e) => handleChange("tags", e.target.value.split(",").map((t) => t.trim()).filter(Boolean))} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#c9a96e]" />
          </Section>

          <Section title="SEO">
            <Field label="SEO Title">
              <input type="text" value={form.seo_title || ""} onChange={(e) => handleChange("seo_title", e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#c9a96e]" />
            </Field>
            <Field label="SEO Description">
              <textarea value={form.seo_description || ""} onChange={(e) => handleChange("seo_description", e.target.value)} rows={2} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#c9a96e]" />
            </Field>
            <Field label="Focus Keyword">
              <input type="text" value={form.focus_keyword || ""} onChange={(e) => handleChange("focus_keyword", e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#c9a96e]" placeholder="e.g. gold necklace" />
            </Field>
            <Field label="Canonical URL">
              <input type="text" value={form.canonical_url || ""} onChange={(e) => handleChange("canonical_url", e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#c9a96e]" placeholder="https://example.com/product/slug" />
            </Field>
            <Field label="Social Image URL">
              <input type="text" value={form.social_image || ""} onChange={(e) => handleChange("social_image", e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#c9a96e]" placeholder="Open Graph image URL" />
            </Field>
            <Field label="Image Alt Text">
              <input type="text" value={form.image_alt_text || ""} onChange={(e) => handleChange("image_alt_text", e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#c9a96e]" placeholder="Descriptive alt text for main image" />
            </Field>
          </Section>

          <Section title="Product Info">
            <div className="space-y-2 text-sm text-gray-500">
              <p>Created: {new Date(product.created_at).toLocaleDateString()}</p>
              <p>Updated: {new Date(product.updated_at).toLocaleDateString()}</p>
              <p>Rating: {product.rating_average} ({product.review_count} reviews)</p>
            </div>
          </Section>
        </div>
      </form>
    </AdminLayout>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-500">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">{label} {required && <span className="text-red-500">*</span>}</label>
      {children}
    </div>
  );
}
