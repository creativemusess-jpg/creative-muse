import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useCallback } from "react";
import { storefrontSupabase } from "@/lib/supabase-storefront";

export const Route = createFileRoute("/auth/callback")({
  head: () => ({ meta: [{ title: "Signing you in — Creative Muse" }] }),
  component: AuthCallbackPage,
});

function getStoredRedirect(): string | null {
  try {
    const v = sessionStorage.getItem("cm_oauth_redirect");
    sessionStorage.removeItem("cm_oauth_redirect");
    return v && v.startsWith("/") && !v.startsWith("//") ? v : null;
  } catch {
    return null;
  }
}

function AuthCallbackPage() {
  const navigate = useNavigate();
  const handled = useRef(false);

  const goToDestination = useCallback(() => {
    if (handled.current) return;
    handled.current = true;
    const redirect = getStoredRedirect();
    navigate({ to: redirect || "/account" });
  }, [navigate]);

  useEffect(() => {
    if (handled.current) return;

    let timeout: ReturnType<typeof setTimeout>;

    const { data: { subscription } } = storefrontSupabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          if (timeout) clearTimeout(timeout);
          goToDestination();
        }
      },
    );

    storefrontSupabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user && !handled.current) {
        goToDestination();
      }
    });

    timeout = setTimeout(() => {
      if (!handled.current) {
        storefrontSupabase.auth.getSession().then(({ data: { session } }) => {
          if (session?.user) {
            goToDestination();
          } else {
            handled.current = true;
            navigate({ to: "/login" });
          }
        });
      }
    }, 10000);

    return () => {
      if (timeout) clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, [goToDestination, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fdf8f3]">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-[3px] border-[#9C544D] border-t-transparent" />
        <p className="mt-4 font-display text-lg font-semibold text-[#1a1a2e]">Completing sign in…</p>
        <p className="mt-1 text-sm text-[#7a6e64]">You'll be redirected shortly.</p>
      </div>
    </div>
  );
}
