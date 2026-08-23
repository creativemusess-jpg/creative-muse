import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Check, Loader2, UploadCloud, X } from "lucide-react";
import { AdminLayout, AdminPageHeader, AdminLoading } from "@/components/admin/AdminLayout";
import { requireAdmin } from "@/lib/auth-guard";
import { homepageBannersApi, BANNER_GUIDE, BANNER_BUTTON_DEFAULT } from "@/lib/api/banners";
import type { HomepageBanner, BannerStatus } from "@/lib/api/banners";
import { uploadImage, deleteImage, validateBannerFile } from "@/lib/api/upload";

export const Route = createFileRoute("/admin/banners")({
  beforeLoad: requireAdmin,
  component: AdminBanners,
});

type Filter = "active" | "archived" | "all";

const FILTER_TABS: { key: Filter; label: string }[] = [
  { key: "active", label: "Active" },
  { key: "archived", label: "Archived" },
  { key: "all", label: "All" },
];

function AdminBanners() {
  const [filter, setFilter] = useState<Filter>("active");
  const [items, setItems] = useState<HomepageBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<HomepageBanner | null>(null);
  const [positionSupported, setPositionSupported] = useState(false);
  const [objectPositionSupported, setObjectPositionSupported] = useState(false);

  useEffect(() => {
    let mounted = true;
    homepageBannersApi
      .supportsButtonPosition()
      .then((ok) => mounted && setPositionSupported(ok))
      .catch(() => mounted && setPositionSupported(false));
    homepageBannersApi
      .supportsObjectPosition()
      .then((ok) => mounted && setObjectPositionSupported(ok))
      .catch(() => mounted && setObjectPositionSupported(false));
    return () => {
      mounted = false;
    };
  }, []);

  const load = useCallback(
    async (f: Filter = filter) => {
      try {
        const data = await homepageBannersApi.list(f);
        setItems(data);
        setLoadError(null);
      } catch (err: any) {
        setLoadError(err?.message || "Could not load banners from the database.");
      } finally {
        setLoading(false);
      }
    },
    [filter],
  );

  useEffect(() => {
    load(filter);
  }, [filter, load]);

  useEffect(() => {
    if (!saveMessage) return;
    const t = setTimeout(() => setSaveMessage(null), 4000);
    return () => clearTimeout(t);
  }, [saveMessage]);

  const handleDelete = async (b: HomepageBanner) => {
    if (!confirm(`Permanently delete "${b.name}"? The uploaded images are also removed.`)) return;
    try {
      await homepageBannersApi.remove(b.id);
      await Promise.all(
        [b.desktop_image, b.tablet_image, b.mobile_image]
          .filter((u): u is string => !!u)
          .map((u) => deleteImage(u, "homepageBanners").catch(() => {})),
      );
      await load();
      setSaveMessage("Banner permanently deleted.");
    } catch (err: any) {
      alert(err?.message || "Failed to delete banner.");
    }
  };

  const handleToggleStatus = async (b: HomepageBanner) => {
    const next: BannerStatus = b.status === "active" ? "archived" : "active";
    try {
      await homepageBannersApi.setStatus(b.id, next);
      await load();
      setSaveMessage(next === "active" ? "Banner activated." : "Banner archived.");
    } catch (err: any) {
      alert(err?.message || "Failed to update banner status.");
    }
  };

  const handleMove = async (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= items.length) return;
    const a = items[idx];
    const b = items[target];
    try {
      await Promise.all([
        homepageBannersApi.reorder(a.id, b.display_order),
        homepageBannersApi.reorder(b.id, a.display_order),
      ]);
      await load();
    } catch (err: any) {
      alert(err?.message || "Failed to reorder banners.");
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
        title="Homepage Banners"
        description="Manage the promotional banner carousel shown at the top of the homepage"
      />

      <BannerSizeGuide />

      {loadError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {loadError}
          <p className="mt-1 text-xs text-red-500">
            If the table is missing, run the migration supabase/migration-homepage-banners.sql in
            the Supabase SQL Editor.
          </p>
        </div>
      )}

      {saveMessage && (
        <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {saveMessage}
        </div>
      )}

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors min-h-[40px] ${
                filter === tab.key
                  ? "bg-white text-[#9C544D] shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
          className="rounded-lg bg-[#9C544D] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#7A3D3A] min-h-[44px]"
        >
          + Add Banner
        </button>
      </div>

      {formOpen && (
        <BannerForm
          banner={editing}
          positionSupported={positionSupported}
          objectPositionSupported={objectPositionSupported}
          onSave={async () => {
            setFormOpen(false);
            setEditing(null);
            await load();
            setSaveMessage("Banner saved.");
          }}
          onCancel={() => {
            setFormOpen(false);
            setEditing(null);
          }}
        />
      )}

      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="grid gap-3 p-3 sm:p-4 md:hidden">
          {items.length === 0 && !loadError ? (
            <div className="py-8 text-center text-gray-400 text-sm">
              No banners here yet. Add a banner to publish it to the homepage carousel.
            </div>
          ) : (
            items.map((b, idx) => (
              <div key={b.id} className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-white p-3">
                <div className="flex gap-3">
                  <img
                    src={b.desktop_image}
                    alt={b.name}
                    className="h-16 w-24 shrink-0 rounded-lg object-cover"
                    loading="lazy"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-800 truncate">{b.name}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                        b.button_enabled
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-gray-100 text-gray-500"
                      }`}>
                        {b.button_enabled ? `${b.button_text || "Button"} →` : "Off"}
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                        b.status === "active"
                          ? "border border-[#9C544D]/20 bg-[#fff4f5] text-[#9C544D]"
                          : "bg-gray-100 text-gray-500"
                      }`}>
                        {b.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleMove(idx, -1)}
                      disabled={idx === 0}
                      className="flex h-8 min-w-[36px] items-center justify-center rounded border border-gray-200 text-gray-500 hover:border-[#9C544D] hover:text-[#9C544D] disabled:opacity-30"
                    >
                      ↑
                    </button>
                    <span className="w-4 text-center text-xs text-gray-600">{b.display_order}</span>
                    <button
                      onClick={() => handleMove(idx, 1)}
                      disabled={idx === items.length - 1}
                      className="flex h-8 min-w-[36px] items-center justify-center rounded border border-gray-200 text-gray-500 hover:border-[#9C544D] hover:text-[#9C544D] disabled:opacity-30"
                    >
                      ↓
                    </button>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => { setEditing(b); setFormOpen(true); }}
                      className="flex h-9 min-w-[44px] items-center justify-center rounded-lg border border-gray-200 text-xs font-medium text-[#9C544D] hover:bg-gray-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleToggleStatus(b)}
                      className={`flex h-9 min-w-[44px] items-center justify-center rounded-lg border border-gray-200 text-xs font-medium hover:bg-gray-50 ${b.status === "active" ? "text-gray-500" : "text-emerald-600"}`}
                    >
                      {b.status === "active" ? "Archive" : "Restore"}
                    </button>
                    {b.status === "archived" && (
                      <button
                        onClick={() => handleDelete(b)}
                        className="flex h-9 min-w-[44px] items-center justify-center rounded-lg border border-gray-200 text-xs font-medium text-red-500 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                <th className="px-4 py-3">Preview</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Button</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && !loadError ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                    No banners here yet. Add a banner to publish it to the homepage carousel.
                  </td>
                </tr>
              ) : (
                items.map((b, idx) => (
                  <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <img
                        src={b.desktop_image}
                        alt={b.name}
                        className="h-14 w-28 rounded-lg object-cover"
                        loading="lazy"
                      />
                    </td>
                    <td className="max-w-[220px] truncate px-4 py-3 font-medium text-gray-800">
                      {b.name}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleMove(idx, -1)}
                          disabled={idx === 0}
                          aria-label="Move up"
                          className="rounded border border-gray-200 px-1.5 py-0.5 text-gray-500 hover:border-[#9C544D] hover:text-[#9C544D] disabled:opacity-30"
                        >
                          ↑
                        </button>
                        <span className="w-4 text-center text-xs text-gray-600">
                          {b.display_order}
                        </span>
                        <button
                          onClick={() => handleMove(idx, 1)}
                          disabled={idx === items.length - 1}
                          aria-label="Move down"
                          className="rounded border border-gray-200 px-1.5 py-0.5 text-gray-500 hover:border-[#9C544D] hover:text-[#9C544D] disabled:opacity-30"
                        >
                          ↓
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase ${
                          b.button_enabled
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {b.button_enabled ? `${b.button_text || "Button"} →` : "Off"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase ${
                          b.status === "active"
                            ? "border border-[#9C544D]/20 bg-[#fff4f5] text-[#9C544D]"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-x-3 gap-y-1">
                        <button
                          onClick={() => {
                            setEditing(b);
                            setFormOpen(true);
                          }}
                          className="text-xs text-[#9C544D] hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleToggleStatus(b)}
                          className={`text-xs hover:underline ${b.status === "active" ? "text-gray-500" : "text-emerald-600"}`}
                        >
                          {b.status === "active" ? "Archive" : "Restore"}
                        </button>
                        {b.status === "archived" && (
                          <button
                            onClick={() => handleDelete(b)}
                            className="text-xs text-red-500 hover:underline"
                          >
                            Delete
                          </button>
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
    </AdminLayout>
  );
}

function BannerSizeGuide() {
  const rows = [
    {
      label: "Desktop",
      dims: `${BANNER_GUIDE.desktop.width}×${BANNER_GUIDE.desktop.height} px (${BANNER_GUIDE.desktop.ratio})`,
      note: "Required — the fallback for all devices.",
    },
    {
      label: "Tablet",
      dims: `${BANNER_GUIDE.tablet.width}×${BANNER_GUIDE.tablet.height} px (${BANNER_GUIDE.tablet.ratio})`,
      note: "Optional — used on tablets; falls back to the desktop image.",
    },
    {
      label: "Mobile",
      dims: `${BANNER_GUIDE.mobile.width}×${BANNER_GUIDE.mobile.height} px (${BANNER_GUIDE.mobile.ratio}) — alt ${BANNER_GUIDE.mobileAlt.width}×${BANNER_GUIDE.mobileAlt.height} px`,
      note: "Recommended for mobile; falls back to the desktop image if missing.",
    },
  ];
  return (
    <div className="mb-5 rounded-xl border border-amber-200/70 bg-amber-50/70 p-4 text-sm">
      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-amber-800">
        Image Size Guide
      </p>
      <div className="grid gap-2 text-amber-900 sm:grid-cols-3">
        {rows.map((r) => (
          <div key={r.label} className="rounded-lg bg-white/70 p-3">
            <p className="font-semibold text-[#9C544D]">{r.label}</p>
            <p className="mt-0.5 text-xs font-medium">{r.dims}</p>
            <p className="mt-1 text-xs text-amber-800/80">{r.note}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 border-t border-amber-200/70 pt-2 text-xs font-bold uppercase tracking-wider text-amber-800">
        Banner Recommendations
      </p>
      <ul className="mt-1.5 list-disc space-y-1 pl-4 text-xs text-amber-800/90">
        <li>
          <span className="font-semibold">Desktop Banner:</span> 1920 × 700 px recommended (format:
          JPG / PNG / WebP).
        </li>
        <li>
          <span className="font-semibold">Mobile Banner:</span> 1080 × 1350 px recommended when
          separate mobile artwork is provided; otherwise the desktop image is used and cropped to
          the 4:5 mobile frame.
        </li>
        <li>
          <span className="font-semibold">Recommendation:</span> use high-resolution wide
          promotional artwork.
        </li>
        <li>
          <span className="font-semibold">Frames are fixed:</span> every slide is shown in the same
          frame (1920 × 700 desktop/tablet, 1080 × 1350 mobile). Uploaded images never change the
          banner height — they are cropped with object-fit: cover. The "Image Position (crop)"
          editor controls which part of the artwork stays visible.
        </li>
        <li>
          <span className="font-semibold">Important:</span> keep text, logos and products away from
          the extreme edges so they are not cropped on smaller screens — a single image will not
          look identical on every device.
        </li>
      </ul>
    </div>
  );
}

function BannerForm({
  banner,
  positionSupported,
  objectPositionSupported,
  onSave,
  onCancel,
}: {
  banner: HomepageBanner | null;
  positionSupported: boolean;
  objectPositionSupported: boolean;
  onSave: () => Promise<void>;
  onCancel: () => void;
}) {
  const [name, setName] = useState(banner?.name || "");
  const [altText, setAltText] = useState(banner?.alt_text || "");
  const [buttonEnabled, setButtonEnabled] = useState(banner?.button_enabled ?? false);
  const [buttonText, setButtonText] = useState(banner?.button_text || "");
  const [buttonUrl, setButtonUrl] = useState(banner?.button_url || "");
  const [displayOrder, setDisplayOrder] = useState(banner?.display_order ?? 0);
  const [positionD, setPositionD] = useState({
    x: banner?.button_position_x ?? BANNER_BUTTON_DEFAULT.x,
    y: banner?.button_position_y ?? BANNER_BUTTON_DEFAULT.y,
  });
  const [positionM, setPositionM] = useState({
    x: banner?.button_position_mobile_x ?? BANNER_BUTTON_DEFAULT.x,
    y: banner?.button_position_mobile_y ?? BANNER_BUTTON_DEFAULT.y,
  });
  const [positionDevice, setPositionDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [objectPos, setObjectPos] = useState({
    x: banner?.object_position_x ?? 50,
    y: banner?.object_position_y ?? 50,
  });
  const [desktopFile, setDesktopFile] = useState<File | null>(null);
  const [tabletFile, setTabletFile] = useState<File | null>(null);
  const [mobileFile, setMobileFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputsRef = useRef<{
    desktop?: HTMLInputElement | null;
    tablet?: HTMLInputElement | null;
    mobile?: HTMLInputElement | null;
  }>({});

  const handleFileError = (err: string | null, slot: "desktop" | "tablet" | "mobile") => {
    setError(err);
    if (err && inputsRef.current[slot]) inputsRef.current[slot]!.value = "";
  };

  const previews = {
    desktop: desktopFile ? URL.createObjectURL(desktopFile) : banner?.desktop_image || null,
    tablet: tabletFile ? URL.createObjectURL(tabletFile) : banner?.tablet_image || null,
    mobile: mobileFile ? URL.createObjectURL(mobileFile) : banner?.mobile_image || null,
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    if (!previews.desktop) {
      setError("The desktop image is required.");
      return;
    }
    if (buttonEnabled && !buttonText.trim()) {
      setError("Button text is required when the button is enabled.");
      return;
    }
    if (buttonEnabled && !buttonUrl.trim()) {
      setError("Button link is required when the button is enabled.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const uploadSlot = async (
        file: File | null,
        existing: string | null,
        folder: string,
      ): Promise<string | null> => {
        if (!file) return existing;
        const url = await uploadImage(file, "homepageBanners", folder);
        if (existing && existing !== url)
          await deleteImage(existing, "homepageBanners").catch(() => {});
        return url;
      };

      const desktopImage = (await uploadSlot(
        desktopFile,
        banner?.desktop_image || null,
        "desktop",
      ))!;
      const tabletImage = await uploadSlot(tabletFile, banner?.tablet_image || null, "tablet");
      const mobileImage = await uploadSlot(mobileFile, banner?.mobile_image || null, "mobile");

      const payload: any = {
        name: name.trim(),
        alt_text: altText.trim() || null,
        button_enabled: buttonEnabled,
        button_text: buttonText.trim() || null,
        button_url: buttonUrl.trim() || null,
        display_order: displayOrder,
        desktop_image: desktopImage,
        tablet_image: tabletImage,
        mobile_image: mobileImage,
      };
      if (positionSupported) {
        payload.button_position_x = Number(positionD.x.toFixed(1));
        payload.button_position_y = Number(positionD.y.toFixed(1));
        payload.button_position_mobile_x = Number(positionM.x.toFixed(1));
        payload.button_position_mobile_y = Number(positionM.y.toFixed(1));
      }
      if (objectPositionSupported) {
        payload.object_position_x = Number(objectPos.x.toFixed(1));
        payload.object_position_y = Number(objectPos.y.toFixed(1));
      }

      if (banner) {
        await homepageBannersApi.update(banner.id, payload);
      } else {
        await homepageBannersApi.create(payload);
      }
      await onSave();
    } catch (err: any) {
      setError(err?.message || "Failed to save banner.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#9C544D]";

  return (
    <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900">
          {banner ? `Edit: ${banner.name}` : "Add Banner"}
        </h3>
        <button
          onClick={onCancel}
          aria-label="Close form"
          className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Festive Gold Edit 2026"
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
            Alt Text
          </label>
          <input
            type="text"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            placeholder="e.g. Festive gold jewellery collection banner"
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
            Display Order
          </label>
          <input
            type="number"
            value={displayOrder}
            onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
            Show Button
          </label>
          <div className="flex h-9 items-center gap-2">
            <button
              type="button"
              onClick={() => setButtonEnabled((v) => !v)}
              className={`flex h-6 w-11 items-center rounded-full p-0.5 transition-colors ${buttonEnabled ? "bg-[#9C544D]" : "bg-gray-300"}`}
              aria-label="Toggle button"
            >
              <span
                className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${buttonEnabled ? "translate-x-5" : "translate-x-0"}`}
              />
            </button>
            <span className="text-xs text-gray-500">
              {buttonEnabled ? "Visible on banner" : "Hidden"}
            </span>
          </div>
        </div>
        {buttonEnabled && (
          <>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                Button Text
              </label>
              <input
                type="text"
                value={buttonText}
                onChange={(e) => setButtonText(e.target.value)}
                placeholder="e.g. Shop the Edit"
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                Button Link
              </label>
              <input
                type="text"
                value={buttonUrl}
                onChange={(e) => setButtonUrl(e.target.value)}
                placeholder="/shop or https://…"
                className={inputClass}
              />
            </div>
          </>
        )}
      </div>

      <p className="mt-2 text-[11px] text-gray-400">
        Button links that start with "/" use internal navigation; external links open in a new tab.
      </p>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <ImageSlot
          label="Desktop Image"
          required
          dims={`${BANNER_GUIDE.desktop.width}×${BANNER_GUIDE.desktop.height} px`}
          previewUrl={previews.desktop}
          onFile={(f) => {
            if (!f) {
              setDesktopFile(null);
              return;
            }
            const err = validateBannerFile(f);
            if (err) {
              handleFileError(err, "desktop");
              return;
            }
            setError(null);
            setDesktopFile(f);
          }}
          inputRef={(n) => (inputsRef.current.desktop = n)}
        />
        <ImageSlot
          label="Tablet Image"
          dims={`${BANNER_GUIDE.tablet.width}×${BANNER_GUIDE.tablet.height} px (optional)`}
          previewUrl={previews.tablet}
          onFile={(f) => {
            if (!f) {
              setTabletFile(null);
              return;
            }
            const err = validateBannerFile(f);
            if (err) {
              handleFileError(err, "tablet");
              return;
            }
            setError(null);
            setTabletFile(f);
          }}
          inputRef={(n) => (inputsRef.current.tablet = n)}
        />
        <ImageSlot
          label="Mobile Image"
          dims={`${BANNER_GUIDE.mobile.width}×${BANNER_GUIDE.mobile.height} px (optional)`}
          previewUrl={previews.mobile}
          onFile={(f) => {
            if (!f) {
              setMobileFile(null);
              return;
            }
            const err = validateBannerFile(f);
            if (err) {
              handleFileError(err, "mobile");
              return;
            }
            setError(null);
            setMobileFile(f);
          }}
          inputRef={(n) => (inputsRef.current.mobile = n)}
        />
      </div>

      {buttonEnabled && (
        <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50/60 p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Button Position
            </h4>
            <div className="flex gap-1 rounded-lg bg-gray-200/70 p-0.5">
              {(["desktop", "tablet", "mobile"] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setPositionDevice(d)}
                  className={`rounded-md px-2.5 py-1 text-[11px] font-semibold capitalize transition-colors ${
                    positionDevice === d
                      ? "bg-white text-[#9C544D] shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {!positionSupported && (
            <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
              Running the schema migration (supabase/migration-homepage-banner-positions.sql) in the
              Supabase SQL Editor enables saving drag-and-drop positions — until then, saved banners
              keep the default placement (X 50%, Y 82%).
            </div>
          )}

          {positionDevice === "mobile" ? (
            <ButtonPositionEditor
              previewUrl={previews.mobile || previews.desktop}
              aspect="1080/1350"
              pos={positionM}
              label={buttonText.trim() || "Shop Now"}
              onPosChange={setPositionM}
            />
          ) : (
            <ButtonPositionEditor
              previewUrl={
                positionDevice === "tablet" ? previews.tablet || previews.desktop : previews.desktop
              }
              aspect="1920/700"
              pos={positionD}
              label={buttonText.trim() || "Shop Now"}
              disabled={positionDevice === "tablet"}
              onPosChange={setPositionD}
            />
          )}

          <p className="mt-2 text-[11px] text-gray-400">
            Drag the button on the preview to reposition it. Desktop and tablet share one position;
            mobile has its own. Saved as percentages of the banner.
          </p>
        </div>
      )}

      {objectPositionSupported && (
        <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50/60 p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Image Position (crop)
            </h4>
            <span className="text-[10px] font-medium text-gray-500">
              X {objectPos.x.toFixed(0)}% · Y {objectPos.y.toFixed(0)}%
            </span>
          </div>
          <CropPositionEditor
            previewUrl={
              positionDevice === "mobile"
                ? previews.mobile || previews.desktop
                : positionDevice === "tablet"
                  ? previews.tablet || previews.desktop
                  : previews.desktop
            }
            aspect={positionDevice === "mobile" ? "1080/1350" : "1920/700"}
            pos={objectPos}
            onPosChange={setObjectPos}
          />
          <p className="mt-2 text-[11px] text-gray-400">
            The banner frame is fixed — wide, tall or square uploads are always cropped to the same
            frame. Drag the focus point to choose which part of the image stays visible. The live
            website uses this exact frame, so this preview matches it.
          </p>
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-5 flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 min-h-[44px]"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-[#9C544D] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#7A3D3A] disabled:opacity-50 min-h-[44px]"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
          {saving ? "Saving…" : banner ? "Save Changes" : "Add Banner"}
        </button>
      </div>
    </div>
  );
}

function ImageSlot({
  label,
  dims,
  required,
  previewUrl,
  onFile,
  inputRef,
}: {
  label: string;
  dims: string;
  required?: boolean;
  previewUrl: string | null;
  onFile: (f: File | null) => void;
  inputRef: (n: HTMLInputElement | null) => void;
}) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50/60 p-3">
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex h-40 w-full items-center justify-center overflow-hidden rounded-lg border border-dashed border-gray-300 bg-white">
        {previewUrl ? (
          <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-1 text-gray-400">
            <UploadCloud className="h-6 w-6" />
            <span className="text-xs">No image selected</span>
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(e) => onFile(e.target.files?.[0] || null)}
        className="mt-2 w-full text-xs text-gray-600 file:mr-2 file:rounded-lg file:border-0 file:bg-[#9C544D] file:px-3 file:py-1 file:text-xs file:font-semibold file:text-white file:hover:bg-[#7A3D3A]"
      />
      <p className="mt-1 text-[11px] text-gray-400">{dims} · JPG / PNG / WebP</p>
    </div>
  );
}

function ButtonPositionEditor({
  previewUrl,
  aspect,
  pos,
  label,
  disabled,
  onPosChange,
}: {
  previewUrl: string | null;
  aspect: string;
  pos: { x: number; y: number };
  label: string;
  disabled?: boolean;
  onPosChange: (p: { x: number; y: number }) => void;
}) {
  const areaRef = useRef<HTMLDivElement>(null);

  const compute = (clientX: number, clientY: number) => {
    const el = areaRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const x = Math.min(92, Math.max(8, ((clientX - r.left) / r.width) * 100));
    const y = Math.min(92, Math.max(8, ((clientY - r.top) / r.height) * 100));
    onPosChange({ x, y });
  };

  return (
    <div
      ref={areaRef}
      className={`relative w-full touch-none select-none overflow-hidden rounded-xl border border-gray-200 bg-white ${
        disabled ? "" : "cursor-move"
      }`}
      style={{ aspectRatio: aspect }}
      onPointerDown={(e) => {
        if (disabled) return;
        e.currentTarget.setPointerCapture(e.pointerId);
        compute(e.clientX, e.clientY);
      }}
      onPointerMove={(e) => {
        if (disabled) return;
        compute(e.clientX, e.clientY);
      }}
      onPointerUp={() => undefined}
      onPointerCancel={() => undefined}
    >
      {previewUrl ? (
        <img
          src={previewUrl}
          alt="Banner preview"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-[#f5efe8] text-xs text-gray-400">
          No image yet
        </div>
      )}
      <div
        className={`absolute z-10 flex items-center justify-center rounded-full bg-[#9C544D] px-3 py-1.5 text-[10px] font-semibold whitespace-nowrap text-white shadow-lg ${
          disabled ? "cursor-default opacity-70" : "cursor-grab active:cursor-grabbing"
        }`}
        style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: "translate(-50%, -50%)" }}
      >
        {label}
      </div>
      <span className="pointer-events-none absolute right-2 bottom-2 rounded bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white">
        {pos.x.toFixed(0)}% · {pos.y.toFixed(0)}%
      </span>
    </div>
  );
}

function CropPositionEditor({
  previewUrl,
  aspect,
  pos,
  onPosChange,
}: {
  previewUrl: string | null;
  aspect: string;
  pos: { x: number; y: number };
  onPosChange: (p: { x: number; y: number }) => void;
}) {
  const areaRef = useRef<HTMLDivElement>(null);

  const compute = (clientX: number, clientY: number) => {
    const el = areaRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const x = Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100));
    const y = Math.min(100, Math.max(0, ((clientY - r.top) / r.height) * 100));
    onPosChange({ x, y });
  };

  const slider = (axis: "x" | "y") => Math.round(axis === "x" ? pos.x : pos.y);

  return (
    <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_180px]">
      <div
        ref={areaRef}
        className="relative w-full touch-none select-none overflow-hidden rounded-xl border border-gray-200 bg-white cursor-crosshair"
        style={{ aspectRatio: aspect }}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          compute(e.clientX, e.clientY);
        }}
        onPointerMove={(e) => {
          compute(e.clientX, e.clientY);
        }}
        onPointerUp={() => undefined}
        onPointerCancel={() => undefined}
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Crop preview"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: `${pos.x}% ${pos.y}%` }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[#f5efe8] text-xs text-gray-400">
            No image yet
          </div>
        )}
        <div
          className="pointer-events-none absolute z-10 flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-[#9C544D]/85 shadow"
          style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
          aria-hidden="true"
        />
        <span className="pointer-events-none absolute right-2 bottom-2 rounded bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white">
          {slider("x")}% · {slider("y")}%
        </span>
      </div>
      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-[11px] font-semibold text-gray-600">
            Horizontal {slider("x")}%
          </label>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={slider("x")}
            onChange={(e) => onPosChange({ x: Number(e.target.value), y: pos.y })}
            className="w-full accent-[#9C544D]"
            aria-label="Horizontal image position"
          />
        </div>
        <div>
          <label className="mb-1 block text-[11px] font-semibold text-gray-600">
            Vertical {slider("y")}%
          </label>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={slider("y")}
            onChange={(e) => onPosChange({ x: pos.x, y: Number(e.target.value) })}
            className="w-full accent-[#9C544D]"
            aria-label="Vertical image position"
          />
        </div>
        <p className="text-[10px] leading-snug text-gray-400">
          50% · 50% centers the image. Use the sliders or drag the preview to focus the crop on the
          most important part of the artwork.
        </p>
      </div>
    </div>
  );
}
