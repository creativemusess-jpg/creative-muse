import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout, AdminPageHeader, AdminLoading, AdminEmpty } from "@/components/admin/AdminLayout";
import { newsletterApi, getSourceLabel } from "@/lib/api/newsletter";
import { Search, Trash2, Download } from "lucide-react";

export const Route = createFileRoute("/admin/newsletter")({
  component: AdminNewsletter,
});

function AdminNewsletter() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");

  const fetch = async () => {
    setLoading(true);
    try {
      const result = await newsletterApi.list({
        search: search || undefined,
        status: statusFilter || undefined,
        source: sourceFilter || undefined,
      });
      setSubscribers(result.data);
      setCount(result.count);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, [search, statusFilter, sourceFilter]);

  const handleDelete = async (id: string, email: string) => {
    if (!window.confirm(`Delete subscriber "${email}"?`)) return;
    try {
      await newsletterApi.delete(id);
      fetch();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusToggle = async (id: string, current: string) => {
    const newStatus = current === "active" ? "unsubscribed" : "active";
    try {
      await newsletterApi.updateStatus(id, newStatus);
      fetch();
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportCSV = () => {
    const headers = ["Email", "Source", "Status", "Discount Code", "Consent", "Subscribed"];
    const rows = subscribers.map((s) => [
      s.email,
      getSourceLabel(s.source),
      s.status,
      s.discount_code || "",
      s.consent ? "Yes" : "No",
      new Date(s.created_at).toLocaleDateString(),
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.map((c) => `"${c}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Newsletter"
        description={`${count} subscribers`}
        actions={
          count > 0 ? (
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              <Download className="h-4 w-4" /> Export CSV
            </button>
          ) : undefined
        }
      />
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by email or source..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-sm outline-none focus:border-[#c9a96e]"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#c9a96e]"
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="unsubscribed">Unsubscribed</option>
        </select>
        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#c9a96e]"
        >
          <option value="">All sources</option>
          <option value="newsletter_popup">Popup</option>
          <option value="homepage_newsletter">Homepage</option>
          <option value="footer_newsletter">Footer</option>
          <option value="admin_manual">Admin</option>
        </select>
      </div>
      {loading ? (
        <AdminLoading />
      ) : subscribers.length === 0 ? (
        <AdminEmpty title="No subscribers yet" description="Newsletter signups will appear here." />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Source</th>
                <th className="px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Discount Code</th>
                <th className="px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Consent</th>
                <th className="px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Subscribed</th>
                <th className="px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {subscribers.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-[#1a1a2e]">{s.email}</td>
                  <td className="px-4 py-3 text-gray-500">{getSourceLabel(s.source)}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleStatusToggle(s.id, s.status)}
                      className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                        s.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {s.status}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    {s.discount_code ? (
                      <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[11px] text-[#1a1a2e]">
                        {s.discount_code}
                      </code>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {s.consent ? (
                      <span className="text-green-600">Yes</span>
                    ) : (
                      <span className="text-gray-400">No</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {new Date(s.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(s.id, s.email)}
                      className="rounded-lg p-1.5 text-red-300 hover:bg-red-50 hover:text-red-500"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
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
