import { h as createFileRoute, m as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/search-CnLK2ELT.js
var $$splitComponentImporter = () => import("./search-BPLTd84d.mjs");
var Route = createFileRoute("/search")({
	validateSearch: (search) => ({ q: typeof search.q === "string" ? search.q : "" }),
	head: () => ({ meta: [{ title: "Search Jewellery - Creative Muse" }, {
		name: "description",
		content: "Search rings, earrings, necklaces, pendants, mangalsutra and bridal jewellery at Creative Muse."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
