import { h as createFileRoute, m as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as requireAdmin } from "./auth-guard-CPGwskRa.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.orders._id-CzT4VorT.js
var $$splitComponentImporter = () => import("./admin.orders._id-DB0MS-G3.mjs");
var Route = createFileRoute("/admin/orders/$id")({
	beforeLoad: requireAdmin,
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
