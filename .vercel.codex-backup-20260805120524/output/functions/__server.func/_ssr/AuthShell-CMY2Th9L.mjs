import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AuthShell-CMY2Th9L.js
var import_jsx_runtime = require_jsx_runtime();
function AuthShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-[#fdf8f3] px-4 py-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-[440px] flex-col items-center justify-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "mb-8 flex items-center justify-center",
				"aria-label": "Creative Muse home",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "/favicon.ico",
					alt: "Creative Muse",
					className: "h-[72px] w-[72px] object-contain"
				})
			}), children]
		})
	});
}
//#endregion
export { AuthShell as t };
