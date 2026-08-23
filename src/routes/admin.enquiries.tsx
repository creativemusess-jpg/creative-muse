import { useState, useEffect, useCallback, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout, AdminPageHeader, AdminLoading, AdminEmpty } from "@/components/admin/AdminLayout";
import { enquiriesApi, type Enquiry, type EnquiryStatus, type EnquiryPriority } from "@/lib/api/enquiries";
import { Search, Mail, Trash2, MessageSquare, Flag, Check, X, Edit2, Phone, Clock, AlertTriangle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";

import { requireAdmin } from "@/lib/auth-guard";

export const Route = createFileRoute("/admin/enquiries")({
  beforeLoad: requireAdmin,
  component: AdminEnquiries,
});

const statusOptions: { value: EnquiryStatus; label: string; color: string }[] = [
  { value: "new", label: "New", color: "bg-blue-100 text-blue-700" },
  { value: "contacted", label: "Contacted", color: "bg-amber-100 text-amber-700" },
  { value: "in_progress", label: "In Progress", color: "bg-purple-100 text-purple-700" },
  { value: "resolved", label: "Resolved", color: "bg-green-100 text-green-700" },
  { value: "closed", label: "Closed", color: "bg-gray-100 text-gray-700" },
];

const priorityOptions: { value: EnquiryPriority; label: string; color: string; icon: typeof Flag }[] = [
  { value: "normal", label: "Normal", color: "bg-gray-100 text-gray-700", icon: Flag },
  { value: "high", label: "High", color: "bg-amber-100 text-amber-700", icon: Flag },
  { value: "urgent", label: "Urgent", color: "bg-red-100 text-red-700", icon: AlertTriangle },
];

function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Enquiry | null>(null);
  const [notes, setNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const queryClient = useQueryClient();
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const fetchEnquiries = useCallback(async () => {
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
  }, [search]);

  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel("admin-enquiries-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "enquiries" },
        (payload) => {
          const newEnquiry = payload.new as Enquiry;
          setEnquiries((prev) => [newEnquiry, ...prev]);
          setCount((prev) => prev + 1);
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "enquiries" },
        (payload) => {
          const updatedEnquiry = payload.new as Enquiry;
          setEnquiries((prev) => prev.map((e) => (e.id === updatedEnquiry.id ? updatedEnquiry : e)));
          if (selected?.id === updatedEnquiry.id) {
            setSelected(updatedEnquiry);
            setNotes(updatedEnquiry.notes || "");
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "enquiries" },
        (payload) => {
          const deletedId = payload.old.id;
          setEnquiries((prev) => prev.filter((e) => e.id !== deletedId));
          setCount((prev) => prev - 1);
          if (selected?.id === deletedId) setSelected(null);
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [selected]);

  const handleSelect = async (enquiry: Enquiry) => {
    setSelected(enquiry);
    setNotes(enquiry.notes || "");
    if (!enquiry.is_read) {
      try {
        await enquiriesApi.markRead(enquiry.id);
        // Update local state immediately
        setEnquiries((prev) => prev.map((e) => (e.id === enquiry.id ? { ...e, is_read: true, read_at: new Date().toISOString() } : e)));
        // Invalidate queries to update notification bell
        queryClient.invalidateQueries({ queryKey: ["admin", "notifications"] });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this enquiry?")) return;
    try {
      await enquiriesApi.delete(id);
      if (selected?.id === id) setSelected(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (id: string, status: EnquiryStatus) => {
    try {
      await enquiriesApi.updateStatus(id, status);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePriorityChange = async (id: string, priority: EnquiryPriority) => {
    try {
      await enquiriesApi.updatePriority(id, priority);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveNotes = async () => {
    if (!selected) return;
    setSavingNotes(true);
    try {
      await enquiriesApi.addNotes(selected.id, notes);
    } catch (err) {
      console.error(err);
    } finally {
      setSavingNotes(false);
    }
  };

  const handleMarkReplied = async () => {
    if (!selected) return;
    try {
      await enquiriesApi.markReplied(selected.id);
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusConfig = (status: EnquiryStatus) => statusOptions.find((s) => s.value === status) || statusOptions[0];
  const getPriorityConfig = (priority: EnquiryPriority) => priorityOptions.find((p) => p.value === priority) || priorityOptions[0];

  const formatDate = (iso: string) => new Date(iso).toLocaleString();

  return (
    <AdminLayout>
      <AdminPageHeader title="Enquiries" description={`${count} enquiries received`} />
      <div className="mb-4 relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search enquiries..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-sm outline-none focus:border-[#9C544D]"
        />
      </div>
      {loading ? (
        <AdminLoading />
      ) : enquiries.length === 0 ? (
        <AdminEmpty title="No enquiries yet" description="Contact form submissions will appear here." />
      ) : (
        <div className="grid gap-4 lg:grid-cols-[1fr_480px]">
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Subject</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Priority</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {enquiries.map((e) => {
                  const statusConfig = getStatusConfig(e.status);
                  const priorityConfig = getPriorityConfig(e.priority);
                  const isUnread = !e.is_read;
                  return (
                    <tr
                      key={e.id}
                      className={`hover:bg-gray-50 cursor-pointer transition-colors ${isUnread ? "font-semibold bg-amber-50/50" : ""} ${selected?.id === e.id ? "bg-[#9C544D]/5" : ""}`}
                      onClick={() => handleSelect(e)}
                    >
                      <td className="px-4 py-3 text-[#1a1a2e]">{e.name}</td>
                      <td className="px-4 py-3 text-gray-500">{e.email}</td>
                      <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{e.subject || "—"}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${priorityConfig.color}`}>
                          <priorityConfig.icon className="h-3 w-3" />
                          {priorityConfig.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{new Date(e.created_at).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={(ev) => { ev.stopPropagation(); handleDelete(e.id); }}
                          className="rounded-lg p-1.5 text-red-300 hover:bg-red-50 hover:text-red-500"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {selected && (
            <div className="rounded-xl border border-gray-200 bg-white p-6 h-fit sticky top-24 lg:sticky lg:top-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-[#1a1a2e]">Enquiry Details</h3>
                <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <dl className="space-y-4 text-sm mb-6">
                <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
                  <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</dt>
                  <dd className="text-[#1a1a2e]">{selected.name}</dd>
                  <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</dt>
                  <dd className="text-[#1a1a2e]"><a href={`mailto:${selected.email}`} className="text-[#9C544D] hover:underline">{selected.email}</a></dd>
                  {selected.phone && (
                    <>
                      <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</dt>
                      <dd className="flex items-center gap-2 text-[#1a1a2e]"><Phone className="h-3.5 w-3.5 text-gray-400" /> <a href={`tel:${selected.phone}`} className="text-[#9C544D] hover:underline">{selected.phone}</a></dd>
                    </>
                  )}
                  {selected.subject && (
                    <>
                      <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Subject</dt>
                      <dd className="text-[#1a1a2e]">{selected.subject}</dd>
                    </>
                  )}
                  <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Message</dt>
                  <dd className="text-[#1a1a2e] text-sm leading-relaxed whitespace-pre-wrap">{selected.message}</dd>
                  <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Received</dt>
                  <dd className="flex items-center gap-2 text-xs text-gray-500"><Clock className="h-3.5 w-3.5" />{formatDate(selected.created_at)}</dd>
                  <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Source</dt>
                  <dd className="text-xs text-gray-500 capitalize">{selected.source.replace(/_/g, " ")}</dd>
                </div>
              </dl>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 mb-4">
                <div className="grid gap-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</label>
                    <select
                      value={selected.status}
                      onChange={(ev) => handleStatusChange(selected.id, ev.target.value as EnquiryStatus)}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#9C544D] focus:outline-none"
                    >
                      {statusOptions.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-gray-500 uppercase tracking-wider">Priority</label>
                    <select
                      value={selected.priority}
                      onChange={(ev) => handlePriorityChange(selected.id, ev.target.value as EnquiryPriority)}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#9C544D] focus:outline-none"
                    >
                      {priorityOptions.map((p) => (
                        <option key={p.value} value={p.value}>{p.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="mb-1.5 block text-xs font-semibold text-gray-500 uppercase tracking-wider">Admin Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#9C544D] focus:outline-none"
                />
                <div className="mt-2 flex items-center gap-3">
                  <button onClick={handleSaveNotes} disabled={savingNotes} className="flex items-center gap-1.5 rounded-lg bg-[#1a1a2e] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#1a1a2e]/90 disabled:opacity-50">
                    {savingNotes ? "Saving..." : "Save Notes"}
                  </button>
                  {!selected.replied_at ? (
                    <button onClick={handleMarkReplied} className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">
                      <Check className="h-3.5 w-3.5" /> Mark Replied
                    </button>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs text-green-600">
                      <Check className="h-3.5 w-3.5" /> Replied on {formatDate(selected.replied_at)}
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500">Read status: <span className={selected.is_read ? "text-green-600" : "text-amber-600"}>{selected.is_read ? "Read" : "Unread"}</span></p>
                {selected.read_at && <p className="text-xs text-gray-400 mt-1">Read at: {formatDate(selected.read_at)}</p>}
              </div>
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
}