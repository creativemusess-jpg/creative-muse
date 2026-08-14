import { n as supabase } from "./supabase-Bz-JQXNc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/analytics-B1LIpryr.js
var analyticsApi = {
	async getDashboardMetrics() {
		const now = /* @__PURE__ */ new Date();
		const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
		const weekStart = (/* @__PURE__ */ new Date(now.getTime() - 10080 * 60 * 1e3)).toISOString();
		const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
		const [salesRes, ordersRes, pendingRes, paidRes, unfulfilledRes, fulfilledRes, deliveredRes, cancelledRes, refundedRes, productsRes, activeRes, draftRes, oosRes, customersRes, subsRes, topProductsRes, todayRes, weekRes, monthRes] = await Promise.all([
			supabase.from("orders").select("total_amount").not("order_status", "eq", "cancelled"),
			supabase.from("orders").select("id", {
				count: "exact",
				head: true
			}),
			supabase.from("orders").select("id", {
				count: "exact",
				head: true
			}).eq("order_status", "pending"),
			supabase.from("orders").select("id", {
				count: "exact",
				head: true
			}).eq("payment_status", "paid"),
			supabase.from("orders").select("id", {
				count: "exact",
				head: true
			}).in("order_status", [
				"pending",
				"confirmed",
				"processing"
			]),
			supabase.from("orders").select("id", {
				count: "exact",
				head: true
			}).in("order_status", [
				"shipped",
				"out_for_delivery",
				"delivered"
			]),
			supabase.from("orders").select("id", {
				count: "exact",
				head: true
			}).eq("order_status", "delivered"),
			supabase.from("orders").select("id", {
				count: "exact",
				head: true
			}).eq("order_status", "cancelled"),
			supabase.from("orders").select("id", {
				count: "exact",
				head: true
			}).eq("order_status", "refunded"),
			supabase.from("products").select("id", {
				count: "exact",
				head: true
			}),
			supabase.from("products").select("id", {
				count: "exact",
				head: true
			}).eq("status", "active"),
			supabase.from("products").select("id", {
				count: "exact",
				head: true
			}).eq("status", "draft"),
			supabase.from("products").select("id", {
				count: "exact",
				head: true
			}).eq("status", "out_of_stock"),
			supabase.from("customers").select("id", {
				count: "exact",
				head: true
			}),
			supabase.from("newsletter_subscribers").select("id", {
				count: "exact",
				head: true
			}).eq("status", "active"),
			supabase.from("order_items").select("product_name, quantity, total_price").limit(10),
			supabase.from("orders").select("total_amount").gte("created_at", todayStart),
			supabase.from("orders").select("total_amount").gte("created_at", weekStart),
			supabase.from("orders").select("total_amount").gte("created_at", monthStart)
		]);
		const totalSales = (salesRes.data ?? []).reduce((sum, o) => sum + (o.total_amount || 0), 0);
		const revenueToday = (todayRes.data ?? []).reduce((sum, o) => sum + (o.total_amount || 0), 0);
		const revenueThisWeek = (weekRes.data ?? []).reduce((sum, o) => sum + (o.total_amount || 0), 0);
		const revenueThisMonth = (monthRes.data ?? []).reduce((sum, o) => sum + (o.total_amount || 0), 0);
		const totalOrders = ordersRes.count ?? 0;
		const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
		const topProductMap = /* @__PURE__ */ new Map();
		(topProductsRes.data ?? []).forEach((item) => {
			const name = item.product_name || "Unknown";
			const existing = topProductMap.get(name) || {
				qty: 0,
				rev: 0
			};
			existing.qty += item.quantity || 0;
			existing.rev += item.total_price || 0;
			topProductMap.set(name, existing);
		});
		const topProducts = Array.from(topProductMap.entries()).map(([name, data]) => ({
			name,
			sales: data.qty,
			revenue: data.rev
		})).sort((a, b) => b.sales - a.sales).slice(0, 5);
		const recentOrders = ((await supabase.from("orders").select("id, order_number, total_amount, order_status, payment_status, created_at, customer_name").order("created_at", { ascending: false }).limit(5)).data ?? []).map((o) => ({
			id: o.id,
			order_number: o.order_number,
			total_amount: o.total_amount,
			status: o.order_status,
			payment_status: o.payment_status,
			created_at: o.created_at,
			customer_name: o.customer_name
		}));
		const recentCustomers = ((await supabase.from("customers").select("id, full_name, email, created_at").order("created_at", { ascending: false }).limit(5)).data ?? []).map((c) => ({
			id: c.id,
			full_name: c.full_name,
			email: c.email,
			created_at: c.created_at
		}));
		return {
			totalSales,
			totalOrders,
			pendingOrders: pendingRes.count ?? 0,
			paidOrders: paidRes.count ?? 0,
			unfulfilledOrders: unfulfilledRes.count ?? 0,
			fulfilledOrders: fulfilledRes.count ?? 0,
			deliveredOrders: deliveredRes.count ?? 0,
			cancelledOrders: cancelledRes.count ?? 0,
			refundedOrders: refundedRes.count ?? 0,
			totalProducts: productsRes.count ?? 0,
			activeProducts: activeRes.count ?? 0,
			draftProducts: draftRes.count ?? 0,
			outOfStockProducts: oosRes.count ?? 0,
			lowStockProducts: 0,
			totalCustomers: customersRes.count ?? 0,
			subscriberCount: subsRes.count ?? 0,
			averageOrderValue,
			revenueToday,
			revenueThisWeek,
			revenueThisMonth,
			topProducts,
			recentOrders,
			recentCustomers
		};
	},
	async getSalesByDate(days = 30) {
		const start = (/* @__PURE__ */ new Date(Date.now() - days * 24 * 60 * 60 * 1e3)).toISOString();
		const { data } = await supabase.from("orders").select("total_amount, created_at").gte("created_at", start).order("created_at", { ascending: true });
		if (!data) return [];
		const map = /* @__PURE__ */ new Map();
		data.forEach((o) => {
			const date = o.created_at?.slice(0, 10);
			if (!date) return;
			const existing = map.get(date) || {
				sales: 0,
				orders: 0
			};
			existing.sales += o.total_amount || 0;
			existing.orders += 1;
			map.set(date, existing);
		});
		return Array.from(map.entries()).map(([date, vals]) => ({
			date,
			...vals
		}));
	},
	async getSalesByCategory() {
		const { data } = await supabase.from("order_items").select("product_category, total_price");
		if (!data) return [];
		const map = /* @__PURE__ */ new Map();
		data.forEach((item) => {
			const cat = item.product_category || "Uncategorized";
			map.set(cat, (map.get(cat) || 0) + (item.total_price || 0));
		});
		return Array.from(map.entries()).map(([category, sales]) => ({
			category,
			sales
		})).sort((a, b) => b.sales - a.sales);
	},
	async getLowStockProducts(threshold = 10) {
		const { data } = await supabase.from("products").select("id, name, stock_quantity, current_price, slug").lte("stock_quantity", threshold).order("stock_quantity", { ascending: true });
		return (data ?? []).map((p) => ({
			...p,
			stock_quantity: p.stock_quantity ?? 0
		}));
	}
};
//#endregion
export { analyticsApi as t };
