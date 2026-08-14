import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/terms-BxLGSRG6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
function TermsRedirect() {
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		navigate({
			to: "/terms-and-conditions",
			replace: true
		});
	}, [navigate]);
	return null;
}
//#endregion
export { TermsRedirect as component };
