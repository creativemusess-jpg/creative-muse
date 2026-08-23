import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { adminApi } from "@/lib/api/admin";
import { clearGuardCache } from "@/lib/auth-guard";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin_/login")({
  component: AdminLoginPage,
});

const ADMIN_REMEMBER_EMAIL_KEY = "cm_admin_remembered_email";

function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const rememberedEmail = localStorage.getItem(ADMIN_REMEMBER_EMAIL_KEY);
      if (rememberedEmail) {
        setEmail(rememberedEmail);
        setRememberMe(true);
      }
    } catch {}
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      clearGuardCache();
      await adminApi.login(email, password);
      try {
        if (rememberMe) {
          localStorage.setItem(ADMIN_REMEMBER_EMAIL_KEY, email.trim().toLowerCase());
        } else {
          localStorage.removeItem(ADMIN_REMEMBER_EMAIL_KEY);
        }
      } catch {}
      navigate({ to: "/admin" });
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#1a1a2e] to-[#2d1b4e] p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-bold text-white">Creative Muse</h1>
          <p className="mt-2 text-sm text-[#9C544D]">Admin Panel</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white p-8 shadow-2xl"
        >
          <h2 className="text-xl font-bold text-[#1a1a2e]">Sign In</h2>
          <p className="mt-1 text-sm text-gray-500">Enter your credentials to access the admin panel</p>

          {error && (
            <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="creativemusess@gmail.com"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#9C544D] focus:ring-1 focus:ring-[#9C544D]"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 pr-10 text-sm outline-none focus:border-[#9C544D] focus:ring-1 focus:ring-[#9C544D]"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-gray-300 accent-[#9C544D]"
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <Link to="/forgot-password" search={{ mode: "admin" }} className="text-sm text-[#9C544D] hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1a1a2e] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#2d1b4e] disabled:opacity-60"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} Creative Muse Fine Jewellery
        </p>
      </div>
    </div>
  );
}
