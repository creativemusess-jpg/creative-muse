import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout, AdminPageHeader, AdminLoading } from "@/components/admin/AdminLayout";
import { settingsApi } from "@/lib/api/settings";
import { Save } from "lucide-react";

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

  useEffect(() => { fetch(); }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await settingsApi.set("store_info", { name: storeName, email: storeEmail, phone: storePhone, address: storeAddress });
      if (newsletterPopupImage) {
        await settingsApi.set("newsletter_popup_image", { url: newsletterPopupImage });
      }
      alert("Settings saved");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <AdminLayout><AdminLoading /></AdminLayout>;

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Settings"
        description="Store configuration"
        actions={
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 rounded-lg bg-[#1a1a2e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2d1b4e] disabled:opacity-50">
            <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Settings"}
          </button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-lg font-bold text-[#1a1a2e] mb-4">Store Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Store Name</label>
              <input value={storeName} onChange={(e) => setStoreName(e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#c9a96e]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Store Email</label>
              <input value={storeEmail} onChange={(e) => setStoreEmail(e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#c9a96e]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Store Phone</label>
              <input value={storePhone} onChange={(e) => setStorePhone(e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#c9a96e]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Store Address</label>
              <textarea value={storeAddress} onChange={(e) => setStoreAddress(e.target.value)} rows={3} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#c9a96e]" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-lg font-bold text-[#1a1a2e] mb-4">Newsletter Popup</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Popup Image URL</label>
              <input value={newsletterPopupImage} onChange={(e) => setNewsletterPopupImage(e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#c9a96e]" placeholder="https://..." />
              <p className="mt-1.5 text-[11px] text-gray-400">Leave empty to use the default category image. Changes apply after page refresh.</p>
            </div>
            {newsletterPopupImage && (
              <div className="relative aspect-video w-full max-w-xs overflow-hidden rounded-lg bg-[#f5efe8]">
                <img src={newsletterPopupImage} alt="Popup preview" className="h-full w-full object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
