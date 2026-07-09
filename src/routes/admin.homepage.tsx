import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout, AdminPageHeader, AdminLoading } from "@/components/admin/AdminLayout";
import { contentApi } from "@/lib/api/content";
import type { HomepageSectionRow } from "@/lib/db/types";

export const Route = createFileRoute("/admin/homepage")({
  component: AdminHomepage,
});

function AdminHomepage() {
  const [sections, setSections] = useState<HomepageSectionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [heroContent, setHeroContent] = useState<any>(null);

  useEffect(() => {
    contentApi.getAllSections().then((data) => {
      setSections(data);
      const hero = data.find((s) => s.section_key === "hero");
      if (hero) setHeroContent(hero.content);
      setLoading(false);
    });
  }, []);

  const handleHeroSave = async () => {
    if (!heroContent) return;
    try {
      await contentApi.updateSection("hero", { content: heroContent });
      alert("Hero section updated");
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handlePublishToggle = async (key: string, current: boolean) => {
    try {
      await contentApi.updateSection(key, { is_published: !current });
      setSections((prev) => prev.map((s) => s.section_key === key ? { ...s, is_published: !current } : s));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <AdminLayout><AdminLoading /></AdminLayout>;

  return (
    <AdminLayout>
      <AdminPageHeader title="Homepage Editor" description="Manage homepage sections and content" />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Sections list */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">Sections</h3>
          {sections.map((section) => (
            <div key={section.id} className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-[#1a1a2e]">{section.section_key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}</p>
                  <p className="text-xs text-gray-500">{section.title || "No title"}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handlePublishToggle(section.section_key, section.is_published)}
                    className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase ${section.is_published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                  >
                    {section.is_published ? "Published" : "Draft"}
                  </button>
                  {section.section_key === "hero" && (
                    <button onClick={() => setEditingSection(editingSection === "hero" ? null : "hero")} className="text-xs text-[#c9a96e] hover:underline">
                      Edit
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Hero editor */}
        {editingSection === "hero" && heroContent && (
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-500">Hero Section</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Eyebrow</label>
                <input
                  type="text"
                  value={heroContent.eyebrow || ""}
                  onChange={(e) => setHeroContent({ ...heroContent, eyebrow: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#c9a96e]"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Heading</label>
                <input
                  type="text"
                  value={heroContent.heading || ""}
                  onChange={(e) => setHeroContent({ ...heroContent, heading: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#c9a96e]"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Highlighted Word</label>
                <input
                  type="text"
                  value={heroContent.highlighted || ""}
                  onChange={(e) => setHeroContent({ ...heroContent, highlighted: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#c9a96e]"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Subheading</label>
                <input
                  type="text"
                  value={heroContent.subheading || ""}
                  onChange={(e) => setHeroContent({ ...heroContent, subheading: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#c9a96e]"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Description</label>
                <textarea
                  value={heroContent.description || ""}
                  onChange={(e) => setHeroContent({ ...heroContent, description: e.target.value })}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#c9a96e]"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Primary CTA</label>
                <input
                  type="text"
                  value={heroContent.primary_cta || ""}
                  onChange={(e) => setHeroContent({ ...heroContent, primary_cta: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#c9a96e]"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Secondary CTA</label>
                <input
                  type="text"
                  value={heroContent.secondary_cta || ""}
                  onChange={(e) => setHeroContent({ ...heroContent, secondary_cta: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#c9a96e]"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Certification Text</label>
                <input
                  type="text"
                  value={heroContent.certification_text || ""}
                  onChange={(e) => setHeroContent({ ...heroContent, certification_text: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#c9a96e]"
                />
              </div>
              <button
                onClick={handleHeroSave}
                className="rounded-lg bg-[#1a1a2e] px-6 py-2 text-sm font-semibold text-white hover:bg-[#2d1b4e]"
              >
                Save Hero
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
