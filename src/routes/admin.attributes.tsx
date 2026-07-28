import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminLayout, AdminPageHeader, AdminLoading } from "@/components/admin/AdminLayout";
import { attributesApi } from "@/lib/api/attributes";
import { categoriesApi } from "@/lib/api/categories";
import { Plus, Pencil, Trash2, Search, Loader2, ChevronUp, ChevronDown, X } from "lucide-react";
import { requireAdmin } from "@/lib/auth-guard";

export const Route = createFileRoute("/admin/attributes")({
  beforeLoad: requireAdmin,
  component: AdminAttributesPage,
});

const FIELD_TYPES = [
  { value: "text", label: "Text" },
  { value: "number", label: "Number" },
  { value: "dropdown", label: "Dropdown" },
  { value: "boolean", label: "Boolean" },
  { value: "date", label: "Date" },
  { value: "color", label: "Color" },
  { value: "url", label: "URL" },
  { value: "multi_select", label: "Multi Select" },
  { value: "single_select", label: "Single Select" },
  { value: "measurement", label: "Measurement" },
];

const initForm = () => ({
  name: "",
  slug: "",
  description: "",
  field_type: "text",
  options: [] as string[],
  placeholder: "",
  is_required: false,
  is_active: true,
  sort_order: 0,
  category_id: "",
  use_as_filter: false,
  show_in_product_list: false,
  is_searchable: false,
});

