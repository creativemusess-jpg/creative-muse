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
  },

  async getSession(): Promise<AdminSession | null> {
    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData.session;
    if (!session?.user) return null;

    const { data: profile } = await db()
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    let assignmentRows: any[] = [];
    try {
      const { data: assignments } = await db()
        .from("admin_role_assignments")
        .select("role_id")
        .eq("user_id", session.user.id);
      assignmentRows = (assignments as any[]) || [];
    } catch {
      return null;
    }

    if (assignmentRows.length === 0) return null;

    const roleIds = assignmentRows.map((a: any) => a.role_id);
    const { data: roles } = await db().from("admin_roles").select("*").in("id", roleIds);

    const adminRoles = (roles as any[]) || [];
    const permissions = adminRoles.flatMap((r: any) => r.permissions || []);

    return {
      user: { id: session.user.id, email: session.user.email ?? "" },
      profile: (profile as any) || null,
      roles: adminRoles,
      permissions: [...new Set(permissions as string[])],
    };
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
