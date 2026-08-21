import { useState, useEffect, useCallback } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AdminLayout, AdminPageHeader, AdminLoading } from "@/components/admin/AdminLayout";
import { notificationsApi, type AdminNotification } from "@/lib/api/notifications";
import { Bell, CheckCheck, ShoppingCart, PackageOpen, X, MessageSquare } from "lucide-react";

import { requireAdmin } from "@/lib/auth-guard";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin/notifications")({
  beforeLoad: requireAdmin,
  component: NotificationsCenter,
});

const timeAgo = (iso: string): string => {
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (seconds < 60) return "just now";
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins} minutes ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  return days === 1 ? "yesterday" : `${days} days ago`;
};

function typeIcon(type: string) {
  switch (type) {
    case "new_order":
      return <ShoppingCart className="h-4 w-4" />;
    case "new_enquiry":
      return <MessageSquare className="h-4 w-4" />;
    default:
      return <Bell className="h-4 w-4" />;
  }
}

function NotificationsCenter() {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const rows = await notificationsApi.list({ limit: 100 });
      setNotifications(rows);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load notifications");
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  // Realtime subscription for new notifications
  useEffect(() => {
    const channel = supabase
      .channel("admin-notifications-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications" },
        (payload) => {
          const newNotification = payload.new as AdminNotification;
          setNotifications((prev) => [newNotification, ...prev]);
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "notifications" },
        (payload) => {
          const updatedNotification = payload.new as AdminNotification;
          setNotifications((prev) =>
            prev.map((n) => (n.id === updatedNotification.id ? updatedNotification : n))
          );
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "notifications" },
        (payload) => {
          setNotifications((prev) => prev.filter((n) => n.id !== payload.old.id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchNotifications, setNotifications]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

const openNotification = async (n: AdminNotification) => {
    if (!n.is_read) {
      try {
        await notificationsApi.markRead(n.id);
        fetchNotifications();
      } catch {
        /* ignore */
      }
    }
    if (n.entity_type === "order" && n.entity_id) {
      navigate({ to: "/admin/orders/$id", params: { id: n.entity_id } });
    } else if (n.entity_type === "enquiry" && n.entity_id) {
      navigate({ to: "/admin/enquiries" });
    } else {
      navigate({ to: "/admin/notifications" });
    }
  };

  const markAllRead = async () => {
    try {
      await notificationsApi.markAllRead();
      fetchNotifications();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not mark notifications as read");
    }
  };

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Notifications"
        description={unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "All caught up"}
        actions={
          unreadCount > 0 ? (
            <button
              onClick={markAllRead}
              className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <CheckCheck className="h-4 w-4" /> Mark all read
            </button>
          ) : undefined
        }
      />

      {loading ? (
        <AdminLoading />
      ) : error ? (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
          <X className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-semibold">Could not load notifications</p>
            <p className="mt-1 text-sm">{error}</p>
            <button onClick={fetchNotifications} className="mt-3 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700">
              Retry
            </button>
          </div>
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border border-gray-200 bg-white py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <Bell className="h-8 w-8 text-gray-400" />
          </div>
          <p className="mt-4 text-lg font-semibold text-gray-600">No notifications</p>
          <p className="mt-1 text-sm text-gray-400">When a customer places an order you&apos;ll see it here.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="divide-y divide-gray-100">
            {notifications.map((n) => {
              const Icon = () => typeIcon(n.type);
              return (
                <button
                  key={n.id}
                  onClick={() => openNotification(n)}
                  className={`flex w-full items-start gap-4 px-5 py-4 text-left transition-colors hover:bg-gray-50 ${
                    !n.is_read ? "bg-[#7A2533]/5" : ""
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                      n.is_read ? "bg-gray-100 text-gray-400" : "bg-[#7A2533]/10 text-[#7A2533]"
                    }`}
                  >
                    <Icon />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      {!n.is_read && <span className="h-2 w-2 shrink-0 rounded-full bg-[#7A2533]" />}
                      <span className={`text-sm ${n.is_read ? "font-medium text-gray-600" : "font-semibold text-[#1a1a2e]"}`}>
                        {n.title}
                      </span>
                    </span>
                    {n.message && <span className="mt-0.5 block text-sm text-gray-500">{n.message}</span>}
                    <span className="mt-1 block text-[11px] uppercase tracking-wider text-gray-400">
                      {n.type.replace(/_/g, " ")} · {timeAgo(n.created_at)}
                    </span>
                  </span>
                  {!n.is_read ? (
                    <span className="shrink-0 rounded-full bg-[#7A2533] px-2 py-0.5 text-[10px] font-bold text-white">
                      UNREAD
                    </span>
                  ) : (
                    <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-500">
                      READ
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}