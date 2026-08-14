import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { Y as LoaderCircle, d as Upload, r as X } from "../_libs/lucide-react.mjs";
import { i as AdminPageHeader, n as AdminLayout, r as AdminLoading } from "./AdminLayout-D0HWfGfb.mjs";
import { t as uploadImage } from "./upload-DCG819Qu.mjs";
import { t as contentApi } from "./content-Dzgi8PKn.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.homepage-GsUN3L--.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CAROUSEL_SECTION_KEYS = [
	"new_arrivals",
	"premium_arrivals",
	"best_sellers"
];
function AdminHomepage() {
	const [sections, setSections] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [editingSection, setEditingSection] = (0, import_react.useState)(null);
	const [formState, setFormState] = (0, import_react.useState)({
		hero: {},
		carousel: {}
	});
	(0, import_react.useEffect)(() => {
		contentApi.getAllSections().then((data) => {
			setSections(data);
			const hero = data.find((s) => s.section_key === "hero");
			if (hero) setFormState((prev) => ({
				...prev,
				hero: hero.content || {}
			}));
			const carousel = {};
			for (const section of data) if (CAROUSEL_SECTION_KEYS.includes(section.section_key)) carousel[section.section_key] = {
				autoScrollEnabled: section.auto_scroll_enabled ?? false,
				scrollDirection: section.scroll_direction ?? "left",
				scrollSpeed: section.scroll_speed ?? 30,
				pauseOnHover: section.pause_on_hover ?? true,
				autoResumeEnabled: section.auto_resume_enabled ?? true,
				autoResumeDelaySeconds: section.auto_resume_delay_seconds ?? 3
			};
			setFormState((prev) => ({
				...prev,
				carousel
			}));
			const banner = data.find((s) => s.section_key === "featured_banner");
			if (banner?.content?.cta_images) {
				const imgs = banner.content.cta_images;
				setCtaImages([
					{
						src: imgs[0]?.src || "",
						alt: imgs[0]?.alt || ""
					},
					{
						src: imgs[1]?.src || "",
						alt: imgs[1]?.alt || ""
					},
					{
						src: imgs[2]?.src || "",
						alt: imgs[2]?.alt || ""
					}
				]);
			}
			setLoading(false);
		});
	}, []);
	const [ctaImages, setCtaImages] = (0, import_react.useState)([
		{
			src: "",
			alt: ""
		},
		{
			src: "",
			alt: ""
		},
		{
			src: "",
			alt: ""
		}
	]);
	const [ctaUploading, setCtaUploading] = (0, import_react.useState)(null);
	const ctaFileInputs = (0, import_react.useRef)([
		null,
		null,
		null
	]);
	const handleHeroFieldChange = (0, import_react.useCallback)((field, value) => {
		setFormState((prev) => ({
			...prev,
			hero: {
				...prev.hero,
				[field]: value
			}
		}));
	}, []);
	const handleCarouselFieldChange = (0, import_react.useCallback)((sectionKey, field, value) => {
		setFormState((prev) => ({
			...prev,
			carousel: {
				...prev.carousel,
				[sectionKey]: {
					...prev.carousel[sectionKey],
					[field]: value
				}
			}
		}));
	}, []);
	const handleHeroSave = async () => {
		try {
			await contentApi.updateSection("hero", { content: formState.hero });
			alert("Hero section updated");
		} catch (err) {
			alert(err.message);
		}
	};
	const handleCarouselSave = async (sectionKey) => {
		const settings = formState.carousel[sectionKey];
		if (!settings) return;
		try {
			await contentApi.updateSection(sectionKey, {
				auto_scroll_enabled: settings.autoScrollEnabled,
				scroll_direction: settings.scrollDirection,
				scroll_speed: settings.scrollSpeed,
				pause_on_hover: settings.pauseOnHover,
				auto_resume_enabled: settings.autoResumeEnabled,
				auto_resume_delay_seconds: settings.autoResumeDelaySeconds
			});
			setSections((prev) => prev.map((s) => s.section_key === sectionKey ? {
				...s,
				auto_scroll_enabled: settings.autoScrollEnabled,
				scroll_direction: settings.scrollDirection,
				scroll_speed: settings.scrollSpeed,
				pause_on_hover: settings.pauseOnHover,
				auto_resume_enabled: settings.autoResumeEnabled,
				auto_resume_delay_seconds: settings.autoResumeDelaySeconds
			} : s));
			alert(`Auto-scroll settings saved for "${sectionKey.replace(/_/g, " ")}"`);
		} catch (err) {
			alert(err.message);
		}
	};
	const toggleEdit = (key) => {
		setEditingSection((prev) => prev === key ? null : key);
	};
	const handlePublishToggle = async (key, current) => {
		try {
			await contentApi.updateSection(key, { is_published: !current });
			setSections((prev) => prev.map((s) => s.section_key === key ? {
				...s,
				is_published: !current
			} : s));
		} catch (err) {
			console.error(err);
		}
	};
	const handleCtaImageUpload = async (index) => {
		const file = ctaFileInputs.current[index]?.files?.[0];
		if (!file) return;
		setCtaUploading(index);
		try {
			const url = await uploadImage(file, "cta", "cta-images");
			setCtaImages((prev) => prev.map((img, i) => i === index ? {
				...img,
				src: url
			} : img));
		} catch (err) {
			alert(err.message);
		} finally {
			setCtaUploading(null);
		}
	};
	const handleCtaSave = async () => {
		try {
			await contentApi.upsertSection("featured_banner", {
				title: "Featured Banner",
				content: { cta_images: ctaImages },
				is_published: true
			});
			const updated = await contentApi.getAllSections();
			setSections(updated);
			alert("CTA banner images saved");
		} catch (err) {
			alert(err.message);
		}
	};
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLoading, {}) });
	const currentCarouselSettings = editingSection && CAROUSEL_SECTION_KEYS.includes(editingSection) ? formState.carousel[editingSection] : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminLayout, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPageHeader, {
		title: "Homepage Editor",
		description: "Manage homepage sections and content"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6 lg:grid-cols-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm font-bold uppercase tracking-wider text-gray-500",
					children: "Sections"
				}), (() => {
					return (sections.some((s) => s.section_key === "featured_banner") ? sections : [...sections, {
						id: "featured_banner",
						section_key: "featured_banner",
						title: "Bridal CTA Images",
						is_published: true
					}]).map((section) => {
						const isCarousel = CAROUSEL_SECTION_KEYS.includes(section.section_key);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-xl border border-gray-200 bg-white p-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium text-[#1a1a2e]",
									children: section.section_key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-gray-500",
									children: section.title || "No title"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => handlePublishToggle(section.section_key, section.is_published),
										className: `rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase ${section.is_published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`,
										children: section.is_published ? "Published" : "Draft"
									}), (section.section_key === "hero" || isCarousel || section.section_key === "featured_banner") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => toggleEdit(section.section_key),
										className: "text-xs text-[#7A2533] hover:underline",
										children: editingSection === section.section_key ? "Close" : "Edit"
									})]
								})]
							})
						}, section.id);
					});
				})()]
			}),
			editingSection === "hero" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-gray-200 bg-white p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mb-4 text-sm font-bold uppercase tracking-wider text-gray-500",
					children: "Hero Section"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [[
						"eyebrow",
						"heading",
						"highlighted",
						"subheading",
						"description",
						"primary_cta",
						"secondary_cta",
						"certification_text"
					].map((field) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mb-1 block text-xs font-medium text-gray-600 capitalize",
						children: field.replace(/_/g, " ")
					}), field === "description" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						value: formState.hero[field] || "",
						onChange: (e) => handleHeroFieldChange(field, e.target.value),
						rows: 3,
						className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						value: formState.hero[field] || "",
						onChange: (e) => handleHeroFieldChange(field, e.target.value),
						className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
					})] }, field)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: handleHeroSave,
						className: "rounded-lg bg-[#1a1a2e] px-6 py-2 text-sm font-semibold text-white hover:bg-[#2d1b4e]",
						children: "Save Hero"
					})]
				})]
			}),
			currentCarouselSettings && editingSection && editingSection !== "featured_banner" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-gray-200 bg-white p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
					className: "mb-4 text-sm font-bold uppercase tracking-wider text-gray-500",
					children: ["Auto-Scroll Settings — ", editingSection.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: currentCarouselSettings.autoScrollEnabled,
								onChange: (e) => handleCarouselFieldChange(editingSection, "autoScrollEnabled", e.target.checked),
								className: "h-4 w-4 rounded border-gray-300 text-[#7A2533] focus:ring-[#7A2533]"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-medium text-gray-700",
								children: "Enable Auto-Scroll"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block text-xs font-medium text-gray-600",
							children: "Scroll Direction"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: currentCarouselSettings.scrollDirection,
							onChange: (e) => handleCarouselFieldChange(editingSection, "scrollDirection", e.target.value),
							className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#7A2533]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "left",
								children: "Left → Right"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "right",
								children: "Right → Left"
							})]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1 block text-xs font-medium text-gray-600",
								children: "Scroll Speed (seconds per full cycle)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								min: 3,
								max: 120,
								value: currentCarouselSettings.scrollSpeed,
								onChange: (e) => handleCarouselFieldChange(editingSection, "scrollSpeed", Math.max(3, Number(e.target.value))),
								className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-0.5 text-[11px] text-gray-400",
								children: "Lower = faster. Recommended: 20–40 seconds."
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: currentCarouselSettings.pauseOnHover,
								onChange: (e) => handleCarouselFieldChange(editingSection, "pauseOnHover", e.target.checked),
								className: "h-4 w-4 rounded border-gray-300 text-[#7A2533] focus:ring-[#7A2533]"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-medium text-gray-700",
								children: "Pause on Hover"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: currentCarouselSettings.autoResumeEnabled,
								onChange: (e) => handleCarouselFieldChange(editingSection, "autoResumeEnabled", e.target.checked),
								className: "h-4 w-4 rounded border-gray-300 text-[#7A2533] focus:ring-[#7A2533]"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-medium text-gray-700",
								children: "Auto-Resume after Interaction"
							})]
						}),
						currentCarouselSettings.autoResumeEnabled && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block text-xs font-medium text-gray-600",
							children: "Resume Delay (seconds)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							min: 1,
							max: 30,
							value: currentCarouselSettings.autoResumeDelaySeconds,
							onChange: (e) => handleCarouselFieldChange(editingSection, "autoResumeDelaySeconds", Math.max(1, Number(e.target.value))),
							className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => handleCarouselSave(editingSection),
							className: "rounded-lg bg-[#1a1a2e] px-6 py-2 text-sm font-semibold text-white hover:bg-[#2d1b4e]",
							children: "Save Auto-Scroll Settings"
						})
					]
				})]
			}),
			editingSection === "featured_banner" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-gray-200 bg-white p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mb-4 text-sm font-bold uppercase tracking-wider text-gray-500",
						children: "Featured Banner — CTA Images"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-4 text-xs text-gray-500",
						children: "Replace the three decorative images in the Bridal CTA banner. Leave empty to use default product images."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-5",
						children: [ctaImages.map((img, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "mb-1 block text-xs font-medium text-gray-600",
							children: [
								"CTA Image ",
								i + 1,
								" ",
								i === 0 ? "(Bridal Necklace/Choker)" : i === 1 ? "(Bridal Earrings)" : "(Bridal Ring)"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [img.src ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: img.src,
									alt: img.alt || `CTA image ${i + 1}`,
									className: "h-full w-full object-cover",
									onError: (e) => {
										e.currentTarget.style.display = "none";
									}
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setCtaImages((prev) => prev.map((x, j) => j === i ? {
										src: "",
										alt: ""
									} : x)),
									className: "absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" })
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex h-20 w-20 cursor-pointer items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100",
								children: [ctaUploading === i ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin text-gray-400" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-5 w-5 text-gray-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									ref: (el) => {
										ctaFileInputs.current[i] = el;
									},
									type: "file",
									accept: "image/*",
									className: "hidden",
									onChange: () => handleCtaImageUpload(i)
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: img.alt,
								onChange: (e) => setCtaImages((prev) => prev.map((x, j) => j === i ? {
									...x,
									alt: e.target.value
								} : x)),
								placeholder: "Alt text for image",
								className: "flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
							})]
						})] }, i)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: handleCtaSave,
							className: "rounded-lg bg-[#1a1a2e] px-6 py-2 text-sm font-semibold text-white hover:bg-[#2d1b4e]",
							children: "Save CTA Images"
						})]
					})
				]
			})
		]
	})] });
}
//#endregion
export { AdminHomepage as component };
