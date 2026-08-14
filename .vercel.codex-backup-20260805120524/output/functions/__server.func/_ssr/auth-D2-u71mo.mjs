import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as storefrontSupabase } from "./supabase-storefront-B2iEpuwU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-D2-u71mo.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Ctx = (0, import_react.createContext)(null);
async function ensureCustomer(authUser) {
	if (!authUser) return {
		customer: null,
		error: null
	};
	const { data: existing } = await storefrontSupabase.from("customers").select("*").eq("auth_user_id", authUser.id).maybeSingle();
	if (existing) {
		const { error: updErr } = await storefrontSupabase.from("customers").update({
			last_login_at: (/* @__PURE__ */ new Date()).toISOString(),
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		}).eq("id", existing.id);
		if (updErr) console.error("Failed to update last_login:", updErr);
		return {
			customer: {
				id: existing.id,
				authUserId: existing.auth_user_id,
				email: existing.email,
				fullName: existing.full_name || "",
				phone: existing.phone || "",
				avatarUrl: existing.avatar_url || null,
				provider: existing.provider || "email"
			},
			error: null
		};
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
		last_login_at: (/* @__PURE__ */ new Date()).toISOString()
	};
	const { data: inserted, error } = await storefrontSupabase.from("customers").insert(newCustomer).select().single();
	if (error) {
		console.error("Failed to create customer profile:", error.message, error);
		return {
			customer: null,
			error: error.message
		};
	}
	return {
		customer: {
			id: inserted.id,
			authUserId: inserted.auth_user_id,
			email: inserted.email,
			fullName: inserted.full_name || "",
			phone: inserted.phone || "",
			avatarUrl: inserted.avatar_url || null,
			provider: inserted.provider || "email"
		},
		error: null
	};
}
function AuthProvider({ children }) {
	const [user, setUser] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const refreshCustomer = (0, import_react.useCallback)(async () => {
		const { data: { session } } = await storefrontSupabase.auth.getSession();
		if (session?.user) {
			const { customer } = await ensureCustomer(session.user);
			setUser(customer);
		} else setUser(null);
		setLoading(false);
	}, []);
	(0, import_react.useEffect)(() => {
		refreshCustomer();
		const { data: { subscription } } = storefrontSupabase.auth.onAuthStateChange(async (_event, session) => {
			if (session?.user) {
				const { customer } = await ensureCustomer(session.user);
				setUser(customer);
			} else setUser(null);
			setLoading(false);
		});
		return () => subscription.unsubscribe();
	}, [refreshCustomer]);
	const signIn = (0, import_react.useCallback)(async (email, password) => {
		const { data, error } = await storefrontSupabase.auth.signInWithPassword({
			email: email.trim().toLowerCase(),
			password
		});
		if (error) return { error: error.message };
		if (!data.user || !data.session) return { error: "Login failed. Please try again." };
		const { customer, error: profileError } = await ensureCustomer(data.user);
		if (!customer) {
			await storefrontSupabase.auth.signOut();
			return { error: profileError || "Login succeeded, but customer profile could not be loaded." };
		}
		setUser(customer);
		setLoading(false);
		return { error: null };
	}, []);
	const signUp = (0, import_react.useCallback)(async (params) => {
		const { data, error } = await storefrontSupabase.auth.signUp({
			email: params.email,
			password: params.password,
			options: { data: {
				full_name: params.fullName,
				phone: params.phone || ""
			} }
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
			needsEmailConfirmation: !data.session
		};
	}, []);
	const signOut = (0, import_react.useCallback)(async () => {
		await storefrontSupabase.auth.signOut();
		setUser(null);
	}, []);
	const signInWithGoogle = (0, import_react.useCallback)(async (redirectTo) => {
		if (redirectTo) try {
			sessionStorage.setItem("cm_oauth_redirect", redirectTo);
		} catch {}
		const { error } = await storefrontSupabase.auth.signInWithOAuth({
			provider: "google",
			options: { redirectTo: `${window.location.origin}/auth/callback` }
		});
		if (error) return { error: error.message };
		return { error: null };
	}, []);
	const resetPassword = (0, import_react.useCallback)(async (email, mode = "customer") => {
		const { error } = await storefrontSupabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password?mode=${mode}` });
		if (error) return { error: error.message };
		return { error: null };
	}, []);
	const updatePassword = (0, import_react.useCallback)(async (password) => {
		const { error } = await storefrontSupabase.auth.updateUser({ password });
		if (error) return { error: error.message };
		return { error: null };
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ctx.Provider, {
		value: {
			user,
			loading,
			signIn,
			signUp,
			signOut,
			signInWithGoogle,
			resetPassword,
			updatePassword,
			refreshCustomer
		},
		children
	});
}
function useAuth() {
	const ctx = (0, import_react.useContext)(Ctx);
	if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
	return ctx;
}
//#endregion
export { useAuth as n, AuthProvider as t };
