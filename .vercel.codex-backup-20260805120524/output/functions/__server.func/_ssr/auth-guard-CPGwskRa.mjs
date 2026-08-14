import { P as redirect } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as adminApi } from "./admin-Cd48uf7H.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-guard-CPGwskRa.js
var guardCache = void 0;
async function requireAdmin() {
	if (guardCache) return { session: guardCache };
	const session = await adminApi.getSession();
	if (!session) {
		guardCache = void 0;
		throw redirect({ to: "/admin/login" });
	}
	guardCache = session;
	return { session };
}
function clearGuardCache() {
	guardCache = void 0;
}
//#endregion
export { requireAdmin as n, clearGuardCache as t };
