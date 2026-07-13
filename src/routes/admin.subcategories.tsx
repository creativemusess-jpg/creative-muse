import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout, AdminPageHeader, AdminTable, AdminLoading, AdminEmpty } from "@/components/admin/AdminLayout";
import { categoriesApi } from "@/lib/api/categories";
import { subcategoriesApi } from "@/lib/api/subcategories";
import { Plus, Edit3, Trash2, X, Loader2, ChevronDown, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/admin/subcategories")({
  component: AdminSubcategories,
});

function AdminSubcategories() {
  const [groups, setGroups] = useState<Record<string, any[]>>({});
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [form, setForm] = useState({ category_id: "", name: "", slug: "", sort_order: 0, active: true });
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [linkedCount, setLinkedCount] = useState(0);

  const fetchData = async () => {
    setLoading(true);
    try {
      const cats = await categoriesApi.list();
      setCategories(cats);
      const subs = await subcategoriesApi.list();
      const grouped: Record<string, any[]> = {};
      for (const s of subs) {
        const catId = s.category_id;
        if (!grouped[catId]) grouped[catId] = [];
        grouped[catId].push(s);
      }
      setGroups(grouped);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async () => {
    if (!form.category_id || !form.name || !form.slug) return;
    setSaving(true);
    try {
      if (editing) {
        await subcategoriesApi.update(editing.id, form);
      } else {
        await subcategoriesApi.create(form);
      }
      setShowForm(false); setEditing(null);
      setForm({ category_id: "", name: "", slug: "", sort_order: 0, active: true });
      fetchData();
    } catch (err: any) { alert(err.message); } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      const result = await subcategoriesApi.delete(id);
      if (result.linkedProducts > 0) {
        setLinkedCount(result.linkedProducts);
        setConfirmDelete(id);
        return;
      }
      fetchData();
    } catch (err: any) { alert(err.message); } finally { setDeleting(null); }
  };

  const forceDelete = async (id: string) => {
    setDeleting(id);
    try {
      const { error } = await (await import("@/lib/supabase")).supabase.from("products").update({ subcategory_id: null }).eq("subcategory_id", id);
      if (error) throw error;
      await subcategoriesApi.delete(id);
      setConfirmDelete(null);
      setLinkedCount(0);
      fetchData();
    } catch (err: any) { alert(err.message); } finally { setDeleting(null); }
  };

  const startEdit = (sub: any) => {
    setEditing(sub);
    setForm({ category_id: sub.category_id, name: sub.name, slug: sub.slug, sort_order: sub.sort_order, active: sub.active });
    setShowForm(true);
  };

  const catMap = new Map(categories.map((c: any) => [c.id, c]));

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Subcategories"
        description="Manage product subcategories"
        actions={
          <button onClick={() => { setEditing(null); setForm({ category_id: "", name: "", slug: "", sort_order: 0, active: true }); setShowForm(true); }} className="flex items-center gap-2 rounded-lg bg-[#1a1a2e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2d1b4e]">
            <Plus className="h-4 w-4" /> Add Subcategory
          </button>
        }
      />

      {showForm && (
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-500">{editing ? "Edit Subcategory" : "New Subcategory"}</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Parent Category *</label>
              <select value={form.category_id} onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#c9a96e]">
                <option value="">Select category</option>
                {categories.filter((c: any) => c.active).map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Name *</label>
              <input type="text" value={form.name} onChange={(e) => { setForm((f) => ({ ...f, name: e.target.value })); if (!editing) setForm((f) => ({ ...f, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })); }} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#c9a96e]" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Slug *</label>
              <input type="text" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#c9a96e]" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Sort Order</label>
              <input type="number" value={form.sort_order} onChange={(e) => setForm((f) => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#c9a96e]" />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} className="rounded border-gray-300" />
                <span className="text-sm text-gray-700">Active</span>
              </label>
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button onClick={handleSave} disabled={saving} className="rounded-lg bg-[#1a1a2e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2d1b4e] disabled:opacity-60">{saving ? "Saving..." : (editing ? "Update" : "Create")}</button>
            <button onClick={() => { setShowForm(false); setEditing(null); }} className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p className="font-semibold">Cannot delete: {linkedCount} product(s) are linked to this subcategory.</p>
          <p className="mt-1 text-xs">You can deactivate it instead, or remove the subcategory from all linked products first.</p>
          <div className="mt-3 flex gap-2">
            <button onClick={() => forceDelete(confirmDelete)} disabled={deleting === confirmDelete} className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-60">{deleting ? "Removing..." : "Remove from products & delete"}</button>
            <button onClick={() => setConfirmDelete(null)} className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50">Cancel</button>
          </div>
        </div>
      )}

      {loading ? (
        <AdminLoading />
      ) : categories.length === 0 ? (
        <AdminEmpty title="No categories" description="Create categories first, then add subcategories" />
      ) : (
        <div className="space-y-4">
          {categories.filter((c: any) => c.active).map((cat: any) => {
            const subs = groups[cat.id] || [];
            return (
              <div key={cat.id} className="rounded-xl border border-gray-200 bg-white">
                <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[#1a1a2e]">{cat.name}</span>
                    <span className="text-[10px] text-gray-400">({subs.length} subcategories)</span>
                  </div>
                </div>
                {subs.length === 0 ? (
                  <div className="px-5 py-4 text-xs text-gray-400 italic">No subcategories</div>
                ) : (
                  <AdminTable headers={["Name", "Slug", "Order", "Status", "Actions"]}>
                    {subs.map((sub: any) => (
                      <tr key={sub.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-[#1a1a2e]">{sub.name}</td>
                        <td className="px-4 py-3 text-gray-500">{sub.slug}</td>
                        <td className="px-4 py-3 text-gray-500">{sub.sort_order}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${sub.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                            {sub.active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button onClick={() => startEdit(sub)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"><Edit3 className="h-4 w-4" /></button>
                            <button onClick={() => handleDelete(sub.id)} disabled={deleting === sub.id} className="rounded-lg p-1.5 text-red-300 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </AdminTable>
                )}
              </div>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
}
