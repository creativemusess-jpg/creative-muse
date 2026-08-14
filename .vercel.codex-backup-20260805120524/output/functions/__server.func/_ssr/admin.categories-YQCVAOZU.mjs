import { o as __toESM } from "../_runtime.mjs";
import { t as categoriesApi } from "./categories-DdAkdsQw.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime, r as useQueryClient } from "../_libs/react+tanstack__react-query.mjs";
import { P as Plus, R as PenLine, Y as LoaderCircle, _ as Trash2, d as Upload, nt as ImageOff, r as X, y as Star } from "../_libs/lucide-react.mjs";
import { a as AdminTable, i as AdminPageHeader, n as AdminLayout, r as AdminLoading, t as AdminEmpty } from "./AdminLayout-D0HWfGfb.mjs";
import { t as uploadImage } from "./upload-DCG819Qu.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.categories-YQCVAOZU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var emptyCategoryForm = {
	name: "",
	slug: "",
	description: "",
	sort_order: 0,
	featured: false,
	active: true,
	seo_title: "",
	seo_description: "",
	image: null,
	hero_image: null,
	hero_video: null,
	banner_heading: "",
	banner_description: "",
	cta_button_text: "",
	cta_link: "",
	mobile_banner: null,
	desktop_banner: null
};
function AdminCategories() {
	const [categories, setCategories] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [showForm, setShowForm] = (0, import_react.useState)(false);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)(emptyCategoryForm);
	const [uploading, setUploading] = (0, import_react.useState)(false);
	const queryClient = useQueryClient();
	const invalidateCaches = async () => {
		await queryClient.invalidateQueries({ queryKey: ["categories"] });
		await queryClient.invalidateQueries({ queryKey: ["products"] });
	};
	const fetchCategories = async () => {
		setLoading(true);
		try {
			const data = await categoriesApi.list();
			setCategories(data);
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		fetchCategories();
	}, []);
	const handleImageUpload = async (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setUploading(true);
		try {
			const url = await uploadImage(file, "categories", "category-images");
			setForm((f) => ({
				...f,
				image: url
			}));
		} catch (err) {
			alert(err.message);
		} finally {
			setUploading(false);
		}
	};
	const handleMediaUpload = async (e, field) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setUploading(true);
		try {
			const isVideo = field === "hero_video";
			const url = await uploadImage(file, isVideo ? "categoryVideos" : "categories", isVideo ? "hero-videos" : "hero-banners");
			setForm((f) => ({
				...f,
				[field]: url,
				...isVideo ? { hero_image: null } : field === "hero_image" ? { hero_video: null } : {}
			}));
		} catch (err) {
			alert(err.message);
		} finally {
			setUploading(false);
			e.target.value = "";
		}
	};
	const handleSave = async () => {
		if (!form.name || !form.slug) return;
		setSaving(true);
		try {
			const payload = {
				name: form.name,
				slug: form.slug,
				description: form.description || null,
				sort_order: form.sort_order,
				featured: form.featured,
				active: form.active,
				seo_title: form.seo_title || null,
				seo_description: form.seo_description || null,
				image: form.image,
				hero_image: form.hero_image,
				hero_video: form.hero_video,
				banner_heading: form.banner_heading || null,
				banner_description: form.banner_description || null,
				cta_button_text: form.cta_button_text || null,
				cta_link: form.cta_link || null,
				mobile_banner: form.mobile_banner,
				desktop_banner: form.desktop_banner
			};
			if (editing) await categoriesApi.update(editing.id, payload);
			else await categoriesApi.create(payload);
			setShowForm(false);
			setEditing(null);
			setForm(emptyCategoryForm);
			await invalidateCaches();
			fetchCategories();
		} catch (err) {
			alert(err.message);
		} finally {
			setSaving(false);
		}
	};
	const handleDelete = async (id, name) => {
		if (!window.confirm(`Delete category "${name}"?\nProducts in this category will lose their category reference.`)) return;
		try {
			await categoriesApi.delete(id);
			await invalidateCaches();
			fetchCategories();
		} catch (err) {
			console.error(err);
		}
	};
	const startEdit = (cat) => {
		setEditing(cat);
		setForm({
			name: cat.name,
			slug: cat.slug,
			description: cat.description || "",
			sort_order: cat.sort_order,
			featured: cat.featured,
			active: cat.active,
			seo_title: cat.seo_title || "",
			seo_description: cat.seo_description || "",
			image: cat.image || null,
			hero_image: cat.hero_image || null,
			hero_video: cat.hero_video || null,
			banner_heading: cat.banner_heading || "",
			banner_description: cat.banner_description || "",
			cta_button_text: cat.cta_button_text || "",
			cta_link: cat.cta_link || "",
			mobile_banner: cat.mobile_banner || null,
			desktop_banner: cat.desktop_banner || null
		});
		setShowForm(true);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminLayout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPageHeader, {
			title: "Categories",
			description: `${categories.length} categories`,
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => {
					setEditing(null);
					setForm(emptyCategoryForm);
					setShowForm(true);
				},
				className: "flex items-center gap-2 rounded-lg bg-[#1a1a2e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2d1b4e]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), "Add Category"]
			})
		}),
		showForm && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 rounded-xl border border-gray-200 bg-white p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mb-4 text-sm font-bold uppercase tracking-wider text-gray-500",
					children: editing ? "Edit Category" : "New Category"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block text-xs font-medium text-gray-600",
							children: "Name *"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: form.name,
							onChange: (e) => {
								setForm((f) => ({
									...f,
									name: e.target.value
								}));
								if (!editing) setForm((f) => ({
									...f,
									slug: e.target.value.toLowerCase().replace(/\s+/g, "-")
								}));
							},
							className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block text-xs font-medium text-gray-600",
							children: "Slug *"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: form.slug,
							onChange: (e) => setForm((f) => ({
								...f,
								slug: e.target.value
							})),
							className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block text-xs font-medium text-gray-600",
							children: "Sort Order"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							value: form.sort_order,
							onChange: (e) => setForm((f) => ({
								...f,
								sort_order: parseInt(e.target.value) || 0
							})),
							className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "sm:col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1 block text-xs font-medium text-gray-600",
								children: "Description"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: form.description,
								onChange: (e) => setForm((f) => ({
									...f,
									description: e.target.value
								})),
								rows: 2,
								className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block text-xs font-medium text-gray-600",
							children: "Image"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center gap-3",
							children: form.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-100",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: form.image,
									alt: "Category preview",
									className: "h-full w-full object-cover",
									onError: (e) => {
										e.currentTarget.style.display = "none";
									}
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setForm((f) => ({
										...f,
										image: null
									})),
									className: "absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" })
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex h-12 w-12 cursor-pointer items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100",
								children: [uploading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin text-gray-400" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-4 w-4 text-gray-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "file",
									accept: "image/*",
									onChange: handleImageUpload,
									className: "hidden"
								})]
							})
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block text-xs font-medium text-gray-600",
							children: "Hero Image"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaPicker, {
							value: form.hero_image,
							accept: "image/*",
							uploading,
							onUpload: (e) => handleMediaUpload(e, "hero_image"),
							onClear: () => setForm((f) => ({
								...f,
								hero_image: null
							}))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block text-xs font-medium text-gray-600",
							children: "Hero Video"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaPicker, {
							value: form.hero_video,
							accept: "video/*",
							uploading,
							onUpload: (e) => handleMediaUpload(e, "hero_video"),
							onClear: () => setForm((f) => ({
								...f,
								hero_video: null
							})),
							video: true
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block text-xs font-medium text-gray-600",
							children: "Mobile Banner"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaPicker, {
							value: form.mobile_banner,
							accept: "image/*",
							uploading,
							onUpload: (e) => handleMediaUpload(e, "mobile_banner"),
							onClear: () => setForm((f) => ({
								...f,
								mobile_banner: null
							}))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block text-xs font-medium text-gray-600",
							children: "Desktop Banner"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaPicker, {
							value: form.desktop_banner,
							accept: "image/*",
							uploading,
							onUpload: (e) => handleMediaUpload(e, "desktop_banner"),
							onClear: () => setForm((f) => ({
								...f,
								desktop_banner: null
							}))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block text-xs font-medium text-gray-600",
							children: "Banner Heading"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: form.banner_heading,
							onChange: (e) => setForm((f) => ({
								...f,
								banner_heading: e.target.value
							})),
							className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "sm:col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1 block text-xs font-medium text-gray-600",
								children: "Banner Description"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: form.banner_description,
								onChange: (e) => setForm((f) => ({
									...f,
									banner_description: e.target.value
								})),
								rows: 2,
								className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block text-xs font-medium text-gray-600",
							children: "CTA Button Text"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: form.cta_button_text,
							onChange: (e) => setForm((f) => ({
								...f,
								cta_button_text: e.target.value
							})),
							placeholder: "View Collection",
							className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block text-xs font-medium text-gray-600",
							children: "CTA Link"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: form.cta_link,
							onChange: (e) => setForm((f) => ({
								...f,
								cta_link: e.target.value
							})),
							placeholder: "#products",
							className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-end gap-6 pb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-2 cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: form.featured,
									onChange: (e) => setForm((f) => ({
										...f,
										featured: e.target.checked
									})),
									className: "rounded border-gray-300"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-sm text-gray-700 flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-3 w-3" }), " Featured"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-2 cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: form.active,
									onChange: (e) => setForm((f) => ({
										...f,
										active: e.target.checked
									})),
									className: "rounded border-gray-300"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm text-gray-700",
									children: "Active"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block text-xs font-medium text-gray-600",
							children: "SEO Title"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: form.seo_title,
							onChange: (e) => setForm((f) => ({
								...f,
								seo_title: e.target.value
							})),
							className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block text-xs font-medium text-gray-600",
							children: "SEO Description"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: form.seo_description,
							onChange: (e) => setForm((f) => ({
								...f,
								seo_description: e.target.value
							})),
							className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
						})] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: handleSave,
						disabled: saving,
						className: "rounded-lg bg-[#1a1a2e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2d1b4e] disabled:opacity-60",
						children: saving ? "Saving..." : editing ? "Update" : "Create"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							setShowForm(false);
							setEditing(null);
						},
						className: "rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50",
						children: "Cancel"
					})]
				})
			]
		}),
		loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLoading, {}) : categories.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminEmpty, {
			title: "No categories",
			description: "Create your first category to organize products"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminTable, {
			headers: [
				"Image",
				"Name",
				"Slug",
				"Order",
				"Featured",
				"Status",
				"Actions"
			],
			children: categories.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "hover:bg-gray-50",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-4 py-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-10 w-10 overflow-hidden rounded-lg bg-gray-100",
							children: cat.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: cat.image,
								alt: `${cat.name} category`,
								className: "h-full w-full object-cover",
								onError: (e) => {
									e.currentTarget.style.display = "none";
								}
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-full w-full items-center justify-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageOff, { className: "h-4 w-4 text-gray-400" })
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-4 py-3 font-medium text-[#1a1a2e]",
						children: cat.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-4 py-3 text-gray-500",
						children: cat.slug
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-4 py-3 text-gray-500",
						children: cat.sort_order
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-4 py-3",
						children: cat.featured ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-4 w-4 text-[#7A2533]" }) : "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-4 py-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${cat.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`,
							children: cat.active ? "Active" : "Inactive"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-4 py-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => startEdit(cat),
								className: "rounded-lg p-1.5 text-gray-400 hover:bg-gray-100",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "h-4 w-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => handleDelete(cat.id, cat.name),
								className: "rounded-lg p-1.5 text-red-300 hover:bg-red-50",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
							})]
						})
					})
				]
			}, cat.id))
		})
	] });
}
function MediaPicker({ value, accept, uploading, onUpload, onClear, video = false }) {
	if (value) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative h-16 w-24 overflow-hidden rounded-lg bg-gray-100",
		children: [video ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
			src: value,
			className: "h-full w-full object-cover",
			muted: true,
			playsInline: true
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: value,
			alt: "Banner preview",
			className: "h-full w-full object-cover",
			onError: (e) => {
				e.currentTarget.style.display = "none";
			}
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: onClear,
			className: "absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" })
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "flex h-16 w-24 cursor-pointer items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100",
		children: [uploading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin text-gray-400" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-4 w-4 text-gray-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "file",
			accept,
			onChange: onUpload,
			className: "hidden"
		})]
	});
}
//#endregion
export { AdminCategories as component };
