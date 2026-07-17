import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout, AdminPageHeader, AdminLoading, AdminEmpty } from "@/components/admin/AdminLayout";
import { enquiriesApi } from "@/lib/api/enquiries";
import { Search, Mail, Trash2 } from "lucide-react";

import { requireAdmin } from "@/lib/auth-guard";

export const Route = createFileRoute("/admin/enquiries")({
  beforeLoad: requireAdmin,
  component: AdminEnquiries,
});

function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<any | null>(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const result = await enquiriesApi.list({ search: search || undefined });
      setEnquiries(result.data);
      setCount(result.count);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, [search]);

  const handleSelect = async (enquiry: any) => {
    setSelected(enquiry);
    if (!enquiry.is_read) {
      await enquiriesApi.markRead(enquiry.id);
      fetch();
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this enquiry?")) return;
    try {
      await enquiriesApi.delete(id);
      if (selected?.id === id) setSelected(null);
      fetch();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AdminLayout>
      <AdminPageHeader title="Enquiries" description={`${count} enquiries received`} />
      <div className="mb-4 relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="Search enquiries..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-sm outline-none focus:border-[#c9a96e]" />
      </div>
      {loading ? (
        <AdminLoading />
      ) : enquiries.length === 0 ? (
        <AdminEmpty title="No enquiries yet" description="Contact form submissions will appear here." />
      ) : (
        <div className="grid gap-4 lg:grid-cols-[1fr_400px]">
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Subject</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {enquiries.map((e) => (
                  <tr key={e.id} className={`hover:bg-gray-50 cursor-pointer ${!e.is_read ? "font-semibold bg-amber-50/50" : ""}`} onClick={() => handleSelect(e)}>
                    <td className="px-4 py-3 text-[#1a1a2e]">{e.name}</td>
                    <td className="px-4 py-3 text-gray-500">{e.email}</td>
                    <td className="px-4 py-3 text-gray-500">{e.subject || "—"}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{new Date(e.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <button onClick={(ev) => { ev.stopPropagation(); handleDelete(e.id); }} className="rounded-lg p-1.5 text-red-300 hover:bg-red-50 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {selected && (
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-[#1a1a2e]">Enquiry Details</h3>
                <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600">✕</button>
              </div>
              <dl className="space-y-3 text-sm">
                <div><dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</dt><dd className="text-[#1a1a2e]">{selected.name}</dd></div>
                <div><dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</dt><dd className="text-[#1a1a2e]"><a href={`mailto:${selected.email}`} className="text-[#c9a96e] hover:underline">{selected.email}</a></dd></div>
                {selected.phone && <div><dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</dt><dd className="text-[#1a1a2e]">{selected.phone}</dd></div>}
                {selected.subject && <div><dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Subject</dt><dd className="text-[#1a1a2e]">{selected.subject}</dd></div>}
                <div><dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Message</dt><dd className="text-[#1a1a2e] text-sm leading-relaxed whitespace-pre-wrap">{selected.message}</dd></div>
                <div><dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Received</dt><dd className="text-xs text-gray-500">{new Date(selected.created_at).toLocaleString()}</dd></div>
              </dl>
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
}