function AdminAttributesPage() {
  const [defs, setDefs] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState<any>(initForm());
  const [search, setSearch] = useState("");
  const [optionInput, setOptionInput] = useState("");

  useEffect(() => {
    Promise.all([
      attributesApi.listDefinitions(),
      categoriesApi.list(),
    ]).then(([d, c]) => {
      setDefs(d);
      setCategories(c);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const refresh = () => attributesApi.listDefinitions().then(setDefs);

  const handleEdit = (def: any) => {
    setEditing(def);
    setForm({
      name: def.name,
      slug: def.slug,
      description: def.description || "",
      field_type: def.field_type,
      options: (def.options || []).filter((o: string) => o),
      placeholder: def.placeholder || "",
      is_required: def.is_required,
      is_active: def.is_active,
      sort_order: def.sort_order,
      category_id: def.category_id || "",
      use_as_filter: def.use_as_filter,
      show_in_product_list: def.show_in_product_list,
      is_searchable: def.is_searchable,
    });
    setOptionInput("");
  };

  const handleNew = () => {
    setEditing(null);
    setForm(initForm());
    setOptionInput("");
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        options: ["dropdown", "multi_select", "single_select", "measurement"].includes(form.field_type)
          ? form.options
          : [],
        category_id: form.category_id || null,
      };
      if (editing) {
        await attributesApi.updateDefinition(editing.id, payload);
      } else {
        await attributesApi.createDefinition(payload);
      }
      await refresh();
      setEditing(null);
      setForm(initForm());
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this attribute definition? This will remove all values from products.")) return;
    try {
      await attributesApi.deleteDefinition(id);
      await refresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const moveItem = (index: number, dir: -1 | 1) => {
    if (index + dir < 0 || index + dir >= defs.length) return;
    const next = [...defs];
    [next[index], next[index + dir]] = [next[index + dir], next[index]];
    setDefs(next);
    next.forEach((d, i) => {
      attributesApi.updateDefinition(d.id, { sort_order: i }).catch(() => {});
    });
  };

  const addOption = () => {
    const val = optionInput.trim();
    if (val && !form.options.includes(val)) {
      setForm({ ...form, options: [...form.options, val] });
    }
    setOptionInput("");
  };

  const removeOption = (val: string) => {
    setForm({ ...form, options: form.options.filter((o: string) => o !== val) });
  };

  const filtered = defs.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.slug.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <AdminLayout><AdminLoading /></AdminLayout>;

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Attributes"
        description="Manage product attribute definitions"
        actions={
          <button
            onClick={handleNew}
            className="flex items-center gap-2 rounded-lg bg-[#1a1a2e] px-5 py-2 text-sm font-semibold text-white hover:bg-[#2d1b4e]"
          >
            <Plus className="h-4 w-4" /> New Attribute
          </button>
        }
      />

      <div className="mb-6 flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5">
        <Search className="h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search attributes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-sm outline-none"
        />
      </div>

      {/* Edit/Create Panel */}
      {editing !== undefined && (
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-500">
            {editing ? "Edit Attribute" : "New Attribute"}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Name *</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: editing ? form.slug : e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#c9a96e]" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Slug</label>
              <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#c9a96e]" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Field Type</label>
              <select value={form.field_type} onChange={(e) => setForm({ ...form, field_type: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#c9a96e]">
                {FIELD_TYPES.map((ft) => <option key={ft.value} value={ft.value}>{ft.label}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Category (optional)</label>
              <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#c9a96e]">
                <option value="">All Categories</option>
                {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Placeholder</label>
              <input type="text" value={form.placeholder} onChange={(e) => setForm({ ...form, placeholder: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#c9a96e]" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Sort Order</label>
              <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#c9a96e]" />
            </div>
          </div>

          {/* Options for dropdown/multi/single/measurement */}
          {["dropdown", "multi_select", "single_select", "measurement"].includes(form.field_type) && (
            <div className="mt-4">
              <label className="mb-1 block text-xs font-medium text-gray-600">
                {form.field_type === "measurement" ? "Units" : "Options"}
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {form.options.map((opt: string) => (
                  <span key={opt} className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-700">
                    {opt}
                    <button onClick={() => removeOption(opt)} className="text-gray-400 hover:text-red-500"><X className="h-3 w-3" /></button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input type="text" value={optionInput} onChange={(e) => setOptionInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addOption())} placeholder="Type and press Enter" className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#c9a96e]" />
                <button onClick={addOption} className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200">Add</button>
              </div>
            </div>
          )}

          {/* Checkboxes */}
          <div className="mt-4 flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={form.is_required} onChange={(e) => setForm({ ...form, is_required: e.target.checked })} className="rounded" /> Required
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="rounded" /> Active
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={form.use_as_filter} onChange={(e) => setForm({ ...form, use_as_filter: e.target.checked })} className="rounded" /> Use as Filter
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={form.show_in_product_list} onChange={(e) => setForm({ ...form, show_in_product_list: e.target.checked })} className="rounded" /> Show in List
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={form.is_searchable} onChange={(e) => setForm({ ...form, is_searchable: e.target.checked })} className="rounded" /> Searchable
            </label>
          </div>

          <div className="mt-4 flex gap-3">
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 rounded-lg bg-[#1a1a2e] px-5 py-2 text-sm font-semibold text-white hover:bg-[#2d1b4e] disabled:opacity-60">
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {editing ? "Update" : "Create"}
            </button>
            <button onClick={() => { setEditing(undefined); setForm(initForm()); }} className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
              <th className="px-4 py-3 w-16">Order</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Filter</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((d, i) => (
              <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-0.5">
                    <button onClick={() => moveItem(i, -1)} disabled={i === 0} className="rounded p-0.5 text-gray-400 hover:text-gray-600 disabled:opacity-30"><ChevronUp className="h-3.5 w-3.5" /></button>
                    <button onClick={() => moveItem(i, 1)} disabled={i === filtered.length - 1} className="rounded p-0.5 text-gray-400 hover:text-gray-600 disabled:opacity-30"><ChevronDown className="h-3.5 w-3.5" /></button>
                  </div>
                </td>
                <td className="px-4 py-3 font-medium text-gray-800">{d.name}
                  <span className="ml-2 text-xs text-gray-400">{d.slug}</span>
                </td>
                <td className="px-4 py-3 text-gray-600">{FIELD_TYPES.find((ft) => ft.value === d.field_type)?.label || d.field_type}</td>
                <td className="px-4 py-3 text-gray-600">
                  {d.category_id ? categories.find((c: any) => c.id === d.category_id)?.name || "—" : "All"}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${d.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                    {d.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600">{d.use_as_filter ? "Yes" : "—"}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => handleEdit(d)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => handleDelete(d.id)} className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-400">No attributes found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
