/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout, AdminPageHeader, AdminLoading } from "@/components/admin/AdminLayout";
import { settingsApi } from "@/lib/api/settings";
import { supabase } from "@/lib/supabase";
import { giftPackagingApi, type GiftPackagingConfig, type EstimatedDeliveryConfig } from "@/lib/api/gift-packaging";
import {
  getEmailTestingConfig,
  listOrderNotifications,
  previewTransactionalEmail,
  sendTransactionalEmail,
} from "@/lib/email/server";
import type { EmailTemplateKey } from "@/lib/email/types";
import { AlertCircle, Eye, Loader2, Mail, RefreshCw, Save, Send } from "lucide-react";

import { requireAdmin } from "@/lib/auth-guard";

export const Route = createFileRoute("/admin/settings")({
  beforeLoad: requireAdmin,
  component: AdminSettings,
});

function AdminSettings() {
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [storeName, setStoreName] = useState("Creative Muse");
  const [storeEmail, setStoreEmail] = useState("");
  const [storePhone, setStorePhone] = useState("");
  const [storeAddress, setStoreAddress] = useState("");
  const [newsletterPopupImage, setNewsletterPopupImage] = useState("");
  const [emailConfig, setEmailConfig] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [testTemplate, setTestTemplate] = useState<EmailTemplateKey>("welcome");
  const [testRecipient, setTestRecipient] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [preview, setPreview] = useState<any>(null);
  const [testHistory, setTestHistory] = useState<any[]>([]);
  const [emailBusy, setEmailBusy] = useState<"preview" | "send" | "history" | "resend" | null>(
    null,
  );
  const [emailResult, setEmailResult] = useState<any>(null);
  const [emailError, setEmailError] = useState("");

  const [giftCfg, setGiftCfg] = useState<GiftPackagingConfig>({
    enabled: true, name: "Premium Gift Packaging", description: "Luxury gift box with ribbon and message card.",
    price: 199, max_quantity: 1, allow_gift_message: true, max_message_length: 200,
    default_enabled: false, display_order: 1, status: "active",
  });
  const [estCfg, setEstCfg] = useState<EstimatedDeliveryConfig>({ enabled: true, min_days: 3, max_days: 5 });

  const fetch = async () => {
    setLoading(true);
    try {
      const data = await settingsApi.getAll();
      setSettings(data);
      const store = data.find((s: any) => s.setting_key === "store_info");
      if (store?.setting_value) {
        setStoreName(store.setting_value.name || "Creative Muse");
        setStoreEmail(store.setting_value.email || "");
        setStorePhone(store.setting_value.phone || "");
        setStoreAddress(store.setting_value.address || "");
      }
      const popupImg = data.find((s: any) => s.setting_key === "newsletter_popup_image");
      if (popupImg?.setting_value?.url) {
        setNewsletterPopupImage(popupImg.setting_value.url);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await settingsApi.set("store_info", {
        name: storeName,
        email: storeEmail,
        phone: storePhone,
        address: storeAddress,
      });
      if (newsletterPopupImage) {
        await settingsApi.set("newsletter_popup_image", { url: newsletterPopupImage });
      }
      await giftPackagingApi.saveConfig(giftCfg);
      await giftPackagingApi.saveEstimatedDelivery(estCfg);
      alert("Settings saved");
    } catch (err: any) {
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
        (supabase as any)
          .from("orders")
          .select(
            "id, order_number, customer_name, customer_email, order_status, payment_status, created_at",
          )
          .order("created_at", { ascending: false })
          .limit(50),
        (supabase as any)
          .from("customers")
          .select("id, full_name, email, created_at")
          .order("created_at", { ascending: false })
          .limit(50),
        listOrderNotifications({ data: { isTest: true, limit: 20, accessToken } }).catch(() => []),
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

  useEffect(() => {
    loadEmailTesting();
    giftPackagingApi.getConfig().then(setGiftCfg);
    giftPackagingApi.getEstimatedDelivery().then(setEstCfg);
  }, []);

  const templateRequiresOrder = testTemplate !== "welcome";
  const selectedOrder = orders.find((order) => order.id === selectedOrderId);

  const validateEmailTool = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(testRecipient.trim()))
      return "Please enter a valid test recipient email.";
    if (templateRequiresOrder && !selectedOrderId)
      return "Please select a real order for this template.";
    return "";
  };

  const handlePreviewEmail = async (override?: {
    template?: EmailTemplateKey;
    orderId?: string;
    customerId?: string;
  }) => {
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
      const result = await previewTransactionalEmail({
        data: {
          template: override?.template || testTemplate,
          orderId: override?.orderId || selectedOrderId || undefined,
          customerId: override?.customerId || selectedCustomerId || undefined,
          recipient: testRecipient.trim(),
          source: "admin_settings",
          isTest: true,
          viewport: previewMode,
          accessToken,
        },
      });
      setPreview(result);
    } catch (err: any) {
      setEmailError(err.message || "Preview failed.");
    } finally {
      setEmailBusy(null);
    }
  };

  const handleSendTestEmail = async (override?: {
    template?: EmailTemplateKey;
    orderId?: string;
    customerId?: string;
    recipient?: string;
  }) => {
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
      const result = await sendTransactionalEmail({
        data: {
          template: override?.template || testTemplate,
          orderId: override?.orderId || selectedOrderId || undefined,
          customerId: override?.customerId || selectedCustomerId || undefined,
          recipient: override?.recipient || testRecipient.trim(),
          source: "admin_settings",
          isTest: true,
          accessToken,
        },
      });
      setEmailResult(result);
      await loadEmailTesting();
    } catch (err: any) {
      setEmailError(err.message || "Send failed.");
      await loadEmailTesting();
    } finally {
      setEmailBusy(null);
    }
  };

  if (loading)
    return (
      <AdminLayout>
        <AdminLoading />
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Settings"
        description="Store configuration"
        actions={
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-[#1a1a2e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2d1b4e] disabled:opacity-50"
          >
            <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Settings"}
          </button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-lg font-bold text-[#1a1a2e] mb-4">Store Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                Store Name
              </label>
              <input
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#c9a96e]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                Store Email
              </label>
              <input
                value={storeEmail}
                onChange={(e) => setStoreEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#c9a96e]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                Store Phone
              </label>
              <input
                value={storePhone}
                onChange={(e) => setStorePhone(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#c9a96e]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                Store Address
              </label>
              <textarea
                value={storeAddress}
                onChange={(e) => setStoreAddress(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#c9a96e]"
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-lg font-bold text-[#1a1a2e] mb-4">Newsletter Popup</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                Popup Image URL
              </label>
              <input
                value={newsletterPopupImage}
                onChange={(e) => setNewsletterPopupImage(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#c9a96e]"
                placeholder="https://..."
              />
              <p className="mt-1.5 text-[11px] text-gray-400">
                Leave empty to use the default category image. Changes apply after page refresh.
              </p>
            </div>
            {newsletterPopupImage && (
              <div className="relative aspect-video w-full max-w-xs overflow-hidden rounded-lg bg-[#f5efe8]">
                <img
                  src={newsletterPopupImage}
                  alt="Popup preview"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex flex-col gap-3 border-b border-gray-100 pb-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#1a1a2e]">Transactional Email Testing</h3>
            <p className="mt-1 text-sm text-gray-500">
              Test transactional templates safely without changing order status or normal
              notification idempotency.
            </p>
          </div>
          <div className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
            {emailConfig?.testMode ? "EMAIL_TEST_MODE active" : "Manual test mode"}
          </div>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[380px_1fr]">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                Email Template
              </label>
              <select
                value={testTemplate}
                onChange={(e) => {
                  setTestTemplate(e.target.value as EmailTemplateKey);
                  setPreview(null);
                  setEmailResult(null);
                }}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#c9a96e]"
              >
                <option value="welcome">Welcome Email</option>
                <option value="order_confirmation">Order Confirmation</option>
                <option value="payment_confirmation">Payment Confirmation</option>
                <option value="shipped">Shipped Email</option>
                <option value="delivered">Delivered Email</option>
                <option value="cancellation">Cancellation Email</option>
                <option value="refund">Refund Email</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                Test Recipient Email
              </label>
              <input
                type="email"
                value={testRecipient}
                onChange={(e) => setTestRecipient(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#c9a96e]"
                placeholder="Loaded from EMAIL_TEST_RECIPIENT"
              />
            </div>

            {templateRequiresOrder ? (
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                  Order
                </label>
                <select
                  value={selectedOrderId}
                  onChange={(e) => {
                    setSelectedOrderId(e.target.value);
                    setPreview(null);
                  }}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#c9a96e]"
                >
                  <option value="">Select an existing order</option>
                  {orders.map((order) => (
                    <option key={order.id} value={order.id}>
                      {order.order_number} -{" "}
                      {order.customer_name || order.customer_email || "Customer"} (
                      {order.order_status})
                    </option>
                  ))}
                </select>
                {testTemplate === "shipped" &&
                  selectedOrder &&
                  !selectedOrder.order_status.includes("shipped") && (
                    <p className="mt-1 text-[11px] text-amber-600">
                      Shipped email will validate saved courier and tracking data before sending.
                    </p>
                  )}
                {testTemplate === "delivered" && selectedOrder?.order_status !== "delivered" && (
                  <p className="mt-1 text-[11px] text-amber-600">
                    This selected order is not delivered; preview will show a warning.
                  </p>
                )}
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                  Customer
                </label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => {
                    setSelectedCustomerId(e.target.value);
                    setPreview(null);
                  }}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#c9a96e]"
                >
                  <option value="">Use labelled sample preview data</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.full_name || customer.email} - {customer.email}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-[11px] text-gray-400">
                  Welcome tests never update welcome_email_sent_at.
                </p>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                Preview Width
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewMode("desktop")}
                  className={`rounded-lg border px-3 py-2 text-xs font-semibold ${previewMode === "desktop" ? "border-[#c9a96e] bg-[#fdf8f3] text-[#1a1a2e]" : "border-gray-200 text-gray-500"}`}
                >
                  Desktop
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode("mobile")}
                  className={`rounded-lg border px-3 py-2 text-xs font-semibold ${previewMode === "mobile" ? "border-[#c9a96e] bg-[#fdf8f3] text-[#1a1a2e]" : "border-gray-200 text-gray-500"}`}
                >
                  Mobile
                </button>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handlePreviewEmail()}
                disabled={!!emailBusy}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#c9a96e] px-4 py-2 text-sm font-semibold text-[#8a681f] hover:bg-[#fdf8f3] disabled:opacity-50"
              >
                {emailBusy === "preview" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                Preview Email
              </button>
              <button
                type="button"
                onClick={() => handleSendTestEmail()}
                disabled={!!emailBusy}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#1a1a2e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2d1b4e] disabled:opacity-50"
              >
                {emailBusy === "send" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                Send Test Email
              </button>
            </div>

            {emailError && (
              <div className="flex gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {emailError}
              </div>
            )}

            {emailResult && (
              <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-xs text-green-800">
                <p className="font-bold">Sent</p>
                <p>Template: {emailResult.template}</p>
                <p>Recipient: {emailResult.recipient}</p>
                <p>Subject: {emailResult.subject}</p>
                <p>Provider: {emailResult.provider}</p>
                <p>Message ID: {emailResult.providerMessageId || "Unavailable"}</p>
                <p>
                  Date:{" "}
                  {emailResult.sentAt
                    ? new Date(emailResult.sentAt).toLocaleString()
                    : new Date().toLocaleString()}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-5">
            <div className="rounded-xl border border-gray-200 bg-[#fdf8f3] p-4">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#9a792a]">
                    Preview
                  </p>
                  <p className="text-sm font-medium text-[#1a1a2e]">
                    {preview?.subject || "No preview rendered"}
                  </p>
                </div>
                <span className="rounded-full bg-white px-2 py-1 text-[10px] font-semibold uppercase text-gray-500">
                  Preview only
                </span>
              </div>
              {preview?.warnings?.length > 0 && (
                <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 p-2 text-xs text-amber-700">
                  {preview.warnings.join(" ")}
                </div>
              )}
              {preview?.html ? (
                <div
                  className={`mx-auto overflow-hidden rounded-lg border border-[#e0d8cc] bg-white ${previewMode === "mobile" ? "max-w-[390px]" : "max-w-[760px]"}`}
                >
                  <iframe
                    title="Email preview"
                    srcDoc={preview.html}
                    className="h-[620px] w-full bg-white"
                  />
                </div>
              ) : (
                <div className="flex h-[320px] items-center justify-center rounded-lg border border-dashed border-[#d7c39d] bg-white text-sm text-gray-400">
                  Choose a template and render a preview.
                </div>
              )}
            </div>

            <div className="rounded-xl border border-gray-200 bg-white">
              <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                <h4 className="flex items-center gap-2 text-sm font-bold text-[#1a1a2e]">
                  <Mail className="h-4 w-4 text-[#c9a96e]" /> Test Email History
                </h4>
                <button
                  type="button"
                  onClick={loadEmailTesting}
                  className="rounded-lg border border-gray-200 px-2 py-1 text-xs font-semibold text-gray-500 hover:bg-gray-50"
                >
                  Refresh
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50 text-[10px] uppercase tracking-wider text-gray-500">
                      <th className="px-3 py-2">Template</th>
                      <th className="px-3 py-2">Status</th>
                      <th className="px-3 py-2">Recipient</th>
                      <th className="px-3 py-2">Sent On</th>
                      <th className="px-3 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {testHistory.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-3 py-6 text-center text-gray-400">
                          No test emails yet
                        </td>
                      </tr>
                    ) : (
                      testHistory.map((row) => (
                        <tr key={row.id}>
                          <td className="px-3 py-2 font-medium text-[#1a1a2e]">
                            {row.metadata?.template_label ||
                              row.test_template ||
                              row.notification_type}
                          </td>
                          <td className="px-3 py-2">
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${row.status === "sent" ? "bg-green-100 text-green-700" : row.status === "failed" ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-700"}`}
                            >
                              {row.status}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-gray-500">{row.actual_recipient}</td>
                          <td className="px-3 py-2 text-gray-500">
                            {row.sent_at ? new Date(row.sent_at).toLocaleString() : "—"}
                          </td>
                          <td className="px-3 py-2">
                            <div className="flex flex-wrap gap-1">
                              <button
                                type="button"
                                onClick={() =>
                                  handleSendTestEmail({
                                    template: row.notification_type,
                                    orderId: row.order_id,
                                    customerId: row.customer_id,
                                    recipient: row.actual_recipient,
                                  })
                                }
                                className="inline-flex items-center gap-1 rounded border border-gray-200 px-2 py-1 text-[10px] font-semibold text-gray-600 hover:bg-gray-50"
                              >
                                <RefreshCw className="h-3 w-3" /> Resend Test
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  handlePreviewEmail({
                                    template: row.notification_type,
                                    orderId: row.order_id,
                                    customerId: row.customer_id,
                                  })
                                }
                                className="inline-flex items-center gap-1 rounded border border-gray-200 px-2 py-1 text-[10px] font-semibold text-gray-600 hover:bg-gray-50"
                              >
                                <Eye className="h-3 w-3" /> View Preview
                              </button>
                              {row.error_summary && (
                                <span
                                  title={row.error_summary}
                                  className="rounded border border-red-200 px-2 py-1 text-[10px] font-semibold text-red-600"
                                >
                                  Safe Error
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-lg font-bold text-[#1a1a2e] mb-4">Gift Packaging</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input type="checkbox" id="gp-enabled" checked={giftCfg.enabled} onChange={(e) => setGiftCfg({ ...giftCfg, enabled: e.target.checked })} className="h-4 w-4 rounded border-gray-300 text-[#c9a96e] focus:ring-[#c9a96e]" />
              <label htmlFor="gp-enabled" className="text-sm font-medium text-gray-700">Enable Gift Packaging</label>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Name</label>
              <input value={giftCfg.name} onChange={(e) => setGiftCfg({ ...giftCfg, name: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#c9a96e]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Description</label>
              <textarea value={giftCfg.description} onChange={(e) => setGiftCfg({ ...giftCfg, description: e.target.value })} rows={2} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#c9a96e]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Price (₹)</label>
              <input type="number" value={giftCfg.price} onChange={(e) => setGiftCfg({ ...giftCfg, price: Number(e.target.value) })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#c9a96e]" />
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="gp-msg" checked={giftCfg.allow_gift_message} onChange={(e) => setGiftCfg({ ...giftCfg, allow_gift_message: e.target.checked })} className="h-4 w-4 rounded border-gray-300 text-[#c9a96e] focus:ring-[#c9a96e]" />
              <label htmlFor="gp-msg" className="text-sm font-medium text-gray-700">Allow Gift Message</label>
            </div>
            {giftCfg.allow_gift_message && (
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Max Message Length</label>
                <input type="number" value={giftCfg.max_message_length} onChange={(e) => setGiftCfg({ ...giftCfg, max_message_length: Number(e.target.value) })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#c9a96e]" />
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Status</label>
              <select value={giftCfg.status} onChange={(e) => setGiftCfg({ ...giftCfg, status: e.target.value as "active" | "inactive" })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#c9a96e]">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-lg font-bold text-[#1a1a2e] mb-4">Estimated Delivery</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input type="checkbox" id="est-enabled" checked={estCfg.enabled} onChange={(e) => setEstCfg({ ...estCfg, enabled: e.target.checked })} className="h-4 w-4 rounded border-gray-300 text-[#c9a96e] focus:ring-[#c9a96e]" />
              <label htmlFor="est-enabled" className="text-sm font-medium text-gray-700">Show Estimated Delivery</label>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Min Days</label>
              <input type="number" value={estCfg.min_days} onChange={(e) => setEstCfg({ ...estCfg, min_days: Number(e.target.value) })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#c9a96e]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Max Days</label>
              <input type="number" value={estCfg.max_days} onChange={(e) => setEstCfg({ ...estCfg, max_days: Number(e.target.value) })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#c9a96e]" />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
