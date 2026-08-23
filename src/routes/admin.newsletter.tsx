import { useState, useEffect, useRef, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  AdminLayout,
  AdminPageHeader,
  AdminLoading,
  AdminEmpty,
} from "@/components/admin/AdminLayout";
import { newsletterApi, getSourceLabel } from "@/lib/api/newsletter";
import {
  newsletterSettingsApi,
  type NewsletterSettings,
  type NewsletterImage,
} from "@/lib/api/newsletter-settings";
import {
  Search,
  Trash2,
  Download,
  Upload,
  Eye,
  EyeOff,
  Plus,
  X,
  Image as ImageIcon,
  ArrowUp,
  ArrowDown,
  Save,
  Check,
} from "lucide-react";
import { requireAdmin } from "@/lib/auth-guard";
import { uploadImage, deleteImage } from "@/lib/api/upload";

export const Route = createFileRoute("/admin/newsletter")({
  beforeLoad: requireAdmin,
  component: AdminNewsletter,
});

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

type Tab = "subscribers" | "popup";

function AdminNewsletter() {
  const [tab, setTab] = useState<Tab>("subscribers");

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Newsletter"
        description="Manage subscribers and popup settings"
      />
      <div className="mb-6 flex gap-1 rounded-lg border border-gray-200 bg-gray-50 p-1">
        {(
          [
            ["subscribers", "Subscribers"],
            ["popup", "Popup Settings"],
          ] as [Tab, string][]
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
              tab === key
                ? "bg-white text-[#1a1a2e] shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      {tab === "subscribers" ? <SubscribersTab /> : <PopupSettingsTab />}
    </AdminLayout>
  );
}

/* ===================== SUBSCRIBERS TAB ===================== */

function SubscribersTab() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await newsletterApi.list({
        search: search || undefined,
        status: statusFilter || undefined,
        source: sourceFilter || undefined,
      });
      setSubscribers(result.data);
      setCount(result.count);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, statusFilter, sourceFilter]);

  const handleDelete = async (id: string, email: string) => {
    if (!window.confirm(`Delete subscriber "${email}"?`)) return;
    try {
      await newsletterApi.delete(id);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusToggle = async (id: string, current: string) => {
    const newStatus = current === "active" ? "unsubscribed" : "active";
    try {
      await newsletterApi.updateStatus(id, newStatus);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportCSV = () => {
    const headers = [
      "Email",
      "Source",
      "Status",
      "Discount Code",
      "Consent",
      "Subscribed",
    ];
    const rows = subscribers.map((s) => [
      s.email,
      getSourceLabel(s.source),
      s.status,
      s.discount_code || "",
      s.consent ? "Yes" : "No",
      new Date(s.created_at).toLocaleDateString(),
    ]);
    const csv = [
      headers.join(","),
      ...rows.map((r) => r.map((c) => `"${c}"`).join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by email or source..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-sm outline-none focus:border-[#9C544D]"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#9C544D]"
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="unsubscribed">Unsubscribed</option>
        </select>
        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#9C544D]"
        >
          <option value="">All sources</option>
          <option value="newsletter_popup">Popup</option>
          <option value="homepage_newsletter">Homepage</option>
          <option value="footer_newsletter">Footer</option>
          <option value="admin_manual">Admin</option>
        </select>
        {count > 0 && (
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            <Download className="h-4 w-4" /> Export CSV
          </button>
        )}
      </div>
      {loading ? (
        <AdminLoading />
      ) : subscribers.length === 0 ? (
        <AdminEmpty
          title="No subscribers yet"
          description="Newsletter signups will appear here."
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Email
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Source
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Status
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Discount Code
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Consent
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Subscribed
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {subscribers.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-[#1a1a2e]">
                    {s.email}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {getSourceLabel(s.source)}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleStatusToggle(s.id, s.status)}
                      className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                        s.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {s.status}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    {s.discount_code ? (
                      <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[11px] text-[#1a1a2e]">
                        {s.discount_code}
                      </code>
                    ) : (
                      <span className="text-gray-400">&mdash;</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {s.consent ? (
                      <span className="text-green-600">Yes</span>
                    ) : (
                      <span className="text-gray-400">No</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {new Date(s.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(s.id, s.email)}
                      className="rounded-lg p-1.5 text-red-300 hover:bg-red-50 hover:text-red-500"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

/* ===================== POPUP SETTINGS TAB ===================== */

function PopupSettingsTab() {
  const [settings, setSettings] = useState<NewsletterSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    newsletterSettingsApi
      .get()
      .then(setSettings)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const update = useCallback(
    (patch: Partial<NewsletterSettings>) => {
      setSettings((prev) => (prev ? { ...prev, ...patch } : prev));
      setSaved(false);
    },
    [],
  );

  const handleSave = async () => {
    if (!settings) return;
    if (!settings.heading.trim() || !settings.buttonText.trim()) {
      alert("Heading and Button Text are required.");
      return;
    }
    setSaving(true);
    try {
      await newsletterSettingsApi.save(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !settings) return;
    setUploading(true);
    try {
      const url = await uploadImage(file, "products", "newsletter");
      const newImage: NewsletterImage = {
        id: uid(),
        url,
        altText: file.name.replace(/\.[^.]+$/, ""),
        sortOrder: settings.images.length,
      };
      update({ images: [...settings.images, newImage] });
    } catch (err) {
      console.error(err);
      alert("Failed to upload image.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleImageReplace = async (
    imageId: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file || !settings) return;
    setUploading(true);
    try {
      const url = await uploadImage(file, "products", "newsletter");
      update({
        images: settings.images.map((img) =>
          img.id === imageId ? { ...img, url } : img,
        ),
      });
    } catch (err) {
      console.error(err);
      alert("Failed to replace image.");
    } finally {
      setUploading(false);
    }
  };

  const handleImageDelete = (imageId: string) => {
    if (!settings) return;
    update({
      images: settings.images
        .filter((img) => img.id !== imageId)
        .map((img, i) => ({ ...img, sortOrder: i })),
    });
  };

  const handleImageAltText = (imageId: string, altText: string) => {
    if (!settings) return;
    update({
      images: settings.images.map((img) =>
        img.id === imageId ? { ...img, altText } : img,
      ),
    });
  };

  const moveImage = (imageId: string, direction: "up" | "down") => {
    if (!settings) return;
    const imgs = [...settings.images];
    const idx = imgs.findIndex((img) => img.id === imageId);
    if (idx === -1) return;
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= imgs.length) return;
    [imgs[idx], imgs[targetIdx]] = [imgs[targetIdx], imgs[idx]];
    update({
      images: imgs.map((img, i) => ({ ...img, sortOrder: i })),
    });
  };

  if (loading) return <AdminLoading />;
  if (!settings) return <AdminEmpty title="Failed to load settings" />;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
      {/* Left: Settings form */}
      <div className="space-y-6">
        {/* Enable/Disable */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#1a1a2e]">
                Newsletter Popup
              </h3>
              <p className="mt-0.5 text-xs text-gray-500">
                {settings.enabled
                  ? "Popup is active on the website"
                  : "Popup is hidden from visitors"}
              </p>
            </div>
            <button
              onClick={() => update({ enabled: !settings.enabled })}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                settings.enabled ? "bg-[#9C544D]" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  settings.enabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Content fields */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
          <h3 className="text-sm font-bold text-[#1a1a2e]">Content</h3>
          <Field
            label="Small Label"
            value={settings.label}
            onChange={(v) => update({ label: v })}
            placeholder="CREATIVE MUSE"
          />
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-600">
              Main Heading
            </label>
            <textarea
              value={settings.heading}
              onChange={(e) => update({ heading: e.target.value })}
              rows={2}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#9C544D]"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-600">
              Description
            </label>
            <textarea
              value={settings.description}
              onChange={(e) => update({ description: e.target.value })}
              rows={3}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#9C544D]"
            />
          </div>
          <Field
            label="Email Placeholder"
            value={settings.emailPlaceholder}
            onChange={(v) => update({ emailPlaceholder: v })}
            placeholder="Enter your email address"
          />
          <Field
            label="CTA Button Text"
            value={settings.buttonText}
            onChange={(v) => update({ buttonText: v })}
            placeholder="Claim My Offer"
          />
          <Field
            label="Secondary Text (No thanks)"
            value={settings.secondaryText}
            onChange={(v) => update({ secondaryText: v })}
            placeholder="No thanks"
          />
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-600">
              Privacy Text
            </label>
            <textarea
              value={settings.privacyText}
              onChange={(e) => update({ privacyText: e.target.value })}
              rows={2}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#9C544D]"
            />
          </div>
          <Field
            label="Privacy Policy URL"
            value={settings.privacyPolicyUrl}
            onChange={(v) => update({ privacyPolicyUrl: v })}
            placeholder="/privacy-policy"
          />
        </div>

        {/* Carousel settings */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
          <h3 className="text-sm font-bold text-[#1a1a2e]">Carousel Settings</h3>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-600">Autoplay</span>
            <button
              onClick={() => update({ autoplay: !settings.autoplay })}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                settings.autoplay ? "bg-[#9C544D]" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  settings.autoplay ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-600">
              Slide Duration (seconds)
            </span>
            <input
              type="number"
              min={2}
              max={15}
              value={settings.slideDuration}
              onChange={(e) =>
                update({ slideDuration: Number(e.target.value) || 5 })
              }
              className="w-20 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-center outline-none focus:border-[#9C544D]"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-600">Transition</span>
            <select
              value={settings.transition}
              onChange={(e) =>
                update({ transition: e.target.value as "slide" | "fade" })
              }
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm outline-none focus:border-[#9C544D]"
            >
              <option value="slide">Smooth Slide</option>
              <option value="fade">Fade</option>
            </select>
          </div>
        </div>

        {/* Images */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#1a1a2e]">
              Newsletter Images ({settings.images.length})
            </h3>
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50">
              <Upload className="h-3.5 w-3.5" />
              {uploading ? "Uploading..." : "Add Image"}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                disabled={uploading}
              />
            </label>
          </div>
          {settings.images.length === 0 ? (
            <div className="rounded-lg border-2 border-dashed border-gray-200 py-8 text-center">
              <ImageIcon className="mx-auto h-8 w-8 text-gray-300" />
              <p className="mt-2 text-xs text-gray-400">
                No images yet. Add an image to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {settings.images
                .sort((a, b) => a.sortOrder - b.sortOrder)
                .map((img, idx) => (
                  <div
                    key={img.id}
                    className="flex items-start gap-3 rounded-lg border border-gray-100 p-3"
                  >
                    <img
                      src={img.url}
                      alt={img.altText}
                      className="h-20 w-20 shrink-0 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0 space-y-2">
                      <input
                        type="text"
                        value={img.altText}
                        onChange={(e) =>
                          handleImageAltText(img.id, e.target.value)
                        }
                        placeholder="Alt text"
                        className="w-full rounded border border-gray-200 px-2 py-1 text-xs outline-none focus:border-[#9C544D]"
                      />
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => moveImage(img.id, "up")}
                          disabled={idx === 0}
                          className="rounded p-1 text-gray-400 hover:bg-gray-100 disabled:opacity-30"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => moveImage(img.id, "down")}
                          disabled={idx === settings.images.length - 1}
                          className="rounded p-1 text-gray-400 hover:bg-gray-100 disabled:opacity-30"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                        <label className="ml-auto flex cursor-pointer items-center gap-1 rounded px-2 py-1 text-xs text-gray-500 hover:bg-gray-100">
                          <Upload className="h-3 w-3" /> Replace
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageReplace(img.id, e)}
                          />
                        </label>
                        <button
                          onClick={() => handleImageDelete(img.id)}
                          className="rounded px-2 py-1 text-xs text-red-400 hover:bg-red-50 hover:text-red-500"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Save button */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-[#1a1a2e] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#2d1b4e] disabled:opacity-60"
          >
            {saving ? (
              "Saving..."
            ) : saved ? (
              <>
                <Check className="h-4 w-4" /> Saved
              </>
            ) : (
              <>
                <Save className="h-4 w-4" /> Save Changes
              </>
            )}
          </button>
          {saved && (
            <span className="text-xs text-green-600">
              Settings saved successfully.
            </span>
          )}
        </div>
      </div>

      {/* Right: Live Preview */}
      <div className="lg:sticky lg:top-6 lg:self-start">
        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">
          Live Preview
        </h3>
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-[#fdf8f3] shadow-lg">
          {/* Mobile preview */}
          <div className="sm:hidden">
            {settings.images.length > 0 ? (
              <PreviewCarousel images={settings.images} settings={settings} />
            ) : (
              <div className="flex h-[180px] items-center justify-center bg-gradient-to-br from-[#fdf8f3] to-[#f0e4cd]">
                <ImageIcon className="h-10 w-10 text-gray-300" />
              </div>
            )}
            <PreviewContent settings={settings} />
          </div>
          {/* Desktop preview */}
          <div className="hidden sm:flex">
            <div className="w-[45%] min-h-[340px]">
              {settings.images.length > 0 ? (
                <PreviewCarousel images={settings.images} settings={settings} />
              ) : (
                <div className="flex h-full min-h-[340px] items-center justify-center bg-gradient-to-br from-[#fdf8f3] to-[#f0e4cd]">
                  <ImageIcon className="h-10 w-10 text-gray-300" />
                </div>
              )}
            </div>
            <div className="w-[55%]">
              <PreviewContent settings={settings} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===================== HELPER COMPONENTS ===================== */

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-gray-600">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#9C544D]"
      />
    </div>
  );
}

function PreviewCarousel({
  images,
  settings,
}: {
  images: NewsletterImage[];
  settings: NewsletterSettings;
}) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (images.length <= 1 || !settings.autoplay) return;
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, settings.slideDuration * 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [images.length, settings.autoplay, settings.slideDuration]);

  const sorted = [...images].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="relative h-[180px] min-h-[180px] overflow-hidden sm:h-full sm:min-h-[340px]">
      {sorted.map((img, idx) => (
        <img
          key={img.id}
          src={img.url}
          alt={img.altText}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            idx === current ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      {sorted.length > 1 && (
        <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
          {sorted.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`h-1.5 rounded-full transition-all ${
                idx === current
                  ? "w-4 bg-white"
                  : "w-1.5 bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function PreviewContent({ settings }: { settings: NewsletterSettings }) {
  return (
    <div className="px-5 py-6">
      {settings.label && (
        <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-[#9C544D]">
          {settings.label}
        </p>
      )}
      <h4 className="mt-2 font-display text-lg font-semibold leading-tight text-[#1a1a2e]">
        {settings.heading.split("\n").map((line, i) => (
          <span key={i}>
            {line}
            {i < settings.heading.split("\n").length - 1 && <br />}
          </span>
        ))}
      </h4>
      <p className="mt-2 text-[11px] leading-relaxed text-[#7a6e64]">
        {settings.description}
      </p>
      <div className="mt-4 space-y-2">
        <div className="w-full rounded-lg border border-[#e0d8cc] bg-white px-3 py-2 text-[11px] text-[#a09890]">
          {settings.emailPlaceholder}
        </div>
        <div className="w-full rounded-lg bg-[#9C544D] px-3 py-2 text-center text-[11px] font-semibold text-white">
          {settings.buttonText}
        </div>
      </div>
      <button className="mt-2 text-[10px] font-medium text-[#a09890] underline underline-offset-2">
        {settings.secondaryText}
      </button>
      {settings.privacyText && (
        <p className="mt-3 text-[8px] leading-relaxed text-[#a09890]">
          {settings.privacyText}
        </p>
      )}
    </div>
  );
}
