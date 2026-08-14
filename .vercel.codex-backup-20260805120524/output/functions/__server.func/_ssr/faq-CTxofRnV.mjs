import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as motion, r as AnimatePresence } from "../_libs/framer-motion.mjs";
import { P as Plus } from "../_libs/lucide-react.mjs";
import { n as PageShell, t as PageHeader } from "./PageHeader-DZsnNyor.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/faq-CTxofRnV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FAQS = [
	["What certifications do your diamonds carry?", "All Creative Muse diamonds are IGI or GIA certified, with a unique grading report detailing the 4Cs."],
	["Do you offer hallmarked gold jewellery?", "Yes — every gold piece is BIS hallmarked with HUID number visible on each item."],
	["What is your return and exchange policy?", "30-day returns on unworn pieces in original packaging. Custom orders are exchangeable for store credit."],
	["Can I customise a piece for my wedding?", "Absolutely — book a private appointment at our Vadodara atelier or over video call."],
	["Do you offer EMI options?", "No-cost EMI is available on major credit cards and via Razorpay at checkout."],
	["How long does shipping take across India?", "2–5 business days, fully insured and tracked. Free shipping above ₹5,000."],
	["Do you ship internationally?", "Currently we ship pan-India. International orders can be arranged on request via our concierge team."],
	["Can I resize a ring after purchase?", "Yes — first resizing within 60 days is complimentary. Subsequent resizings are charged at material cost."]
];
var SplitComponent = () => {
	const [open, setOpen] = (0, import_react.useState)(0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PageShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		eyebrow: "Help",
		title: "Frequently Asked",
		subtitle: "Everything you wanted to know — and a few things you didn't."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "mx-auto max-w-[760px] px-6 py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-3",
			children: FAQS.map(([q, a], i) => {
				const isOpen = open === i;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "overflow-hidden rounded-[20px] border border-[#e0d8cc] bg-white",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setOpen(isOpen ? null : i),
						className: "flex w-full items-center justify-between gap-4 px-6 py-5 text-left",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-[15px] font-semibold text-[#1a1a2e]",
							children: q
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `flex h-8 w-8 items-center justify-center rounded-full bg-[#fdf8f3] text-[#7A2533] transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
						initial: false,
						children: isOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
							initial: {
								height: 0,
								opacity: 0
							},
							animate: {
								height: "auto",
								opacity: 1
							},
							exit: {
								height: 0,
								opacity: 0
							},
							transition: { duration: .3 },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "px-6 pb-5 text-[14px] leading-relaxed text-[#7a6e64]",
								children: a
							})
						})
					})]
				}, q);
			})
		})
	})] });
};
//#endregion
export { SplitComponent as component };
