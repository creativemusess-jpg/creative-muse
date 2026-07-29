import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout, AdminPageHeader, AdminLoading, AdminEmpty } from "@/components/admin/AdminLayout";
import { productFlagsApi } from "@/lib/api/product-flags";
import { Plus, Edit3, Trash2, GripVertical, Flag } from "lucide-react";

import { requireAdmin } from "@/lib/auth-guard";

export const Route = createFileRoute("/admin/product-flags")({
  beforeLoad: requireAdmin,
  component: AdminProductFlags,
});

function AdminProductFlags() {
  const [flags, setFlags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    badge_label: "",
    badge_bg_color: "#1a1a2e",
    badge_text_color: "#ffffff",
    badge_border_color: "transparent",
    icon: "",
    priority: 0,
    status: "active",
    display_order: 0,
  });

  const fetch = async () => {
    setLoading(true);
    try {
      const data = await productFlagsApi.list();
      setFlags(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const resetForm = () => {
    setForm({
      name: "", slug: "", badge_label: "", badge_bg_color: "#1a1a2e",
      badge_text_color: "#ffffff", badge_border_color: "transparent",
      icon: "", priority: 0, status: "active", display_order: 0,
    });
    setEditing(null);
  };

  const openEdit = (flag: any) => {
    setForm({
      name: flag.name, slug: flag.slug,
      badge_label: flag.badge_label || "",
      badge_bg_color: flag.badge_bg_color,
      badge_text_color: flag.badge_text_color,
      badge_border_color: flag.badge_border_color || "transparent",
      icon: flag.icon || "", priority: flag.priority,
      status: flag.status, display_order: flag.display_order,
    });
    setEditing(flag);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.slug) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        badge_label: form.badge_label || null,
        icon: form.icon || null,
        badge_border_color: form.badge_border_color || null,
      };
      if (editing) {
        await productFlagsApi.update(editing.id, payload);
      } else {
        await productFlagsApi.create(payload);
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
    if (!window.confirm(`Delete flag "${name}"?`)) return;
    try {
      await productFlagsApi.delete(id);
      fetch();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Product Flags"
        description={`${flags.length} flags`}
        actions={
          <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 rounded-lg bg-[#1a1a2e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2d1b4e]">
            <Plus className="h-4 w-4" /> Add Flag
          </button>
        }
      />

      {showForm && (
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-bold text-[#1a1a2e]">{editing ? "Edit Flag" : "New Flag"}</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-600">Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: editing ? form.slug : e.target.value.toLowerCase().replace(/\s+/g, "-") })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-600">Slug</label>
              <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-600">Badge Label</label>
              <input value={form.badge_label} onChange={(e) => setForm({ ...form, badge_label: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]" placeholder="NEW" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-600">Badge BG Color</label>
              <div className="flex items-center gap-2">
                <input type="color" value={form.badge_bg_color} onChange={(e) => setForm({ ...form, badge_bg_color: e.target.value })} className="h-9 w-9 cursor-pointer rounded border" />
                <input value={form.badge_bg_color} onChange={(e) => setForm({ ...form, badge_bg_color: e.target.value })} className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]" />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-600">Badge Text Color</label>
              <div className="flex items-center gap-2">
                <input type="color" value={form.badge_text_color} onChange={(e) => setForm({ ...form, badge_text_color: e.target.value })} className="h-9 w-9 cursor-pointer rounded border" />
                <input value={form.badge_text_color} onChange={(e) => setForm({ ...form, badge_text_color: e.target.value })} className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]" />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-600">Border Color</label>
              <div className="flex items-center gap-2">
                <input type="color" value={form.badge_border_color} onChange={(e) => setForm({ ...form, badge_border_color: e.target.value })} className="h-9 w-9 cursor-pointer rounded border" />
                <input value={form.badge_border_color} onChange={(e) => setForm({ ...form, badge_border_color: e.target.value })} className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]" />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-600">Icon (optional)</label>
              <input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]" placeholder="lucide-icon-name" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-600">Priority</label>
              <input type="number" value={form.priority} onChange={(e) => setForm({ ...form, priority: Number(e.target.value) })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-600">Display Order</label>
              <input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-600">Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
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
      ) : flags.length === 0 ? (
        <AdminEmpty title="No flags yet" description="Create product flags to tag and categorize your products." />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-600">Order</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-600">Flag</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-600">Badge Preview</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-600">Priority</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-600">Status</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {flags.map((f) => (
                <tr key={f.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-400"><GripVertical className="h-4 w-4" /></td>
                  <td className="px-4 py-3 font-medium text-[#1a1a2e]">{f.name}</td>
                  <td className="px-4 py-3">
                    {f.badge_label && (
                      <span
                        className="inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                        style={{ backgroundColor: f.badge_bg_color, color: f.badge_text_color, borderColor: f.badge_border_color || "transparent", borderWidth: f.badge_border_color && f.badge_border_color !== "transparent" ? 1 : 0 }}
                      >
                        {f.badge_label}
                      </span>
                    )}
                    {!f.badge_label && <span className="text-gray-400">—</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{f.priority}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${f.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                      {f.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(f)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"><Edit3 className="h-4 w-4" /></button>
                      <button onClick={() => handleDelete(f.id, f.name)} className="rounded-lg p-1.5 text-red-300 hover:bg-red-50 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
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
