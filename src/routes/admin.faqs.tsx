import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { AdminLayout, AdminPageHeader, AdminTable, AdminLoading, AdminEmpty } from "@/components/admin/AdminLayout";
import { faqsApi, type FAQ } from "@/lib/api/faqs";
import { Plus, Edit3, Trash2, Loader2, GripVertical, Eye, EyeOff } from "lucide-react";
import { requireAdmin } from "@/lib/auth-guard";

export const Route = createFileRoute("/admin/faqs")({
  beforeLoad: requireAdmin,
  component: AdminFAQs,
});

const emptyFAQForm = {
  question: "",
  answer: "",
  sort_order: 0,
  is_published: true,
};

function AdminFAQs() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<FAQ | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyFAQForm);
  const queryClient = useQueryClient();

  const invalidateCaches = async () => {
    await queryClient.invalidateQueries({ queryKey: ["faqs"] });
  };

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const data = await faqsApi.listAll();
      setFaqs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFaqs(); }, []);

  const handleSave = async () => {
    if (!form.question.trim() || !form.answer.trim()) return;
    setSaving(true);
    try {
      const payload = {
        question: form.question.trim(),
        answer: form.answer.trim(),
        sort_order: form.sort_order,
        is_published: form.is_published,
      };
      if (editing) {
        await faqsApi.update(editing.id, payload);
      } else {
        await faqsApi.create(payload);
      }
      setShowForm(false);
      setEditing(null);
      setForm(emptyFAQForm);
      await invalidateCaches();
      fetchFaqs();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, question: string) => {
    if (!window.confirm(`Delete FAQ "${question.slice(0, 50)}..."?`)) return;
    try {
      await faqsApi.delete(id);
      await invalidateCaches();
      fetchFaqs();
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (faq: FAQ) => {
    setEditing(faq);
    setForm({
      question: faq.question,
      answer: faq.answer,
      sort_order: faq.sort_order,
      is_published: faq.is_published,
    });
    setShowForm(true);
  };

  const handleReorder = async (sourceIndex: number, destIndex: number) => {
    const newFaqs = [...faqs];
    const [removed] = newFaqs.splice(sourceIndex, 1);
    newFaqs.splice(destIndex, 0, removed);
    const reordered = newFaqs.map((f, i) => ({ id: f.id, sort_order: i }));
    try {
      await faqsApi.reorder(reordered);
      await invalidateCaches();
      fetchFaqs();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AdminLayout>
      <AdminPageHeader
        title="FAQs"
        description={`${faqs.length} FAQ${faqs.length !== 1 ? "s" : ""}`}
        actions={
          <button
            onClick={() => { setEditing(null); setForm(emptyFAQForm); setShowForm(true); }}
            className="flex items-center gap-2 rounded-lg bg-[#1a1a2e] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#2d1b4e] min-h-[44px]"
          >
            <Plus className="h-4 w-4" />
            Add FAQ
          </button>
        }
      />

      {showForm && (
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-500">
            {editing ? "Edit FAQ" : "New FAQ"}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-gray-600">Question *</label>
              <input
                type="text"
                value={form.question}
                onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#7A2533] min-h-[44px]"
                placeholder="e.g., Is Creative Muse jewellery waterproof?"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-gray-600">Answer *</label>
              <textarea
                value={form.answer}
                onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))}
                rows={5}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#7A2533]"
                placeholder="Answer text..."
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Display Order</label>
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm((f) => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#7A2533] min-h-[44px]"
              />
            </div>
            <div className="flex items-end gap-6 pb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_published}
                  onChange={(e) => setForm((f) => ({ ...f, is_published: e.target.checked }))}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700 flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  Published
                </span>
              </label>
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-lg bg-[#1a1a2e] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#2d1b4e] disabled:opacity-60 min-h-[44px]"
            >
              {saving ? "Saving..." : (editing ? "Update" : "Create")}
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
      ) : faqs.length === 0 ? (
        <AdminEmpty title="No FAQs yet" description="Create your first FAQ to get started" />
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <div className="border-b border-gray-100 px-5 py-3 text-sm text-gray-500">
            Drag rows to reorder. Changes sync automatically.
          </div>
          <AdminTable
            headers={["#", "Question", "Order", "Status", "Actions"]}
            mobileCards={
              <>
                {faqs.map((faq) => (
                  <div key={faq.id} className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-white p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-[#1a1a2e] line-clamp-2">{faq.question}</p>
                        <p className="mt-1 text-xs text-gray-400 line-clamp-2">{faq.answer}</p>
                      </div>
                      <span className={`shrink-0 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${faq.is_published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {faq.is_published ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                        {faq.is_published ? "Published" : "Hidden"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Order: {faq.sort_order}</span>
                      <div className="flex items-center gap-1">
                        <button onClick={() => startEdit(faq)} className="flex h-9 min-w-[44px] items-center justify-center rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50">
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => handleDelete(faq.id, faq.question)} className="flex h-9 min-w-[44px] items-center justify-center rounded-lg border border-gray-200 text-xs font-medium text-red-500 hover:bg-red-50">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            }
          >
            {faqs.map((faq, index) => (
              <tr key={faq.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <GripVertical className="h-5 w-5 text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing mx-auto" />
                </td>
                <td className="px-4 py-3 max-w-[400px]">
                  <p className="font-medium text-[#1a1a2e] truncate" title={faq.question}>{faq.question}</p>
                  <p className="mt-1 text-xs text-gray-400 truncate" title={faq.answer}>{faq.answer}</p>
                </td>
                <td className="px-4 py-3 text-center text-sm text-gray-500 font-mono">{faq.sort_order}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${faq.is_published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {faq.is_published ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                    {faq.is_published ? "Published" : "Hidden"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => startEdit(faq)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100" title="Edit">
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(faq.id, faq.question)} className="rounded-lg p-1.5 text-red-300 hover:bg-red-50" title="Delete">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </AdminTable>
        </div>
      )}
    </AdminLayout>
  );
}