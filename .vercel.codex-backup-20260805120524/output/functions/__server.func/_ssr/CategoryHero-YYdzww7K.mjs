import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as Play, a as VolumeX, o as Volume2, z as Pause } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/CategoryHero-YYdzww7K.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CategoryHero({ category }) {
	const videoRef = (0, import_react.useRef)(null);
	const [muted, setMuted] = (0, import_react.useState)(true);
	const [playing, setPlaying] = (0, import_react.useState)(true);
	const video = category.hero_video?.trim();
	const desktopImage = category.desktop_banner?.trim() || category.hero_image?.trim() || category.imageUrl || category.image || "";
	const mobileImage = category.mobile_banner?.trim() || desktopImage;
	const heading = category.banner_heading || category.name;
	const description = category.banner_description || category.description;
	const ctaText = category.cta_button_text || "View Collection";
	const ctaLink = category.cta_link || "#products";
	(0, import_react.useEffect)(() => {
		const el = videoRef.current;
		if (!el || !video) return;
		el.muted = muted;
		if (playing) el.play().catch(() => setPlaying(false));
		else el.pause();
	}, [
		muted,
		playing,
		video
	]);
	if (!video && !desktopImage) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "relative mb-8 overflow-hidden bg-[#1a1a2e] px-6 py-16 text-white",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeroCopy, {
			heading,
			description,
			ctaText,
			ctaLink
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative mb-8 min-h-[420px] overflow-hidden bg-[#1a1a2e] sm:min-h-[360px] lg:min-h-[440px]",
		children: [
			video ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
				ref: videoRef,
				src: video,
				className: "absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 data-[ready=true]:opacity-100",
				autoPlay: true,
				muted: true,
				loop: true,
				playsInline: true,
				preload: "metadata",
				"data-ready": "true"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("picture", { children: [mobileImage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("source", {
				media: "(max-width: 767px)",
				srcSet: mobileImage
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: desktopImage,
				alt: category.name,
				className: "absolute inset-0 h-full w-full object-cover",
				decoding: "async"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-r from-[#1a1a2e]/85 via-[#1a1a2e]/45 to-transparent" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#1a1a2e]/50 to-transparent" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative z-10 mx-auto flex min-h-[420px] max-w-[1440px] items-center px-6 py-14 sm:min-h-[360px] lg:min-h-[440px] lg:px-12",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeroCopy, {
					heading,
					description,
					ctaText,
					ctaLink
				})
			}),
			video && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute right-4 bottom-4 z-20 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setMuted((v) => !v),
					"aria-label": muted ? "Unmute hero video" : "Mute hero video",
					className: "flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#1a1a2e] shadow-md backdrop-blur transition hover:bg-white",
					children: muted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "h-4 w-4" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setPlaying((v) => !v),
					"aria-label": playing ? "Pause hero video" : "Play hero video",
					className: "flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#1a1a2e] shadow-md backdrop-blur transition hover:bg-white",
					children: playing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-4 w-4" })
				})]
			})
		]
	});
}
function HeroCopy({ heading, description, ctaText, ctaLink }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-xl animate-[cmHeroFade_700ms_ease-out] text-white",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-4xl font-semibold leading-tight text-white sm:text-5xl",
				children: heading
			}),
			description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 max-w-lg text-base leading-7 text-white/90 sm:text-lg",
				children: description
			}),
			ctaText && (ctaLink.startsWith("/") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: ctaLink,
				className: "btn-primary mt-7 inline-flex",
				children: ctaText
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: ctaLink,
				className: "btn-primary mt-7 inline-flex",
				children: ctaText
			})),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `@keyframes cmHeroFade{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}` })
		]
	});
}
//#endregion
export { CategoryHero as t };
