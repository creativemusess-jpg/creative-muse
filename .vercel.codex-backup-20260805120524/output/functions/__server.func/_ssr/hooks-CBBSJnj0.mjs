import { t as categoriesApi } from "./categories-DdAkdsQw.mjs";
import { t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { t as contentApi } from "./content-Dzgi8PKn.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/hooks-CBBSJnj0.js
function useCategories() {
	return useQuery({
		queryKey: ["categories"],
		queryFn: () => categoriesApi.list(true),
		staleTime: 12e4
	});
}
function useContentSection(sectionKey) {
	return useQuery({
		queryKey: [
			"content",
			"section",
			sectionKey
		],
		queryFn: () => contentApi.getSection(sectionKey),
		staleTime: 300 * 1e3
	});
}
//#endregion
export { useContentSection as n, useCategories as t };
