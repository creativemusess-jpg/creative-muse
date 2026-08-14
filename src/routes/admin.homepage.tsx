import { useState, useEffect, useCallback, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout, AdminPageHeader, AdminLoading } from "@/components/admin/AdminLayout";
import { contentApi } from "@/lib/api/content";
import { uploadImage, deleteImage, validateHeroMediaFile } from "@/lib/api/upload";
import { productsApi } from "@/lib/api/products";
import { productFromDb } from "@/lib/products";
import type { HomepageSectionRow } from "@/lib/db/types";
import { Upload, X, Loader2 } from "lucide-react";

const CAROUSEL_SECTION_KEYS = ["new_arrivals", "premium_arrivals", "best_sellers"];

import { requireAdmin } from "@/lib/auth-guard";

export const Route = createFileRoute("/admin/homepage")({
  beforeLoad: requireAdmin,
  component: AdminHomepage,
});

interface SectionFormState {
  hero: Record<string, string>;
  carousel: Record<string, {
    autoScrollEnabled: boolean;
    scrollDirection: string;
    scrollSpeed: number;
    pauseOnHover: boolean;
    autoResumeEnabled: boolean;
    autoResumeDelaySeconds: number;
  }>;
}

interface BridalHeroCard {
  media_type: "image" | "video";
  media_url: string;
  poster?: string;
  title: string;
  product_id: string;
  sort_order: number;
  active: boolean;
}

