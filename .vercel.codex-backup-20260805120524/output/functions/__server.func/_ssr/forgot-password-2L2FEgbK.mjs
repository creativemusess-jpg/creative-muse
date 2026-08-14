import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { _ as Link, y as useSearch } from "../_libs/@tanstack/react-router+[...].mjs";
import { Tt as CircleCheckBig, Y as LoaderCircle } from "../_libs/lucide-react.mjs";
import { n as useAuth } from "./auth-D2-u71mo.mjs";
import { t as AuthShell } from "./AuthShell-CMY2Th9L.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/forgot-password-2L2FEgbK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ForgotPasswordPage() {
	const { resetPassword } = useAuth();
	const mode = useSearch({ from: "/forgot-password" }).mode === "admin" ? "admin" : "customer";
	const [email, setEmail] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [sent, setSent] = (0, import_react.useState)(false);
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
			setError("Please enter a valid email address.");
			return;
		}
		setLoading(true);
		setError("");
		try {
			sessionStorage.setItem("cm_password_reset_mode", mode);
		} catch {}
		const result = await resetPassword(email.trim().toLowerCase(), mode);
		if (result.error) {
			setError(result.error);
			setLoading(false);
			return;
		}
		setSent(true);
		setLoading(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "w-full rounded-[28px] bg-white p-8 shadow-[0_4px_24px_rgba(0,0,0,0.05)] sm:p-10",
		children: sent ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "mx-auto h-12 w-12 text-[#7A2533]" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display mt-4 text-xl font-semibold text-[#1a1a2e]",
					children: "Check Your Email"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm text-[#7a6e64]",
					children: ["We've sent a password reset link to ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: email })]
				}),
				mode === "admin" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/admin/login",
					className: "btn-primary mt-6 inline-flex",
					children: "Back to Sign In"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/login",
					className: "btn-primary mt-6 inline-flex",
					children: "Back to Sign In"
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-center text-2xl font-semibold text-[#1a1a2e]",
				children: "Forgot Password"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-center text-sm text-[#7a6e64]",
				children: "Enter your email and we'll send you a reset link."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "mt-8 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: "fp-email",
						className: "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1",
						children: "Email"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: "fp-email",
						type: "email",
						value: email,
						onChange: (e) => {
							setEmail(e.target.value);
							setError("");
						},
						className: "w-full rounded-xl border border-[#e0d8cc] px-4 py-3 text-sm outline-none focus:border-[#7A2533]"
					})] }),
					error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-red-500",
						children: error
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "submit",
						disabled: loading,
						className: "btn-primary w-full justify-center disabled:opacity-60",
						children: [loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : null, loading ? "Sending…" : "Send Reset Link"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-6 text-center text-sm text-[#7a6e64]",
				children: [
					"Remember your password?",
					" ",
					mode === "admin" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/admin/login",
						className: "font-semibold text-[#7A2533] underline underline-offset-2",
						children: "Sign In"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/login",
						className: "font-semibold text-[#7A2533] underline underline-offset-2",
						children: "Sign In"
					})
				]
			})
		] })
	}) });
}
//#endregion
export { ForgotPasswordPage as component };
