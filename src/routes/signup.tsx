import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { PageShell } from "@/components/site/PageHeader";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
});

function SignupPage() {
  const { signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ fullName: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [field]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName.trim()) { setError("Please enter your full name."); return; }
    if (!form.email.trim()) { setError("Please enter your email."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) { setError("Please enter a valid email address."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (form.password !== form.confirmPassword) { setError("Passwords do not match."); return; }
    if (!acceptTerms) { setError("Please accept the Terms and Privacy Policy."); return; }

    setLoading(true);
    setError("");
    const result = await signUp({ email: form.email.trim().toLowerCase(), password: form.password, fullName: form.fullName.trim(), phone: form.phone.trim() });
    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }
    if (result.needsEmailConfirmation) {
      setSuccess("Account created! Please check your email to confirm your account before signing in.");
    } else {
      navigate({ to: "/account" });
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    await signInWithGoogle();
  };

  return (
    <PageShell>
      <div className="mx-auto flex min-h-[70vh] max-w-[440px] items-center justify-center px-4 py-20">
        <div className="w-full rounded-[28px] bg-white p-8 shadow-[0_4px_24px_rgba(0,0,0,0.05)] sm:p-10">
          <p className="text-[11px] font-semibold tracking-[0.24em] text-[#7A2533] uppercase text-center">Join</p>
          <h1 className="font-display mt-2 text-center text-2xl font-semibold text-[#1a1a2e]">Create Account</h1>
          <p className="mt-1 text-center text-sm text-[#7a6e64]">Become part of the Creative Muse Circle</p>

          {success ? (
            <div className="mt-8 rounded-xl bg-green-50 p-4 text-center">
              <p className="text-sm font-medium text-green-700">{success}</p>
              <Link to="/login" className="btn-primary mt-4 inline-flex">Sign In</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div>
                <label htmlFor="signup-name" className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Full Name</label>
                <input id="signup-name" type="text" value={form.fullName} onChange={update("fullName")} className="w-full rounded-xl border border-[#e0d8cc] px-4 py-3 text-sm outline-none focus:border-[#7A2533]" autoComplete="name" />
              </div>
              <div>
                <label htmlFor="signup-email" className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Email</label>
                <input id="signup-email" type="email" value={form.email} onChange={update("email")} className="w-full rounded-xl border border-[#e0d8cc] px-4 py-3 text-sm outline-none focus:border-[#7A2533]" autoComplete="email" />
              </div>
              <div>
                <label htmlFor="signup-phone" className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Phone (optional)</label>
                <input id="signup-phone" type="tel" value={form.phone} onChange={update("phone")} className="w-full rounded-xl border border-[#e0d8cc] px-4 py-3 text-sm outline-none focus:border-[#7A2533]" autoComplete="tel" />
              </div>
              <div>
                <label htmlFor="signup-password" className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Password</label>
                <div className="relative">
                  <input id="signup-password" type={showPw ? "text" : "password"} value={form.password} onChange={update("password")} className="w-full rounded-xl border border-[#e0d8cc] px-4 py-3 pr-12 text-sm outline-none focus:border-[#7A2533]" autoComplete="new-password" />
                  <button type="button" onClick={() => setShowPw(!showPw)} aria-label={showPw ? "Hide" : "Show"} className="absolute top-1/2 right-3 -translate-y-1/2 text-[#7a6e64]">
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {form.password.length > 0 && form.password.length < 6 && <p className="mt-1 text-xs text-amber-600">At least 6 characters</p>}
              </div>
              <div>
                <label htmlFor="signup-confirm" className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Confirm Password</label>
                <input id="signup-confirm" type="password" value={form.confirmPassword} onChange={update("confirmPassword")} className="w-full rounded-xl border border-[#e0d8cc] px-4 py-3 text-sm outline-none focus:border-[#7A2533]" autoComplete="new-password" />
              </div>

              <label className="flex items-start gap-2 text-sm text-[#7a6e64]">
                <input type="checkbox" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} className="mt-0.5 rounded" />
                <span>I accept the <Link to="/terms" className="text-[#7A2533] underline underline-offset-2">Terms</Link> and <Link to="/privacy-policy" className="text-[#7A2533] underline underline-offset-2">Privacy Policy</Link></span>
              </label>

              {error && <p className="text-sm text-red-500" role="alert">{error}</p>}

              <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-60">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {loading ? "Creating account…" : "Create Account"}
              </button>
            </form>
          )}

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#e0d8cc]" /></div>
            <div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-[#7a6e64]">or</span></div>
          </div>

          <button onClick={handleGoogle} className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#e0d8cc] bg-white px-4 py-3 text-sm font-medium text-[#1a1a2e] transition-colors hover:border-[#7A2533] hover:bg-[#fdf8f3]">
            <svg viewBox="0 0 24 24" className="h-5 w-5"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continue with Google
          </button>

          <p className="mt-6 text-center text-sm text-[#7a6e64]">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-[#7A2533] hover:text-[#7A2533] underline underline-offset-2">Sign In</Link>
          </p>
        </div>
      </div>
    </PageShell>
  );
}
