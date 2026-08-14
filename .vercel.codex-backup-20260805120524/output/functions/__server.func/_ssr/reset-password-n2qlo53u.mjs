import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { v as useNavigate, y as useSearch } from "../_libs/@tanstack/react-router+[...].mjs";
import { Tt as CircleCheckBig, Y as LoaderCircle, mt as EyeOff, pt as Eye } from "../_libs/lucide-react.mjs";
import { n as useAuth } from "./auth-D2-u71mo.mjs";
import { t as AuthShell } from "./AuthShell-CMY2Th9L.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reset-password-n2qlo53u.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ResetPasswordPage() {
	const { updatePassword } = useAuth();
	const navigate = useNavigate();
	const mode = useSearch({ from: "/reset-password" }).mode === "admin" ? "admin" : "customer";
	const [password, setPassword] = (0, import_react.useState)("");
	const [confirm, setConfirm] = (0, import_react.useState)("");
	const [showPw, setShowPw] = (0, import_react.useState)(false);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [success, setSuccess] = (0, import_react.useState)(false);
	const [returnMode, setReturnMode] = (0, import_react.useState)(mode);
	(0, import_react.useEffect)(() => {
		if (mode === "admin") {
			setReturnMode("admin");
			try {
				sessionStorage.setItem("cm_password_reset_mode", "admin");
			} catch {}
			return;
		}
		try {
			setReturnMode(sessionStorage.getItem("cm_password_reset_mode") === "admin" ? "admin" : "customer");
		} catch {
			setReturnMode("customer");
		}
	}, [mode]);
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (password.length < 6) {
			setError("Password must be at least 6 characters.");
			return;
		}
		if (password !== confirm) {
			setError("Passwords do not match.");
			return;
		}
		setLoading(true);
		setError("");
		const result = await updatePassword(password);
		if (result.error) {
			setError(result.error);
			setLoading(false);
			return;
		}
		setSuccess(true);
		setLoading(false);
		try {
			sessionStorage.removeItem("cm_password_reset_mode");
		} catch {}
		setTimeout(() => {
			if (returnMode === "admin") navigate({ to: "/admin/login" });
			else navigate({ to: "/login" });
		}, 3e3);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "w-full rounded-[28px] bg-white p-8 shadow-[0_4px_24px_rgba(0,0,0,0.05)] sm:p-10",
		children: success ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "mx-auto h-12 w-12 text-[#7A2533]" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display mt-4 text-xl font-semibold text-[#1a1a2e]",
					children: "Password Updated"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-[#7a6e64]",
					children: "Redirecting to sign in…"
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-center text-2xl font-semibold text-[#1a1a2e]",
				children: "Set New Password"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-center text-sm text-[#7a6e64]",
				children: "Choose a strong password for your account."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "mt-8 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: "rp-password",
							className: "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1",
							children: "New Password"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "rp-password",
								type: showPw ? "text" : "password",
								value: password,
								onChange: (e) => {
									setPassword(e.target.value);
									setError("");
								},
								className: "w-full rounded-xl border border-[#e0d8cc] px-4 py-3 pr-12 text-sm outline-none focus:border-[#7A2533]",
								autoComplete: "new-password"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setShowPw(!showPw),
								"aria-label": showPw ? "Hide" : "Show",
								className: "absolute top-1/2 right-3 -translate-y-1/2 text-[#7a6e64]",
								children: showPw ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
							})]
						}),
						password.length > 0 && password.length < 6 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-amber-600",
							children: "At least 6 characters"
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: "rp-confirm",
						className: "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1",
						children: "Confirm Password"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: "rp-confirm",
						type: "password",
						value: confirm,
						onChange: (e) => {
							setConfirm(e.target.value);
							setError("");
						},
						className: "w-full rounded-xl border border-[#e0d8cc] px-4 py-3 text-sm outline-none focus:border-[#7A2533]",
						autoComplete: "new-password"
					})] }),
					error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-red-500",
						children: error
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "submit",
						disabled: loading,
						className: "btn-primary w-full justify-center disabled:opacity-60",
						children: [loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : null, loading ? "Updating…" : "Update Password"]
					})
				]
			})
		] })
	}) });
}
//#endregion
export { ResetPasswordPage as component };
