import { h as createFileRoute, m as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/product._productId-DqaG8Nbw.js
var $$splitComponentImporter = () => import("./product._productId-m_LzhH7d.mjs");
var Route = createFileRoute("/product/$productId")({
	head: ({ params }) => {
		return { meta: [{ title: `${params.productId} - Creative Muse` }, {
			name: "description",
			content: "Explore fine jewellery at Creative Muse."
		}] };
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
