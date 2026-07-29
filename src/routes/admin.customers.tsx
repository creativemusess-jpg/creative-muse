import { useState, useEffect } from "react";
import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { AdminLayout, AdminPageHeader, AdminTable, AdminLoading, AdminEmpty } from "@/components/admin/AdminLayout";
import { customersApi } from "@/lib/api/customers";
import { Search } from "lucide-react";

import { requireAdmin } from "@/lib/auth-guard";

export const Route = createFileRoute("/admin/customers")({
  beforeLoad: requireAdmin,
  component: AdminCustomers,
});

function AdminCustomers() {
  const location = useLocation();
  const [customers, setCustomers] = useState<any[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetch = async () => {
    setLoading(true);
    try {
      const result = await customersApi.list({ search: search || undefined });
      setCustomers(result.data);
      setCount(result.count);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, [search]);

  if (location.pathname !== "/admin/customers") return <Outlet />;

  return (
    <AdminLayout>
      <AdminPageHeader title="Customers" description={`${count} registered customers`} />
      <div className="mb-4 relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="Search customers..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-sm outline-none focus:border-[#7A2533]" />
      </div>
      {loading ? (
        <AdminLoading />
      ) : customers.length === 0 ? (
        <AdminEmpty title="No customers found" description="Customers will appear after their first order." />
      ) : (
        <AdminTable headers={["Name", "Email", "Phone", "Provider", "Orders", "Total Spent", "Last Order", "Joined"]}>
          {customers.map((c) => (
            <tr key={c.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-[#1a1a2e]">
  <Link to="/admin/customers/$id" params={{ id: c.id }} className="hover:text-[#7A2533]">{c.full_name || "—"}</Link>
</td>
              <td className="px-4 py-3 text-gray-500">{c.email}</td>
              <td className="px-4 py-3 text-gray-500">{c.phone || "—"}</td>
              <td className="px-4 py-3">
                <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${c.provider === "google" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>
                  {c.provider || "email"}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-500">{c.total_orders ?? c.order_count ?? 0}</td>
              <td className="px-4 py-3 font-medium text-[#1a1a2e]">₹{(c.total_spent || 0).toLocaleString("en-IN")}</td>
              <td className="px-4 py-3 text-xs text-gray-500">{c.last_login_at ? new Date(c.last_login_at).toLocaleDateString() : "—"}</td>
              <td className="px-4 py-3 text-xs text-gray-500">{new Date(c.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </AdminTable>
      )}
    </AdminLayout>
  );
}
