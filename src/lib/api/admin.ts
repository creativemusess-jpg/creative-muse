import { supabase } from "../supabase";

const db = () => supabase as any;

export interface AdminSession {
  user: {
    id: string;
    email: string;
  };
  profile: any;
  roles: any[];
  permissions: string[];
}

// Last session that was fully verified against the DB. Used to survive a
// transient DB/network error during re-validation so a valid admin is never
// bounced to the login page because of a momentary glitch.
let lastKnownAdminSession: AdminSession | null = null;

export function clearLastKnownAdminSession() {
  lastKnownAdminSession = null;
}

export const adminApi = {
  async login(email: string, password: string): Promise<AdminSession> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    if (!data.user) throw new Error("Login failed");

    const session = await adminApi.getSession();
    if (!session) {
      await supabase.auth.signOut();
      throw new Error("You don't have admin access. Contact the store owner to assign admin roles.");
    }
    return session;
  },

  async logout(): Promise<void> {
    await supabase.auth.signOut();
    lastKnownAdminSession = null;
  },

  async getSession(): Promise<AdminSession | null> {
    // getUser() resolves the persisted session and automatically refreshes the
    // access token when it is stale. Using getSession() alone can return an
    // expired-but-still-stored token, which would then fail the profile/role
    // lookups below and be misinterpreted as "not an admin" -> unexpected logout.
    const { data: userData, error: userError } = await supabase.auth.getUser();
    const sessionUser = userData.user;
    if (userError || !sessionUser) {
      return null;
    }
    const uid = sessionUser.id;

    // Best-effort profile lookup — a missing/errored profile must not sign an
    // admin out (the original code allowed a null profile already).
    const profileRes = await db()
      .from("profiles")
      .select("*")
      .eq("id", uid)
      .maybeSingle();
    const profile = profileRes.data ?? null;

    // Verify admin role membership. Returns "no-admin" when the lookup
    // SUCCEEDS but finds no assignments (the real "not an admin" case), and
    // throws on any DB/network error so the caller can retry instead of
    // treating an infrastructure hiccup as a signed-out admin.
    const verifyRoles = async (): Promise<AdminSession | "no-admin"> => {
      const { data: assignments, error } = await db()
        .from("admin_role_assignments")
        .select("role_id")
        .eq("user_id", uid);
      if (error) throw error;
      if (!assignments || (assignments as any[]).length === 0) return "no-admin";

      const roleIds = (assignments as any[]).map((a: any) => a.role_id);
      const rolesRes = await db().from("admin_roles").select("*").in("id", roleIds);
      if (rolesRes.error) throw rolesRes.error;

      const adminRoles = (rolesRes.data as any[]) || [];
      const permissions = Array.from(new Set(adminRoles.flatMap((r: any) => r.permissions || [])));
      return {
        user: { id: uid, email: sessionUser.email ?? "" },
        profile: (profile as any) || null,
        roles: adminRoles,
        permissions: permissions as string[],
      };
    };

    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const result = await verifyRoles();
        if (result === "no-admin") return null;
        lastKnownAdminSession = result;
        return result;
      } catch {
        if (attempt === 0) {
          // Likely an expired mid-flight access token or a network blip. Force
          // a token refresh and retry once before concluding anything.
          try {
            await supabase.auth.refreshSession();
          } catch {
            /* ignore */
          }
          continue;
        }
        // Still failing after a token refresh. Never bounce an admin who was
        // just verified; reuse the last known-good session so the login
        // redirect fires only for a genuinely invalid/expired auth session or
        // an intentional sign-out.
        return lastKnownAdminSession;
      }
    }
    return null;
  },

  async getCurrentUser(): Promise<AdminSession | null> {
    return adminApi.getSession();
  },

  async isAuthenticated(): Promise<boolean> {
    const session = await adminApi.getSession();
    return session !== null && session.roles.length > 0;
  },

  hasPermission(permissions: string[], required: string): boolean {
    return permissions.includes("*") || permissions.includes(required);
  },

  async getAdminUsers(): Promise<any[]> {
    const { data: assignments } = await db()
      .from("admin_role_assignments")
      .select("*, profiles(*), admin_roles(*)");

    const rows = (assignments as any[]) || [];
    const grouped = new Map<string, any>();

    for (const a of rows) {
      if (!grouped.has(a.user_id)) {
        grouped.set(a.user_id, {
          id: a.user_id,
          email: a.profiles?.email || "",
          full_name: a.profiles?.full_name || null,
          roles: [],
        });
      }
      grouped.get(a.user_id).roles.push(a.admin_roles);
    }

    return Array.from(grouped.values());
  },

  async assignRole(userId: string, roleId: string): Promise<void> {
    const user = (await supabase.auth.getUser()).data.user;
    await db().from("admin_role_assignments").insert({ user_id: userId, role_id: roleId, assigned_by: user?.id });
  },

  async removeRole(userId: string, roleId: string): Promise<void> {
    await db().from("admin_role_assignments").delete().eq("user_id", userId).eq("role_id", roleId);
  },

  async getRoles(): Promise<any[]> {
    const { data, error } = await db().from("admin_roles").select("*").order("name");
    if (error) throw error;
    return (data as any[]) || [];
  },

  async logAction(action: string, entityType: string, entityId?: string, oldValues?: any, newValues?: any): Promise<void> {
    const user = (await supabase.auth.getUser()).data.user;
    await db().from("audit_logs").insert({
      user_id: user?.id,
      action,
      entity_type: entityType,
      entity_id: entityId,
      old_values: oldValues,
      new_values: newValues,
    });
  },

  async getAuditLogs(limit = 50): Promise<any[]> {
    const { data, error } = await db()
      .from("audit_logs")
      .select("*, profiles:user_id(full_name, email)")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data as any[]) || [];
  },
};
