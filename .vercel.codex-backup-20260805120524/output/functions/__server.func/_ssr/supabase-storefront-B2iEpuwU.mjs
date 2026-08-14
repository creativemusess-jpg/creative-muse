import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/supabase-storefront-B2iEpuwU.js
var supabaseUrl = "https://qsbywhfaoajhspytgmbc.supabase.co";
var supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzYnl3aGZhb2FqaHNweXRnbWJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1MzA5MzEsImV4cCI6MjA5OTEwNjkzMX0.FE5ZtanPMsiCiMY3ZXN8K7JYyoNudwRMwTpjann8SAc";
var isServer = typeof window === "undefined";
var ServerNoopWebSocket = class {
	url;
	CONNECTING = 0;
	OPEN = 1;
	CLOSING = 2;
	CLOSED = 3;
	readyState = 3;
	protocol = "";
	onopen = null;
	onmessage = null;
	onclose = null;
	onerror = null;
	constructor(url) {
		this.url = url;
	}
	close() {}
	send() {}
	addEventListener() {}
	removeEventListener() {}
};
var storefrontSupabase = createClient(supabaseUrl, supabaseAnonKey, {
	auth: {
		persistSession: true,
		autoRefreshToken: true,
		detectSessionInUrl: true,
		storageKey: "cm_storefront_auth"
	},
	realtime: isServer ? { transport: ServerNoopWebSocket } : {}
});
//#endregion
export { storefrontSupabase as t };
