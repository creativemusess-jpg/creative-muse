import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { safeInternalRedirect, takeStoredOAuthRedirect } from "@/lib/auth-redirect";
import { storefrontSupabase } from "@/lib/supabase-storefront";

export const Route = createFileRoute("/auth/callback")({
  head: () => ({ meta: [{ title: "Signing you in - Creative Muse" }] }),
  component: AuthCallbackPage,
});

function AuthCallbackPage() {
  const navigate = useNavigate();
  const handled = useRef(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (handled.current) return;
    let cancelled = false;

    const exchangeAndNavigate = async () => {
      const url = new URL(window.location.href);
      const storedRedirect = takeStoredOAuthRedirect();
      const destination = safeInternalRedirect(
        url.searchParams.get("redirect") || storedRedirect,
      );
      const code = url.searchParams.get("code");

      if (code) {
        const { error } = await storefrontSupabase.auth.exchangeCodeForSession(code);
        if (error) {
          if (!cancelled) setError(error.message || "Google sign-in could not be completed.");
          return;
        }
        window.history.replaceState({}, "", url.pathname);
      }

      const {
        data: { session },
      } = await storefrontSupabase.auth.getSession();
      if (!session?.user) {
        if (!cancelled) setError("Google sign-in could not restore your session. Please try again.");
        return;
      }

      if (cancelled) return;
      handled.current = true;
      navigate({ to: destination });
    };

    exchangeAndNavigate().catch((err) => {
      if (!cancelled) {
        setError(err instanceof Error ? err.message : "Google sign-in could not be completed.");
      }
    });

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fdf8f3]">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-[3px] border-[#9C544D] border-t-transparent" />
        <p className="mt-4 font-display text-lg font-semibold text-[#1a1a2e]">
          Completing sign in...
        </p>
        <p className="mt-1 text-sm text-[#7a6e64]">
          {error || "You'll be redirected shortly."}
        </p>
      </div>
    </div>
  );
}
