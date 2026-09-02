import { useState, useEffect } from "react";
import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import {
  AdminLayout,
  AdminPageHeader,
  AdminLoading,
  AdminEmpty,
} from "@/components/admin/AdminLayout";
import { ordersApi } from "@/lib/api/orders";
import type { OrderRow } from "@/lib/db/types";
import { Search, Filter, X } from "lucide-react";

import { requireAdmin } from "@/lib/auth-guard";

export const Route = createFileRoute("/admin/orders")({
  beforeLoad: requireAdmin,
  component: AdminOrders,
});

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  processing: "bg-indigo-100 text-indigo-700",
  shipped: "bg-purple-100 text-purple-700",
  out_for_delivery: "bg-orange-100 text-orange-700",
  delivered: "bg-green-100 text-green-600",
  cancelled: "bg-red-100 text-red-600",
  returned: "bg-gray-100 text-gray-600",
  refunded: "bg-pink-100 text-pink-700",
};

function statusColorClass(status: string) {
  return statusColors[status] || "bg-gray-100 text-gray-600";
}

function formatPrice(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

function orderStatusLabel(status: string) {
  return status.replace(/_/g, " ").toLowerCase();
}

function AdminOrders() {
  const location = useLocation();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchOrders = async () => {
    try {
      const result = await ordersApi.list({
        search: search || undefined,
        status: statusFilter || undefined,
        per_page: 100,
      });
      setOrders(result.data);
      setCount(result.count);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [search, statusFilter]);

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await ordersApi.updateStatus(id, status);
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  if (location.pathname !== "/admin/orders") return <Outlet />;

  return (
    <AdminLayout>
      <AdminPageHeader title="Orders" description={`${count} orders total`} />

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-sm outline-none focus:border-[#9C544D]"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setSearch("");
          }}
          className="mt-2 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#9C544D]"
        >
          <option value="">All Status</option>
          {Object.keys(statusColors).map((s) => (
            <option key={s} value={s}>
              {s.replace(/_/g, " ")}
            </option>
          ))}
        </select>
      </div>

      {count === 0 ? (
        <AdminEmpty
          title="No orders yet"
          description="Orders will appear here when customers make purchases"
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-xl border border-gray-200 bg-white overflow-hidden hover:border-[#e0d8cc] transition-colors"
            >
              <div className="p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-[#1a1a2e]">{order.order_number}</p>
                    <p className="text-sm text-gray-500">
                      {order.customer_name || order.customer_email?.split("@")[0] || "—"}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase ${statusColorClass(order.order_status)}`}
                  >
                    {orderStatusLabel(order.order_status).toUpperCase()}
                  </span>
                </div>

                <p className="text-gray-500 line-clamp-1">{order.customer_phone || "—"}</p>

                {(order as any)?._items?.length > 0 ? (
                  <div className="flex items-center gap-2">
                    {(order as any)?._items.slice(0, 3).map((item: any, i: number) => (
                      <div
                        key={i}
                        className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border-2 border-white bg-gray-100"
                      >
                        {item.productImage ? (
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="h-full w-full object-contain p-0"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[10px] text-gray-400">
                            {item.productName?.[0] || "?"}
                          </div>
                        )}
                      </div>
                    ))}
                    {(order as any)?._items.length > 1 && (
                      <p className="text-[11px] text-gray-500 ml-2">
                        +{(order as any)?._items.length - 1} more
                      </p>
                    )}
                  </div>
                ) : (
                  <span className="text-xs text-gray-400">—</span>
                )}

                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">
                    {formatPrice(order.total_amount)}
                  </span>
                  {order.payment_status === "paid" && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold text-green-600">
                      PAID
                    </span>
                  )}
                </div>

                <p className="text-xs text-gray-500 line-clamp-1">
                  {new Date(order.created_at).toLocaleDateString()}
                </p>

                <div className="mt-3 flex items-center gap-2">
                  <Link
                    to="/admin/orders/$id"
                    params={{ id: order.id }}
                    className="flex-1 rounded-lg p-2.5 text-sm font-medium text-[#9C544D] hover:bg-[#fdf8f3] transition-colors"
                    aria-label="View order details"
                  >
                    View Order
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
