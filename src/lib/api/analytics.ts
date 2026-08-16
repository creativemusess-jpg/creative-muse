import { supabase } from "../supabase";

export interface DashboardMetrics {
  totalSales: number;
  totalOrders: number;
  pendingOrders: number;
  paidOrders: number;
  unfulfilledOrders: number;
  fulfilledOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  refundedOrders: number;
  totalProducts: number;
  activeProducts: number;
  draftProducts: number;
  archivedProducts: number;
  outOfStockProducts: number;
  lowStockProducts: number;
  totalCustomers: number;
  subscriberCount: number;
  averageOrderValue: number;
  revenueToday: number;
  revenueThisWeek: number;
  revenueThisMonth: number;
  topProducts: { name: string; sales: number; revenue: number }[];
  recentOrders: any[];
  recentCustomers: any[];
}

export const analyticsApi = {
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    const [
      salesRes, ordersRes, pendingRes, paidRes, unfulfilledRes,
      fulfilledRes, deliveredRes, cancelledRes, refundedRes,
      productsRes, activeRes, draftRes, archivedRes, oosRes,
      customersRes, subsRes, topProductsRes, todayRes, weekRes, monthRes,
    ] = await Promise.all([
      supabase.from("orders").select("total_amount").not("order_status", "eq", "cancelled"),
      supabase.from("orders").select("id", { count: "exact", head: true }),
      supabase.from("orders").select("id", { count: "exact", head: true }).eq("order_status", "pending"),
      supabase.from("orders").select("id", { count: "exact", head: true }).eq("payment_status", "paid"),
      supabase.from("orders").select("id", { count: "exact", head: true }).in("order_status", ["pending", "confirmed", "processing"]),
      supabase.from("orders").select("id", { count: "exact", head: true }).in("order_status", ["shipped", "out_for_delivery", "delivered"]),
      supabase.from("orders").select("id", { count: "exact", head: true }).eq("order_status", "delivered"),
      supabase.from("orders").select("id", { count: "exact", head: true }).eq("order_status", "cancelled"),
      supabase.from("orders").select("id", { count: "exact", head: true }).eq("order_status", "refunded"),
      supabase.from("products").select("id", { count: "exact", head: true }),
      supabase.from("products").select("id", { count: "exact", head: true }).eq("status", "active"),
      supabase.from("products").select("id", { count: "exact", head: true }).eq("status", "draft"),
      supabase.from("products").select("id", { count: "exact", head: true }).eq("status", "archived"),
      supabase.from("products").select("id", { count: "exact", head: true }).eq("status", "out_of_stock"),
      supabase.from("customers").select("id", { count: "exact", head: true }),
      supabase.from("newsletter_subscribers").select("id", { count: "exact", head: true }).eq("status", "active"),
      supabase.from("order_items").select("product_name, quantity, total_price").limit(10),
      supabase.from("orders").select("total_amount").gte("created_at", todayStart),
      supabase.from("orders").select("total_amount").gte("created_at", weekStart),
      supabase.from("orders").select("total_amount").gte("created_at", monthStart),
    ]);

    const totalSales = (salesRes.data ?? []).reduce((sum: number, o: any) => sum + (o.total_amount || 0), 0);
    const revenueToday = (todayRes.data ?? []).reduce((sum: number, o: any) => sum + (o.total_amount || 0), 0);
    const revenueThisWeek = (weekRes.data ?? []).reduce((sum: number, o: any) => sum + (o.total_amount || 0), 0);
    const revenueThisMonth = (monthRes.data ?? []).reduce((sum: number, o: any) => sum + (o.total_amount || 0), 0);

    const totalOrders = ordersRes.count ?? 0;
    const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

    const topProductMap = new Map<string, { qty: number; rev: number }>();
    (topProductsRes.data ?? []).forEach((item: any) => {
      const name = item.product_name || "Unknown";
      const existing = topProductMap.get(name) || { qty: 0, rev: 0 };
      existing.qty += item.quantity || 0;
      existing.rev += item.total_price || 0;
      topProductMap.set(name, existing);
    });
    const topProducts = Array.from(topProductMap.entries())
      .map(([name, data]) => ({ name, sales: data.qty, revenue: data.rev }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);

    const ordersRes_full = await supabase
      .from("orders")
      .select("id, order_number, total_amount, order_status, payment_status, created_at, customer_name")
      .order("created_at", { ascending: false })
      .limit(5);
    const recentOrders = (ordersRes_full.data ?? []).map((o: any) => ({
      id: o.id, order_number: o.order_number, total_amount: o.total_amount,
      status: o.order_status, payment_status: o.payment_status,
      created_at: o.created_at, customer_name: o.customer_name,
    }));

    const customersRes_full = await supabase
      .from("customers")
      .select("id, full_name, email, created_at")
      .order("created_at", { ascending: false })
      .limit(5);
    const recentCustomers = (customersRes_full.data ?? []).map((c: any) => ({
      id: c.id, full_name: c.full_name, email: c.email, created_at: c.created_at,
    }));

    return {
      totalSales, totalOrders, pendingOrders: pendingRes.count ?? 0,
      paidOrders: paidRes.count ?? 0, unfulfilledOrders: unfulfilledRes.count ?? 0,
      fulfilledOrders: fulfilledRes.count ?? 0, deliveredOrders: deliveredRes.count ?? 0,
      cancelledOrders: cancelledRes.count ?? 0, refundedOrders: refundedRes.count ?? 0,
      totalProducts: productsRes.count ?? 0, activeProducts: activeRes.count ?? 0,
      draftProducts: draftRes.count ?? 0, archivedProducts: archivedRes.count ?? 0,
      outOfStockProducts: oosRes.count ?? 0,
      lowStockProducts: 0, totalCustomers: customersRes.count ?? 0,
      subscriberCount: subsRes.count ?? 0, averageOrderValue,
      revenueToday, revenueThisWeek, revenueThisMonth,
      topProducts, recentOrders, recentCustomers,
    };
  },

  async getSalesByDate(days = 30): Promise<{ date: string; sales: number; orders: number }[]> {
    const start = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
    const { data } = await supabase
      .from("orders")
      .select("total_amount, created_at")
      .gte("created_at", start)
      .order("created_at", { ascending: true });
    if (!data) return [];
    const map = new Map<string, { sales: number; orders: number }>();
    data.forEach((o: any) => {
      const date = o.created_at?.slice(0, 10);
      if (!date) return;
      const existing = map.get(date) || { sales: 0, orders: 0 };
      existing.sales += o.total_amount || 0;
      existing.orders += 1;
      map.set(date, existing);
    });
    return Array.from(map.entries()).map(([date, vals]) => ({ date, ...vals }));
  },

  async getSalesByCategory(): Promise<{ category: string; sales: number }[]> {
    const { data } = await supabase
      .from("order_items")
      .select("product_category, total_price");
    if (!data) return [];
    const map = new Map<string, number>();
    data.forEach((item: any) => {
      const cat = item.product_category || "Uncategorized";
      map.set(cat, (map.get(cat) || 0) + (item.total_price || 0));
    });
    return Array.from(map.entries()).map(([category, sales]) => ({ category, sales })).sort((a, b) => b.sales - a.sales);
  },

  async getLowStockProducts(threshold = 10): Promise<any[]> {
    const { data } = await supabase
      .from("products")
      .select("id, name, stock_quantity, current_price, slug")
      .lte("stock_quantity", threshold)
      .order("stock_quantity", { ascending: true });
    return (data ?? []).map((p: any) => ({
      ...p, stock_quantity: p.stock_quantity ?? 0,
    }));
  },
};
