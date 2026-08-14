import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { _ as Link, v as useNavigate, y as useSearch } from "../_libs/@tanstack/react-router+[...].mjs";
import { Y as LoaderCircle, mt as EyeOff, pt as Eye } from "../_libs/lucide-react.mjs";
import { n as PageShell } from "./PageHeader-DZsnNyor.mjs";
import { n as useAuth } from "./auth-D2-u71mo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-DvGd7J8F.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LoginPage() {
	const { signIn, signInWithGoogle } = useAuth();
	const navigate = useNavigate();
	const search = useSearch({ from: "/login" });
	const redirect = typeof search.redirect === "string" && search.redirect.startsWith("/") && !search.redirect.startsWith("//") ? search.redirect : "/account";
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [showPw, setShowPw] = (0, import_react.useState)(false);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [googleLoading, setGoogleLoading] = (0, import_react.useState)(false);
	const handleLogin = async (event) => {
		event.preventDefault();
		if (!email.trim() || !password) {
			setError("Please enter email and password.");
			return;
		}
		setLoading(true);
		setError("");
		const result = await signIn(email.trim().toLowerCase(), password);
		if (result.error) {
			setError(result.error);
			setLoading(false);
			return;
		}
		navigate({ to: redirect });
	};
	const handleGoogle = async () => {
		setGoogleLoading(true);
		setError("");
		if ((await signInWithGoogle(redirect))?.error) {
			setGoogleLoading(false);
			setError("Google Sign-In is not configured yet. Please use email login or contact the administrator.");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto flex min-h-[70vh] max-w-[440px] items-center justify-center px-4 py-20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full rounded-[28px] bg-white p-8 shadow-[0_4px_24px_rgba(0,0,0,0.05)] sm:p-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] font-semibold tracking-[0.24em] text-[#7A2533] uppercase text-center",
					children: "Welcome"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display mt-2 text-center text-2xl font-semibold text-[#1a1a2e]",
					children: "Sign In"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-center text-sm text-[#7a6e64]",
					children: "Sign in to your Creative Muse account"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleLogin,
					className: "mt-8 space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: "login-email",
							className: "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1",
							children: "Email"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "login-email",
							type: "email",
							value: email,
							onChange: (e) => {
								setEmail(e.target.value);
								setError("");
							},
							className: "w-full rounded-xl border border-[#e0d8cc] px-4 py-3 text-sm outline-none focus:border-[#7A2533] focus:ring-1 focus:ring-[#7A2533]/30",
							placeholder: "your@email.com",
							autoComplete: "email"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: "login-password",
							className: "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1",
							children: "Password"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "login-password",
								type: showPw ? "text" : "password",
								value: password,
								onChange: (e) => {
									setPassword(e.target.value);
									setError("");
								},
								className: "w-full rounded-xl border border-[#e0d8cc] px-4 py-3 pr-12 text-sm outline-none focus:border-[#7A2533] focus:ring-1 focus:ring-[#7A2533]/30",
								autoComplete: "current-password"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setShowPw(!showPw),
								"aria-label": showPw ? "Hide password" : "Show password",
								className: "absolute top-1/2 right-3 -translate-y-1/2 text-[#7a6e64] hover:text-[#1a1a2e]",
								children: showPw ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
							})]
						})] }),
						error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-red-500",
							role: "alert",
							children: error
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "submit",
							disabled: loading,
							className: "btn-primary w-full justify-center disabled:opacity-60",
							children: [loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : null, loading ? "Signing In..." : "Sign In"]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 text-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/forgot-password",
						className: "text-xs font-medium text-[#7A2533] hover:text-[#7A2533] underline underline-offset-2",
						children: "Forgot password?"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative my-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute inset-0 flex items-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-full border-t border-[#e0d8cc]" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative flex justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "bg-white px-3 text-xs text-[#7a6e64]",
							children: "or"
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: handleGoogle,
					disabled: googleLoading,
					className: "flex w-full items-center justify-center gap-3 rounded-xl border border-[#e0d8cc] bg-white px-4 py-3 text-sm font-medium text-[#1a1a2e] transition-colors hover:border-[#7A2533] hover:bg-[#fdf8f3] disabled:opacity-60",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
						viewBox: "0 0 24 24",
						className: "h-5 w-5",
						"aria-hidden": "true",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z",
								fill: "#4285F4"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z",
								fill: "#34A853"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z",
								fill: "#FBBC05"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z",
								fill: "#EA4335"
							})
						]
					}), googleLoading ? "Redirecting…" : "Continue with Google"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-6 text-center text-sm text-[#7a6e64]",
					children: [
						"Don't have an account?",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/signup",
							className: "font-semibold text-[#7A2533] hover:text-[#7A2533] underline underline-offset-2",
							children: "Create Account"
						})
					]
				})
			]
		})
	}) });
}
//#endregion
export { LoginPage as component };
