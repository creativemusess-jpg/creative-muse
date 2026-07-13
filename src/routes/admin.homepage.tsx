import { useState, useEffect, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout, AdminPageHeader, AdminLoading } from "@/components/admin/AdminLayout";
import { contentApi } from "@/lib/api/content";
import type { HomepageSectionRow } from "@/lib/db/types";

const CAROUSEL_SECTION_KEYS = ["new_arrivals", "premium_arrivals", "best_sellers"];

export const Route = createFileRoute("/admin/homepage")({
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
      setLoading(false);
    });
  }, []);

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

  if (loading) return <AdminLayout><AdminLoading /></AdminLayout>;

  const currentCarouselSettings =
    editingSection && CAROUSEL_SECTION_KEYS.includes(editingSection)
      ? formState.carousel[editingSection]
      : null;

  return (
    <AdminLayout>
      <AdminPageHeader title="Homepage Editor" description="Manage homepage sections and content" />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">Sections</h3>
          {sections.map((section) => {
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
                    {(section.section_key === "hero" || isCarousel) && (
                      <button
                        onClick={() => toggleEdit(section.section_key)}
                        className="text-xs text-[#c9a96e] hover:underline"
                      >
                        {editingSection === section.section_key ? "Close" : "Edit"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
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
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#c9a96e]"
                      />
                    ) : (
                      <input
                        type="text"
                        value={formState.hero[field] || ""}
                        onChange={(e) => handleHeroFieldChange(field, e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#c9a96e]"
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

        {currentCarouselSettings && editingSection && (
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
                  className="h-4 w-4 rounded border-gray-300 text-[#c9a96e] focus:ring-[#c9a96e]"
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
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#c9a96e]"
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
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#c9a96e]"
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
                  className="h-4 w-4 rounded border-gray-300 text-[#c9a96e] focus:ring-[#c9a96e]"
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
                  className="h-4 w-4 rounded border-gray-300 text-[#c9a96e] focus:ring-[#c9a96e]"
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
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#c9a96e]"
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
      </div>
    </AdminLayout>
  );
}
