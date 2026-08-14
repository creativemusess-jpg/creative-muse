import { useState, useEffect, useRef, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { adminApi, type AdminSession } from "@/lib/api/admin";
import { clearGuardCache } from "@/lib/auth-guard";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Mail,
  Tag,
  Settings,
  LogOut,
  Menu,
  X,
  Clock,
  ChevronRight,
  Home,
  MessageSquare,
  Layers,
  Search,
  ExternalLink,
  PackageOpen,
  BarChart3,
  UserCog,
  FileText,
  Image,
  Video,
  Flag,
  ListChecks,
  Clapperboard,
} from "lucide-react";
import { GlobalSearch } from "./GlobalSearch";

let cachedSessionPromise: Promise<AdminSession | null> | null = null;
let cachedSessionValue: AdminSession | null | undefined = undefined;

interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
  permission?: string;
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: <LayoutDashboard className="h-4 w-4" /> },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: <ShoppingCart className="h-4 w-4" />,
    permission: "orders",
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: <Package className="h-4 w-4" />,
    permission: "products",
  },
  {
    label: "Categories",
    href: "/admin/categories",
    icon: <PackageOpen className="h-4 w-4" />,
    permission: "categories",
  },
  {
    label: "Category Hero",
    href: "/admin/category-hero",
    icon: <Clapperboard className="h-4 w-4" />,
    permission: "categories",
  },
  {
    label: "Subcategories",
    href: "/admin/subcategories",
    icon: <Layers className="h-4 w-4" />,
    permission: "categories",
  },
  {
    label: "Collections",
    href: "/admin/collections",
    icon: <FileText className="h-4 w-4" />,
    permission: "products",
  },
  {
    label: "Inventory",
    href: "/admin/inventory",
    icon: <PackageOpen className="h-4 w-4" />,
    permission: "products",
  },
  {
    label: "Product Flags",
    href: "/admin/product-flags",
    icon: <Flag className="h-4 w-4" />,
    permission: "products",
  },
  {
    label: "Attributes",
    href: "/admin/attributes",
    icon: <ListChecks className="h-4 w-4" />,
    permission: "products",
  },
  {
    label: "Customers",
    href: "/admin/customers",
    icon: <Users className="h-4 w-4" />,
    permission: "customers",
  },
  {
    label: "Coupons",
    href: "/admin/coupons",
    icon: <Tag className="h-4 w-4" />,
    permission: "coupons",
  },
  {
    label: "Analytics",
    href: "/admin/analytics",
    icon: <BarChart3 className="h-4 w-4" />,
    permission: "*",
  },
  {
    label: "Content",
    href: "/admin/homepage",
    icon: <Home className="h-4 w-4" />,
    permission: "homepage",
  },
  {
    label: "Enquiries",
    href: "/admin/enquiries",
    icon: <MessageSquare className="h-4 w-4" />,
    permission: "enquiries",
  },
  {
    label: "Newsletter",
    href: "/admin/newsletter",
    icon: <Mail className="h-4 w-4" />,
    permission: "newsletter",
  },
  {
    label: "Media",
    href: "/admin/media",
    icon: <Image className="h-4 w-4" />,
    permission: "media",
  },
  {
    label: "Shoppable Reels",
    href: "/admin/reels",
    icon: <Video className="h-4 w-4" />,
    permission: "homepage",
  },
  {
    label: "Hero Media",
    href: "/admin/hero-media",
    icon: <Layers className="h-4 w-4" />,
    permission: "homepage",
  },
  { label: "Staff", href: "/admin/staff", icon: <UserCog className="h-4 w-4" />, permission: "*" },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: <Settings className="h-4 w-4" />,
    permission: "*",
  },
  {
    label: "Audit Logs",
    href: "/admin/audit-logs",
    icon: <Clock className="h-4 w-4" />,
    permission: "*",
  },
];

function hasAccess(item: NavItem, session: AdminSession | null): boolean {
  if (!session) return false;
  if (!item.permission) return true;
  return session.permissions.includes("*") || session.permissions.includes(item.permission);
}

export function AdminLayout({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!cachedSessionPromise) {
      cachedSessionPromise = adminApi.getCurrentUser().then((s) => {
        cachedSessionValue = s;
        return s;
      });
    }
    if (cachedSessionValue !== undefined) {
      setSession(cachedSessionValue);
      setLoading(false);
      if (!cachedSessionValue) navigate({ to: "/admin/login" });
      return;
    }
    cachedSessionPromise.then((s) => {
      setSession(s);
      setLoading(false);
      if (!s) navigate({ to: "/admin/login" });
    });
  }, [navigate]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleLogout = async () => {
    await adminApi.logout();
    cachedSessionPromise = null;
    cachedSessionValue = undefined;
    clearGuardCache();
    navigate({ to: "/admin/login" });
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f8f9fa]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#7A2533] border-t-transparent" />
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  const isActive = (href: string) => {
    if (href === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(href);
  };

  const visibleItems = navItems.filter((item) => hasAccess(item, session));

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white transition-transform duration-300 lg:relative lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
          <Link to="/admin" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1a1a2e] font-display text-xs font-bold text-white">
              CM
            </span>
            <span className="font-display text-base font-bold text-[#1a1a2e]">Admin</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-3">
          {visibleItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive(item.href) ? "bg-[#1a1a2e] text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-gray-200 p-3">
          <div className="mb-2 flex items-center gap-3 rounded-lg px-2 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1a1a2e] text-xs font-bold text-white">
              {session.user.email.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 truncate">
              <p className="text-sm font-medium text-gray-900 truncate">
                {session.profile?.full_name || session.user.email}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {session.roles.map((r) => r.name.replace("_", " ")).join(", ")}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm text-gray-400 hover:border-gray-300 md:flex"
            >
              <Search className="h-4 w-4" />
              <span>Search...</span>
              <span className="rounded border border-gray-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-gray-400">
                Ctrl+K
              </span>
            </button>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/"
              target="_blank"
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">View Site</span>
            </Link>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Link to="/" className="hover:text-[#7A2533]">
                Site
              </Link>
              <ChevronRight className="h-3 w-3" />
              <span className="font-medium text-gray-900">Admin</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}

export function AdminPageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-[#1a1a2e]">{title}</h1>
        {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}

export function AdminCard({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string;
  value: string;
  subtitle?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-1 text-2xl font-bold text-[#1a1a2e]">{value}</p>
          {subtitle && <p className="mt-1 text-xs text-gray-400">{subtitle}</p>}
        </div>
        {icon && <div className="text-gray-300">{icon}</div>}
      </div>
    </div>
  );
}

export function AdminLoading() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#7A2533] border-t-transparent" />
    </div>
  );
}

export function AdminTable({ headers, children }: { headers: string[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50">
            {headers.map((h) => (
              <th
                key={h}
                className="px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">{children}</tbody>
      </table>
    </div>
  );
}

export function AdminEmpty({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
        <Package className="h-8 w-8 text-gray-400" />
      </div>
      <p className="mt-4 text-lg font-semibold text-gray-600">{title}</p>
      {description && <p className="mt-1 text-sm text-gray-400">{description}</p>}
    </div>
  );
}
