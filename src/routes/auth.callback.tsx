import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth";
import { storefrontSupabase } from "@/lib/supabase-storefront";

export const Route = createFileRoute("/auth/callback")({
  head: () => ({ meta: [{ title: "Signing you in — Creative Muse" }] }),
  component: AuthCallbackPage,
});

function AuthCallbackPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;

    const finish = async () => {
      const { data: { session } } = await (storefrontSupabase as any).auth.getSession();
      if (session?.user) {
        handled.current = true;
        const redirect = (() => {
          try { return sessionStorage.getItem("cm_oauth_redirect"); } catch { return null; }
        })();
        try { sessionStorage.removeItem("cm_oauth_redirect"); } catch {}
        navigate({ to: (redirect && redirect.startsWith("/")) ? redirect : "/account" });
      } else if (!loading) {
        handled.current = true;
        navigate({ to: "/login" });
      }
    };
    finish();
  }, [user, loading, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fdf8f3]">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-[3px] border-[#C9A96E] border-t-transparent" />
        <p className="mt-4 font-display text-lg font-semibold text-[#1a1a2e]">Completing sign in…</p>
        <p className="mt-1 text-sm text-[#7a6e64]">You'll be redirected shortly.</p>
      </div>
    </div>
  );
}
