import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";
import { PageShell } from "@/components/site/PageHeader";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/reset-password")({
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    setLoading(true);
    setError("");
    const result = await updatePassword(password);
    if (result.error) { setError(result.error); setLoading(false); return; }
    setSuccess(true);
    setLoading(false);
    setTimeout(() => navigate({ to: "/login" }), 3000);
  };

  return (
    <PageShell>
      <div className="mx-auto flex min-h-[60vh] max-w-[440px] items-center justify-center px-4 py-20">
        <div className="w-full rounded-[28px] bg-white p-8 shadow-[0_4px_24px_rgba(0,0,0,0.05)] sm:p-10">
          {success ? (
            <div className="text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
              <h1 className="font-display mt-4 text-xl font-semibold text-[#1a1a2e]">Password Updated</h1>
              <p className="mt-2 text-sm text-[#7a6e64]">Redirecting to sign in…</p>
            </div>
          ) : (
            <>
              <h1 className="font-display text-center text-2xl font-semibold text-[#1a1a2e]">Set New Password</h1>
              <p className="mt-1 text-center text-sm text-[#7a6e64]">Choose a strong password for your account.</p>
              <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                <div>
                  <label htmlFor="rp-password" className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">New Password</label>
                  <div className="relative">
                    <input id="rp-password" type={showPw ? "text" : "password"} value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} className="w-full rounded-xl border border-[#e0d8cc] px-4 py-3 pr-12 text-sm outline-none focus:border-[#7A2533]" autoComplete="new-password" />
                    <button type="button" onClick={() => setShowPw(!showPw)} aria-label={showPw ? "Hide" : "Show"} className="absolute top-1/2 right-3 -translate-y-1/2 text-[#7a6e64]">{showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                  </div>
                  {password.length > 0 && password.length < 6 && <p className="mt-1 text-xs text-amber-600">At least 6 characters</p>}
                </div>
                <div>
                  <label htmlFor="rp-confirm" className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Confirm Password</label>
                  <input id="rp-confirm" type="password" value={confirm} onChange={(e) => { setConfirm(e.target.value); setError(""); }} className="w-full rounded-xl border border-[#e0d8cc] px-4 py-3 text-sm outline-none focus:border-[#7A2533]" autoComplete="new-password" />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-60">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {loading ? "Updating…" : "Update Password"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </PageShell>
  );
}
