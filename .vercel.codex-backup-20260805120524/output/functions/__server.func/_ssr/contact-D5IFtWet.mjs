import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { I as Phone, K as MapPin, O as Send, q as Mail } from "../_libs/lucide-react.mjs";
import { n as PageShell, t as PageHeader } from "./PageHeader-DZsnNyor.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/contact-D5IFtWet.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ContactPage() {
	const [sent, setSent] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PageShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		eyebrow: "Reach Us",
		title: "We'd Love to Hear From You",
		subtitle: "Book an appointment, ask about custom pieces, or simply say hello."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto grid max-w-[1100px] gap-10 px-6 py-16 lg:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
					icon: MapPin,
					title: "Visit Us",
					text: "GF-3/4, Vidhi Square Complex, BPC Road, Anand Nagar, Vadodara – 390020"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
					icon: Phone,
					title: "Call / WhatsApp",
					text: "+91 90337 79867"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
					icon: Mail,
					title: "Email",
					text: "hello@creativemuse.in"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-[24px] bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.05)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-lg font-semibold text-[#1a1a2e]",
						children: "Showroom Hours"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 space-y-1.5 text-sm text-[#7a6e64]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Mon – Sat \xA0·\xA0 10:00 AM – 8:00 PM" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Sunday \xA0·\xA0 11:00 AM – 7:00 PM" })]
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: (e) => {
				e.preventDefault();
				setSent(true);
			},
			className: "space-y-4 rounded-[28px] bg-white p-7 shadow-[0_8px_32px_rgba(0,0,0,0.06)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-xl font-semibold text-[#1a1a2e]",
					children: "Send us a message"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Name",
					type: "text"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Email",
					type: "email"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Phone",
					type: "tel"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "mb-1.5 block text-xs font-semibold tracking-wider text-[#7a6e64] uppercase",
					children: "Message"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					rows: 4,
					className: "w-full rounded-[20px] border border-[#e0d8cc] bg-[#fdf8f3] px-4 py-3 text-sm focus:border-[#7A2533] focus:outline-none"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "submit",
					className: "btn-primary w-full",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4" }),
						" ",
						sent ? "Sent — we'll reply soon" : "Send Message"
					]
				})
			]
		})]
	})] });
}
function Field({ label, type }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: "mb-1.5 block text-xs font-semibold tracking-wider text-[#7a6e64] uppercase",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		required: true,
		className: "w-full rounded-full border border-[#e0d8cc] bg-[#fdf8f3] px-4 py-3 text-sm focus:border-[#7A2533] focus:outline-none"
	})] });
}
function Info({ icon: Ic, title, text }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-start gap-4 rounded-[24px] bg-white p-6 shadow-[0_4px_16px_rgba(0,0,0,0.04)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#fdf8f3] to-[#f0e4cd]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ic, { className: "h-5 w-5 text-[#7A2533]" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-base font-semibold text-[#1a1a2e]",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-[#7a6e64]",
			children: text
		})] })]
	});
}
//#endregion
export { ContactPage as component };
