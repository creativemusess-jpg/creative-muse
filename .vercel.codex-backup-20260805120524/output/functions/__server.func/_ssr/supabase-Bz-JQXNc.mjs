import { r as __exportAll$1 } from "../_runtime.mjs";
import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/supabase-Bz-JQXNc.js
var supabase_Bz_JQXNc_exports = /* @__PURE__ */ __exportAll$1({
	n: () => supabase_exports,
	r: () => __exportAll,
	t: () => supabase
});
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var supabase_exports = /* @__PURE__ */ __exportAll({ supabase: () => supabase });
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
var supabase = createClient(supabaseUrl, supabaseAnonKey, {
	auth: {
		persistSession: !isServer,
		autoRefreshToken: !isServer,
		storageKey: "cm_admin_auth"
	},
	realtime: isServer ? { transport: ServerNoopWebSocket } : {}
});
//#endregion
export { supabase as n, supabase_Bz_JQXNc_exports as r, __exportAll as t };