function AdminHomepage() {
  const [sections, setSections] = useState<HomepageSectionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [formState, setFormState] = useState<SectionFormState>({
    hero: {},
    carousel: {},
  });

  useEffect(() => {
    contentApi.getAllSections().then((data) => {
      setSections(data);
      const hero = data.find((s) => s.section_key === "hero");
      if (hero) setFormState((prev) => ({ ...prev, hero: hero.content || {} }));
      const carousel: SectionFormState['carousel'] = {};
      for (const section of data) {
        if (CAROUSEL_SECTION_KEYS.includes(section.section_key)) {
          carousel[section.section_key] = {
            autoScrollEnabled: section.auto_scroll_enabled ?? false,
            scrollDirection: section.scroll_direction ?? 'left',
            scrollSpeed: section.scroll_speed ?? 30,
            pauseOnHover: section.pause_on_hover ?? true,
            autoResumeEnabled: section.auto_resume_enabled ?? true,
            autoResumeDelaySeconds: section.auto_resume_delay_seconds ?? 3,
          };
        }
      }
      setFormState((prev) => ({ ...prev, carousel }));
      const banner = data.find((s) => s.section_key === "featured_banner");
      if (banner?.content?.cta_images) {
        const imgs = banner.content.cta_images;
        setCtaImages([
          { src: imgs[0]?.src || "", alt: imgs[0]?.alt || "" },
          { src: imgs[1]?.src || "", alt: imgs[1]?.alt || "" },
          { src: imgs[2]?.src || "", alt: imgs[2]?.alt || "" },
        ]);
      }
      if (Array.isArray(banner?.content?.cards)) {
        setCards(banner.content.cards);
      }
      setLoading(false);
    });
    productsApi
      .list({ status: "active", per_page: 200 })
      .then((res) => {
        setProducts(
          (res.data || []).map((p) => {
            const mapped = productFromDb(p);
            return { slug: mapped.id, name: mapped.name };
          }),
        );
      })
      .catch(() => {});
  }, []);

  const [ctaImages, setCtaImages] = useState<{ src: string; alt: string }[]>([
    { src: "", alt: "" },
    { src: "", alt: "" },
    { src: "", alt: "" },
  ]);
  const [ctaUploading, setCtaUploading] = useState<number | null>(null);
  const ctaFileInputs = useRef<(HTMLInputElement | null)[]>([null, null, null]);

  const [cards, setCards] = useState<BridalHeroCard[]>([]);
  const [cardFormOpen, setCardFormOpen] = useState(false);
  const [editingCardIdx, setEditingCardIdx] = useState<number | null>(null);
  const [products, setProducts] = useState<{ slug: string; name: string }[]>([]);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!saveMessage) return;
    const t = setTimeout(() => setSaveMessage(null), 4000);
    return () => clearTimeout(t);
  }, [saveMessage]);

  const handleHeroFieldChange = useCallback((field: string, value: string) => {
    setFormState((prev) => ({
      ...prev,
      hero: { ...prev.hero, [field]: value },
    }));
  }, []);

  const handleCarouselFieldChange = useCallback(
    (sectionKey: string, field: string, value: boolean | string | number) => {
      setFormState((prev) => ({
        ...prev,
        carousel: {
          ...prev.carousel,
          [sectionKey]: { ...prev.carousel[sectionKey], [field]: value },
        },
      }));
    },
    [],
  );

  const handleHeroSave = async () => {
    try {
      await contentApi.updateSection("hero", { content: formState.hero });
      alert("Hero section updated");
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCarouselSave = async (sectionKey: string) => {
    const settings = formState.carousel[sectionKey];
    if (!settings) return;
    try {
      await contentApi.updateSection(sectionKey, {
        auto_scroll_enabled: settings.autoScrollEnabled,
        scroll_direction: settings.scrollDirection,
        scroll_speed: settings.scrollSpeed,
        pause_on_hover: settings.pauseOnHover,
        auto_resume_enabled: settings.autoResumeEnabled,
        auto_resume_delay_seconds: settings.autoResumeDelaySeconds,
      });
      setSections((prev) =>
        prev.map((s) =>
          s.section_key === sectionKey
            ? {
                ...s,
                auto_scroll_enabled: settings.autoScrollEnabled,
                scroll_direction: settings.scrollDirection,
                scroll_speed: settings.scrollSpeed,
                pause_on_hover: settings.pauseOnHover,
                auto_resume_enabled: settings.autoResumeEnabled,
                auto_resume_delay_seconds: settings.autoResumeDelaySeconds,
              }
            : s,
        ),
      );
      alert(`Auto-scroll settings saved for "${sectionKey.replace(/_/g, " ")}"`);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const toggleEdit = (key: string) => {
    setEditingSection((prev) => (prev === key ? null : key));
  };

  const handlePublishToggle = async (key: string, current: boolean) => {
    try {
      await contentApi.updateSection(key, { is_published: !current });
      setSections((prev) =>
        prev.map((s) =>
          s.section_key === key ? { ...s, is_published: !current } : s,
        ),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleCtaImageUpload = async (index: number) => {
    const file = ctaFileInputs.current[index]?.files?.[0];
    if (!file) return;
    setCtaUploading(index);
    try {
      const url = await uploadImage(file, "categories", "cta-images");
      setCtaImages((prev) => prev.map((img, i) => i === index ? { ...img, src: url } : img));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setCtaUploading(null);
    }
  };

  const saveBanner = async (nextCards: BridalHeroCard[]) => {
    const current = (sections.find((s) => s.section_key === "featured_banner")?.content ||
      {}) as Record<string, any>;
    const content: Record<string, any> = { cta_images: ctaImages, cards: nextCards };
    if (current.cta_videos) content.cta_videos = current.cta_videos;
    await contentApi.upsertSection("featured_banner", {
      title: "Featured Banner",
      content,
      is_published: true,
    });
    setCards(nextCards);
    const updated = await contentApi.getAllSections();
    setSections(updated);
  };

  const handleCtaSave = async () => {
    try {
      await saveBanner(cards);
      alert("CTA banner images saved");
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCardSave = async (card: BridalHeroCard) => {
    const next =
      editingCardIdx !== null
        ? cards.map((c, i) => (i === editingCardIdx ? card : c))
        : [...cards, card];
    try {
      await saveBanner(next);
      setCardFormOpen(false);
      setEditingCardIdx(null);
      setSaveMessage("Bridal hero card saved.");
    } catch (err: any) {
      throw new Error(err?.message || "Failed to save card.");
    }
  };

  const handleCardDelete = async (idx: number) => {
    const card = cards[idx];
    if (!card) return;
    if (!confirm(`Delete card "${card.title}"? The uploaded file will also be removed.`)) return;
    try {
      const bucket = card.media_type === "video" ? "categoryVideos" : "categories";
      await deleteImage(card.media_url, bucket).catch(() => {});
      const next = cards.filter((_, i) => i !== idx);
      await saveBanner(next);
      setSaveMessage("Bridal hero card deleted.");
    } catch (err: any) {
      alert(err?.message || "Failed to delete card.");
    }
  };

  const handleCardToggleActive = async (idx: number) => {
    const next = cards.map((c, i) => (i === idx ? { ...c, active: !c.active } : c));
    try {
      await saveBanner(next);
    } catch (err: any) {
      alert(err?.message || "Failed to update card.");
    }
  };

  const handleCardMove = async (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= cards.length) return;
    const next = [...cards];
    const tmp = next[idx].sort_order;
    next[idx] = { ...next[idx], sort_order: next[target].sort_order };
    next[target] = { ...next[target], sort_order: tmp };
    try {
      await saveBanner(next);
    } catch (err: any) {
      alert(err?.message || "Failed to reorder cards.");
    }
  };

  if (loading) return <AdminLayout><AdminLoading /></AdminLayout>;

  const currentCarouselSettings =
    editingSection && CAROUSEL_SECTION_KEYS.includes(editingSection)
      ? formState.carousel[editingSection]
      : null;

  return (
    <AdminLayout>
      <AdminPageHeader title="Homepage Editor" description="Manage homepage sections and content" />

      {saveMessage && (
        <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {saveMessage}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">Sections</h3>
          {(() => {
            const hasFeatured = sections.some((s) => s.section_key === "featured_banner");
            const allSections = hasFeatured
              ? sections
              : [
                  ...sections,
                  {
                    id: "featured_banner",
                    section_key: "featured_banner",
                    title: "Bridal CTA Images",
                    is_published: true,
                  } as HomepageSectionRow,
                ];
            return allSections.map((section) => {
            const isCarousel = CAROUSEL_SECTION_KEYS.includes(section.section_key);
            return (
              <div key={section.id} className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#1a1a2e]">
                      {section.section_key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </p>
                    <p className="text-xs text-gray-500">{section.title || "No title"}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handlePublishToggle(section.section_key, section.is_published)}
                      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase ${
                        section.is_published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {section.is_published ? "Published" : "Draft"}
                    </button>
                    {(section.section_key === "hero" || isCarousel || section.section_key === "featured_banner") && (
                      <button
                        onClick={() => toggleEdit(section.section_key)}
                        className="text-xs text-[#7A2533] hover:underline"
                      >
                        {editingSection === section.section_key ? "Close" : "Edit"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          }); })()}
        </div>

        {editingSection === "hero" && (
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-500">Hero Section</h3>
            <div className="space-y-4">
              {["eyebrow", "heading", "highlighted", "subheading", "description", "primary_cta", "secondary_cta", "certification_text"].map(
                (field) => (
                  <div key={field}>
                    <label className="mb-1 block text-xs font-medium text-gray-600 capitalize">
                      {field.replace(/_/g, " ")}
                    </label>
                    {field === "description" ? (
                      <textarea
                        value={formState.hero[field] || ""}
                        onChange={(e) => handleHeroFieldChange(field, e.target.value)}
                        rows={3}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
                      />
                    ) : (
                      <input
                        type="text"
                        value={formState.hero[field] || ""}
                        onChange={(e) => handleHeroFieldChange(field, e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
                      />
                    )}
                  </div>
                ),
              )}
              <button
                onClick={handleHeroSave}
                className="rounded-lg bg-[#1a1a2e] px-6 py-2 text-sm font-semibold text-white hover:bg-[#2d1b4e]"
              >
                Save Hero
              </button>
            </div>
          </div>
        )}

        {currentCarouselSettings && editingSection && editingSection !== "featured_banner" && (
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-500">
              Auto-Scroll Settings — {editingSection.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            </h3>
            <div className="space-y-5">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={currentCarouselSettings.autoScrollEnabled}
                  onChange={(e) =>
                    handleCarouselFieldChange(editingSection, "autoScrollEnabled", e.target.checked)
                  }
                  className="h-4 w-4 rounded border-gray-300 text-[#7A2533] focus:ring-[#7A2533]"
                />
                <span className="text-sm font-medium text-gray-700">Enable Auto-Scroll</span>
              </label>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Scroll Direction</label>
                <select
                  value={currentCarouselSettings.scrollDirection}
                  onChange={(e) =>
                    handleCarouselFieldChange(editingSection, "scrollDirection", e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
                >
                  <option value="left">Left → Right</option>
                  <option value="right">Right → Left</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">
                  Scroll Speed (seconds per full cycle)
                </label>
                <input
                  type="number"
                  min={3}
                  max={120}
                  value={currentCarouselSettings.scrollSpeed}
                  onChange={(e) =>
                    handleCarouselFieldChange(
                      editingSection,
                      "scrollSpeed",
                      Math.max(3, Number(e.target.value)),
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
                />
                <p className="mt-0.5 text-[11px] text-gray-400">
                  Lower = faster. Recommended: 20–40 seconds.
                </p>
              </div>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={currentCarouselSettings.pauseOnHover}
                  onChange={(e) =>
                    handleCarouselFieldChange(editingSection, "pauseOnHover", e.target.checked)
                  }
                  className="h-4 w-4 rounded border-gray-300 text-[#7A2533] focus:ring-[#7A2533]"
                />
                <span className="text-sm font-medium text-gray-700">Pause on Hover</span>
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={currentCarouselSettings.autoResumeEnabled}
                  onChange={(e) =>
                    handleCarouselFieldChange(editingSection, "autoResumeEnabled", e.target.checked)
                  }
                  className="h-4 w-4 rounded border-gray-300 text-[#7A2533] focus:ring-[#7A2533]"
                />
                <span className="text-sm font-medium text-gray-700">Auto-Resume after Interaction</span>
              </label>

              {currentCarouselSettings.autoResumeEnabled && (
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">
                    Resume Delay (seconds)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={currentCarouselSettings.autoResumeDelaySeconds}
                    onChange={(e) =>
                      handleCarouselFieldChange(
                        editingSection,
                        "autoResumeDelaySeconds",
                        Math.max(1, Number(e.target.value)),
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
                  />
                </div>
              )}

              <button
                onClick={() => handleCarouselSave(editingSection)}
                className="rounded-lg bg-[#1a1a2e] px-6 py-2 text-sm font-semibold text-white hover:bg-[#2d1b4e]"
              >
                Save Auto-Scroll Settings
              </button>
            </div>
          </div>
        )}

        {editingSection === "featured_banner" && (
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-500">Featured Banner — CTA Images</h3>
            <p className="mb-4 text-xs text-gray-500">Replace the three decorative images in the Bridal CTA banner. Leave empty to use default product images.</p>
            <div className="space-y-5">
              {ctaImages.map((img, i) => (
                <div key={i}>
                  <label className="mb-1 block text-xs font-medium text-gray-600">
                    CTA Image {i + 1} {i === 0 ? "(Bridal Necklace/Choker)" : i === 1 ? "(Bridal Earrings)" : "(Bridal Ring)"}
                  </label>
                  <div className="flex items-center gap-3">
                    {img.src ? (
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                        <img src={img.src} alt={img.alt || `CTA image ${i + 1}`} className="h-full w-full object-cover" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                        <button
                          onClick={() => setCtaImages((prev) => prev.map((x, j) => j === i ? { src: "", alt: "" } : x))}
                          className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100">
                        {ctaUploading === i ? <Loader2 className="h-5 w-5 animate-spin text-gray-400" /> : <Upload className="h-5 w-5 text-gray-400" />}
                        <input
                          ref={(el) => { ctaFileInputs.current[i] = el; }}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={() => handleCtaImageUpload(i)}
                        />
                      </label>
                    )}
                    <input
                      type="text"
                      value={img.alt}
                      onChange={(e) => setCtaImages((prev) => prev.map((x, j) => j === i ? { ...x, alt: e.target.value } : x))}
                      placeholder="Alt text for image"
                      className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#7A2533]"
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={handleCtaSave}
                className="rounded-lg bg-[#1a1a2e] px-6 py-2 text-sm font-semibold text-white hover:bg-[#2d1b4e]"
              >
                Save CTA Images
              </button>
            </div>

          <div className="mt-6 border-t border-gray-100 pt-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">
                  Bridal Hero Cards
                </h3>
                <p className="mt-0.5 text-xs text-gray-500">
                  Right-side carousel cards. Each card is an image or video linked to a product.
                  Only Active cards appear on the homepage, in sort order.
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingCardIdx(null);
                  setCardFormOpen(true);
                }}
                className="rounded-lg bg-[#7A2533] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#5F1C27]"
              >
                + Add Card
              </button>
            </div>

            {cardFormOpen && (
              <BridalCardForm
                card={editingCardIdx !== null ? cards[editingCardIdx] : null}
                products={products}
                onSave={handleCardSave}
                onCancel={() => {
                  setCardFormOpen(false);
                  setEditingCardIdx(null);
                }}
              />
            )}

            {cards.length === 0 ? (
              <p className="mt-4 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center text-sm text-gray-400">
                No cards yet. Add an image or video card — it will appear in the Bridal Collection
                carousel on the homepage.
              </p>
            ) : (
              <div className="mt-4 overflow-x-auto rounded-xl border border-gray-200 bg-white">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                      <th className="px-4 py-3">Media</th>
                      <th className="px-4 py-3">Title</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Linked Product</th>
                      <th className="px-4 py-3">Order</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cards.map((card, idx) => {
                      const linked =
                        products.find((p) => p.slug === card.product_id)?.name || card.product_id;
                      return (
                        <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="px-4 py-3">
                            {card.media_type === "video" ? (
                              <video
                                src={card.media_url}
                                poster={card.poster || undefined}
                                className="h-16 w-24 rounded-lg object-cover"
                                muted
                                loop
                                playsInline
                                preload="metadata"
                                onMouseEnter={(e) => (e.currentTarget as HTMLVideoElement).play()}
                                onMouseLeave={(e) => {
                                  (e.currentTarget as HTMLVideoElement).pause();
                                  (e.currentTarget as HTMLVideoElement).currentTime = 0;
                                }}
                              />
                            ) : (
                              <img
                                src={card.media_url}
                                alt={card.title}
                                className="h-16 w-24 rounded-lg bg-gray-50 object-contain"
                              />
                            )}
                          </td>
                          <td className="max-w-[180px] truncate px-4 py-3 font-medium text-gray-800">
                            {card.title}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase ${card.media_type === "video" ? "bg-blue-50 text-blue-700" : "bg-emerald-50 text-emerald-700"}`}
                            >
                              {card.media_type}
                            </span>
                          </td>
                          <td className="max-w-[180px] truncate px-4 py-3 text-gray-600">
                            {linked || "—"}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleCardMove(idx, -1)}
                                disabled={idx === 0}
                                aria-label="Move up"
                                className="rounded border border-gray-200 px-1.5 py-0.5 text-gray-500 hover:border-[#7A2533] hover:text-[#7A2533] disabled:opacity-30"
                              >
                                ↑
                              </button>
                              <span className="w-4 text-center text-xs text-gray-600">
                                {card.sort_order}
                              </span>
                              <button
                                onClick={() => handleCardMove(idx, 1)}
                                disabled={idx === cards.length - 1}
                                aria-label="Move down"
                                className="rounded border border-gray-200 px-1.5 py-0.5 text-gray-500 hover:border-[#7A2533] hover:text-[#7A2533] disabled:opacity-30"
                              >
                                ↓
                              </button>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase ${card.active ? "border border-[#7A2533]/20 bg-[#fff4f5] text-[#7A2533]" : "bg-gray-100 text-gray-500"}`}
                            >
                              {card.active ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setEditingCardIdx(idx);
                                  setCardFormOpen(true);
                                }}
                                className="text-xs text-[#7A2533] hover:underline"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleCardToggleActive(idx)}
                                className="text-xs text-gray-500 hover:underline"
                              >
                                {card.active ? "Deactivate" : "Activate"}
                              </button>
                              <button
                                onClick={() => handleCardDelete(idx)}
                                className="text-xs text-red-500 hover:underline"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

function inspectBridalMedia(
  file: File,
  kind: "image" | "video",
): Promise<{ width: number; height: number; duration: number | null }> {
  return new Promise((resolve, reject) => {
    if (kind === "image") {
      const img = new Image();
      img.onload = () =>
        resolve({ width: img.naturalWidth, height: img.naturalHeight, duration: null });
      img.onerror = () => reject(new Error("Could not read the image file."));
      img.src = URL.createObjectURL(file);
    } else {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () =>
        resolve({
          width: video.videoWidth,
          height: video.videoHeight,
          duration: Number.isFinite(video.duration) ? video.duration : null,
        });
      video.onerror = () => reject(new Error("Could not read the video file."));
      video.src = URL.createObjectURL(file);
    }
  });
}

function formatBridalDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function ratioLabel(w: number, h: number): string {
  if (!w || !h) return "";
  return w >= h ? `${(w / h).toFixed(2)}:1` : `1:${(h / w).toFixed(2)}`;
}

function BridalCardForm({
  card,
  products,
  onSave,
  onCancel,
}: {
  card: BridalHeroCard | null;
  products: { slug: string; name: string }[];
  onSave: (card: BridalHeroCard) => Promise<void>;
  onCancel: () => void;
}) {
  const [mediaType, setMediaType] = useState<"image" | "video">(card?.media_type || "image");
  const [title, setTitle] = useState(card?.title || "");
  const [productId, setProductId] = useState(card?.product_id || "");
  const [sortOrder, setSortOrder] = useState(card?.sort_order ?? 1);
  const [active, setActive] = useState(card?.active ?? true);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(card?.media_url || null);
  const [mediaInfo, setMediaInfo] = useState<{
    width: number;
    height: number;
    duration: number | null;
  } | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const switchType = (t: "image" | "video") => {
    setMediaType(t);
    setFile(null);
    setMediaInfo(null);
    setError(null);
    setPreviewUrl(card?.media_url || null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFile = async (f: File | null) => {
    setError(null);
    if (!f) {
      setFile(null);
      setMediaInfo(null);
      setPreviewUrl(card?.media_url || null);
      return;
    }
    const validationError = validateHeroMediaFile(f, mediaType);
    if (validationError) {
      setError(validationError);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    try {
      setMediaInfo(await inspectBridalMedia(f, mediaType));
    } catch {
      setMediaInfo(null);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setError("Card title is required.");
      return;
    }
    if (!productId) {
      setError("Select a linked product.");
      return;
    }
    if (!previewUrl) {
      setError("Choose an image or video first.");
      return;
    }
    if (card && !file && card.media_type !== mediaType) {
      setError(`Choose a new ${mediaType} file to change the media type.`);
      return;
    }
    setSaving(true);
    setError(null);
    try {
      let mediaUrl = card?.media_url || "";
      if (file) {
        const bucket = mediaType === "video" ? "categoryVideos" : "categories";
        const uploaded = await uploadImage(file, bucket, "bridal-hero");
        mediaUrl = uploaded;
        if (card?.media_url && card.media_url !== uploaded) {
          await deleteImage(
            card.media_url,
            card.media_type === "video" ? "categoryVideos" : "categories",
          ).catch(() => {});
        }
      }
      await onSave({
        media_type: mediaType,
        media_url: mediaUrl,
        poster: card?.poster,
        title: title.trim(),
        product_id: productId,
        sort_order: sortOrder,
        active,
      });
    } catch (err: any) {
      setError(err?.message || "Failed to save card.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#7A2533]";

  return (
    <div className="mt-4 rounded-xl border border-gray-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="text-base font-semibold text-gray-900">
          {card ? `Edit Card: ${card.title}` : "Add Bridal Hero Card"}
        </h4>
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
            Media Type
          </label>
          <div className="flex gap-2">
            {(["image", "video"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => switchType(t)}
                className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium capitalize transition-colors ${
                  mediaType === t
                    ? "border-[#7A2533] bg-[#7A2533]/5 text-[#7A2533]"
                    : "border-gray-300 text-gray-500 hover:border-gray-400"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
            Card Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Pearl Earrings"
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
            Linked Product
          </label>
          <select
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className={inputClass}
          >
            <option value="">Select Product</option>
            {products.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
              Sort Order
            </label>
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
              Active
            </label>
            <div className="flex h-9 items-center gap-2">
              <button
                type="button"
                onClick={() => setActive((v) => !v)}
                className={`flex h-6 w-11 items-center rounded-full p-0.5 transition-colors ${active ? "bg-[#7A2533]" : "bg-gray-300"}`}
                aria-label="Toggle active"
              >
                <span
                  className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${active ? "translate-x-5" : "translate-x-0"}`}
                />
              </button>
              <span className="text-xs text-gray-500">{active ? "Visible" : "Hidden"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
          {mediaType === "image" ? "Image" : "Video"}
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex h-40 w-full shrink-0 items-center justify-center overflow-hidden rounded-lg border border-dashed border-gray-300 bg-gray-50 sm:w-56">
            {previewUrl ? (
              mediaType === "video" ? (
                <video
                  src={previewUrl}
                  className="h-full w-full object-contain"
                  muted
                  loop
                  autoPlay
                  playsInline
                />
              ) : (
                <img src={previewUrl} alt="Preview" className="h-full w-full object-contain" />
              )
            ) : (
              <div className="flex flex-col items-center gap-1 text-gray-400">
                <Upload className="h-6 w-6" />
                <span className="text-xs">No {mediaType} selected</span>
              </div>
            )}
          </div>
          <div className="flex flex-1 flex-col justify-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept={
                mediaType === "image"
                  ? "image/jpeg,image/png,image/webp"
                  : "video/mp4,video/webm"
              }
              onChange={(e) => handleFile(e.target.files?.[0] || null)}
              className="text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-[#7A2533] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white file:hover:bg-[#5F1C27]"
            />
            <p className="text-xs text-gray-400">
              {mediaType === "image"
                ? "JPG, JPEG, PNG or WEBP, up to 5 MB."
                : "MP4 or WebM, up to 50 MB. Autoplay is muted and looping."}{" "}
              {card?.media_url && !file
                ? "Current media is kept until you choose a new file."
                : "Dimensions and duration are detected automatically."}
            </p>
            {mediaInfo && (
              <div className="rounded-lg bg-gray-50 p-2.5 text-xs text-gray-600">
                {mediaInfo.width > 0 && mediaInfo.height > 0 && (
                  <p>
                    Dimensions: {mediaInfo.width} × {mediaInfo.height} px · Ratio{" "}
                    {ratioLabel(mediaInfo.width, mediaInfo.height)}
                  </p>
                )}
                {mediaType === "video" && mediaInfo.duration !== null && (
                  <p>Duration: {formatBridalDuration(mediaInfo.duration)}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-5 flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-[#7A2533] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#5F1C27] disabled:opacity-50"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {saving ? "Saving…" : "Save Card"}
        </button>
      </div>
    </div>
  );
}
