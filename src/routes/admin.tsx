import { Outlet, createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { requireAdmin } from "@/lib/auth-guard";

export const Route = createFileRoute("/admin")({
  beforeLoad: requireAdmin,
  component: AdminShell,
});

function AdminShell() {
  // Persistent admin shell: sidebar, header, notifications and session stay
  // mounted across navigations between admin sections. Only the <Outlet/>
  // content changes.
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}