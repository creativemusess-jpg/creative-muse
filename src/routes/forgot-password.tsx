import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, CheckCircle } from "lucide-react";
import { PageShell } from "@/components/site/PageHeader";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    setError("");
    const result = await resetPassword(email.trim().toLowerCase());
    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }
    setSent(true);
    setLoading(false);
  };

  return (
    <PageShell>
      <div className="mx-auto flex min-h-[60vh] max-w-[440px] items-center justify-center px-4 py-20">
        <div className="w-full rounded-[28px] bg-white p-8 shadow-[0_4px_24px_rgba(0,0,0,0.05)] sm:p-10">
          {sent ? (
            <div className="text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
              <h1 className="font-display mt-4 text-xl font-semibold text-[#1a1a2e]">Check Your Email</h1>
              <p className="mt-2 text-sm text-[#7a6e64]">We've sent a password reset link to <strong>{email}</strong></p>
              <Link to="/login" className="btn-primary mt-6 inline-flex">Back to Sign In</Link>
            </div>
          ) : (
            <>
              <h1 className="font-display text-center text-2xl font-semibold text-[#1a1a2e]">Forgot Password</h1>
              <p className="mt-1 text-center text-sm text-[#7a6e64]">Enter your email and we'll send you a reset link.</p>
              <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                <div>
                  <label htmlFor="fp-email" className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Email</label>
                  <input id="fp-email" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} className="w-full rounded-xl border border-[#e0d8cc] px-4 py-3 text-sm outline-none focus:border-[#7A2533]" />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-60">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {loading ? "Sending…" : "Send Reset Link"}
                </button>
              </form>
              <p className="mt-6 text-center text-sm text-[#7a6e64]">
                Remember your password?{" "}
                <Link to="/login" className="font-semibold text-[#7A2533] underline underline-offset-2">Sign In</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </PageShell>
  );
}
