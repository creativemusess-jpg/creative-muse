import { o as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./supabase-Bz-JQXNc.mjs";
import { t as settingsApi } from "./settings-wLvOzTaw.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { A as Save, Et as CircleAlert, M as RefreshCw, O as Send, Y as LoaderCircle, pt as Eye, q as Mail } from "../_libs/lucide-react.mjs";
import { t as giftPackagingApi } from "./gift-packaging-B57zKQ8f.mjs";
import { i as AdminPageHeader, n as AdminLayout, r as AdminLoading } from "./AdminLayout-D0HWfGfb.mjs";
import { i as sendTransactionalEmail, n as listOrderNotifications, r as previewTransactionalEmail, t as getEmailTestingConfig } from "./server-DlvYJMt6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.settings-BnHP6Ho8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminSettings() {
	const [settings, setSettings] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [storeName, setStoreName] = (0, import_react.useState)("Creative Muse");
	const [storeEmail, setStoreEmail] = (0, import_react.useState)("");
	const [storePhone, setStorePhone] = (0, import_react.useState)("");
	const [storeAddress, setStoreAddress] = (0, import_react.useState)("");
	const [newsletterPopupImage, setNewsletterPopupImage] = (0, import_react.useState)("");
	const [emailConfig, setEmailConfig] = (0, import_react.useState)(null);
	const [orders, setOrders] = (0, import_react.useState)([]);
	const [customers, setCustomers] = (0, import_react.useState)([]);
	const [testTemplate, setTestTemplate] = (0, import_react.useState)("welcome");
	const [testRecipient, setTestRecipient] = (0, import_react.useState)("");
	const [selectedOrderId, setSelectedOrderId] = (0, import_react.useState)("");
	const [selectedCustomerId, setSelectedCustomerId] = (0, import_react.useState)("");
	const [previewMode, setPreviewMode] = (0, import_react.useState)("desktop");
	const [preview, setPreview] = (0, import_react.useState)(null);
	const [testHistory, setTestHistory] = (0, import_react.useState)([]);
	const [emailBusy, setEmailBusy] = (0, import_react.useState)(null);
	const [emailResult, setEmailResult] = (0, import_react.useState)(null);
	const [emailError, setEmailError] = (0, import_react.useState)("");
	const [giftCfg, setGiftCfg] = (0, import_react.useState)({
		enabled: true,
		name: "Premium Gift Packaging",
		description: "Luxury gift box with ribbon and message card.",
		price: 199,
		max_quantity: 1,
		allow_gift_message: true,
		max_message_length: 200,
		default_enabled: false,
		display_order: 1,
		status: "active"
	});
	const [estCfg, setEstCfg] = (0, import_react.useState)({
		enabled: true,
		min_days: 3,
		max_days: 5
	});
	const fetch = async () => {
		setLoading(true);
		try {
			const data = await settingsApi.getAll();
			setSettings(data);
			const store = data.find((s) => s.setting_key === "store_info");
			if (store?.setting_value) {
				setStoreName(store.setting_value.name || "Creative Muse");
				setStoreEmail(store.setting_value.email || "");
				setStorePhone(store.setting_value.phone || "");
				setStoreAddress(store.setting_value.address || "");
			}
			const popupImg = data.find((s) => s.setting_key === "newsletter_popup_image");
			if (popupImg?.setting_value?.url) setNewsletterPopupImage(popupImg.setting_value.url);
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		fetch();
	}, []);
	const handleSave = async () => {
		setSaving(true);
		try {
			await settingsApi.set("store_info", {
				name: storeName,
				email: storeEmail,
				phone: storePhone,
				address: storeAddress
			});
			if (newsletterPopupImage) await settingsApi.set("newsletter_popup_image", { url: newsletterPopupImage });
			await giftPackagingApi.saveConfig(giftCfg);
			await giftPackagingApi.saveEstimatedDelivery(estCfg);
			alert("Settings saved");
		} catch (err) {
			alert(err.message);
		} finally {
			setSaving(false);
		}
	};
	const getAccessToken = async () => {
		const { data } = await supabase.auth.getSession();
		return data.session?.access_token || "";
	};
	const loadEmailTesting = async () => {
		try {
			const accessToken = await getAccessToken();
			const [config, orderRows, customerRows, historyRows] = await Promise.all([
				getEmailTestingConfig(),
				supabase.from("orders").select("id, order_number, customer_name, customer_email, order_status, payment_status, created_at").order("created_at", { ascending: false }).limit(50),
				supabase.from("customers").select("id, full_name, email, created_at").order("created_at", { ascending: false }).limit(50),
				listOrderNotifications({ data: {
					isTest: true,
					limit: 20,
					accessToken
				} }).catch(() => [])
			]);
			setEmailConfig(config);
			setTestRecipient((prev) => prev || config.defaultRecipient || "");
			setOrders(orderRows.data || []);
			setCustomers(customerRows.data || []);
			setTestHistory(Array.isArray(historyRows) ? historyRows : []);
		} catch (err) {
			console.error(err);
		}
	};
	(0, import_react.useEffect)(() => {
		loadEmailTesting();
		giftPackagingApi.getConfig().then(setGiftCfg);
		giftPackagingApi.getEstimatedDelivery().then(setEstCfg);
	}, []);
	const templateRequiresOrder = testTemplate !== "welcome";
	const selectedOrder = orders.find((order) => order.id === selectedOrderId);
	const validateEmailTool = () => {
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(testRecipient.trim())) return "Please enter a valid test recipient email.";
		if (templateRequiresOrder && !selectedOrderId) return "Please select a real order for this template.";
		return "";
	};
	const handlePreviewEmail = async (override) => {
		const error = validateEmailTool();
		if (error && !override) {
			setEmailError(error);
			return;
		}
		setEmailBusy("preview");
		setEmailError("");
		setEmailResult(null);
		try {
			const accessToken = await getAccessToken();
			const result = await previewTransactionalEmail({ data: {
				template: override?.template || testTemplate,
				orderId: override?.orderId || selectedOrderId || void 0,
				customerId: override?.customerId || selectedCustomerId || void 0,
				recipient: testRecipient.trim(),
				source: "admin_settings",
				isTest: true,
				viewport: previewMode,
				accessToken
			} });
			setPreview(result);
		} catch (err) {
			setEmailError(err.message || "Preview failed.");
		} finally {
			setEmailBusy(null);
		}
	};
	const handleSendTestEmail = async (override) => {
		const error = validateEmailTool();
		if (error && !override) {
			setEmailError(error);
			return;
		}
		setEmailBusy(override ? "resend" : "send");
		setEmailError("");
		setEmailResult(null);
		try {
			const accessToken = await getAccessToken();
			const result = await sendTransactionalEmail({ data: {
				template: override?.template || testTemplate,
				orderId: override?.orderId || selectedOrderId || void 0,
				customerId: override?.customerId || selectedCustomerId || void 0,
				recipient: override?.recipient || testRecipient.trim(),
				source: "admin_settings",
				isTest: true,
				accessToken
			} });
			setEmailResult(result);
			await loadEmailTesting();
		} catch (err) {
			setEmailError(err.message || "Send failed.");
			await loadEmailTesting();
		} finally {
			setEmailBusy(null);
		}
	};
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLoading, {}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminLayout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPageHeader, {
			title: "Settings",
			description: "Store configuration",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: handleSave,
				disabled: saving,
				className: "flex items-center gap-2 rounded-lg bg-[#1a1a2e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2d1b4e] disabled:opacity-50",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-4 w-4" }),
					" ",
					saving ? "Saving..." : "Save Settings"
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-gray-200 bg-white p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-lg font-bold text-[#1a1a2e] mb-4",
					children: "Store Information"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1",
							children: "Store Name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: storeName,
							onChange: (e) => setStoreName(e.target.value),
							className: "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1",
							children: "Store Email"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: storeEmail,
							onChange: (e) => setStoreEmail(e.target.value),
							className: "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1",
							children: "Store Phone"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: storePhone,
							onChange: (e) => setStorePhone(e.target.value),
							className: "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1",
							children: "Store Address"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: storeAddress,
							onChange: (e) => setStoreAddress(e.target.value),
							rows: 3,
							className: "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
						})] })
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-gray-200 bg-white p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-lg font-bold text-[#1a1a2e] mb-4",
					children: "Newsletter Popup"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1",
							children: "Popup Image URL"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: newsletterPopupImage,
							onChange: (e) => setNewsletterPopupImage(e.target.value),
							className: "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]",
							placeholder: "https://..."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1.5 text-[11px] text-gray-400",
							children: "Leave empty to use the default category image. Changes apply after page refresh."
						})
					] }), newsletterPopupImage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative aspect-video w-full max-w-xs overflow-hidden rounded-lg bg-[#f5efe8]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: newsletterPopupImage,
							alt: "Popup preview",
							className: "h-full w-full object-cover",
							onError: (e) => {
								e.currentTarget.style.display = "none";
							}
						})
					})]
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 rounded-xl border border-gray-200 bg-white p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-3 border-b border-gray-100 pb-5 lg:flex-row lg:items-start lg:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-lg font-bold text-[#1a1a2e]",
						children: "Transactional Email Testing"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-gray-500",
						children: "Test transactional templates safely without changing order status or normal notification idempotency."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700",
						children: emailConfig?.testMode ? "EMAIL_TEST_MODE active" : "Manual test mode"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 grid gap-5 lg:grid-cols-[380px_1fr]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1",
								children: "Email Template"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: testTemplate,
								onChange: (e) => {
									setTestTemplate(e.target.value);
									setPreview(null);
									setEmailResult(null);
								},
								className: "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "welcome",
										children: "Welcome Email"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "order_confirmation",
										children: "Order Confirmation"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "payment_confirmation",
										children: "Payment Confirmation"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "shipped",
										children: "Shipped Email"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "delivered",
										children: "Delivered Email"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "cancellation",
										children: "Cancellation Email"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "refund",
										children: "Refund Email"
									})
								]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1",
								children: "Test Recipient Email"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "email",
								value: testRecipient,
								onChange: (e) => setTestRecipient(e.target.value),
								className: "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]",
								placeholder: "Loaded from EMAIL_TEST_RECIPIENT"
							})] }),
							templateRequiresOrder ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1",
									children: "Order"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: selectedOrderId,
									onChange: (e) => {
										setSelectedOrderId(e.target.value);
										setPreview(null);
									},
									className: "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "Select an existing order"
									}), orders.map((order) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
										value: order.id,
										children: [
											order.order_number,
											" -",
											" ",
											order.customer_name || order.customer_email || "Customer",
											" (",
											order.order_status,
											")"
										]
									}, order.id))]
								}),
								testTemplate === "shipped" && selectedOrder && !selectedOrder.order_status.includes("shipped") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-[11px] text-amber-600",
									children: "Shipped email will validate saved courier and tracking data before sending."
								}),
								testTemplate === "delivered" && selectedOrder?.order_status !== "delivered" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-[11px] text-amber-600",
									children: "This selected order is not delivered; preview will show a warning."
								})
							] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1",
									children: "Customer"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: selectedCustomerId,
									onChange: (e) => {
										setSelectedCustomerId(e.target.value);
										setPreview(null);
									},
									className: "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "Use labelled sample preview data"
									}), customers.map((customer) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
										value: customer.id,
										children: [
											customer.full_name || customer.email,
											" - ",
											customer.email
										]
									}, customer.id))]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-[11px] text-gray-400",
									children: "Welcome tests never update welcome_email_sent_at."
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1",
								children: "Preview Width"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setPreviewMode("desktop"),
									className: `rounded-lg border px-3 py-2 text-xs font-semibold ${previewMode === "desktop" ? "border-[#7A2533] bg-[#fdf8f3] text-[#1a1a2e]" : "border-gray-200 text-gray-500"}`,
									children: "Desktop"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setPreviewMode("mobile"),
									className: `rounded-lg border px-3 py-2 text-xs font-semibold ${previewMode === "mobile" ? "border-[#7A2533] bg-[#fdf8f3] text-[#1a1a2e]" : "border-gray-200 text-gray-500"}`,
									children: "Mobile"
								})]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => handlePreviewEmail(),
									disabled: !!emailBusy,
									className: "inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#7A2533] px-4 py-2 text-sm font-semibold text-[#8a681f] hover:bg-[#fdf8f3] disabled:opacity-50",
									children: [emailBusy === "preview" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" }), "Preview Email"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => handleSendTestEmail(),
									disabled: !!emailBusy,
									className: "inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#1a1a2e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2d1b4e] disabled:opacity-50",
									children: [emailBusy === "send" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4" }), "Send Test Email"]
								})]
							}),
							emailError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "mt-0.5 h-4 w-4 shrink-0" }),
									" ",
									emailError
								]
							}),
							emailResult && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg border border-green-200 bg-green-50 p-3 text-xs text-green-800",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-bold",
										children: "Sent"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Template: ", emailResult.template] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Recipient: ", emailResult.recipient] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Subject: ", emailResult.subject] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Provider: ", emailResult.provider] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Message ID: ", emailResult.providerMessageId || "Unavailable"] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
										"Date:",
										" ",
										emailResult.sentAt ? new Date(emailResult.sentAt).toLocaleString() : (/* @__PURE__ */ new Date()).toLocaleString()
									] })
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-gray-200 bg-[#fdf8f3] p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-3 flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-semibold uppercase tracking-wider text-[#9a792a]",
										children: "Preview"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-medium text-[#1a1a2e]",
										children: preview?.subject || "No preview rendered"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-full bg-white px-2 py-1 text-[10px] font-semibold uppercase text-gray-500",
										children: "Preview only"
									})]
								}),
								preview?.warnings?.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mb-3 rounded-lg border border-amber-200 bg-amber-50 p-2 text-xs text-amber-700",
									children: preview.warnings.join(" ")
								}),
								preview?.html ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `mx-auto overflow-hidden rounded-lg border border-[#e0d8cc] bg-white ${previewMode === "mobile" ? "max-w-[390px]" : "max-w-[760px]"}`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
										title: "Email preview",
										srcDoc: preview.html,
										className: "h-[620px] w-full bg-white"
									})
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex h-[320px] items-center justify-center rounded-lg border border-dashed border-[#d7c39d] bg-white text-sm text-gray-400",
									children: "Choose a template and render a preview."
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-gray-200 bg-white",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between border-b border-gray-100 px-4 py-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
									className: "flex items-center gap-2 text-sm font-bold text-[#1a1a2e]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-4 w-4 text-[#7A2533]" }), " Test Email History"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: loadEmailTesting,
									className: "rounded-lg border border-gray-200 px-2 py-1 text-xs font-semibold text-gray-500 hover:bg-gray-50",
									children: "Refresh"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "overflow-x-auto",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
									className: "w-full text-left text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "border-b border-gray-100 bg-gray-50 text-[10px] uppercase tracking-wider text-gray-500",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-3 py-2",
												children: "Template"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-3 py-2",
												children: "Status"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-3 py-2",
												children: "Recipient"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-3 py-2",
												children: "Sent On"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-3 py-2",
												children: "Actions"
											})
										]
									}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
										className: "divide-y divide-gray-100",
										children: testHistory.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											colSpan: 5,
											className: "px-3 py-6 text-center text-gray-400",
											children: "No test emails yet"
										}) }) : testHistory.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-3 py-2 font-medium text-[#1a1a2e]",
												children: row.metadata?.template_label || row.test_template || row.notification_type
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-3 py-2",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: `rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${row.status === "sent" ? "bg-green-100 text-green-700" : row.status === "failed" ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-700"}`,
													children: row.status
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-3 py-2 text-gray-500",
												children: row.actual_recipient
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-3 py-2 text-gray-500",
												children: row.sent_at ? new Date(row.sent_at).toLocaleString() : "—"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-3 py-2",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex flex-wrap gap-1",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
															type: "button",
															onClick: () => handleSendTestEmail({
																template: row.notification_type,
																orderId: row.order_id,
																customerId: row.customer_id,
																recipient: row.actual_recipient
															}),
															className: "inline-flex items-center gap-1 rounded border border-gray-200 px-2 py-1 text-[10px] font-semibold text-gray-600 hover:bg-gray-50",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3 w-3" }), " Resend Test"]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
															type: "button",
															onClick: () => handlePreviewEmail({
																template: row.notification_type,
																orderId: row.order_id,
																customerId: row.customer_id
															}),
															className: "inline-flex items-center gap-1 rounded border border-gray-200 px-2 py-1 text-[10px] font-semibold text-gray-600 hover:bg-gray-50",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3 w-3" }), " View Preview"]
														}),
														row.error_summary && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															title: row.error_summary,
															className: "rounded border border-red-200 px-2 py-1 text-[10px] font-semibold text-red-600",
															children: "Safe Error"
														})
													]
												})
											})
										] }, row.id))
									})]
								})
							})]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-gray-200 bg-white p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-lg font-bold text-[#1a1a2e] mb-4",
						children: "Gift Packaging"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									id: "gp-enabled",
									checked: giftCfg.enabled,
									onChange: (e) => setGiftCfg({
										...giftCfg,
										enabled: e.target.checked
									}),
									className: "h-4 w-4 rounded border-gray-300 text-[#7A2533] focus:ring-[#7A2533]"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									htmlFor: "gp-enabled",
									className: "text-sm font-medium text-gray-700",
									children: "Enable Gift Packaging"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1",
								children: "Name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: giftCfg.name,
								onChange: (e) => setGiftCfg({
									...giftCfg,
									name: e.target.value
								}),
								className: "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1",
								children: "Description"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: giftCfg.description,
								onChange: (e) => setGiftCfg({
									...giftCfg,
									description: e.target.value
								}),
								rows: 2,
								className: "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1",
								children: "Price (₹)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								value: giftCfg.price,
								onChange: (e) => setGiftCfg({
									...giftCfg,
									price: Number(e.target.value)
								}),
								className: "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									id: "gp-msg",
									checked: giftCfg.allow_gift_message,
									onChange: (e) => setGiftCfg({
										...giftCfg,
										allow_gift_message: e.target.checked
									}),
									className: "h-4 w-4 rounded border-gray-300 text-[#7A2533] focus:ring-[#7A2533]"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									htmlFor: "gp-msg",
									className: "text-sm font-medium text-gray-700",
									children: "Allow Gift Message"
								})]
							}),
							giftCfg.allow_gift_message && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1",
								children: "Max Message Length"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								value: giftCfg.max_message_length,
								onChange: (e) => setGiftCfg({
									...giftCfg,
									max_message_length: Number(e.target.value)
								}),
								className: "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1",
								children: "Status"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: giftCfg.status,
								onChange: (e) => setGiftCfg({
									...giftCfg,
									status: e.target.value
								}),
								className: "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "active",
									children: "Active"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "inactive",
									children: "Inactive"
								})]
							})] })
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-gray-200 bg-white p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-lg font-bold text-[#1a1a2e] mb-4",
						children: "Estimated Delivery"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									id: "est-enabled",
									checked: estCfg.enabled,
									onChange: (e) => setEstCfg({
										...estCfg,
										enabled: e.target.checked
									}),
									className: "h-4 w-4 rounded border-gray-300 text-[#7A2533] focus:ring-[#7A2533]"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									htmlFor: "est-enabled",
									className: "text-sm font-medium text-gray-700",
									children: "Show Estimated Delivery"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1",
								children: "Min Days"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								value: estCfg.min_days,
								onChange: (e) => setEstCfg({
									...estCfg,
									min_days: Number(e.target.value)
								}),
								className: "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1",
								children: "Max Days"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								value: estCfg.max_days,
								onChange: (e) => setEstCfg({
									...estCfg,
									max_days: Number(e.target.value)
								}),
								className: "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
							})] })
						]
					})]
				})
			]
		})
	] });
}
//#endregion
export { AdminSettings as component };
