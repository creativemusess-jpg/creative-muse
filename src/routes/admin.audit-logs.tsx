import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout, AdminPageHeader, AdminLoading, AdminEmpty } from "@/components/admin/AdminLayout";
import { auditLogsApi } from "@/lib/api/audit-logs";
import { Clock } from "lucide-react";

export const Route = createFileRoute("/admin/audit-logs")({
  component: AdminAuditLogs,
});

function AdminAuditLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    auditLogsApi.list().then((result) => {
      setLogs(result.data);
      setCount(result.count);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const actionColor = (action: string) => {
    if (action.includes("delete")) return "text-red-600";
    if (action.includes("create")) return "text-green-600";
    if (action.includes("update")) return "text-blue-600";
    return "text-gray-600";
  };

  return (
    <AdminLayout>
      <AdminPageHeader title="Audit Logs" description={`${count} recorded actions`} />

      {loading ? (
        <AdminLoading />
      ) : logs.length === 0 ? (
        <AdminEmpty title="No audit logs" description="Actions will be recorded here as you manage the store." />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Action</th>
                <th className="px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Entity</th>
                <th className="px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">User</th>
                <th className="px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span className={`font-medium capitalize ${actionColor(log.action)}`}>{log.action.replace(/_/g, " ")}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {log.entity_type}
                    {log.entity_id && <span className="text-xs text-gray-400 ml-1">· {log.entity_id.slice(0, 8)}</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{log.profiles?.full_name || log.profiles?.email || "—"}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    <span title={new Date(log.created_at).toLocaleString()}>
                      {new Date(log.created_at).toLocaleDateString()}
                    </span>
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
