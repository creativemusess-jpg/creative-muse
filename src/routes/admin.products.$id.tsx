import { useState, useEffect } from "react";
import { createFileRoute, useParams, useNavigate, Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { AdminLayout, AdminPageHeader, AdminLoading } from "@/components/admin/AdminLayout";
import { PublishControl } from "@/components/admin/PublishControl";
import { productsApi, type ProductWithImages, type ProductFormData } from "@/lib/api/products";
import { categoriesApi } from "@/lib/api/categories";
import { subcategoriesApi } from "@/lib/api/subcategories";
import { uploadImage } from "@/lib/api/upload";
import { productFlagsApi } from "@/lib/api/product-flags";
import { attributesApi } from "@/lib/api/attributes";
import { Upload, X, Loader2, ImageOff, Plus, Trash2, GripVertical } from "lucide-react";

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
  const [attrDefs, setAttrDefs] = useState<any[]>([]);
  const [productAttrs, setProductAttrs] = useState<{ defId: string; value: string; name: string }[]>([]);
  const [allFlags, setAllFlags] = useState<any[]>([]);
  const [selectedFlagIds, setSelectedFlagIds] = useState<string[]>([]);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      productsApi.getWithImages(id),
      categoriesApi.list(true),
    ]).then(([p, cats]) => {
      if (cancelled) return;
      if (p) {
        setProduct(p);
        setForm({
          name: p.name,
          slug: p.slug,
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
          publish_at: p.publish_at || null,
        });
      }
      setCategories(cats);
      setLoading(false);
    }).catch(() => { setLoading(false); });

    Promise.all([
      attributesApi.listDefinitions(),
      productFlagsApi.list(),
      attributesApi.getByProduct(id),
      productFlagsApi.getByProduct(id),
    ]).then(([defs, flags, existingAttrs, existingFlags]) => {
      if (cancelled) return;
      setAttrDefs(defs || []);
      setAllFlags(flags || []);
      if (existingFlags) setSelectedFlagIds(existingFlags.map((f: any) => f.id));
      setProductAttrs((existingAttrs || []).map((a: any) => ({
        defId: a.attribute_definition_id,
        value: a.value,
        name: a.attribute_definition?.name || "",
      })));
    }).catch(() => {});

    return () => { cancelled = true; };
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

  const handlePublishChange = (p: { status: string; publish_at: string | null }) => {
    setForm((prev) => prev ? { ...prev, status: p.status, publish_at: p.publish_at } : prev);
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
      const updated = await productsApi.update(id, form);
      if (updated) {
        setProduct(updated);
        setForm((prev) => prev ? {
          ...prev,
          main_image_url: updated.main_image?.url || prev.main_image_url,
          gallery_images: (updated.images || []).filter((img) => !img.is_main).map((img) => img.url),
        } : prev);
      }
      await productFlagsApi.setProductFlags(id, selectedFlagIds);

      // Auto-create attribute definitions for free-text names
      const nameToId: Record<string, string> = {};
      for (const row of productAttrs) {
        if (row.defId && row.value.trim() && !row.name && !nameToId[row.defId]) {
          const existing = attrDefs.find((d) => d.name.toLowerCase() === row.defId.toLowerCase());
          if (existing) {
            nameToId[row.defId] = existing.id;
          } else {
            const slug = row.defId.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
            try {
              const created = await attributesApi.createDefinition({ name: row.defId, slug, field_type: "text", options: [], is_active: true, sort_order: 0 });
              nameToId[row.defId] = created.id;
            } catch { /* ignore */ }
          }
        }
      }

      const allAttrs = productAttrs
        .filter((r) => r.defId && r.value.trim())
        .map((r, i) => ({
          attribute_definition_id: r.name ? r.defId : (nameToId[r.defId] || r.defId),
          value: r.value.trim(),
          sort_order: i,
        }));
      await attributesApi.setProductAttributes(id, allAttrs);

      await queryClient.invalidateQueries({ queryKey: ["products"] });
      await queryClient.invalidateQueries({ queryKey: ["product"] });
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
      await queryClient.invalidateQueries({ queryKey: ["products", "published", "storefront"] });
      // Refresh attributes, definitions & flags after save
      const [freshAttrs, freshDefs, freshFlags] = await Promise.all([
        attributesApi.getByProduct(id),
        attributesApi.listDefinitions(),
        productFlagsApi.getByProduct(id),
      ]);
      setAttrDefs(freshDefs || []);
      setSelectedFlagIds(freshFlags.map((f: any) => f.id));
      setProductAttrs((freshAttrs || []).map((a: any) => ({
        defId: a.attribute_definition_id,
        value: a.value,
        name: a.attribute_definition?.name || "",
      })));
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
        description={`ID: ${product.id}`}
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
                <input type="text" value={form.name} onChange={(e) => handleChange("name", e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#7A2533]" required />
              </Field>

            </div>
            <Field label="Slug" required>
              <input type="text" value={form.slug} onChange={(e) => handleChange("slug", e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#7A2533]" required />
            </Field>
            <Field label="Category">
              <select
                value={form.category_ids?.[0] || ""}
                onChange={(e) => {
                  handleChange("category_ids", e.target.value ? [e.target.value] : []);
                  handleChange("subcategory_id", null);
                }}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#7A2533]"
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
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#7A2533]"
                disabled={!form.category_ids?.[0]}
              >
                <option value="">{form.category_ids?.[0] ? "Select subcategory" : "Select a category first"}</option>
                {subcategories.map((s: any) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Short Description">
              <textarea value={form.short_description || ""} onChange={(e) => handleChange("short_description", e.target.value)} rows={3} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#7A2533]" />
            </Field>
            <Field label="Full Description">
              <textarea value={form.full_description || ""} onChange={(e) => handleChange("full_description", e.target.value)} rows={6} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#7A2533]" />
            </Field>
          </Section>

          <Section title="Pricing">
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Current Price (₹)" required>
                <input type="number" value={form.current_price || ""} onChange={(e) => handleChange("current_price", Number(e.target.value))} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#7A2533]" required min="0" />
              </Field>
              <Field label="Original Price (₹)">
                <input type="number" value={form.original_price || ""} onChange={(e) => handleChange("original_price", Number(e.target.value))} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#7A2533]" min="0" />
              </Field>
              <Field label="Badge">
                <select value={form.badge || ""} onChange={(e) => handleChange("badge", e.target.value || null)} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#7A2533]">
                  <option value="">None</option>
                  <option value="New">New</option>
                  <option value="Best Seller">Best Seller</option>
                  <option value="Trending">Trending</option>
                  <option value="Wedding">Wedding</option>
                </select>
              </Field>
            </div>
          </Section>

          <Section title="Attributes">
            <p className="mb-3 text-xs text-gray-400">Add unlimited product attributes. Existing attributes show with a label; type a new name to create a new attribute.</p>
            {productAttrs.map((row, i) => (
              <div key={i} className="mb-2 flex items-center gap-2">
                <span className="cursor-grab text-gray-300"><GripVertical className="h-4 w-4" /></span>
                {row.name && attrDefs.find((d) => d.id === row.defId) ? (
                  <span className="flex-1 text-sm font-medium text-gray-700">{row.name}</span>
                ) : (
                  <input
                    type="text"
                    value={row.defId}
                    onChange={(e) => {
                      const next = [...productAttrs];
                      next[i].defId = e.target.value;
                      setProductAttrs(next);
                    }}
                    placeholder="Attribute name"
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#7A2533]"
                  />
                )}
                <input
                  type="text"
                  value={row.value}
                  onChange={(e) => {
                    const next = [...productAttrs];
                    next[i].value = e.target.value;
                    setProductAttrs(next);
                  }}
                  placeholder={row.name ? `Enter ${row.name.toLowerCase()}` : "Value"}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#7A2533]"
                />
                <button type="button" onClick={() => setProductAttrs(productAttrs.filter((_, j) => j !== i))} className="rounded-lg p-2 text-red-400 hover:bg-red-50 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setProductAttrs([...productAttrs, { defId: "", value: "", name: "" }])}
              className="mt-3 flex items-center gap-1 text-sm font-medium text-[#7A2533] hover:text-[#7A2533]"
            >
              <Plus className="h-3.5 w-3.5" /> Add Attribute
            </button>
            {attrDefs.length > 0 && (
              <p className="mt-2 text-xs text-gray-400">Tip: Manage reusable attribute definitions in <Link to="/admin/attributes" className="text-[#7A2533] hover:underline">Attributes</Link>.</p>
            )}
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
            <PublishControl status={form.status} publish_at={form.publish_at} onChange={handlePublishChange} />
          </Section>

          <Section title="Inventory">
            <Field label="Stock Quantity">
              <input type="number" value={form.stock_quantity ?? ""} onChange={(e) => handleChange("stock_quantity", parseInt(e.target.value) || 0)} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#7A2533]" min="0" />
            </Field>
            <Field label="Low Stock Threshold">
              <input type="number" value={form.low_stock_threshold ?? 5} onChange={(e) => handleChange("low_stock_threshold", parseInt(e.target.value) || 5)} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#7A2533]" min="0" />
            </Field>
          </Section>

          <Section title="Flags">
            {allFlags.filter((f) => f.status === "active").map((flag) => (
              <label key={flag.id} className="flex items-center gap-3 py-1.5">
                <input
                  type="checkbox"
                  checked={selectedFlagIds.includes(flag.id)}
                  onChange={(e) => {
                    if (e.target.checked) setSelectedFlagIds([...selectedFlagIds, flag.id]);
                    else setSelectedFlagIds(selectedFlagIds.filter((id) => id !== flag.id));
                  }}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">{flag.name}</span>
                {flag.badge_label && (
                  <span className="rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider" style={{ backgroundColor: flag.badge_bg_color, color: flag.badge_text_color }}>
                    {flag.badge_label}
                  </span>
                )}
              </label>
            ))}
            <Link to="/admin/product-flags" className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-[#7A2533] hover:text-[#7A2533]">
              Manage Flags →
            </Link>
          </Section>

          <Section title="Tags">
            <input type="text" placeholder="Separate tags with commas" value={(form.tags || []).join(", ")} onChange={(e) => handleChange("tags", e.target.value.split(",").map((t) => t.trim()).filter(Boolean))} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#7A2533]" />
          </Section>

          <Section title="SEO">
            <Field label="SEO Title">
              <input type="text" value={form.seo_title || ""} onChange={(e) => handleChange("seo_title", e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#7A2533]" />
            </Field>
            <Field label="SEO Description">
              <textarea value={form.seo_description || ""} onChange={(e) => handleChange("seo_description", e.target.value)} rows={2} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#7A2533]" />
            </Field>
            <Field label="Focus Keyword">
              <input type="text" value={form.focus_keyword || ""} onChange={(e) => handleChange("focus_keyword", e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#7A2533]" placeholder="e.g. gold necklace" />
            </Field>
            <Field label="Canonical URL">
              <input type="text" value={form.canonical_url || ""} onChange={(e) => handleChange("canonical_url", e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#7A2533]" placeholder="https://example.com/product/slug" />
            </Field>
            <Field label="Social Image URL">
              <input type="text" value={form.social_image || ""} onChange={(e) => handleChange("social_image", e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#7A2533]" placeholder="Open Graph image URL" />
            </Field>
            <Field label="Image Alt Text">
              <input type="text" value={form.image_alt_text || ""} onChange={(e) => handleChange("image_alt_text", e.target.value)} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#7A2533]" placeholder="Descriptive alt text for main image" />
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
