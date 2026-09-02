import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { storefrontSupabase as supabase } from "./supabase-storefront";

export type CustomerInfo = {
  id: string;
  authUserId: string;
  email: string;
  fullName: string;
  phone: string;
  avatarUrl: string | null;
  provider: string;
};

type AuthCtx = {
  user: CustomerInfo | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (params: { email: string; password: string; fullName: string; phone?: string }) => Promise<{ error: string | null; needsEmailConfirmation?: boolean }>;
  signOut: () => Promise<void>;
  signInWithGoogle: (redirectTo?: string) => Promise<{ error: string | null }>;
  resetPassword: (email: string, mode?: "customer" | "admin") => Promise<{ error: string | null }>;
  updatePassword: (password: string) => Promise<{ error: string | null }>;
  refreshCustomer: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

function canonicalOrigin(): string {
  if (typeof window === "undefined") return "https://www.creativemusee.com";
  const host = window.location.hostname;
  if (host === "creativemusee.com" || host === "www.creativemusee.com") {
    return "https://www.creativemusee.com";
  }
  return window.location.origin;
}

async function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  let t: ReturnType<typeof setTimeout>;
  const timeout = new Promise<never>((_, reject) => {
    t = setTimeout(() => reject(new Error(`${label} timed out`)), ms);
  });
  try {
    return await Promise.race([p, timeout]);
  } finally {
    clearTimeout(t!);
  }
}

async function ensureCustomer(authUser: any): Promise<{ customer: CustomerInfo | null; error: string | null }> {
  if (!authUser) return { customer: null, error: null };

  const { data: existing } = await withTimeout(
    (supabase as any).from("customers").select("*").eq("auth_user_id", authUser.id).maybeSingle() as Promise<any>,
    7000,
    "customer lookup"
  ).catch(() => ({ data: null } as any));

  if (existing) {
    const { error: updErr } = await withTimeout(
      (supabase as any).from("customers").update({ last_login_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq("id", existing.id) as Promise<any>,
      4000,
      "last_login update"
    ).catch((e: any) => ({ error: e } as any));
    if (updErr) console.error("Failed to update last_login:", updErr);

    return { customer: {
      id: existing.id,
      authUserId: existing.auth_user_id,
      email: existing.email,
      fullName: existing.full_name || "",
      phone: existing.phone || "",
      avatarUrl: existing.avatar_url || null,
      provider: existing.provider || "email",
    }, error: null };
  }

  const metadata = authUser.user_metadata || {};
  const newCustomer = {
    auth_user_id: authUser.id,
    email: authUser.email || metadata.email || "",
    full_name: metadata.full_name || metadata.name || authUser.email?.split("@")[0] || "Customer",
    phone: metadata.phone || "",
    avatar_url: metadata.avatar_url || metadata.picture || null,
    provider: metadata.provider || "email",
    account_status: "active",
    last_login_at: new Date().toISOString(),
  };

  const { data: inserted, error } = await withTimeout(
    (supabase as any).from("customers").insert(newCustomer).select().single() as Promise<any>,
    7000,
    "customer create"
  ).catch((e: any) => ({ data: null, error: e } as any));

  if (error) {
    console.error("Failed to create customer profile:", error.message, error);
    return { customer: null, error: error.message };
  }

  return { customer: {
    id: inserted.id,
    authUserId: inserted.auth_user_id,
    email: inserted.email,
    fullName: inserted.full_name || "",
    phone: inserted.phone || "",
    avatarUrl: inserted.avatar_url || null,
    provider: inserted.provider || "email",
  }, error: null };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CustomerInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshCustomer = useCallback(async () => {
    try {
      const sessionResult = await withTimeout(supabase.auth.getSession() as Promise<any>, 7000, "getSession").catch(() => ({ data: { session: null } } as any));
      const session = sessionResult?.data?.session || null;
      console.info("[AUTH] refreshCustomer", { hasSession: !!session, hasUser: !!session?.user });
      if (session?.user) {
        const { customer } = await ensureCustomer(session.user);
        console.info("[CHECKOUT_DIAG] customer", { found: !!customer });
        setUser(customer);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("[AUTH] refreshCustomer failed:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    console.info("[CHECKOUT_DIAG] AuthProvider init");
    refreshCustomer();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.info("[CHECKOUT_DIAG] onAuthStateChange", { event: _event, hasSession: !!session });
      try {
        if (session?.user) {
          const { customer } = await withTimeout(ensureCustomer(session.user), 8000, "ensureCustomer:authChange").catch(() => ({ customer: null } as any));
          setUser(customer);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("[AUTH] onAuthStateChange error:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });
    const safety = setTimeout(() => {
      setLoading((prev) => {
        if (prev) console.error("[AUTH] safety timeout forced loading false");
        return false;
      });
    }, 8000);
    return () => {
      clearTimeout(safety);
      subscription.unsubscribe();
    };
  }, [refreshCustomer]);

  const signIn = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    if (error) return { error: error.message };
    if (!data.user || !data.session) {
      return { error: "Login failed. Please try again." };
    }
    const { customer, error: profileError } = await ensureCustomer(data.user);
    if (!customer) {
      await supabase.auth.signOut();
      return { error: profileError || "Login succeeded, but customer profile could not be loaded." };
    }
    setUser(customer);
    setLoading(false);
    return { error: null };
  }, []);

  const signUp = useCallback(async (params: { email: string; password: string; fullName: string; phone?: string }) => {
    const { data, error } = await supabase.auth.signUp({
      email: params.email,
      password: params.password,
      options: {
        data: {
          full_name: params.fullName,
          phone: params.phone || "",
        },
      },
    });
    if (error) return { error: error.message };
    if (data.user && data.session) {
      const { customer } = await ensureCustomer(data.user);
      if (customer) {
        setUser(customer);
        setLoading(false);
      }
    }
    return {
      error: null,
      needsEmailConfirmation: !data.session,
    };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  const signInWithGoogle = useCallback(async (redirectTo?: string) => {
    if (redirectTo) {
      try { sessionStorage.setItem("cm_oauth_redirect", redirectTo); } catch {}
    }
    const origin = canonicalOrigin();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    });
    if (error) return { error: error.message };
    return { error: null };
  }, []);

  const resetPassword = useCallback(async (email: string, mode: "customer" | "admin" = "customer") => {
    const origin = canonicalOrigin();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/reset-password?mode=${mode}`,
    });
    if (error) return { error: error.message };
    return { error: null };
  }, []);

  const updatePassword = useCallback(async (password: string) => {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) return { error: error.message };
    return { error: null };
  }, []);

  return (
    <Ctx.Provider value={{ user, loading, signIn, signUp, signOut, signInWithGoogle, resetPassword, updatePassword, refreshCustomer }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth(): AuthCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
