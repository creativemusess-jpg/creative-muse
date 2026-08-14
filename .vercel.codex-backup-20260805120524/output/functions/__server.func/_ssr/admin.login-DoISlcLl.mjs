import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { _ as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { Y as LoaderCircle, mt as EyeOff, pt as Eye } from "../_libs/lucide-react.mjs";
import { t as adminApi } from "./admin-Cd48uf7H.mjs";
import { t as clearGuardCache } from "./auth-guard-CPGwskRa.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.login-DoISlcLl.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ADMIN_REMEMBER_EMAIL_KEY = "cm_admin_remembered_email";
function AdminLoginPage() {
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [showPassword, setShowPassword] = (0, import_react.useState)(false);
	const [rememberMe, setRememberMe] = (0, import_react.useState)(false);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		try {
			const rememberedEmail = localStorage.getItem(ADMIN_REMEMBER_EMAIL_KEY);
			if (rememberedEmail) {
				setEmail(rememberedEmail);
				setRememberMe(true);
			}
		} catch {}
	}, []);
	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		if (!email || !password) {
			setError("Please enter email and password");
			return;
		}
		setLoading(true);
		try {
			clearGuardCache();
			await adminApi.login(email, password);
			try {
				if (rememberMe) localStorage.setItem(ADMIN_REMEMBER_EMAIL_KEY, email.trim().toLowerCase());
				else localStorage.removeItem(ADMIN_REMEMBER_EMAIL_KEY);
			} catch {}
			navigate({ to: "/admin" });
		} catch (err) {
			setError(err.message || "Invalid credentials");
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-gradient-to-br from-[#1a1a2e] to-[#2d1b4e] p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-8 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-3xl font-bold text-white",
						children: "Creative Muse"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-[#7A2533]",
						children: "Admin Panel"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSubmit,
					className: "rounded-2xl bg-white p-8 shadow-2xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-xl font-bold text-[#1a1a2e]",
							children: "Sign In"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-gray-500",
							children: "Enter your credentials to access the admin panel"
						}),
						error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600",
							children: error
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-sm font-medium text-gray-700",
									children: "Email"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "email",
									value: email,
									onChange: (e) => setEmail(e.target.value),
									placeholder: "creativemusess@gmail.com",
									className: "mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#7A2533] focus:ring-1 focus:ring-[#7A2533]",
									autoComplete: "email"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-sm font-medium text-gray-700",
									children: "Password"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative mt-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: showPassword ? "text" : "password",
										value: password,
										onChange: (e) => setPassword(e.target.value),
										placeholder: "••••••••",
										className: "block w-full rounded-lg border border-gray-300 px-4 py-2.5 pr-10 text-sm outline-none focus:border-[#7A2533] focus:ring-1 focus:ring-[#7A2533]",
										autoComplete: "current-password"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setShowPassword(!showPassword),
										className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400",
										children: showPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
									})]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											checked: rememberMe,
											onChange: (e) => setRememberMe(e.target.checked),
											className: "rounded border-gray-300 accent-[#7A2533]"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-sm text-gray-600",
											children: "Remember me"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/forgot-password",
										search: { mode: "admin" },
										className: "text-sm text-[#7A2533] hover:underline",
										children: "Forgot password?"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "submit",
									disabled: loading,
									className: "flex w-full items-center justify-center gap-2 rounded-lg bg-[#1a1a2e] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#2d1b4e] disabled:opacity-60",
									children: [loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), loading ? "Signing in..." : "Sign In"]
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-6 text-center text-xs text-gray-500",
					children: [
						"© ",
						(/* @__PURE__ */ new Date()).getFullYear(),
						" Creative Muse Fine Jewellery"
					]
				})
			]
		})
	});
}
//#endregion
export { AdminLoginPage as component };
