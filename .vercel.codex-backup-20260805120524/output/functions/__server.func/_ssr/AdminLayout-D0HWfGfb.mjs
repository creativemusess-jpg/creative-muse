import { o as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./supabase-Bz-JQXNc.mjs";
import { t as productsApi } from "./products-CsgymTpp.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { _ as Link, l as useLocation, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { $ as Layers, B as Package, C as ShoppingCart, Ct as Clock, D as Settings, G as Menu, J as LogOut, Nt as ChartColumn, Q as LayoutDashboard, U as MessageSquare, V as PackageOpen, X as ListChecks, c as Users, dt as FileText, ht as ExternalLink, k as Search, kt as ChevronRight, q as Mail, r as X, rt as House, s as Video, tt as Image, u as UserCog, ut as Flag, v as Tag } from "../_libs/lucide-react.mjs";
import { t as normalizeOrderItems } from "./order-items-1dSWUIeN.mjs";
import { t as adminApi } from "./admin-Cd48uf7H.mjs";
import { t as clearGuardCache } from "./auth-guard-CPGwskRa.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AdminLayout-D0HWfGfb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var db$1 = () => supabase;
async function logAction(action, entityId, oldValues, newValues) {
	try {
		await adminApi.logAction(action, "order", entityId, oldValues, newValues);
	} catch {}
}
async function getAdminUser() {
	const { data } = await supabase.auth.getUser();
	return data.user;
}
async function ensureInvoiceNumber(orderId, orderNumber) {
	const { data: order } = await db$1().from("orders").select("invoice_number").eq("id", orderId).maybeSingle();
	if (order?.invoice_number) return order.invoice_number;
	const year = (/* @__PURE__ */ new Date()).getFullYear();
	const { data: lastInv } = await db$1().from("orders").select("invoice_number").not("invoice_number", "is", null).order("created_at", { ascending: false }).limit(1).maybeSingle();
	let seq = 1;
	if (lastInv?.invoice_number) {
		const parts = lastInv.invoice_number.split("-");
		seq = parseInt(parts[parts.length - 1], 10) + 1;
	}
	const invoiceNumber = `CM-INV-${year}-${String(seq).padStart(6, "0")}`;
	const { error } = await db$1().from("orders").update({ invoice_number: invoiceNumber }).eq("id", orderId);
	if (error) {
		const fallbackInv = `CM-INV-${year}-${Date.now().toString(36).toUpperCase()}`;
		await db$1().from("orders").update({ invoice_number: fallbackInv }).eq("id", orderId);
		return fallbackInv;
	}
	return invoiceNumber;
}
var ordersApi = {
	async list(filters = {}) {
		let query = db$1().from("orders").select("*", { count: "exact" });
		if (filters.archived) query = query.eq("is_archived", true);
		else query = query.eq("is_archived", false);
		if (filters.status) query = query.eq("order_status", filters.status);
		if (filters.customerId) query = query.eq("customer_id", filters.customerId);
		if (filters.search) {
			const searchTerm = filters.search;
			const orderIdsFromItems = [];
			const { data: itemMatches } = await db$1().from("order_items").select("order_id").or(`product_name.ilike.%${searchTerm}%`);
			if (itemMatches?.length) {
				const seen = /* @__PURE__ */ new Set();
				for (const m of itemMatches) if (m.order_id && !seen.has(m.order_id)) {
					seen.add(m.order_id);
					orderIdsFromItems.push(m.order_id);
				}
			}
			if (orderIdsFromItems.length > 0) query = query.or(`order_number.ilike.%${searchTerm}%,customer_name.ilike.%${searchTerm}%,customer_email.ilike.%${searchTerm}%,id.in.(${orderIdsFromItems.join(",")})`);
			else query = query.or(`order_number.ilike.%${searchTerm}%,customer_name.ilike.%${searchTerm}%,customer_email.ilike.%${searchTerm}%`);
		}
		query = query.order("created_at", { ascending: false });
		const page = filters.page || 1;
		const perPage = filters.per_page || 20;
		const from = (page - 1) * perPage;
		query = query.range(from, from + perPage - 1);
		const { data, error, count } = await query;
		if (error) throw error;
		const orders = data || [];
		const orderIds = orders.map((o) => o.id);
		const itemsByOrder = /* @__PURE__ */ new Map();
		if (orderIds.length > 0) {
			const { data: items } = await db$1().from("order_items").select("*").in("order_id", orderIds);
			if (items) for (const item of items) {
				const list = itemsByOrder.get(item.order_id);
				if (list) list.push(item);
				else itemsByOrder.set(item.order_id, [item]);
			}
		}
		const normalizedByOrder = /* @__PURE__ */ new Map();
		for (const [orderId, rawItems] of itemsByOrder) normalizedByOrder.set(orderId, normalizeOrderItems(rawItems));
		const missingImageIds = [...new Set([...normalizedByOrder.values()].flat().filter((i) => !i.productImage && i.productId).map((i) => i.productId))];
		if (missingImageIds.length > 0) {
			const { data: fallbackImages } = await db$1().from("product_images").select("product_id, url, is_main").in("product_id", missingImageIds);
			if (fallbackImages) {
				const imageMap = /* @__PURE__ */ new Map();
				for (const pi of fallbackImages) if (imageMap.has(pi.product_id)) {
					if (pi.is_main) imageMap.set(pi.product_id, pi.url);
				} else imageMap.set(pi.product_id, pi.url);
				for (const items of normalizedByOrder.values()) for (const item of items) if (!item.productImage && item.productId) item.productImage = imageMap.get(item.productId) || null;
			}
		}
		return {
			data: orders.map((o) => ({
				...o,
				_items: normalizedByOrder.get(o.id) || []
			})),
			count: count || 0
		};
	},
	async getById(id) {
		const { data: order, error: orderError } = await db$1().from("orders").select("*").eq("id", id).maybeSingle();
		if (orderError || !order) return null;
		const { data: items } = await db$1().from("order_items").select("*").eq("order_id", id);
		const normalized = normalizeOrderItems(items || []);
		const missingImageIds = [...new Set(normalized.filter((i) => !i.productImage && i.productId).map((i) => i.productId))];
		if (missingImageIds.length > 0) {
			const { data: fallbackImages } = await db$1().from("product_images").select("product_id, url, is_main").in("product_id", missingImageIds);
			if (fallbackImages) {
				const imageMap = /* @__PURE__ */ new Map();
				for (const pi of fallbackImages) if (imageMap.has(pi.product_id)) {
					if (pi.is_main) imageMap.set(pi.product_id, pi.url);
				} else imageMap.set(pi.product_id, pi.url);
				for (const item of normalized) if (!item.productImage && item.productId) item.productImage = imageMap.get(item.productId) || null;
			}
		}
		return {
			order,
			items: normalized
		};
	},
	async updateStatus(id, status, trackingId, courier) {
		const { data: oldOrder } = await db$1().from("orders").select("*").eq("id", id).maybeSingle();
		const updatePayload = {
			order_status: status,
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		};
		if (trackingId !== void 0) {
			updatePayload.tracking_id = trackingId || null;
			updatePayload.tracking_number = trackingId || null;
		}
		if (courier !== void 0) updatePayload.courier = courier || null;
		if (status === "shipped") updatePayload.shipped_at = (/* @__PURE__ */ new Date()).toISOString();
		if (status === "delivered") updatePayload.delivered_at = (/* @__PURE__ */ new Date()).toISOString();
		if (status === "cancelled") {
			const user = await getAdminUser();
			updatePayload.cancelled_at = (/* @__PURE__ */ new Date()).toISOString();
			updatePayload.cancelled_by = user?.id || null;
		}
		const { error } = await db$1().from("orders").update(updatePayload).eq("id", id);
		if (error) throw error;
		await logAction(`order_status_${status}`, id, oldValues(oldOrder), updatePayload);
	},
	async updatePaymentStatus(id, status) {
		const { data: oldOrder } = await db$1().from("orders").select("payment_status, total_amount").eq("id", id).maybeSingle();
		const { error } = await db$1().from("orders").update({
			payment_status: status,
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		}).eq("id", id);
		if (error) throw error;
		await logAction(`payment_status_${status}`, id, oldValues(oldOrder), { payment_status: status });
	},
	async addNote(id, note) {
		const user = await getAdminUser();
		const { data: order } = await db$1().from("orders").select("notes").eq("id", id).maybeSingle();
		const existingNotes = order?.notes || "";
		const newNoteEntry = `[${(/* @__PURE__ */ new Date()).toISOString()}] ${user?.email || "Admin"}: ${note}`;
		const updatedNotes = existingNotes ? `${existingNotes}\n${newNoteEntry}` : newNoteEntry;
		const { error } = await db$1().from("orders").update({
			notes: updatedNotes,
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		}).eq("id", id);
		if (error) throw error;
		await logAction("note_added", id);
	},
	async deleteNote(id, noteTimestamp) {
		const { data: order } = await db$1().from("orders").select("notes").eq("id", id).maybeSingle();
		if (!order?.notes) return;
		const lines = order.notes.split("\n").filter((l) => !l.startsWith(`[${noteTimestamp}]`));
		await db$1().from("orders").update({
			notes: lines.join("\n"),
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		}).eq("id", id);
		await logAction("note_deleted", id);
	},
	async updateTracking(id, data) {
		const { error } = await db$1().from("orders").update({
			...data,
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		}).eq("id", id);
		if (error) throw error;
		await logAction("tracking_updated", id, null, data);
	},
	async addCancellationReason(id, reason) {
		const user = await getAdminUser();
		const { error } = await db$1().from("orders").update({
			cancellation_reason: reason,
			cancelled_at: (/* @__PURE__ */ new Date()).toISOString(),
			cancelled_by: user?.id || null,
			order_status: "cancelled",
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		}).eq("id", id);
		if (error) throw error;
		await logAction("order_cancelled", id, null, { cancellation_reason: reason });
	},
	async duplicateOrder(id) {
		const { data: original } = await db$1().from("orders").select("*").eq("id", id).maybeSingle();
		if (!original) return null;
		const { data: originalItems } = await db$1().from("order_items").select("*").eq("order_id", id);
		const newOrderNumber = `CM-${(/* @__PURE__ */ new Date()).getFullYear()}-${crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase()}`;
		const { data: newOrder, error: orderErr } = await db$1().from("orders").insert({
			order_number: newOrderNumber,
			customer_id: original.customer_id,
			customer_email: original.customer_email,
			customer_name: original.customer_name,
			customer_phone: original.customer_phone,
			subtotal: original.subtotal,
			discount_amount: 0,
			shipping_amount: original.shipping_amount,
			tax_amount: original.tax_amount,
			total_amount: original.total_amount,
			payment_status: "pending",
			order_status: "pending",
			shipping_address: original.shipping_address,
			delivery_address: original.delivery_address,
			duplicated_from_id: original.id,
			notes: `Duplicated from order ${original.order_number}`
		}).select().single();
		if (orderErr || !newOrder) throw new Error("Failed to create duplicate order");
		if (originalItems) {
			const newItems = originalItems.map((item) => ({
				order_id: newOrder.id,
				product_id: item.product_id,
				product_name: item.product_name,
				product_image: item.product_image,
				quantity: item.quantity,
				unit_price: item.unit_price,
				total_price: item.total_price,
				variant_info: item.variant_info
			}));
			const { error: itemsErr } = await db$1().from("order_items").insert(newItems);
			if (itemsErr) throw new Error("Failed to create duplicate order items");
		}
		await logAction("order_duplicated", id, null, {
			new_order_id: newOrder.id,
			new_order_number: newOrderNumber
		});
		return newOrder.id;
	},
	async archiveOrder(id) {
		const user = await getAdminUser();
		const { error } = await db$1().from("orders").update({
			is_archived: true,
			archived_at: (/* @__PURE__ */ new Date()).toISOString(),
			archived_by: user?.id || null,
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		}).eq("id", id);
		if (error) throw error;
		await logAction("order_archived", id);
	},
	async restoreOrder(id) {
		const { error } = await db$1().from("orders").update({
			is_archived: false,
			archived_at: null,
			archived_by: null,
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		}).eq("id", id);
		if (error) throw error;
		await logAction("order_restored", id);
	},
	async getCustomerSummary(customerId) {
		const { data: customer } = await db$1().from("customers").select("*").eq("id", customerId).maybeSingle();
		if (!customer) return {
			totalOrders: 0,
			totalCompleted: 0,
			totalCancelled: 0,
			totalSpent: 0,
			totalRefunded: 0,
			lastOrderDate: null,
			customerSince: null
		};
		const { data: orders } = await db$1().from("orders").select("order_status, total_amount").eq("customer_id", customerId);
		const orderList = orders || [];
		return {
			totalOrders: customer.total_orders || orderList.length,
			totalCompleted: orderList.filter((o) => o.order_status === "delivered").length,
			totalCancelled: orderList.filter((o) => o.order_status === "cancelled").length,
			totalSpent: customer.total_spent || orderList.reduce((s, o) => s + (o.total_amount || 0), 0),
			totalRefunded: orderList.filter((o) => o.order_status === "refunded").reduce((s, o) => s + (o.total_amount || 0), 0),
			lastOrderDate: orderList.length > 0 ? orderList[0].created_at : null,
			customerSince: customer.created_at || null
		};
	},
	async getAuditLogsForOrder(orderId) {
		const { data } = await db$1().from("audit_logs").select("*, profiles:user_id(full_name, email)").eq("entity_id", orderId).eq("entity_type", "order").order("created_at", { ascending: false }).limit(100);
		return data || [];
	},
	async getPaymentsForOrder(orderId) {
		const { data } = await db$1().from("payments").select("*").eq("order_id", orderId).order("created_at", { ascending: false });
		return data || [];
	},
	async createRefund(orderId, amount, reason) {
		const { data: order } = await db$1().from("orders").select("payment_status, total_amount").eq("id", orderId).maybeSingle();
		if (!order) throw new Error("Order not found");
		if (amount > order.total_amount) throw new Error("Refund amount exceeds order total");
		const { data: payments } = await db$1().from("payments").select("*").eq("order_id", orderId);
		const totalPaid = (payments || []).reduce((s, p) => s + (p.status === "paid" ? Number(p.amount) : 0), 0);
		if (amount > totalPaid) throw new Error("Refund amount exceeds amount paid");
		const user = await getAdminUser();
		const { error } = await db$1().from("payments").insert({
			order_id: orderId,
			amount: -amount,
			status: "refunded",
			payment_method: "manual_refund",
			is_demo: true,
			transaction_reference: `REF-${Date.now()}`,
			safe_metadata: {
				refund_reason: reason,
				processed_by: user?.id
			}
		});
		if (error) throw error;
		const newPaymentStatus = amount >= totalPaid ? "refunded" : "partially_refunded";
		await db$1().from("orders").update({
			payment_status: newPaymentStatus,
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		}).eq("id", orderId);
		await logAction("refund_created", orderId, null, {
			amount,
			reason,
			payment_status: newPaymentStatus
		});
	},
	async ensureInvoiceNumber(id) {
		return ensureInvoiceNumber(id, "");
	}
};
function oldValues(obj) {
	if (!obj) return null;
	const safe = {};
	for (const f of [
		"order_status",
		"payment_status",
		"total_amount",
		"tracking_id",
		"courier"
	]) if (f in obj) safe[f] = obj[f];
	return safe;
}
var db = () => supabase;
var customersApi = {
	async list(filters = {}) {
		let query = db().from("customers").select("*", { count: "exact" });
		if (filters.search) query = query.or(`email.ilike.%${filters.search}%,full_name.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`);
		query = query.order("created_at", { ascending: false });
		const page = filters.page || 1;
		const perPage = filters.per_page || 20;
		const from = (page - 1) * perPage;
		query = query.range(from, from + perPage - 1);
		const { data, error, count } = await query;
		if (error) throw error;
		return {
			data: data || [],
			count: count || 0
		};
	},
	async getById(id) {
		const { data, error } = await db().from("customers").select("*").eq("id", id).maybeSingle();
		if (error) return null;
		return data;
	}
};
function GlobalSearch({ open, onClose }) {
	const [query, setQuery] = (0, import_react.useState)("");
	const [results, setResults] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [selectedIdx, setSelectedIdx] = (0, import_react.useState)(-1);
	const inputRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (open) setTimeout(() => inputRef.current?.focus(), 100);
		else {
			setQuery("");
			setResults([]);
		}
	}, [open]);
	const search = (0, import_react.useCallback)(async (q) => {
		if (q.length < 2) {
			setResults([]);
			return;
		}
		setLoading(true);
		const items = [];
		try {
			const [pRes, oRes, cRes] = await Promise.all([
				productsApi.list({
					search: q,
					per_page: 5
				}),
				ordersApi.list({
					search: q,
					per_page: 5
				}),
				customersApi.list({
					search: q,
					per_page: 5
				})
			]);
			pRes.data.forEach((p) => items.push({
				type: "product",
				label: p.name,
				subtitle: `₹${p.current_price?.toLocaleString("en-IN") ?? "—"}`,
				href: `/admin/products/${p.id}`
			}));
			oRes.data.forEach((o) => items.push({
				type: "order",
				label: o.order_number ?? `Order ${o.id.slice(0, 8)}`,
				subtitle: o.status ?? "—",
				href: `/admin/orders/${o.id}`
			}));
			cRes.data.forEach((c) => items.push({
				type: "customer",
				label: c.full_name || c.email || "—",
				subtitle: c.email || "",
				href: `/admin/customers/${c.id}`
			}));
		} catch {}
		setResults(items);
		setSelectedIdx(-1);
		setLoading(false);
	}, []);
	(0, import_react.useEffect)(() => {
		const timer = setTimeout(() => search(query), 300);
		return () => clearTimeout(timer);
	}, [query, search]);
	const handleKeyDown = (e) => {
		if (e.key === "ArrowDown") {
			e.preventDefault();
			setSelectedIdx((i) => Math.min(i + 1, results.length - 1));
		}
		if (e.key === "ArrowUp") {
			e.preventDefault();
			setSelectedIdx((i) => Math.max(i - 1, 0));
		}
		if (e.key === "Enter" && selectedIdx >= 0) {
			window.location.href = results[selectedIdx].href;
			onClose();
		}
		if (e.key === "Escape") onClose();
	};
	if (!open) return null;
	const icon = (type) => {
		switch (type) {
			case "product": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-4 w-4 text-gray-400" });
			case "order": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { className: "h-4 w-4 text-gray-400" });
			case "customer": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4 text-gray-400" });
			default: return null;
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-[100] flex items-start justify-center bg-black/30 pt-24",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-4 w-full max-w-xl rounded-xl bg-white shadow-2xl",
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center border-b border-gray-200 px-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-5 w-5 text-gray-400" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							ref: inputRef,
							type: "text",
							placeholder: "Search products, orders, customers...",
							value: query,
							onChange: (e) => setQuery(e.target.value),
							onKeyDown: handleKeyDown,
							className: "flex-1 border-0 px-3 py-4 text-sm outline-none"
						}),
						loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-4 animate-spin rounded-full border-2 border-[#7A2533] border-t-transparent" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: onClose,
							className: "ml-2 rounded-lg p-1 hover:bg-gray-100",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4 text-gray-400" })
						})
					]
				}),
				results.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "max-h-80 overflow-y-auto p-2",
					children: results.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: r.href,
						onClick: onClose,
						className: `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${i === selectedIdx ? "bg-gray-100" : "hover:bg-gray-50"}`,
						children: [
							icon(r.type),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1 min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium text-[#1a1a2e] truncate",
									children: r.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-gray-400",
									children: r.subtitle
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] uppercase text-gray-400",
								children: r.type
							})
						]
					}, `${r.type}-${r.href}`))
				}),
				query.length >= 2 && !loading && results.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "py-10 text-center text-sm text-gray-400",
					children: "No results found"
				})
			]
		})
	});
}
var cachedSessionPromise = null;
var cachedSessionValue = void 0;
var navItems = [
	{
		label: "Dashboard",
		href: "/admin",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutDashboard, { className: "h-4 w-4" })
	},
	{
		label: "Orders",
		href: "/admin/orders",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { className: "h-4 w-4" }),
		permission: "orders"
	},
	{
		label: "Products",
		href: "/admin/products",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-4 w-4" }),
		permission: "products"
	},
	{
		label: "Categories",
		href: "/admin/categories",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackageOpen, { className: "h-4 w-4" }),
		permission: "categories"
	},
	{
		label: "Subcategories",
		href: "/admin/subcategories",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "h-4 w-4" }),
		permission: "categories"
	},
	{
		label: "Collections",
		href: "/admin/collections",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4" }),
		permission: "products"
	},
	{
		label: "Inventory",
		href: "/admin/inventory",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackageOpen, { className: "h-4 w-4" }),
		permission: "products"
	},
	{
		label: "Product Flags",
		href: "/admin/product-flags",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, { className: "h-4 w-4" }),
		permission: "products"
	},
	{
		label: "Attributes",
		href: "/admin/attributes",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListChecks, { className: "h-4 w-4" }),
		permission: "products"
	},
	{
		label: "Customers",
		href: "/admin/customers",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4" }),
		permission: "customers"
	},
	{
		label: "Coupons",
		href: "/admin/coupons",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { className: "h-4 w-4" }),
		permission: "coupons"
	},
	{
		label: "Analytics",
		href: "/admin/analytics",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "h-4 w-4" }),
		permission: "*"
	},
	{
		label: "Content",
		href: "/admin/homepage",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { className: "h-4 w-4" }),
		permission: "homepage"
	},
	{
		label: "Enquiries",
		href: "/admin/enquiries",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "h-4 w-4" }),
		permission: "enquiries"
	},
	{
		label: "Newsletter",
		href: "/admin/newsletter",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-4 w-4" }),
		permission: "newsletter"
	},
	{
		label: "Media",
		href: "/admin/media",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "h-4 w-4" }),
		permission: "media"
	},
	{
		label: "Shoppable Reels",
		href: "/admin/reels",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "h-4 w-4" }),
		permission: "homepage"
	},
	{
		label: "Staff",
		href: "/admin/staff",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCog, { className: "h-4 w-4" }),
		permission: "*"
	},
	{
		label: "Settings",
		href: "/admin/settings",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "h-4 w-4" }),
		permission: "*"
	},
	{
		label: "Audit Logs",
		href: "/admin/audit-logs",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4" }),
		permission: "*"
	}
];
function hasAccess(item, session) {
	if (!session) return false;
	if (!item.permission) return true;
	return session.permissions.includes("*") || session.permissions.includes(item.permission);
}
function AdminLayout({ children }) {
	const [session, setSession] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [sidebarOpen, setSidebarOpen] = (0, import_react.useState)(false);
	const [searchOpen, setSearchOpen] = (0, import_react.useState)(false);
	const location = useLocation();
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		if (!cachedSessionPromise) cachedSessionPromise = adminApi.getCurrentUser().then((s) => {
			cachedSessionValue = s;
			return s;
		});
		if (cachedSessionValue !== void 0) {
			setSession(cachedSessionValue);
			setLoading(false);
			if (!cachedSessionValue) navigate({ to: "/admin/login" });
			return;
		}
		cachedSessionPromise.then((s) => {
			setSession(s);
			setLoading(false);
			if (!s) navigate({ to: "/admin/login" });
		});
	}, [navigate]);
	(0, import_react.useEffect)(() => {
		const handler = (e) => {
			if ((e.ctrlKey || e.metaKey) && e.key === "k") {
				e.preventDefault();
				setSearchOpen(true);
			}
		};
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, []);
	const handleLogout = async () => {
		await adminApi.logout();
		cachedSessionPromise = null;
		cachedSessionValue = void 0;
		clearGuardCache();
		navigate({ to: "/admin/login" });
	};
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex h-screen items-center justify-center bg-[#f8f9fa]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-8 animate-spin rounded-full border-4 border-[#7A2533] border-t-transparent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-gray-500",
				children: "Loading..."
			})]
		})
	});
	if (!session) return null;
	const isActive = (href) => {
		if (href === "/admin") return location.pathname === "/admin";
		return location.pathname.startsWith(href);
	};
	const visibleItems = navItems.filter((item) => hasAccess(item, session));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-screen overflow-hidden bg-gray-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlobalSearch, {
				open: searchOpen,
				onClose: () => setSearchOpen(false)
			}),
			sidebarOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-40 bg-black/50 lg:hidden",
				onClick: () => setSidebarOpen(false)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: `fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white transition-transform duration-300 lg:relative lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex h-16 items-center justify-between border-b border-gray-200 px-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/admin",
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex h-8 w-8 items-center justify-center rounded-full bg-[#1a1a2e] font-display text-xs font-bold text-white",
								children: "CM"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-base font-bold text-[#1a1a2e]",
								children: "Admin"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setSidebarOpen(false),
							className: "rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 lg:hidden",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "flex-1 overflow-y-auto px-2 py-3",
						children: visibleItems.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: item.href,
							onClick: () => setSidebarOpen(false),
							className: `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive(item.href) ? "bg-[#1a1a2e] text-white" : "text-gray-600 hover:bg-gray-100"}`,
							children: [item.icon, item.label]
						}, item.href))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-t border-gray-200 p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-2 flex items-center gap-3 rounded-lg px-2 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-8 w-8 items-center justify-center rounded-full bg-[#1a1a2e] text-xs font-bold text-white",
								children: session.user.email.charAt(0).toUpperCase()
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1 truncate",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium text-gray-900 truncate",
									children: session.profile?.full_name || session.user.email
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-gray-400 truncate",
									children: session.roles.map((r) => r.name.replace("_", " ")).join(", ")
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: handleLogout,
							className: "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" }), "Sign Out"]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-1 flex-col overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 lg:px-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setSidebarOpen(true),
							className: "rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 lg:hidden",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setSearchOpen(true),
							className: "hidden items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm text-gray-400 hover:border-gray-300 md:flex",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-4 w-4" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Search..." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded border border-gray-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-gray-400",
									children: "Ctrl+K"
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/",
							target: "_blank",
							className: "flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden sm:inline",
								children: "View Site"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-xs text-gray-400",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/",
									className: "hover:text-[#7A2533]",
									children: "Site"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3 w-3" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-gray-900",
									children: "Admin"
								})
							]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "flex-1 overflow-y-auto p-4 lg:p-6",
					children
				})]
			})
		]
	});
}
function AdminPageHeader({ title, description, actions }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-bold text-[#1a1a2e]",
			children: title
		}), description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-gray-500",
			children: description
		})] }), actions && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-center gap-3",
			children: actions
		})]
	});
}
function AdminLoading() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex items-center justify-center py-20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-8 animate-spin rounded-full border-4 border-[#7A2533] border-t-transparent" })
	});
}
function AdminTable({ headers, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-x-auto rounded-xl border border-gray-200 bg-white",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "w-full text-left text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
				className: "border-b border-gray-100 bg-gray-50",
				children: headers.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
					className: "px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider",
					children: h
				}, h))
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
				className: "divide-y divide-gray-100",
				children
			})]
		})
	});
}
function AdminEmpty({ title, description }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center py-20 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex h-16 w-16 items-center justify-center rounded-full bg-gray-100",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-8 w-8 text-gray-400" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-lg font-semibold text-gray-600",
				children: title
			}),
			description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-gray-400",
				children: description
			})
		]
	});
}
//#endregion
export { AdminTable as a, AdminPageHeader as i, AdminLayout as n, customersApi as o, AdminLoading as r, ordersApi as s, AdminEmpty as t };
