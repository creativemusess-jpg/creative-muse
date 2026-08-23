import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { PageShell } from "@/components/site/PageHeader";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const search: any = useSearch({ from: "/login" });
  const redirect =
    typeof search.redirect === "string" &&
    search.redirect.startsWith("/") &&
    !search.redirect.startsWith("//")
      ? search.redirect
      : "/account";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim() || !password) { setError("Please enter email and password."); return; }
    setLoading(true);
    setError("");
    const result = await signIn(email.trim().toLowerCase(), password);
    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }
    navigate({ to: redirect });
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    setError("");
    const result = await signInWithGoogle(redirect);
    if (result?.error) {
      setGoogleLoading(false);
      setError("Google Sign-In is not configured yet. Please use email login or contact the administrator.");
    }
  };

  return (
    <PageShell>
      <div className="mx-auto flex min-h-[70vh] max-w-[440px] items-center justify-center px-4 py-20">
        <div className="w-full rounded-[28px] bg-white p-8 shadow-[0_4px_24px_rgba(0,0,0,0.05)] sm:p-10">
          <p className="text-[11px] font-semibold tracking-[0.24em] text-[#9C544D] uppercase text-center">Welcome</p>
          <h1 className="font-display mt-2 text-center text-2xl font-semibold text-[#1a1a2e]">Sign In</h1>
          <p className="mt-1 text-center text-sm text-[#7a6e64]">Sign in to your Creative Muse account</p>

          <form onSubmit={handleLogin} className="mt-8 space-y-4">
            <div>
              <label htmlFor="login-email" className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Email</label>
              <input id="login-email" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} className="w-full rounded-xl border border-[#e0d8cc] px-4 py-3 text-sm outline-none focus:border-[#9C544D] focus:ring-1 focus:ring-[#9C544D]/30" placeholder="your@email.com" autoComplete="email" />
            </div>
            <div>
              <label htmlFor="login-password" className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Password</label>
              <div className="relative">
                <input id="login-password" type={showPw ? "text" : "password"} value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} className="w-full rounded-xl border border-[#e0d8cc] px-4 py-3 pr-12 text-sm outline-none focus:border-[#9C544D] focus:ring-1 focus:ring-[#9C544D]/30" autoComplete="current-password" />
                <button type="button" onClick={() => setShowPw(!showPw)} aria-label={showPw ? "Hide password" : "Show password"} className="absolute top-1/2 right-3 -translate-y-1/2 text-[#7a6e64] hover:text-[#1a1a2e]">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-red-500" role="alert">{error}</p>}

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-60">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="mt-4 text-center">
            <Link to="/forgot-password" className="text-xs font-medium text-[#9C544D] hover:text-[#9C544D] underline underline-offset-2">Forgot password?</Link>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#e0d8cc]" /></div>
            <div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-[#7a6e64]">or</span></div>
          </div>

          <button onClick={handleGoogle} disabled={googleLoading} className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#e0d8cc] bg-white px-4 py-3 text-sm font-medium text-[#1a1a2e] transition-colors hover:border-[#9C544D] hover:bg-[#fdf8f3] disabled:opacity-60">
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            {googleLoading ? "Redirecting…" : "Continue with Google"}
          </button>

          <p className="mt-6 text-center text-sm text-[#7a6e64]">
            Don't have an account?{" "}
            <Link to="/signup" className="font-semibold text-[#9C544D] hover:text-[#9C544D] underline underline-offset-2">Create Account</Link>
          </p>
        </div>
      </div>
    </PageShell>
  );
}
