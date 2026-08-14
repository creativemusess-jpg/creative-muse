import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { _ as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { Y as LoaderCircle, mt as EyeOff, pt as Eye } from "../_libs/lucide-react.mjs";
import { n as PageShell } from "./PageHeader-DZsnNyor.mjs";
import { n as useAuth } from "./auth-D2-u71mo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/signup-zxpLbV7y.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SignupPage() {
	const { signUp, signInWithGoogle } = useAuth();
	const navigate = useNavigate();
	const [form, setForm] = (0, import_react.useState)({
		fullName: "",
		email: "",
		phone: "",
		password: "",
		confirmPassword: ""
	});
	const [acceptTerms, setAcceptTerms] = (0, import_react.useState)(false);
	const [showPw, setShowPw] = (0, import_react.useState)(false);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [success, setSuccess] = (0, import_react.useState)("");
	const update = (field) => (e) => {
		setForm({
			...form,
			[field]: e.target.value
		});
		setError("");
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!form.fullName.trim()) {
			setError("Please enter your full name.");
			return;
		}
		if (!form.email.trim()) {
			setError("Please enter your email.");
			return;
		}
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
			setError("Please enter a valid email address.");
			return;
		}
		if (form.password.length < 6) {
			setError("Password must be at least 6 characters.");
			return;
		}
		if (form.password !== form.confirmPassword) {
			setError("Passwords do not match.");
			return;
		}
		if (!acceptTerms) {
			setError("Please accept the Terms and Privacy Policy.");
			return;
		}
		setLoading(true);
		setError("");
		const result = await signUp({
			email: form.email.trim().toLowerCase(),
			password: form.password,
			fullName: form.fullName.trim(),
			phone: form.phone.trim()
		});
		if (result.error) {
			setError(result.error);
			setLoading(false);
			return;
		}
		if (result.needsEmailConfirmation) setSuccess("Account created! Please check your email to confirm your account before signing in.");
		else navigate({ to: "/account" });
		setLoading(false);
	};
	const handleGoogle = async () => {
		await signInWithGoogle();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto flex min-h-[70vh] max-w-[440px] items-center justify-center px-4 py-20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full rounded-[28px] bg-white p-8 shadow-[0_4px_24px_rgba(0,0,0,0.05)] sm:p-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] font-semibold tracking-[0.24em] text-[#7A2533] uppercase text-center",
					children: "Join"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display mt-2 text-center text-2xl font-semibold text-[#1a1a2e]",
					children: "Create Account"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-center text-sm text-[#7a6e64]",
					children: "Become part of the Creative Muse Circle"
				}),
				success ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 rounded-xl bg-green-50 p-4 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium text-green-700",
						children: success
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/login",
						className: "btn-primary mt-4 inline-flex",
						children: "Sign In"
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSubmit,
					className: "mt-8 space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: "signup-name",
							className: "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1",
							children: "Full Name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "signup-name",
							type: "text",
							value: form.fullName,
							onChange: update("fullName"),
							className: "w-full rounded-xl border border-[#e0d8cc] px-4 py-3 text-sm outline-none focus:border-[#7A2533]",
							autoComplete: "name"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: "signup-email",
							className: "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1",
							children: "Email"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "signup-email",
							type: "email",
							value: form.email,
							onChange: update("email"),
							className: "w-full rounded-xl border border-[#e0d8cc] px-4 py-3 text-sm outline-none focus:border-[#7A2533]",
							autoComplete: "email"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: "signup-phone",
							className: "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1",
							children: "Phone (optional)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "signup-phone",
							type: "tel",
							value: form.phone,
							onChange: update("phone"),
							className: "w-full rounded-xl border border-[#e0d8cc] px-4 py-3 text-sm outline-none focus:border-[#7A2533]",
							autoComplete: "tel"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								htmlFor: "signup-password",
								className: "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1",
								children: "Password"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: "signup-password",
									type: showPw ? "text" : "password",
									value: form.password,
									onChange: update("password"),
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
							form.password.length > 0 && form.password.length < 6 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-amber-600",
								children: "At least 6 characters"
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: "signup-confirm",
							className: "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1",
							children: "Confirm Password"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "signup-confirm",
							type: "password",
							value: form.confirmPassword,
							onChange: update("confirmPassword"),
							className: "w-full rounded-xl border border-[#e0d8cc] px-4 py-3 text-sm outline-none focus:border-[#7A2533]",
							autoComplete: "new-password"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-start gap-2 text-sm text-[#7a6e64]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: acceptTerms,
								onChange: (e) => setAcceptTerms(e.target.checked),
								className: "mt-0.5 rounded"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"I accept the ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/terms",
									className: "text-[#7A2533] underline underline-offset-2",
									children: "Terms"
								}),
								" and ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/privacy-policy",
									className: "text-[#7A2533] underline underline-offset-2",
									children: "Privacy Policy"
								})
							] })]
						}),
						error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-red-500",
							role: "alert",
							children: error
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "submit",
							disabled: loading,
							className: "btn-primary w-full justify-center disabled:opacity-60",
							children: [loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : null, loading ? "Creating account…" : "Create Account"]
						})
					]
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
					className: "flex w-full items-center justify-center gap-3 rounded-xl border border-[#e0d8cc] bg-white px-4 py-3 text-sm font-medium text-[#1a1a2e] transition-colors hover:border-[#7A2533] hover:bg-[#fdf8f3]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
						viewBox: "0 0 24 24",
						className: "h-5 w-5",
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
					}), "Continue with Google"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-6 text-center text-sm text-[#7a6e64]",
					children: [
						"Already have an account?",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/login",
							className: "font-semibold text-[#7A2533] hover:text-[#7A2533] underline underline-offset-2",
							children: "Sign In"
						})
					]
				})
			]
		})
	}) });
}
//#endregion
export { SignupPage as component };
