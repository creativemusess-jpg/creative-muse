import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { User, Package, LogOut, Mail, Phone, ShieldCheck } from "lucide-react";
import { PageShell } from "@/components/site/PageHeader";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/account")({
  head: () => ({ meta: [{ title: "My Account — Creative Muse" }] }),
  component: AccountPage,
});

function AccountPage() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/login", search: { redirect: "/account" } });
    }
  }, [user, loading, navigate]);

  if (loading || !user) {
    return (
      <PageShell>
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#C9A96E] border-t-transparent" />
        </div>
      </PageShell>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  return (
    <PageShell>
      <section className="mx-auto max-w-[900px] px-6 py-16">
        <div className="mb-8">
          <p className="eyebrow text-[10px]">Account</p>
          <h1 className="font-display text-3xl font-semibold text-[#1a1a2e]">My Account</h1>
          <p className="mt-1 text-sm text-[#7a6e64]">Manage your profile and orders.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-[24px] bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.05)] md:col-span-2">
            <h2 className="font-display text-lg font-semibold text-[#1a1a2e]">Profile</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-[#C9A96E]" />
                <span className="text-[#7a6e64]">Name:</span>
                <span className="font-medium text-[#1a1a2e]">{user.fullName}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-[#C9A96E]" />
                <span className="text-[#7a6e64]">Email:</span>
                <span className="font-medium text-[#1a1a2e]">{user.email}</span>
              </div>
              {user.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-[#C9A96E]" />
                  <span className="text-[#7a6e64]">Phone:</span>
                  <span className="font-medium text-[#1a1a2e]">{user.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-4 w-4 text-[#C9A96E]" />
                <span className="text-[#7a6e64]">Sign-in method:</span>
                <span className="font-medium capitalize text-[#1a1a2e]">{user.provider}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Link
              to="/account/orders"
              className="flex items-center gap-3 rounded-[24px] bg-white p-5 shadow-[0_4px_24px_rgba(0,0,0,0.05)] transition-colors hover:bg-[#f5efe8]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fdf8f3]">
                <Package className="h-5 w-5 text-[#C9A96E]" />
              </div>
              <div>
                <p className="font-display text-sm font-semibold text-[#1a1a2e]">My Orders</p>
                <p className="text-[11px] text-[#7a6e64]">View order history</p>
              </div>
            </Link>

            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-3 rounded-[24px] bg-white p-5 shadow-[0_4px_24px_rgba(0,0,0,0.05)] transition-colors hover:bg-red-50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fdf8f3]">
                <LogOut className="h-5 w-5 text-red-500" />
              </div>
              <div className="text-left">
                <p className="font-display text-sm font-semibold text-[#1a1a2e]">Sign Out</p>
                <p className="text-[11px] text-[#7a6e64]">Log out of your account</p>
              </div>
            </button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
