import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout, AdminCard, AdminPageHeader, AdminLoading } from "@/components/admin/AdminLayout";
import { productsApi } from "@/lib/api/products";
import { ordersApi } from "@/lib/api/orders";
import { customersApi } from "@/lib/api/customers";
import { newsletterApi } from "@/lib/api/newsletter";
import { Package, ShoppingCart, Users, Mail, AlertTriangle, TrendingUp, DollarSign } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      productsApi.list({ per_page: 1 }),
      productsApi.list({ status: "active", per_page: 1 }),
      productsApi.list({ status: "draft", per_page: 1 }),
      ordersApi.list({ per_page: 1 }),
      ordersApi.list({ status: "pending", per_page: 1 }),
      customersApi.list({ per_page: 1 }),
      newsletterApi.list({ per_page: 1 }),
    ]).then(([all, active, draft, orders, pending, customers, newsletter]) => {
      setStats({
        totalProducts: all.count,
        activeProducts: active.count,
        draftProducts: draft.count,
        totalOrders: orders.count,
        pendingOrders: pending.count,
        totalCustomers: customers.count,
        subscriberCount: newsletter.count,
      });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <AdminLayout><AdminLoading /></AdminLayout>;

  return (
    <AdminLayout>
      <AdminPageHeader title="Dashboard" description="Overview of your jewellery store" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminCard
          title="Total Products"
          value={String(stats?.totalProducts ?? 0)}
          subtitle={`${stats?.activeProducts ?? 0} active, ${stats?.draftProducts ?? 0} draft`}
          icon={<Package className="h-8 w-8" />}
        />
        <AdminCard
          title="Orders"
          value={String(stats?.totalOrders ?? 0)}
          subtitle={`${stats?.pendingOrders ?? 0} pending`}
          icon={<ShoppingCart className="h-8 w-8" />}
        />
        <AdminCard
          title="Customers"
          value={String(stats?.totalCustomers ?? 0)}
          icon={<Users className="h-8 w-8" />}
        />
        <AdminCard
          title="Newsletter"
          value={String(stats?.subscriberCount ?? 0)}
          subtitle="subscribers"
          icon={<Mail className="h-8 w-8" />}
        />
      </div>

      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-bold text-[#1a1a2e]">Quick Actions</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <a
            href="/admin/products/new"
            className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:border-[#c9a96e]"
          >
            <Package className="h-5 w-5 text-[#c9a96e]" />
            <div>
              <p className="text-sm font-semibold text-[#1a1a2e]">Add Product</p>
              <p className="text-xs text-gray-500">Create a new jewellery product</p>
            </div>
          </a>
          <a
            href="/admin/orders"
            className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:border-[#c9a96e]"
          >
            <ShoppingCart className="h-5 w-5 text-[#c9a96e]" />
            <div>
              <p className="text-sm font-semibold text-[#1a1a2e]">View Orders</p>
              <p className="text-xs text-gray-500">Manage customer orders</p>
            </div>
          </a>
          <a
            href="/admin/homepage"
            className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:border-[#c9a96e]"
          >
            <TrendingUp className="h-5 w-5 text-[#c9a96e]" />
            <div>
              <p className="text-sm font-semibold text-[#1a1a2e]">Edit Homepage</p>
              <p className="text-xs text-gray-500">Update homepage content</p>
            </div>
          </a>
        </div>
      </div>

      {(!stats || stats.totalProducts === 0) && (
        <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-6">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <p className="text-sm font-medium text-amber-800">
              Your database is empty. Run the seed migration to populate products, categories, and content.
            </p>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
