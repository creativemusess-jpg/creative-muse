import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const isServer = typeof window === "undefined";

class ServerNoopWebSocket {
  readonly CONNECTING = 0;
  readonly OPEN = 1;
  readonly CLOSING = 2;
  readonly CLOSED = 3;
  readonly readyState = 3;
  readonly protocol = "";
  onopen = null;
  onmessage = null;
  onclose = null;
  onerror = null;
  constructor(readonly url: string) {}
  close() {}
  send() {}
  addEventListener() {}
  removeEventListener() {}
}

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY");
}

export const storefrontSupabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: "cm_storefront_auth",
  },
  realtime: isServer
    ? { transport: ServerNoopWebSocket as unknown as typeof WebSocket }
    : {},
});
