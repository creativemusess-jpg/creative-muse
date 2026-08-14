import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as storefrontSupabase } from "./supabase-storefront-B2iEpuwU.mjs";
import { n as useAuth } from "./auth-D2-u71mo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth.callback-RAQt6QQL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AuthCallbackPage() {
	const { user, loading } = useAuth();
	const navigate = useNavigate();
	const handled = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		if (handled.current) return;
		const finish = async () => {
			const { data: { session } } = await storefrontSupabase.auth.getSession();
			if (session?.user) {
				handled.current = true;
				const redirect = (() => {
					try {
						return sessionStorage.getItem("cm_oauth_redirect");
					} catch {
						return null;
					}
				})();
				try {
					sessionStorage.removeItem("cm_oauth_redirect");
				} catch {}
				navigate({ to: redirect && redirect.startsWith("/") ? redirect : "/account" });
			} else if (!loading) {
				handled.current = true;
				navigate({ to: "/login" });
			}
		};
		finish();
	}, [
		user,
		loading,
		navigate
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-[#fdf8f3]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-auto h-10 w-10 animate-spin rounded-full border-[3px] border-[#7A2533] border-t-transparent" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 font-display text-lg font-semibold text-[#1a1a2e]",
					children: "Completing sign in…"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-[#7a6e64]",
					children: "You'll be redirected shortly."
				})
			]
		})
	});
}
//#endregion
export { AuthCallbackPage as component };
