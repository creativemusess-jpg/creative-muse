import { redirect } from "@tanstack/react-router";
import { adminApi } from "@/lib/api/admin";

let guardCache: Awaited<ReturnType<typeof adminApi.getSession>> | undefined = undefined;

export async function requireAdmin() {
  // During SSR there is no persisted browser session (localStorage), so an auth
  // check here would always fail and bounce every hard refresh to /admin/login.
  // Auth is enforced on the client where the real session exists.
  if (typeof window === "undefined") return { session: null };
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
