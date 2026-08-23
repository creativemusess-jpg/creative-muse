import { useState, useEffect } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { AdminLayout, AdminPageHeader, AdminLoading } from "@/components/admin/AdminLayout";
import { customersApi } from "@/lib/api/customers";
import { ordersApi } from "@/lib/api/orders";
import { StatusBadge } from "@/components/admin/AdminTable";
import { ArrowLeft, ShoppingCart, DollarSign, Calendar, Mail, Phone, MapPin } from "lucide-react";

import { requireAdmin } from "@/lib/auth-guard";

export const Route = createFileRoute("/admin/customers/$id")({
  beforeLoad: requireAdmin,
  component: CustomerDetailPage,
});

function CustomerDetailPage() {
  const { id } = useParams({ from: "/admin/customers/$id" });
  const [customer, setCustomer] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      customersApi.getById(id),
      ordersApi.list({ per_page: 50 }),
    ]).then(([c, o]) => {
      setCustomer(c);
      setOrders((o.data ?? []).filter((ord: any) =>
        ord.customer_email === c?.email || ord.customer_id === id
      ));
      setLoading(false);
    });
  }, [id]);

  if (loading) return <AdminLayout><AdminLoading /></AdminLayout>;
  if (!customer) return <AdminLayout><div className="py-20 text-center text-gray-500">Customer not found</div></AdminLayout>;

  const totalSpent = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
  const avgOrderValue = orders.length > 0 ? totalSpent / orders.length : 0;

  return (
    <AdminLayout>
      <div className="mb-4">
        <Link to="/admin/customers" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#9C544D]">
          <ArrowLeft className="h-4 w-4" /> Customers
        </Link>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#1a1a2e] text-2xl font-bold text-white">
            {(customer.full_name || customer.email || "?").charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#1a1a2e]">{customer.full_name || "Unnamed"}</h1>
            <p className="text-sm text-gray-500">{customer.email || "—"}</p>
            <p className="text-xs text-gray-400">Customer since {new Date(customer.created_at).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Total Spent", value: `₹${totalSpent.toLocaleString("en-IN")}`, icon: <DollarSign className="h-6 w-6" /> },
          { title: "Orders", value: String(orders.length), icon: <ShoppingCart className="h-6 w-6" /> },
          { title: "Avg. Order Value", value: `₹${Math.round(avgOrderValue).toLocaleString("en-IN")}`, icon: <DollarSign className="h-6 w-6" /> },
          { title: "Member Since", value: new Date(customer.created_at).toLocaleDateString(), icon: <Calendar className="h-6 w-6" /> },
        ].map((card) => (
          <div key={card.title} className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500">{card.title}</p>
                <p className="mt-1 text-lg font-bold text-[#1a1a2e]">{card.value}</p>
              </div>
              <div className="text-gray-300">{card.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-gray-200 bg-white">
            <div className="border-b border-gray-100 px-5 py-4">
              <h2 className="text-sm font-bold text-[#1a1a2e]">Order History</h2>
            </div>
            {orders.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {orders.map((o) => (
                  <Link key={o.id} to="/admin/orders/$id" params={{ id: o.id }} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50">
                    <div>
                      <p className="text-sm font-medium text-[#1a1a2e]">{o.order_number || `#${o.id.slice(0, 8)}`}</p>
                      <p className="text-xs text-gray-400">{new Date(o.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={o.status || "pending"} />
                      <span className="text-sm font-medium">₹{(o.total_amount ?? 0).toLocaleString("en-IN")}</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="px-5 py-8 text-center text-sm text-gray-400">No orders yet</div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="text-sm font-bold text-[#1a1a2e]">Contact</h2>
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">{customer.email || "—"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">{customer.phone || "—"}</span>
              </div>
            </div>
          </div>

          {customer.shipping_address && (
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="text-sm font-bold text-[#1a1a2e]">Default Address</h2>
              <div className="mt-4 flex items-start gap-3 text-sm">
                <MapPin className="mt-0.5 h-4 w-4 text-gray-400" />
                <span className="text-gray-600 whitespace-pre-line">{customer.shipping_address}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
