import { r as __exportAll } from "../_runtime.mjs";
import { n as supabase, t as __exportAll$1 } from "./supabase-Bz-JQXNc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-Cd48uf7H.js
var admin_Cd48uf7H_exports = /* @__PURE__ */ __exportAll({
	n: () => admin_exports,
	t: () => adminApi
});
var admin_exports = /* @__PURE__ */ __exportAll$1({ adminApi: () => adminApi });
var db = () => supabase;
var adminApi = {
	async login(email, password) {
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password
		});
		if (error) throw new Error(error.message);
		if (!data.user) throw new Error("Login failed");
		const session = await adminApi.getSession();
		if (!session) {
			await supabase.auth.signOut();
			throw new Error("You don't have admin access. Contact the store owner to assign admin roles.");
		}
		return session;
	},
	async logout() {
		await supabase.auth.signOut();
	},
	async getSession() {
		const { data: sessionData } = await supabase.auth.getSession();
		const session = sessionData.session;
		if (!session?.user) return null;
		const { data: profile } = await db().from("profiles").select("*").eq("id", session.user.id).single();
		let assignmentRows = [];
		try {
			const { data: assignments } = await db().from("admin_role_assignments").select("role_id").eq("user_id", session.user.id);
			assignmentRows = assignments || [];
		} catch {
			return null;
		}
		if (assignmentRows.length === 0) return null;
		const roleIds = assignmentRows.map((a) => a.role_id);
		const { data: roles } = await db().from("admin_roles").select("*").in("id", roleIds);
		const adminRoles = roles || [];
		const permissions = adminRoles.flatMap((r) => r.permissions || []);
		return {
			user: {
				id: session.user.id,
				email: session.user.email ?? ""
			},
			profile: profile || null,
			roles: adminRoles,
			permissions: [...new Set(permissions)]
		};
	},
	async getCurrentUser() {
		return adminApi.getSession();
	},
	async isAuthenticated() {
		const session = await adminApi.getSession();
		return session !== null && session.roles.length > 0;
	},
	hasPermission(permissions, required) {
		return permissions.includes("*") || permissions.includes(required);
	},
	async getAdminUsers() {
		const { data: assignments } = await db().from("admin_role_assignments").select("*, profiles(*), admin_roles(*)");
		const rows = assignments || [];
		const grouped = /* @__PURE__ */ new Map();
		for (const a of rows) {
			if (!grouped.has(a.user_id)) grouped.set(a.user_id, {
				id: a.user_id,
				email: a.profiles?.email || "",
				full_name: a.profiles?.full_name || null,
				roles: []
			});
			grouped.get(a.user_id).roles.push(a.admin_roles);
		}
		return Array.from(grouped.values());
	},
	async assignRole(userId, roleId) {
		const user = (await supabase.auth.getUser()).data.user;
		await db().from("admin_role_assignments").insert({
			user_id: userId,
			role_id: roleId,
			assigned_by: user?.id
		});
	},
	async removeRole(userId, roleId) {
		await db().from("admin_role_assignments").delete().eq("user_id", userId).eq("role_id", roleId);
	},
	async getRoles() {
		const { data, error } = await db().from("admin_roles").select("*").order("name");
		if (error) throw error;
		return data || [];
	},
	async logAction(action, entityType, entityId, oldValues, newValues) {
		const user = (await supabase.auth.getUser()).data.user;
		await db().from("audit_logs").insert({
			user_id: user?.id,
			action,
			entity_type: entityType,
			entity_id: entityId,
			old_values: oldValues,
			new_values: newValues
		});
	},
	async getAuditLogs(limit = 50) {
		const { data, error } = await db().from("audit_logs").select("*, profiles:user_id(full_name, email)").order("created_at", { ascending: false }).limit(limit);
		if (error) throw error;
		return data || [];
	}
};
//#endregion
export { admin_Cd48uf7H_exports as n, adminApi as t };
