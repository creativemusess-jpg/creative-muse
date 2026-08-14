import { n as supabase } from "./supabase-Bz-JQXNc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/newsletter-ChNp_czQ.js
var db = () => supabase;
var SOURCE_LABELS = {
	newsletter_popup: "Popup",
	homepage_newsletter: "Homepage",
	footer_newsletter: "Footer",
	checkout_newsletter: "Checkout",
	admin_manual: "Admin"
};
function getSourceLabel(source) {
	return source ? SOURCE_LABELS[source] || source : "—";
}
var newsletterApi = {
	async subscribe(email, source = "footer") {
		const { error } = await db().from("newsletter_subscribers").insert({
			email,
			source,
			consent: true
		});
		if (error) {
			if (error?.message?.includes("duplicate")) return;
			throw error;
		}
	},
	async subscribeToNewsletter(params) {
		const emailClean = params.email.trim().toLowerCase();
		const source = params.source || "homepage_newsletter";
		const discountCode = params.discountCode || null;
		const { data: existing } = await db().from("newsletter_subscribers").select("*").eq("email", emailClean).maybeSingle();
		if (existing) {
			if (existing.status === "active") return {
				success: false,
				status: "already_active",
				message: "You are already part of the Creative Muse Circle."
			};
			const { error: updErr } = await db().from("newsletter_subscribers").update({
				status: "active",
				source,
				consent: params.consent ?? true,
				discount_code: discountCode || existing.discount_code
			}).eq("id", existing.id);
			if (updErr) return {
				success: false,
				status: "error",
				message: "Something went wrong. Please try again."
			};
			return {
				success: true,
				status: "resubscribed",
				message: "Welcome back to the Creative Muse Circle!"
			};
		}
		const { error } = await db().from("newsletter_subscribers").insert({
			email: emailClean,
			source,
			consent: params.consent ?? true,
			discount_code: discountCode,
			status: "active"
		});
		if (error) return {
			success: false,
			status: "error",
			message: "Something went wrong. Please try again."
		};
		return {
			success: true,
			status: "created",
			message: "Welcome to the Circle!"
		};
	},
	async list(filters = {}) {
		let query = db().from("newsletter_subscribers").select("*", { count: "exact" });
		if (filters.search) query = query.or(`email.ilike.%${filters.search}%,source.ilike.%${filters.search}%`);
		if (filters.status) query = query.eq("status", filters.status);
		if (filters.source) query = query.eq("source", filters.source);
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
	async updateStatus(id, status) {
		const { error } = await db().from("newsletter_subscribers").update({ status }).eq("id", id);
		if (error) throw error;
	},
	async delete(id) {
		const { error } = await db().from("newsletter_subscribers").delete().eq("id", id);
		if (error) throw error;
	}
};
//#endregion
export { newsletterApi as n, getSourceLabel as t };
