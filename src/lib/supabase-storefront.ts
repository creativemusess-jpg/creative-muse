import { createClient } from "@supabase/supabase-js";

if (typeof globalThis.WebSocket === "undefined" && typeof window === "undefined") {
  const { default: Ws } = await import("ws");
  (globalThis as any).WebSocket = Ws;
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const isServer = typeof window === "undefined";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY");
}

export const storefrontSupabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    flowType: "pkce" as const,
    persistSession: !isServer,
    autoRefreshToken: !isServer,
    detectSessionInUrl: true,
    storageKey: "cm_storefront_auth",
  },
});
