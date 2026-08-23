import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { AdminLayout, AdminPageHeader, AdminLoading, AdminEmpty } from "@/components/admin/AdminLayout";
import { announcementsApi, type Announcement } from "@/lib/api/announcements";
import { Plus, Edit3, Trash2, GripVertical, Eye, EyeOff } from "lucide-react";
import { requireAdmin } from "@/lib/auth-guard";

export const Route = createFileRoute("/admin/announcements")({
  beforeLoad: requireAdmin,
  component: AdminAnnouncements,
});

function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<Announcement | null>(null);
  const [formText, setFormText] = useState("");
  const [formActive, setFormActive] = useState(true);
  const [formOrder, setFormOrder] = useState(0);
  const queryClient = useQueryClient();

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const data = await announcementsApi.list();
      setAnnouncements(data.sort((a, b) => a.sort_order - b.sort_order));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAnnouncements(); }, []);

  const handleSave = async () => {
    if (!formText.trim()) return;
    setSaving(true);
    try {
      if (editing) {
        const updated = await announcementsApi.update(editing.id, {
          text: formText.trim(),
          is_active: formActive,
          sort_order: formOrder,
        });
        setAnnouncements(updated.sort((a, b) => a.sort_order - b.sort_order));
      } else {
        const maxOrder = announcements.reduce((max, a) => Math.max(max, a.sort_order), 0);
        const updated = await announcementsApi.add(formText.trim(), formOrder || maxOrder + 1);
        setAnnouncements(updated.sort((a, b) => a.sort_order - b.sort_order));
      }
      setShowForm(false);
      setEditing(null);
      setFormText("");
      setFormActive(true);
      setFormOrder(0);
      await queryClient.invalidateQueries({ queryKey: ["announcements"] });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      const updated = await announcementsApi.remove(deleteConfirm.id);
      setAnnouncements(updated.sort((a, b) => a.sort_order - b.sort_order));
      setDeleteConfirm(null);
      await queryClient.invalidateQueries({ queryKey: ["announcements"] });
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleActive = async (a: Announcement) => {
    try {
      const updated = await announcementsApi.update(a.id, { is_active: !a.is_active });
      setAnnouncements(updated.sort((a, b) => a.sort_order - b.sort_order));
      await queryClient.invalidateQueries({ queryKey: ["announcements"] });
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (a: Announcement) => {
    setEditing(a);
    setFormText(a.text);
    setFormActive(a.is_active);
    setFormOrder(a.sort_order);
    setShowForm(true);
  };

  const startAdd = () => {
    setEditing(null);
    setFormText("");
    setFormActive(true);
    const maxOrder = announcements.reduce((max, a) => Math.max(max, a.sort_order), 0);
    setFormOrder(maxOrder + 1);
    setShowForm(true);
  };

  const handleMove = async (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= announcements.length) return;
    const sorted = [...announcements];
    [sorted[idx], sorted[target]] = [sorted[target], sorted[idx]];
    const reordered = sorted.map((a, i) => ({ ...a, sort_order: i + 1 }));
    setAnnouncements(reordered);
    await announcementsApi.reorder(reordered.map((a) => a.id));
    await queryClient.invalidateQueries({ queryKey: ["announcements"] });
  };

  return (
    <AdminLayout>
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setDeleteConfirm(null)}>
          <div className="mx-4 w-full max-w-sm rounded-xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-[#1a1a2e]">Delete Announcement</h3>
            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to delete "{deleteConfirm.text}"?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleDelete} className="rounded-lg px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <AdminPageHeader
        title="Announcements"
        description={`${announcements.length} announcements`}
        actions={
          <button
            onClick={startAdd}
            className="flex items-center gap-2 rounded-lg bg-[#1a1a2e] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#2d1b4e] min-h-[44px]"
          >
            <Plus className="h-4 w-4" /> Add Announcement
          </button>
        }
      />

      {showForm && (
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-500">
            {editing ? "Edit Announcement" : "New Announcement"}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-gray-600">Announcement Text *</label>
              <input
                type="text"
                value={formText}
                onChange={(e) => setFormText(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#9C544D] min-h-[44px]"
                placeholder="e.g., FREE SHIPPING ON ORDERS ABOVE ₹5,000"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Status</label>
              <div className="flex items-center gap-3 min-h-[44px]">
                <button
                  type="button"
                  onClick={() => setFormActive(!formActive)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${formActive ? "bg-green-500" : "bg-gray-300"}`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 translate-y-0 rounded-full bg-white shadow transition-transform ${formActive ? "translate-x-5" : "translate-x-0"}`} />
                </button>
                <span className="text-sm text-gray-700">{formActive ? "Active" : "Disabled"}</span>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Display Order</label>
              <input
                type="number"
                value={formOrder}
                onChange={(e) => setFormOrder(parseInt(e.target.value) || 0)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#9C544D] min-h-[44px]"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving || !formText.trim()}
              className="rounded-lg bg-[#1a1a2e] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#2d1b4e] disabled:opacity-60 min-h-[44px]"
            >
              {saving ? "Saving..." : editing ? "Update" : "Save Announcement"}
            </button>
            <button
              onClick={() => { setShowForm(false); setEditing(null); }}
              className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 min-h-[44px]"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <AdminLoading />
      ) : announcements.length === 0 ? (
        <AdminEmpty title="No announcements" description="Create your first announcement to display in the top bar" />
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="grid gap-3 p-3 sm:p-4 md:hidden">
            {announcements.map((a, idx) => (
              <div key={a.id} className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-white p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-[#1a1a2e] text-sm line-clamp-2 flex-1">{a.text}</p>
                  <span className={`shrink-0 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${a.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {a.is_active ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                    {a.is_active ? "Active" : "Disabled"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleMove(idx, -1)}
                      disabled={idx === 0}
                      className="flex h-8 min-w-[36px] items-center justify-center rounded border border-gray-200 text-gray-500 hover:border-[#9C544D] hover:text-[#9C544D] disabled:opacity-30"
                    >
                      ↑
                    </button>
                    <span className="w-4 text-center text-xs text-gray-600">{a.sort_order}</span>
                    <button
                      onClick={() => handleMove(idx, 1)}
                      disabled={idx === announcements.length - 1}
                      className="flex h-8 min-w-[36px] items-center justify-center rounded border border-gray-200 text-gray-500 hover:border-[#9C544D] hover:text-[#9C544D] disabled:opacity-30"
                    >
                      ↓
                    </button>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggleActive(a)}
                      className={`flex h-9 min-w-[44px] items-center justify-center rounded-lg border border-gray-200 text-xs font-medium hover:bg-gray-50 ${a.is_active ? "text-gray-500" : "text-green-600"}`}
                    >
                      {a.is_active ? "Disable" : "Enable"}
                    </button>
                    <button
                      onClick={() => startEdit(a)}
                      className="flex h-9 min-w-[44px] items-center justify-center rounded-lg border border-gray-200 text-xs font-medium text-[#9C544D] hover:bg-gray-50"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(a)}
                      className="flex h-9 min-w-[44px] items-center justify-center rounded-lg border border-gray-200 text-xs font-medium text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                  <th className="px-4 py-3 w-10">#</th>
                  <th className="px-4 py-3">Announcement</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {announcements.map((a, idx) => (
                  <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleMove(idx, -1)}
                          disabled={idx === 0}
                          aria-label="Move up"
                          className="rounded border border-gray-200 px-1.5 py-0.5 text-gray-500 hover:border-[#9C544D] hover:text-[#9C544D] disabled:opacity-30"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => handleMove(idx, 1)}
                          disabled={idx === announcements.length - 1}
                          aria-label="Move down"
                          className="rounded border border-gray-200 px-1.5 py-0.5 text-gray-500 hover:border-[#9C544D] hover:text-[#9C544D] disabled:opacity-30"
                        >
                          ↓
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-[#1a1a2e] max-w-[400px] truncate">{a.text}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${a.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {a.is_active ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                        {a.is_active ? "Active" : "Disabled"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-500 font-mono">{a.sort_order}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleToggleActive(a)}
                          className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"
                          title={a.is_active ? "Disable" : "Enable"}
                        >
                          {a.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => startEdit(a)}
                          className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"
                          title="Edit"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(a)}
                          className="rounded-lg p-1.5 text-red-300 hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
