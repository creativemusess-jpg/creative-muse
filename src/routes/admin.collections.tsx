import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { collectionsApi } from "@/lib/api/collections";
import { DataTable, ConfirmDialog, StatusBadge } from "@/components/admin/AdminTable";
import { Plus, Edit, Trash2 } from "lucide-react";

import { requireAdmin } from "@/lib/auth-guard";

export const Route = createFileRoute("/admin/collections")({
  beforeLoad: requireAdmin,
  component: CollectionsPage,
});

function CollectionsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", description: "" });

  const load = async () => {
    setLoading(true);
    try {
      const d = await collectionsApi.list();
      setData(d);
    } catch (e: any) { setError(e.message); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    try {
      if (editing) {
        await collectionsApi.update(editing.id, form);
      } else {
        await collectionsApi.create(form);
      }
      setShowForm(false);
      setEditing(null);
      setForm({ name: "", slug: "", description: "" });
      load();
    } catch (e: any) { alert(e.message); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await collectionsApi.delete(deleteId);
      setDeleteId(null);
      load();
    } catch (e: any) { alert(e.message); }
  };

  const openEdit = (item: any) => {
    setEditing(item);
    setForm({ name: item.name, slug: item.slug || "", description: item.description || "" });
    setShowForm(true);
  };

  return (
    <AdminLayout>
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete collection?"
        message="This will remove the collection and unlink all products. Products themselves are not deleted."
        confirmLabel="Delete"
      />

      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <DataTable
          title="Collections"
          data={data}
          loading={loading}
          error={error}
          primaryKey="id"
          emptyMessage="No collections yet"
          searchPlaceholder="Search collections..."
          filterFn={(item, term) =>
            item.name?.toLowerCase().includes(term) || item.slug?.toLowerCase().includes(term)
          }
          columns={[
            { key: "name", label: "Name", sortable: true, render: (val, row) => (
              <Link to="/" className="text-sm font-medium text-[#1a1a2e] hover:text-[#c9a96e]">{val}</Link>
            )},
            { key: "slug", label: "Slug", sortable: true, render: (val) => <span className="text-xs text-gray-400">{val || "—"}</span> },
            { key: "description", label: "Description", render: (val) => <span className="text-xs text-gray-500 truncate max-w-[200px] block">{val || "—"}</span> },
            { key: "product_count", label: "Products", sortable: true, render: (val) => (
              <span className="inline-flex items-center justify-center rounded-full bg-[#1a1a2e]/10 px-2 py-0.5 text-xs font-semibold text-[#1a1a2e]">{val ?? 0}</span>
            )},
          ]}
          actions={(row) => (
            <div className="flex items-center gap-1">
              <button onClick={() => openEdit(row)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-[#c9a96e]"><Edit className="h-4 w-4" /></button>
              <button onClick={() => setDeleteId(row.id)} className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
            </div>
          )}
          onAdd={() => { setEditing(null); setForm({ name: "", slug: "", description: "" }); setShowForm(true); }}
          addLabel="Add Collection"
        />
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowForm(false)}>
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-[#1a1a2e]">{editing ? "Edit" : "Add"} Collection</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase">Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#c9a96e]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase">Slug (optional)</label>
                <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#c9a96e]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#c9a96e]" />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowForm(false)} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} className="rounded-lg bg-[#1a1a2e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2d1b4e]">{editing ? "Save" : "Create"}</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
