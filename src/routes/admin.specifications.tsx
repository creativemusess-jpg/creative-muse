import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout, AdminPageHeader, AdminLoading, AdminEmpty } from "@/components/admin/AdminLayout";
import { specificationsApi } from "@/lib/api/specifications";
import { Plus, Edit3, Trash2, GripVertical, ListChecks } from "lucide-react";

import { requireAdmin } from "@/lib/auth-guard";

export const Route = createFileRoute("/admin/specifications")({
  beforeLoad: requireAdmin,
  component: AdminSpecifications,
});

function AdminSpecifications() {
  const [defs, setDefs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    field_type: "text",
    options: "",
    placeholder: "",
    is_required: false,
    is_active: true,
    sort_order: 0,
  });
  const [optionsList, setOptionsList] = useState<string[]>([]);
  const [optionInput, setOptionInput] = useState("");

  const fetch = async () => {
    setLoading(true);
    try {
      const data = await specificationsApi.listDefinitions();
      setDefs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const resetForm = () => {
    setForm({ name: "", slug: "", description: "", field_type: "text", options: "", placeholder: "", is_required: false, is_active: true, sort_order: 0 });
    setOptionsList([]);
    setOptionInput("");
    setEditing(null);
  };

  const openEdit = (def: any) => {
    const opts = Array.isArray(def.options) ? def.options : [];
    setForm({
      name: def.name, slug: def.slug, description: def.description || "",
      field_type: def.field_type, options: "", placeholder: def.placeholder || "",
      is_required: def.is_required, is_active: def.is_active, sort_order: def.sort_order,
    });
    setOptionsList(opts);
    setEditing(def);
    setShowForm(true);
  };

  const addOption = () => {
    const val = optionInput.trim();
    if (val && !optionsList.includes(val)) {
      setOptionsList([...optionsList, val]);
    }
    setOptionInput("");
  };

  const removeOption = (idx: number) => {
    setOptionsList(optionsList.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    if (!form.name || !form.slug) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        description: form.description || null,
        placeholder: form.placeholder || null,
        options: optionsList,
      };
      if (editing) {
        await specificationsApi.updateDefinition(editing.id, payload);
      } else {
        await specificationsApi.createDefinition(payload);
      }
      setShowForm(false);
      resetForm();
      fetch();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete specification "${name}"?`)) return;
    try {
      await specificationsApi.deleteDefinition(id);
      fetch();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Product Specifications"
        description={`${defs.length} specification definitions`}
        actions={
          <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 rounded-lg bg-[#1a1a2e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2d1b4e]">
            <Plus className="h-4 w-4" /> Add Specification
          </button>
        }
      />

      {showForm && (
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-bold text-[#1a1a2e]">{editing ? "Edit Specification" : "New Specification"}</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-600">Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: editing ? form.slug : e.target.value.toLowerCase().replace(/\s+/g, "-") })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#9C544D]" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-600">Slug</label>
              <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#9C544D]" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-600">Field Type</label>
              <select value={form.field_type} onChange={(e) => setForm({ ...form, field_type: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#9C544D]">
                <option value="text">Text</option>
                <option value="dropdown">Dropdown</option>
                <option value="number">Number</option>
                <option value="boolean">Boolean</option>
                <option value="date">Date</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-600">Description</label>
              <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#9C544D]" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-600">Placeholder</label>
              <input value={form.placeholder} onChange={(e) => setForm({ ...form, placeholder: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#9C544D]" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-600">Sort Order</label>
              <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#9C544D]" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-600">Required</label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.is_required} onChange={(e) => setForm({ ...form, is_required: e.target.checked })} className="rounded" />
                Required
              </label>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-600">Active</label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="rounded" />
                Active
              </label>
            </div>
          </div>

          {(form.field_type === "dropdown") && (
            <div className="mt-4">
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-600">Dropdown Options</label>
              <div className="flex items-center gap-2 mb-2">
                <input value={optionInput} onChange={(e) => setOptionInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addOption(); } }} className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#9C544D]" placeholder="Type an option and press Enter or Add" />
                <button onClick={addOption} className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200">Add</button>
              </div>
              {optionsList.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {optionsList.map((opt, i) => (
                    <span key={i} className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                      {opt}
                      <button onClick={() => removeOption(i)} className="text-gray-400 hover:text-red-500">&times;</button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="mt-4 flex items-center gap-3">
            <button onClick={handleSave} disabled={saving} className="rounded-lg bg-[#1a1a2e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2d1b4e] disabled:opacity-50">
              {saving ? "Saving..." : editing ? "Update" : "Create"}
            </button>
            <button onClick={() => { setShowForm(false); resetForm(); }} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50">
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <AdminLoading />
      ) : defs.length === 0 ? (
        <AdminEmpty title="No specifications yet" description="Create specification definitions for your products." />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-600">Order</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-600">Name</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-600">Type</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-600">Options</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-600">Status</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {defs.map((d) => (
                <tr key={d.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-400"><GripVertical className="h-4 w-4" /></td>
                  <td className="px-4 py-3 font-medium text-[#1a1a2e]">{d.name}</td>
                  <td className="px-4 py-3"><span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600 uppercase">{d.field_type}</span></td>
                  <td className="px-4 py-3 text-gray-500">
                    {Array.isArray(d.options) && d.options.length > 0
                      ? d.options.slice(0, 3).join(", ") + (d.options.length > 3 ? ` +${d.options.length - 3}` : "")
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${d.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                      {d.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(d)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"><Edit3 className="h-4 w-4" /></button>
                      <button onClick={() => handleDelete(d.id, d.name)} className="rounded-lg p-1.5 text-red-300 hover:bg-red-50 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
