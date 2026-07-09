import { supabase } from "../supabase";

const db = () => supabase as any;

export interface SubscribeResult {
  success: boolean;
  status: "created" | "already_active" | "resubscribed" | "error";
  message: string;
}

export const SOURCE_LABELS: Record<string, string> = {
  newsletter_popup: "Popup",
  homepage_newsletter: "Homepage",
  footer_newsletter: "Footer",
  checkout_newsletter: "Checkout",
  admin_manual: "Admin",
};

export function getSourceLabel(source: string | null): string {
  return source ? SOURCE_LABELS[source] || source : "\u2014";
}

export const newsletterApi = {
  async subscribe(email: string, source = "footer"): Promise<void> {
    const { error } = await db()
      .from("newsletter_subscribers")
      .insert({ email, source, consent: true });
    if (error) {
      if ((error as any)?.message?.includes("duplicate")) return;
      throw error;
    }
  },

  async subscribeToNewsletter(params: {
    email: string;
    source?: string;
    consent?: boolean;
    discountCode?: string;
  }): Promise<SubscribeResult> {
    const emailClean = params.email.trim().toLowerCase();
    const source = params.source || "homepage_newsletter";
    const discountCode = params.discountCode || null;

    const { data: existing } = await db()
      .from("newsletter_subscribers")
      .select("*")
      .eq("email", emailClean)
      .maybeSingle();

    if (existing) {
      if (existing.status === "active") {
        return {
          success: false,
          status: "already_active",
          message: "You are already part of the Creative Muse Circle.",
        };
      }
      const { error: updErr } = await db()
        .from("newsletter_subscribers")
        .update({
          status: "active",
          source,
          consent: params.consent ?? true,
          discount_code: discountCode || existing.discount_code,
        })
        .eq("id", existing.id);
      if (updErr) {
        return {
          success: false,
          status: "error",
          message: "Something went wrong. Please try again.",
        };
      }
      return {
        success: true,
        status: "resubscribed",
        message: "Welcome back to the Creative Muse Circle!",
      };
    }

    const { error } = await db()
      .from("newsletter_subscribers")
      .insert({
        email: emailClean,
        source,
        consent: params.consent ?? true,
        discount_code: discountCode,
        status: "active",
      });
    if (error) {
      return {
        success: false,
        status: "error",
        message: "Something went wrong. Please try again.",
      };
    }
    return {
      success: true,
      status: "created",
      message: "Welcome to the Circle!",
    };
  },

  async list(filters: {
    search?: string;
    status?: string;
    source?: string;
    page?: number;
    per_page?: number;
  } = {}) {
    let query = db()
      .from("newsletter_subscribers")
      .select("*", { count: "exact" });

    if (filters.search) {
      query = query.or(
        `email.ilike.%${filters.search}%,source.ilike.%${filters.search}%`,
      );
    }
    if (filters.status) query = query.eq("status", filters.status);
    if (filters.source) query = query.eq("source", filters.source);

    query = query.order("created_at", { ascending: false });

    const page = filters.page || 1;
    const perPage = filters.per_page || 20;
    const from = (page - 1) * perPage;
    query = query.range(from, from + perPage - 1);

    const { data, error, count } = await query;
    if (error) throw error;
    return { data: (data as any[]) || [], count: count || 0 };
  },

  async updateStatus(id: string, status: string): Promise<void> {
    const { error } = await db()
      .from("newsletter_subscribers")
      .update({ status })
      .eq("id", id);
    if (error) throw error;
  },

  async delete(id: string): Promise<void> {
    const { error } = await db()
      .from("newsletter_subscribers")
      .delete()
      .eq("id", id);
    if (error) throw error;
  },
};
