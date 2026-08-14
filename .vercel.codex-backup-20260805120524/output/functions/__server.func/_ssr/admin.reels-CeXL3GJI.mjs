import { o as __toESM } from "../_runtime.mjs";
import { t as productsApi } from "./products-CsgymTpp.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { s as useStorefrontProducts } from "./products-6Nbb9Ru-.mjs";
import { i as AdminPageHeader, n as AdminLayout, r as AdminLoading } from "./AdminLayout-D0HWfGfb.mjs";
import { t as reelsApi } from "./reels-BV7NCtSb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.reels-CeXL3GJI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STORAGE_KEY = "muse-reels-fallback";
function getLocalReels() {
	try {
		return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
	} catch {
		return [];
	}
}
function saveLocalReels(reels) {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(reels));
}
function AdminReels() {
	const [reels, setReels] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [showForm, setShowForm] = (0, import_react.useState)(false);
	const [useLocal, setUseLocal] = (0, import_react.useState)(false);
	const { products } = useStorefrontProducts();
	const initialized = (0, import_react.useRef)(false);
	const seedLocalReels = () => {
		const existing = getLocalReels();
		if (existing.length > 0) return existing;
		const fallback = products.slice(0, 5).map((p, i) => ({
			id: `reel-${p.id}`,
			video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
			poster_url: p.image,
			product_id: p.id,
			sort_order: (i + 1) * 10,
			is_active: true,
			alt_text: `${p.name} — shoppable reel`,
			created_at: (/* @__PURE__ */ new Date()).toISOString(),
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		}));
		saveLocalReels(fallback);
		return fallback;
	};
	const load = async () => {
		setLoading(true);
		try {
			const data = await reelsApi.listAll();
			setReels(data);
			setUseLocal(false);
		} catch {
			setReels(seedLocalReels());
			setUseLocal(true);
		} finally {
			setLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		if (initialized.current) return;
		initialized.current = true;
		load();
	}, [products]);
	const handleDelete = async (id) => {
		if (!confirm("Delete this reel?")) return;
		if (useLocal) {
			const updated = getLocalReels().filter((r) => r.id !== id);
			saveLocalReels(updated);
			setReels(updated);
		} else {
			await reelsApi.delete(id);
			await load();
		}
	};
	const handleToggleActive = async (r) => {
		if (useLocal) {
			const updated = getLocalReels().map((reel) => reel.id === r.id ? {
				...reel,
				is_active: !reel.is_active
			} : reel);
			saveLocalReels(updated);
			setReels(updated);
		} else {
			await reelsApi.update(r.id, { is_active: !r.is_active });
			await load();
		}
	};
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLoading, {}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminLayout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPageHeader, {
			title: "Shoppable Reels",
			description: "Manage Instagram-style shoppable reel videos"
		}),
		useLocal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800",
			children: "Using local storage — database table not available. Edit, add, and delete reels below; they'll be saved locally."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => {
					setEditing(null);
					setShowForm(true);
				},
				className: "rounded-lg bg-[#7A2533] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#5F1C27]",
				children: "+ Add Reel"
			})
		}),
		showForm && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReelForm, {
			reel: editing,
			onSave: async () => {
				setShowForm(false);
				setEditing(null);
				await load();
			},
			onCancel: () => {
				setShowForm(false);
				setEditing(null);
			},
			useLocal
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto rounded-xl border border-gray-200 bg-white",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-gray-100 bg-gray-50 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "Order"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "Preview"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "Product ID"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "Status"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "Actions"
						})
					]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: reels.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					colSpan: 5,
					className: "px-4 py-8 text-center text-gray-400",
					children: "No reels yet."
				}) }) : reels.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-gray-50 hover:bg-gray-50/50",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 text-gray-500",
							children: r.sort_order
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
									src: r.video_url,
									className: "h-16 w-9 rounded-lg object-cover",
									muted: true,
									loop: true,
									playsInline: true,
									onMouseEnter: (e) => e.currentTarget.play(),
									onMouseLeave: (e) => {
										e.currentTarget.pause();
										e.currentTarget.currentTime = 0;
									}
								}), r.poster_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: r.poster_url,
									alt: "",
									className: "h-10 w-10 rounded object-cover"
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 font-mono text-xs text-gray-600",
							children: r.product_id
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase ${r.is_active ? "border border-[#7A2533]/20 bg-[#fff4f5] text-[#7A2533]" : "bg-gray-100 text-gray-500"}`,
								children: r.is_active ? "Active" : "Inactive"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => {
											setEditing(r);
											setShowForm(true);
										},
										className: "text-xs text-[#7A2533] hover:underline",
										children: "Edit"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => handleDelete(r.id),
										className: "text-xs text-red-500 hover:underline",
										children: "Delete"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => handleToggleActive(r),
										className: "text-xs text-gray-500 hover:underline",
										children: r.is_active ? "Deactivate" : "Activate"
									})
								]
							})
						})
					]
				}, r.id)) })]
			})
		})
	] });
}
function ReelForm({ reel, onSave, onCancel, useLocal }) {
	const [videoUrl, setVideoUrl] = (0, import_react.useState)(reel?.video_url || "");
	const [posterUrl, setPosterUrl] = (0, import_react.useState)(reel?.poster_url || "");
	const [productId, setProductId] = (0, import_react.useState)(reel?.product_id || "");
	const [sortOrder, setSortOrder] = (0, import_react.useState)(reel?.sort_order ?? 0);
	const [isActive, setIsActive] = (0, import_react.useState)(reel?.is_active ?? true);
	const [altText, setAltText] = (0, import_react.useState)(reel?.alt_text || "");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [uploading, setUploading] = (0, import_react.useState)(false);
	const [search, setSearch] = (0, import_react.useState)(reel ? "" : "");
	const [products, setProducts] = (0, import_react.useState)([]);
	const [showDropdown, setShowDropdown] = (0, import_react.useState)(false);
	const fileInputRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (search.length >= 2) productsApi.list({
			search,
			status: "active",
			per_page: 20
		}).then((res) => {
			setProducts(res.data);
			setShowDropdown(true);
		}).catch(() => {});
		else {
			setProducts([]);
			setShowDropdown(false);
		}
	}, [search]);
	const handleVideoUpload = async (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		if (!file.type.startsWith("video/")) {
			alert("Please select a video file.");
			return;
		}
		if (file.size > 50 * 1024 * 1024) {
			alert("Video must be under 50MB.");
			return;
		}
		setUploading(true);
		try {
			const url = await reelsApi.uploadVideo(file);
			setVideoUrl(url);
		} catch (err) {
			alert(err.message + (useLocal ? " Since DB is unavailable, paste a direct video URL instead." : ""));
		} finally {
			setUploading(false);
		}
	};
	const nextLocalId = () => `reel-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!videoUrl.trim() || !productId.trim()) {
			alert("Video and Product are required.");
			return;
		}
		setSaving(true);
		try {
			if (useLocal) {
				let local = getLocalReels();
				if (reel) local = local.map((r) => r.id === reel.id ? {
					...r,
					video_url: videoUrl.trim(),
					poster_url: posterUrl.trim() || null,
					product_id: productId.trim(),
					sort_order: sortOrder,
					is_active: isActive,
					alt_text: altText.trim() || null,
					updated_at: (/* @__PURE__ */ new Date()).toISOString()
				} : r);
				else local.push({
					id: nextLocalId(),
					video_url: videoUrl.trim(),
					poster_url: posterUrl.trim() || null,
					product_id: productId.trim(),
					sort_order: sortOrder,
					is_active: isActive,
					alt_text: altText.trim() || null,
					created_at: (/* @__PURE__ */ new Date()).toISOString(),
					updated_at: (/* @__PURE__ */ new Date()).toISOString()
				});
				saveLocalReels(local);
				await onSave();
			} else {
				const data = {
					video_url: videoUrl.trim(),
					poster_url: posterUrl.trim() || null,
					product_id: productId.trim(),
					sort_order: sortOrder,
					is_active: isActive,
					alt_text: altText.trim() || null
				};
				if (reel) await reelsApi.update(reel.id, data);
				else await reelsApi.create(data);
				await onSave();
			}
		} catch (err) {
			alert(err.message);
		} finally {
			setSaving(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: handleSubmit,
		className: "mb-8 rounded-xl border border-gray-200 bg-white p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mb-5 text-sm font-bold uppercase tracking-wider text-gray-500",
				children: reel ? "Edit Reel" : "Add New Reel"
			}),
			useLocal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-4 text-xs text-amber-600",
				children: "Saving locally — changes will persist in browser storage."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-5 sm:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "sm:col-span-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1 block text-xs font-medium text-gray-600",
								children: "Reel Video *"
							}),
							videoUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-2 flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
									src: videoUrl,
									className: "h-20 w-12 rounded-lg object-cover",
									controls: true
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setVideoUrl(""),
									className: "text-xs text-red-500 hover:underline",
									children: "Remove"
								})]
							}) : null,
							!useLocal && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								ref: fileInputRef,
								type: "file",
								accept: "video/mp4,video/webm",
								onChange: handleVideoUpload,
								className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
							}), uploading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-[#7A2533]",
								children: "Uploading video..."
							})] }),
							videoUrl ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-gray-400",
								children: useLocal ? "Enter a direct video URL (MP4/WebM):" : "MP4 or WebM · max 50MB — or enter URL directly:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "url",
								value: videoUrl,
								onChange: (e) => setVideoUrl(e.target.value),
								placeholder: "https://example.com/reel.mp4",
								className: "mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
							})] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block text-xs font-medium text-gray-600",
							children: "Poster Image URL"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "url",
							value: posterUrl,
							onChange: (e) => setPosterUrl(e.target.value),
							placeholder: "https://example.com/poster.jpg",
							className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
						}),
						posterUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: posterUrl,
							alt: "",
							className: "mt-1 h-16 w-16 rounded object-cover"
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1 block text-xs font-medium text-gray-600",
								children: "Linked Product *"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: search,
								onChange: (e) => {
									setSearch(e.target.value);
									setProductId("");
								},
								onFocus: () => {
									if (products.length > 0) setShowDropdown(true);
								},
								placeholder: "Search product by name...",
								className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
							}),
							productId && !search && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-[#7A2533]",
								children: ["Selected: ", productId]
							}),
							showDropdown && products.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "absolute z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg",
								children: products.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									onClick: () => {
										setProductId(p.id);
										setSearch(p.name);
										setShowDropdown(false);
									},
									className: "flex cursor-pointer items-center gap-2 px-3 py-2 text-sm hover:bg-[#f5efe8]",
									children: [p.main_image?.url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: p.main_image.url,
										alt: "",
										className: "h-8 w-8 rounded object-cover"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-medium text-[#1a1a2e]",
										children: p.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-[10px] text-gray-400",
										children: ["ID: ", p.id]
									})] })]
								}, p.id))
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mb-1 block text-xs font-medium text-gray-600",
						children: "Sort Order"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "number",
						min: 0,
						value: sortOrder,
						onChange: (e) => setSortOrder(Number(e.target.value)),
						className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mb-1 block text-xs font-medium text-gray-600",
						children: "Alt Text"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						value: altText,
						onChange: (e) => setAltText(e.target.value),
						placeholder: "Describe the video content",
						className: "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: isActive,
								onChange: (e) => setIsActive(e.target.checked),
								className: "h-4 w-4 rounded border-gray-300 text-[#7A2533] focus:ring-[#7A2533]"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm text-gray-700",
								children: "Active"
							})]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "submit",
					disabled: saving || uploading,
					className: "rounded-lg bg-[#7A2533] px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#5F1C27] disabled:opacity-50",
					children: saving ? "Saving..." : reel ? "Update Reel" : "Create Reel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onCancel,
					className: "rounded-lg border border-gray-300 px-6 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50",
					children: "Cancel"
				})]
			})
		]
	});
}
//#endregion
export { AdminReels as component };
