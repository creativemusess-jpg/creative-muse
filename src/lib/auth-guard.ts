import { redirect } from "@tanstack/react-router";
import { adminApi } from "@/lib/api/admin";

let guardCache: Awaited<ReturnType<typeof adminApi.getSession>> | undefined = undefined;

export async function requireAdmin() {
  if (guardCache) return { session: guardCache };
  const session = await adminApi.getSession();
  if (!session) {
    guardCache = undefined;
    throw redirect({ to: "/admin/login" });
  }
  guardCache = session;
  return { session };
}

export function clearGuardCache() {
  guardCache = undefined;
}
