import { o as __toESM } from "../_runtime.mjs";
import { t as categoriesApi } from "./categories-DdAkdsQw.mjs";
import { t as productsApi } from "./products-CsgymTpp.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime, r as useQueryClient } from "../_libs/react+tanstack__react-query.mjs";
import { _ as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { P as Plus, Y as LoaderCircle, _ as Trash2, ct as GripVertical, d as Upload, r as X } from "../_libs/lucide-react.mjs";
import { i as AdminPageHeader, n as AdminLayout } from "./AdminLayout-D0HWfGfb.mjs";
import { t as attributesApi } from "./attributes-B5Cv6WJz.mjs";
import { t as uploadImage } from "./upload-DCG819Qu.mjs";
import { t as productFlagsApi } from "./product-flags-CqIQcQvi.mjs";
import { t as subcategoriesApi } from "./subcategories-BivcEg6G.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.products.new-CT2HHe3Z.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var initialData = {
	name: "",
	slug: "",
	short_description: "",
	full_description: "",
	current_price: 0,
	status: "draft",
	stock_quantity: 0,
	low_stock_threshold: 5,
	material: "",
	metal_type: "",
	metal_colour: "",
	gold_purity: "",
	gross_weight: "",
	gemstone: "",
	seo_title: "",
	seo_description: "",
	focus_keyword: "",
	canonical_url: "",
	social_image: "",
	image_alt_text: "",
	tags: [],
	category_ids: [],
	subcategory_id: null,
	collection_ids: [],
	main_image_url: "",
	gallery_images: []
};
function NewProductPage() {
	const [form, setForm] = (0, import_react.useState)(initialData);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [categories, setCategories] = (0, import_react.useState)([]);
	const [subcategories, setSubcategories] = (0, import_react.useState)([]);
	const [uploading, setUploading] = (0, import_react.useState)(false);
	const [attrDefs, setAttrDefs] = (0, import_react.useState)([]);
	const [productAttrs, setProductAttrs] = (0, import_react.useState)([]);
	const [allFlags, setAllFlags] = (0, import_react.useState)([]);
	const [selectedFlagIds, setSelectedFlagIds] = (0, import_react.useState)([]);
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		categoriesApi.list(true).then((cats) => {
			if (!cancelled) setCategories(cats);
		}).catch(() => {});
		Promise.all([attributesApi.listDefinitions(), productFlagsApi.list()]).then(([defs, flags]) => {
			if (cancelled) return;
			setAttrDefs(defs || []);
			setAllFlags(flags || []);
		}).catch(() => {});
		return () => {
			cancelled = true;
		};
	}, []);
	(0, import_react.useEffect)(() => {
		const catId = form.category_ids?.[0];
		if (catId) subcategoriesApi.listByCategory(catId, true).then(setSubcategories).catch(() => {});
		else setSubcategories([]);
	}, [form.category_ids]);
	const handleChange = (field, value) => {
		setForm((prev) => ({
			...prev,
			[field]: value
		}));
	};
	const handleImageUpload = async (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setUploading(true);
		try {
			const url = await uploadImage(file, "products", "main");
			handleChange("main_image_url", url);
		} catch (err) {
			alert(err.message);
		} finally {
			setUploading(false);
		}
	};
	const handleGalleryUpload = async (e) => {
		const files = Array.from(e.target.files || []);
		if (files.length === 0) return;
		setUploading(true);
		try {
			const urls = await Promise.all(files.map((f) => uploadImage(f, "products", "gallery")));
			handleChange("gallery_images", [...form.gallery_images || [], ...urls]);
		} catch (err) {
			alert(err.message);
		} finally {
			setUploading(false);
		}
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!form.name || !form.slug) return;
		setSaving(true);
		try {
			const created = await productsApi.create(form);
			if (created) {
				await productFlagsApi.setProductFlags(created.id, selectedFlagIds);
				const nameToId = {};
				for (const row of productAttrs) if (row.defId && row.value.trim() && !row.name && !nameToId[row.defId]) {
					const existing = attrDefs.find((d) => d.name.toLowerCase() === row.defId.toLowerCase());
					if (existing) nameToId[row.defId] = existing.id;
					else {
						const slug = row.defId.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
						try {
							const created = await attributesApi.createDefinition({
								name: row.defId,
								slug,
								field_type: "text",
								options: [],
								is_active: true,
								sort_order: 0
							});
							nameToId[row.defId] = created.id;
						} catch {}
					}
				}
				const allAttrs = productAttrs.filter((r) => r.defId && r.value.trim()).map((r, i) => ({
					attribute_definition_id: r.name ? r.defId : nameToId[r.defId] || r.defId,
					value: r.value.trim(),
					sort_order: i
				}));
				await attributesApi.setProductAttributes(created.id, allAttrs);
			}
			await queryClient.invalidateQueries({ queryKey: ["products"] });
			await queryClient.invalidateQueries({ queryKey: ["product"] });
			await queryClient.invalidateQueries({ queryKey: ["categories"] });
			await queryClient.invalidateQueries({ queryKey: [
				"products",
				"published",
				"storefront"
			] });
			if (created) navigate({ to: `/admin/products/${created.id}` });
		} catch (err) {
			alert(err.message);
		} finally {
			setSaving(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminLayout, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPageHeader, {
		title: "New Product",
		description: "Create a new jewellery product",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "submit",
			form: "product-form",
			disabled: saving,
			className: "flex items-center gap-2 rounded-lg bg-[#1a1a2e] px-6 py-2 text-sm font-semibold text-white hover:bg-[#2d1b4e] disabled:opacity-60",
			children: [saving && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), saving ? "Saving..." : "Save Product"]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		id: "product-form",
		onSubmit: handleSubmit,
		className: "grid gap-6 lg:grid-cols-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-6 lg:col-span-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
					title: "General",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Product Name",
							required: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: form.name,
								onChange: (e) => {
									handleChange("name", e.target.value);
									if (!form.slug) handleChange("slug", e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
								},
								className: "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#7A2533]",
								required: true
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid gap-4 sm:grid-cols-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Slug",
								required: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: form.slug,
									onChange: (e) => handleChange("slug", e.target.value),
									className: "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#7A2533]",
									required: true
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Category",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: form.category_ids?.[0] || "",
								onChange: (e) => {
									handleChange("category_ids", e.target.value ? [e.target.value] : []);
									handleChange("subcategory_id", null);
								},
								className: "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#7A2533]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "Select category"
								}), categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: c.id,
									children: c.name
								}, c.id))]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Subcategory",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: form.subcategory_id || "",
								onChange: (e) => handleChange("subcategory_id", e.target.value || null),
								className: "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#7A2533]",
								disabled: !form.category_ids?.[0],
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: form.category_ids?.[0] ? "Select subcategory" : "Select a category first"
								}), subcategories.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: s.id,
									children: s.name
								}, s.id))]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Short Description",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: form.short_description || "",
								onChange: (e) => handleChange("short_description", e.target.value),
								rows: 3,
								className: "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#7A2533]"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Full Description",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: form.full_description || "",
								onChange: (e) => handleChange("full_description", e.target.value),
								rows: 6,
								className: "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#7A2533]"
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					title: "Pricing",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Current Price (₹)",
								required: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									value: form.current_price || "",
									onChange: (e) => handleChange("current_price", Number(e.target.value)),
									className: "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#7A2533]",
									required: true,
									min: "0"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Original Price (₹)",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									value: form.original_price || "",
									onChange: (e) => handleChange("original_price", Number(e.target.value)),
									className: "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#7A2533]",
									min: "0"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Badge",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: form.badge || "",
									onChange: (e) => handleChange("badge", e.target.value || null),
									className: "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#7A2533]",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "",
											children: "None"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "New",
											children: "New"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Best Seller",
											children: "Best Seller"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Trending",
											children: "Trending"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Wedding",
											children: "Wedding"
										})
									]
								})
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
					title: "Attributes",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-3 text-xs text-gray-400",
							children: "Add unlimited product attributes. Type a new name to create a new attribute on the fly."
						}),
						productAttrs.map((row, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-2 flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "cursor-grab text-gray-300",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GripVertical, { className: "h-4 w-4" })
								}),
								row.name && attrDefs.find((d) => d.id === row.defId) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex-1 text-sm font-medium text-gray-700",
									children: row.name
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: row.defId,
									onChange: (e) => {
										const next = [...productAttrs];
										next[i].defId = e.target.value;
										setProductAttrs(next);
									},
									placeholder: "Attribute name",
									className: "flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#7A2533]"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: row.value,
									onChange: (e) => {
										const next = [...productAttrs];
										next[i].value = e.target.value;
										setProductAttrs(next);
									},
									placeholder: row.name ? `Enter ${row.name.toLowerCase()}` : "Value",
									className: "flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#7A2533]"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setProductAttrs(productAttrs.filter((_, j) => j !== i)),
									className: "rounded-lg p-2 text-red-400 hover:bg-red-50 hover:text-red-600",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
								})
							]
						}, i)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setProductAttrs([...productAttrs, {
								defId: "",
								value: "",
								name: ""
							}]),
							className: "mt-3 flex items-center gap-1 text-sm font-medium text-[#7A2533] hover:text-[#7A2533]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), " Add Attribute"]
						}),
						attrDefs.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-xs text-gray-400",
							children: [
								"Tip: Manage reusable attribute definitions in ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/admin/attributes",
									className: "text-[#7A2533] hover:underline",
									children: "Attributes"
								}),
								"."
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					title: "Media",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block text-sm font-medium text-gray-700",
							children: "Main Image"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-start gap-4",
							children: form.main_image_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative h-32 w-32 shrink-0 overflow-hidden rounded-xl bg-gray-100",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: form.main_image_url,
									alt: "Main",
									className: "h-full w-full object-cover"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => handleChange("main_image_url", ""),
									className: "absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" })
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex h-32 w-32 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100",
								children: [uploading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-gray-400" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-6 w-6 text-gray-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-1 text-[10px] text-gray-500",
									children: "Upload"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "file",
									accept: "image/*",
									onChange: handleImageUpload,
									className: "hidden"
								})]
							})
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block text-sm font-medium text-gray-700",
							children: "Gallery Images"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-3",
							children: [(form.gallery_images || []).map((url, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: url,
									alt: `Gallery ${i + 1}`,
									className: "h-full w-full object-cover"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => handleChange("gallery_images", (form.gallery_images || []).filter((_, j) => j !== i)),
									className: "absolute top-0.5 right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" })
								})]
							}, i)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex h-20 w-20 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100",
								children: [uploading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin text-gray-400" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-5 w-5 text-gray-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "file",
									accept: "image/*",
									multiple: true,
									onChange: handleGalleryUpload,
									className: "hidden"
								})]
							})]
						})] })]
					})
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					title: "Status",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: form.status,
						onChange: (e) => handleChange("status", e.target.value),
						className: "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#7A2533]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "draft",
								children: "Draft"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "active",
								children: "Active"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "out_of_stock",
								children: "Out of Stock"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "archived",
								children: "Archived"
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
					title: "Inventory",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Stock Quantity",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							value: form.stock_quantity ?? "",
							onChange: (e) => handleChange("stock_quantity", parseInt(e.target.value) || 0),
							className: "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#7A2533]",
							min: "0"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Low Stock Threshold",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							value: form.low_stock_threshold ?? 5,
							onChange: (e) => handleChange("low_stock_threshold", parseInt(e.target.value) || 5),
							className: "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#7A2533]",
							min: "0"
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
					title: "Flags",
					children: [allFlags.filter((f) => f.status === "active").map((flag) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-3 py-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: selectedFlagIds.includes(flag.id),
								onChange: (e) => {
									if (e.target.checked) setSelectedFlagIds([...selectedFlagIds, flag.id]);
									else setSelectedFlagIds(selectedFlagIds.filter((id) => id !== flag.id));
								},
								className: "rounded border-gray-300"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm text-gray-700",
								children: flag.name
							}),
							flag.badge_label && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider",
								style: {
									backgroundColor: flag.badge_bg_color,
									color: flag.badge_text_color
								},
								children: flag.badge_label
							})
						]
					}, flag.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/admin/product-flags",
						className: "mt-2 inline-flex items-center gap-1 text-xs font-medium text-[#7A2533] hover:text-[#7A2533]",
						children: "Manage Flags →"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					title: "Tags",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						placeholder: "Separate tags with commas",
						value: (form.tags || []).join(", "),
						onChange: (e) => handleChange("tags", e.target.value.split(",").map((t) => t.trim()).filter(Boolean)),
						className: "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#7A2533]"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
					title: "SEO",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "SEO Title",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: form.seo_title || "",
								onChange: (e) => handleChange("seo_title", e.target.value),
								className: "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#7A2533]"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "SEO Description",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: form.seo_description || "",
								onChange: (e) => handleChange("seo_description", e.target.value),
								rows: 2,
								className: "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#7A2533]"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Focus Keyword",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: form.focus_keyword || "",
								onChange: (e) => handleChange("focus_keyword", e.target.value),
								className: "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#7A2533]",
								placeholder: "e.g. gold necklace"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Canonical URL",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: form.canonical_url || "",
								onChange: (e) => handleChange("canonical_url", e.target.value),
								className: "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#7A2533]",
								placeholder: "https://example.com/product/slug"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Social Image URL",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: form.social_image || "",
								onChange: (e) => handleChange("social_image", e.target.value),
								className: "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#7A2533]",
								placeholder: "Open Graph image URL"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Image Alt Text",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: form.image_alt_text || "",
								onChange: (e) => handleChange("image_alt_text", e.target.value),
								className: "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#7A2533]",
								placeholder: "Descriptive alt text for main image"
							})
						})
					]
				})
			]
		})]
	})] });
}
function Section({ title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-gray-200 bg-white p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "mb-4 text-sm font-bold uppercase tracking-wider text-gray-500",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-4",
			children
		})]
	});
}
function Field({ label, required, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "mb-1 block text-sm font-medium text-gray-700",
		children: [
			label,
			" ",
			required && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				children: "*"
			})
		]
	}), children] });
}
//#endregion
export { NewProductPage as component };
